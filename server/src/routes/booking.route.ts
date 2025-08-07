import { Router } from 'express';
import {
    createBookingRequest,
    getAllBookings,
    getBookingDetails,
    confirmBookingRequest,
    rejectBookingRequest,
    cancelBookingRequest,
    completeBookingRequest,
    getMyBookings
} from '../controllers/booking.controller';
import { authenticate, requireGuest, requireHost, requireAdmin } from '../middleware/auth.middleware';
import {
    validateBookingRequest,
    validatePaginationParams,
    validateDateParams,
    validateUUID,
    validateBookingAction,
    validateBookingFilters
} from '../middleware/validation.middleware';

const bookingRouter = Router();

bookingRouter.use(authenticate);

bookingRouter.post('/',
    requireGuest,
    validateBookingRequest,
    createBookingRequest
);

// Get all bookings (with role-based filtering)
bookingRouter.get('/',
    validatePaginationParams,
    validateDateParams,
    validateBookingFilters,
    getAllBookings
);

// Get current user's bookings
bookingRouter.get('/my',
    validatePaginationParams,
    validateBookingFilters,
    getMyBookings
);

// Get specific booking details
bookingRouter.get('/:bookingId',
    validateUUID('bookingId'),
    getBookingDetails
);

// Confirm a booking (hosts and admins only)
bookingRouter.put('/:bookingId/confirm',
    validateUUID('bookingId'),
    requireHost,
    confirmBookingRequest
);

// Reject a booking (hosts and admins only)
bookingRouter.put('/:bookingId/reject',
    validateUUID('bookingId'),
    validateBookingAction,
    requireHost,
    rejectBookingRequest
);

// Cancel a booking (guests, hosts, and admins)
bookingRouter.put('/:bookingId/cancel',
    validateUUID('bookingId'),
    validateBookingAction,
    cancelBookingRequest
);

// Complete a booking (admins only)
bookingRouter.put('/:bookingId/complete',
    validateUUID('bookingId'),
    requireAdmin,
    completeBookingRequest
);

export default bookingRouter;