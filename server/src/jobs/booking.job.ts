import cron from 'node-cron';
import prisma from '../config/database';
import logger from '../config/logger';
import { BookingStatus } from '@prisma/client';

/**
 * Auto-complete bookings after checkout date
 * Runs daily at 2:00 AM to check for bookings that should be completed
 */
export const startBookingAutoCompletionJob = () => {
    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
        logger.info('Starting booking auto-completion job...');

        try {
            await autoCompleteBookings();
        } catch (error) {
            logger.error('Booking auto-completion job failed:', error);
        }
    }, {
        timezone: 'UTC'
    });

    logger.info('Booking auto-completion job scheduled to run daily at 2:00 AM UTC');
};

export const autoCompleteBookings = async (): Promise<void> => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const bookingsToComplete = await prisma.booking.findMany({
            where: {
                status: BookingStatus.CONFIRMED,
                checkOut: {
                    lt: startOfToday
                }
            },
            include: {
                villa: {
                    select: {
                        id: true,
                        title: true,
                        address: true,
                        city: true,
                        country: true,
                        owner: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                guest: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        if (bookingsToComplete.length === 0) {
            logger.info('No bookings found to auto-complete');
            return;
        }

        logger.info(`Found ${bookingsToComplete.length} bookings to auto-complete`);

        let completedCount = 0;
        let failedCount = 0;

        for (const booking of bookingsToComplete) {
            try {
                const completedBooking = await prisma.booking.update({
                    where: { id: booking.id },
                    data: {
                        status: BookingStatus.COMPLETED,
                        completedAt: now
                    },
                    include: {
                        villa: {
                            select: {
                                id: true,
                                title: true,
                                address: true,
                                city: true,
                                country: true,
                                owner: {
                                    select: {
                                        id: true,
                                        fullName: true,
                                        email: true,
                                        role: true
                                    }
                                }
                            }
                        },
                        guest: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                });

                completedCount++;

                logger.info(`Auto-completed booking ${booking.id} for villa "${booking.villa.title}" - Guest: ${booking.guest.fullName}`);

                
                try {
                    logger.debug(`Booking ${booking.id} completed - email notification skipped (implement BOOKING_COMPLETED type if needed)`);
                } catch (emailError) {
                    logger.error(`Failed to send completion emails for booking ${booking.id}:`, emailError);
                }

            } catch (bookingError) {
                failedCount++;
                logger.error(`Failed to auto-complete booking ${booking.id}:`, bookingError);
            }
        }

        const summary = {
            totalFound: bookingsToComplete.length,
            completed: completedCount,
            failed: failedCount
        };

        logger.info('Booking auto-completion job completed:', summary);

        if (failedCount > 0) {
            logger.warn(`${failedCount} bookings failed to complete automatically`);
        }

    } catch (error) {
        logger.error('Error in autoCompleteBookings:', error);
        throw error;
    }
};
