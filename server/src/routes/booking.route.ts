import { Router } from 'express';
import {
    createBookingRequest,
    getAllBookings,
    getBookingDetails,
    confirmBookingRequest,
    rejectBookingRequest,
    cancelBookingRequest,
    completeBookingRequest,
    getMyBookings,
    getVillaBookedDates
} from '../controllers/booking.controller';
import { authenticate, requireGuest, requireHost, requireAdmin } from '../middleware/auth.middleware';
import {
    validateBookingRequest,
    validatePaginationParams,
    validateDateParams,
    validateBookingAction,
    validateBookingFilters,
    validateVillaBookedDatesParams
} from '../middleware/validation.middleware';

const bookingRouter = Router();

bookingRouter.use(authenticate);

// Create a new booking request
bookingRouter.post('/', requireGuest, validateBookingRequest, createBookingRequest);

// Get all bookings (with role-based filtering)
bookingRouter.get('/', validatePaginationParams, validateDateParams, validateBookingFilters, getAllBookings);

// Get current user's bookings
bookingRouter.get('/my', validatePaginationParams, validateBookingFilters, getMyBookings);

// Get villa booked dates
bookingRouter.get('/villa/:villaId/booked-dates', validateVillaBookedDatesParams, getVillaBookedDates);

// Get specific booking details
bookingRouter.get('/:bookingId', getBookingDetails);

// Confirm a booking (hosts and admins only)
bookingRouter.put('/:bookingId/confirm', requireHost, confirmBookingRequest);

// Reject a booking (hosts and admins only)
bookingRouter.put('/:bookingId/reject', validateBookingAction, requireHost, rejectBookingRequest);

// Cancel a booking (guests, hosts, and admins)
bookingRouter.put('/:bookingId/cancel', validateBookingAction, cancelBookingRequest);

// Complete a booking (admins only)
bookingRouter.put('/:bookingId/complete', requireAdmin, completeBookingRequest);

export default bookingRouter;