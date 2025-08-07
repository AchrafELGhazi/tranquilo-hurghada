import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Request } from 'express';
import logger from '../config/logger';
import { env } from '../config/env';
import { TokenPayload } from '../types/token.types';

export const generateTokens = (user: User): {
    accessToken: string;
    refreshToken: string
} => {
    const payload: TokenPayload = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    } catch (error) {
        logger.error('Token verification failed:', error);
        return null;
    }
};

export const getTokenFromRequest = (req: Request): string | null => {
    const authHeader = req.headers['authorization'];
    return authHeader?.split(' ')[1] || null;
};