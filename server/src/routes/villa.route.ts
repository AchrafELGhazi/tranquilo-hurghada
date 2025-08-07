import { Router } from 'express';
import {
    getAllVillas,
    getVillaDetails,
    getMyVillas
} from '../controllers/villa.controller';
import { authenticate, requireHost } from '../middleware/auth.middleware';
import { validatePaginationParams, validateDateParams } from '../middleware/validation.middleware';

const villaRouter = Router();

/**
 * @route   GET /api/villas
 * @desc    Get all available villas with filters
 * @access  Public
 * @query   ?city=Marrakech&country=Morocco&minPrice=100&maxPrice=500&maxGuests=4&minBedrooms=2&minBathrooms=1&amenities=wifi,pool&checkIn=2024-12-01&checkOut=2024-12-07&page=1&limit=12&sortBy=pricePerNight&sortOrder=asc
 */
villaRouter.get('/', validatePaginationParams, validateDateParams, getAllVillas);

/**
 * @route   GET /api/villas/my
 * @desc    Get current user's villas (hosts/admins only)
 * @access  Private (Hosts, Admins)
 * @query   ?status=AVAILABLE&page=1&limit=10&sortBy=title&sortOrder=asc
 */
villaRouter.get('/my', authenticate, requireHost, validatePaginationParams, getMyVillas);

/**
 * @route   GET /api/villas/:villaId
 * @desc    Get specific villa details
 * @access  Public
 */
villaRouter.get('/:villaId', getVillaDetails);

export default villaRouter;