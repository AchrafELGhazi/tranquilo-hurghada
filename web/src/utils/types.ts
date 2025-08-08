import type { LoginData, RegisterData } from "@/api/authApi";
import type { supportedLanguages } from "./constants";

export type SupportedLanguage = typeof supportedLanguages[number];

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';
export type VillaStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
export type PaymentMethod = 'PAYMENT_ON_ARRIVAL' | 'BANK_TRANSFER';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';

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
    role: UserRole;
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
    status: VillaStatus;
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
    paymentMethod: PaymentMethod;
    status: BookingStatus;
    notes?: string;
    rejectionReason?: string;
    cancellationReason?: string;
    createdAt: string;
    updatedAt: string;
    villa: Villa;
    guest: User;
}


export interface NavigationItem {
    name: string;
    href: string;
    icon: React.ReactNode;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    hasRole: (role: 'GUEST' | 'HOST' | 'ADMIN') => boolean;
    isGuest: () => boolean;
    isHost: () => boolean;
    isAdmin: () => boolean;
    clearError: () => void;
}