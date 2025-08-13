import apiService from "@/utils/api";
import type { User } from "@/utils/types";

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponseData {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: AuthResponseData;
}

export interface CurrentUserResponseData {
    user: User;
}

export interface CurrentUserResponse {
    success: boolean;
    message: string;
    data: CurrentUserResponseData;
}

class AuthApi {
    // Register user
    async register(data: RegisterData): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/register', data);
    }

    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/login', data);
    }

    // Logout user
    async logout(): Promise<void> {
        await apiService.post('/auth/logout');
    }

    // Refresh token
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/refresh-token', { refreshToken });
    }

    // Get current user
    async getCurrentUser(): Promise<CurrentUserResponse> {
        return await apiService.get<CurrentUserResponseData>('/auth/me');
    }
}

export const authApi = new AuthApi();
export default authApi;