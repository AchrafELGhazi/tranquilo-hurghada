import { BookingStatus, PaymentMethod, Prisma } from '@prisma/client';
import prisma from '../config/database';
import { validateBookingDates, checkVillaAvailability, calculateTotalPrice } from '../utils/booking.utils';
import { sendBookingNotificationEmails } from '../utils/emailService';

interface CreateBookingParams {
    villaId: string;
    guestId: string;
    checkIn: Date;
    checkOut: Date;
    totalGuests: number;
    paymentMethod: PaymentMethod;
    notes?: string;
}

interface BookingFilters {
    status?: BookingStatus;
    villaId?: string;
    guestId?: string;
    ownerId?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice';
    sortOrder?: 'asc' | 'desc';
}

interface PaginatedBookingsResponse {
    bookings: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export const createBooking = async (params: CreateBookingParams): Promise<any> => {
    const { villaId, guestId, checkIn, checkOut, totalGuests, paymentMethod, notes } = params;

    // Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
        throw new Error(dateValidation.error);
    }

    // Get villa details
    const villa = await prisma.villa.findUnique({
        where: { id: villaId },
        include: {
            owner: {
                select: { id: true, fullName: true, email: true, role: true }
            }
        }
    });

    if (!villa) {
        throw new Error('Villa not found');
    }

    if (!villa.isActive || villa.status !== 'AVAILABLE') {
        throw new Error('Villa is not available for booking');
    }

    if (totalGuests > villa.maxGuests) {
        throw new Error(`Maximum ${villa.maxGuests} guests allowed`);
    }

    // Check availability
    const isAvailable = await checkVillaAvailability(villaId, checkIn, checkOut);
    if (!isAvailable) {
        throw new Error('Villa is not available for the selected dates');
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(villa.pricePerNight, checkIn, checkOut);

    // Create booking
    const booking = await prisma.booking.create({
        data: {
            villaId,
            guestId,
            checkIn,
            checkOut,
            totalGuests,
            totalPrice,
            paymentMethod,
            notes,
            status: BookingStatus.PENDING
        },
        include: {
            villa: {
                include: {
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true, phone: true, dateOfBirth: true }
            }
        }
    });

    // Send notification emails
    try {
        await sendBookingNotificationEmails({
            booking,
            type: 'NEW_BOOKING'
        });
    } catch (error) {
        console.error('Failed to send booking notification emails:', error);
        // Don't throw error as booking was successful
    }

    return booking;
};

export const getBookings = async (filters: BookingFilters): Promise<PaginatedBookingsResponse> => {
    const {
        status,
        villaId,
        guestId,
        ownerId,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.BookingWhereInput = {};

    if (status) where.status = status;
    if (villaId) where.villaId = villaId;
    if (guestId) where.guestId = guestId;
    if (ownerId) {
        where.villa = {
            ownerId: ownerId
        };
    }

    // Date range filtering
    if (startDate || endDate) {
        where.OR = [
            // Check-in date within range
            {
                checkIn: {
                    ...(startDate && { gte: startDate }),
                    ...(endDate && { lte: endDate })
                }
            },
            // Check-out date within range
            {
                checkOut: {
                    ...(startDate && { gte: startDate }),
                    ...(endDate && { lte: endDate })
                }
            },
            // Booking spans the entire range
            {
                AND: [
                    ...(startDate ? [{ checkIn: { lte: startDate } }] : []),
                    ...(endDate ? [{ checkOut: { gte: endDate } }] : [])
                ]
            }
        ];
    }

    // Get total count
    const total = await prisma.booking.count({ where });

    // Get bookings
    const bookings = await prisma.booking.findMany({
        where,
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    pricePerNight: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            },
            guest: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    dateOfBirth: true
                }
            }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
    });

    return {
        bookings,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getBookingById = async (bookingId: string, userId: string, userRole: string): Promise<any> => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    dateOfBirth: true
                }
            },
            confirmedBy: {
                select: { id: true, fullName: true, email: true }
            },
            cancelledBy: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    if (!booking) return null;

    // Check permissions
    const isOwner = booking.villa.ownerId === userId;
    const isGuest = booking.guestId === userId;
    const isAdmin = userRole === 'ADMIN';

    if (!isOwner && !isGuest && !isAdmin) {
        throw new Error('Access denied: You can only view your own bookings');
    }

    return booking;
};

export const confirmBooking = async (bookingId: string, confirmedById: string): Promise<any> => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
        throw new Error(`Cannot confirm booking with status: ${booking.status}`);
    }

    // Check if booking dates are still available
    const isStillAvailable = await checkVillaAvailability(
        booking.villaId,
        booking.checkIn,
        booking.checkOut,
        bookingId // Exclude current booking from availability check
    );

    if (!isStillAvailable) {
        throw new Error('Villa is no longer available for the selected dates');
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CONFIRMED,
            confirmedById,
            confirmedAt: new Date()
        },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    // Send confirmation emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking,
            type: 'BOOKING_CONFIRMED'
        });
    } catch (error) {
        console.error('Failed to send booking confirmation emails:', error);
    }

    return updatedBooking;
};

export const rejectBooking = async (
    bookingId: string,
    rejectedById: string,
    rejectionReason?: string
): Promise<any> => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    // if (booking.status !== BookingStatus.PENDING) {
    //     throw new Error(`Cannot reject booking with status: ${booking.status}`);
    // }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.REJECTED,
            rejectedAt: new Date(),
            rejectionReason
        },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    // Send rejection emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking,
            type: 'BOOKING_REJECTED'
        });
    } catch (error) {
        console.error('Failed to send booking rejection emails:', error);
    }

    return updatedBooking;
};

export const cancelBooking = async (
    bookingId: string,
    cancelledById: string,
    cancellationReason?: string
): Promise<any> => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    const allowedStatuses: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];
    if (!allowedStatuses.includes(booking.status)) {
        throw new Error(`Cannot cancel booking with status: ${booking.status}`);
    }

    // Check if booking can still be cancelled (e.g., not past check-in date)
    const now = new Date();
    if (booking.checkIn <= now) {
        throw new Error('Cannot cancel booking after check-in date');
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CANCELLED,
            cancelledById,
            cancelledAt: new Date(),
            cancellationReason
        },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                    country: true,
                    ownerId: true,
                    owner: {
                        select: { id: true, fullName: true, email: true, role: true }
                    }
                }
            },
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    // Send cancellation emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking,
            type: 'BOOKING_CANCELLED'
        });
    } catch (error) {
        console.error('Failed to send booking cancellation emails:', error);
    }

    return updatedBooking;
};

export const completeBooking = async (bookingId: string): Promise<any> => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            villa: true,
            guest: {
                select: { id: true, fullName: true, email: true }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    if (booking.status !== BookingStatus.CONFIRMED) {
        throw new Error(`Cannot complete booking with status: ${booking.status}`);
    }

    const now = new Date();
    if (booking.checkOut > now) {
        throw new Error('Cannot complete booking before check-out date');
    }

    return await prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.COMPLETED,
            completedAt: new Date()
        }
    });
};  



export const getVillaBookedDatesFromDB = async (
    villaId: string,
    startDate: Date,
    endDate: Date
): Promise<string[]> => {
    try {
        // Get all bookings that overlap with the requested date range
        // Only include PENDING and CONFIRMED bookings (not cancelled/rejected)
        const bookings = await prisma.booking.findMany({
            where: {
                villaId,
                status: {
                    in: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
                },
                OR: [
                    // Booking starts within the range
                    {
                        checkIn: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    // Booking ends within the range
                    {
                        checkOut: {
                            gte: startDate,
                            lte: endDate
                        }
                    },
                    // Booking spans the entire range
                    {
                        AND: [
                            { checkIn: { lte: startDate } },
                            { checkOut: { gte: endDate } }
                        ]
                    }
                ]
            },
            select: {
                checkIn: true,
                checkOut: true,
                status: true
            },
            orderBy: {
                checkIn: 'asc'
            }
        });

        // Generate all booked dates
        const bookedDatesSet = new Set<string>();

        bookings.forEach(booking => {
            const currentDate = new Date(booking.checkIn);
            const endBookingDate = new Date(booking.checkOut);

            // Add each day from check-in to check-out (excluding check-out day)
            while (currentDate < endBookingDate) {
                const dateString = currentDate.toISOString().split('T')[0];
                bookedDatesSet.add(dateString);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        // Convert set to sorted array
        return Array.from(bookedDatesSet).sort();

    } catch (error) {
        console.error('Error getting villa booked dates:', error);
        throw new Error('Failed to retrieve villa booked dates');
    }
};