import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import i18n from 'i18next';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryCondition?: (error: any) => boolean;
}

class ApiService {
    private api: AxiosInstance;
    private getAccessToken: (() => string | null) | null = null;
    private refreshTokenFn: (() => Promise<string>) | null = null;
    private clearAuthDataFn: (() => void) | null = null;
    private isRefreshing = false;
    private failedRequests: Array<(token: string) => void> = [];
    private retryConfig: RetryConfig = {
        maxRetries: 3,
        retryDelay: 1000,
        retryCondition: (error) => {
            return !error.response || (error.response.status >= 500 && error.response.status < 600);
        }
    };

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

    setAuthHandlers(
        getAccessToken: () => string | null,
        refreshToken: () => Promise<string>,
        clearAuthData: () => void
    ): void {
        this.getAccessToken = getAccessToken;
        this.refreshTokenFn = refreshToken;
        this.clearAuthDataFn = clearAuthData;
    }

    setRetryConfig(config: Partial<RetryConfig>): void {
        this.retryConfig = { ...this.retryConfig, ...config };
    }

    private initializeInterceptors(): void {
        // Request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = this.getAccessToken?.();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                return this.handleResponseError(error);
            }
        );
    }

    private async handleResponseError(error: any): Promise<any> {
        // Handle canceled requests
        if (axios.isCancel(error)) {
            throw new Error('Request was canceled');
        }

        // Handle network errors
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
            throw new Error(this.getErrorMessage('network_error', 'Network connection failed'));
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
            throw new Error(this.getErrorMessage('timeout_error', 'Request timed out'));
        }

        const originalRequest = error.config;
        const isLoginPage = this.isLoginPage();

        // Handle 401 Unauthorized - token refresh logic
        if (error.response?.status === 401 && !isLoginPage && !originalRequest._isRetry) {
            return this.handleTokenRefresh(error, originalRequest);
        }

        // Handle other HTTP errors
        if (error.response) {
            const status = error.response.status;
            const message = this.extractErrorMessage(error.response);

            // Handle specific status codes
            switch (status) {
                case 403:
                    throw new Error(this.getErrorMessage('forbidden', 'Access denied'));
                case 404:
                    throw new Error(this.getErrorMessage('not_found', 'Resource not found'));
                case 422:
                    throw new Error(message || this.getErrorMessage('validation_error', 'Validation failed'));
                case 429:
                    throw new Error(this.getErrorMessage('rate_limit', 'Too many requests'));
                case 500:
                    throw new Error(this.getErrorMessage('server_error', 'Server error occurred'));
                default:
                    throw new Error(message || `Request failed with status ${status}`);
            }
        }

        // Fallback error
        throw new Error(error.message || 'An unexpected error occurred');
    }

    private async handleTokenRefresh(_error: any, originalRequest: any): Promise<any> {
        if (!this.refreshTokenFn) {
            // this.redirectToLogin();
            throw new Error('Session expired');
        }

        // If already refreshing, queue the request
        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.failedRequests.push((token) => {
                    try {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(this.api(originalRequest));
                    } catch (err) {
                        reject(err);
                    }
                });
            });
        }

        originalRequest._isRetry = true;
        this.isRefreshing = true;

        try {
            const newToken = await this.refreshTokenFn();

            // Process all queued requests
            this.failedRequests.forEach(callback => {
                try {
                    callback(newToken);
                } catch (err) {
                    console.error('Failed to process queued request:', err);
                }
            });

            this.failedRequests = [];
            this.isRefreshing = false;

            // Retry the original request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.api(originalRequest);

        } catch (refreshError) {
            this.isRefreshing = false;
            this.failedRequests = [];
            this.clearAuthDataFn?.();
            // this.redirectToLogin();
            throw new Error('Session expired - please login again');
        }
    }

    private async retryRequest<T>(config: AxiosRequestConfig, retryCount = 0): Promise<AxiosResponse<ApiResponse<T>>> {
        try {
            return await this.api.request<ApiResponse<T>>(config);
        } catch (error) {
            const shouldRetry = retryCount < this.retryConfig.maxRetries &&
                this.retryConfig.retryCondition?.(error);

            if (shouldRetry) {
                // Exponential backoff
                const delay = this.retryConfig.retryDelay * Math.pow(2, retryCount);
                await this.sleep(delay);
                return this.retryRequest<T>(config, retryCount + 1);
            }

            throw error;
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private isLoginPage(): boolean {
        return typeof window !== 'undefined' &&
            window.location?.pathname?.includes('/signin');
    }

    private redirectToLogin(): void {
        if (typeof window !== 'undefined') {
            const language = i18n.language || 'en';
            window.location.href = `/${language}/signin`;
        }
    }

    private getErrorMessage(key: string, fallback: string): string {
        try {
            return i18n.t(key) || fallback;
        } catch {
            return fallback;
        }
    }

    private extractErrorMessage(response: any): string {
        // Try different common error message formats
        const data = response.data;

        if (typeof data === 'string') return data;
        if (data?.message) return data.message;
        if (data?.error) return data.error;
        if (data?.errors?.[0]) return data.errors[0];
        if (data?.detail) return data.detail;

        return '';
    }

    // Public methods with enhanced error handling
    setAuthToken(token: string): void {
        if (!token || typeof token !== 'string') {
            console.warn('Invalid token provided to setAuthToken');
            return;
        }
        this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    clearAuthToken(): void {
        delete this.api.defaults.headers.common['Authorization'];
    }

    async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
        if (!config.url) {
            throw new Error('Request URL is required');
        }

        try {
            const response = await this.retryRequest<T>(config);
            return this.handleResponse(response);
        } catch (error) {
            throw error;
        }
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'GET', url });
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'POST', url, data });
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PUT', url, data });
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'PATCH', url, data });
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>({ ...config, method: 'DELETE', url });
    }

    private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
        const { data } = response;

        // Handle cases where response doesn't match expected format
        if (typeof data !== 'object' || data === null) {
            throw new Error('Invalid response format');
        }

        // For APIs that don't use the success field
        if (data.success === undefined) {
            return {
                success: true,
                message: 'Success',
                data: data as any
            };
        }

        if (!data.success) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    }

    // Utility method to cancel requests
    createCancelToken() {
        return axios.CancelToken.source();
    }

    // Health check method
    async healthCheck(): Promise<boolean> {
        try {
            await this.get('/health');
            return true;
        } catch {
            return false;
        }
    }
}

export const apiService = new ApiService();
export default apiService;