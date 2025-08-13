import apiService from "@/utils/api";
import { POPULAR_AMENITIES, POPULAR_CITIES } from "@/utils/constants";
import type { Villa, VillaStatus, Service } from "@/utils/types";

export interface VillaFilters {
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    amenities?: string[];
    status?: VillaStatus;
    ownerId?: string;
    isActive?: boolean;
    checkIn?: string;
    checkOut?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'pricePerNight' | 'maxGuests' | 'bedrooms' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface MyVillaFilters {
    status?: VillaStatus;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'pricePerNight' | 'maxGuests' | 'bedrooms' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface CreateVillaData {
    title: string;
    description?: string;
    address: string;
    city: string;
    country?: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities?: string[];
    images?: string[];
    serviceIds?: string[]; // Added serviceIds for creation
}

export interface UpdateVillaData {
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;
    pricePerNight?: number;
    maxGuests?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    images?: string[];
    status?: VillaStatus;
    isActive?: boolean;
    serviceIds?: string[]; // Added serviceIds for updates
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface VillasResponse {
    villas: Villa[];
    pagination: PaginationInfo;
}

export interface VillaAvailabilityParams {
    year?: number;
    month?: number;
}

export interface VillaAvailabilityResponse {
    villaId: string;
    villaTitle: string;
    isActive: boolean;
    status: VillaStatus;
    dateRange: {
        start: string;
        end: string;
    };
    unavailableDates: string[];
    totalUnavailableDays: number;
    bookings: Array<{
        checkIn: string;
        checkOut: string;
        status: string;
    }>;
}

export interface VillaServicesResponse {
    villaId: string;
    villaTitle: string;
    totalServices: number;
    services: Service[];
    servicesByCategory: Record<string, Service[]>;
    categories: string[];
}

export interface VillaStatisticsResponse {
    villaId: string;
    villaTitle: string;
    totalBookings: number;
    completedBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    totalServices: number;
    totalRevenue: number;
    averageBookingValue: number;
    occupancyRate: number;
    period: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationInfo;
}

class VillaApi {
    /**
     * Get all villas with filters (public endpoint)
     */
    async getAllVillas(filters?: VillaFilters): Promise<VillasResponse> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'amenities' && Array.isArray(value)) {
                        queryParams.append(key, value.join(','));
                    } else {
                        queryParams.append(key, value.toString());
                    }
                }
            });
        }

        const url = `/villas${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<Villa[]>(url) as ApiResponse<Villa[]>;

        if (response.success && response.data) {
            return {
                villas: response.data,
                pagination: response.pagination!
            };
        }

        throw new Error(response.message || 'Failed to get villas');
    }

    /**
     * Get current user's villas (hosts and admins only)
     */
    async getMyVillas(filters?: MyVillaFilters): Promise<VillasResponse> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const url = `/villas/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<VillasResponse>(url);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get your villas');
    }

    /**
     * Create a new villa (hosts and admins only)
     */
    async createVilla(data: CreateVillaData): Promise<Villa> {
        if (!data || Object.keys(data).length === 0) {
            throw new Error('Villa data is required');
        }

        const response = await apiService.post<Villa>('/villas', data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to create villa');
    }

    /**
     * Get specific villa details by ID (public endpoint)
     */
    async getVillaById(villaId: string): Promise<Villa> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const response = await apiService.get<Villa>(`/villas/${villaId}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa details');
    }

    /**
     * Get villa availability calendar
     */
    async getVillaAvailability(villaId: string, params?: VillaAvailabilityParams): Promise<VillaAvailabilityResponse> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const queryParams = new URLSearchParams();

        if (params?.year) {
            queryParams.append('year', params.year.toString());
        }

        if (params?.month) {
            queryParams.append('month', params.month.toString());
        }

        const url = `/villas/${villaId}/availability${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<VillaAvailabilityResponse>(url);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa availability');
    }

    /**
     * Get all services available for a villa
     */
    async getVillaServices(villaId: string): Promise<VillaServicesResponse> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const response = await apiService.get<VillaServicesResponse>(`/villas/${villaId}/services`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa services');
    }

    /**
     * Get villa statistics and analytics (villa owner and admins only)
     */
    async getVillaStatistics(villaId: string): Promise<VillaStatisticsResponse> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const response = await apiService.get<VillaStatisticsResponse>(`/villas/${villaId}/statistics`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa statistics');
    }

    /**
     * Update villa details (villa owners and admins only)
     */
    async updateVilla(villaId: string, data: UpdateVillaData): Promise<Villa> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        if (!data || Object.keys(data).length === 0) {
            throw new Error('Update data is required');
        }

        const response = await apiService.put<Villa>(`/villas/${villaId}`, data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to update villa');
    }

    /**
     * Delete villa (admins only) - soft delete
     */
    async deleteVilla(villaId: string): Promise<Villa> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const response = await apiService.delete<Villa>(`/villas/${villaId}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to delete villa');
    }

 



}

export const villaApi = new VillaApi();
export default villaApi;