import type { Booking, BookingStatus, PaymentMethod } from '@/utils/types';

export interface BookingForEmail {
    id: string;
    checkIn: string;
    checkOut: string;
    totalAdults: number;
    totalChildren: number;
    totalPrice: number;
    status: BookingStatus;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    notes: string;
    cancellationReason: string;
    rejectionReason: string; // Added rejection reason field
    villa: {
        id: string;
        title: string;
        description: string;
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
            phone: string;
        };
    };
    guest: {
        id: string;
        fullName: string;
        email: string;
        phone: string;
    };
    bookingServices: Array<{
        id: string;
        service: {
            id: string;
            title: string;
            description: string;
            category: string;
        };
    }>;
}

// Helper function to transform booking data for email
export const transformBookingDataForEmail = (
    booking: Booking,
    reasonParam: string = '', // This can be cancellation or rejection reason
    user: any = null
): BookingForEmail => {
    // Determine the appropriate reason based on booking status
    let cancellationReason = '';
    let rejectionReason = '';

    if (booking.status === 'CANCELLED') {
        cancellationReason = reasonParam || booking.cancellationReason || '';
    } else if (booking.status === 'REJECTED') {
        rejectionReason = reasonParam || booking.rejectionReason || '';
    } else {
        // For other statuses, use existing reasons from booking object
        cancellationReason = booking.cancellationReason || '';
        rejectionReason = booking.rejectionReason || '';
    }

    // Ensure all required fields are present with proper defaults
    const emailBookingData: BookingForEmail = {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalAdults: Number(booking.totalAdults) || 1,
        totalChildren: Number(booking.totalChildren) || 0,
        totalPrice: Number(booking.totalPrice) || 0,
        status: booking.status || 'PENDING',
        paymentMethod: booking.paymentMethod || 'BANK_TRANSFER',
        isPaid: Boolean(booking.isPaid),
        notes: booking.notes || '',
        cancellationReason: cancellationReason,
        rejectionReason: rejectionReason,
        villa: {
            id: booking.villa?.id || 'tranquilo-hurghada',
            title: booking.villa?.title || 'Tranquilo Hurghada Villa',
            description: booking.villa?.description || 'Luxury villa in Hurghada',
            address: booking.villa?.address || 'Villa No. 276, Mubarak Housing 7, North Hurghada',
            city: booking.villa?.city || 'Hurghada',
            country: booking.villa?.country || 'Egypt',
            pricePerNight: Number(booking.villa?.pricePerNight) || 150,
            maxGuests: Number(booking.villa?.maxGuests) || 10,
            bedrooms: Number(booking.villa?.bedrooms) || 3,
            bathrooms: Number(booking.villa?.bathrooms) || 3,
            amenities: booking.villa?.amenities || ['wifi', 'pool', 'parking'],
            images: booking.villa?.images || [],
            owner: {
                id: booking.villa?.owner?.id || 'cme1mzesx0000cvr4tc85n5nx',
                fullName: booking.villa?.owner?.fullName || 'Achraf Admin',
                email: booking.villa?.owner?.email || 'admin@tranquilo-hurghada.com',
                phone: booking.villa?.owner?.phone || '+49 176 7623 0320',
            },
        },
        guest: {
            id: booking.guest?.id || user?.id || 'guest_id',
            fullName: booking.guest?.fullName || user?.fullName || 'Guest User',
            email: booking.guest?.email || user?.email || 'guest@example.com',
            phone: booking.guest?.phone || user?.phone || '',
        },
        bookingServices:
            booking.bookingServices?.map(service => ({
                id: service.id,
                service: {
                    id: service.service?.id || service.serviceId || 'service_id',
                    title: service.service?.title || 'Service',
                    description: service.service?.description || '',
                    category: service.service?.category || 'CUSTOM',
                },
            })) || [],
    };

    // Log for debugging
    console.log('Transform booking data for email:', {
        bookingId: emailBookingData.id,
        status: emailBookingData.status,
        cancellationReason: emailBookingData.cancellationReason,
        rejectionReason: emailBookingData.rejectionReason,
        reasonParam: reasonParam,
        originalBookingStatus: booking.status,
        originalCancellationReason: booking.cancellationReason,
        originalRejectionReason: booking.rejectionReason,
    });

    return emailBookingData;
};

// Helper function to create a complete booking object for updates
export const createUpdatedBooking = (
    originalBooking: Booking,
    cancellationReason: string,
    user: any
): Booking => {
    return {
        ...originalBooking,
        status: 'CANCELLED' as const,
        cancellationReason,
        createdAt: originalBooking.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        guestId: originalBooking.guestId || originalBooking.guest?.id || user?.id || '',
        villaId: originalBooking.villaId || originalBooking.villa?.id || '',
    };
};

// Helper function specifically for rejection emails
export const transformBookingDataForRejection = (
    booking: Booking,
    rejectionReason: string,
    user: any = null
): BookingForEmail => {
    const rejectedBooking: Booking = {
        ...booking,
        status: 'REJECTED' as const,
        rejectionReason: rejectionReason,
        updatedAt: new Date().toISOString(),
    };

    return transformBookingDataForEmail(rejectedBooking, rejectionReason, user);
};

// Helper function specifically for confirmation emails
export const transformBookingDataForConfirmation = (
    booking: Booking,
    user: any = null
): BookingForEmail => {
    const confirmedBooking: Booking = {
        ...booking,
        status: 'CONFIRMED' as const,
        updatedAt: new Date().toISOString(),
    };

    return transformBookingDataForEmail(confirmedBooking, '', user);
};

// Helper function specifically for cancellation emails
export const transformBookingDataForCancellation = (
    booking: Booking,
    cancellationReason: string,
    user: any = null
): BookingForEmail => {
    const cancelledBooking: Booking = {
        ...booking,
        status: 'CANCELLED' as const,
        cancellationReason: cancellationReason,
        updatedAt: new Date().toISOString(),
    };

    return transformBookingDataForEmail(cancelledBooking, cancellationReason, user);
};