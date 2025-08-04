// @/utils/api.ts
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import authApi from '@/api/authApi';
import i18n from 'i18next';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.initializeInterceptors();
    }

    private initializeInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use((config) => {
            const token = authApi.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If unauthorized and not already retrying
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newToken = await authApi.refreshToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.api(originalRequest);
                    } catch (refreshError) {
                        // If refresh fails, clear auth data
                        authApi.clearAuthData();
                        if (!window.location.pathname.includes('/login')) {
                            const currentLang = i18n.language || 'en';
                            window.location.href = `/${currentLang}/login`;
                        }
                        return Promise.reject(refreshError);
                    }
                }

                // For other 401 errors
                if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
                    authApi.clearAuthData();
                    const currentLang = i18n.language || 'en';
                    window.location.href = `/${currentLang}/login`;
                }

                return Promise.reject(error);
            }
        );
    }

    setAuthToken(token: string): void {
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        delete this.api.defaults.headers.common['Authorization'];
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.put<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.patch<ApiResponse<T>>(url, data, config);
        return this.handleResponse(response);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.delete<ApiResponse<T>>(url, config);
        return this.handleResponse(response);
    }

    private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
        const { data } = response;

        if (!data.success) {
            throw new Error(data.message || 'Request failed');
        }

        if (!data.data) {
            throw new Error('No data returned from server');
        }

        return data.data;
    }
}

export const apiService = new ApiService();
export default apiService;