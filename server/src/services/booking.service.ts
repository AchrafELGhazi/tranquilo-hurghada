import { BookingStatus, PaymentMethod, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';
import { validateBookingDates, checkVillaAvailability, calculateTotalPrice } from '../utils/booking.utils';
import { sendBookingNotificationEmails } from '../utils/emailService';

interface ServiceSelection {
    serviceId: string;
    quantity?: number;
    scheduledDate?: Date;
    scheduledTime?: string;
    specialRequests?: string;
    numberOfGuests?: number;
}

interface CreateBookingParams {
    villaId: string;
    guestId: string;
    checkIn: Date;
    checkOut: Date;
    totalGuests: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    selectedServices?: ServiceSelection[];
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
    sortBy?: 'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice' | 'grandTotal';
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

const calculateServicesTotal = async (selectedServices: ServiceSelection[]): Promise<{ servicesTotal: Decimal; serviceBookings: any[] }> => {
    if (!selectedServices || selectedServices.length === 0) {
        return { servicesTotal: new Decimal(0), serviceBookings: [] };
    }

    let servicesTotal = new Decimal(0);
    const serviceBookings = [];

    for (const serviceSelection of selectedServices) {
        // Get service details
        const service = await prisma.service.findUnique({
            where: { id: serviceSelection.serviceId },
            select: { id: true, price: true, title: true, isActive: true }
        });

        if (!service) {
            throw new Error(`Service not found: ${serviceSelection.serviceId}`);
        }

        if (!service.isActive) {
            throw new Error(`Service is not available: ${service.title}`);
        }

        const quantity = serviceSelection.quantity || 1;
        const unitPrice = service.price;
        const totalPrice = new Decimal(unitPrice).mul(quantity);

        servicesTotal = servicesTotal.add(totalPrice);

        serviceBookings.push({
            serviceId: service.id,
            quantity,
            unitPrice,
            totalPrice,
            scheduledDate: serviceSelection.scheduledDate,
            scheduledTime: serviceSelection.scheduledTime,
            specialRequests: serviceSelection.specialRequests,
            numberOfGuests: serviceSelection.numberOfGuests
        });
    }

    return { servicesTotal, serviceBookings };
};

export const createBooking = async (params: CreateBookingParams): Promise<any> => {
    const { villaId, guestId, checkIn, checkOut, totalGuests, paymentMethod, notes, selectedServices } = params;

    // Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.isValid) {
        throw new Error(dateValidation.error);
    }

    // Get villa details with services
    const villa = await prisma.villa.findUnique({
        where: { id: villaId },
        include: {
            owner: {
                select: { id: true, fullName: true, email: true, role: true }
            },
            services: {
                where: { isActive: true },
                select: { id: true, title: true, price: true, category: true }
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

    // Calculate villa total price
    const villaTotal = calculateTotalPrice(villa.pricePerNight, checkIn, checkOut);

    // Calculate services total
    const { servicesTotal, serviceBookings } = await calculateServicesTotal(selectedServices || []);

    // Calculate grand total
    const grandTotal = new Decimal(villaTotal).add(servicesTotal);

    // Create booking with services in a transaction
    const booking = await prisma.$transaction(async (tx) => {
        // Create the booking
        const newBooking = await tx.booking.create({
            data: {
                villaId,
                guestId,
                checkIn,
                checkOut,
                totalGuests,
                totalPrice: villaTotal,
                servicesTotal,
                grandTotal,
                paymentMethod,
                notes,
                status: BookingStatus.PENDING
            }
        });

        // Create booking services if any
        if (serviceBookings.length > 0) {
            await tx.bookingService.createMany({
                data: serviceBookings.map(sb => ({
                    ...sb,
                    bookingId: newBooking.id
                }))
            });
        }

        // Return booking with all relations
        return await tx.booking.findUnique({
            where: { id: newBooking.id },
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
                },
                bookingServices: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                category: true,
                                price: true,
                                duration: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    });

    // Send notification emails
    try {
        await sendBookingNotificationEmails({
            booking: booking as any, // Type assertion for email service compatibility
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

    // Get bookings with services
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            category: true,
                            price: true,
                            duration: true,
                            image: true
                        }
                    }
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            longDescription: true,
                            category: true,
                            price: true,
                            duration: true,
                            difficulty: true,
                            maxGroupSize: true,
                            highlights: true,
                            included: true,
                            image: true,
                            isFeatured: true
                        }
                    }
                }
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true,
                            duration: true
                        }
                    }
                }
            }
        }
    });

    // Send confirmation emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking as any, // Type assertion for email service compatibility
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    // Send rejection emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking as any, // Type assertion for email service compatibility
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    // Send cancellation emails
    try {
        await sendBookingNotificationEmails({
            booking: updatedBooking as any, // Type assertion for email service compatibility
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
            },
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
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
        },
        include: {
            bookingServices: {
                include: {
                    service: {
                        select: {
                            id: true,
                            title: true,
                            category: true,
                            price: true
                        }
                    }
                }
            }
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

// New function to get available services for a villa
export const getVillaServices = async (villaId: string): Promise<any[]> => {
    try {
        const services = await prisma.service.findMany({
            where: {
                villaId,
                isActive: true
            },
            select: {
                id: true,
                title: true,
                description: true,
                longDescription: true,
                category: true,
                price: true,
                duration: true,
                difficulty: true,
                maxGroupSize: true,
                highlights: true,
                included: true,
                image: true,
                isFeatured: true
            },
            orderBy: [
                { isFeatured: 'desc' },
                { category: 'asc' },
                { title: 'asc' }
            ]
        });

        return services;
    } catch (error) {
        console.error('Error getting villa services:', error);
        throw new Error('Failed to retrieve villa services');
    }
};

// New function to update booking services
export const updateBookingServices = async (
    bookingId: string,
    selectedServices: ServiceSelection[]
): Promise<any> => {
    try {
        return await prisma.$transaction(async (tx) => {
            // Get current booking
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: {
                    bookingServices: true
                }
            });

            if (!booking) {
                throw new Error('Booking not found');
            }

            if (booking.status !== BookingStatus.PENDING) {
                throw new Error('Can only update services for pending bookings');
            }

            // Delete existing booking services
            await tx.bookingService.deleteMany({
                where: { bookingId }
            });

            // Calculate new services total
            const { servicesTotal, serviceBookings } = await calculateServicesTotal(selectedServices);

            // Create new booking services
            if (serviceBookings.length > 0) {
                await tx.bookingService.createMany({
                    data: serviceBookings.map(sb => ({
                        ...sb,
                        bookingId
                    }))
                });
            }

            // Update booking totals
            const grandTotal = new Decimal(booking.totalPrice).add(servicesTotal);

            const updatedBooking = await tx.booking.update({
                where: { id: bookingId },
                data: {
                    servicesTotal,
                    grandTotal
                },
                include: {
                    villa: {
                        select: {
                            id: true,
                            title: true,
                            pricePerNight: true
                        }
                    },
                    guest: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    },
                    bookingServices: {
                        include: {
                            service: {
                                select: {
                                    id: true,
                                    title: true,
                                    description: true,
                                    category: true,
                                    price: true,
                                    duration: true,
                                    image: true
                                }
                            }
                        }
                    }
                }
            });

            return updatedBooking;
        });
    } catch (error) {
        console.error('Error updating booking services:', error);
        throw new Error('Failed to update booking services');
    }
};