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

export interface GetUsersQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: 'fullName' | 'email' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    isActive?: boolean;
}

export interface PaginationData {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface GetUsersResponse {
    success: boolean;
    message: string;
    data: User[];
    pagination: PaginationData;
}

class UserApi {
    async getProfile(): Promise<User> {
        const response = await apiService.get<any>('/user');

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get profile');
    }

    // Get all users with pagination support
    async getAllUsers(query?: GetUsersQuery): Promise<any> {
        const params = new URLSearchParams();

        if (query?.page) params.append('page', query.page.toString());
        if (query?.limit) params.append('limit', query.limit.toString());
        if (query?.search) params.append('search', query.search);
        if (query?.role) params.append('role', query.role);
        if (query?.sortBy) params.append('sortBy', query.sortBy);
        if (query?.sortOrder) params.append('sortOrder', query.sortOrder);
        if (query?.isActive !== undefined) params.append('isActive', query.isActive.toString());

        const queryString = params.toString();
        const endpoint = queryString ? `/user/all?${queryString}` : '/users';

        const response = await apiService.get<GetUsersResponse>(endpoint);

        if (response.success && response.data) {
            return response;
        }

        throw new Error(response.message || 'Failed to get all users');
    }

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<{ success: boolean; user?: User; errors?: string[] }> {
        try {
            const response = await apiService.put<any>('/user', data);

            if (response.success && response.data) {
                return { success: true, user: response.data };
            } else {
                return { success: false, errors: [response.message || 'Failed to update profile'] };
            }
        } catch (error: any) {
            return { success: false, errors: [error.message || 'Failed to update profile'] };
        }
    }

    // Change password
    async changePassword(data: ChangePasswordData): Promise<{ success: boolean; errors?: string[] }> {
        try {
            const response = await apiService.put<any>('/user/password', data);

            if (response.success) {
                return { success: true };
            } else {
                return { success: false, errors: [response.message || 'Failed to change password'] };
            }
        } catch (error: any) {
            return { success: false, errors: [error.message || 'Failed to change password'] };
        }
    }

    // Check if profile is complete
    async checkProfileComplete(): Promise<ProfileCompleteness> {
        const response = await apiService.get<any>('/user/complete');

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to check profile completeness');
    }

    // Deactivate account
    async deactivateAccount(password: string): Promise<void> {
        const response = await apiService.put<ApiResponse>('/user/deactivate', { password });

        if (!response.success) {
            throw new Error(response.message || 'Failed to deactivate account');
        }

        // Clear auth data after successful deactivation
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        apiService.clearAuthToken();
    }

    // Utility method to get user from storage
    getUserFromStorage(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Get all users with error handling
    async getAllUsersWithErrorHandling(query?: GetUsersQuery): Promise<{ success: boolean; data?: GetUsersResponse; error?: string }> {
        try {
            const data = await this.getAllUsers(query);
            return { success: true, data };
        } catch (error: any) {
            console.error('Failed to get all users:', error);
            return { success: false, error: error.message || 'Failed to get all users' };
        }
    }
}

export const userApi = new UserApi();
export default userApi;