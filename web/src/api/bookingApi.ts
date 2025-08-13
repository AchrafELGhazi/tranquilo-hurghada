import apiService from "@/utils/api";
import type { Booking, BookingStatus, PaymentMethod, UserRole, Service } from "@/utils/types";

export interface ServiceSelection {
    serviceId: string;
    quantity?: number;
    scheduledDate?: string;
    scheduledTime?: string;
    specialRequests?: string;
    numberOfGuests?: number;
}

export interface CreateBookingData {
    villaId: string;
    checkIn: string;
    checkOut: string;
    totalAdults: number;
    totalChildren?: number;
    paymentMethod: PaymentMethod;
    phone: string;
    dateOfBirth: string;
    notes?: string;
    selectedServices?: ServiceSelection[];
}

export interface BookingFilters {
    status?: BookingStatus;
    villaId?: string;
    guestId?: string;
    ownerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface BookingsResponse {
    bookings: Booking[];
    pagination: PaginationInfo;
}

export interface BookingActionData {
    rejectionReason?: string;
    cancellationReason?: string;
}

export interface VillaBookedDatesParams {
    year?: number;
    month?: number;
}

export interface VillaBookedDatesResponse {
    villaId: string;
    villaTitle: string;
    dateRange: {
        start: string;
        end: string;
    };
    bookedDates: string[];
}

export interface VillaServicesResponse {
    villaId: string;
    villaTitle: string;
    services: Service[];
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationInfo;
}

class BookingApi {
    /**
     * Create a new booking request with services
     */
    async createBooking(data: CreateBookingData): Promise<Booking> {
        const response = await apiService.post<Booking>('/bookings', data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to create booking');
    }

    /**
     * Get all bookings with filters (role-based access)
     */
    async getAllBookings(filters?: BookingFilters): Promise<any> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const url = `/bookings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<BookingsResponse>(url);

        if (response.success && response.data) {
            return response;
        }

        throw new Error(response.message || 'Failed to get bookings');
    }

    /**
     * Get current user's bookings
     */
    async getMyBookings(filters?: Omit<BookingFilters, 'guestId' | 'ownerId' | 'villaId'>): Promise<any> {
        const queryParams = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });
        }

        const url = `/bookings/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<BookingsResponse>(url);

        if (response.success && response.data) {
            return response;
        }

        throw new Error(response.message || 'Failed to get your bookings');
    }

    /**
     * Get villa booked dates for calendar/date picker
     */
    async getVillaBookedDates(villaId: string, params?: VillaBookedDatesParams): Promise<VillaBookedDatesResponse> {
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

        const url = `/bookings/villa/${villaId}/booked-dates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await apiService.get<VillaBookedDatesResponse>(url);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa booked dates');
    }

    /**
     * Get specific booking details by ID
     */
    async getBookingById(bookingId: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const response = await apiService.get<Booking>(`/bookings/${bookingId}`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get booking details');
    }

    /**
     * Update booking services (for pending bookings only)
     */
    async updateBookingServices(bookingId: string, selectedServices: ServiceSelection[]): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/services`, {
            selectedServices
        });

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to update booking services');
    }

    /**
     * Confirm a booking (hosts and admins only)
     */
    async confirmBooking(bookingId: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/confirm`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to confirm booking');
    }

    /**
     * Reject a booking (hosts and admins only)
     */
    async rejectBooking(bookingId: string, rejectionReason?: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const data: BookingActionData = {};
        if (rejectionReason) {
            data.rejectionReason = rejectionReason;
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/reject`, data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to reject booking');
    }

    /**
     * Cancel a booking (guests, hosts, and admins)
     */
    async cancelBooking(bookingId: string, cancellationReason?: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const data: BookingActionData = {};
        if (cancellationReason) {
            data.cancellationReason = cancellationReason;
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/cancel`, data);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to cancel booking');
    }

    /**
     * Toggle booking payment status (villa owners and admins only)
     */
    async toggleBookingPaymentStatus(bookingId: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/toggle-payment`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to toggle booking payment status');
    }

    /**
     * Complete a booking (admins only)
     */
    async completeBooking(bookingId: string): Promise<Booking> {
        if (!bookingId) {
            throw new Error('Booking ID is required');
        }

        const response = await apiService.put<Booking>(`/bookings/${bookingId}/complete`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to complete booking');
    }
}

export const bookingApi = new BookingApi();
export default bookingApi;