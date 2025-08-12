import { z } from 'zod';
import { PaymentMethod, BookingStatus } from '@prisma/client';

// Service selection schema
const selectedServiceSchema = z.object({
    serviceId: z.string().min(1, 'Service ID is required'),
    quantity: z.number()
        .int('Quantity must be a whole number')
        .min(1, 'Quantity must be at least 1')
        .max(50, 'Quantity cannot exceed 50')
        .default(1)
        .optional(),
    numberOfGuests: z.number()
        .int('Number of guests must be a whole number')
        .min(1, 'Number of guests must be at least 1')
        .optional(),
    scheduledDate: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Scheduled date must be in YYYY-MM-DD format')
        .transform(val => new Date(val))
        .optional(),
    scheduledTime: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Scheduled time must be in HH:MM format')
        .optional(),
    specialRequests: z.string()
        .max(500, 'Special requests cannot exceed 500 characters')
        .trim()
        .optional()
});

// Create booking schema (updated for new schema)
export const createBookingSchema = z.object({
    body: z.object({
        villaId: z.string()
            .min(1, 'Villa ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid villa ID format'),
        checkIn: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in date must be in YYYY-MM-DD format')
            .transform(val => new Date(val)),
        checkOut: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out date must be in YYYY-MM-DD format')
            .transform(val => new Date(val)),
        totalAdults: z.number()
            .int('Total adults must be a whole number')
            .min(1, 'At least 1 adult is required')
            .max(50, 'Total adults cannot exceed 50'),
        totalChildren: z.number()
            .int('Total children must be a whole number')
            .min(0, 'Total children cannot be negative')
            .max(50, 'Total children cannot exceed 50')
            .default(0),
        paymentMethod: z.nativeEnum(PaymentMethod, {
            message: `Payment method must be one of: ${Object.values(PaymentMethod).join(', ')}`
        }),
        phone: z.string()
            .min(1, 'Phone number is required'),
            // .regex(/^[\+]?[1-9][\d]{8,14}$/, 'Phone number format is invalid'),
        dateOfBirth: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format')
            .transform(val => new Date(val)),
        notes: z.string()
            .max(1000, 'Notes cannot exceed 1000 characters')
            .trim()
            .optional(),
    }).refine(data => {
        // Check-out must be after check-in
        return data.checkOut > data.checkIn;
    }, {
        message: 'Check-out date must be after check-in date',
        path: ['checkOut']
    }).refine(data => {
        // Date of birth validation - must be at least 18 years old
        const today = new Date();
        const age = today.getFullYear() - data.dateOfBirth.getFullYear();
        const monthDiff = today.getMonth() - data.dateOfBirth.getMonth();
        const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < data.dateOfBirth.getDate()) ? age - 1 : age;

        return finalAge >= 18 && finalAge <= 120;
    }, {
        message: 'You must be at least 18 years old to make a booking',
        path: ['dateOfBirth']
    }).refine(data => {
        // Check-in date cannot be in the past (allow same day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return data.checkIn >= today;
    }, {
        message: 'Check-in date cannot be in the past',
        path: ['checkIn']
    }).refine(data => {
        // Total guests validation
        const totalGuests = data.totalAdults + data.totalChildren;
        return totalGuests >= 1 && totalGuests <= 50;
    }, {
        message: 'Total guests (adults + children) must be between 1 and 50',
        path: ['totalAdults']
    })
});

// Update booking services schema
export const updateBookingServicesSchema = z.object({
    body: z.object({
        selectedServices: z.array(selectedServiceSchema)
            .min(1, 'At least one service must be selected')
    }),
    params: z.object({
        bookingId: z.string()
            .min(1, 'Booking ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid booking ID format')
    })
});

// Booking action schemas (confirm, cancel, reject)
export const bookingActionSchema = z.object({
    body: z.object({
        rejectionReason: z.string()
            .max(500, 'Rejection reason cannot exceed 500 characters')
            .trim()
            .optional(),
        cancellationReason: z.string()
            .max(500, 'Cancellation reason cannot exceed 500 characters')
            .trim()
            .optional()
    }),
    params: z.object({
        bookingId: z.string()
            .min(1, 'Booking ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid booking ID format')
    })
});

// Booking params schema
export const bookingParamsSchema = z.object({
    params: z.object({
        bookingId: z.string()
            .min(1, 'Booking ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid booking ID format')
    })
});

// Villa availability params schema
export const villaAvailabilityParamsSchema = z.object({
    params: z.object({
        villaId: z.string()
            .min(1, 'Villa ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid villa ID format')
    }),
    query: z.object({
        year: z.coerce.number()
            .int('Year must be a whole number')
            .min(2020, 'Year must be 2020 or later')
            .max(2030, 'Year cannot be later than 2030')
            .optional(),
        month: z.coerce.number()
            .int('Month must be a whole number')
            .min(1, 'Month must be between 1 and 12')
            .max(12, 'Month must be between 1 and 12')
            .optional()
    }).refine(data => {
        // If month is provided, year must also be provided
        if (data.month && !data.year) {
            return false;
        }
        return true;
    }, {
        message: 'Year is required when month is specified',
        path: ['year']
    })
});

// Booking query schema
export const bookingQuerySchema = z.object({
    query: z.object({
        status: z.nativeEnum(BookingStatus).optional(),
        villaId: z.string().optional(),
        guestId: z.string().optional(),
        ownerId: z.string().optional(),
        startDate: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format')
            .transform(val => new Date(val))
            .optional(),
        endDate: z.string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format')
            .transform(val => new Date(val))
            .optional(),
        page: z.coerce.number()
            .int('Page must be a whole number')
            .positive('Page must be positive')
            .default(1)
            .optional(),
        limit: z.coerce.number()
            .int('Limit must be a whole number')
            .min(1, 'Limit must be at least 1')
            .max(100, 'Limit cannot exceed 100')
            .default(10)
            .optional(),
        sortBy: z.enum(['createdAt', 'checkIn', 'checkOut', 'totalPrice'])
            .default('createdAt')
            .optional(),
        sortOrder: z.enum(['asc', 'desc'])
            .default('desc')
            .optional()
    }).refine(data => {
        // End date must be after start date
        if (data.startDate && data.endDate) {
            return data.endDate > data.startDate;
        }
        return true;
    }, {
        message: 'End date must be after start date',
        path: ['endDate']
    })
});

// Export types
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingServicesInput = z.infer<typeof updateBookingServicesSchema>;
export type BookingActionInput = z.infer<typeof bookingActionSchema>;
export type BookingParamsInput = z.infer<typeof bookingParamsSchema>;
export type VillaAvailabilityParamsInput = z.infer<typeof villaAvailabilityParamsSchema>;
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>;