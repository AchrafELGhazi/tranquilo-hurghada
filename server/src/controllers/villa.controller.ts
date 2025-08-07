import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { VillaStatus } from '@prisma/client';
import { getVillas, getVillaById } from '../services/villa.service';
import { parseQueryDates } from '../utils/booking.utils';

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

        // Status filter
        if (status && Object.values(VillaStatus).includes(status as VillaStatus)) {
            filters.status = status as VillaStatus;
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

        // Hide sensitive information and unavailable villas from non-owners
        if (!villa.isActive || villa.status !== VillaStatus.AVAILABLE) {
            // Check if requesting user is the owner or admin (if authenticated)
            const authHeader = req.headers['authorization'];
            let canViewInactiveVilla = false;

            if (authHeader) {
                // This is a simplified check - in practice, you might want to verify the token
                // For now, we'll just show basic villa info for inactive villas
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
            isActive: true, // Show all villas (active and inactive) for owners
            page: Math.max(1, parseInt(page as string) || 1),
            limit: Math.min(50, Math.max(1, parseInt(limit as string) || 10)),
            sortBy: ['title', 'pricePerNight', 'maxGuests', 'bedrooms', 'createdAt'].includes(sortBy as string)
                ? sortBy as string
                : 'createdAt',
            sortOrder: ['asc', 'desc'].includes(sortOrder as string) ? sortOrder as string : 'desc'
        };

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