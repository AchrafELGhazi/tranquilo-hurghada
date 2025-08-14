// whatsapp.route.ts
import { Router } from 'express';
import { sendBookingNotification } from '../controllers/whatsapp.controller';
import { authenticate } from '../middleware/auth.middleware';

const whatsappRouter = Router();

// Send booking notification (authenticated users only)
whatsappRouter.post(
    '/send-booking-notification',
    // authenticate,
    sendBookingNotification
);

export default whatsappRouter;