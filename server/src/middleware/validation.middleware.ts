import { Request, Response, NextFunction } from 'express';
import { PaymentMethod } from '@prisma/client';
import { ApiResponse } from '../utils/apiResponse';
import { validateBookingDates } from '../utils/booking.utils';

export const validateBookingRequest = (req: Request, res: Response, next: NextFunction): void => {
    const { villaId, checkIn, checkOut, totalGuests, paymentMethod, phone, dateOfBirth, selectedServices } = req.body;

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

    // Validate selected services if provided
    if (selectedServices !== undefined) {
        if (!Array.isArray(selectedServices)) {
            ApiResponse.validationError(res, { selectedServices: 'Selected services must be an array' });
            return;
        }

        for (let i = 0; i < selectedServices.length; i++) {
            const service = selectedServices[i];

            if (!service.serviceId || typeof service.serviceId !== 'string') {
                ApiResponse.validationError(res, { selectedServices: `Service ID is required for service at index ${i}` });
                return;
            }

            if (service.quantity !== undefined) {
                if (typeof service.quantity !== 'number' || service.quantity < 1 || service.quantity > 50) {
                    ApiResponse.validationError(res, { selectedServices: `Service quantity must be between 1 and 50 for service at index ${i}` });
                    return;
                }
            }

            if (service.numberOfGuests !== undefined) {
                if (typeof service.numberOfGuests !== 'number' || service.numberOfGuests < 1 || service.numberOfGuests > guestCount) {
                    ApiResponse.validationError(res, { selectedServices: `Number of guests for service must be between 1 and total booking guests for service at index ${i}` });
                    return;
                }
            }

            if (service.scheduledDate !== undefined) {
                const scheduledDate = new Date(service.scheduledDate);
                if (isNaN(scheduledDate.getTime())) {
                    ApiResponse.validationError(res, { selectedServices: `Invalid scheduled date format for service at index ${i}` });
                    return;
                }

                // Service should be scheduled within the booking period
                if (scheduledDate < checkInDate || scheduledDate >= checkOutDate) {
                    ApiResponse.validationError(res, { selectedServices: `Service scheduled date must be within the booking period for service at index ${i}` });
                    return;
                }
            }

            if (service.scheduledTime !== undefined) {
                if (typeof service.scheduledTime !== 'string') {
                    ApiResponse.validationError(res, { selectedServices: `Scheduled time must be a string for service at index ${i}` });
                    return;
                }

                // Basic time format validation (HH:MM)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
                if (!timeRegex.test(service.scheduledTime)) {
                    ApiResponse.validationError(res, { selectedServices: `Invalid time format (use HH:MM) for service at index ${i}` });
                    return;
                }
            }

            if (service.specialRequests !== undefined) {
                if (typeof service.specialRequests !== 'string') {
                    ApiResponse.validationError(res, { selectedServices: `Special requests must be a string for service at index ${i}` });
                    return;
                }

                if (service.specialRequests.length > 500) {
                    ApiResponse.validationError(res, { selectedServices: `Special requests cannot exceed 500 characters for service at index ${i}` });
                    return;
                }
            }
        }
    }

    next();
};

export const validateBookingServicesUpdate = (req: Request, res: Response, next: NextFunction): void => {
    const { selectedServices } = req.body;

    if (!selectedServices) {
        ApiResponse.validationError(res, { selectedServices: 'Selected services is required' });
        return;
    }

    if (!Array.isArray(selectedServices)) {
        ApiResponse.validationError(res, { selectedServices: 'Selected services must be an array' });
        return;
    }

    for (let i = 0; i < selectedServices.length; i++) {
        const service = selectedServices[i];

        if (!service.serviceId || typeof service.serviceId !== 'string') {
            ApiResponse.validationError(res, { selectedServices: `Service ID is required for service at index ${i}` });
            return;
        }

        if (service.quantity !== undefined) {
            if (typeof service.quantity !== 'number' || service.quantity < 1 || service.quantity > 50) {
                ApiResponse.validationError(res, { selectedServices: `Service quantity must be between 1 and 50 for service at index ${i}` });
                return;
            }
        }

        if (service.numberOfGuests !== undefined) {
            if (typeof service.numberOfGuests !== 'number' || service.numberOfGuests < 1) {
                ApiResponse.validationError(res, { selectedServices: `Number of guests for service must be at least 1 for service at index ${i}` });
                return;
            }
        }

        if (service.scheduledDate !== undefined) {
            const scheduledDate = new Date(service.scheduledDate);
            if (isNaN(scheduledDate.getTime())) {
                ApiResponse.validationError(res, { selectedServices: `Invalid scheduled date format for service at index ${i}` });
                return;
            }
        }

        if (service.scheduledTime !== undefined) {
            if (typeof service.scheduledTime !== 'string') {
                ApiResponse.validationError(res, { selectedServices: `Scheduled time must be a string for service at index ${i}` });
                return;
            }

            // Basic time format validation (HH:MM)
            const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(service.scheduledTime)) {
                ApiResponse.validationError(res, { selectedServices: `Invalid time format (use HH:MM) for service at index ${i}` });
                return;
            }
        }

        if (service.specialRequests !== undefined) {
            if (typeof service.specialRequests !== 'string') {
                ApiResponse.validationError(res, { selectedServices: `Special requests must be a string for service at index ${i}` });
                return;
            }

            if (service.specialRequests.length > 500) {
                ApiResponse.validationError(res, { selectedServices: `Special requests cannot exceed 500 characters for service at index ${i}` });
                return;
            }
        }
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

    // Validate sortBy parameter - Updated to include new fields
    if (sortBy) {
        const validSortFields = ['createdAt', 'checkIn', 'checkOut', 'totalPrice', 'grandTotal', 'servicesTotal'];
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

export const validateVillaBookedDatesParams = (req: Request, res: Response, next: NextFunction): void => {
    const { villaId } = req.params;
    const { year, month } = req.query;

    // Villa ID validation
    if (!villaId) {
        ApiResponse.validationError(res, { villaId: 'Villa ID is required' });
        return;
    }

    // Year validation (optional)
    if (year) {
        const yearNum = parseInt(year as string);
        if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
            ApiResponse.validationError(res, { year: 'Year must be between 2020 and 2030' });
            return;
        }
    }

    // Month validation (optional)
    if (month) {
        const monthNum = parseInt(month as string);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            ApiResponse.validationError(res, { month: 'Month must be between 1 and 12' });
            return;
        }

        // If month is provided, year should also be provided
        if (!year) {
            ApiResponse.validationError(res, { year: 'Year is required when month is specified' });
            return;
        }
    }

    next();
};

export const validateVillaCreate = (req: Request, res: Response, next: Function) => {
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

    // Required fields validation
    const requiredFields = ['title', 'address', 'city', 'country', 'pricePerNight', 'maxGuests', 'bedrooms', 'bathrooms'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    // Validate title length
    if (title.length < 3 || title.length > 200) {
        return res.status(400).json({
            success: false,
            message: 'Villa title must be between 3 and 200 characters'
        });
    }

    // Validate description length
    if (description && description.length > 2000) {
        return res.status(400).json({
            success: false,
            message: 'Description cannot exceed 2000 characters'
        });
    }

    // Validate address length
    if (address.length < 5 || address.length > 300) {
        return res.status(400).json({
            success: false,
            message: 'Address must be between 5 and 300 characters'
        });
    }

    // Validate price
    if (isNaN(pricePerNight) || pricePerNight <= 0 || pricePerNight > 10000) {
        return res.status(400).json({
            success: false,
            message: 'Price per night must be between 1 and 10000'
        });
    }

    // Validate capacity
    if (isNaN(maxGuests) || maxGuests <= 0 || maxGuests > 50) {
        return res.status(400).json({
            success: false,
            message: 'Max guests must be between 1 and 50'
        });
    }

    if (isNaN(bedrooms) || bedrooms <= 0 || bedrooms > 20) {
        return res.status(400).json({
            success: false,
            message: 'Bedrooms must be between 1 and 20'
        });
    }

    if (isNaN(bathrooms) || bathrooms <= 0 || bathrooms > 20) {
        return res.status(400).json({
            success: false,
            message: 'Bathrooms must be between 1 and 20'
        });
    }

    // Validate amenities array
    if (amenities && !Array.isArray(amenities)) {
        return res.status(400).json({
            success: false,
            message: 'Amenities must be an array'
        });
    }

    if (amenities && amenities.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'Cannot have more than 50 amenities'
        });
    }

    // Validate images array
    if (images && !Array.isArray(images)) {
        return res.status(400).json({
            success: false,
            message: 'Images must be an array of URLs'
        });
    }

    if (images && images.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'Cannot have more than 20 images'
        });
    }

    next();
};

export const validateVillaUpdate = (req: Request, res: Response, next: Function) => {
    const {
        title,
        pricePerNight,
        maxGuests,
        bedrooms,
        bathrooms,
        amenities,
        images
    } = req.body;

    // Validate title length
    if (title && (title.length < 3 || title.length > 200)) {
        return res.status(400).json({
            success: false,
            message: 'Villa title must be between 3 and 200 characters'
        });
    }

    // Validate price
    if (pricePerNight && (isNaN(pricePerNight) || pricePerNight <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'Price per night must be a positive number'
        });
    }

    // Validate capacity
    if (maxGuests && (isNaN(maxGuests) || maxGuests <= 0 || maxGuests > 50)) {
        return res.status(400).json({
            success: false,
            message: 'Max guests must be between 1 and 50'
        });
    }

    if (bedrooms && (isNaN(bedrooms) || bedrooms <= 0 || bedrooms > 20)) {
        return res.status(400).json({
            success: false,
            message: 'Bedrooms must be between 1 and 20'
        });
    }

    if (bathrooms && (isNaN(bathrooms) || bathrooms <= 0 || bathrooms > 20)) {
        return res.status(400).json({
            success: false,
            message: 'Bathrooms must be between 1 and 20'
        });
    }

    // Validate amenities array
    if (amenities && !Array.isArray(amenities)) {
        return res.status(400).json({
            success: false,
            message: 'Amenities must be an array'
        });
    }

    // Validate images array
    if (images && !Array.isArray(images)) {
        return res.status(400).json({
            success: false,
            message: 'Images must be an array of URLs'
        });
    }

    next();
};