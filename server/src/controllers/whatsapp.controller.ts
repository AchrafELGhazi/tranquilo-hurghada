// whatsapp.controller.ts - Simplified controller
import { Request, Response } from "express";
import {
    sendWhatsAppTemplateMessage,
    sendWhatsAppMessage,
    sendWhatsAppLocation,
    buildBookingTemplateComponents,
    buildBookingMessage
} from "../utils/whatsapp.utils";

export async function sendBookingWhatsApp(req: Request, res: Response) {

    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('Raw body:', req.body);
    const { phone, name, checkIn, checkOut, bookingId, villaTitle } = req.body;

    try {
        // Try template message first
        const templateComponents = buildBookingTemplateComponents(
            name,
            villaTitle,
            checkIn,
            checkOut,
            bookingId
        );

        await sendWhatsAppTemplateMessage(
            phone,
            "booking_confirmation",
            "en",
            templateComponents
        );

        // Send location
        await sendWhatsAppLocation(
            phone,
            27.2764,
            33.8366,
            "Tranquilo Hurghada Villa location",
            "7QG7+RP, Hurghada 2, Red Sea Governorate 1981111, Egypt"
        );

        res.json({
            success: true,
            message: "WhatsApp messages sent successfully"
        });

    } catch (error: any) {
        console.error('WhatsApp failed:', error.response?.data || error.message);

        // Try fallback message
        try {
            const message = buildBookingMessage(name, villaTitle, checkIn, checkOut, bookingId);
            await sendWhatsAppMessage(phone, message);
            await sendWhatsAppLocation(
                phone,
                27.2764,
                33.8366,
                "Tranquilo Hurghada Villa location",
                "7QG7+RP, Hurghada 2, Red Sea Governorate 1981111, Egypt"
            );

            res.json({
                success: true,
                message: "WhatsApp messages sent (fallback method)"
            });

        } catch (fallbackError: any) {
            console.error('All WhatsApp methods failed:', fallbackError.response?.data || fallbackError.message);
            res.status(500).json({
                error: "Failed to send WhatsApp messages",
                details: fallbackError.response?.data || fallbackError.message
            });
        }
    }
}