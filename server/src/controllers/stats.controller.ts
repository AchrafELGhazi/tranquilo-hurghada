import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { getComprehensiveStats } from '../services/stats.service';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';

export const getDashboardStats = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            ApiResponse.unauthorized(res, 'Not authenticated');
            return;
        }

        const userId = req.user.id;
        const userRole = req.user.role;

        const stats = await getComprehensiveStats(userId, userRole);

        ApiResponse.success(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get statistics';
        logger.error('Get dashboard stats error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};