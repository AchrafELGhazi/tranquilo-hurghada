import { Request, Response, NextFunction } from 'express';
import { PaymentMethod } from '@prisma/client'; // Fixed import name
import { ApiResponse } from '../utils/apiResponse';
import { validateBookingDates } from '../utils/booking.utils';

export const validateBookingRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { villaId, checkIn, checkOut, totalGuests, paymentMethod, phone, dateOfBirth } = req.body;

    // Required fields validation
    const requiredFields = ['villaId', 'checkIn', 'checkOut', 'totalGuests', 'paymentMethod', 'phone', 'dateOfBirth'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        ApiResponse.validationError(
            res,
            { missingFields },
            `Missing required fields: ${missingFields.join(', ')}`
        );
        return;
    }

    // Villa ID validation
    if (typeof villaId !== 'string' || villaId.trim().length === 0) {
        ApiResponse.validationError(res, { villaId: 'Villa ID must be a valid string' });
        return;
    }

    // Phone validation
    if (typeof phone !== 'string' || phone.trim().length === 0) {
        ApiResponse.validationError(res, { phone: 'Phone number is required' });
        return;
    }

    // Basic phone format validation (allows international formats)
    const phoneRegex = /^[\+]?[1-9][\d]{8,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        ApiResponse.validationError(res, { phone: 'Phone number format is invalid' });
        return;
    }

    // Date of birth validation
    const dobDate = new Date(dateOfBirth);
    if (isNaN(dobDate.getTime())) {
        ApiResponse.validationError(res, { dateOfBirth: 'Invalid date of birth format' });
        return;
    }

    // Age validation - must be at least 18
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate()) ? age - 1 : age;

    if (finalAge < 18) {
        ApiResponse.validationError(res, { dateOfBirth: 'You must be at least 18 years old to make a booking' });
        return;
    }

    if (finalAge > 120) {
        ApiResponse.validationError(res, { dateOfBirth: 'Invalid date of birth' });
        return;
    }

    // Date validation
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime())) {
        ApiResponse.validationError(res, { checkIn: 'Invalid check-in date format' });
        return;
    }

    if (isNaN(checkOutDate.getTime())) {
        ApiResponse.validationError(res, { checkOut: 'Invalid check-out date format' });
        return;
    }

    // Date logic validation
    const dateValidation = validateBookingDates(checkInDate, checkOutDate);
    if (!dateValidation.isValid) {
        ApiResponse.validationError(res, { dates: dateValidation.error });
        return;
    }

    // Total guests validation
    const guestCount = parseInt(totalGuests);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 50) {
        ApiResponse.validationError(
            res,
            { totalGuests: 'Total guests must be a number between 1 and 50' }
        );
        return;
    }

    // Payment method validation
    if (!Object.values(PaymentMethod).includes(paymentMethod)) {
        ApiResponse.validationError(
            res,
            { paymentMethod: `Payment method must be one of: ${Object.values(PaymentMethod).join(', ')}` }
        );
        return;
    }

    // Notes validation (optional)
    if (req.body.notes && typeof req.body.notes !== 'string') {
        ApiResponse.validationError(res, { notes: 'Notes must be a string' });
        return;
    }

    // Limit notes length
    if (req.body.notes && req.body.notes.length > 500) {
        ApiResponse.validationError(res, { notes: 'Notes cannot exceed 500 characters' });
        return;
    }

    next();
};

export const validatePaginationParams = (req: Request, res: Response, next: NextFunction): void => {
    const { page, limit } = req.query;

    if (page) {
        const pageNum = parseInt(page as string);
        if (isNaN(pageNum) || pageNum < 1) {
            ApiResponse.validationError(res, { page: 'Page must be a positive integer' });
            return;
        }
    }

    if (limit) {
        const limitNum = parseInt(limit as string);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            ApiResponse.validationError(res, { limit: 'Limit must be a positive integer between 1 and 100' });
            return;
        }
    }

    next();
};

export const validateDateParams = (req: Request, res: Response, next: NextFunction): void => {
    const { startDate, endDate } = req.query;

    if (startDate) {
        const start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
            ApiResponse.validationError(res, { startDate: 'Invalid startDate format. Use ISO 8601 format (YYYY-MM-DD)' });
            return;
        }
    }

    if (endDate) {
        const end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
            ApiResponse.validationError(res, { endDate: 'Invalid endDate format. Use ISO 8601 format (YYYY-MM-DD)' });
            return;
        }
    }

    if (startDate && endDate) {
        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (start > end) {
            ApiResponse.validationError(res, { dateRange: 'Start date cannot be after end date' });
            return;
        }
    }

    next();
};

export const validateUUID = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const param = req.params[paramName];

        if (!param) {
            ApiResponse.validationError(res, { [paramName]: `${paramName} is required` });
            return;
        }

        // Simple UUID validation (basic check)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(param)) {
            ApiResponse.validationError(res, { [paramName]: `${paramName} must be a valid UUID` });
            return;
        }

        next();
    };
};

export const validateBookingAction = (req: Request, res: Response, next: NextFunction): void => {
    const { rejectionReason, cancellationReason } = req.body;

    // Validate rejection reason if provided
    if (rejectionReason !== undefined) {
        if (typeof rejectionReason !== 'string') {
            ApiResponse.validationError(res, { rejectionReason: 'Rejection reason must be a string' });
            return;
        }

        if (rejectionReason.length > 500) {
            ApiResponse.validationError(res, { rejectionReason: 'Rejection reason cannot exceed 500 characters' });
            return;
        }
    }

    // Validate cancellation reason if provided
    if (cancellationReason !== undefined) {
        if (typeof cancellationReason !== 'string') {
            ApiResponse.validationError(res, { cancellationReason: 'Cancellation reason must be a string' });
            return;
        }

        if (cancellationReason.length > 500) {
            ApiResponse.validationError(res, { cancellationReason: 'Cancellation reason cannot exceed 500 characters' });
            return;
        }
    }

    next();
};

export const validateBookingFilters = (req: Request, res: Response, next: NextFunction): void => {
    const { status, sortBy, sortOrder } = req.query;

    // Validate status filter
    if (status) {
        const validStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'REJECTED', 'COMPLETED'];
        if (!validStatuses.includes(status as string)) {
            ApiResponse.validationError(
                res,
                { status: `Status must be one of: ${validStatuses.join(', ')}` }
            );
            return;
        }
    }

    // Validate sortBy parameter
    if (sortBy) {
        const validSortFields = ['createdAt', 'checkIn', 'checkOut', 'totalPrice'];
        if (!validSortFields.includes(sortBy as string)) {
            ApiResponse.validationError(
                res,
                { sortBy: `Sort field must be one of: ${validSortFields.join(', ')}` }
            );
            return;
        }
    }

    // Validate sortOrder parameter
    if (sortOrder) {
        const validSortOrders = ['asc', 'desc'];
        if (!validSortOrders.includes(sortOrder as string)) {
            ApiResponse.validationError(
                res,
                { sortOrder: `Sort order must be one of: ${validSortOrders.join(', ')}` }
            );
            return;
        }
    }

    next();
};