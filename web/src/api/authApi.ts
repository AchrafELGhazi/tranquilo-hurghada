import apiService from "@/utils/api";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    user?: User;
    message?: string;
    success: boolean;
    data: {
        accessToken: string;
        refreshToken?: string;
    }
}

class AuthApi {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await apiService.post<AuthResponse>('/auth/register', data);
        this.storeTokens(response);
        return response;
    }

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await apiService.post<AuthResponse>('/auth/login', data);
        this.storeTokens(response);
        return response;
    }

    async logout(): Promise<void> {
        await apiService.post('/auth/logout');
        this.clearTokens();
    }

    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await apiService.post<AuthResponse>('/auth/refresh-token', { refreshToken });
        this.storeTokens(response);
        return response;
    }

    async getCurrentUser(): Promise<User> {
        return apiService.get<User>('/auth/me');
    }

    storeTokens(response: AuthResponse): void {
        if (response.data) {
            localStorage.setItem('accessToken', response.data.accessToken);
            apiService.setAuthToken(response.data.accessToken);
        }
        if (response.data.refreshToken) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
        }
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        apiService.clearAuthToken();
    }
}

export const authApi = new AuthApi();
export default authApi;