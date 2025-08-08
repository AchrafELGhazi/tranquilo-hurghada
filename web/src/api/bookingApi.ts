import type { Booking } from "@/types/bookin.types";
import type { User } from "@/types/user.types";
import apiService from "@/utils/api";

export interface CreateBookingData {
    villaId: string;
    checkIn: string; // ISO date string
    checkOut: string; // ISO date string
    totalGuests: number;
    paymentMethod: 'PAYMENT_ON_ARRIVAL' | 'BANK_TRANSFER';
    phone: string;
    dateOfBirth: string; // ISO date string
    notes?: string;
}

export interface BookingFilters {
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
    villaId?: string;
    guestId?: string;
    ownerId?: string;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
}

export interface BookingsResponse {
    bookings: Booking[];
    pagination: PaginationInfo;
}

export interface BookingActionData {
    rejectionReason?: string;
    cancellationReason?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

class BookingApi {
    /**
     * Create a new booking request
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
    async getAllBookings(filters?: BookingFilters): Promise<BookingsResponse> {
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
            return response.data;
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
        const response = await apiService.get<any>(url);
        // console.log('MyBookings response:', response);
        if (response.success && response.data) {
            return response;
        }

        throw new Error(response.message || 'Failed to get your bookings');
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

    /**
     * Utility method to format dates for API calls
     */
    formatDateForApi(date: Date | string): string {
        if (typeof date === 'string') {
            return new Date(date).toISOString();
        }
        return date.toISOString();
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

        if (checkInDate < today) {
            return { isValid: false, error: 'Check-in date cannot be in the past' };
        }

        if (checkOutDate <= checkInDate) {
            return { isValid: false, error: 'Check-out date must be after check-in date' };
        }

        const maxAdvanceBooking = new Date();
        maxAdvanceBooking.setFullYear(maxAdvanceBooking.getFullYear() + 2);

        if (checkInDate > maxAdvanceBooking) {
            return { isValid: false, error: 'Cannot book more than 2 years in advance' };
        }

        const maxStayDuration = 365; // days
        const stayDuration = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

        if (stayDuration > maxStayDuration) {
            return { isValid: false, error: `Stay duration cannot exceed ${maxStayDuration} days` };
        }

        return { isValid: true };
    }

    /**
     * Get booking status color for UI
     */
    getStatusColor(status: Booking['status']): string {
        const colorMap = {
            PENDING: '#f59e0b', // amber
            CONFIRMED: '#10b981', // emerald
            COMPLETED: '#059669', // emerald-600
            CANCELLED: '#6b7280', // gray
            REJECTED: '#ef4444' // red
        };

        return colorMap[status] || '#6b7280';
    }

    /**
     * Get human-readable status text
     */
    getStatusText(status: Booking['status']): string {
        const statusMap = {
            PENDING: 'Pending Approval',
            CONFIRMED: 'Confirmed',
            COMPLETED: 'Completed',
            CANCELLED: 'Cancelled',
            REJECTED: 'Rejected'
        };

        return statusMap[status] || status;
    }

    /**
     * Check if booking can be cancelled by the current user
     */
    canCancelBooking(booking: Booking, currentUserId: string, userRole: 'GUEST' | 'HOST' | 'ADMIN'): boolean {
        if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
            return false;
        }

        const isGuest = booking.guestId === currentUserId;
        const isVillaOwner = booking.villa.ownerId === currentUserId;
        const isAdmin = userRole === 'ADMIN';

        return isGuest || isVillaOwner || isAdmin;
    }

    /**
     * Check if booking can be confirmed/rejected by the current user
     */
    canManageBooking(booking: Booking, currentUserId: string, userRole: 'GUEST' | 'HOST' | 'ADMIN'): boolean {
        if (booking.status !== 'PENDING') {
            return false;
        }

        const isVillaOwner = booking.villa.ownerId === currentUserId;
        const isAdmin = userRole === 'ADMIN';

        return isVillaOwner || isAdmin;
    }

    /**
     * Calculate total stay duration in days
     */
    getStayDuration(checkIn: string, checkOut: string): number {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Format price for display
     */
    formatPrice(price: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }
}

export const bookingApi = new BookingApi();
export default bookingApi;