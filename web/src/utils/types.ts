import type { LoginData, RegisterData } from "@/api/authApi";
import type { supportedLanguages } from "./constants";

export type SupportedLanguage = typeof supportedLanguages[number];

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN';
export type VillaStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
export type PaymentMethod = 'BANK_TRANSFER' | 'PAYMENT_ON_ARRIVAL';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REJECTED' | 'COMPLETED';
export type ServiceCategory = 'INCLUDED' | 'ADVENTURE' | 'WELLNESS' | 'CULTURAL' | 'TRANSPORT' | 'CUSTOM';
export type ServiceDifficulty = 'EASY' | 'MODERATE' | 'CHALLENGING';

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
    password: string; // Added from schema
    fullName: string;
    phone?: string;
    dateOfBirth?: Date;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;

    // Relations
    ownedVillas?: Villa[];
    guestBookings?: Booking[];
    confirmedBookings?: Booking[];
    cancelledBookings?: Booking[];
}

export interface Villa {
    id: string;
    title: string;
    description?: string; // Optional in schema
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

    // Foreign keys
    ownerId: string;

    // Relations
    owner?: User;
    bookings?: Booking[];
    services?: Service[];
}

export interface Service {
    id: string;
    title: string;
    description: string;
    longDescription?: string;
    category: ServiceCategory;
    price: number;
    duration: string;
    difficulty?: ServiceDifficulty;
    maxGroupSize?: number;
    highlights: string[];
    included: string[];
    image?: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;

    // Foreign keys
    villaId?: string;

    // Relations
    villa?: Villa;
    bookingServices?: BookingService[];
}

export interface Booking {
    id: string;
    checkIn: string;
    checkOut: string;
    totalAdults: number; // Updated field name
    totalChildren: number; // Added field
    totalPrice: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    notes?: string;
    confirmedAt?: string; // Added from schema
    cancelledAt?: string; // Added from schema
    rejectedAt?: string; // Added from schema
    completedAt?: string; // Added from schema
    cancellationReason?: string;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;

    // Foreign keys
    guestId: string;
    villaId: string;
    confirmedById?: string; // Added from schema
    cancelledById?: string; // Added from schema

    // Relations
    guest?: User;
    villa?: Villa;
    confirmedBy?: User;
    cancelledBy?: User;
    bookingServices?: BookingService[];
}

export interface BookingService {
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    scheduledDate?: string;
    scheduledTime?: string;
    specialRequests?: string;
    numberOfGuests?: number;
    createdAt: string;
    updatedAt: string;

    // Foreign keys
    bookingId: string;
    serviceId: string;

    // Relations
    booking?: Booking;
    service?: Service;
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