import { Role } from '@prisma/client';

export interface TokenPayload {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    isActive: boolean;
    iat?: number;
    exp?: number;
}