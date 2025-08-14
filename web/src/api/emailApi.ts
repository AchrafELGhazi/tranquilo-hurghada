import apiService from "@/utils/api";
import type { BookingForEmail } from "@/utils/emailUtils";

export interface WelcomeEmailData {
    email: string;
    name: string;
}

class EmailApi {
    async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
        await apiService.post('/email/welcome', data);
    }

    async sendNewBookingNotification(booking: BookingForEmail): Promise<void> {
        await apiService.post('/email/booking/new', booking);
    }

    async sendBookingConfirmation(booking: BookingForEmail): Promise<void> {
        await apiService.post('/email/booking/confirm', booking);
    }

    async sendBookingRejection(booking: BookingForEmail): Promise<void> {
        await apiService.post('/email/booking/reject', booking);
    }

    async sendBookingCancellation(booking: BookingForEmail): Promise<void> {
        await apiService.post('/email/booking/cancel', booking);
    }
}

export const emailApi = new EmailApi();
export default emailApi;