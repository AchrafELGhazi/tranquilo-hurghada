
export interface BookingData {
    id: string;
    checkIn: Date;
    checkOut: Date;
    totalGuests: number;
    totalPrice: number;
    status: string;
    notes?: string;
    villa: {
        title: string;
        address: string;
        city: string;
        country: string;
        owner: { fullName: string; email: string };
    };
    guest: { fullName: string; email: string };
    rejectionReason?: string;
    cancellationReason?: string;
}

export class BookingTemplates {
    private static getBaseTemplate(content: string): string {
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
                    .status { padding: 8px 16px; border-radius: 20px; font-weight: bold; }
                    .confirmed { background: #d1fae5; color: #065f46; }
                    .cancelled { background: #fee2e2; color: #991b1b; }
                    .rejected { background: #fce7f3; color: #be185d; }
                    .pending { background: #fef3c7; color: #92400e; }
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
    }

    static newBooking(booking: BookingData): { subject: string; html: string } {
        const content = `
            <h2>New Booking Request</h2>
            <p>A new booking request has been received!</p>
            
            <div class="booking-card">
                <h3>Booking Details</h3>
                <p><strong>Villa:</strong> ${booking.villa.title}</p>
                <p><strong>Guest:</strong> ${booking.guest.fullName}</p>
                <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
                <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
                <p><strong>Guests:</strong> ${booking.totalGuests}</p>
                <p><strong>Total:</strong> $${booking.totalPrice}</p>
                <span class="status pending">PENDING</span>
            </div>
        `;

        return {
            subject: `New Booking Request - ${booking.villa.title}`,
            html: this.getBaseTemplate(content)
        };
    }

    static bookingConfirmed(booking: BookingData): { subject: string; html: string } {
        const content = `
            <h2>Booking Confirmed!</h2>
            <p>Great news! Your booking has been confirmed.</p>
            
            <div class="booking-card">
                <h3>Booking Details</h3>
                <p><strong>Villa:</strong> ${booking.villa.title}</p>
                <p><strong>Check-in:</strong> ${booking.checkIn.toDateString()}</p>
                <p><strong>Check-out:</strong> ${booking.checkOut.toDateString()}</p>
                <p><strong>Total:</strong> $${booking.totalPrice}</p>
                <span class="status confirmed">CONFIRMED</span>
            </div>
        `;

        return {
            subject: `Booking Confirmed - ${booking.villa.title}`,
            html: this.getBaseTemplate(content)
        };
    }

    static bookingRejected(booking: BookingData): { subject: string; html: string } {
        const content = `
            <h2>Booking Request Declined</h2>
            <p>We're sorry, but your booking request has been declined.</p>
            ${booking.rejectionReason ? `<p><strong>Reason:</strong> ${booking.rejectionReason}</p>` : ''}
            
            <div class="booking-card">
                <h3>Booking Details</h3>
                <p><strong>Villa:</strong> ${booking.villa.title}</p>
                <p><strong>Dates:</strong> ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}</p>
                <span class="status rejected">REJECTED</span>
            </div>
        `;

        return {
            subject: `Booking Request Declined - ${booking.villa.title}`,
            html: this.getBaseTemplate(content)
        };
    }

    static bookingCancelled(booking: BookingData): { subject: string; html: string } {
        const content = `
            <h2>Booking Cancelled</h2>
            <p>Your booking has been cancelled.</p>
            ${booking.cancellationReason ? `<p><strong>Reason:</strong> ${booking.cancellationReason}</p>` : ''}
            
            <div class="booking-card">
                <h3>Booking Details</h3>
                <p><strong>Villa:</strong> ${booking.villa.title}</p>
                <p><strong>Dates:</strong> ${booking.checkIn.toDateString()} - ${booking.checkOut.toDateString()}</p>
                <span class="status cancelled">CANCELLED</span>
            </div>
        `;

        return {
            subject: `Booking Cancelled - ${booking.villa.title}`,
            html: this.getBaseTemplate(content)
        };
    }
}