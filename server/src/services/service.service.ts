import { Service, ServiceCategory, ServiceDifficulty, Prisma } from '@prisma/client';
import prisma from '../config/database';

interface ServiceFilters {
    category?: ServiceCategory;
    difficulty?: ServiceDifficulty;
    minPrice?: number;
    maxPrice?: number;
    maxGroupSize?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    villaId?: string;
    page?: number;
    limit?: number;
    sortBy?: 'title' | 'price' | 'category' | 'difficulty' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

interface PaginatedServicesResponse {
    services: any[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface CreateServiceParams {
    title: string;
    description: string;
    longDescription?: string;
    category: ServiceCategory;
    price: number;
    duration: string;
    difficulty?: ServiceDifficulty;
    maxGroupSize?: number;
    highlights: string[];
    included: string[];
    image?: string;
    isFeatured?: boolean;
    villaId?: string;
}

interface UpdateServiceParams {
    title?: string;
    description?: string;
    longDescription?: string;
    category?: ServiceCategory;
    price?: number;
    duration?: string;
    difficulty?: ServiceDifficulty;
    maxGroupSize?: number;
    highlights?: string[];
    included?: string[];
    image?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    villaId?: string;
}

export const getServices = async (filters: ServiceFilters): Promise<PaginatedServicesResponse> => {
    const {
        category,
        difficulty,
        minPrice,
        maxPrice,
        maxGroupSize,
        isActive = true,
        isFeatured,
        villaId,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit;

    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ServiceWhereInput = {
        isActive
    };

    if (category) {
        where.category = category;
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = typeof minPrice === 'string' ? parseFloat(minPrice) : minPrice;
        if (maxPrice) where.price.lte = typeof maxPrice === 'string' ? parseFloat(maxPrice) : maxPrice;
    }

    if (maxGroupSize) {
        where.maxGroupSize = { gte: typeof maxGroupSize === 'string' ? parseInt(maxGroupSize) : maxGroupSize };
    }

    if (isFeatured !== undefined) {
        where.isFeatured = isFeatured;
    }

    if (villaId) {
        where.villaId = villaId;
    }

    // Get total count
    const total = await prisma.service.count({ where });

    // Get services with villa information if attached
    const services = await prisma.service.findMany({
        where,
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    country: true
                }
            },
            _count: {
                select: {
                    bookingServices: {
                        where: {
                            booking: {
                                status: {
                                    in: ['PENDING', 'CONFIRMED']
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limitNum
    });

    return {
        services,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum)
        }
    };
};

export const getServiceById = async (serviceId: string): Promise<any> => {
    return await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
            villa: {
                select: {
                    id: true,
                    title: true,
                    city: true,
                    country: true,
                    owner: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    bookingServices: {
                        where: {
                            booking: {
                                status: {
                                    in: ['PENDING', 'CONFIRMED']
                                }
                            }
                        }
                    }
                }
            }
        }
    });
};

export const createService = async (params: CreateServiceParams): Promise<any> => {
    try {
        const service = await prisma.service.create({
            data: {
                title: params.title.trim(),
                description: params.description.trim(),
                longDescription: params.longDescription?.trim() || null,
                category: params.category,
                price: params.price,
                duration: params.duration.trim(),
                difficulty: params.difficulty || null,
                maxGroupSize: params.maxGroupSize || null,
                highlights: params.highlights || [],
                included: params.included || [],
                image: params.image?.trim() || null,
                isFeatured: params.isFeatured || false,
                villaId: params.villaId || null,
                isActive: true
            },
            include: {
                villa: {
                    select: {
                        id: true,
                        title: true,
                        city: true,
                        country: true
                    }
                }
            }
        });

        return service;
    } catch (error) {
        console.error('Error creating service:', error);
        throw new Error('Failed to create service');
    }
};

export const updateService = async (serviceId: string, params: UpdateServiceParams): Promise<any> => {
    try {
        // Build update data object
        const updateData: any = {
            updatedAt: new Date()
        };

        // Only include fields that are provided
        if (params.title !== undefined) updateData.title = params.title.trim();
        if (params.description !== undefined) updateData.description = params.description.trim();
        if (params.longDescription !== undefined) updateData.longDescription = params.longDescription?.trim() || null;
        if (params.category !== undefined) updateData.category = params.category;
        if (params.price !== undefined) updateData.price = params.price;
        if (params.duration !== undefined) updateData.duration = params.duration.trim();
        if (params.difficulty !== undefined) updateData.difficulty = params.difficulty;
        if (params.maxGroupSize !== undefined) updateData.maxGroupSize = params.maxGroupSize;
        if (params.highlights !== undefined) updateData.highlights = params.highlights;
        if (params.included !== undefined) updateData.included = params.included;
        if (params.image !== undefined) updateData.image = params.image?.trim() || null;
        if (params.isActive !== undefined) updateData.isActive = params.isActive;
        if (params.isFeatured !== undefined) updateData.isFeatured = params.isFeatured;
        if (params.villaId !== undefined) updateData.villaId = params.villaId;

        const service = await prisma.service.update({
            where: { id: serviceId },
            data: updateData,
            include: {
                villa: {
                    select: {
                        id: true,
                        title: true,
                        city: true,
                        country: true,
                        owner: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        bookingServices: {
                            where: {
                                booking: {
                                    status: {
                                        in: ['PENDING', 'CONFIRMED']
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return service;
    } catch (error) {
        console.error('Error updating service:', error);
        throw new Error('Failed to update service');
    }
};

export const deleteService = async (serviceId: string): Promise<any> => {
    try {
        // Check for active bookings
        const activeBookings = await prisma.bookingService.count({
            where: {
                serviceId,
                booking: {
                    status: {
                        in: ['PENDING', 'CONFIRMED']
                    }
                }
            }
        });

        if (activeBookings > 0) {
            throw new Error('Cannot delete service with active bookings. Please cancel or complete all bookings first.');
        }

        // Soft delete - set isActive to false
        const service = await prisma.service.update({
            where: { id: serviceId },
            data: {
                isActive: false,
                updatedAt: new Date()
            },
            include: {
                villa: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        return service;
    } catch (error) {
        console.error('Error deleting service:', error);
        throw error;
    }
};