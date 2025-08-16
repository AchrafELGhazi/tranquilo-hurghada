import { Request, Response } from "express";
import { sendWhatsAppMessage, sendWhatsAppLocation, buildBookingMessage } from "../utils/whatsapp.utils";

export async function sendBookingWhatsApp(req: Request, res: Response) {
    const { phone, name, checkIn, checkOut, bookingId, villaTitle } = req.body;
    const message = buildBookingMessage(name, villaTitle, checkIn, checkOut, bookingId);

    try {
        // Send the booking confirmation message
        await sendWhatsAppMessage(phone, message);

        // Send the villa location as a separate location attachment
        // Coordinates for 7QG7+RP (more precise than general Hurghada coordinates)
        await sendWhatsAppLocation(
            phone,
            27.2764,  // Updated latitude for Plus Code 7QG7+RP
            33.8366,  // Updated longitude for Plus Code 7QG7+RP
            "Tranquilo Hurghada Villa location",
            "7QG7+RP, Hurghada 2, Red Sea Governorate 1981111, Egypt"
        );

        res.json({ success: true, message: "WhatsApp message and location sent" });
    } catch (error: any) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
}