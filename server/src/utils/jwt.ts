import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import logger from '../config/logger';
import { env } from '../config/env';
import { TokenPayload } from '../types/token.types';

export const generateTokens = (user: User): { accessToken: string; refreshToken: string } => {
     const accessToken = jwt.sign(
          {
               id: user.id,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName,
               role: user.role,
               isActive: user.isActive,
               createdAt: user.createdAt,
               updatedAt: user.updatedAt
          },
          env.JWT_SECRET,
          { expiresIn: '15m' }
     );

     const refreshToken = jwt.sign(
          {
               id: user.id,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName
          },
          env.JWT_SECRET,
          { expiresIn: '7d' }
     );

     return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload | null => {
     try {
          const payload = jwt.verify(token, env.JWT_SECRET) as any;
          return {
               id: payload.id,
               email: payload.email,
               firstName: payload.firstName,
               lastName: payload.lastName,
               role: payload.role,
               isActive: payload.isActive,
               createdAt: new Date(payload.createdAt),
               updatedAt: new Date(payload.updatedAt)
          };
     } catch (error) {
          logger.error('Token verification failed:', error);
          return null;
     }
};

export const getTokenFromRequest = (req: Request): string | null => {
     return req.cookies?.accessToken || req.headers.authorization?.split(' ')[1] || null;
};

export const clearAuthCookies = (res: Response): void => {
     res.clearCookie('accessToken');
     res.clearCookie('refreshToken');
};

export const setAuthCookies = (
     res: Response,
     tokens: { accessToken: string; refreshToken: string }
): void => {
     res.cookie('accessToken', tokens.accessToken, {
          httpOnly: true,
          secure: env.isProduction,
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
     });

     res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: env.isProduction,
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
     });
};