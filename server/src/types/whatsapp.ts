// types/whatsapp.ts
export interface WhatsAppConfig {
    accessToken: string;
    appSecret?: string;
    phoneNumberId: string;
    webhookVerifyToken?: string;
    villaLocation: {
        latitude: number;
        longitude: number;
        name: string;
        address: string;
    };
}

export interface BookingNotificationData {
    phoneNumber: string;
    guestName: string;
    checkInDate: string;
    checkOutDate: string;
    bookingRef: string;
    villaTitle?: string;
}

export interface WhatsAppResponse {
    success: boolean;
    data?: {
        messageId?: string;
        locationId?: string;
        phone?: string;
        guestName?: string;
        message?: string;
    };
    error?: string;
}