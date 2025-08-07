import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { PaymenyMethod, BookingStatus } from '@prisma/client';
import {
    createBooking,
    getBookings,
    getBookingById,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking
} from '../services/booking.service';
import { parseQueryDates } from '../utils/booking.utils';

export const createBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId, checkIn, checkOut, totalGuests, paymentMethod, notes } = req.body;
        const guestId = req.user!.id;

        // Validation
        if (!villaId || !checkIn || !checkOut || !totalGuests || !paymentMethod) {
            ApiResponse.badRequest(res, 'Missing required fields: villaId, checkIn, checkOut, totalGuests, paymentMethod');
            return;
        }

        // Validate payment method
        if (!Object.values(PaymenyMethod).includes(paymentMethod)) {
            ApiResponse.badRequest(res, 'Invalid payment method');
            return;
        }

        // Validate guest count
        if (totalGuests < 1 || totalGuests > 50) {
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