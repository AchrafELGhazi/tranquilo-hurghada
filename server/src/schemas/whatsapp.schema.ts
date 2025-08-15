import { z } from "zod";

export const sendBookingWhatsappSchema = z.object({
    body: z.object({
        phone: z.string().trim().regex(/^\+?\d{8,15}$/, "Invalid phone format"),
        name: z.string().trim().min(1, "Name is required"),
        checkIn: z.string().trim().min(1, "Check-in date is required"),
        checkOut: z.string().trim().min(1, "Check-out date is required"),
        bookingId: z.string().trim().min(1, "Booking ID is required"),
        villaTitle: z.string().trim().optional().default("Tranquio Hurghada")
    })
});

export type SendBookingWhatsappInput = z.infer<typeof sendBookingWhatsappSchema>;