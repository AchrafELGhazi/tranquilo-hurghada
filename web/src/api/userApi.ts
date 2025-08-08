import apiService from "@/utils/api";
import type { User } from "@/utils/types";

export interface UpdateProfileData {
    email?: string;
    fullName?: string;
    phone?: string;
    dateOfBirth?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ProfileCompleteness {
    isComplete: boolean;
    missing: string[];
}

export interface UserResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface ProfileCompletenessResponse {
    success: boolean;
    message: string;
    data: ProfileCompleteness;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

class UserApi {
    // Get current user profile
    async getProfile(): Promise<User> {
        const response = await apiService.get<any>('/profile');

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get profile');
    }

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<User> {
        const response = await apiService.put<any>('/profile', data);

        if (response.success && response.data) {
            // Update user data in localStorage if it exists
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                const updatedUser = { ...userData, ...response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return response.data;
        }

        throw new Error(response.message || 'Failed to update profile');
    }

    // Change password
    async changePassword(data: ChangePasswordData): Promise<void> {
        const response = await apiService.put<any>('/profile/password', data);

        if (!response.success) {
            throw new Error(response.message || 'Failed to change password');
        }
    }

    // Check if profile is complete
    async checkProfileComplete(): Promise<ProfileCompleteness> {
        const response = await apiService.get<any>('/profile/complete');

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to check profile completeness');
    }

    // Deactivate account
    async deactivateAccount(password: string): Promise<void> {
        const response = await apiService.put<ApiResponse>('/profile/deactivate', { password });

        if (!response.success) {
            throw new Error(response.message || 'Failed to deactivate account');
        }

        // Clear auth data after successful deactivation
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        apiService.clearAuthToken();
    }

    // Utility method to get user from storage (same as auth)
    getUserFromStorage(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Update user data in storage
    private updateUserInStorage(userData: Partial<User>): void {
        const storedUser = this.getUserFromStorage();
        if (storedUser) {
            const updatedUser = { ...storedUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    }

    // Validate profile data before sending
    validateProfileData(data: UpdateProfileData): string[] {
        const errors: string[] = [];

        if (data.email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Invalid email format');
            }
        }

        if (data.fullName !== undefined) {
            if (data.fullName.trim().length < 2) {
                errors.push('Full name must be at least 2 characters');
            }
            if (data.fullName.trim().length > 100) {
                errors.push('Full name must be less than 100 characters');
            }
        }

        if (data.phone !== undefined) {
            const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{8,19}$/;
            if (!phoneRegex.test(data.phone)) {
                errors.push('Invalid phone number format');
            }
        }

        if (data.dateOfBirth !== undefined) {
            const date = new Date(data.dateOfBirth);
            if (isNaN(date.getTime())) {
                errors.push('Invalid date format');
            } else {
                const today = new Date();
                const age = today.getFullYear() - date.getFullYear();
                const monthDiff = today.getMonth() - date.getMonth();
                const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate()) ? age - 1 : age;

                if (finalAge < 18) {
                    errors.push('You must be at least 18 years old');
                }
                if (finalAge > 120) {
                    errors.push('Invalid date of birth');
                }
            }
        }

        return errors;
    }

    // Validate password data
    validatePasswordData(data: ChangePasswordData): string[] {
        const errors: string[] = [];

        if (!data.currentPassword) {
            errors.push('Current password is required');
        }

        if (!data.newPassword) {
            errors.push('New password is required');
        } else {
            if (data.newPassword.length < 8) {
                errors.push('New password must be at least 8 characters');
            }
            if (data.newPassword.length > 128) {
                errors.push('New password must be less than 128 characters');
            }

            const hasLowercase = /[a-z]/.test(data.newPassword);
            const hasUppercase = /[A-Z]/.test(data.newPassword);
            const hasDigit = /\d/.test(data.newPassword);

            if (!hasLowercase || !hasUppercase || !hasDigit) {
                errors.push('New password must contain at least one lowercase letter, one uppercase letter, and one number');
            }
        }

        if (!data.confirmPassword) {
            errors.push('Confirm password is required');
        } else if (data.confirmPassword !== data.newPassword) {
            errors.push('Passwords do not match');
        }

        return errors;
    }

    // Get profile with error handling
    async getProfileSafe(): Promise<User | null> {
        try {
            return await this.getProfile();
        } catch (error) {
            console.error('Failed to get profile:', error);
            return null;
        }
    }

    // Update profile with validation
    async updateProfileSafe(data: UpdateProfileData): Promise<{ success: boolean; user?: User; errors?: string[] }> {
        const validationErrors = this.validateProfileData(data);
        if (validationErrors.length > 0) {
            return { success: false, errors: validationErrors };
        }

        try {
            const user = await this.updateProfile(data);
            return { success: true, user };
        } catch (error: any) {
            return { success: false, errors: [error.message || 'Failed to update profile'] };
        }
    }

    // Change password with validation
    async changePasswordSafe(data: ChangePasswordData): Promise<{ success: boolean; errors?: string[] }> {
        const validationErrors = this.validatePasswordData(data);
        if (validationErrors.length > 0) {
            return { success: false, errors: validationErrors };
        }

        try {
            await this.changePassword(data);
            return { success: true };
        } catch (error: any) {
            return { success: false, errors: [error.message || 'Failed to change password'] };
        }
    }
}

export const userApi = new UserApi();
export default userApi;