import apiService from "@/utils/api";

export interface SendBookingWhatsAppData {
    phone: string;
    name: string;
    checkIn: string;
    checkOut: string;
    bookingId: string;
    villaTitle: string;
}

export interface WhatsAppResponse {
    success: boolean;
    message: string;
}

class WhatsAppApi {
    async sendBookingWhatsApp(data: SendBookingWhatsAppData): Promise<WhatsAppResponse> {
        return await apiService.post<never>('/whatsapp/send-booking-whatsapp', data);
    }
}

export const whatsappApi = new WhatsAppApi();
export default whatsappApi;