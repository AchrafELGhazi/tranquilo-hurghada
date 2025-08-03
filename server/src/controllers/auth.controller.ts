import { Request, Response } from 'express';
import {
     registerUser,
     loginUser,
     refreshUserToken,
} from '../services/auth.service';
import { setAuthCookies, clearAuthCookies } from '../utils/jwt';
import logger from '../config/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
     try {
          const { email, password, firstName, lastName } = req.body;
          const tokens = await registerUser({ email, password, firstName, lastName });

          setAuthCookies(res, tokens);
          res.status(201).json({ message: 'User registered successfully' });
     } catch (error: unknown) {
          logger.error('Registration error:', error instanceof Error ? error.message : String(error));
          res.status(400).json({
               message: error instanceof Error ? error.message : 'Registration failed'
          });
     }
};

export const login = async (req: Request, res: Response): Promise<void> => {
     try {
          const { email, password } = req.body;
          const tokens = await loginUser(email, password);

          setAuthCookies(res, tokens);
          res.json({ message: 'Login successful' });
     } catch (error: unknown) {
          logger.error('Login error:', error instanceof Error ? error.message : String(error));
          res.status(401).json({
               message: error instanceof Error ? error.message : 'Login failed'
          });
     }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
     try {
          const refreshToken = req.cookies.refreshToken;
          if (!refreshToken) {
               res.status(401).json({ message: 'Refresh token required' });
               return;
          }

          const tokens = await refreshUserToken(refreshToken);
          setAuthCookies(res, tokens);
          res.json({ message: 'Token refreshed successfully' });
     } catch (error: unknown) {
          logger.error('Refresh token error:', error instanceof Error ? error.message : String(error));
          res.status(401).json({
               message: error instanceof Error ? error.message : 'Token refresh failed'
          });
     }
};

export const logout = (req: Request, res: Response): void => {
     try {
          clearAuthCookies(res);
          res.json({ message: 'Logout successful' });
     } catch (error: unknown) {
          logger.error('Logout error:', error instanceof Error ? error.message : String(error));
          res.status(500).json({
               message: error instanceof Error ? error.message : 'Logout failed'
          });
     }
};

export const currentUser = async (
     req: AuthenticatedRequest,
     res: Response
): Promise<void> => {
     try {
          if (!req.user) {
               res.status(401).json({ message: 'Not authenticated' });
               return;
          }
          res.json(req.user);
     } catch (error: unknown) {
          logger.error('Get current user error:', error instanceof Error ? error.message : String(error));
          res.status(500).json({
               message: error instanceof Error ? error.message : 'Failed to get user'
          });
     }
};