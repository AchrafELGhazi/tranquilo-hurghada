// whatsapp.utils.ts
import { WhatsAppConfig, BookingNotificationData } from '../types/whatsapp';

export function getWhatsAppConfig(): WhatsAppConfig {
    const config: WhatsAppConfig = {
        accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
        appSecret: process.env.WHATSAPP_APP_SECRET, // Allow undefined
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
        villaLocation: {
            latitude: 27.176902, // Latitude for 7QG7+RP, Hurghada
            longitude: 33.814422, // Longitude for 7QG7+RP, Hurghada
            name: 'Tranquilo Hurghada Villa',
            address: '7QG7+RP, Hurghada 2, Red Sea Governorate 1981111, Egypt'
        }
    };

    // Validate required configuration
    if (!config.accessToken) {
        throw new Error('WHATSAPP_ACCESS_TOKEN environment variable is required');
    }

    if (!config.phoneNumberId) {
        throw new Error('WHATSAPP_PHONE_NUMBER_ID environment variable is required');
    }

    return config;
}

export function formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
        throw new Error('Phone number is required');
    }

    // Remove all non-numeric characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // If number starts with 00, replace with +
    if (cleaned.startsWith('00')) {
        cleaned = '+' + cleaned.substring(2);
    }

    // If number starts with 0 (but not 00), remove it and assume it's Egyptian (+20)
    if (cleaned.startsWith('0') && !cleaned.startsWith('00')) {
        cleaned = '+20' + cleaned.substring(1);
    }

    // If number doesn't start with +, add country code
    if (!cleaned.startsWith('+')) {
        // If it looks like an Egyptian number (starts with 1 and is 10 digits)
        if (cleaned.match(/^1\d{9}$/)) {
            cleaned = '+20' + cleaned;
        } else {
            // Add + if it looks like an international number
            cleaned = '+' + cleaned;
        }
    }

    return cleaned;
}

export function validatePhoneNumber(phoneNumber: string): boolean {
    if (!phoneNumber) return false;

    try {
        const formatted = formatPhoneNumber(phoneNumber);
        // Basic validation: should start with + and have 10-15 digits
        const phoneRegex = /^\+\d{10,15}$/;
        return phoneRegex.test(formatted);
    } catch {
        return false;
    }
}

export function createBookingMessage(data: BookingNotificationData): string {
    const { guestName, checkInDate, checkOutDate, bookingRef, villaTitle } = data;

    // Format dates to be more readable
    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString; // Fallback to original string if parsing fails
        }
    };

    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    return `Hi ${guestName}! 👋
Thanks for your booking request for our ${villaTitle} (${formattedCheckIn} - ${formattedCheckOut}).

📋 *REQUEST RECEIVED* 
Booking Ref: ${bookingRef}

View your booking here: https://tranquilo-hurghada.com/en/my-bookings

We're checking availability and will confirm within 24 hours via WhatsApp/email.

Questions in the meantime? Just message us here!

*Villa Team* 🏖️`;
}

export function sanitizeMessage(message: string): string {
    if (!message) return '';

    // Remove potentially harmful characters but keep emojis and basic punctuation
    return message
        .replace(/[<>]/g, '') // Remove HTML brackets
        .replace(/[\r\n\t]/g, ' ') // Replace line breaks with spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .substring(0, 200); // Limit length for safety
}

export function isValidWhatsAppConfig(): boolean {
    try {
        const config = getWhatsAppConfig();
        return !!(config.accessToken && config.phoneNumberId);
    } catch {
        return false;
    }
}