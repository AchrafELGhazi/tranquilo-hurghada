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
    async register(data: RegisterData): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/register', data);
    }

    async login(data: LoginData): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/login', data);
    }

    async logout(): Promise<void> {
        await apiService.post('/auth/logout');
    }

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        return await apiService.post<AuthResponseData>('/auth/refresh-token', { refreshToken });
    }

    async getCurrentUser(): Promise<CurrentUserResponse> {
        return await apiService.get<CurrentUserResponseData>('/auth/me');
    }
}

export const authApi = new AuthApi();
export default authApi;