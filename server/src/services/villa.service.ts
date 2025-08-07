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
    villas: (Villa & {
        owner: {
            id: string;
            fullName: string;
            email: string;
        };
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
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
        status = VillaStatus.AVAILABLE,
        ownerId,
        isActive = true,
        checkIn,
        checkOut,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.VillaWhereInput = {
        isActive,
        status
    };

    // Location filters
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

    // Price filters
    if (minPrice || maxPrice) {
        where.pricePerNight = {};
        if (minPrice) where.pricePerNight.gte = minPrice;
        if (maxPrice) where.pricePerNight.lte = maxPrice;
    }

    // Capacity filters
    if (maxGuests) {
        where.maxGuests = { gte: maxGuests };
    }

    if (minBedrooms) {
        where.bedrooms = { gte: minBedrooms };
    }

    if (minBathrooms) {
        where.bathrooms = { gte: minBathrooms };
    }

    // Amenities filter
    if (amenities && amenities.length > 0) {
        where.amenities = {
            hasEvery: amenities
        };
    }

    // Owner filter
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

    // Get villas
    const villas = await prisma.villa.findMany({
        where,
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
    });

    return {
        villas,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

export const getVillaById = async (villaId: string): Promise<Villa | null> => {
    return await prisma.villa.findUnique({
        where: { id: villaId },
        include: {
            owner: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                    role: true
                }
            },
            bookings: {
                where: {
                    status: {
                        in: ['PENDING', 'CONFIRMED']
                    }
                },
                select: {
                    checkIn: true,
                    checkOut: true,
                    status: true
                }
            }
        }
    });
};