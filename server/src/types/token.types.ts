import { Role } from '@prisma/client';

export interface TokenPayload {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    isActive: boolean;
    phone?: string | null;
    dateOfBirth?: string | null;
    createdAt?: string;
    updatedAt?: string;
    iat?: number;
    exp?: number;
}