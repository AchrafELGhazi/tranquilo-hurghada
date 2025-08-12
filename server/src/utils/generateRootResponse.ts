import { env } from "../config/env";

const generateRootResponse = () => ({
    success: true,
    message: 'Tranquilo Hurghada API is up and running! 🏖️',
    status: 'HEALTHY',
    timestamp: new Date().toISOString(),
    version: env.API_VERSION,
    environment: env.NODE_ENV,
    endpoints: {
        health: '/api/health - Health check endpoint',
        auth: '/api/auth - Authentication endpoints',
        users: '/api/profile - User management endpoints',
        villas: '/api/villas - Villa management endpoints',
        bookings: '/api/bookings - Booking management endpoints',
        ...(process.env.NODE_ENV === 'development' && {
            docs: '/api/docs - API documentation (dev only)'
        })
    }
});

export default generateRootResponse