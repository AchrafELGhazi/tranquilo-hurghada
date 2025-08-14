// whatsapp.service.ts
import { WhatsAppAPI } from 'whatsapp-api-js';
import { Text, Location } from 'whatsapp-api-js/messages';
import { BookingNotificationData, WhatsAppResponse } from '../types/whatsapp';
import { getWhatsAppConfig, formatPhoneNumber, createBookingMessage, sanitizeMessage } from '../utils/whatsapp.utils';

let whatsappClient: WhatsAppAPI | null = null;

// Define the expected response structure from WhatsApp API
interface WhatsAppMessageResponse {
    messages?: Array<{
        id: string;
        [key: string]: any;
    }>;
    [key: string]: any;
}

// Initialize WhatsApp client with error handling
const initializeWhatsAppClient = (): WhatsAppAPI => {
    if (!whatsappClient) {
        try {
            const config = getWhatsAppConfig();
            // Create config object with proper types
            const clientConfig: any = {
                token: config.accessToken,
                secure: true
            };

            // Only add appSecret if it exists
            if (config.appSecret) {
                clientConfig.appSecret = config.appSecret;
            }

            whatsappClient = new WhatsAppAPI(clientConfig);
        } catch (error) {
            console.error('Failed to initialize WhatsApp client:', error);
            throw new Error('WhatsApp configuration error');
        }
    }
    return whatsappClient;
};

export const sendBookingNotificationMessage = async (data: BookingNotificationData): Promise<WhatsAppResponse> => {
    try {
        // Validate and sanitize input data
        const sanitizedData = {
            phoneNumber: formatPhoneNumber(data.phoneNumber),
            guestName: sanitizeMessage(data.guestName),
            checkInDate: data.checkInDate,
            checkOutDate: data.checkOutDate,
            bookingRef: sanitizeMessage(data.bookingRef),
            villaTitle: sanitizeMessage(data.villaTitle || 'Hurghada villa')
        };

        const client = initializeWhatsAppClient();
        const config = getWhatsAppConfig();
        const message = createBookingMessage(sanitizedData);

        // Send the text message
        console.log(`Sending WhatsApp message to ${sanitizedData.phoneNumber}`);
        const textMessage = new Text(message);
        const messageResponse = await client.sendMessage(
            config.phoneNumberId,
            sanitizedData.phoneNumber,
            textMessage
        ) as WhatsAppMessageResponse;

        // Extract message ID safely with proper type checking
        let messageId = 'message_sent';
        if (messageResponse && typeof messageResponse === 'object' && 'messages' in messageResponse) {
            const messages = messageResponse.messages;
            if (Array.isArray(messages) && messages.length > 0 && messages[0].id) {
                messageId = messages[0].id;
            }
        }

        // Wait before sending location to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Send location
        console.log(`Sending location to ${sanitizedData.phoneNumber}`);
        const locationMessage = new Location(
            config.villaLocation.latitude,
            config.villaLocation.longitude,
            config.villaLocation.name,
            config.villaLocation.address
        );

        const locationResponse = await client.sendMessage(
            config.phoneNumberId,
            sanitizedData.phoneNumber,
            locationMessage
        ) as WhatsAppMessageResponse;

        // Extract location message ID safely with proper type checking
        let locationId = 'location_sent';
        if (locationResponse && typeof locationResponse === 'object') {
            if ('messages' in locationResponse) {
                const messages = locationResponse.messages;
                if (Array.isArray(messages) && messages.length > 0 && messages[0].id) {
                    locationId = messages[0].id;
                }
            } else if ('id' in locationResponse) {
                locationId = String(locationResponse.id);
            }
        }

        console.log(`WhatsApp notification sent successfully to ${sanitizedData.phoneNumber}`);

        return {
            success: true,
            data: {
                messageId,
                locationId,
                phone: sanitizedData.phoneNumber,
                guestName: sanitizedData.guestName,
                message: 'Booking notification and location sent successfully'
            }
        };

    } catch (error: any) {
        console.error('Error sending WhatsApp booking notification:', error);

        // Provide more specific error messages
        let errorMessage = 'Failed to send WhatsApp notification';

        if (error.message?.includes('configuration')) {
            errorMessage = 'WhatsApp service configuration error';
        } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
            errorMessage = 'Network error while sending WhatsApp message';
        } else if (error.message?.includes('invalid')) {
            errorMessage = 'Invalid phone number or message format';
        } else if (error.response?.status === 401) {
            errorMessage = 'WhatsApp API authentication failed';
        } else if (error.response?.status === 403) {
            errorMessage = 'WhatsApp API access forbidden';
        } else if (error.response?.status === 429) {
            errorMessage = 'WhatsApp API rate limit exceeded';
        }

        return {
            success: false,
            error: errorMessage
        };
    }
};