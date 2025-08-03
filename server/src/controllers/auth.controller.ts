import { Request, Response } from 'express';
import {
     registerUser,
     loginUser,
     refreshUserToken,
} from '../services/auth.service';
import { setAuthCookies, clearAuthCookies } from '../utils/jwt';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
     try {
          const { email, password, firstName, lastName } = req.body;
          const tokens = await registerUser({ email, password, firstName, lastName });

          setAuthCookies(res, tokens);
          ApiResponse.created(res, null, 'User registered successfully');
     } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          logger.error('Registration error:', errorMessage);
          ApiResponse.badRequest(res, errorMessage);
     }
};

export const login = async (req: Request, res: Response): Promise<void> => {
     try {
          const { email, password } = req.body;
          const tokens = await loginUser(email, password);

          setAuthCookies(res, tokens);
          ApiResponse.success(res, null, 'Login successful');
     } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          logger.error('Login error:', errorMessage);
          ApiResponse.unauthorized(res, errorMessage);
     }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
     try {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
               ApiResponse.unauthorized(res, 'Refresh token required');
               return;
          }

          const tokens = await refreshUserToken(refreshToken);
          setAuthCookies(res, tokens);
          ApiResponse.success(res, null, 'Token refreshed successfully');
     } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
          logger.error('Refresh token error:', errorMessage);
          ApiResponse.unauthorized(res, errorMessage);
     }
};

export const logout = (req: Request, res: Response): void => {
     try {
          clearAuthCookies(res);
          ApiResponse.success(res, null, 'Logout successful');
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
          ApiResponse.success(res, req.user, 'User retrieved successfully');
     } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
          logger.error('Get current user error:', errorMessage);
          ApiResponse.serverError(res, errorMessage);
     }
};