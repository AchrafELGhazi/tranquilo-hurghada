import { Router } from 'express';
import authRouter from './auth.route';
import villaRouter from './villa.route';
import bookingRouter from './booking.route';
import userRouter from './user.route';
import { env } from '../config/env';
import generateRootResponse from '../utils/generateRootResponse';
import serviceRouter from './service.route';
import emailRouter from './email.route';
import contactRouter from './contact.route';

const apiRouter = Router();

// Root route
apiRouter.get('/', (req, res) => {
    res.status(200).json(generateRootResponse());
});

// Route handlers
apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/villas', villaRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/email', emailRouter);
apiRouter.use('/service', serviceRouter);
apiRouter.use('/contact', contactRouter);

// Health check endpoint
apiRouter.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: env.NODE_ENV,
        version: env.API_VERSION || '1.0.0',
        memory: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
    });
});

// Development documentation endpoint
if (process.env.NODE_ENV === 'development') {
    apiRouter.get('/docs', (req, res) => {
        res.json({
            success: true,
            message: 'Tranquilo Hurghada API Documentation',
            version: env.API_VERSION || '1.0.0',
            baseUrl: `${req.protocol}://${req.get('host')}/api`,
            endpoints: {
                auth: {
                    'POST /api/auth/register': 'Register a new user',
                    'POST /api/auth/login': 'Login user',
                    'POST /api/auth/refresh-token': 'Refresh access token',
                    'POST /api/auth/logout': 'Logout user',
                    'GET /api/auth/me': 'Get current user info'
                },
                users: {
                    'GET /api/profile': 'Get current user profile',
                    'PUT /api/profile': 'Update user profile',
                    'PUT /api/profile/change-password': 'Change user password',
                    'GET /api/profile/complete': 'Check if profile is complete',
                    'PUT /api/profile/deactivate': 'Deactivate user account'
                },
                villas: {
                    'GET /api/villas': 'Get all villas with filters and pagination',
                    'GET /api/villas/:id': 'Get villa by ID',
                    'GET /api/villas/:id/availability': 'Get villa availability calendar',
                    'GET /api/villas/:id/services': 'Get villa services',
                    'GET /api/villas/my': 'Get my villas (hosts/admins only)',
                    'POST /api/villas': 'Create new villa (hosts/admins only)',
                    'PUT /api/villas/:id': 'Update villa (owners/admins only)',
                    'DELETE /api/villas/:id': 'Delete villa (admins only)',
                    'GET /api/villas/:id/statistics': 'Get villa statistics (owners/admins only)'
                },
                bookings: {
                    'POST /api/bookings': 'Create new booking request',
                    'GET /api/bookings': 'Get all bookings (filtered by role)',
                    'GET /api/bookings/my': 'Get my bookings',
                    'GET /api/bookings/:id': 'Get booking details',
                    'GET /api/bookings/villa/:villaId/booked-dates': 'Get villa booked dates',
                    'GET /api/bookings/villa/:villaId/services': 'Get villa services for booking',
                    'PUT /api/bookings/:id/services': 'Update booking services',
                    'PUT /api/bookings/:id/confirm': 'Confirm booking (hosts/admins)',
                    'PUT /api/bookings/:id/reject': 'Reject booking (hosts/admins)',
                    'PUT /api/bookings/:id/cancel': 'Cancel booking',
                    'PUT /api/bookings/:id/toggle-payment': 'Toggle payment status (hosts/admins)',
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
            },
            authentication: {
                type: 'Bearer Token',
                header: 'Authorization: Bearer <your-jwt-token>',
                note: 'Most endpoints require authentication. Get your token from /api/auth/login'
            }
        });
    });
}

export default apiRouter;