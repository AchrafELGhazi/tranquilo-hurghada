import { Request, Response } from 'express';
import * as contactService from '../services/contact.service';
import { ApiResponse } from '../utils/apiResponse';
import { CreateContactInput, GetContactsQuery } from '../schemas/contact.schema';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import logger from '../config/logger';

export const createContact = async (req: Request, res: Response) => {
    try {
        const contact = await contactService.createContact(req.body);
        logger.info('Contact message created', { contactId: contact.id, email: contact.email });
        ApiResponse.created(res, contact, 'Contact message sent successfully');
    } catch (error) {
        logger.error('Error creating contact:', error);
        ApiResponse.serverError(res, 'Failed to send contact message');
    }
};

export const getAllContacts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await contactService.getAllContacts(req.query as unknown as GetContactsQuery);
        ApiResponse.successWithPagination(
            res,
            result.contacts,
            result.pagination,
            'Contacts retrieved successfully'
        );
    } catch (error) {
        logger.error('Error fetching contacts:', error);
        ApiResponse.serverError(res, 'Failed to fetch contacts');
    }
};

export const getContactById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const contact = await contactService.getContactById(id);

        if (!contact) {
            return ApiResponse.notFound(res, 'Contact not found');
        }

        ApiResponse.success(res, contact, 'Contact retrieved successfully');
    } catch (error) {
        logger.error('Error fetching contact:', error);
        ApiResponse.serverError(res, 'Failed to fetch contact');
    }
};

export const updateContact = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { isRead } = req.body;

        const existingContact = await contactService.getContactById(id);
        if (!existingContact) {
            return ApiResponse.notFound(res, 'Contact not found');
        }

        const updatedContact = await contactService.updateContact(id, { isRead });
        logger.info('Contact updated', { contactId: id, isRead });

        ApiResponse.success(res, updatedContact, 'Contact updated successfully');
    } catch (error) {
        logger.error('Error updating contact:', error);
        ApiResponse.serverError(res, 'Failed to update contact');
    }
};

export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const existingContact = await contactService.getContactById(id);
        if (!existingContact) {
            return ApiResponse.notFound(res, 'Contact not found');
        }

        await contactService.deleteContact(id);
        logger.info('Contact deleted', { contactId: id });

        ApiResponse.success(res, null, 'Contact deleted successfully');
    } catch (error) {
        logger.error('Error deleting contact:', error);
        ApiResponse.serverError(res, 'Failed to delete contact');
    }
};

export const getUnreadCount = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const count = await contactService.getUnreadCount();
        ApiResponse.success(res, { count }, 'Unread count retrieved successfully');
    } catch (error) {
        logger.error('Error fetching unread count:', error);
        ApiResponse.serverError(res, 'Failed to fetch unread count');
    }
};