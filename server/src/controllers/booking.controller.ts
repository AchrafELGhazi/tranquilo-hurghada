import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { PaymentMethod, BookingStatus } from '@prisma/client';
import {
    createBooking,
    getBookings,
    getBookingById,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    getVillaBookedDatesFromDB
} from '../services/booking.service';
import { parseQueryDates } from '../utils/booking.utils';
import { updateUserProfile } from '../services/user.service';
import prisma from '../config/database';

export const createBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId, checkIn, checkOut, totalGuests, paymentMethod, notes, phone, dateOfBirth } = req.body;
        const guestId = req.user!.id;

        if (!villaId || !checkIn || !checkOut || !totalGuests || !paymentMethod) {
            ApiResponse.badRequest(res, 'Missing required fields: villaId, checkIn, checkOut, totalGuests, paymentMethod');
            return;
        }

        if (!phone) {
            ApiResponse.badRequest(res, 'Phone number is required for booking');
            return;
        }

        if (!dateOfBirth) {
            ApiResponse.badRequest(res, 'Date of birth is required for booking');
            return;
        }

        const dobDate = new Date(dateOfBirth);
        if (isNaN(dobDate.getTime())) {
            ApiResponse.badRequest(res, 'Invalid date of birth format');
            return;
        }

        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;

        if (finalAge < 18) {
            ApiResponse.badRequest(res, 'You must be at least 18 years old to make a booking');
            return;
        }

        // Validate payment method
        if (!Object.values(PaymentMethod).includes(paymentMethod)) {
            ApiResponse.badRequest(res, 'Invalid payment method');
            return;
        }

        // Validate guest count
        if (totalGuests < 1 || totalGuests > 12) {
            ApiResponse.badRequest(res, 'Total guests must be between 1 and 50');
            return;
        }

        // Parse dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            ApiResponse.badRequest(res, 'Invalid date format');
            return;
        }

        // Update user profile with phone and date of birth if not already set
        try {
            await updateUserProfile(guestId, { phone, dateOfBirth: dobDate });
        } catch (profileError) {
            logger.error('Failed to update user profile:', profileError);
            // Continue with booking even if profile update fails
        }

        const booking = await createBooking({
            villaId,
            guestId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalGuests: parseInt(totalGuests),
            paymentMethod,
            notes
        });

        ApiResponse.created(res, booking, 'Booking request created successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
        logger.error('Create booking error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('not available')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const getAllBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        // Parse query parameters
        const {
            status,
            villaId,
            guestId,
            ownerId,
            startDate,
            endDate,
            page = '1',
            limit = '10',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Validate and parse parameters
        const parsedPage = Math.max(1, parseInt(page as string) || 1);
        const parsedLimit = Math.min(50, Math.max(1, parseInt(limit as string) || 10));

        const filters: any = {
            page: parsedPage,
            limit: parsedLimit,
            sortBy: ['createdAt', 'checkIn', 'checkOut', 'totalPrice'].includes(sortBy as string)
                ? sortBy as string
                : 'createdAt',
            sortOrder: ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc'
        };

        // Status filter
        if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
            filters.status = status as BookingStatus;
        }

        // Date filters
        if (startDate) {
            filters.startDate = parseQueryDates(startDate as string);
            if (!filters.startDate) {
                ApiResponse.badRequest(res, 'Invalid startDate format');
                return;
            }
        }

        if (endDate) {
            filters.endDate = parseQueryDates(endDate as string);
            if (!filters.endDate) {
                ApiResponse.badRequest(res, 'Invalid endDate format');
                return;
            }
        }

        // Role-based filtering
        if (user.role === 'GUEST') {
            // Guests can only see their own bookings
            filters.guestId = user.id;
        } else if (user.role === 'HOST') {
            // Hosts can see their villa bookings or specify other filters
            if (!ownerId && !villaId && !guestId) {
                filters.ownerId = user.id;
            }

            // If host specifies ownerId, they can only see their own villas
            if (ownerId && ownerId !== user.id) {
                ApiResponse.forbidden(res, 'Access denied: You can only view bookings for your own villas');
                return;
            }
        } else if (user.role === 'ADMIN') {
            // Admins can see all bookings with any filters
            if (villaId) filters.villaId = villaId as string;
            if (guestId) filters.guestId = guestId as string;
            if (ownerId) filters.ownerId = ownerId as string;
        }

        const result = await getBookings(filters);

        ApiResponse.successWithPagination(
            res,
            result.bookings,
            result.pagination,
            'Bookings retrieved successfully'
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get bookings';
        logger.error('Get bookings error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getBookingDetails = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        const booking = await getBookingById(bookingId, user.id, user.role);

        if (!booking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        ApiResponse.success(res, booking, 'Booking details retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get booking details';
        logger.error('Get booking details error:', errorMessage);

        if (errorMessage.includes('Access denied')) {
            ApiResponse.forbidden(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const confirmBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        // Check if user has permission to confirm (only villa owner or admin)
        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: Only villa owners or admins can confirm bookings');
            return;
        }

        const confirmedBooking = await confirmBooking(bookingId, user.id);

        ApiResponse.success(res, confirmedBooking, 'Booking confirmed successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to confirm booking';
        logger.error('Confirm booking error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('Cannot confirm')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const rejectBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const { rejectionReason } = req.body;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        // Check if user has permission to reject (only villa owner or admin)
        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: Only villa owners or admins can reject bookings');
            return;
        }

        const rejectedBooking = await rejectBooking(bookingId, user.id, rejectionReason);

        ApiResponse.success(res, rejectedBooking, 'Booking rejected successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to reject booking';
        logger.error('Reject booking error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('Cannot reject')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const cancelBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const { cancellationReason } = req.body;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        // Check if user has permission to cancel
        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        const isGuest = existingBooking.guestId === user.id;
        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isGuest && !isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: Only guests, villa owners, or admins can cancel bookings');
            return;
        }

        const cancelledBooking = await cancelBooking(bookingId, user.id, cancellationReason);

        ApiResponse.success(res, cancelledBooking, 'Booking cancelled successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking';
        logger.error('Cancel booking error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('Cannot cancel')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const completeBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        // Only admins or system can complete bookings
        if (user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'Access denied: Only admins can complete bookings');
            return;
        }

        const completedBooking = await completeBooking(bookingId);

        ApiResponse.success(res, completedBooking, 'Booking completed successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to complete booking';
        logger.error('Complete booking error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('Cannot complete')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const getMyBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        const {
            status,
            page = '1',
            limit = '10',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filters: any = {
            guestId: user.id, // Only user's bookings
            page: Math.max(1, parseInt(page as string) || 1),
            limit: Math.min(50, Math.max(1, parseInt(limit as string) || 10)),
            sortBy: ['createdAt', 'checkIn', 'checkOut', 'totalPrice'].includes(sortBy as string)
                ? sortBy as string
                : 'createdAt',
            sortOrder: ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc'
        };

        if (status && Object.values(BookingStatus).includes(status as BookingStatus)) {
            filters.status = status as BookingStatus;
        }

        const result = await getBookings(filters);

        ApiResponse.successWithPagination(
            res,
            result.bookings,
            result.pagination,
            'Your bookings retrieved successfully'
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get your bookings';
        logger.error('Get my bookings error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};


export const getVillaBookedDates = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const { year, month } = req.query;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        // Build date range filter
        let startDate: Date | undefined;
        let endDate: Date | undefined;

        if (year) {
            const yearNum = parseInt(year as string);
            if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
                ApiResponse.badRequest(res, 'Invalid year. Must be between 2020 and 2030');
                return;
            }

            if (month) {
                const monthNum = parseInt(month as string);
                if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                    ApiResponse.badRequest(res, 'Invalid month. Must be between 1 and 12');
                    return;
                }

                // Get specific month
                startDate = new Date(yearNum, monthNum - 1, 1);
                endDate = new Date(yearNum, monthNum, 0); // Last day of the month
            } else {
                // Get entire year
                startDate = new Date(yearNum, 0, 1);
                endDate = new Date(yearNum, 11, 31);
            }
        } else {
            // Default: get next 12 months from today
            startDate = new Date();
            endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            select: { id: true, title: true, isActive: true }
        });

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        const bookedDates = await getVillaBookedDatesFromDB(villaId, startDate, endDate);

        ApiResponse.success(res, {
            villaId,
            villaTitle: villa.title,
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            bookedDates
        }, 'Villa booked dates retrieved successfully');

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa booked dates';
        logger.error('Get villa booked dates error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};


export const toggleBookingPaidStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const user = req.user!;

        if (!bookingId) {
            ApiResponse.badRequest(res, 'Booking ID is required');
            return;
        }

        // Check if user has permission to toggle payment status
        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        // Only villa owners and admins can toggle payment status
        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: Only villa owners or admins can update payment status');
            return;
        }

        // Only allow payment status update for confirmed bookings
        if (existingBooking.status !== BookingStatus.CONFIRMED) {
            ApiResponse.badRequest(res, 'Payment status can only be updated for confirmed bookings');
            return;
        }

        // Toggle the current payment status
        const newPaidStatus = !existingBooking.isPaid;

        // Update payment status
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                isPaid: newPaidStatus,
                updatedAt: new Date()
            },
            include: {
                guest: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true
                    }
                },
                villa: {
                    select: {
                        id: true,
                        title: true,
                        address: true,
                        city: true,
                        pricePerNight: true,
                        ownerId: true
                    }
                },
                confirmedBy: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });

        const statusMessage = newPaidStatus ? 'marked as paid' : 'marked as unpaid';
        logger.info(`Booking ${bookingId} payment status toggled to ${newPaidStatus} by user ${user.id}`);

        ApiResponse.success(res, updatedBooking, `Booking payment status ${statusMessage} successfully`);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to toggle booking payment status';
        logger.error('Toggle booking payment status error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};