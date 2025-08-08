import type { User } from "@/types/user.types";
import apiService from "@/utils/api";

export interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        user: User;
    };
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
    constructor() {
        apiService.setAuthHandlers(
            () => this.getAccessToken(),
            () => this.refreshToken(),
            () => this.clearAuthData()
        );
    }

    private storeUserData(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getUserFromStorage(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    private storeTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        apiService.setAuthToken(accessToken);
    }

    clearAuthData(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        apiService.clearAuthToken();
    }

    async register(data: RegisterData): Promise<User> {
        const response = await apiService.post<any>('/auth/register', data);
        console.log('Registration response:', response);
        if (response.success && response.data) {
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
            this.storeUserData(response.data.user);
            return response.data.user;
        }
        throw new Error(response.message || 'Registration failed');
    }

    async login(data: LoginData): Promise<User> {
        const response = await apiService.post<any>('/auth/login', data);
        console.log('Login response:', response);
        console.log('Response data:', response.data);
        console.log('Response success:', response.success);
        console.log('Response message:', response.message);
        if (response.success && response.data) {
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
            this.storeUserData(response.data.user);
            return response.data.user;
        }
        throw new Error(response.message || 'Login failed');
    }

    async logout(): Promise<void> {
        try {
            await apiService.post('/auth/logout');
        } catch (error) {
            console.warn('Server logout failed, clearing local data anyway');
        } finally {
            this.clearAuthData();
        }
    }

    async refreshToken(): Promise<string> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await apiService.post<any>('/auth/refresh-token', { refreshToken });
        console.log('Refresh token response:', response);
        if (response.success && response.data) {
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
            this.storeUserData(response.data.user);
            return response.data.accessToken;
        }

        throw new Error(response.message || 'Token refresh failed');
    }

    async getCurrentUser(): Promise<User> {
        const response = await apiService.get<any>('/auth/me');

        if (response.success && response.data) {
            this.storeUserData(response.data.user);
            return response.data.user;
        }

        throw new Error(response.message || 'Failed to get user');
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        const user = this.getUserFromStorage();
        return !!(token && user);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

export const authApi = new AuthApi();
export default authApi;