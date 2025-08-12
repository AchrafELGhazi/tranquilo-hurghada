import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { BookingStatus } from '@prisma/client';
import {
    createBooking,
    getBookings,
    getBookingById,
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    getVillaBookedDatesFromDB,
    getVillaServices,
    updateBookingServices
} from '../services/booking.service';
import { updateUserProfile } from '../services/user.service';
import prisma from '../config/database';

export const createBookingRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        console.log(user)

        // Update user profile if needed
        try {
            await updateUserProfile(user.id, {
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth
            });
        } catch (profileError) {
            logger.error('Failed to update user profile:', profileError);
        }

        const booking = await createBooking({
            ...req.body,
            guestId: user.id
        });

        ApiResponse.created(res, booking, 'Booking request created successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
        logger.error('Create booking error:', errorMessage);

        if (errorMessage.includes('not found') ||
            errorMessage.includes('not available') ||
            errorMessage.includes('Service') ||
            errorMessage.includes('Maximum')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const getAllBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;
        const filters: any = { ...req.query };

        // Role-based filtering
        if (user.role === 'GUEST') {
            filters.guestId = user.id;
        } else if (user.role === 'HOST') {
            if (!filters.ownerId && !filters.villaId && !filters.guestId) {
                filters.ownerId = user.id;
            }
            if (filters.ownerId && filters.ownerId !== user.id) {
                ApiResponse.forbidden(res, 'Access denied: You can only view bookings for your own villas');
                return;
            }
        }
        // ADMIN can see all bookings without restrictions

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
        const filters = {
            ...req.query,
            guestId: user.id
        };

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

        // Build date range
        let startDate: Date;
        let endDate: Date;

        if (year) {
            const yearNum = Number(year);
            if (month) {
                const monthNum = Number(month);
                startDate = new Date(yearNum, monthNum - 1, 1);
                endDate = new Date(yearNum, monthNum, 0);
            } else {
                startDate = new Date(yearNum, 0, 1);
                endDate = new Date(yearNum, 11, 31);
            }
        } else {
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

        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: Only villa owners or admins can update payment status');
            return;
        }

        if (existingBooking.status !== BookingStatus.CONFIRMED) {
            ApiResponse.badRequest(res, 'Payment status can only be updated for confirmed bookings');
            return;
        }

        const newPaidStatus = !existingBooking.isPaid;

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
                },
                bookingServices: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                title: true,
                                category: true,
                                price: true,
                                duration: true,
                                image: true
                            }
                        }
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

export const getVillaServicesEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;

        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            select: { id: true, title: true, isActive: true }
        });

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        if (!villa.isActive) {
            ApiResponse.badRequest(res, 'Villa is not active');
            return;
        }

        const services = await getVillaServices(villaId);

        ApiResponse.success(res, {
            villaId,
            villaTitle: villa.title,
            services
        }, 'Villa services retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa services';
        logger.error('Get villa services error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const updateBookingServicesEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.params;
        const { selectedServices } = req.body;
        const user = req.user!;

        const existingBooking = await getBookingById(bookingId, user.id, user.role);
        if (!existingBooking) {
            ApiResponse.notFound(res, 'Booking not found');
            return;
        }

        const isGuest = existingBooking.guestId === user.id;
        const isVillaOwner = existingBooking.villa.ownerId === user.id;
        const isAdmin = user.role === 'ADMIN';

        if (!isGuest && !isVillaOwner && !isAdmin) {
            ApiResponse.forbidden(res, 'Access denied: You can only update your own booking services');
            return;
        }

        const updatedBooking = await updateBookingServices(bookingId, selectedServices);
        ApiResponse.success(res, updatedBooking, 'Booking services updated successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update booking services';
        logger.error('Update booking services error:', errorMessage);

        if (errorMessage.includes('not found') || errorMessage.includes('Can only update')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};