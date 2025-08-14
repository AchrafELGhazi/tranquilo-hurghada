import { Contact, Prisma } from '@prisma/client';
import { CreateContactInput, GetContactsQuery } from '../schemas/contact.schema';
import prisma from '../config/database';

export const createContact = async (data: CreateContactInput): Promise<Contact> => {
    return await prisma.contact.create({
        data
    });
};

export const getAllContacts = async (query: GetContactsQuery) => {
    const { page, limit, isRead, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ContactWhereInput = {};
    if (isRead !== undefined) {
        where.isRead = isRead;
    }

    const orderBy: Prisma.ContactOrderByWithRelationInput = {
        [sortBy]: sortOrder
    };

    const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
            where,
            orderBy,
            skip,
            take: limit
        }),
        prisma.contact.count({ where })
    ]);

    return {
        contacts,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getContactById = async (id: string): Promise<Contact | null> => {
    return await prisma.contact.findUnique({
        where: { id }
    });
};

export const updateContact = async (id: string, data: { isRead: boolean }): Promise<Contact> => {
    return await prisma.contact.update({
        where: { id },
        data
    });
};

export const deleteContact = async (id: string): Promise<Contact> => {
    return await prisma.contact.delete({
        where: { id }
    });
};

export const getUnreadCount = async (): Promise<number> => {
    return await prisma.contact.count({
        where: { isRead: false }
    });
};