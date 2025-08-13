import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';

let transporter: nodemailer.Transporter;

const initializeTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS
            },
            debug: env.NODE_ENV === 'development',
            logger: env.NODE_ENV === 'development'
        });
    }
    return transporter;
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        const mailer = initializeTransporter();

        const mailOptions = {
            from: `"Tranquilo Hurghada" <admin@tranquilo-hurghada.com>`,
            replyTo: 'admin@tranquilo-hurghada.com',
            to,
            subject,
            html,
            text: html.replace(/<[^>]*>/g, ''),
        };

        const result = await mailer.sendMail(mailOptions);
        logger.info(`Email sent successfully to ${to}, Message ID: ${result.messageId}`);

    } catch (error) {
        logger.error(`Failed to send email to ${to}:`, error);
        throw error;
    }
};

export const sendBulkEmails = async (emails: Array<{ to: string; subject: string; html: string }>): Promise<void> => {
    for (const email of emails) {
        await sendEmail(email.to, email.subject, email.html);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

export const testEmailConnection = async (): Promise<boolean> => {
    try {
        const mailer = initializeTransporter();
        await mailer.verify();
        logger.info('SMTP connection verified successfully');
        return true;
    } catch (error) {
        logger.error('SMTP connection test failed:', error);
        return false;
    }
};