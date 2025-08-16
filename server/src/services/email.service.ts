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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.5; 
                    color: #333; 
                    background: #ffffff;
                    padding: 10px;
                }
                .email-container { 
                    background: #ffffff; 
                    border: 1px solid #e0e0e0;
                    margin: 0 auto;
                    max-width: 650px;
                }
                .logo-header { 
                    background: #ffffff;
                    padding: 15px 20px; 
                    border-bottom: 1px solid #e0e0e0;
                    text-align: left;
                }
                .logo-header img {
                    height: 40px;
                    width: auto;
                }
                .content-wrapper { 
                    padding: 20px;
                    background: #ffffff;
                }
                .main-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 5px;
                }
                .subtitle {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 20px;
                }
                .booking-card { 
                    background: #f9f9f9; 
                    padding: 15px; 
                    margin: 15px 0; 
                    border: 1px solid #e0e0e0;
                    border-left: 3px solid #e74c3c;
                }
                .booking-header {
                    border-bottom: 1px solid #e0e0e0;
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                }
                .booking-ref {
                    font-size: 16px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin-bottom: 3px;
                }
                .booking-date {
                    color: #666;
                    font-size: 13px;
                }
                .info-grid {
                    display: table;
                    width: 100%;
                    margin: 15px 0;
                }
                .info-section {
                    display: table-cell;
                    vertical-align: top;
                    padding: 10px;
                    border: 1px solid #e8e8e8;
                    background: #ffffff;
                    width: 50%;
                }
                .info-section h4 {
                    color: #333;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: bold;
                }
                .info-section p {
                    margin: 3px 0;
                    font-size: 13px;
                    color: #555;
                }
                .service-card { 
                    background: #f5f5f5; 
                    padding: 10px; 
                    margin: 8px 0; 
                    border-left: 3px solid #e67e22;
                }
                .service-card h5 {
                    color: #d35400;
                    margin-bottom: 5px;
                    font-size: 14px;
                    font-weight: bold;
                }
                .status { 
                    padding: 8px 15px; 
                    border-radius: 3px; 
                    font-weight: bold;
                    font-size: 12px;
                    text-transform: uppercase;
                    display: inline-block;
                    margin: 10px 0;
                }
                .confirmed { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .cancelled { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .rejected { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .pending { background: #fff3cd; color: #856404; border: 1px solid #ffeaa7; }
                .completed { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
                
                .payment-summary {
                    background: #e3f2fd;
                    border: 1px solid #bbdefb;
                    padding: 15px;
                    margin: 15px 0;
                }
                .payment-summary h3 {
                    margin-bottom: 10px;
                    font-size: 16px;
                    color: #333;
                }
                .total-amount {
                    font-size: 24px;
                    font-weight: bold;
                    margin: 8px 0;
                    color: #1976d2;
                }
                
                .arrival-info {
                    background: #fce4ec;
                    border: 1px solid #f8bbd9;
                    padding: 15px;
                    margin: 15px 0;
                }
                
                .next-steps {
                    background: #f0f0f0;
                    padding: 15px;
                    border: 1px dashed #ccc;
                    margin: 15px 0;
                }
                
                .cta-button { 
                    display: inline-block; 
                    background: #e74c3c; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 3px; 
                    font-weight: bold;
                    margin: 10px 0;
                }
                
                .admin-actions {
                    background: #f8f9fa;
                    padding: 15px;
                    border: 1px solid #dee2e6;
                    text-align: center;
                    margin: 15px 0;
                }
                
                .footer { 
                    background: #f8f9fa;
                    border-top: 1px solid #e0e0e0;
                    padding: 15px 20px; 
                    text-align: center; 
                    font-size: 12px;
                    color: #666;
                }
                .footer a {
                    color: #e74c3c;
                    text-decoration: none;
                }
                .footer .contact-info {
                    margin: 8px 0;
                }
                .footer .contact-info div {
                    margin: 3px 0;
                }
                
                .welcome-hero {
                    background: #e8f5e8;
                    border: 1px solid #c3e6cb;
                    padding: 20px;
                    text-align: center;
                    margin: 15px 0;
                }
                .welcome-hero h2 {
                    font-size: 20px;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                @media (max-width: 600px) {
                    .content-wrapper { padding: 15px; }
                    .booking-card { padding: 12px; margin: 10px 0; }
                    .info-section { display: block; width: 100%; margin-bottom: 10px; }
                    .main-title { font-size: 18px; }
                    .total-amount { font-size: 20px; }
                    .logo-header { padding: 10px 15px; }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="logo-header">
                    <img src="https://res.cloudinary.com/dzavrovbk/image/upload/logo_ccp6vb.png" alt="Tranquilo Hurghada" />
                </div>
                <div class="content-wrapper">
                    ${content}
                </div>
                <div class="footer">
                    <div class="contact-info">
                        <div>📍 Villa No. 276, Mubarak Housing 7, North Hurghada, Egypt</div>
                        <div>📞 +49 176 7623 0320 | ✉️ nabil.laaouina@outlook.com</div>
                        <div>🌐 <a href="https://tranquilo-hurghada.com/en/my-bookings">View All Your Bookings</a></div>
                    </div>
                    <p style="margin-top: 20px; opacity: 0.8;">© 2024 Tranquilo Hurghada. All rights reserved.</p>
                    <p style="margin-top: 10px; opacity: 0.6; font-size: 11px;">Your Red Sea paradise experience awaits! 🌊</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const getWelcomeTemplate = (userName: string, userEmail: string): string => {
    const content = `
        <div class="welcome-hero">
            <h2>Welcome to Your Red Sea Adventure!</h2>
            <p style="font-size: 16px; margin: 10px 0;">Hello ${userName}, where ancient Egyptian mystique meets luxury along the pristine Red Sea coast!</p>
        </div>
        
        <div class="booking-card">
            <h3 style="color: #e74c3c; margin-bottom: 15px;">Your Journey Begins Here</h3>
            <p>You now have exclusive access to our premium villa booking system and luxury services. Get ready to create unforgettable memories in the heart of Hurghada!</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://tranquilo-hurghada.com" class="cta-button">Explore Our Villa</a>
            </div>
            
            <div class="info-section" style="border-left-color: #e74c3c; display: block; width: auto;">
                <h4>What's Next?</h4>
                <p>• Browse our luxurious villa and stunning amenities</p>
                <p>• Select your perfect dates and additional services</p>
                <p>• Submit your booking request for instant processing</p>
                <p>• Get ready for the ultimate Red Sea experience!</p>
            </div>
        </div>
        
        <div style="text-align: center; padding: 15px;">
            <p style="font-size: 14px; color: #666;">Need assistance? Our friendly team is here to help you every step of the way!</p>
        </div>
    `;
    return getBaseTemplate(content);
};

const getServicesSection = (services: BookingData['bookingServices']): string => {
    if (!services || services.length === 0) return '';

    const servicesHtml = services.map(service => `
        <div class="service-card">
            <h5>${service.service.title}</h5>
            <p style="color: #666; margin: 3px 0; font-size: 13px;">${service.service.description}</p>
            <p style="color: #d35400; font-weight: bold; font-size: 12px; text-transform: uppercase;">${service.service.category}</p>
        </div>
    `).join('');

    return `
        <div style="margin: 15px 0;">
            <h4 style="color: #e67e22; margin-bottom: 10px; font-size: 14px;">Selected Services</h4>
            ${servicesHtml}
        </div>
    `;
};

const calculateNights = (checkIn: Date, checkOut: Date): number => {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getNewBookingTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const submissionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    if (isAdminView) {
        const content = `
            <h1 class="main-title">🔔 NEW BOOKING REQUEST</h1>
            <p class="subtitle">A new booking request requires your attention!</p>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-ref">Booking Reference: ${booking.id}</div>
                    <div class="booking-date">Submitted: ${submissionDate}</div>
                </div>
                
                <div class="info-grid">
                    <div class="info-section">
                        <h4>👤 Guest Details</h4>
                        <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                        <p><strong>Email:</strong> ${booking.guest.email}</p>
                        ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
                        <p><strong>Guests:</strong> ${booking.totalAdults} Adults, ${booking.totalChildren} Children</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>🏡 Booking Details</h4>
                        <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
                        <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
                        <p><strong>Duration:</strong> ${nights} nights</p>
                        <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
                    </div>
                </div>
                
                ${getServicesSection(booking.bookingServices)}
                
                ${booking.notes ? `
                <div class="info-section" style="border-left-color: #9b59b6;">
                    <h4>💬 Guest Notes</h4>
                    <p>${booking.notes}</p>
                </div>
                ` : ''}
                
                <div class="admin-actions">
                    <h4 style="margin-bottom: 15px;">⚡ Quick Action Required</h4>
                    <a href="https://tranquilo-hurghada.com/en/admin/bookings" class="cta-button">
                        🎯 VIEW & RESPOND
                    </a>
                    <p style="margin-top: 15px; color: #7f8c8d; font-size: 14px;">
                        Please respond within 24 hours to maintain guest satisfaction
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px;">
                    <span class="status pending">⏳ PENDING APPROVAL</span>
                </div>
            </div>
        `;
        return getBaseTemplate(content);
    } else {
        const content = `
            <h1 class="main-title">📋 BOOKING REQUEST RECEIPT</h1>
            <p class="subtitle">Your booking request has been submitted successfully!</p>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-ref">Receipt #: ${booking.id}</div>
                    <div class="booking-date">Date: ${submissionDate}</div>
                </div>
                
                <div class="info-grid">
                    <div class="info-section">
                        <h4>👤 Guest Information</h4>
                        <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                        <p><strong>Email:</strong> ${booking.guest.email}</p>
                        ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
                        <p><strong>Guests:</strong> ${totalGuests} (${booking.totalAdults} Adults, ${booking.totalChildren} Children)</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>🏖️ Booking Details</h4>
                        <p><strong>Villa:</strong> ${booking.villa.title}</p>
                        <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
                        <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
                        <p><strong>Duration:</strong> ${nights} nights</p>
                    </div>
                </div>
                
                ${getServicesSection(booking.bookingServices)}
                
                <div class="payment-summary">
                    <h3>💳 Payment Summary</h3>
                    <div class="total-amount">$${booking.totalPrice}</div>
                    <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                    <p><strong>Status:</strong> ${booking.isPaid ? '✅ Paid' : '⏳ Pending Confirmation'}</p>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <span class="status pending">⏳ PENDING CONFIRMATION</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3 style="color: #e74c3c; margin-bottom: 15px;">🎯 Next Steps</h3>
                <p>Your booking request is under review by our team. You'll receive confirmation within <strong>24 hours</strong> via email with payment instructions and check-in details!</p>
                <p style="margin-top: 15px; font-weight: 600; color: #27ae60;">🌊 Your Red Sea Escape Awaits!</p>
            </div>
        `;
        return getBaseTemplate(content);
    }
};

const getBookingConfirmedTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const confirmationDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    if (isAdminView) {
        const content = `
            <h1 class="main-title">✅ Booking Confirmed - Admin Notification</h1>
            <p class="subtitle">You have successfully confirmed a booking</p>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-ref">Booking Reference: ${booking.id}</div>
                    <div class="booking-date">Confirmed: ${confirmationDate}</div>
                </div>
                
                <div class="info-grid">
                    <div class="info-section">
                        <h4>👤 Guest Information</h4>
                        <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                        <p><strong>Email:</strong> ${booking.guest.email}</p>
                        ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
                        <p><strong>Guests:</strong> ${totalGuests} (${booking.totalAdults} Adults, ${booking.totalChildren} Children)</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>🏖️ Booking Details</h4>
                        <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)}</p>
                        <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
                        <p><strong>Duration:</strong> ${nights} nights</p>
                        <p><strong>Total Amount:</strong> $${booking.totalPrice}</p>
                    </div>
                </div>
                
                ${getServicesSection(booking.bookingServices)}
                
                <div style="text-align: center; margin: 20px 0;">
                    <span class="status confirmed">✅ CONFIRMED</span>
                </div>
            </div>
        `;
        return getBaseTemplate(content);
    } else {
        const content = `
            <h1 class="main-title">🎉 BOOKING CONFIRMED!</h1>
            <p class="subtitle">Your Hurghada Villa Awaits - ${booking.id}</p>
            
            <div class="booking-card">
                <div class="booking-header">
                    <div class="booking-ref">Booking Reference: ${booking.id}</div>
                    <div class="booking-date">Confirmation Date: ${confirmationDate}</div>
                </div>
                
                <div class="info-grid">
                    <div class="info-section">
                        <h4>👤 Your Booking Details</h4>
                        <p><strong>Guest:</strong> ${booking.guest.fullName}</p>
                        <p><strong>Villa:</strong> ${booking.villa.title}</p>
                        <p><strong>Duration:</strong> ${nights} nights</p>
                        <p><strong>Guests:</strong> ${totalGuests} (${booking.totalAdults} Adults, ${booking.totalChildren} Children)</p>
                    </div>
                    
                    <div class="info-section">
                        <h4>📅 Stay Dates</h4>
                        <p><strong>Check-in:</strong> ${formatDate(booking.checkIn)} at 3:00 PM</p>
                        <p><strong>Check-out:</strong> ${formatDate(booking.checkOut)}</p>
                    </div>
                </div>
                
                ${getServicesSection(booking.bookingServices)}
                
                <div class="payment-summary">
                    <h3>💳 Payment Details</h3>
                    <div class="total-amount">$${booking.totalPrice}</div>
                    <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> ${booking.isPaid ? '✅ Completed' : '⏳ Pending'}</p>
                </div>
                
                <div class="arrival-info">
                    <h3>🛬 Arrival Information</h3>
                    <p><strong>🚗 Airport Pickup:</strong> Included - We'll contact you 24 hours before arrival</p>
                    <p><strong>🏡 Villa Address:</strong> ${booking.villa.address}, ${booking.villa.city}</p>
                    <p><strong>🎯 Check-in Process:</strong> Our team will welcome you at the villa with refreshments and a brief orientation</p>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <span class="status confirmed">✅ CONFIRMED</span>
                </div>
            </div>
            
            <div class="next-steps">
                <h3 style="color: #27ae60; margin-bottom: 15px;">🌊 Your Red Sea Escape is Confirmed!</h3>
                <p>We're absolutely thrilled to host your Hurghada adventure! For any questions or special requests, just reply to this email or message us on WhatsApp.</p>
                <p style="margin-top: 10px; font-style: italic; color: #7f8c8d;">- The Villa Team 🏖️</p>
            </div>
        `;
        return getBaseTemplate(content);
    }
};

const getBookingRejectedTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;
    const nights = calculateNights(booking.checkIn, booking.checkOut);

    const content = `
        <h1 class="main-title">${isAdminView ? '❌ Booking Rejected - Admin Notification' : '😔 Booking Request Declined'}</h1>
        <p class="subtitle">${isAdminView ? 'You have rejected a booking request' : 'We\'re sorry, but your booking request has been declined'}</p>
        
        ${booking.rejectionReason ? `
        <div class="booking-card" style="border-left: 4px solid #e74c3c;">
            <h3 style="color: #e74c3c; margin-bottom: 15px;">📝 Reason for Decline</h3>
            <p style="font-size: 16px; color: #555;">${booking.rejectionReason}</p>
        </div>
        ` : ''}
        
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-ref">Booking Reference: ${booking.id}</div>
            </div>
            
            <div class="info-grid">
                ${isAdminView ? `
                <div class="info-section">
                    <h4>👤 Guest Information</h4>
                    <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                    <p><strong>Email:</strong> ${booking.guest.email}</p>
                    ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
                </div>
                ` : ''}
                
                <div class="info-section">
                    <h4>🏖️ Booking Details</h4>
                    <p><strong>Villa:</strong> ${booking.villa.title}</p>
                    <p><strong>Dates:</strong> ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}</p>
                    <p><strong>Guests:</strong> ${totalGuests} (${booking.totalAdults} Adults, ${booking.totalChildren} Children)</p>
                </div>
            </div>
            
            ${getServicesSection(booking.bookingServices)}
            
            <div style="text-align: center; margin: 20px 0;">
                <span class="status rejected">❌ REJECTED</span>
            </div>
        </div>
        
        ${!isAdminView ? `
        <div class="next-steps">
            <h3 style="color: #3498db; margin-bottom: 15px;">🌅 Don't Give Up on Your Dream Vacation!</h3>
            <p>Please feel free to contact us for alternative dates or accommodations. We'd love to help you find the perfect time for your Red Sea getaway!</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://tranquilo-hurghada.com" class="cta-button">🔍 Find Alternative Dates</a>
            </div>
        </div>
        ` : ''}
    `;
    return getBaseTemplate(content);
};

const getBookingCancelledTemplate = (booking: BookingData, isAdminView: boolean = false): string => {
    const totalGuests = booking.totalAdults + booking.totalChildren;

    const content = `
        <h1 class="main-title">${isAdminView ? '🚫 Booking Cancelled - Admin Notification' : '😞 Booking Cancelled'}</h1>
        <p class="subtitle">${isAdminView ? 'A booking has been cancelled' : 'Your booking has been cancelled'}</p>
        
        ${booking.cancellationReason ? `
        <div class="booking-card" style="border-left: 4px solid #f39c12;">
            <h3 style="color: #f39c12; margin-bottom: 15px;">📝 Cancellation Reason</h3>
            <p style="font-size: 16px; color: #555;">${booking.cancellationReason}</p>
        </div>
        ` : ''}
        
        <div class="booking-card">
            <div class="booking-header">
                <div class="booking-ref">Booking Reference: ${booking.id}</div>
            </div>
            
            <div class="info-grid">
                ${isAdminView ? `
                <div class="info-section">
                    <h4>👤 Guest Information</h4>
                    <p><strong>Name:</strong> ${booking.guest.fullName}</p>
                    <p><strong>Email:</strong> ${booking.guest.email}</p>
                    ${booking.guest.phone ? `<p><strong>Phone:</strong> ${booking.guest.phone}</p>` : ''}
                </div>
                ` : ''}
                
                <div class="info-section">
                    <h4>🏖️ Booking Details</h4>
                    <p><strong>Villa:</strong> ${booking.villa.title}</p>
                    <p><strong>Dates:</strong> ${formatDate(booking.checkIn)} - ${formatDate(booking.checkOut)}</p>
                    <p><strong>Guests:</strong> ${totalGuests} (${booking.totalAdults} Adults, ${booking.totalChildren} Children)</p>
                </div>
            </div>
            
            <div class="payment-summary" style="background: linear-gradient(135deg, #95a5a6, #7f8c8d);">
                <h3>💰 Refund Information</h3>
                <div class="total-amount">${booking.totalPrice}</div>
                <p><strong>Refund Status:</strong> ${booking.isPaid ? '🔄 Refund will be processed according to our cancellation policy' : '✅ No payment to refund'}</p>
            </div>
            
            ${getServicesSection(booking.bookingServices)}
            
            <div style="text-align: center; margin: 20px 0;">
                <span class="status cancelled">🚫 CANCELLED</span>
            </div>
        </div>
        
        ${!isAdminView ? `
        <div class="next-steps">
            <h3 style="color: #3498db; margin-bottom: 15px;">🌊 We Hope to Welcome You Soon!</h3>
            <p>While we're sad to see this booking cancelled, we hope to welcome you to Tranquilo Hurghada in the future. The Red Sea will be waiting for your return!</p>
            <div style="text-align: center; margin-top: 20px;">
                <a href="https://tranquilo-hurghada.com" class="cta-button">🔄 Book Again</a>
            </div>
        </div>
        ` : ''}
    `;
    return getBaseTemplate(content);
};

export const sendWelcomeEmail = async (userEmail: string, userName: string): Promise<void> => {
    const subject = '🌊 Welcome to Tranquilo Hurghada - Your Red Sea Paradise Awaits!';
    const html = getWelcomeTemplate(userName, userEmail);
    await sendEmail(userEmail, subject, html);
};

export const sendNewBookingNotification = async (booking: BookingData): Promise<void> => {
    const guestSubject = `📋 Booking Request Submitted - ${booking.villa.title}`;
    const adminSubject = `🔔 New Booking Request - ${booking.villa.title} (${booking.guest.fullName})`;

    await sendBulkEmails([
        {
            to: booking.guest.email,
            subject: guestSubject,
            html: getNewBookingTemplate(booking, false)
        },
        {
            to: 'admin@tranquilo-hurghada.com',
            subject: adminSubject,
            html: getNewBookingTemplate(booking, true)
        }
    ]);
};

export const sendBookingConfirmation = async (booking: BookingData): Promise<void> => {
    const guestSubject = `✅ Booking Confirmed! Your Hurghada Villa Awaits`;
    const adminSubject = `✅ Booking Confirmed - ${booking.villa.title} (${booking.guest.fullName})`;

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
    const adminSubject = `❌ Booking Rejected - ${booking.villa.title} (${booking.guest.fullName})`;

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
    const adminSubject = `🚫 Booking Cancelled - ${booking.villa.title} (${booking.guest.fullName})`;

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