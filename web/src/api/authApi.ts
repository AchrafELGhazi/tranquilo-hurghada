import apiService from "@/utils/api";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'GUEST' | 'HOST' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'GUEST' | 'HOST';
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

export interface CurrentUserResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
    };
}

class AuthApi {
    // Store user data in localStorage
    private storeUserData(user: User): void {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Get user data from localStorage
    getUserFromStorage(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    // Store tokens
    private storeTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        apiService.setAuthToken(accessToken);
    }

    // Clear all auth data
    clearAuthData(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        apiService.clearAuthToken();
    }

    async register(data: RegisterData): Promise<User> {
        const response = await apiService.post<AuthResponse>('/auth/register', data);

        if (response.success && response.data) {
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
            this.storeUserData(response.data.user);
            return response.data.user;
        }

        throw new Error(response.message || 'Registration failed');
    }

    async login(data: LoginData): Promise<User> {
        const response = await apiService.post<AuthResponse>('/auth/login', data);

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
            // Continue with logout even if server request fails
            console.warn('Server logout failed, clearing local data anyway');
        } finally {
            this.clearAuthData();
        }
    }

    async refreshToken(): Promise<string> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        const response = await apiService.post<AuthResponse>('/auth/refresh-token', { refreshToken });

        if (response.success && response.data) {
            this.storeTokens(response.data.accessToken, response.data.refreshToken);
            this.storeUserData(response.data.user);
            return response.data.accessToken;
        }

        throw new Error(response.message || 'Token refresh failed');
    }

    async getCurrentUser(): Promise<User> {
        const response = await apiService.get<CurrentUserResponse>('/auth/me');

        if (response.success && response.data) {
            this.storeUserData(response.data.user);
            return response.data.user;
        }

        throw new Error(response.message || 'Failed to get user');
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        const user = this.getUserFromStorage();
        return !!(token && user);
    }

    // Get access token
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

export const authApi = new AuthApi();
export default authApi;