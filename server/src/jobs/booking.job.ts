import cron from 'node-cron';
import prisma from '../config/database';
import logger from '../config/logger';
import { BookingStatus } from '@prisma/client';
import { sendBookingNotificationEmails } from '../utils/emailService';

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

/**
 * Find and complete bookings that are past their checkout date
 */
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

/**
 * Manual trigger for testing or administrative purposes
 * Can be called from an admin endpoint or CLI
 */
export const triggerBookingAutoCompletion = async (): Promise<{
    success: boolean;
    message: string;
    details?: any;
}> => {
    try {
        logger.info('Manual booking auto-completion triggered');

        const startTime = new Date();
        await autoCompleteBookings();
        const endTime = new Date();
        const duration = endTime.getTime() - startTime.getTime();

        const result = {
            success: true,
            message: 'Booking auto-completion completed successfully',
            details: {
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                durationMs: duration
            }
        };

        logger.info('Manual booking auto-completion completed:', result.details);
        return result;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        logger.error('Manual booking auto-completion failed:', errorMessage);

        return {
            success: false,
            message: `Booking auto-completion failed: ${errorMessage}`
        };
    }
};

/**
 * Get statistics about bookings eligible for auto-completion
 * Useful for monitoring and debugging
 */
export const getAutoCompletionStats = async (): Promise<{
    pendingCompletion: number;
    completedToday: number;
    completedThisWeek: number;
    completedThisMonth: number;
}> => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [pendingCompletion, completedToday, completedThisWeek, completedThisMonth] = await Promise.all([
            // Bookings eligible for completion
            prisma.booking.count({
                where: {
                    status: BookingStatus.CONFIRMED,
                    checkOut: { lt: startOfToday }
                }
            }),

            // Completed today
            prisma.booking.count({
                where: {
                    status: BookingStatus.COMPLETED,
                    completedAt: { gte: startOfToday }
                }
            }),

            // Completed this week
            prisma.booking.count({
                where: {
                    status: BookingStatus.COMPLETED,
                    completedAt: { gte: startOfWeek }
                }
            }),

            // Completed this month
            prisma.booking.count({
                where: {
                    status: BookingStatus.COMPLETED,
                    completedAt: { gte: startOfMonth }
                }
            })
        ]);

        return {
            pendingCompletion,
            completedToday,
            completedThisWeek,
            completedThisMonth
        };

    } catch (error) {
        logger.error('Error getting auto-completion stats:', error);
        throw error;
    }
};