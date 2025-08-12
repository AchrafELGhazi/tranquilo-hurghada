import { z } from 'zod';
import { VillaStatus } from '@prisma/client';

const baseVillaSchema = {
    title: z.string()
        .min(3, 'Villa title must be at least 3 characters')
        .max(200, 'Villa title cannot exceed 200 characters')
        .trim(),
    description: z.string()
        .max(2000, 'Description cannot exceed 2000 characters')
        .trim()
        .optional()
        .nullable(),
    address: z.string()
        .min(5, 'Address must be at least 5 characters')
        .max(300, 'Address cannot exceed 300 characters')
        .trim(),
    city: z.string()
        .min(2, 'City must be at least 2 characters')
        .max(100, 'City cannot exceed 100 characters')
        .trim(),
    country: z.string()
        .min(2, 'Country must be at least 2 characters')
        .max(100, 'Country cannot exceed 100 characters')
        .trim(),
    pricePerNight: z.number()
        .positive('Price per night must be positive')
        .max(10000, 'Price per night cannot exceed 10,000')
        .multipleOf(0.01, 'Price must have at most 2 decimal places'),
    maxGuests: z.number()
        .int('Max guests must be a whole number')
        .min(1, 'Must accommodate at least 1 guest')
        .max(50, 'Cannot accommodate more than 50 guests'),
    bedrooms: z.number()
        .int('Bedrooms must be a whole number')
        .min(1, 'Must have at least 1 bedroom')
        .max(20, 'Cannot have more than 20 bedrooms'),
    bathrooms: z.number()
        .int('Bathrooms must be a whole number')
        .min(1, 'Must have at least 1 bathroom')
        .max(20, 'Cannot have more than 20 bathrooms'),
    amenities: z.array(z.string().trim())
        .max(50, 'Cannot have more than 50 amenities')
        .default([])
        .optional(),
    images: z.array(z.string().url('Each image must be a valid URL'))
        .max(20, 'Cannot have more than 20 images')
        .default([])
        .optional()
};

export const createVillaSchema = z.object({
    body: z.object({
        ...baseVillaSchema,
        title: baseVillaSchema.title,
        address: baseVillaSchema.address,
        city: baseVillaSchema.city,
        country: baseVillaSchema.country,
        pricePerNight: baseVillaSchema.pricePerNight,
        maxGuests: baseVillaSchema.maxGuests,
        bedrooms: baseVillaSchema.bedrooms,
        bathrooms: baseVillaSchema.bathrooms
    })
});

export const updateVillaSchema = z.object({
    body: z.object({
        title: baseVillaSchema.title.optional(),
        description: baseVillaSchema.description,
        address: baseVillaSchema.address.optional(),
        city: baseVillaSchema.city.optional(),
        country: baseVillaSchema.country.optional(),
        pricePerNight: baseVillaSchema.pricePerNight.optional(),
        maxGuests: baseVillaSchema.maxGuests.optional(),
        bedrooms: baseVillaSchema.bedrooms.optional(),
        bathrooms: baseVillaSchema.bathrooms.optional(),
        amenities: baseVillaSchema.amenities,
        images: baseVillaSchema.images,
        status: z.nativeEnum(VillaStatus).optional(),
        isActive: z.boolean().optional()
    }),
    params: z.object({
        villaId: z.string()
            .min(1, 'Villa ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid villa ID format')
    })
});

// FIXED: Remove the nested 'query' wrapper for query validation
export const villaQuerySchema = z.object({
    // Location filters
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),

    // Price filters
    minPrice: z.coerce.number()
        .positive('Minimum price must be positive')
        .optional(),
    maxPrice: z.coerce.number()
        .positive('Maximum price must be positive')
        .optional(),

    // Capacity filters
    maxGuests: z.coerce.number()
        .int('Max guests must be a whole number')
        .positive('Max guests must be positive')
        .optional(),
    minBedrooms: z.coerce.number()
        .int('Min bedrooms must be a whole number')
        .positive('Min bedrooms must be positive')
        .optional(),
    minBathrooms: z.coerce.number()
        .int('Min bathrooms must be a whole number')
        .positive('Min bathrooms must be positive')
        .optional(),

    // Amenities filter (comma-separated string)
    amenities: z.string()
        .transform(val => val.split(',').map(a => a.trim()).filter(Boolean))
        .optional(),

    // Date filters for availability
    checkIn: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-in date must be in YYYY-MM-DD format')
        .transform(val => new Date(val))
        .optional(),
    checkOut: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Check-out date must be in YYYY-MM-DD format')
        .transform(val => new Date(val))
        .optional(),

    // Villa status and ownership
    status: z.nativeEnum(VillaStatus).optional(),
    ownerId: z.string().optional(),
    isActive: z.coerce.boolean().optional(),

    // Pagination
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

    // Sorting
    sortBy: z.enum(['title', 'pricePerNight', 'maxGuests', 'bedrooms', 'createdAt'])
        .default('createdAt')
        .optional(),
    sortOrder: z.enum(['asc', 'desc'])
        .default('desc')
        .optional()
}).refine(data => {
    // Custom validation: checkOut must be after checkIn
    if (data.checkIn && data.checkOut) {
        return data.checkOut > data.checkIn;
    }
    return true;
}, {
    message: 'Check-out date must be after check-in date',
    path: ['checkOut']
}).refine(data => {
    // Custom validation: maxPrice must be greater than minPrice
    if (data.minPrice && data.maxPrice) {
        return data.maxPrice >= data.minPrice;
    }
    return true;
}, {
    message: 'Maximum price must be greater than or equal to minimum price',
    path: ['maxPrice']
});

// Villa params schema for single villa operations
export const villaParamsSchema = z.object({
    params: z.object({
        villaId: z.string()
            .min(1, 'Villa ID is required')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid villa ID format')
    })
});

// Villa availability query schema - FIXED: Remove nested query wrapper
export const villaAvailabilitySchema = z.object({
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

// Export types for use in controllers
export type CreateVillaInput = z.infer<typeof createVillaSchema>;
export type UpdateVillaInput = z.infer<typeof updateVillaSchema>;
export type VillaQueryInput = z.infer<typeof villaQuerySchema>;
export type VillaParamsInput = z.infer<typeof villaParamsSchema>;
export type VillaAvailabilityInput = z.infer<typeof villaAvailabilitySchema>;