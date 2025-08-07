import apiService from "@/utils/api";

export interface User {
    id: string;
    fullName: string;
    email: string;
    role?: 'GUEST' | 'HOST' | 'ADMIN';
}

export interface Booking {
    checkIn: string;
    checkOut: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
}

export interface Villa {
    id: string;
    title: string;
    description?: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: User;
    bookings?: Booking[];
}

export interface VillaFilters {
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    amenities?: string[];
    status?: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
    ownerId?: string;
    checkIn?: string; // ISO date string
    checkOut?: string; // ISO date string
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'pricePerNight' | 'maxGuests' | 'bedrooms' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

export interface MyVillaFilters {
    status?: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'pricePerNight' | 'maxGuests' | 'bedrooms' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
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

// API response structure that matches your actual API
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination: PaginationInfo; // Your API always includes pagination
}

// Popular amenities for filtering/forms
export const POPULAR_AMENITIES = [
    'wifi',
    'pool',
    'parking',
    'kitchen',
    'air_conditioning',
    'heating',
    'tv',
    'washing_machine',
    'dishwasher',
    'balcony',
    'garden',
    'terrace',
    'gym',
    'spa',
    'bbq',
    'fireplace',
    'hot_tub',
    'beach_access',
    'mountain_view',
    'city_view'
];

// Popular Moroccan cities for location filtering
export const POPULAR_CITIES = [
    'Marrakech',
    'Casablanca',
    'Fez',
    'Rabat',
    'Agadir',
    'Tangier',
    'Meknes',
    'Ouarzazate',
    'Essaouira',
    'Chefchaouen'
];

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
        console.log('Get all villas response:', response);

        if (response.success && response.data) {
            // Your API returns data as Villa[] directly
            return {
                villas: response.data,
                pagination: response.pagination
            };
        }

        throw new Error(response.message || 'Failed to get villas');
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
     * Search villas by location and dates (convenience method)
     */
    async searchVillas(
        location: string,
        checkIn: string,
        checkOut: string,
        guests?: number,
        options?: Partial<VillaFilters>
    ): Promise<VillasResponse> {
        const filters: VillaFilters = {
            checkIn,
            checkOut,
            ...options
        };

        // Try to determine if location is a city or country
        if (POPULAR_CITIES.includes(location)) {
            filters.city = location;
        } else {
            // Search in both city and country
            filters.city = location;
        }

        if (guests) {
            filters.maxGuests = guests;
        }

        return this.getAllVillas(filters);
    }

    /**
     * Get available villas for specific dates
     */
    async getAvailableVillas(
        checkIn: string,
        checkOut: string,
        guests?: number,
        additionalFilters?: Partial<VillaFilters>
    ): Promise<VillasResponse> {
        const dateValidation = this.validateBookingDates(checkIn, checkOut);
        if (!dateValidation.isValid) {
            throw new Error(dateValidation.error);
        }

        const filters: VillaFilters = {
            checkIn,
            checkOut,
            status: 'AVAILABLE',
            ...additionalFilters
        };

        if (guests) {
            filters.maxGuests = guests;
        }

        return this.getAllVillas(filters);
    }

    /**
     * Get villas by price range
     */
    async getVillasByPriceRange(
        minPrice: number,
        maxPrice: number,
        additionalFilters?: Partial<VillaFilters>
    ): Promise<VillasResponse> {
        if (minPrice < 0 || maxPrice < 0 || minPrice > maxPrice) {
            throw new Error('Invalid price range');
        }

        const filters: VillaFilters = {
            minPrice,
            maxPrice,
            status: 'AVAILABLE',
            ...additionalFilters
        };

        return this.getAllVillas(filters);
    }

    /**
     * Get villas with specific amenities
     */
    async getVillasByAmenities(
        amenities: string[],
        additionalFilters?: Partial<VillaFilters>
    ): Promise<VillasResponse> {
        if (!amenities || amenities.length === 0) {
            throw new Error('At least one amenity is required');
        }

        const filters: VillaFilters = {
            amenities,
            status: 'AVAILABLE',
            ...additionalFilters
        };

        return this.getAllVillas(filters);
    }

    /**
     * Get villas by capacity (bedrooms/bathrooms/guests)
     */
    async getVillasByCapacity(
        capacity: {
            minBedrooms?: number;
            minBathrooms?: number;
            maxGuests?: number;
        },
        additionalFilters?: Partial<VillaFilters>
    ): Promise<VillasResponse> {
        const filters: VillaFilters = {
            status: 'AVAILABLE',
            ...capacity,
            ...additionalFilters
        };

        return this.getAllVillas(filters);
    }

    /**
     * Utility method to validate booking dates
     */
    validateBookingDates(checkIn: Date | string, checkOut: Date | string): { isValid: boolean; error?: string } {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const today = new Date();

        // Reset time to start of day for comparison
        today.setHours(0, 0, 0, 0);
        checkInDate.setHours(0, 0, 0, 0);
        checkOutDate.setHours(0, 0, 0, 0);

        if (isNaN(checkInDate.getTime())) {
            return { isValid: false, error: 'Invalid check-in date format' };
        }

        if (isNaN(checkOutDate.getTime())) {
            return { isValid: false, error: 'Invalid check-out date format' };
        }

        if (checkInDate < today) {
            return { isValid: false, error: 'Check-in date cannot be in the past' };
        }

        if (checkOutDate <= checkInDate) {
            return { isValid: false, error: 'Check-out date must be after check-in date' };
        }

        const maxAdvanceBooking = new Date();
        maxAdvanceBooking.setFullYear(maxAdvanceBooking.getFullYear() + 2);

        if (checkInDate > maxAdvanceBooking) {
            return { isValid: false, error: 'Cannot search more than 2 years in advance' };
        }

        return { isValid: true };
    }

    /**
     * Format date for API calls
     */
    formatDateForApi(date: Date | string): string {
        if (typeof date === 'string') {
            return new Date(date).toISOString().split('T')[0];
        }
        return date.toISOString().split('T')[0];
    }

    /**
     * Calculate nights between dates
     */
    calculateNights(checkIn: string, checkOut: string): number {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Calculate total price for a stay
     */
    calculateTotalPrice(pricePerNight: number, checkIn: string, checkOut: string): number {
        const nights = this.calculateNights(checkIn, checkOut);
        return pricePerNight * nights;
    }

    /**
     * Format price for display
     */
    formatPrice(price: number, currency: string = 'MAD'): string {
        const currencyOptions: Record<string, { locale: string; currency: string }> = {
            MAD: { locale: 'ar-MA', currency: 'MAD' },
            USD: { locale: 'en-US', currency: 'USD' },
            EUR: { locale: 'en-GB', currency: 'EUR' }
        };

        const options = currencyOptions[currency] || currencyOptions.MAD;

        return new Intl.NumberFormat(options.locale, {
            style: 'currency',
            currency: options.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    /**
     * Get villa status color for UI
     */
    getStatusColor(status: Villa['status']): string {
        const colorMap = {
            AVAILABLE: '#10b981', // emerald
            UNAVAILABLE: '#6b7280', // gray
            MAINTENANCE: '#f59e0b' // amber
        };

        return colorMap[status] || '#6b7280';
    }

    /**
     * Get human-readable status text
     */
    getStatusText(status: Villa['status']): string {
        const statusMap = {
            AVAILABLE: 'Available',
            UNAVAILABLE: 'Unavailable',
            MAINTENANCE: 'Under Maintenance'
        };

        return statusMap[status] || status;
    }

    /**
     * Get amenity display name
     */
    getAmenityDisplayName(amenity: string): string {
        const amenityMap: Record<string, string> = {
            wifi: 'Wi-Fi',
            pool: 'Swimming Pool',
            parking: 'Parking',
            kitchen: 'Kitchen',
            air_conditioning: 'Air Conditioning',
            heating: 'Heating',
            tv: 'Television',
            washing_machine: 'Washing Machine',
            dishwasher: 'Dishwasher',
            balcony: 'Balcony',
            garden: 'Garden',
            terrace: 'Terrace',
            gym: 'Gym/Fitness Center',
            spa: 'Spa',
            bbq: 'BBQ/Grill',
            fireplace: 'Fireplace',
            hot_tub: 'Hot Tub',
            beach_access: 'Beach Access',
            mountain_view: 'Mountain View',
            city_view: 'City View'
        };

        return amenityMap[amenity] || amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    /**
     * Group amenities by category
     */
    groupAmenitiesByCategory(amenities: string[]): Record<string, string[]> {
        const categories: Record<string, string[]> = {
            'Basic': ['wifi', 'parking', 'kitchen', 'tv'],
            'Comfort': ['air_conditioning', 'heating', 'washing_machine', 'dishwasher'],
            'Outdoor': ['pool', 'balcony', 'garden', 'terrace', 'bbq'],
            'Luxury': ['spa', 'gym', 'fireplace', 'hot_tub'],
            'Views': ['beach_access', 'mountain_view', 'city_view']
        };

        const grouped: Record<string, string[]> = {};

        Object.entries(categories).forEach(([category, categoryAmenities]) => {
            const matchedAmenities = amenities.filter(amenity =>
                categoryAmenities.includes(amenity)
            );

            if (matchedAmenities.length > 0) {
                grouped[category] = matchedAmenities;
            }
        });

        // Add ungrouped amenities to "Other" category
        const groupedAmenities = Object.values(grouped).flat();
        const otherAmenities = amenities.filter(amenity =>
            !groupedAmenities.includes(amenity)
        );

        if (otherAmenities.length > 0) {
            grouped['Other'] = otherAmenities;
        }

        return grouped;
    }

    /**
     * Check if villa is available for given dates
     */
    isVillaAvailable(villa: Villa, checkIn: string, checkOut: string): boolean {
        if (villa.status !== 'AVAILABLE' || !villa.isActive) {
            return false;
        }

        if (!villa.bookings || villa.bookings.length === 0) {
            return true;
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Check for overlapping bookings with PENDING or CONFIRMED status
        const hasConflict = villa.bookings.some(booking => {
            if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
                return false;
            }

            const bookingCheckIn = new Date(booking.checkIn);
            const bookingCheckOut = new Date(booking.checkOut);

            return (
                (checkInDate >= bookingCheckIn && checkInDate < bookingCheckOut) ||
                (checkOutDate > bookingCheckIn && checkOutDate <= bookingCheckOut) ||
                (checkInDate <= bookingCheckIn && checkOutDate >= bookingCheckOut)
            );
        });

        return !hasConflict;
    }

    /**
     * Get popular filters for search UI
     */
    getPopularFilters(): {
        priceRanges: { label: string; min: number; max: number }[];
        guestCounts: number[];
        amenities: { key: string; label: string; popular: boolean }[];
        cities: string[];
    } {
        return {
            priceRanges: [
                { label: 'Under 500 MAD', min: 0, max: 500 },
                { label: '500-1000 MAD', min: 500, max: 1000 },
                { label: '1000-2000 MAD', min: 1000, max: 2000 },
                { label: '2000+ MAD', min: 2000, max: 10000 }
            ],
            guestCounts: [1, 2, 4, 6, 8, 10, 12],
            amenities: POPULAR_AMENITIES.map(amenity => ({
                key: amenity,
                label: this.getAmenityDisplayName(amenity),
                popular: ['wifi', 'pool', 'parking', 'kitchen', 'air_conditioning'].includes(amenity)
            })),
            cities: POPULAR_CITIES
        };
    }
}

export const villaApi = new VillaApi();
export default villaApi;