import { z } from 'zod';

// Register schema
export const registerSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email format'),
        password: z
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .max(100, 'Password must be less than 100 characters'),
        fullName: z
            .string()
            .min(1, 'Full name is required')
            .max(100, 'Full name must be less than 100 characters')
            .trim(),
    }),
});

// Login schema
export const loginSchema = z.object({
    body: z.object({
        email: z
            .string()
            .min(1, 'Email is required')
            .email('Invalid email format'),
        password: z
            .string()
            .min(1, 'Password is required'),
    }),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
    body: z.object({
        refreshToken: z
            .string()
            .min(1, 'Refresh token is required'),
    }),
});

// Export types for TypeScript inference
export type RegisterBody = z.infer<typeof registerSchema>['body'];
export type LoginBody = z.infer<typeof loginSchema>['body'];
export type RefreshTokenBody = z.infer<typeof refreshTokenSchema>['body'];