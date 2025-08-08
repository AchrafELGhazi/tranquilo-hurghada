import type { User } from "./user.types";
import type { Villa } from "./villa.types";

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