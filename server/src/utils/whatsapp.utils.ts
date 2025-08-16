// whatsapp.utils.ts - Simplified version
import axios from "axios";

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

// Main function to send template messages
export async function sendWhatsAppTemplateMessage(
    to: string,
    templateName: string,
    languageCode: string = "en",
    components?: any[]
) {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload: any = {
        messaging_product: "whatsapp",
        to: to.replace(/\D/g, ''), // Remove non-digits from phone number
        type: "template",
        template: {
            name: templateName,
            language: {
                code: languageCode
            },
            ...(components && components.length > 0 && { components })
        }
    };

    const response = await axios.post(url, payload, {
        headers: {
            Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    });

    return response;
}

// Simple fallback message function
export async function sendWhatsAppMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
        url,
        {
            messaging_product: "whatsapp",
            to: to.replace(/\D/g, ''),
            text: { body: message }
        },
        {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response;
}

// Location sharing function
export async function sendWhatsAppLocation(to: string, latitude: number, longitude: number, name?: string, address?: string) {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
        url,
        {
            messaging_product: "whatsapp",
            to: to.replace(/\D/g, ''),
            type: "location",
            location: {
                latitude,
                longitude,
                name,
                address
            }
        },
        {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );

    return response;
}

// Helper to build template components for booking
export function buildBookingTemplateComponents(
    guestName: string,
    villaTitle: string,
    formattedCheckIn: string,
    formattedCheckOut: string,
    shortBookingRef: string
) {
    return [
        {
            type: "header",
            parameters: [
                {
                    type: "text",
                    text: guestName
                }
            ]
        },
        {
            type: "body",
            parameters: [
                {
                    type: "text",
                    text: villaTitle
                },
                {
                    type: "text",
                    text: formattedCheckIn
                },
                {
                    type: "text",
                    text: formattedCheckOut
                },
                {
                    type: "text",
                    text: shortBookingRef
                }
            ]
        }
    ];
}

// Simple booking message for fallback
export function buildBookingMessage(
    guestName: string,
    villaTitle: string,
    formattedCheckIn: string,
    formattedCheckOut: string,
    shortBookingRef: string
) {
    return `Hi ${guestName}! 👋
Thanks for your booking request for our ${villaTitle} (${formattedCheckIn} - ${formattedCheckOut}).

📋 *REQUEST RECEIVED*
Booking Ref: ${shortBookingRef}
View your booking here: https://tranquilo-hurghada.com/en/my-bookings

We're checking availability and will confirm within 24 hours via WhatsApp/email. Questions in the meantime? Just message us here!

*Tranquilo Hurghada Team* 🏖️`;
}