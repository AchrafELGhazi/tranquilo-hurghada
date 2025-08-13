import apiService from "@/utils/api";
import type { Service, ServiceCategory, ServiceDifficulty } from "@/utils/types";

export interface ServiceFilters {
    category?: ServiceCategory;
    difficulty?: ServiceDifficulty;
    minPrice?: number;
    maxPrice?: number;
    maxGroupSize?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    villaId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'price' | 'category' | 'difficulty' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface CreateServiceData {
    title: string;
    description: string;
    longDescription?: string;
    category: ServiceCategory;
    price: number;
    duration: string;
    difficulty?: ServiceDifficulty;
    maxGroupSize?: number;
    highlights: string[];
    included: string[];
    image?: string;
    isFeatured?: boolean;
    villaId?: string;
}

export interface UpdateServiceData {
    title?: string;
    description?: string;
    longDescription?: string;
    category?: ServiceCategory;
    price?: number;
    duration?: string;
    difficulty?: ServiceDifficulty;
    maxGroupSize?: number;
    highlights?: string[];
    included?: string[];
    image?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    villaId?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface ServicesResponse {
    services: Service[];
    pagination: PaginationInfo;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationInfo;
}

class ServiceApi {
    /**
     * Get all services with filters
     */
    async getAllServices(filters?: ServiceFilters): Promise<ServicesResponse> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const url = `/service${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<Service[]>(url) as ApiResponse<Service[]>;

        if (response.success && response.data) {
            return {
                services: response.data,
                pagination: response.pagination!
            };
        }

        throw new Error(response.message || 'Failed to get services');
    }

    /**
     * Get specific service details by ID
     */
    async getServiceById(serviceId: string): Promise<Service> {
        if (!serviceId) {
            throw new Error('Service ID is required');
        }

        const response = await apiService.get<Service>(`/service/${serviceId}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get service details');
    }

    /**
     * Create a new service
     */
    async createService(data: CreateServiceData): Promise<Service> {
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Service data is required');
        }

        const response = await apiService.post<Service>('/service', data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to create service');
    }

    /**
     * Update service details
     */
    async updateService(serviceId: string, data: UpdateServiceData): Promise<Service> {
        if (!serviceId) {
            throw new Error('Service ID is required');
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error('Update data is required');
        }

        const response = await apiService.put<Service>(`/service/${serviceId}`, data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to update service');
    }

    /**
     * Delete service (soft delete)
     */
    async deleteService(serviceId: string): Promise<Service> {
        if (!serviceId) {
            throw new Error('Service ID is required');
        }

        const response = await apiService.delete<Service>(`/service/${serviceId}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to delete service');
    }
}

export const serviceApi = new ServiceApi();
export default serviceApi;