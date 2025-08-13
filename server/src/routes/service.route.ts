import { Router } from 'express';
import { getAllServices, getServiceDetails, createServiceRequest, updateService, deleteService } from '../controllers/service.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validateRequest.middleware';
import { createServiceSchema, updateServiceSchema, serviceQuerySchema, serviceParamsSchema } from '../schemas/service.schema';

const serviceRouter = Router();

/**
 * @route   GET /api/services
 * @desc    Get all services with filters
 * @access  Public
 * @query   ?category=ADVENTURE&difficulty=EASY&minPrice=50&maxPrice=200&isActive=true&isFeatured=true&page=1&limit=10&sortBy=title&sortOrder=asc
 */
serviceRouter.get('/',
    validateRequest(serviceQuerySchema),
    getAllServices
);

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Private (Admins only)
 */
serviceRouter.post('/',
    authenticate,
    requireAdmin,
    validateRequest(createServiceSchema),
    createServiceRequest
);

/**
 * @route   GET /api/services/:serviceId
 * @desc    Get specific service details
 * @access  Public
 */
serviceRouter.get('/:serviceId',
    validateRequest(serviceParamsSchema),
    getServiceDetails
);

/**
 * @route   PUT /api/services/:serviceId
 * @desc    Update service details
 * @access  Private (Admins only)
 */
serviceRouter.put('/:serviceId',
    authenticate,
    requireAdmin,
    validateRequest(updateServiceSchema),
    updateService
);

/**
 * @route   DELETE /api/services/:serviceId
 * @desc    Delete service (soft delete - set isActive to false)
 * @access  Private (Admins only)
 */
serviceRouter.delete('/:serviceId',
    authenticate,
    requireAdmin,
    validateRequest(serviceParamsSchema),
    deleteService
);

export default serviceRouter;