import { createTransport, TransportOptions } from 'nodemailer';
import { env } from '../config/env';

export const transporter = createTransport({
    service: 'Outlook',
    port: 587,
    auth: {
        user: env.ADMIN_EMAIL,
        pass: env.ADMIN_PASSWORD,
    },
} as TransportOptions);

