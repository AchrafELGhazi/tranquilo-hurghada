import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';

export interface DateValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateBookingDates = (checkIn: Date, checkOut: Date): DateValidationResult => {
    const now = new Date();

    // Reset time to start of day for comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const checkInDate = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
    const checkOutDate = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());

    // Check if dates are valid
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        return { isValid: false, error: 'Invalid date format' };
    }

    // Check if check-in is in the past
    if (checkInDate < today) {
        return { isValid: false, error: 'Check-in date cannot be in the past' };
    }

    // Check if check-out is after check-in
    if (checkOutDate <= checkInDate) {
        return { isValid: false, error: 'Check-out date must be after check-in date' };
    }

    // Check if booking is too far in advance (e.g., max 2 years)
    const maxAdvanceDate = new Date();
    maxAdvanceDate.setFullYear(maxAdvanceDate.getFullYear() + 2);
    if (checkInDate > maxAdvanceDate) {
        return { isValid: false, error: 'Booking cannot be made more than 2 years in advance' };
    }

    // Check minimum stay (at least 1 night)
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 1) {
        return { isValid: false, error: 'Minimum stay is 1 night' };
    }

    // Check maximum stay (e.g., max 30 days)
    if (diffDays > 30) {
        return { isValid: false, error: 'Maximum stay is 30 days' };
    }

    return { isValid: true };
};

export const checkVillaAvailability = async (
    villaId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string
): Promise<boolean> => {
    try {
        // Convert to UTC to ensure consistent timezone handling
        const checkInUTC = new Date(checkIn.toISOString());
        const checkOutUTC = new Date(checkOut.toISOString());

        // Build where clause - Fix: Use proper array of allowed statuses
        const allowedStatuses = ['PENDING', 'CONFIRMED'] as const;

        const where: any = {
            villaId,
            status: {
                in: allowedStatuses
            },
            OR: [
                // New booking starts during existing booking
                {
                    AND: [
                        { checkIn: { lte: checkInUTC } },
                        { checkOut: { gt: checkInUTC } }
                    ]
                },
                // New booking ends during existing booking
                {
                    AND: [
                        { checkIn: { lt: checkOutUTC } },
                        { checkOut: { gte: checkOutUTC } }
                    ]
                },
                // New booking completely encompasses existing booking
                {
                    AND: [
                        { checkIn: { gte: checkInUTC } },
                        { checkOut: { lte: checkOutUTC } }
                    ]
                },
                // Existing booking completely encompasses new booking
                {
                    AND: [
                        { checkIn: { lte: checkInUTC } },
                        { checkOut: { gte: checkOutUTC } }
                    ]
                }
            ]
        };

        // Exclude specific booking if provided (for updates)
        if (excludeBookingId) {
            where.id = { not: excludeBookingId };
        }

        const conflictingBookings = await prisma.booking.findMany({ where });

        return conflictingBookings.length === 0;
    } catch (error) {
        console.error('Error checking villa availability:', error);
        throw new Error('Failed to check villa availability');
    }
};

export const calculateTotalPrice = (pricePerNight: Decimal, checkIn: Date, checkOut: Date): Decimal => {
    try {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (numberOfNights <= 0) {
            throw new Error('Invalid booking duration');
        }

        return new Decimal(pricePerNight).mul(numberOfNights);
    } catch (error) {
        console.error('Error calculating total price:', error);
        throw new Error('Failed to calculate total price');
    }
};

export const getDaysBetweenDates = (startDate: Date, endDate: Date): number => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatBookingDateRange = (checkIn: Date, checkOut: Date): string => {
    try {
        const checkInStr = checkIn.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const checkOutStr = checkOut.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return `${checkInStr} - ${checkOutStr}`;
    } catch (error) {
        console.error('Error formatting date range:', error);
        return `${checkIn.toISOString().split('T')[0]} - ${checkOut.toISOString().split('T')[0]}`;
    }
};

export const isBookingCancellable = (booking: { checkIn: Date; status: string }): boolean => {
    const now = new Date();
    const allowedStatuses = ['PENDING', 'CONFIRMED'];

    return allowedStatuses.includes(booking.status) && booking.checkIn > now;
};

export const isBookingConfirmable = (booking: { status: string }): boolean => {
    return booking.status === 'PENDING';
};

export const isBookingCompletable = (booking: { checkOut: Date; status: string }): boolean => {
    const now = new Date();
    return booking.status === 'CONFIRMED' && booking.checkOut <= now;
};

export const getBookingStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
        PENDING: '#f59e0b', // amber
        CONFIRMED: '#10b981', // emerald
        CANCELLED: '#ef4444', // red
        REJECTED: '#f43f5e', // rose
        COMPLETED: '#8b5cf6' // violet
    };

    return statusColors[status] || '#6b7280'; // gray as default
};

export const parseQueryDates = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
};

export const buildDateRangeFilter = (startDate?: Date, endDate?: Date) => {
    if (!startDate && !endDate) return undefined;

    const filter: any = {};

    if (startDate) {
        filter.gte = startDate;
    }

    if (endDate) {
        filter.lte = endDate;
    }

    return filter;
};

export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string } => {
    if (!phone || typeof phone !== 'string') {
        return { isValid: false, error: 'Phone number is required' };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{8,14}$/;

    if (!phoneRegex.test(cleanPhone)) {
        return {
            isValid: false,
            error: 'Phone number must be 9-15 digits long and can include country code'
        };
    }

    return { isValid: true };
};

export const validateDateOfBirth = (dateOfBirth: string | Date): { isValid: boolean; error?: string; age?: number } => {
    let dobDate: Date;

    if (typeof dateOfBirth === 'string') {
        dobDate = new Date(dateOfBirth);
    } else {
        dobDate = dateOfBirth;
    }

    if (isNaN(dobDate.getTime())) {
        return { isValid: false, error: 'Invalid date of birth format' };
    }

    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;

    if (finalAge < 18) {
        return { isValid: false, error: 'You must be at least 18 years old to make a booking' };
    }

    if (finalAge > 120) {
        return { isValid: false, error: 'Invalid date of birth' };
    }

    if (dobDate > today) {
        return { isValid: false, error: 'Date of birth cannot be in the future' };
    }

    return { isValid: true, age: finalAge };
};