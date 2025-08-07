
import { Router } from 'express';
import { createBookingRequest, getAllBookings, getBookingDetails, confirmBookingRequest, rejectBookingRequest, cancelBookingRequest, completeBookingRequest, getMyBookings } from '../controllers/booking.controller';
import { authenticate, requireGuest, requireHost, requireAdmin } from '../middleware/auth.middleware';
import { validateBookingRequest, validatePaginationParams, validateDateParams, validateUUID, validateBookingAction, validateBookingFilters } from '../middleware/validation.middleware';

const bookingRouter = Router();

bookingRouter.use(authenticate);
bookingRouter.post('/', requireGuest, validateBookingRequest, createBookingRequest);
bookingRouter.get('/', validatePaginationParams, validateDateParams, validateBookingFilters, getAllBookings);
bookingRouter.get('/my', validatePaginationParams, validateBookingFilters, getMyBookings);
bookingRouter.get('/:bookingId', validateUUID('bookingId'), getBookingDetails);
bookingRouter.put('/:bookingId/confirm', validateUUID('bookingId'), requireHost, confirmBookingRequest);
bookingRouter.put('/:bookingId/reject', validateUUID('bookingId'), validateBookingAction, requireHost, rejectBookingRequest);
bookingRouter.put('/:bookingId/cancel', validateUUID('bookingId'), validateBookingAction, cancelBookingRequest);
bookingRouter.put('/:bookingId/complete', validateUUID('bookingId'), requireAdmin, completeBookingRequest);

export default bookingRouter;