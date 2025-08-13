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
    getVillaStatistics,
    validateServiceOwnership
} from '../services/villa.service';
import prisma from '../config/database';

export const getAllVillas = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getVillas(req.query as any);
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
        const villa = await getVillaById(villaId);

        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
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

        if (user.role === 'GUEST') {
            ApiResponse.forbidden(res, 'Guests cannot own villas');
            return;
        }

        const filters = {
            ...req.query as any,
            ownerId: user.id
        };

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

        if (user.role === 'GUEST') {
            ApiResponse.forbidden(res, 'Guests cannot create villas');
            return;
        }

        const villa = await createVilla({
            ...req.body,
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

        // Check if villa exists and user has permission
        const existingVilla = await getVillaById(villaId);
        if (!existingVilla) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

        if (existingVilla.ownerId !== user.id && user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'You are not authorized to update this villa');
            return;
        }

        // Additional validation for service operations
        if (req.body.services) {
            // Validate service update permissions
            if (req.body.services.update && req.body.services.update.length > 0) {
                const serviceIds = req.body.services.update
                    .map((service: any) => service.id)
                    .filter(Boolean);

                if (serviceIds.length > 0) {
                    const isValid = await validateServiceOwnership(serviceIds, villaId);
                    if (!isValid) {
                        ApiResponse.badRequest(res, 'One or more services do not belong to this villa');
                        return;
                    }
                }
            }

            // Validate service delete permissions
            if (req.body.services.delete && req.body.services.delete.length > 0) {
                const isValid = await validateServiceOwnership(req.body.services.delete, villaId);
                if (!isValid) {
                    ApiResponse.badRequest(res, 'One or more services to delete do not belong to this villa');
                    return;
                }
            }
        }

        const updatedVilla = await updateVillaService(villaId, req.body);

        // Log the update activity
        logger.info(`Villa updated successfully`, {
            villaId,
            userId: user.id,
            updateFields: Object.keys(req.body),
            hasServiceUpdates: !!req.body.services
        });

        ApiResponse.success(res, updatedVilla, 'Villa and services updated successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update villa';
        logger.error('Update villa error:', {
            villaId: req.params.villaId,
            userId: req.user?.id,
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('Service with ID') && error.message.includes('not found')) {
                ApiResponse.badRequest(res, error.message);
                return;
            }
            if (error.message.includes('Cannot delete services') && error.message.includes('active bookings')) {
                ApiResponse.conflict(res, error.message);
                return;
            }
            if (error.message.includes('Service ID is required for updates')) {
                ApiResponse.badRequest(res, error.message);
                return;
            }
        }

        ApiResponse.serverError(res, errorMessage);
    }
};

export const deleteVilla = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { villaId } = req.params;
        const user = req.user!;

        if (user.role !== 'ADMIN') {
            ApiResponse.forbidden(res, 'Only administrators can delete villas');
            return;
        }

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

        const villa = await getVillaById(villaId);
        if (!villa) {
            ApiResponse.notFound(res, 'Villa not found');
            return;
        }

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

        // Build date range
        let startDate: Date;
        let endDate: Date;

        if (year) {
            const yearNum = Number(year);
            if (month) {
                const monthNum = Number(month);
                startDate = new Date(yearNum, monthNum - 1, 1);
                endDate = new Date(yearNum, monthNum, 0);
            } else {
                startDate = new Date(yearNum, 0, 1);
                endDate = new Date(yearNum, 11, 31);
            }
        } else {
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
                        status: { in: ['PENDING', 'CONFIRMED'] },
                        OR: [
                            { checkIn: { gte: startDate, lte: endDate } },
                            { checkOut: { gte: startDate, lte: endDate } },
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