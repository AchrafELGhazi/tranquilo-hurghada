import { env } from "../config/env";
import { sendBulkEmails, sendEmail } from "../utils/email.utils";

export interface BookingData {
    id: string;
    checkIn: Date;
    checkOut: Date;
    totalAdults: number;
    totalChildren: number;
    totalPrice: number;
    status: string;
    paymentMethod: string;
    isPaid: boolean;
    notes?: string;
    rejectionReason?: string;
    cancellationReason?: string;
    villa: {
        id: string;
        title: string;
        description?: string;
        address: string;
        city: string;
        country: string;
        pricePerNight: number;
        maxGuests: number;
        bedrooms: number;
        bathrooms: number;
        amenities: string[];
        images: string[];
        owner: {
            id: string;
            fullName: string;
            email: string;
            phone?: string;
        };
    };
    guest: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
    };
    bookingServices?: Array<{
        id: string;
        service: {
            id: string;
            title: string;
            description: string;
            category: string;
        };
    }>;
}

const getBaseTemplate = (content: string): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #C75D2C; color: white; padding: 20px; text-align: center; }
                .content { background: #f9f9f9; padding: 20px; }
                .booking-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
                .service-card { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #C75D2C; }
                .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; }
                .confirmed { background: #d1fae5; color: #065f46; }
                .cancelled { background: #fee2e2; color: #991b1b; }
                .rejected { background: #fce7f3; color: #be185d; }
                .pending { background: #fef3c7; color: #92400e; }
                .completed { background: #dbeafe; color: #1e40af; }
                .payment-info { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 10px 0; }
                .guest-info { background: #f0f9ff; padding: 15px; border-radius: 6px; margin: 10px 0; }
                .total-guests { font-size: 16px; font-weight: bold; color: #C75D2C; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Tranquilo Hurghada</h1>
                </div>
                <div class="content">
                    ${content}
                </div>
            </div>
        </body>
        </html>
    `;
};

const getWelcomeTemplate = (userName: string, userEmail: string): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
                .header { background: #C75D2C; color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .welcome-box { background: #F3E9DC; padding: 25px; border-radius: 12px; margin: 20px 0; text-align: center; }
                .cta-button { display: inline-block; background: #C75D2C; color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
                .footer { background: #F3E9DC; padding: 25px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Tranquilo Hurghada</h1>
                </div>
                <div class="content">
                    <h2>Welcome, ${userName}!</h2>
                    <p>Thank you for joining Tranquilo Hurghada, where ancient Egyptian mystique meets contemporary luxury along the Red Sea coast.</p>
                    <div class="welcome-box">
                        <h3>Your Red Sea Adventure Begins Here</h3>
                        <p>You now have access to our exclusive villa booking system and premium services.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://tranquilo-hurghada.com" class="cta-button">Explore Our Villa</a>
                    </div>
                    <p>Need assistance? Our team is here to help you create unforgettable memories in Hurghada.</p>
                </div>
                <div class="footer">
                    <p>📍 Villa No. 276, Mubarak Housing 7, North Hurghada, Egypt</p>
                    <p>📞 +49 176 7623 0320 | ✉️ nabil.laaouina@outlook.com</p>
                    <p>This email was sent to ${userEmail}</p>
                    <p>© 2024 Tranquilo Hurghada. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const getServicesSection = (services: BookingData['bookingServices']): string => {
    if (!services || services.length === 0) return '';

    const servicesHtml = services.map(service => `
        <div class="service-card">
            <h4>${service.service.title}</h4>
            <p>${service.service.description}</p>
            <p><strong>Category:</strong> ${service.service.category}</p>
        </div>
    `).join('');

    return `
        <h3>Additional Services</h3>
        ${servicesHtml}
    `;
};

const getNewBookingTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const content = `
        <h2>${isAdminView ? 'New Booking Request Received' : 'New Booking Request'}</h2>
        <p>${isAdminView ? 'A new booking request has been received and requires your attention!' : 'A new booking request has been received!'}</p>
        
        <div class="booking-card">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Villa:</strong> ${booking.villa.title}</p>
            <p><strong>Location:</strong> ${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</p>
            
            <div class="guest-info">
                <h4>Guest Information</h4>
                <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                <p><strong>Email:</strong> ${booking.guest.email}</p>
                ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
            </div>
            
            <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
            <p class="total-guests"><strong>Total Guests:</strong> ${totalGuests} (${booking.totalAdults} adults, ${booking.totalChildren} children)</p>
            
            <div class="payment-info">
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                <p><strong>Payment Status:</strong> ${booking.isPaid ? 'Paid' : 'Unpaid'}</p>
                <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
            </div>
            
            ${booking.notes ? `<p><strong>Guest Notes:</strong> ${booking.notes}</p>` : ''}
            
            ${getServicesSection(booking.bookingServices)}
            
            <span class="status pending">PENDING APPROVAL</span>
        </div>
        
        ${isAdminView ? '<p><strong>Action Required:</strong> Please review and approve/reject this booking request.</p>' : ''}
    `;
    return getBaseTemplate(content);
};

const getBookingConfirmedTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const content = `
        <h2>${isAdminView ? 'Booking Confirmed - Admin Notification' : 'Booking Confirmed!'}</h2>
        <p>${isAdminView ? 'You have successfully confirmed a booking.' : 'Great news! Your booking has been confirmed.'}</p>
        
        <div class="booking-card">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Villa:</strong> ${booking.villa.title}</p>
            <p><strong>Location:</strong> ${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</p>
            
            ${isAdminView ? `
            <div class="guest-info">
                <h4>Guest Information</h4>
                <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                <p><strong>Email:</strong> ${booking.guest.email}</p>
                ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
            </div>
            ` : ''}
            
            <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
            <p class="total-guests"><strong>Total Guests:</strong> ${totalGuests} (${booking.totalAdults} adults, ${booking.totalChildren} children)</p>
            
            <div class="payment-info">
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
            </div>
            
            ${getServicesSection(booking.bookingServices)}
            
            <span class="status confirmed">CONFIRMED</span>
        </div>
        
        ${!isAdminView ? '<p>We look forward to welcoming you to Tranquilo Hurghada!</p>' : ''}
    `;
    return getBaseTemplate(content);
};

const getBookingRejectedTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const content = `
        <h2>${isAdminView ? 'Booking Rejected - Admin Notification' : 'Booking Request Declined'}</h2>
        <p>${isAdminView ? 'You have rejected a booking request.' : 'We\'re sorry, but your booking request has been declined.'}</p>
        
        ${booking.rejectionReason ? `<p><strong>Reason:</strong> ${booking.rejectionReason}</p>` : ''}
        
        <div class="booking-card">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Villa:</strong> ${booking.villa.title}</p>
            <p><strong>Location:</strong> ${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</p>
            
            ${isAdminView ? `
            <div class="guest-info">
                <h4>Guest Information</h4>
                <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                <p><strong>Email:</strong> ${booking.guest.email}</p>
                ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
            </div>
            ` : ''}
            
            <p><strong>Dates:</strong> ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}</p>
            <p class="total-guests"><strong>Total Guests:</strong> ${totalGuests} (${booking.totalAdults} adults, ${booking.totalChildren} children)</p>
            
            ${getServicesSection(booking.bookingServices)}
            
            <span class="status rejected">REJECTED</span>
        </div>
        
        ${!isAdminView ? '<p>Please feel free to contact us for alternative dates or accommodations.</p>' : ''}
    `;
    return getBaseTemplate(content);
};

const getBookingCancelledTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const content = `
        <h2>${isAdminView ? 'Booking Cancelled - Admin Notification' : 'Booking Cancelled'}</h2>
        <p>${isAdminView ? 'A booking has been cancelled.' : 'Your booking has been cancelled.'}</p>
        
        ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
        
        <div class="booking-card">
            <h3>Booking Details</h3>
            <p><strong>Booking ID:</strong> ${booking.id}</p>
            <p><strong>Villa:</strong> ${booking.villa.title}</p>
            <p><strong>Location:</strong> ${booking.villa.address}, ${booking.villa.city}, ${booking.villa.country}</p>
            
            ${isAdminView ? `
            <div class="guest-info">
                <h4>Guest Information</h4>
                <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                <p><strong>Email:</strong> ${booking.guest.email}</p>
                ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
            </div>
            ` : ''}
            
            <p><strong>Dates:</strong> ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}</p>
            <p class="total-guests"><strong>Total Guests:</strong> ${totalGuests} (${booking.totalAdults} adults, ${booking.totalChildren} children)</p>
            
            <div class="payment-info">
                <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
                <p><strong>Refund Status:</strong> ${booking.isPaid ? 'Refund will be processed according to our cancellation policy' : 'No payment to refund'}</p>
            </div>
            
            ${getServicesSection(booking.bookingServices)}
            
            <span class="status cancelled">CANCELLED</span>
        </div>
        
        ${!isAdminView ? '<p>We hope to welcome you to Tranquilo Hurghada in the future.</p>' : ''}
    `;
    return getBaseTemplate(content);
};

export const sendWelcomeEmail = async (userEmail: string, userName: string): Promise<void> => {
    const subject = 'Welcome to Tranquilo Hurghada - Your Red Sea Paradise Awaits!';
    const html = getWelcomeTemplate(userName, userEmail);
    await sendEmail(userEmail, subject, html);
};

export const sendNewBookingNotification = async (booking: BookingData): Promise<void> => {
    const guestSubject = `Booking Request Submitted - ${booking.villa.title}`;
    const adminSubject = `New Booking Request - ${booking.villa.title} (${booking.guest.fullName})`;

    await sendBulkEmails([
        {
            to: booking.guest.email,
            subject: guestSubject,
            html: getNewBookingTemplate(booking, false)
        },
        // {
        //     to: booking.villa.owner.email,
        //     subject: adminSubject,
        //     html: getNewBookingTemplate(booking, true)
        // },
        {
            to: 'admin@tranquilo-hurghada.com',
            subject: adminSubject,
            html: getNewBookingTemplate(booking, true)
        }
    ]);
};

export const sendBookingConfirmation = async (booking: BookingData): Promise<void> => {
    const guestSubject = `Booking Confirmed - ${booking.villa.title}`;
    const adminSubject = `Booking Confirmed - ${booking.villa.title} (${booking.guest.fullName})`;

    await sendBulkEmails([
        {
            to: booking.guest.email,
            subject: guestSubject,
            html: getBookingConfirmedTemplate(booking, false)
        },
        {
            to: 'admin@tranquilo-hurghada.com',
            subject: adminSubject,
            html: getBookingConfirmedTemplate(booking, true)
        }
    ]);
};

export const sendBookingRejection = async (booking: BookingData): Promise<void> => {
    const guestSubject = `Booking Request Declined - ${booking.villa.title}`;
    const adminSubject = `Booking Rejected - ${booking.villa.title} (${booking.guest.fullName})`;

    await sendBulkEmails([
        {
            to: booking.guest.email,
            subject: guestSubject,
            html: getBookingRejectedTemplate(booking, false)
        },
        {
            to: 'admin@tranquilo-hurghada.com',
            subject: adminSubject,
            html: getBookingRejectedTemplate(booking, true)
        }
    ]);
};

export const sendBookingCancellation = async (booking: BookingData): Promise<void> => {
    const guestSubject = `Booking Cancelled - ${booking.villa.title}`;
    const adminSubject = `Booking Cancelled - ${booking.villa.title} (${booking.guest.fullName})`;

    await sendBulkEmails([
        {
            to: booking.guest.email,
            subject: guestSubject,
            html: getBookingCancelledTemplate(booking, false)
        },
        {
            to: 'admin@tranquilo-hurghada.com',
            subject: adminSubject,
            html: getBookingCancelledTemplate(booking, true)
        }
    ]);
};