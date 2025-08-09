import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { VillaStatus } from '@prisma/client';
import {
    getVillas,
    getVillaById,
    createVilla,
    updateVilla as updateVillaService,
    deleteVilla as deleteVillaService,
    getVillaStatistics
} from '../services/villa.service';
import { parseQueryDates } from '../utils/booking.utils';
import prisma from '../config/database';

export const getAllVillas = async (req: Request, res: Response): Promise<void> => {
    try {
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
            checkIn,
            checkOut,
            page = '1',
            limit = '12',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Parse and validate parameters
        const parsedPage = Math.max(1, parseInt(page as string) || 1);
        const parsedLimit = Math.min(50, Math.max(1, parseInt(limit as string) || 12));

        const filters: any = {
            page: parsedPage,
            limit: parsedLimit,
            sortBy: ['title', 'pricePerNight', 'maxGuests', 'bedrooms', 'createdAt'].includes(sortBy as string)
                ? sortBy as string
                : 'createdAt',
            sortOrder: ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc'
        };

        // Location filters
        if (city) filters.city = city as string;
        if (country) filters.country = country as string;

        // Price filters
        if (minPrice) {
            const price = parseFloat(minPrice as string);
            if (!isNaN(price) && price >= 0) filters.minPrice = price;
        }

        if (maxPrice) {
            const price = parseFloat(maxPrice as string);
            if (!isNaN(price) && price >= 0) filters.maxPrice = price;
        }

        // Capacity filters
        if (maxGuests) {
            const guests = parseInt(maxGuests as string);
            if (!isNaN(guests) && guests > 0) filters.maxGuests = guests;
        }

        if (minBedrooms) {
            const bedrooms = parseInt(minBedrooms as string);
            if (!isNaN(bedrooms) && bedrooms >= 0) filters.minBedrooms = bedrooms;
        }

        if (minBathrooms) {
            const bathrooms = parseInt(minBathrooms as string);
            if (!isNaN(bathrooms) && bathrooms >= 0) filters.minBathrooms = bathrooms;
        }

        // Amenities filter
        if (amenities) {
            const amenitiesList = typeof amenities === 'string'
                ? amenities.split(',').map(a => a.trim()).filter(a => a.length > 0)
                : [];
            if (amenitiesList.length > 0) filters.amenities = amenitiesList;
        }

        // Status filter (only for authenticated requests with proper permissions)
        if (status && Object.values(VillaStatus).includes(status as VillaStatus)) {
            filters.status = status as VillaStatus;
        } else {
            // Default to only available villas for public requests
            filters.status = VillaStatus.AVAILABLE;
        }

        // Owner filter
        if (ownerId) filters.ownerId = ownerId as string;

        // Date availability filters
        if (checkIn) {
            filters.checkIn = parseQueryDates(checkIn as string);
            if (!filters.checkIn) {
                ApiResponse.badRequest(res, 'Invalid checkIn date format');
                return;
            }
        }

        if (checkOut) {
            filters.checkOut = parseQueryDates(checkOut as string);
            if (!filters.checkOut) {
                ApiResponse.badRequest(res, 'Invalid checkOut date format');
                return;
            }
        }

        // Validate date range if both provided
        if (filters.checkIn && filters.checkOut && filters.checkIn >= filters.checkOut) {
            ApiResponse.badRequest(res, 'Check-out date must be after check-in date');
            return;
        }

        const result = await getVillas(filters);

        ApiResponse.successWithPagination(
            res,
            result.villas,
            result.pagination,
            'Villas retrieved successfully'
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villas';
        logger.error('Get villas error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getVillaDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        const villa = await getVillaById(villaId);

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        // Hide sensitive information for inactive villas from non-owners
        if (!villa.isActive || villa.status !== VillaStatus.AVAILABLE) {
            // Check if requesting user is the owner or admin (if authenticated)
            const authHeader = req.headers['authorization'];
            let canViewInactiveVilla = false;

            if (authHeader) {
                try {
                    // You might want to verify the token here to check user permissions
                    // For now, we'll allow viewing if there's an auth header
                    // In a real implementation, decode the JWT and check permissions
                    canViewInactiveVilla = true;
                } catch (error) {
                    canViewInactiveVilla = false;
                }
            }

            if (!canViewInactiveVilla) {
                ApiResponse.notFound(res, 'Villa not found or not available');
                return;
            }
        }

        ApiResponse.success(res, villa, 'Villa details retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa details';
        logger.error('Get villa details error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getMyVillas = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        // Only hosts and admins can have villas
        if (user.role === 'GUEST') {
            ApiResponse.forbidden(res, 'Guests cannot own villas');
            return;
        }

        const {
            status,
            page = '1',
            limit = '10',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const filters: any = {
            ownerId: user.id,
            page: Math.max(1, parseInt(page as string) || 1),
            limit: Math.min(50, Math.max(1, parseInt(limit as string) || 10)),
            sortBy: ['title', 'pricePerNight', 'maxGuests', 'bedrooms', 'createdAt'].includes(sortBy as string)
                ? sortBy as string
                : 'createdAt',
            sortOrder: ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc'
        };

        // Don't filter by isActive for owners - they should see all their villas
        delete filters.isActive;

        if (status && Object.values(VillaStatus).includes(status as VillaStatus)) {
            filters.status = status as VillaStatus;
        }

        const result = await getVillas(filters);

        ApiResponse.successWithPagination(
            res,
            result.villas,
            result.pagination,
            'Your villas retrieved successfully'
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get your villas';
        logger.error('Get my villas error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const createVillaRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const user = req.user!;

        // Only hosts and admins can create villas
        if (user.role === 'GUEST') {
            ApiResponse.forbidden(res, 'Guests cannot create villas');
            return;
        }

        const {
            title,
            description,
            address,
            city,
            country,
            pricePerNight,
            maxGuests,
            bedrooms,
            bathrooms,
            amenities,
            images
        } = req.body;

        // Validate required fields
        if (!title || !address || !city || !country || !pricePerNight || !maxGuests || !bedrooms || !bathrooms) {
            ApiResponse.badRequest(res, 'Missing required fields: title, address, city, country, pricePerNight, maxGuests, bedrooms, bathrooms');
            return;
        }

        // Validate numeric values
        if (pricePerNight <= 0 || maxGuests <= 0 || bedrooms <= 0 || bathrooms <= 0) {
            ApiResponse.badRequest(res, 'Numeric values must be greater than 0');
            return;
        }

        if (maxGuests > 50) {
            ApiResponse.badRequest(res, 'Maximum guests cannot exceed 50');
            return;
        }

        if (bedrooms > 20 || bathrooms > 20) {
            ApiResponse.badRequest(res, 'Bedrooms and bathrooms cannot exceed 20');
            return;
        }

        // Validate arrays
        if (amenities && !Array.isArray(amenities)) {
            ApiResponse.badRequest(res, 'Amenities must be an array');
            return;
        }

        if (images && !Array.isArray(images)) {
            ApiResponse.badRequest(res, 'Images must be an array');
            return;
        }

        const villa = await createVilla({
            title,
            description,
            address,
            city,
            country,
            pricePerNight: parseFloat(pricePerNight),
            maxGuests: parseInt(maxGuests),
            bedrooms: parseInt(bedrooms),
            bathrooms: parseInt(bathrooms),
            amenities: amenities || [],
            images: images || [],
            ownerId: user.id
        });

        ApiResponse.created(res, villa, 'Villa created successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create villa';
        logger.error('Create villa error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const updateVilla = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const user = req.user!;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        // Check if villa exists
        const existingVilla = await getVillaById(villaId);
        if (!existingVilla) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        // Check permissions (only villa owner or admin can update)
        if (existingVilla.ownerId !== user.id && user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'You are not authorized to update this villa');
            return;
        }

        const {
            title,
            description,
            address,
            city,
            country,
            pricePerNight,
            maxGuests,
            bedrooms,
            bathrooms,
            amenities,
            images,
            status,
            isActive
        } = req.body;

        // Validate numeric values if provided
        if (pricePerNight !== undefined && pricePerNight <= 0) {
            ApiResponse.badRequest(res, 'Price per night must be greater than 0');
            return;
        }

        if (maxGuests !== undefined && (maxGuests <= 0 || maxGuests > 50)) {
            ApiResponse.badRequest(res, 'Max guests must be between 1 and 50');
            return;
        }

        if (bedrooms !== undefined && (bedrooms <= 0 || bedrooms > 20)) {
            ApiResponse.badRequest(res, 'Bedrooms must be between 1 and 20');
            return;
        }

        if (bathrooms !== undefined && (bathrooms <= 0 || bathrooms > 20)) {
            ApiResponse.badRequest(res, 'Bathrooms must be between 1 and 20');
            return;
        }

        // Validate arrays if provided
        if (amenities !== undefined && !Array.isArray(amenities)) {
            ApiResponse.badRequest(res, 'Amenities must be an array');
            return;
        }

        if (images !== undefined && !Array.isArray(images)) {
            ApiResponse.badRequest(res, 'Images must be an array');
            return;
        }

        // Validate status if provided
        if (status !== undefined && !Object.values(VillaStatus).includes(status)) {
            ApiResponse.badRequest(res, `Status must be one of: ${Object.values(VillaStatus).join(', ')}`);
            return;
        }

        // Validate isActive if provided
        if (isActive !== undefined && typeof isActive !== 'boolean') {
            ApiResponse.badRequest(res, 'isActive must be a boolean');
            return;
        }

        const updateParams: any = {};
        if (title !== undefined) updateParams.title = title;
        if (description !== undefined) updateParams.description = description;
        if (address !== undefined) updateParams.address = address;
        if (city !== undefined) updateParams.city = city;
        if (country !== undefined) updateParams.country = country;
        if (pricePerNight !== undefined) updateParams.pricePerNight = parseFloat(pricePerNight);
        if (maxGuests !== undefined) updateParams.maxGuests = parseInt(maxGuests);
        if (bedrooms !== undefined) updateParams.bedrooms = parseInt(bedrooms);
        if (bathrooms !== undefined) updateParams.bathrooms = parseInt(bathrooms);
        if (amenities !== undefined) updateParams.amenities = amenities;
        if (images !== undefined) updateParams.images = images;
        if (status !== undefined) updateParams.status = status;
        if (isActive !== undefined) updateParams.isActive = isActive;

        const updatedVilla = await updateVillaService(villaId, updateParams);

        ApiResponse.success(res, updatedVilla, 'Villa updated successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update villa';
        logger.error('Update villa error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const deleteVilla = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const user = req.user!;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        // Only admins can delete villas
        if (user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'Only administrators can delete villas');
            return;
        }

        // Check if villa exists
        const existingVilla = await getVillaById(villaId);
        if (!existingVilla) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        const deletedVilla = await deleteVillaService(villaId);

        ApiResponse.success(res, deletedVilla, 'Villa deleted successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete villa';
        logger.error('Delete villa error:', errorMessage);

        if (errorMessage.includes('Cannot delete villa with active bookings')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};

export const getVillaStatisticsEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const user = req.user!;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        // Check if villa exists and user has permission
        const villa = await getVillaById(villaId);
        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        // Only villa owner or admin can view statistics
        if (villa.ownerId !== user.id && user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'You are not authorized to view this villa\'s statistics');
            return;
        }

        const statistics = await getVillaStatistics(villaId);

        ApiResponse.success(res, statistics, 'Villa statistics retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa statistics';
        logger.error('Get villa statistics error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getVillaAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const { year, month } = req.query;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        // Build date range filter
        let startDate: Date;
        let endDate: Date;

        if (year) {
            const yearNum = parseInt(year as string);
            if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
                ApiResponse.badRequest(res, 'Invalid year. Must be between 2020 and 2030');
                return;
            }

            if (month) {
                const monthNum = parseInt(month as string);
                if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
                    ApiResponse.badRequest(res, 'Invalid month. Must be between 1 and 12');
                    return;
                }

                // Get specific month
                startDate = new Date(yearNum, monthNum - 1, 1);
                endDate = new Date(yearNum, monthNum, 0); // Last day of the month
            } else {
                // Get entire year
                startDate = new Date(yearNum, 0, 1);
                endDate = new Date(yearNum, 11, 31);
            }
        } else {
            // Default: get next 12 months from today
            startDate = new Date();
            endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            select: {
                id: true,
                title: true,
                isActive: true,
                status: true,
                bookings: {
                    where: {
                        status: {
                            in: ['PENDING', 'CONFIRMED']
                        },
                        OR: [
                            {
                                checkIn: {
                                    gte: startDate,
                                    lte: endDate
                                }
                            },
                            {
                                checkOut: {
                                    gte: startDate,
                                    lte: endDate
                                }
                            },
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
                    }
                }
            }
        });

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        // Generate unavailable dates
        const unavailableDates: string[] = [];

        villa.bookings.forEach(booking => {
            const currentDate = new Date(booking.checkIn);
            const endBookingDate = new Date(booking.checkOut);

            while (currentDate < endBookingDate) {
                const dateString = currentDate.toISOString().split('T')[0];
                if (!unavailableDates.includes(dateString)) {
                    unavailableDates.push(dateString);
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        ApiResponse.success(res, {
            villaId: villa.id,
            villaTitle: villa.title,
            isActive: villa.isActive,
            status: villa.status,
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            unavailableDates: unavailableDates.sort(),
            totalUnavailableDays: unavailableDates.length,
            bookings: villa.bookings
        }, 'Villa availability retrieved successfully');

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa availability';
        logger.error('Get villa availability error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getVillaServicesEndpoint = async (req: Request, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;

        if (!villaId) {
            ApiResponse.badRequest(res, 'Villa ID is required');
            return;
        }

        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            select: {
                id: true,
                title: true,
                isActive: true,
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
                        isFeatured: true
                    },
                    orderBy: [
                        { isFeatured: 'desc' },
                        { category: 'asc' },
                        { title: 'asc' }
                    ]
                }
            }
        });

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        if (!villa.isActive) {
            ApiResponse.badRequest(res, 'Villa is not active');
            return;
        }

        // Group services by category
        const servicesByCategory = villa.services.reduce((acc: any, service: any) => {
            if (!acc[service.category]) {
                acc[service.category] = [];
            }
            acc[service.category].push(service);
            return acc;
        }, {});

        ApiResponse.success(res, {
            villaId: villa.id,
            villaTitle: villa.title,
            totalServices: villa.services.length,
            services: villa.services,
            servicesByCategory,
            categories: Object.keys(servicesByCategory)
        }, 'Villa services retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get villa services';
        logger.error('Get villa services error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};