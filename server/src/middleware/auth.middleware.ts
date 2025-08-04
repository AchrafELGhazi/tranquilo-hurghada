import { Request, Response, NextFunction } from 'express';
import { verifyToken, getTokenFromRequest } from '../utils/jwt';
import { getCurrentUser } from '../services/auth.service';
import logger from '../config/logger';
import { Role } from '@prisma/client';
import { TokenPayload } from '../types/token.types';

export interface AuthenticatedRequest extends Request {
    user?: Omit<import('@prisma/client').User, 'password'>;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required - No token provided'
            });
            return;
        }

        const payload = verifyToken(token);
        if (!payload) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }

        // Get fresh user data from database
        const user = await getCurrentUser(payload.id);
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

export const authorize = (allowedRoles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
            });
            return;
        }

        next();
    };
};

// Convenience middleware for specific roles
export const requireGuest = authorize([Role.GUEST, Role.HOST, Role.ADMIN]);
export const requireHost = authorize([Role.HOST, Role.ADMIN]);
export const requireAdmin = authorize([Role.ADMIN]);