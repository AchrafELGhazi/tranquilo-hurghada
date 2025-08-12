import { Request, Response } from 'express';
import { Options } from 'express-rate-limit';
import { env } from '../config/env';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RETRY_AFTER = 15 * 60; // 15 minutes in seconds

// Base rate limit - applies to all routes
export const baseRateLimit: Partial<Options> = {
    windowMs: WINDOW_MS,
    max: env.isProduction ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Try again later.' },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests. Try again later.',
            retryAfter: RETRY_AFTER
        });
    },
    skip: (req: Request) => req.path === '/health'
};

// Strict rate limit for sensitive endpoints (auth, admin, etc.)
export const strictRateLimit: Partial<Options> = {
    ...baseRateLimit,
    max: env.isProduction ? 5 : 20,
    message: { error: 'Too many attempts. Try again later.' },
    handler: (req: Request, res: Response) => {
        console.warn(`🚨 Rate limit exceeded: ${req.ip} -> ${req.path}`);
        res.status(429).json({
            error: 'Too many attempts. Try again later.',
            retryAfter: RETRY_AFTER
        });
    }
};