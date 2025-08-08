import { Response } from 'express';
import bcrypt from 'bcrypt';
import {
    updateUserProfile,
    getUserProfile,
    checkUserProfileComplete
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
        const { phone, dateOfBirth, fullName, email } = req.body;

        const updateData: any = {};

        if (phone !== undefined) updateData.phone = phone;
        if (fullName !== undefined) updateData.fullName = fullName;
        if (email !== undefined) updateData.email = email;
        if (dateOfBirth !== undefined) {
            updateData.dateOfBirth = new Date(dateOfBirth);
        }

        const updatedUser = await updateUserProfile(userId, updateData);

        ApiResponse.success(res, updatedUser, 'Profile updated successfully');
    } catch (error: any) {
        console.error('Update profile error:', error);

        if (error.message.includes('Invalid phone number format') ||
            error.message.includes('Invalid email format') ||
            error.message.includes('Full name must be at least 2 characters') ||
            error.message.includes('User must be at least 18 years old') ||
            error.message.includes('Invalid date of birth')) {
            ApiResponse.badRequest(res, error.message);
        } else if (error.message === 'Email is already in use by another user') {
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
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            ApiResponse.badRequest(res, 'Current password, new password, and confirm password are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            ApiResponse.badRequest(res, 'New password and confirm password do not match');
            return;
        }

        if (newPassword.length < 8) {
            ApiResponse.badRequest(res, 'New password must be at least 8 characters long');
            return;
        }

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

        if (!password) {
            ApiResponse.badRequest(res, 'Password is required to deactivate account');
            return;
        }

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
        const users = await prisma.user.findMany({
            where: { isActive: true },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                isActive: true,
                dateOfBirth: true,
                createdAt: true,
                updatedAt: true
            }
        })
        ApiResponse.success(res, users, 'All users retrieved successfully');

    } catch (error: any) {
        console.error('Get all users error:', error);
        ApiResponse.serverError(res, 'Failed to retrieve users');
    }
}