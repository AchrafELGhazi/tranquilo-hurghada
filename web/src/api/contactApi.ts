import apiService from "@/utils/api";
import type { Contact } from "@/utils/types";

export interface ContactMessage {
    name: string;
    email: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
    data: Contact;
}

export interface ContactsResponse {
    success: boolean;
    message: string;
    data: Contact[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface UnreadCountResponse {
    success: boolean;
    message: string;
    data: {
        count: number;
    };
}

export interface GetContactsParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
    sortBy?: string;
    sortOrder?: string;
}

class ContactApi {
    async sendMessage(data: ContactMessage): Promise<ContactResponse> {
        return await apiService.post<Contact>('/contact', data);
    }

    async getAllContacts(params?: GetContactsParams): Promise<any> {
        return await apiService.get<ContactsResponse>('/contact', { params });
    }

    async getContactById(id: string): Promise<ContactResponse> {
        return await apiService.get<Contact>(`/contact/${id}`);
    }

    async updateContact(id: string, data: { isRead: boolean }): Promise<ContactResponse> {
        return await apiService.put<Contact>(`/contact/${id}`, data);
    }

    async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
        return await apiService.delete(`/contact/${id}`);
    }

    async getUnreadCount(): Promise<UnreadCountResponse> {
        return await apiService.get('/contact/unread-count');
    }
}

export const contactApi = new ContactApi();
export default contactApi;