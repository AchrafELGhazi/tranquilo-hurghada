
import { Router } from 'express';
import { sendWelcomeEmailHandler, sendNewBookingNotificationHandler, sendBookingConfirmationHandler, sendBookingRejectionHandler, sendBookingCancellationHandler, debugEmailHandler } from '../controllers/email.controller';

const emailRouter = Router();

emailRouter.post('/welcome', sendWelcomeEmailHandler);
emailRouter.post('/booking/new', sendNewBookingNotificationHandler);
emailRouter.post('/booking/confirm', sendBookingConfirmationHandler);
emailRouter.post('/booking/reject', sendBookingRejectionHandler);
emailRouter.post('/booking/cancel', sendBookingCancellationHandler);
emailRouter.get('/debug', debugEmailHandler);

export default emailRouter;