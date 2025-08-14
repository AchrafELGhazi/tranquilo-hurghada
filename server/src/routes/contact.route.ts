import { Router } from 'express';
import { createContactSchema, getContactsSchema, updateContactSchema } from '../schemas/contact.schema';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { createContact, deleteContact, getAllContacts, getContactById, getUnreadCount, updateContact } from '../controllers/contact.controller';

const contactRouter = Router();

contactRouter.post(
    '/',
    validateRequest(createContactSchema),
    createContact
);

contactRouter.get(
    '/',
    authenticate,
    requireAdmin,
    validateRequest(getContactsSchema),
   getAllContacts
);

contactRouter.get(
    '/unread-count',
    authenticate,
    requireAdmin,
    getUnreadCount
);

contactRouter.get(
    '/:id',
    authenticate,
    requireAdmin,
    getContactById
);

contactRouter.put(
    '/:id',
    authenticate,
    requireAdmin,
    validateRequest(updateContactSchema),
    updateContact
);

contactRouter.delete(
    '/:id',
    authenticate,
    requireAdmin,
    deleteContact
);

export default contactRouter;