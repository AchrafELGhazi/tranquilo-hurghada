import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ApiResponse } from '../utils/apiResponse';
import logger from '../config/logger';
import {
    getServices,
    getServiceById,
    createService,
    updateService as updateServiceService,
    deleteService as deleteServiceService
} from '../services/service.service';

export const getAllServices = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getServices(req.query as any);
        ApiResponse.successWithPagination(
            res,
            result.services,
            result.pagination,
            'Services retrieved successfully'
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get services';
        logger.error('Get services error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const getServiceDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { serviceId } = req.params;
        const service = await getServiceById(serviceId);

        if (!service) {
            ApiResponse.notFound(res, 'Service not found');
            return;
        }

        ApiResponse.success(res, service, 'Service details retrieved successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to get service details';
        logger.error('Get service details error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const createServiceRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const service = await createService(req.body);
        ApiResponse.created(res, service, 'Service created successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create service';
        logger.error('Create service error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const updateService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { serviceId } = req.params;

        const existingService = await getServiceById(serviceId);
        if (!existingService) {
            ApiResponse.notFound(res, 'Service not found');
            return;
        }

        const updatedService = await updateServiceService(serviceId, req.body);
        ApiResponse.success(res, updatedService, 'Service updated successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update service';
        logger.error('Update service error:', errorMessage);
        ApiResponse.serverError(res, errorMessage);
    }
};

export const deleteService = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { serviceId } = req.params;

        const existingService = await getServiceById(serviceId);
        if (!existingService) {
            ApiResponse.notFound(res, 'Service not found');
            return;
        }

        const deletedService = await deleteServiceService(serviceId);
        ApiResponse.success(res, deletedService, 'Service deleted successfully');
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete service';
        logger.error('Delete service error:', errorMessage);

        if (errorMessage.includes('Cannot delete service with active bookings')) {
            ApiResponse.badRequest(res, errorMessage);
        } else {
            ApiResponse.serverError(res, errorMessage);
        }
    }
};