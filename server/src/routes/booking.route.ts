import { Router } from 'express';
import { createBookingRequest, getAllBookings, getBookingDetails, confirmBookingRequest, rejectBookingRequest, cancelBookingRequest, completeBookingRequest, getMyBookings, getVillaBookedDates, toggleBookingPaidStatus, updateBookingServicesEndpoint } from '../controllers/booking.controller';
import { authenticate, requireGuest, requireHost, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { createBookingSchema, updateBookingServicesSchema, bookingActionSchema, bookingParamsSchema, villaAvailabilityParamsSchema, bookingQuerySchema } from '../schemas/booking.schema';

const bookingRouter = Router();

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking request with services
 * @access  Private (Guests)
 */
bookingRouter.post('/',
    authenticate,
    requireGuest,
    validateRequest(createBookingSchema),
    createBookingRequest
);

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings with role-based filtering
 * @access  Private (Role-based)
 */
bookingRouter.get('/',
    authenticate,
    validateRequest(bookingQuerySchema),
    getAllBookings
);

/**
 * @route   GET /api/bookings/my
 * @desc    Get current user's bookings
 * @access  Private (All roles)
 */
bookingRouter.get('/my',
    authenticate,
    validateRequest(bookingQuerySchema),
    getMyBookings
);

/**
 * @route   GET /api/bookings/villa/:villaId/booked-dates
 * @desc    Get villa booked dates
 * @access  Private (All roles)
 * @query   ?year=2025&month=6
 */
bookingRouter.get('/villa/:villaId/booked-dates',
    validateRequest(villaAvailabilityParamsSchema),
    getVillaBookedDates
);



/**
 * @route   GET /api/bookings/:bookingId
 * @desc    Get specific booking details
 * @access  Private (Booking participants)
 */
bookingRouter.get('/:bookingId',
    authenticate,
    validateRequest(bookingParamsSchema),
    getBookingDetails
);

/**
 * @route   PUT /api/bookings/:bookingId/services
 * @desc    Update booking services (for pending bookings only)
 * @access  Private (Booking participants)
 */
bookingRouter.put('/:bookingId/services',
    authenticate,
    validateRequest(updateBookingServicesSchema),
    updateBookingServicesEndpoint
);

/**
 * @route   PUT /api/bookings/:bookingId/confirm
 * @desc    Confirm a booking
 * @access  Private (Hosts, Admins)
 */
bookingRouter.put('/:bookingId/confirm',
    authenticate,
    requireHost,
    validateRequest(bookingParamsSchema),
    confirmBookingRequest
);

/**
 * @route   PUT /api/bookings/:bookingId/reject
 * @desc    Reject a booking
 * @access  Private (Hosts, Admins)
 */
bookingRouter.put('/:bookingId/reject',
    authenticate,
    requireHost,
    validateRequest(bookingActionSchema),
    rejectBookingRequest
);

/**
 * @route   PUT /api/bookings/:bookingId/cancel
 * @desc    Cancel a booking
 * @access  Private (Guests, Hosts, Admins)
 */
bookingRouter.put('/:bookingId/cancel',
    authenticate,
    validateRequest(bookingActionSchema),
    cancelBookingRequest
);

/**
 * @route   PUT /api/bookings/:bookingId/toggle-payment
 * @desc    Toggle payment status
 * @access  Private (Hosts, Admins)
 */
bookingRouter.put('/:bookingId/toggle-payment',
    authenticate,
    validateRequest(bookingParamsSchema),
    toggleBookingPaidStatus
);

/**
 * @route   PUT /api/bookings/:bookingId/complete
 * @desc    Complete a booking
 * @access  Private (Admins only)
 */
bookingRouter.put('/:bookingId/complete',
    authenticate,
    requireAdmin,
    validateRequest(bookingParamsSchema),
    completeBookingRequest
);

export default bookingRouter;