import nodemailer from 'nodemailer';
import { env } from '../config/env';
import logger from '../config/logger';
import { formatBookingDateRange, getDaysBetweenDates } from './booking.utils';
import prisma from '../config/database';

interface BookingEmailData {
    booking: {
        id: string;
        checkIn: Date;
        checkOut: Date;
        totalGuests: number;
        totalPrice: any;
        notes?: string | null;
        status: string;
        confirmedAt?: Date | null;
        cancelledAt?: Date | null;
        rejectedAt?: Date | null;
        cancellationReason?: string | null;
        rejectionReason?: string | null;
        villa: {
            id: string;
            title: string;
            address: string;
            city: string;
            country: string;
            owner: {
                id: string;
                fullName: string;
                email: string;
                role: string;
            };
        };
        guest: {
            id: string;
            fullName: string;
            email: string;
        };
    };
    type: 'NEW_BOOKING' | 'BOOKING_CONFIRMED' | 'BOOKING_REJECTED' | 'BOOKING_CANCELLED';
}

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });
};

const generateBookingEmailTemplate = (data: BookingEmailData): { subject: string; html: string } => {
    const { booking, type } = data;
    const dateRange = formatBookingDateRange(booking.checkIn, booking.checkOut);
    const nights = getDaysBetweenDates(booking.checkIn, booking.checkOut);

    const baseStyles = `
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #C75D2C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #C75D2C; }
            .detail-row { margin: 10px 0; }
            .label { font-weight: bold; display: inline-block; min-width: 120px; }
            .value { color: #666; }
            .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; text-transform: uppercase; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-confirmed { background: #d1fae5; color: #065f46; }
            .status-cancelled { background: #fee2e2; color: #991b1b; }
            .status-rejected { background: #fce7f3; color: #be185d; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
    `;

    let subject = '';
    let statusClass = '';
    let mainMessage = '';

    switch (type) {
        case 'NEW_BOOKING':
            subject = `New Booking Request - ${booking.villa.title}`;
            statusClass = 'status-pending';
            mainMessage = `
                <p><strong>A new booking request has been received!</strong></p>
                <p>Guest <strong>${booking.guest.fullName}</strong> has requested to book your villa.</p>
                <p>Please review the booking details below and confirm or reject the request.</p>
            `;
            break;
        case 'BOOKING_CONFIRMED':
            subject = `Booking Confirmed - ${booking.villa.title}`;
            statusClass = 'status-confirmed';
            mainMessage = `
                <p><strong>Great news! Your booking has been confirmed!</strong></p>
                <p>Your reservation at <strong>${booking.villa.title}</strong> is now confirmed.</p>
                <p>We look forward to your stay!</p>
            `;
            break;
        case 'BOOKING_REJECTED':
            subject = `Booking Request Declined - ${booking.villa.title}`;
            statusClass = 'status-rejected';
            mainMessage = `
                <p><strong>We're sorry, but your booking request has been declined.</strong></p>
                <p>The host was unable to accommodate your request for <strong>${booking.villa.title}</strong>.</p>
                ${booking.rejectionReason ? `<p><strong>Reason:</strong> ${booking.rejectionReason}</p>` : ''}
                <p>Please feel free to browse other available villas or try different dates.</p>
            `;
            break;
        case 'BOOKING_CANCELLED':
            subject = `Booking Cancelled - ${booking.villa.title}`;
            statusClass = 'status-cancelled';
            mainMessage = `
                <p><strong>Your booking has been cancelled.</strong></p>
                <p>Your reservation at <strong>${booking.villa.title}</strong> has been cancelled.</p>
                ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
            `;
            break;
    }

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
            ${baseStyles}
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Villa Booking System</h1>
                </div>
                
                <div class="content">
                    ${mainMessage}
                    
                    <div class="booking-details">
                        <h3>Booking Details</h3>
                        <div class="detail-row">
                            <span class="label">Booking ID:</span>
                            <span class="value">${booking.id}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Villa:</span>
                            <span class="value">${booking.villa.title}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Location:</span>
                            <span class="value">${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Guest:</span>
                            <span class="value">${booking.guest.fullName} (${booking.guest.email})</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Dates:</span>
                            <span class="value">${dateRange} (${nights} night${nights > 1 ? 's' : ''})</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Guests:</span>
                            <span class="value">${booking.totalGuests}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Total Price:</span>
                            <span class="value">$${booking.totalPrice}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="status ${statusClass}">${booking.status}</span>
                        </div>
                        ${booking.notes ? `
                        <div class="detail-row">
                            <span class="label">Notes:</span>
                            <span class="value">${booking.notes}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="footer">
                        <p>This is an automated message from Villa Booking System.</p>
                        <p>Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    return { subject, html };
};

export const sendBookingNotificationEmails = async (data: BookingEmailData): Promise<void> => {
    try {
        const transporter = createTransporter();
        const { subject, html } = generateBookingEmailTemplate(data);

        const emailPromises: Promise<any>[] = [];

        // Send email to guest
        emailPromises.push(
            transporter.sendMail({
                from: env.SMTP_FROM || 'noreply@tranquilo-hurghada.com',
                to: data.booking.guest.email,
                subject,
                html
            })
        );

        // Send email to villa owner (if not the guest)
        if (data.booking.villa.owner.email !== data.booking.guest.email) {
            emailPromises.push(
                transporter.sendMail({
                    from: env.SMTP_FROM || 'noreply@tranquilo-hurghada.com',
                    to: data.booking.villa.owner.email,
                    subject,
                    html
                })
            );
        }

        await Promise.all(emailPromises);
        logger.info(`Booking notification emails sent for booking ${data.booking.id}`);

    } catch (error) {
        logger.error('Failed to send booking notification emails:', error);
        throw error;
    }
};

export const sendWelcomeEmail = async (userEmail: string, userName: string): Promise<void> => {
    try {
        const transporter = createTransporter();

        const html = `
         <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Tranquilo Hurghada</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 15px;
            background: #F3E9DC;
            min-height: 100vh;
        }
        .container {
            max-width: 650px;
            margin: 0 auto;
            background: #FFFFFF;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 6px 24px rgba(199, 93, 44, 0.08);
            border: 1px solid rgba(248, 178, 89, 0.2);
        }
        .logo-section {
            background: #FFFFFF;
            padding: 25px 30px;
            text-align: center;
            border-bottom: 2px solid #F3E9DC;
        }
        .logo-img {
            max-width: 180px;
            height: auto;
            max-height: 70px;
            object-fit: contain;
        }
        .content {
            padding: 30px 25px;
            background: #FFFFFF;
        }
        .greeting {
            font-size: 24px;
            color: #C75D2C;
            margin-bottom: 20px;
            font-weight: 600;
            text-align: center;
        }
        .welcome-text {
            color: #555;
            margin-bottom: 20px;
            font-size: 15px;
            line-height: 1.6;
            text-align: center;
        }
        .highlight-box {
            background: linear-gradient(135deg, #F3E9DC, rgba(248, 178, 89, 0.1));
            border: 2px solid #F8B259;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .highlight-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #C75D2C, #D96F32, #F8B259);
            border-radius: 12px 12px 0 0;
        }
        .highlight-box h3 {
            color: #C75D2C;
            margin: 0 0 15px 0;
            font-size: 18px;
            font-weight: 600;
        }
        .highlight-box p {
            color: #666;
            margin: 0;
            font-size: 14px;
            line-height: 1.6;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 25px 0;
        }
        .feature {
            background: #FFFFFF;
            border: 2px solid #F3E9DC;
            border-radius: 12px;
            padding: 20px 15px;
            text-align: center;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        .feature:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(199, 93, 44, 0.1);
            border-color: #F8B259;
        }
        .feature::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #C75D2C, #F8B259);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        .feature:hover::before {
            transform: translateX(0);
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
            display: block;
        }
        .feature-text {
            color: #C75D2C;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #C75D2C, #D96F32);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 13px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(199, 93, 44, 0.2);
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(199, 93, 44, 0.35);
            background: linear-gradient(135deg, #D96F32, #C75D2C);
        }
        .footer {
            background: linear-gradient(135deg, #F3E9DC, rgba(248, 178, 89, 0.1));
            padding: 25px;
            text-align: center;
            border-top: 1px solid rgba(248, 178, 89, 0.3);
        }
        .footer-text {
            color: #666;
            font-size: 12px;
            margin: 5px 0;
        }
        .contact-info {
            color: #C75D2C;
            font-size: 13px;
            margin: 15px 0 8px 0;
            font-weight: 600;
        }
        .decorative-line {
            height: 2px;
            background: linear-gradient(90deg, transparent, #F8B259, transparent);
            margin: 20px 0;
            border-radius: 2px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-link {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: #F8B259;
            color: white;
            border-radius: 50%;
            line-height: 40px;
            margin: 0 8px;
            text-decoration: none;
            font-size: 18px;
            transition: all 0.3s ease;
        }
        .social-link:hover {
            background: #D96F32;
            transform: translateY(-3px);
        }
        @media (max-width: 600px) {
            body { padding: 10px; }
            .container { margin: 0; }
            .features { grid-template-columns: 1fr; }
            .header, .content, .footer { padding: 30px 20px; }
            .logo { font-size: 32px; }
            .greeting { font-size: 24px; }
            .welcome-text { font-size: 16px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo-section">
            <img src="https://res.cloudinary.com/dzavrovbk/image/upload/logo_ccp6vb.png" alt="Tranquilo Hurghada Logo" class="logo-img">
        </div>

        <div class="content">
            <div class="greeting">Welcome, ${userName}!</div>

            <div class="welcome-text">
                Thank you for joining Tranquilo Hurghada, where ancient Egyptian mystique meets contemporary luxury along the crystal-clear Red Sea coast.
            </div>

            <div class="highlight-box">
                <h3>Your Red Sea Adventure Begins Here</h3>
                <p>You now have access to our exclusive villa booking system and premium services. From desert dunes to coral reefs, your gateway to paradise is ready.</p>
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🏖️</div>
                    <div class="feature-text">Pristine Beaches</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🤿</div>
                    <div class="feature-text">World-Class Diving</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🏺</div>
                    <div class="feature-text">Cultural Heritage</div>
                </div>
                <div class="feature">
                    <div class="feature-icon">🌅</div>
                    <div class="feature-text">Desert Adventures</div>
                </div>
            </div>

            <div class="decorative-line"></div>

            <div style="text-align: center;">
                <a href="https://tranquilo-hurghada.com" class="cta-button">Explore Our Villa</a>
            </div>

            <div class="welcome-text">
                Need assistance? Our dedicated team is here to help you create unforgettable memories in Hurghada. Contact us anytime for personalized recommendations and booking support.
            </div>
        </div>

        <div class="footer">
            <div class="contact-info">📍 Villa No. 276, Mubarak Housing 7, North Hurghada, Egypt</div>
            <div class="footer-text">📞 +49 176 7623 0320 | ✉️ nabil.laaouina@outlook.com</div>
            <div class="footer-text">🌐 tranquilo-hurghada.com</div>

            <div class="social-links">
                <a href="#" class="social-link">📧</a>
                <a href="#" class="social-link">📱</a>
                <a href="#" class="social-link">🌐</a>
            </div>

            <div style="margin-top: 20px;">
                <div class="footer-text">This email was sent to ${userEmail}</div>
                <div class="footer-text">© 2024 Tranquilo Hurghada. All rights reserved.</div>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        await transporter.sendMail({
            from: env.SMTP_FROM || 'noreply@tranquilo-hurghada.com',
            to: userEmail,
            subject: 'Welcome to Tranquilo Hurghada - Your Red Sea Paradise Awaits! 🌊',
            html
        });

        logger.info(`Welcome email sent to ${userEmail}`);
    } catch (error) {
        logger.error('Failed to send welcome email:', error);
        throw error;
    }
};