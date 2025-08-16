// whatsapp.routes.ts - Back to simple single route
import { Router } from 'express';
import { sendBookingWhatsApp } from '../controllers/whatsapp.controller';
import { sendBookingWhatsappSchema } from '../schemas/whatsapp.schema';
import { validateRequest } from '../middleware/validateRequest.middleware';

const whatsappRouter = Router();

whatsappRouter.post(
    "/send-booking-whatsapp",
    // validateRequest(sendBookingWhatsappSchema),
    sendBookingWhatsApp
);

export default whatsappRouter;