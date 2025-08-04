import { Request, Response, NextFunction } from 'express';
import { verifyToken, getTokenFromRequest } from '../utils/jwt';
import { getCurrentUser } from '../services/auth.service';
import logger from '../config/logger';
import { Role } from '@prisma/client';
import { TokenPayload } from '../types/token.types';

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export const authenticate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = getTokenFromRequest(req);
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }

        const payload = verifyToken(token);
        if (!payload) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        const user = await getCurrentUser(payload.id);
        req.user = user;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

export const authorize = (allowedRoles: Role[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        next();
    };
};