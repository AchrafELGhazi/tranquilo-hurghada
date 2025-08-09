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
    getVillaBookedDates,
    toggleBookingPaidStatus,
    getVillaServicesEndpoint,
    updateBookingServicesEndpoint
} from '../controllers/booking.controller';
import { authenticate, requireGuest, requireHost, requireAdmin } from '../middleware/auth.middleware';
import {
    validateBookingRequest,
    validatePaginationParams,
    validateDateParams,
    validateBookingAction,
    validateBookingFilters,
    validateVillaBookedDatesParams,
    validateBookingServicesUpdate
} from '../middleware/validation.middleware';

const bookingRouter = Router();

bookingRouter.use(authenticate);

// Create a new booking request (with optional services selection)
bookingRouter.post('/', requireGuest, validateBookingRequest, createBookingRequest);

// Get all bookings (with role-based filtering) - includes services data
bookingRouter.get('/', validatePaginationParams, validateDateParams, validateBookingFilters, getAllBookings);

// Get current user's bookings - includes services data
bookingRouter.get('/my', validatePaginationParams, validateBookingFilters, getMyBookings);

// Get villa booked dates
bookingRouter.get('/villa/:villaId/booked-dates', validateVillaBookedDatesParams, getVillaBookedDates);

// Get available services for a villa
bookingRouter.get('/villa/:villaId/services', getVillaServicesEndpoint);

// Get specific booking details - includes services data
bookingRouter.get('/:bookingId', getBookingDetails);

// Update booking services (for pending bookings only)
bookingRouter.put('/:bookingId/services', validateBookingServicesUpdate, updateBookingServicesEndpoint);

// Confirm a booking (hosts and admins only)
bookingRouter.put('/:bookingId/confirm', requireHost, confirmBookingRequest);

// Reject a booking (hosts and admins only)
bookingRouter.put('/:bookingId/reject', validateBookingAction, requireHost, rejectBookingRequest);

// Cancel a booking (guests, hosts, and admins)
bookingRouter.put('/:bookingId/cancel', validateBookingAction, cancelBookingRequest);

// Toggle payment status (hosts and admins only)
bookingRouter.put('/:bookingId/toggle-payment', toggleBookingPaidStatus);

// Complete a booking (admins only)
bookingRouter.put('/:bookingId/complete', requireAdmin, completeBookingRequest);

export default bookingRouter;