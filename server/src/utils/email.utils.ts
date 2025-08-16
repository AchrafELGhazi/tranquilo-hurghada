import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
    try {
        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
                sender: {
                    name: "Tranquilo Hurghada",
                    email: env.MAIL_FROM || "admin@tranquilo-hurghada.com"
                },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            },
            {
                headers: {
                    'api-key': env.BREVO_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        logger.info(`📧 Email sent: ${to}`);

    } catch (error: any) {
        logger.error(`❌ Email failed: ${to} - ${error.response?.data?.message || error.message}`);
        throw new Error('Failed to send email');
    }
};

export const sendBulkEmails = async (emails: Array<{ to: string; subject: string; html: string }>) => {
    const results = { successful: 0, failed: [] as any[] };

    logger.info(`📬 Sending ${emails.length} emails...`);

    for (const email of emails) {
        try {
            await sendEmail(email.to, email.subject, email.html);
            results.successful++;
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
            results.failed.push({ email: email.to, error: error.message });
        }
    }

    logger.info(`✅ Bulk email complete: ${results.successful} sent, ${results.failed.length} failed`);
    return results;
};

export const testEmailConnection = async (): Promise<boolean> => {
    try {
        await axios.get('https://api.brevo.com/v3/account', {
            headers: { 'api-key': env.BREVO_API_KEY }
        });

        logger.info('✅ Brevo connection successful');
        return true;
    } catch (error: any) {
        logger.error('❌ Brevo connection failed');
        return false;
    }
};

// debug function to check sender verification
export const checkSenderVerification = async (): Promise<void> => {
    try {
        const response = await axios.get('https://api.brevo.com/v3/senders', {
            headers: { 'api-key': env.BREVO_API_KEY }
        });

        const sendersData = response.data as any;
        const senders = sendersData.senders || [];

        logger.info('📧 Verified senders:');
        senders.forEach((sender: any) => {
            logger.info(`  - ${sender.email} (${sender.active ? 'Active' : 'Inactive'})`);
        });

        const mailFrom = env.MAIL_FROM || "admin@tranquilo-hurghada.com";
        const isVerified = senders.some((sender: any) =>
            sender.email === mailFrom && sender.active === true
        );

        if (isVerified) {
            logger.info(`✅ Current sender (${mailFrom}) is verified and active`);
        } else {
            logger.warn(`⚠️  Current sender (${mailFrom}) is NOT verified`);
            logger.info('💡 Add sender in Brevo Dashboard → Senders & IP');
        }

    } catch (error: any) {
        logger.error('❌ Failed to check senders');
    }
};