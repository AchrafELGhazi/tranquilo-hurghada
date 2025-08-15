import axios from "axios";

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN!;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID!;

export async function sendWhatsAppMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    return axios.post(
        url,
        {
            messaging_product: "whatsapp",
            to,
            text: { body: message }
        },
        {
            headers: {
                Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    );
}

export async function sendWhatsAppLocation(to: string, latitude: number, longitude: number, name?: string, address?: string) {
    const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    return axios.post(
        url,
        {
            messaging_product: "whatsapp",
            to,
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
}

export function buildBookingMessage(
    guestName: string,
    villaTitle: string,
    formattedCheckIn: string,
    formattedCheckOut: string,
    shortBookingRef: string
) {
    const villaLocation = "https://maps.google.com/?q=27.2579,33.8116";

    return `Hi ${guestName}! 👋
Thanks for your booking request for our ${villaTitle} (${formattedCheckIn} - ${formattedCheckOut}).

📋 *REQUEST RECEIVED*
Booking Ref: ${shortBookingRef}
View your booking here: https://tranquilo-hurghada.com/en/my-bookings

We're checking availability and will confirm within 24 hours via WhatsApp/email. Questions in the meantime? Just message us here!

*Tranquilo Hurghada Team* 🏖️`;
}