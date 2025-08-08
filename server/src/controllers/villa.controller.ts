import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import { VillaStatus } from '@prisma/client';
import { getVillas, getVillaById } from '../services/villa.service';
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

export const updateVilla = async (req: any, res: Response) => {
    try {
        const { villaId } = req.params;
        const userId = req.user.id;
        const userRole = req.user?.role;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if villa exists
        const existingVilla = await prisma.villa.findUnique({
            where: { id: villaId },
            include: { owner: true }
        });

        if (!existingVilla) {
            return res.status(404).json({
                success: false,
                message: 'Villa not found'
            });
        }

        // Check permissions (only villa owner or admin can update)
        if (existingVilla.ownerId !== userId && userRole !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this villa'
            });
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

        // Validate required fields
        if (!title || !address || !city || !country || !pricePerNight || !maxGuests || !bedrooms || !bathrooms) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Validate numeric values
        if (pricePerNight <= 0 || maxGuests <= 0 || bedrooms <= 0 || bathrooms <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Numeric values must be greater than 0'
            });
        }

        // Validate status
        const validStatuses = ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid villa status'
            });
        }

        // Update villa
        const updatedVilla = await prisma.villa.update({
            where: { id: villaId },
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                address: address.trim(),
                city: city.trim(),
                country: country.trim(),
                pricePerNight: parseFloat(pricePerNight),
                maxGuests: parseInt(maxGuests),
                bedrooms: parseInt(bedrooms),
                bathrooms: parseInt(bathrooms),
                amenities: amenities || [],
                images: images || [],
                status: status || existingVilla.status,
                isActive: isActive !== undefined ? isActive : existingVilla.isActive,
                updatedAt: new Date()
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
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Villa updated successfully',
            data: updatedVilla
        });

    } catch (error) {
        console.error('Error updating villa:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * @route   DELETE /api/villas/:villaId
 * @desc    Delete villa (soft delete - set isActive to false)
 * @access  Private (Admins only)
 */
export const deleteVilla = async (req: any, res: Response) => {
    try {
        const { villaId } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        if (!userId || userRole !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Only administrators can delete villas'
            });
        }

        // Check if villa exists
        const existingVilla = await prisma.villa.findUnique({
            where: { id: villaId },
            include: {
                bookings: {
                    where: {
                        status: {
                            in: ['PENDING', 'CONFIRMED']
                        }
                    }
                }
            }
        });

        if (!existingVilla) {
            return res.status(404).json({
                success: false,
                message: 'Villa not found'
            });
        }

        // Check if villa has active bookings
        if (existingVilla.bookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete villa with active bookings. Please cancel or complete all bookings first.'
            });
        }

        // Soft delete - set isActive to false instead of actually deleting
        await prisma.villa.update({
            where: { id: villaId },
            data: {
                isActive: false,
                status: 'UNAVAILABLE',
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            success: true,
            message: 'Villa deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting villa:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
