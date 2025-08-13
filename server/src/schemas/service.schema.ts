import { z } from 'zod';
import { ServiceCategory, ServiceDifficulty } from '@prisma/client';

// Service query filters schema
export const serviceQuerySchema = z.object({
    query: z.object({
        category: z.nativeEnum(ServiceCategory).optional(),
        difficulty: z.nativeEnum(ServiceDifficulty).optional(),
        minPrice: z.string().transform(Number).refine(val => val >= 0, {
            message: 'Min price must be non-negative'
        }).optional(),
        maxPrice: z.string().transform(Number).refine(val => val >= 0, {
            message: 'Max price must be non-negative'
        }).optional(),
        maxGroupSize: z.string().transform(Number).refine(val => val > 0, {
            message: 'Max group size must be positive'
        }).optional(),
        isActive: z.string().transform(val => val === 'true').optional(),
        isFeatured: z.string().transform(val => val === 'true').optional(),
        villaId: z.string().cuid().optional(),
        page: z.string().transform(Number).refine(val => val > 0, {
            message: 'Page must be positive'
        }).optional(),
        limit: z.string().transform(Number).refine(val => val > 0 && val <= 100, {
            message: 'Limit must be between 1 and 100'
        }).optional(),
        sortBy: z.enum(['title', 'price', 'category', 'difficulty', 'createdAt']).optional(),
        sortOrder: z.enum(['asc', 'desc']).optional()
    }).optional()
});

// Service params schema
export const serviceParamsSchema = z.object({
    params: z.object({
        serviceId: z.string().cuid('Invalid service ID format')
    })
});

// Create service schema
export const createServiceSchema = z.object({
    body: z.object({
        title: z.string()
            .min(3, 'Service title must be at least 3 characters')
            .max(100, 'Service title must not exceed 100 characters')
            .trim(),
        description: z.string()
            .min(10, 'Service description must be at least 10 characters')
            .max(500, 'Service description must not exceed 500 characters')
            .trim(),
        longDescription: z.string()
            .min(50, 'Long description must be at least 50 characters')
            .max(2000, 'Long description must not exceed 2000 characters')
            .trim()
            .optional(),
        category: z.nativeEnum(ServiceCategory),
        price: z.number()
            .min(0, 'Service price must be non-negative')
            .max(10000, 'Service price must not exceed 10,000'),
        duration: z.string()
            .min(1, 'Duration is required')
            .max(50, 'Duration must not exceed 50 characters')
            .trim(),
        difficulty: z.nativeEnum(ServiceDifficulty).optional(),
        maxGroupSize: z.number()
            .int('Max group size must be an integer')
            .min(1, 'Max group size must be at least 1')
            .max(50, 'Max group size must not exceed 50')
            .optional(),
        highlights: z.array(z.string().trim().min(1, 'Highlight cannot be empty'))
            .min(1, 'At least one highlight is required')
            .max(10, 'Maximum 10 highlights allowed'),
        included: z.array(z.string().trim().min(1, 'Included item cannot be empty'))
            .min(1, 'At least one included item is required')
            .max(10, 'Maximum 10 included items allowed'),
        image: z.string()
            .url('Invalid image URL')
            .optional(),
        isFeatured: z.boolean().optional(),
        villaId: z.string().cuid('Invalid villa ID format').optional()
    })
});

// Update service schema
export const updateServiceSchema = z.object({
    params: z.object({
        serviceId: z.string().cuid('Invalid service ID format')
    }),
    body: z.object({
        title: z.string()
            .min(3, 'Service title must be at least 3 characters')
            .max(100, 'Service title must not exceed 100 characters')
            .trim()
            .optional(),
        description: z.string()
            .min(10, 'Service description must be at least 10 characters')
            .max(500, 'Service description must not exceed 500 characters')
            .trim()
            .optional(),
        longDescription: z.string()
            .min(50, 'Long description must be at least 50 characters')
            .max(2000, 'Long description must not exceed 2000 characters')
            .trim()
            .optional(),
        category: z.nativeEnum(ServiceCategory).optional(),
        price: z.number()
            .min(0, 'Service price must be non-negative')
            .max(10000, 'Service price must not exceed 10,000')
            .optional(),
        duration: z.string()
            .min(1, 'Duration is required')
            .max(50, 'Duration must not exceed 50 characters')
            .trim()
            .optional(),
        difficulty: z.nativeEnum(ServiceDifficulty).optional(),
        maxGroupSize: z.number()
            .int('Max group size must be an integer')
            .min(1, 'Max group size must be at least 1')
            .max(50, 'Max group size must not exceed 50')
            .optional(),
        highlights: z.array(z.string().trim().min(1, 'Highlight cannot be empty'))
            .min(1, 'At least one highlight is required')
            .max(10, 'Maximum 10 highlights allowed')
            .optional(),
        included: z.array(z.string().trim().min(1, 'Included item cannot be empty'))
            .min(1, 'At least one included item is required')
            .max(10, 'Maximum 10 included items allowed')
            .optional(),
        image: z.string()
            .url('Invalid image URL')
            .optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        villaId: z.string().cuid('Invalid villa ID format').optional()
    })
});