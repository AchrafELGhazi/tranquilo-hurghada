import { createTransport, TransportOptions } from 'nodemailer';

export const createTransporter = createTransport({
    host: 'smtpout.secureserver.net',
    port: 465,
    secure: true, 
    auth: {
        user: 'admin@tranquilo-hughada.com', 
        pass: 'Abcdef123$' 
    }
} as TransportOptions);
