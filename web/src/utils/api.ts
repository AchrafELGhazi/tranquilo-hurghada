import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { useParams } from 'react-router-dom';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    user: any;
}

class ApiService {
    private api: AxiosInstance;
    private authToken: string | null = null;
    private isRefreshing = false;
    private refreshPromise: Promise<string> | null = null;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.initializeInterceptors();
    }

    private initializeInterceptors(): void {
        this.api.interceptors.request.use(
            (config) => {
                if (this.authToken) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle errors and token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Handle 401 errors (unauthorized) - potentially expired token
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newAccessToken = await this.handleTokenRefresh();

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        this.handleAuthFailure();
                        return Promise.reject(refreshError);
                    }
                }

                // Handle other errors
                return this.handleApiError(error);
            }
        );
    }

    private async handleTokenRefresh(): Promise<string> {
        // If already refreshing, wait for that promise to complete
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;

        this.refreshPromise = (async () => {
            try {
                const refreshToken = localStorage.getItem('refreshToken');

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Make refresh request without using the interceptor to avoid infinite loop
                const response = await axios.post<ApiResponse<RefreshTokenResponse>>(
                    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
                    { refreshToken },
                    {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 30000
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;

                // Update stored tokens
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Update instance token
                this.setAuthToken(accessToken);

                return accessToken;
            } catch (error) {
                // Clear auth data on refresh failure
                this.clearAuthData();
                throw error;
            } finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    private handleAuthFailure(): void {
        this.clearAuthData();
        const {lang} = useParams()
        window.dispatchEvent(new CustomEvent('auth:failure', {
            detail: { reason: 'token_refresh_failed' }
        }));

        // Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = `/${lang}/login`;
        }
    }

    private clearAuthData(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        this.authToken = null;
    }

    private handleApiError(error: any): Promise<never> {
        // Handle network errors
        if (error.code === 'ERR_NETWORK') {
            throw new Error('Network connection failed');
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out');
        }

        // Handle HTTP errors
        if (error.response) {
            const message = this.extractErrorMessage(error.response);
            throw new Error(message || `Request failed with status ${error.response.status}`);
        }

        // Fallback error
        throw new Error(error.message || 'An unexpected error occurred');
    }

    private extractErrorMessage(response: any): string {
        const data = response.data;

        if (typeof data === 'string') return data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (data?.errors?.[0]) return data.errors[0];
        if (data?.detail) return data.detail;

        return '';
    }

    // Set auth token
    setAuthToken(token: string | null): void {
        this.authToken = token;
    }

    // Clear auth token
    clearAuthToken(): void {
        this.authToken = null;
    }

    private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
        const { data } = response;

        // Handle cases where response doesn't match expected format
        if (typeof data !== 'object' || data === null) {
            return {
                success: true,
                message: 'Success',
                data: data as any
            };
        }

        // For APIs that don't use the success field
        if (data.success === undefined) {
            return {
                success: true,
                message: 'Success',
                data: data as any
            };
        }

        return data;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.api.get<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.api.post<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.api.put<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.api.patch<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.api.delete<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }
}

export const apiService = new ApiService();
export default apiService;