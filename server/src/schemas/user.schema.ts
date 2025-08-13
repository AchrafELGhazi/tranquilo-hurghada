import { z } from 'zod';

const phoneSchema = z.string()
    .min(1, 'Phone number is required')
    .refine((phone) => {
        const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

        // Check for valid international phone formats:
        // +[country code][number] (international format)
        // Must start with + followed by 1-3 digit country code, then 4-15 digits
        // OR local format: 0[number] (for local numbers starting with 0)
        // OR just digits (minimum 7, maximum 15)
        const internationalPhoneRegex = /^(\+[1-9]\d{1,3}\d{4,14}|0\d{6,14}|\d{7,15})$/;

        return internationalPhoneRegex.test(cleanPhone) && cleanPhone.length >= 7 && cleanPhone.length <= 18;
    }, 'Invalid phone number format. Use international format (+1234567890) or local format (0123456789)');

const dateOfBirthSchema = z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
    }, 'Invalid date format')
    .refine((date) => {
        const dateObj = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dateObj.getFullYear();
        const monthDiff = today.getMonth() - dateObj.getMonth();
        const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate()) ? age - 1 : age;

        return finalAge >= 18;
    }, 'You must be at least 18 years old')
    .refine((date) => {
        const dateObj = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - dateObj.getFullYear();

        return age <= 120;
    }, 'Invalid date of birth');

export const updateProfileSchema = z.object({
    body: z.object({
        email: z.string()
            .email('Invalid email format')
            .toLowerCase()
            .optional(),
        fullName: z.string()
            .min(2, 'Full name must be at least 2 characters')
            .max(100, 'Full name must be less than 100 characters')
            .trim()
            .optional(),
        phone: phoneSchema.optional(),
        dateOfBirth: dateOfBirthSchema.optional()
    }).refine(data => {
        return Object.keys(data).length > 0;
    }, 'At least one field must be provided for update')
});

export const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string()
            .min(1, 'Current password is required'),
        newPassword: z.string()
            .min(8, 'New password must be at least 8 characters')
            .max(128, 'New password must be less than 128 characters')
            .refine((password) => {
                const hasLowercase = /[a-z]/.test(password);
                const hasUppercase = /[A-Z]/.test(password);
                const hasDigit = /\d/.test(password);
                return hasLowercase && hasUppercase && hasDigit;
            }, 'New password must contain at least one lowercase letter, one uppercase letter, and one number'),
        confirmPassword: z.string()
            .min(1, 'Confirm password is required')
    }).refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    })
});

export const deactivateAccountSchema = z.object({
    body: z.object({
        password: z.string()
            .min(1, 'Password is required to deactivate account')
    })
});

export const getAllUsersSchema = z.object({
    query: z.object({
        page: z.string()
            .transform(val => parseInt(val))
            .refine(val => val > 0, 'Page must be greater than 0')
            .optional(),
        limit: z.string()
            .transform(val => parseInt(val))
            .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
            .optional(),
        search: z.string()
            .min(1, 'Search term cannot be empty')
            .optional(),
        role: z.enum(['GUEST', 'HOST', 'ADMIN'])
            .optional(),
        sortBy: z.enum(['fullName', 'email', 'createdAt', 'updatedAt'])
            .optional(),
        sortOrder: z.enum(['asc', 'desc'])
            .optional(),
        isActive: z.string()
            .transform(val => val === 'true')
            .optional()
    })
});