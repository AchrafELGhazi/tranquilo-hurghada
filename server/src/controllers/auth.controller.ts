import { Request, Response } from 'express';
import { registerUser, loginUser, refreshUserToken } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import type { RegisterBody, LoginBody, RefreshTokenBody } from '../schemas/auth.schema';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName } = req.body as RegisterBody;
        const authData = await registerUser({ email, password, fullName });
        ApiResponse.created(res, authData, 'User registered successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
        logger.error('Registration error:', errorMessage);

        if (errorMessage === 'Email already in use') {
            ApiResponse.conflict(res, errorMessage);
        } else {
            ApiResponse.badRequest(res, errorMessage);
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginBody;
        const authData = await loginUser(email, password);
        ApiResponse.success(res, authData, 'Login successful');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        logger.error('Login error:', errorMessage);
        ApiResponse.unauthorized(res, errorMessage);
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body as RefreshTokenBody;
        const authData = await refreshUserToken(refreshToken);
        ApiResponse.success(res, authData, 'Token refreshed successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
        logger.error('Refresh token error:', errorMessage);
        ApiResponse.unauthorized(res, errorMessage);
    }
};

export const logout = (req: Request, res: Response): void => {
    try {
        ApiResponse.success(res, { message: 'Logged out successfully' }, 'Logout successful');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Logout failed';
        logger.error('Logout error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const currentUser = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            ApiResponse.unauthorized(res, 'Not authenticated');
            return;
        }
        ApiResponse.success(res, { user: req.user }, 'User retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
        logger.error('Get current user error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};