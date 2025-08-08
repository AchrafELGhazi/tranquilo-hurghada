import type { Booking } from "./bookin.types";
import type { User } from "./user.types";

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