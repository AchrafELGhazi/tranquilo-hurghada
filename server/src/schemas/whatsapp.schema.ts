// whatsapp.schema.ts - Simple schema
import { z } from 'zod';

export const sendBookingWhatsappSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    name: z.string().min(1, "Name is required"),
    checkIn: z.string().min(1, "Check-in date is required"),
    checkOut: z.string().min(1, "Check-out date is required"),
    bookingId: z.string().min(1, "Booking ID is required"),
    villaTitle: z.string().min(1, "Villa title is required")
});

export type SendBookingWhatsappRequest = z.infer<typeof sendBookingWhatsappSchema>;