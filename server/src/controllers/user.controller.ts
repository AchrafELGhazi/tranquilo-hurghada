import { Response } from 'express';
import bcrypt from 'bcrypt';
import {
    updateUserProfile,
    getUserProfile,
    checkUserProfileComplete,
    getAllUsersService
} from '../services/user.service';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const userProfile = await getUserProfile(userId);
        ApiResponse.success(res, userProfile, 'Profile retrieved successfully');
    } catch (error: any) {
        console.error('Get profile error:', error);
        if (error.message === 'User not found') {
            ApiResponse.notFound(res, 'User not found');
        } else {
            ApiResponse.serverError(res, 'Failed to retrieve profile');
        }
    }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const updatedUser = await updateUserProfile(userId, req.body);
        ApiResponse.success(res, updatedUser, 'Profile updated successfully');
    } catch (error: any) {
        console.error('Update profile error:', error);
        if (error.message === 'Email is already in use by another user') {
            ApiResponse.conflict(res, error.message);
        } else if (error.message === 'User not found') {
            ApiResponse.notFound(res, 'User not found');
        } else {
            ApiResponse.serverError(res, 'Failed to update profile');
        }
    }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { currentPassword, newPassword } = req.body;

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true }
        });

        if (!currentUser) {
            ApiResponse.notFound(res, 'User not found');
            return;
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isCurrentPasswordValid) {
            ApiResponse.badRequest(res, 'Current password is incorrect');
            return;
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedNewPassword,
                updatedAt: new Date()
            }
        });

        ApiResponse.success(res, null, 'Password changed successfully');
    } catch (error: any) {
        console.error('Change password error:', error);
        ApiResponse.serverError(res, 'Failed to change password');
    }
};

export const checkProfileComplete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const profileStatus = await checkUserProfileComplete(userId);
        ApiResponse.success(res, profileStatus, 'Profile completeness checked');
    } catch (error: any) {
        console.error('Check profile complete error:', error);
        if (error.message === 'User not found') {
            ApiResponse.notFound(res, 'User not found');
        } else {
            ApiResponse.serverError(res, 'Failed to check profile completeness');
        }
    }
};

export const deactivateAccount = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const { password } = req.body;

        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, password: true, isActive: true }
        });

        if (!currentUser) {
            ApiResponse.notFound(res, 'User not found');
            return;
        }

        if (!currentUser.isActive) {
            ApiResponse.badRequest(res, 'Account is already deactivated');
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, currentUser.password);
        if (!isPasswordValid) {
            ApiResponse.badRequest(res, 'Incorrect password');
            return;
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                updatedAt: new Date()
            }
        });

        ApiResponse.success(res, null, 'Account deactivated successfully');
    } catch (error: any) {
        console.error('Deactivate account error:', error);
        ApiResponse.serverError(res, 'Failed to deactivate account');
    }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const result = await getAllUsersService(req.query as any);
        ApiResponse.successWithPagination(
            res,
            result.users,
            result.pagination,
            'Users retrieved successfully'
        );
    } catch (error: any) {
        console.error('Get all users error:', error);
        ApiResponse.serverError(res, 'Failed to retrieve users');
    }
};