import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { sendBookingWhatsApp } from '../controllers/whatsapp.controller';
import { sendBookingWhatsappSchema } from '../schemas/whatsapp.schema';
import { validateRequest } from '../middleware/validateRequest.middleware';

const whatsappRouter = Router();

whatsappRouter.post(
    "/send-booking-whatsapp",
    validateRequest(sendBookingWhatsappSchema),
    sendBookingWhatsApp
);

export default whatsappRouter;