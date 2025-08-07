import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';
import { formatBookingDateRange, getDaysBetweenDates } from './booking.utils';
import prisma from '../config/database';

interface BookingEmailData {
    booking: {
        id: string;
        checkIn: Date;
        checkOut: Date;
        totalGuests: number;
        totalPrice: any;
        notes?: string | null;
        status: string;
        confirmedAt?: Date | null;
        cancelledAt?: Date | null;
        rejectedAt?: Date | null;
        cancellationReason?: string | null;
        rejectionReason?: string | null;
        villa: {
            id: string;
            title: string;
            address: string;
            city: string;
            country: string;
            owner: {
                id: string;
                fullName: string;
                email: string;
                role: string;
            };
        };
        guest: {
            id: string;
            fullName: string;
            email: string;
        };
    };
    type: 'NEW_BOOKING' | 'BOOKING_CONFIRMED' | 'BOOKING_REJECTED' | 'BOOKING_CANCELLED';
}

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: env.SMTP_HOST || 'localhost',
        port: env.SMTP_PORT || 587,
        secure: env.SMTP_SECURE || false,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });
};

const generateBookingEmailTemplate = (data: BookingEmailData): { subject: string; html: string } => {
    const { booking, type } = data;
    const dateRange = formatBookingDateRange(booking.checkIn, booking.checkOut);
    const nights = getDaysBetweenDates(booking.checkIn, booking.checkOut);

    const baseStyles = `
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C75D2C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #C75D2C; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; display: inline-block; min-width: 120px; }
            .value { color: #666; }
            .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-confirmed { background: #d1fae5; color: #065f46; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .status-rejected { background: #fce7f3; color: #be185d; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    `;

    let subject = '';
    let statusClass = '';
    let mainMessage = '';

    switch (type) {
        case 'NEW_BOOKING':
            subject = `New Booking Request - ${booking.villa.title}`;
            statusClass = 'status-pending';
            mainMessage = `
                <p><strong>A new booking request has been received!</strong></p>
                <p>Guest <strong>${booking.guest.fullName}</strong> has requested to book your villa.</p>
                <p>Please review the booking details below and confirm or reject the request.</p>
            `;
            break;
        case 'BOOKING_CONFIRMED':
            subject = `Booking Confirmed - ${booking.villa.title}`;
            statusClass = 'status-confirmed';
            mainMessage = `
                <p><strong>Great news! Your booking has been confirmed!</strong></p>
                <p>Your reservation at <strong>${booking.villa.title}</strong> is now confirmed.</p>
                <p>We look forward to your stay!</p>
            `;
            break;
        case 'BOOKING_REJECTED':
            subject = `Booking Request Declined - ${booking.villa.title}`;
            statusClass = 'status-rejected';
            mainMessage = `
                <p><strong>We're sorry, but your booking request has been declined.</strong></p>
                <p>The host was unable to accommodate your request for <strong>${booking.villa.title}</strong>.</p>
                ${booking.rejectionReason ? `<p><strong>Reason:</strong> ${booking.rejectionReason}</p>` : ''}
                <p>Please feel free to browse other available villas or try different dates.</p>
            `;
            break;
        case 'BOOKING_CANCELLED':
            subject = `Booking Cancelled - ${booking.villa.title}`;
            statusClass = 'status-cancelled';
            mainMessage = `
                <p><strong>Your booking has been cancelled.</strong></p>
                <p>Your reservation at <strong>${booking.villa.title}</strong> has been cancelled.</p>
                ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
            `;
            break;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            ${baseStyles}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Villa Booking System</h1>
                </div>
                
                <div class="content">
                    ${mainMessage}
                    
                    <div class="booking-details">
                        <h3>Booking Details</h3>
                        <div class="detail-row">
                            <span class="label">Booking ID:</span>
                            <span class="value">${booking.id}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Villa:</span>
                            <span class="value">${booking.villa.title}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Location:</span>
                            <span class="value">${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Guest:</span>
                            <span class="value">${booking.guest.fullName} (${booking.guest.email})</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Dates:</span>
                            <span class="value">${dateRange} (${nights} night${nights > 1 ? 's' : ''})</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Guests:</span>
                            <span class="value">${booking.totalGuests}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Total Price:</span>
                            <span class="value">$${booking.totalPrice}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="status ${statusClass}">${booking.status}</span>
                        </div>
                        ${booking.notes ? `
                        <div class="detail-row">
                            <span class="label">Notes:</span>
                            <span class="value">${booking.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message from Villa Booking System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return { subject, html };
};

export const sendBookingNotificationEmails = async (data: BookingEmailData): Promise<void> => {
    try {
        const transporter = createTransporter();
        const { subject, html } = generateBookingEmailTemplate(data);

        const emailPromises: Promise<any>[] = [];

        // Send email to guest
        emailPromises.push(
            transporter.sendMail({
                from: env.SMTP_FROM || 'noreply@villabooking.com',
                to: data.booking.guest.email,
                subject,
                html
            })
        );

        // Send email to villa owner (if not the guest)
        if (data.booking.villa.owner.email !== data.booking.guest.email) {
            emailPromises.push(
                transporter.sendMail({
                    from: env.SMTP_FROM || 'noreply@villabooking.com',
                    to: data.booking.villa.owner.email,
                    subject,
                    html
                })
            );
        }

        // Send email to all admins
        const admins = await prisma.user.findMany({
            where: { role: 'ADMIN', isActive: true },
            select: { email: true }
        });

        admins.forEach(admin => {
            emailPromises.push(
                transporter.sendMail({
                    from: env.SMTP_FROM || 'noreply@villabooking.com',
                    to: admin.email,
                    subject: `[ADMIN] ${subject}`,
                    html
                })
            );
        });

        await Promise.all(emailPromises);
        logger.info(`Booking notification emails sent for booking ${data.booking.id}`);

    } catch (error) {
        logger.error('Failed to send booking notification emails:', error);
        throw error;
    }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string): Promise<void> => {
    try {
        const transporter = createTransporter();

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Welcome to Villa Booking System</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #C75D2C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Villa Booking System!</h1>
                    </div>
                    <div class="content">
                        <h2>Hello ${userName}!</h2>
                        <p>Thank you for joining Villa Booking System. We're excited to have you as part of our community!</p>
                        <p>You can now start exploring our beautiful villas and make bookings.</p>
                        <p>If you have any questions, feel free to contact our support team.</p>
                        <p>Happy travels!</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await transporter.sendMail({
            from: env.SMTP_FROM || 'noreply@villabooking.com',
            to: userEmail,
            subject: 'Welcome to Villa Booking System!',
            html
        });

        logger.info(`Welcome email sent to ${userEmail}`);
    } catch (error) {
        logger.error('Failed to send welcome email:', error);
        throw error;
    }
};