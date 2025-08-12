import { Villa, VillaStatus, Prisma } from '@prisma/client';
import prisma from '../config/database';

interface VillaFilters {
    city?: string;
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    maxGuests?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    amenities?: string[];
    status?: VillaStatus;
    ownerId?: string;
    isActive?: boolean;
    checkIn?: Date;
    checkOut?: Date;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'pricePerNight' | 'maxGuests' | 'bedrooms' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

interface PaginatedVillasResponse {
    villas: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface CreateVillaParams {
    title: string;
    description?: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: number;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities?: string[];
    images?: string[];
    ownerId: string;
}

interface UpdateVillaParams {
    title?: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;
    pricePerNight?: number;
    maxGuests?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
    images?: string[];
    status?: VillaStatus;
    isActive?: boolean;
}

export const getVillas = async (filters: VillaFilters): Promise<PaginatedVillasResponse> => {
    const {
        city,
        country,
        minPrice,
        maxPrice,
        maxGuests,
        minBedrooms,
        minBathrooms,
        amenities,
        status,
        ownerId,
        isActive = true,
        checkIn,
        checkOut,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;

    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.VillaWhereInput = {
        isActive,
        status
    };

    if (city) {
        where.city = {
            contains: city,
            mode: 'insensitive'
        };
    }

    if (country) {
        where.country = {
            contains: country,
            mode: 'insensitive'
        };
    }

    if (minPrice || maxPrice) {
        where.pricePerNight = {};
        if (minPrice) where.pricePerNight.gte = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
        if (maxPrice) where.pricePerNight.lte = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    }

    if (maxGuests) {
        where.maxGuests = { gte: typeof maxGuests === 'string' ? parseInt(maxGuests) : maxGuests };
    }

    if (minBedrooms) {
        where.bedrooms = { gte: typeof minBedrooms === 'string' ? parseInt(minBedrooms) : minBedrooms };
    }

    if (minBathrooms) {
        where.bathrooms = { gte: typeof minBathrooms === 'string' ? parseInt(minBathrooms) : minBathrooms };
    }

    if (amenities && amenities.length > 0) {
        where.amenities = {
            hasEvery: amenities
        };
    }

    if (ownerId) {
        where.ownerId = ownerId;
    }

    // Availability filter for date range
    if (checkIn && checkOut) {
        // Find villas that don't have conflicting bookings
        where.NOT = {
            bookings: {
                some: {
                    status: {
                        in: ['PENDING', 'CONFIRMED']
                    },
                    OR: [
                        // New booking starts during existing booking
                        {
                            AND: [
                                { checkIn: { lte: checkIn } },
                                { checkOut: { gt: checkIn } }
                            ]
                        },
                        // New booking ends during existing booking
                        {
                            AND: [
                                { checkIn: { lt: checkOut } },
                                { checkOut: { gte: checkOut } }
                            ]
                        },
                        // New booking completely encompasses existing booking
                        {
                            AND: [
                                { checkIn: { gte: checkIn } },
                                { checkOut: { lte: checkOut } }
                            ]
                        },
                        // Existing booking completely encompasses new booking
                        {
                            AND: [
                                { checkIn: { lte: checkIn } },
                                { checkOut: { gte: checkOut } }
                            ]
                        }
                    ]
                }
            }
        };
    }

    // Get total count
    const total = await prisma.villa.count({ where });

    // Get villas with all related data including services
    const villas = await prisma.villa.findMany({
        where,
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    role: true
                }
            },
            services: {
                where: { isActive: true },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    category: true,
                    price: true,
                    duration: true,
                    difficulty: true,
                    maxGroupSize: true,
                    image: true,
                    isFeatured: true
                },
                orderBy: [
                    { isFeatured: 'desc' },
                    { category: 'asc' },
                    { title: 'asc' }
                ]
            },
            _count: {
                select: {
                    bookings: {
                        where: {
                            status: {
                                in: ['PENDING', 'CONFIRMED']
                            }
                        }
                    },
                    services: {
                        where: { isActive: true }
                    }
                }
            }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum // Use the converted number
    });

    return {
        villas,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        }
    };
};

export const getVillaById = async (villaId: string): Promise<any> => {
    return await prisma.villa.findUnique({
        where: { id: villaId },
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    phone: true,
                    role: true
                }
            },
            services: {
                where: { isActive: true },
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
                    isFeatured: true,
                    createdAt: true,
                    updatedAt: true
                },
                orderBy: [
                    { isFeatured: 'desc' },
                    { category: 'asc' },
                    { title: 'asc' }
                ]
            },
            bookings: {
                where: {
                    status: {
                        in: ['PENDING', 'CONFIRMED']
                    }
                },
                select: {
                    id: true,
                    checkIn: true,
                    checkOut: true,
                    status: true,
                    totalAdults: true,
                    totalChildren: true,
                    guest: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    }
                },
                orderBy: {
                    checkIn: 'asc'
                }
            },
            _count: {
                select: {
                    bookings: {
                        where: {
                            status: 'COMPLETED'
                        }
                    },
                    services: {
                        where: { isActive: true }
                    }
                }
            }
        }
    });
};

export const createVilla = async (params: CreateVillaParams): Promise<any> => {
    try {
        const villa = await prisma.villa.create({
            data: {
                title: params.title.trim(),
                description: params.description?.trim() || null,
                address: params.address.trim(),
                city: params.city.trim(),
                country: params.country.trim(),
                pricePerNight: params.pricePerNight,
                maxGuests: params.maxGuests,
                bedrooms: params.bedrooms,
                bathrooms: params.bathrooms,
                amenities: params.amenities || [],
                images: params.images || [],
                ownerId: params.ownerId,
                status: VillaStatus.AVAILABLE,
                isActive: true
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        role: true
                    }
                },
                services: {
                    where: { isActive: true }
                }
            }
        });

        return villa;
    } catch (error) {
        console.error('Error creating villa:', error);
        throw new Error('Failed to create villa');
    }
};

export const updateVilla = async (villaId: string, params: UpdateVillaParams): Promise<any> => {
    try {
        // Build update data object
        const updateData: any = {
            updatedAt: new Date()
        };

        // Only include fields that are provided
        if (params.title !== undefined) updateData.title = params.title.trim();
        if (params.description !== undefined) updateData.description = params.description?.trim() || null;
        if (params.address !== undefined) updateData.address = params.address.trim();
        if (params.city !== undefined) updateData.city = params.city.trim();
        if (params.country !== undefined) updateData.country = params.country.trim();
        if (params.pricePerNight !== undefined) updateData.pricePerNight = params.pricePerNight;
        if (params.maxGuests !== undefined) updateData.maxGuests = params.maxGuests;
        if (params.bedrooms !== undefined) updateData.bedrooms = params.bedrooms;
        if (params.bathrooms !== undefined) updateData.bathrooms = params.bathrooms;
        if (params.amenities !== undefined) updateData.amenities = params.amenities;
        if (params.images !== undefined) updateData.images = params.images;
        if (params.status !== undefined) updateData.status = params.status;
        if (params.isActive !== undefined) updateData.isActive = params.isActive;

        const villa = await prisma.villa.update({
            where: { id: villaId },
            data: updateData,
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        phone: true,
                        role: true
                    }
                },
                services: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        category: true,
                        price: true,
                        duration: true,
                        difficulty: true,
                        maxGroupSize: true,
                        image: true,
                        isFeatured: true
                    }
                },
                _count: {
                    select: {
                        bookings: {
                            where: {
                                status: {
                                    in: ['PENDING', 'CONFIRMED']
                                }
                            }
                        },
                        services: {
                            where: { isActive: true }
                        }
                    }
                }
            }
        });

        return villa;
    } catch (error) {
        console.error('Error updating villa:', error);
        throw new Error('Failed to update villa');
    }
};

export const deleteVilla = async (villaId: string): Promise<any> => {
    try {
        // Check for active bookings
        const activeBookings = await prisma.booking.count({
            where: {
                villaId,
                status: {
                    in: ['PENDING', 'CONFIRMED']
                }
            }
        });

        if (activeBookings > 0) {
            throw new Error('Cannot delete villa with active bookings. Please cancel or complete all bookings first.');
        }

        // Soft delete - set isActive to false and status to UNAVAILABLE
        const villa = await prisma.villa.update({
            where: { id: villaId },
            data: {
                isActive: false,
                status: VillaStatus.UNAVAILABLE,
                updatedAt: new Date()
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                }
            }
        });

        return villa;
    } catch (error) {
        console.error('Error deleting villa:', error);
        throw error;
    }
};

export const getVillaStatistics = async (villaId: string): Promise<any> => {
    try {
        const stats = await prisma.villa.findUnique({
            where: { id: villaId },
            select: {
                id: true,
                title: true,
                _count: {
                    select: {
                        bookings: true,
                        services: {
                            where: { isActive: true }
                        }
                    }
                },
                bookings: {
                    select: {
                        status: true,
                        totalPrice: true,
                        checkIn: true,
                        checkOut: true
                    }
                }
            }
        });

        if (!stats) {
            throw new Error('Villa not found');
        }

        // Calculate statistics
        const totalBookings = stats.bookings.length;
        const completedBookings = stats.bookings.filter(b => b.status === 'COMPLETED').length;
        const confirmedBookings = stats.bookings.filter(b => b.status === 'CONFIRMED').length;
        const pendingBookings = stats.bookings.filter(b => b.status === 'PENDING').length;

        const totalRevenue = stats.bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, booking) => sum + parseFloat(booking.totalPrice.toString()), 0);

        const averageBookingValue = completedBookings > 0 ? totalRevenue / completedBookings : 0;

        // Calculate occupancy rate for the last 12 months
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const recentBookings = stats.bookings.filter(
            b => b.status === 'COMPLETED' && new Date(b.checkOut) >= oneYearAgo
        );

        const totalNightsBooked = recentBookings.reduce((sum, booking) => {
            const nights = Math.ceil(
                (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
            );
            return sum + nights;
        }, 0);

        const occupancyRate = totalNightsBooked > 0 ? (totalNightsBooked / 365) * 100 : 0;

        return {
            villaId: stats.id,
            villaTitle: stats.title,
            totalBookings,
            completedBookings,
            confirmedBookings,
            pendingBookings,
            totalServices: stats._count.services,
            totalRevenue,
            averageBookingValue,
            occupancyRate: Math.round(occupancyRate * 100) / 100,
            period: '12 months'
        };
    } catch (error) {
        console.error('Error getting villa statistics:', error);
        throw error;
    }
};