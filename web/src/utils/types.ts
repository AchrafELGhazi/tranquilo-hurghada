import type { supportedLanguages } from "./constants";

export type SupportedLanguage = typeof supportedLanguages[number];

export interface Language {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    flag: string;
    rtl?: boolean;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date;
    isActive: boolean;
    role: 'GUEST' | 'HOST' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

export interface Villa {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: User;
    bookings?: Booking[];
}

export interface Booking {
    id: string;
    villaId: string;
    guestId: string;
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    totalPrice: number;
    paymentMethod: 'PAYMENT_ON_ARRIVAL' | 'BANK_TRANSFER';
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
    notes?: string;
    rejectionReason?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
    villa: Villa;
    guest: User;
}