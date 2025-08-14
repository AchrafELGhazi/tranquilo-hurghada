import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFoundHandler } from './middleware/notFoundHandler';
import { env } from './config/env';
import apiRouter from './routes/api';
import { startBookingAutoCompletionJob } from './jobs/booking.job';
import { baseRateLimit } from './middleware/rateLimit.middleware';
import logger from './config/logger';

const app = express();
const apiPrefix = '/api';
const { isProduction, isDevelopment } = env;

const allowedOrigins = isProduction
    ? [env.FRONTEND_URL]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        env.FRONTEND_URL
    ];

app.use((req: Request, res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
});

app.use(compression({
    filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
    level: 6,
}));



app.use(apiPrefix, rateLimit(baseRateLimit));

app.use(cors({
    origin: (origin, callback) => {
        if (!origin && !isProduction) {
            return callback(null, true);
        }
        if (!origin || (origin && allowedOrigins.includes(origin))) {
            callback(null, true);
        } else {
            callback(new Error(`Origin ${origin} not allowed by CORS policy`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    exposedHeaders: ['X-Request-ID'],
    maxAge: isProduction ? 86400 : 0,
}));

app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: isProduction ? 'same-site' : 'cross-origin'
        },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                objectSrc: ["'none'"],
                frameSrc: ["'none'"],
                fontSrc: ["'self'", 'https:', 'data:'],
                connectSrc: ["'self'", ...(isProduction ? [] : ['ws:', 'wss:'])],
                ...(isProduction && {
                    upgradeInsecureRequests: [],
                })
            },
        },
        hsts: isProduction ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        } : false,
        noSniff: true,
        frameguard: { action: 'deny' },
        xssFilter: true,
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
    })
);

const morganFormat = isProduction
    ? 'combined'
    : 'dev';

app.use(morgan(morganFormat));

app.use(express.json({ limit: '5mb' }));

app.use(express.urlencoded({
    extended: true,
    limit: isProduction ? '5mb' : '10mb'
}));

try {
    startBookingAutoCompletionJob();
} catch (error) {
    logger.error('Failed to start booking auto-completion job:', error);
    if (isProduction) {
        process.exit(1);
    }
}

app.use(apiPrefix, apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;