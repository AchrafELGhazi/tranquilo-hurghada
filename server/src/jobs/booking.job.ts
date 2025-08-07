// import cron from 'node-cron';
// import prisma from '../config/database';
// import logger from '../config/logger';
// import { BookingStatus } from '@prisma/client';
// import { sendBookingNotificationEmails } from '../utils/emailService';

// // Auto-complete bookings after checkout date
// export const autoCompleteBookings = cron.schedule('0 2 * * *', async () => {
//     try {
//         logger.info('Running auto-complete bookings job');

//         const now = new Date();
//         const bookingsToComplete = await prisma.booking.findMany({
//             where: {
//                 status: BookingStatus.CONFIRMED,
//                 checkOut: {
//                     lt: now
//                 }
//             },
//             include: {
//                 villa: {
//                     include: {
//                         owner: {
//                             select: { id: true, fullName: true, email: true, role: true }
//                         }
//                     }
//                 },
//                 guest: {
//                     select: { id: true, fullName: true, email: true }
//                 }
//             }
//         });

//         if (bookingsToComplete.length > 0) {
//             // Update bookings to completed status
//             await prisma.booking.updateMany({
//                 where: {
//                     id: {
//                         in: bookingsToComplete.map(b => b.id)
//                     }
//                 },
//                 data: {
//                     status: BookingStatus.COMPLETED,
//                     completedAt: now
//                 }
//             });

//             logger.info(`Auto-completed ${bookingsToComplete.length} bookings`);

//             // Send completion notifications (optional)
//             for (const booking of bookingsToComplete) {
//                 try {
//                     await sendBookingNotificationEmails({
//                         booking: { ...booking, status: 'COMPLETED', completedAt: now },
//                         type: 'BOOKING_COMPLETED' as any
//                     });
//                 } catch (emailError) {
//                     logger.error(`Failed to send completion email for booking ${booking.id}:`, emailError);
//                 }
//             }
//         }
//     } catch (error) {
//         logger.error('Auto-complete bookings job failed:', error);
//     }
// }, {
//     scheduled: false // Start manually
// });

// // Send reminder emails for upcoming check-ins
// export const sendCheckInReminders = cron.schedule('0 8 * * *', async () => {
//     try {
//         logger.info('Running check-in reminders job');

//         const tomorrow = new Date();
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         tomorrow.setHours(0, 0, 0, 0);

//         const dayAfterTomorrow = new Date(tomorrow);
//         dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

//         const upcomingBookings = await prisma.booking.findMany({
//             where: {
//                 status: BookingStatus.CONFIRMED,
//                 checkIn: {
//                     gte: tomorrow,
//                     lt: dayAfterTomorrow
//                 }
//             },
//             include: {
//                 villa: {
//                     include: {
//                         owner: {
//                             select: { id: true, fullName: true, email: true, role: true }
//                         }
//                     }
//                 },
//                 guest: {
//                     select: { id: true, fullName: true, email: true }
//                 }
//             }
//         });

//         for (const booking of upcomingBookings) {
//             try {
//                 // Send reminder to guest
//                 await sendCheckInReminderEmail(booking);
//                 logger.info(`Check-in reminder sent for booking ${booking.id}`);
//             } catch (emailError) {
//                 logger.error(`Failed to send check-in reminder for booking ${booking.id}:`, emailError);
//             }
//         }
//     } catch (error) {
//         logger.error('Check-in reminders job failed:', error);
//     }
// }, {
//     scheduled: false
// });

// // Clean up old rejected/cancelled bookings (optional - for data cleanup)
// export const cleanupOldBookings = cron.schedule('0 3 0 0 0', async () => { // Weekly on Sunday
//     try {
//         logger.info('Running booking cleanup job');

//         const sixMonthsAgo = new Date();
//         sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//         const deletedCount = await prisma.booking.deleteMany({
//             where: {
//                 status: {
//                     in: [BookingStatus.REJECTED, BookingStatus.CANCELLED]
//                 },
//                 updatedAt: {
//                     lt: sixMonthsAgo
//                 }
//             }
//         });

//         logger.info(`Cleaned up ${deletedCount.count} old booking records`);
//     } catch (error) {
//         logger.error('Booking cleanup job failed:', error);
//     }
// }, {
//     scheduled: false
// });

// // Send pending booking reminders to hosts
// export const sendPendingBookingReminders = cron.schedule('0 10,16 * * *', async () => {
//     try {
//         logger.info('Running pending booking reminders job');

//         const twoDaysAgo = new Date();
//         twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

//         const pendingBookings = await prisma.booking.findMany({
//             where: {
//                 status: BookingStatus.PENDING,
//                 createdAt: {
//                     lt: twoDaysAgo
//                 }
//             },
//             include: {
//                 villa: {
//                     include: {
//                         owner: {
//                             select: { id: true, fullName: true, email: true, role: true }
//                         }
//                     }
//                 },
//                 guest: {
//                     select: { id: true, fullName: true, email: true }
//                 }
//             }
//         });

//         for (const booking of pendingBookings) {
//             try {
//                 await sendPendingReminderEmail(booking);
//                 logger.info(`Pending booking reminder sent for booking ${booking.id}`);
//             } catch (emailError) {
//                 logger.error(`Failed to send pending reminder for booking ${booking.id}:`, emailError);
//             }
//         }
//     } catch (error) {
//         logger.error('Pending booking reminders job failed:', error);
//     }
// }, {
//     scheduled: false
// });

// // Helper function to send check-in reminder email
// const sendCheckInReminderEmail = async (booking: any) => {
//     const nodemailer = require('nodemailer');
//     const { env } = require('../config/env');

//     const transporter = nodemailer.createTransporter({
//         host: env.SMTP_HOST,
//         port: env.SMTP_PORT,
//         secure: env.SMTP_SECURE,
//         auth: {
//             user: env.SMTP_USER,
//             pass: env.SMTP_PASS
//         }
//     });

//     const checkInDate = booking.checkIn.toLocaleDateString('en-US', {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     });

//     const html = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <title>Check-in Reminder</title>
//             <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                 .header { background: #C75D2C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//                 .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
//                 .highlight { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Check-in Reminder</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${booking.guest.fullName}!</h2>
//                     <div class="highlight">
//                         <p><strong>Your check-in is tomorrow!</strong></p>
//                         <p>Don't forget about your upcoming stay at <strong>${booking.villa.title}</strong>.</p>
//                     </div>
//                     <p><strong>Check-in Date:</strong> ${checkInDate}</p>
//                     <p><strong>Villa:</strong> ${booking.villa.title}</p>
//                     <p><strong>Location:</strong> ${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</p>
//                     <p><strong>Booking ID:</strong> ${booking.id}</p>
                    
//                     <p>If you have any questions or need to make changes, please contact us as soon as possible.</p>
                    
//                     <p>We look forward to your stay!</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;

//     await transporter.sendMail({
//         from: env.SMTP_FROM || 'noreply@villabooking.com',
//         to: booking.guest.email,
//         subject: `Check-in Reminder - ${booking.villa.title}`,
//         html
//     });
// };

// // Helper function to send pending booking reminder to hosts
// const sendPendingReminderEmail = async (booking: any) => {
//     const nodemailer = require('nodemailer');
//     const { env } = require('../config/env');

//     const transporter = nodemailer.createTransporter({
//         host: env.SMTP_HOST,
//         port: env.SMTP_PORT,
//         secure: env.SMTP_SECURE,
//         auth: {
//             user: env.SMTP_USER,
//             pass: env.SMTP_PASS
//         }
//     });

//     const html = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//             <meta charset="utf-8">
//             <title>Pending Booking Reminder</title>
//             <style>
//                 body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
//                 .container { max-width: 600px; margin: 0 auto; padding: 20px; }
//                 .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
//                 .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
//                 .urgent { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; border-radius: 8px; margin: 20px 0; }
//             </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <h1>Pending Booking Reminder</h1>
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${booking.villa.owner.fullName}!</h2>
//                     <div class="urgent">
//                         <p><strong>You have a pending booking request that needs attention!</strong></p>
//                         <p>This booking has been pending for 2 days. Please review and respond promptly.</p>
//                     </div>
//                     <p><strong>Booking ID:</strong> ${booking.id}</p>
//                     <p><strong>Villa:</strong> ${booking.villa.title}</p>
//                     <p><strong>Guest:</strong> ${booking.guest.fullName} (${booking.guest.email})</p>
//                     <p><strong>Dates:</strong> ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}</p>
//                     <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
                    
//                     <p>Please log in to your account to confirm or reject this booking request.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;

//     await transporter.sendMail({
//         from: env.SMTP_FROM || 'noreply@villabooking.com',
//         to: booking.villa.owner.email,
//         subject: `[URGENT] Pending Booking Reminder - ${booking.villa.title}`,
//         html
//     });
// };

// // Start all cron jobs
// export const startCronJobs = () => {
//     if (process.env.NODE_ENV !== 'test') {
//         autoCompleteBookings.start();
//         sendCheckInReminders.start();
//         sendPendingBookingReminders.start();

//         // Only run cleanup in production
//         if (process.env.NODE_ENV === 'production') {
//             cleanupOldBookings.start();
//         }

//         logger.info('🕐 Cron jobs started successfully');
//     }
// };

// // Stop all cron jobs (useful for testing or graceful shutdown)
// export const stopCronJobs = () => {
//     autoCompleteBookings.stop();
//     sendCheckInReminders.stop();
//     sendPendingBookingReminders.stop();
//     cleanupOldBookings.stop();

//     logger.info('🛑 Cron jobs stopped');
// };

// export default {
//     autoCompleteBookings,
//     sendCheckInReminders,
//     sendPendingBookingReminders,
//     cleanupOldBookings,
//     startCronJobs,
//     stopCronJobs
// };