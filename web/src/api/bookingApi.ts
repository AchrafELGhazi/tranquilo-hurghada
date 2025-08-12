import apiService from "@/utils/api";
import { colorMap, statusMap } from "@/utils/constants";
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
    async getMyBookings(filters?: Omit<BookingFilters, 'guestId' | 'ownerId' | 'villaId'>): Promise<BookingsResponse> {
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
            return response.data;
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
     * Get available services for a villa (for booking creation)
     */
    async getVillaServices(villaId: string): Promise<VillaServicesResponse> {
        if (!villaId) {
            throw new Error('Villa ID is required');
        }

        const response = await apiService.get<VillaServicesResponse>(`/bookings/villa/${villaId}/services`);

        if (response.success && response.data) {
            return response.data;
        }

        throw new Error(response.message || 'Failed to get villa services');
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
        return colorMap[status] || '#6b7280';
    }

    /**
     * Get human-readable status text
     */
    getStatusText(status: Booking['status']): string {
        return statusMap[status] || status;
    }

    /**
     * Check if booking can be cancelled by the current user
     */
    canCancelBooking(booking: Booking, currentUserId: string, userRole: UserRole): boolean {
        if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
            return false;
        }

        const isGuest = booking.guestId === currentUserId;
        const isVillaOwner = booking.villa?.ownerId === currentUserId;
        const isAdmin = userRole === 'ADMIN';

        return isGuest || isVillaOwner || isAdmin;
    }

    /**
     * Check if booking can be confirmed/rejected by the current user
     */
    canManageBooking(booking: Booking, currentUserId: string, userRole: UserRole): boolean {
        if (booking.status !== 'PENDING') {
            return false;
        }

        const isVillaOwner = booking.villa?.ownerId === currentUserId;
        const isAdmin = userRole === 'ADMIN';

        return isVillaOwner || isAdmin;
    }

    /**
     * Check if payment status can be toggled by the current user
     */
    canTogglePayment(booking: Booking, currentUserId: string, userRole: UserRole): boolean {
        if (booking.status !== 'CONFIRMED') {
            return false;
        }

        const isVillaOwner = booking.villa?.ownerId === currentUserId;
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
     * Get payment status badge color and text
     */
    getPaymentStatusInfo(isPaid: boolean): { color: string; text: string; bgColor: string; textColor: string } {
        if (isPaid) {
            return {
                color: 'green',
                text: 'Paid',
                bgColor: 'bg-green-100',
                textColor: 'text-green-800'
            };
        } else {
            return {
                color: 'red',
                text: 'Unpaid',
                bgColor: 'bg-red-100',
                textColor: 'text-red-800'
            };
        }
    }

    /**
     * Get payment method display text
     */
    getPaymentMethodText(method: PaymentMethod): string {
        const methodMap = {
            BANK_TRANSFER: 'Bank Transfer',
            PAYMENT_ON_ARRIVAL: 'Payment on Arrival'
        };

        return methodMap[method] || method;
    }

    /**
     * Calculate services total price
     */
    calculateServicesTotal(bookingServices: Booking['bookingServices']): number {
        if (!bookingServices || bookingServices.length === 0) {
            return 0;
        }

        return bookingServices.reduce((total, bookingService) => {
            return total + (bookingService.totalPrice || 0);
        }, 0);
    }

    /**
     * Calculate total booking price including services
     */
    calculateTotalBookingPrice(booking: Booking): number {
        const villaPrice = booking.totalPrice || 0;
        const servicesPrice = this.calculateServicesTotal(booking.bookingServices);
        return villaPrice + servicesPrice;
    }

    /**
     * Check if booking is editable (services can be updated)
     */
    isBookingEditable(booking: Booking): boolean {
        return booking.status === 'PENDING';
    }

    /**
     * Check if booking is cancellable
     */
    isBookingCancellable(booking: Booking): boolean {
        if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
            return false;
        }

        // Check if check-in date is in the future
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);

        return checkInDate > now;
    }

    /**
     * Get booking actions available for current user
     */
    getAvailableActions(booking: Booking, currentUserId: string, userRole: UserRole): {
        canView: boolean;
        canEdit: boolean;
        canCancel: boolean;
        canConfirm: boolean;
        canReject: boolean;
        canTogglePayment: boolean;
        canComplete: boolean;
    } {
        const isGuest = booking.guestId === currentUserId;
        const isVillaOwner = booking.villa?.ownerId === currentUserId;
        const isAdmin = userRole === 'ADMIN';

        const canView = isGuest || isVillaOwner || isAdmin;
        const canEdit = (isGuest || isVillaOwner || isAdmin) && this.isBookingEditable(booking);
        const canCancel = this.canCancelBooking(booking, currentUserId, userRole) && this.isBookingCancellable(booking);
        const canConfirm = this.canManageBooking(booking, currentUserId, userRole);
        const canReject = this.canManageBooking(booking, currentUserId, userRole);
        const canTogglePayment = this.canTogglePayment(booking, currentUserId, userRole);
        const canComplete = booking.status === 'CONFIRMED' && isAdmin;

        return {
            canView,
            canEdit,
            canCancel,
            canConfirm,
            canReject,
            canTogglePayment,
            canComplete
        };
    }

    /**
     * Group bookings by status
     */
    groupBookingsByStatus(bookings: Booking[]): Record<BookingStatus, Booking[]> {
        const grouped: Record<BookingStatus, Booking[]> = {
            PENDING: [],
            CONFIRMED: [],
            CANCELLED: [],
            REJECTED: [],
            COMPLETED: []
        };

        bookings.forEach(booking => {
            if (grouped[booking.status]) {
                grouped[booking.status].push(booking);
            }
        });

        return grouped;
    }

    /**
     * Filter bookings by date range
     */
    filterBookingsByDateRange(bookings: Booking[], startDate: string, endDate: string): Booking[] {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return bookings.filter(booking => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);

            return (
                (checkIn >= start && checkIn <= end) ||
                (checkOut >= start && checkOut <= end) ||
                (checkIn <= start && checkOut >= end)
            );
        });
    }

    /**
     * Sort bookings by various criteria
     */
    sortBookings(bookings: Booking[], sortBy: 'checkIn' | 'checkOut' | 'totalPrice' | 'createdAt' = 'createdAt', order: 'asc' | 'desc' = 'desc'): Booking[] {
        return [...bookings].sort((a, b) => {
            let valueA: any;
            let valueB: any;

            switch (sortBy) {
                case 'checkIn':
                    valueA = new Date(a.checkIn);
                    valueB = new Date(b.checkIn);
                    break;
                case 'checkOut':
                    valueA = new Date(a.checkOut);
                    valueB = new Date(b.checkOut);
                    break;
                case 'totalPrice':
                    valueA = this.calculateTotalBookingPrice(a);
                    valueB = this.calculateTotalBookingPrice(b);
                    break;
                case 'createdAt':
                default:
                    valueA = new Date(a.createdAt);
                    valueB = new Date(b.createdAt);
                    break;
            }

            if (order === 'asc') {
                return valueA > valueB ? 1 : -1;
            } else {
                return valueA < valueB ? 1 : -1;
            }
        });
    }
}

export const bookingApi = new BookingApi();
export default bookingApi;