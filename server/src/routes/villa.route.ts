import { Router } from 'express';
import {
    getAllVillas,
    getVillaDetails,
    getMyVillas,
    createVillaRequest,
    updateVilla,
    deleteVilla,
    getVillaStatisticsEndpoint,
    getVillaAvailability,
    getVillaServicesEndpoint
} from '../controllers/villa.controller';
import { authenticate, requireHost, requireAdmin } from '../middleware/auth.middleware';
import {
    validatePaginationParams,
    validateDateParams,
    validateVillaUpdate,
    validateVillaCreate,
    validateVillaBookedDatesParams
} from '../middleware/validation.middleware';

const villaRouter = Router();

/**
 * @route   GET /api/villas
 * @desc    Get all available villas with filters and services
 * @access  Public
 * @query   ?city=Hurghada&country=Egypt&minPrice=100&maxPrice=500&maxGuests=4&minBedrooms=2&minBathrooms=1&amenities=wifi,pool&checkIn=2024-12-01&checkOut=2024-12-07&page=1&limit=12&sortBy=pricePerNight&sortOrder=asc
 */
villaRouter.get('/', validatePaginationParams, validateDateParams, getAllVillas);

/**
 * @route   GET /api/villas/my
 * @desc    Get current user's villas with services (hosts/admins only)
 * @access  Private (Hosts, Admins)
 * @query   ?status=AVAILABLE&page=1&limit=10&sortBy=title&sortOrder=asc
 */
villaRouter.get('/my', authenticate, requireHost, validatePaginationParams, getMyVillas);

/**
 * @route   POST /api/villas
 * @desc    Create a new villa
 * @access  Private (Hosts, Admins)
 */
villaRouter.post('/', authenticate, requireHost, validateVillaCreate, createVillaRequest);

/**
 * @route   GET /api/villas/:villaId
 * @desc    Get specific villa details with services and availability
 * @access  Public
 */
villaRouter.get('/:villaId', getVillaDetails);

/**
 * @route   GET /api/villas/:villaId/availability
 * @desc    Get villa availability calendar
 * @access  Public
 * @query   ?year=2025&month=6
 */
villaRouter.get('/:villaId/availability', getVillaAvailability);

/**
 * @route   GET /api/villas/:villaId/services
 * @desc    Get all services available for a villa
 * @access  Public
 */
villaRouter.get('/:villaId/services', getVillaServicesEndpoint);

/**
 * @route   GET /api/villas/:villaId/statistics
 * @desc    Get villa statistics and analytics
 * @access  Private (Villa Owner, Admins)
 */
villaRouter.get('/:villaId/statistics', authenticate, getVillaStatisticsEndpoint);

/**
 * @route   PUT /api/villas/:villaId
 * @desc    Update villa details
 * @access  Private (Villa Owner, Admins)
 */
villaRouter.put('/:villaId', authenticate, validateVillaUpdate, updateVilla);

/**
 * @route   DELETE /api/villas/:villaId
 * @desc    Delete villa (soft delete - set isActive to false)
 * @access  Private (Admins only)
 */
villaRouter.delete('/:villaId', authenticate, requireAdmin, deleteVilla);

export default villaRouter;