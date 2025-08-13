import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
}

class ApiService {
    private api: AxiosInstance;
    private authToken: string | null = null;

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
        // Request interceptor - add auth token
        this.api.interceptors.request.use(
            (config) => {
                if (this.authToken) {
                    config.headers.Authorization = `Bearer ${this.authToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle errors simply
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
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
        );
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