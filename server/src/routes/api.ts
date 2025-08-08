import { Router } from 'express';
import authRouter from './auth.route';
import villaRouter from './villa.route';
import bookingRouter from './booking.route';
import userRouter from './user.route';

const apiRouter = Router();


apiRouter.use('/auth', authRouter);
apiRouter.use('/profile', userRouter);
apiRouter.use('/villas', villaRouter);
apiRouter.use('/bookings', bookingRouter);


if (process.env.NODE_ENV === 'development') {
    apiRouter.get('/docs', (req, res) => {
        res.json({
            success: true,
            message: 'API Documentation',
            endpoints: {
                auth: {
                    'POST /api/auth/register': 'Register a new user',
                    'POST /api/auth/login': 'Login user',
                    'POST /api/auth/refresh-token': 'Refresh access token',
                    'POST /api/auth/logout': 'Logout user',
                    'GET /api/auth/me': 'Get current user info'
                },
                villas: {
                    'GET /api/villas': 'Get all villas with filters and pagination',
                    'GET /api/villas/:id': 'Get villa by ID',
                    'GET /api/villas/my': 'Get my villas (hosts/admins only)'
                },
                bookings: {
                    'POST /api/bookings': 'Create new booking request',
                    'GET /api/bookings': 'Get all bookings (filtered by role)',
                    'GET /api/bookings/my': 'Get my bookings',
                    'GET /api/bookings/:id': 'Get booking details',
                    'PUT /api/bookings/:id/confirm': 'Confirm booking (hosts/admins)',
                    'PUT /api/bookings/:id/reject': 'Reject booking (hosts/admins)',
                    'PUT /api/bookings/:id/cancel': 'Cancel booking',
                    'PUT /api/bookings/:id/complete': 'Complete booking (admins only)'
                }
            },
            queryParameters: {
                villas: {
                    city: 'Filter by city',
                    country: 'Filter by country',
                    minPrice: 'Minimum price per night',
                    maxPrice: 'Maximum price per night',
                    maxGuests: 'Minimum guest capacity',
                    minBedrooms: 'Minimum bedrooms',
                    minBathrooms: 'Minimum bathrooms',
                    amenities: 'Comma-separated amenities',
                    checkIn: 'Check-in date (YYYY-MM-DD)',
                    checkOut: 'Check-out date (YYYY-MM-DD)',
                    page: 'Page number (default: 1)',
                    limit: 'Items per page (default: 12, max: 50)',
                    sortBy: 'Sort field (title, pricePerNight, maxGuests, bedrooms, createdAt)',
                    sortOrder: 'Sort order (asc, desc)'
                },
                bookings: {
                    status: 'Filter by status (PENDING, CONFIRMED, CANCELLED, REJECTED, COMPLETED)',
                    villaId: 'Filter by villa ID',
                    guestId: 'Filter by guest ID (admins only)',
                    ownerId: 'Filter by villa owner ID (admins only)',
                    startDate: 'Filter bookings starting after date',
                    endDate: 'Filter bookings ending before date',
                    page: 'Page number (default: 1)',
                    limit: 'Items per page (default: 10, max: 50)',
                    sortBy: 'Sort field (createdAt, checkIn, checkOut, totalPrice)',
                    sortOrder: 'Sort order (asc, desc)'
                }
            }
        });
    });
}


export default apiRouter;