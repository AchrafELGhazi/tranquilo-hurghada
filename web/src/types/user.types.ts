export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date;
    role: 'GUEST' | 'HOST' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}
