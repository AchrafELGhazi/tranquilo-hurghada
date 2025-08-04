import authApi from '@/api/authApi';
import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import i18n from 'i18next';

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
            const token = localStorage.getItem('accessToken');
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
                        const refreshToken = localStorage.getItem('refreshToken');
                        if (refreshToken) {
                            const { accessToken } = await authApi.refreshToken();
                            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            return this.api(originalRequest);
                        }
                    } catch (refreshError) {
                        // If refresh fails, clear tokens and redirect to login
                        authApi.clearTokens();
                        if (!window.location.pathname.includes('/login')) {
                            const currentLang = i18n.language || 'en';
                            window.location.href = `/${currentLang}/login`;
                        }
                        return Promise.reject(refreshError);
                    }
                }

                // For other errors
                if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
                    authApi.clearTokens();
                    const currentLang = i18n.language || 'en';
                    window.location.href = `/${currentLang}/login`;
                }

                return Promise.reject(error);
            }
        );
    }

    setAuthToken(token: string): void {
        localStorage.setItem('accessToken', token);
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        localStorage.removeItem('accessToken');
        delete this.api.defaults.headers.common['Authorization'];
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.get<T>(url, config);
        return response.data;
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.api.post<T>(url, data, config);
        return response.data;
    }

    // ... rest of your methods (put, patch, delete) remain the same
}

export const apiService = new ApiService();
export default apiService;