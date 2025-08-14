import { z } from 'zod';

export const createContactSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
        email: z.string().email('Invalid email format'),
        message: z.string().min(1, 'Message is required').max(1000, 'Message must be less than 1000 characters')
    })
});

export const getContactsSchema = z.object({
    query: z.object({
        page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
        limit: z.string().transform(Number).pipe(z.number().min(1).max(50)).default(10),
        isRead: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined),
        sortBy: z.enum(['createdAt', 'name', 'email']).default('createdAt'),
        sortOrder: z.enum(['asc', 'desc']).default('desc')
    })
});

export const updateContactSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Contact ID is required')
    }),
    body: z.object({
        isRead: z.boolean()
    })
});

export type CreateContactInput = z.infer<typeof createContactSchema>['body'];
export type GetContactsQuery = z.infer<typeof getContactsSchema>['query'];
export type UpdateContactInput = z.infer<typeof updateContactSchema>;