import { colorMap, statusMap } from "@/utils/constants";
import type { Booking, BookingStatus, PaymentMethod, UserRole } from "@/utils/types";

export const calculateNights = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateTotalPrice = (pricePerNight: number, checkIn: string, checkOut: string): number => {
    const nights = calculateNights(checkIn, checkOut);
    return pricePerNight * nights;
};

export const formatPrice = (price: number, currency: string = 'EUR'): string => {
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
};

/**
 * Utility method to format dates for API calls
 */
export const formatDateForApi = (date: Date | string): string => {
    if (typeof date === 'string') {
        return new Date(date).toISOString();
    }
    return date.toISOString();
};


export const validateAge = (dateOfBirth: string): { isValid: boolean; error?: string; age?: number } => {
    if (!dateOfBirth) {
        return { isValid: false, error: 'Date of birth is required' };
    }

    const today = new Date();
    const dobDate = new Date(dateOfBirth);

    // Check if the date is valid
    if (isNaN(dobDate.getTime())) {
        return { isValid: false, error: 'Please enter a valid date' };
    }

    // Check if date is in the future
    if (dobDate > today) {
        return { isValid: false, error: 'Date of birth cannot be in the future' };
    }

    // Calculate age more accurately
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
        age--;
    }

    // Check minimum age requirement
    if (age < 18) {
        return {
            isValid: false,
            error: `You must be 18 or older to make a booking. Current age: ${age} years`,
            age
        };
    }

    // Check maximum reasonable age (optional safeguard)
    if (age > 120) {
        return {
            isValid: false,
            error: 'Please enter a valid date of birth',
            age
        };
    }

    return { isValid: true, age };
};



/**
 * Utility method to validate booking dates
 */
export const validateBookingDates = (checkIn: Date | string, checkOut: Date | string): { isValid: boolean; error?: string } => {
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
};

/**
 * Get booking status color for UI
 */
export const getStatusColor = (status: Booking['status']): string => {
    return colorMap[status] || '#6b7280';
};

/**
 * Get human-readable status text
 */
export const getStatusText = (status: Booking['status']): string => {
    return statusMap[status] || status;
};

/**
 * Check if booking can be cancelled by the current user
 */
export const canCancelBooking = (booking: Booking, currentUserId: string, userRole: UserRole): boolean => {
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
        return false;
    }

    const isGuest = booking.guestId === currentUserId;
    const isVillaOwner = booking.villa?.ownerId === currentUserId;
    const isAdmin = userRole === 'ADMIN';

    return isGuest || isVillaOwner || isAdmin;
};

/**
 * Check if booking can be confirmed/rejected by the current user
 */
export const canManageBooking = (booking: Booking, currentUserId: string, userRole: UserRole): boolean => {
    if (booking.status !== 'PENDING') {
        return false;
    }

    const isVillaOwner = booking.villa?.ownerId === currentUserId;
    const isAdmin = userRole === 'ADMIN';

    return isVillaOwner || isAdmin;
};

/**
 * Check if payment status can be toggled by the current user
 */
export const canTogglePayment = (booking: Booking, currentUserId: string, userRole: UserRole): boolean => {
    if (booking.status !== 'CONFIRMED') {
        return false;
    }

    const isVillaOwner = booking.villa?.ownerId === currentUserId;
    const isAdmin = userRole === 'ADMIN';

    return isVillaOwner || isAdmin;
};

/**
 * Calculate total stay duration in days
 */
export const getStayDuration = (checkIn: string, checkOut: string): number => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get payment status badge color and text
 */
export const getPaymentStatusInfo = (isPaid: boolean): { color: string; text: string; bgColor: string; textColor: string } => {
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
};

/**
 * Get payment method display text
 */
export const getPaymentMethodText = (method: PaymentMethod): string => {
    const methodMap = {
        BANK_TRANSFER: 'Bank Transfer',
        PAYMENT_ON_ARRIVAL: 'Payment on Arrival'
    };

    return methodMap[method] || method;
};

/**
 * Calculate services total price
 */
export const calculateServicesTotal = (bookingServices: Booking['bookingServices']): number => {
    if (!bookingServices || bookingServices.length === 0) {
        return 0;
    }

    return bookingServices.reduce((total, bookingService) => {
        return total + (bookingService.totalPrice || 0);
    }, 0);
};

/**
 * Calculate total booking price including services
 */
export const calculateTotalBookingPrice = (booking: Booking): number => {
    const villaPrice = booking.totalPrice || 0;
    const servicesPrice = calculateServicesTotal(booking.bookingServices);
    return villaPrice + servicesPrice;
};

/**
 * Check if booking is editable (services can be updated)
 */
export const isBookingEditable = (booking: Booking): boolean => {
    return booking.status === 'PENDING';
};

/**
 * Check if booking is cancellable
 */
export const isBookingCancellable = (booking: Booking): boolean => {
    if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
        return false;
    }

    // Check if check-in date is in the future
    const now = new Date();
    const checkInDate = new Date(booking.checkIn);

    return checkInDate > now;
};

/**
 * Get booking actions available for current user
 */
export const getAvailableActions = (booking: Booking, currentUserId: string, userRole: UserRole): {
    canView: boolean;
    canEdit: boolean;
    canCancel: boolean;
    canConfirm: boolean;
    canReject: boolean;
    canTogglePayment: boolean;
    canComplete: boolean;
} => {
    const isGuest = booking.guestId === currentUserId;
    const isVillaOwner = booking.villa?.ownerId === currentUserId;
    const isAdmin = userRole === 'ADMIN';

    const canView = isGuest || isVillaOwner || isAdmin;
    const canEdit = (isGuest || isVillaOwner || isAdmin) && isBookingEditable(booking);
    const canCancel = canCancelBooking(booking, currentUserId, userRole) && isBookingCancellable(booking);
    const canConfirm = canManageBooking(booking, currentUserId, userRole);
    const canReject = canManageBooking(booking, currentUserId, userRole);
    const canTogglePaymentStatus = canTogglePayment(booking, currentUserId, userRole);
    const canComplete = booking.status === 'CONFIRMED' && isAdmin;

    return {
        canView,
        canEdit,
        canCancel,
        canConfirm,
        canReject,
        canTogglePayment: canTogglePaymentStatus,
        canComplete
    };
};

/**
 * Group bookings by status
 */
export const groupBookingsByStatus = (bookings: Booking[]): Record<BookingStatus, Booking[]> => {
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
};

/**
 * Filter bookings by date range
 */
export const filterBookingsByDateRange = (bookings: Booking[], startDate: string, endDate: string): Booking[] => {
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
};

/**
 * Sort bookings by various criteria
 */
export const sortBookings = (bookings: Booking[], sortBy: 'checkIn' | 'checkOut' | 'totalPrice' | 'createdAt' = 'createdAt', order: 'asc' | 'desc' = 'desc'): Booking[] => {
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
                valueA = calculateTotalBookingPrice(a);
                valueB = calculateTotalBookingPrice(b);
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
};