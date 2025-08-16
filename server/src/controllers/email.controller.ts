import { Request, Response } from 'express';
import { sendNewBookingNotification, sendBookingConfirmation, sendBookingRejection, sendBookingCancellation, sendWelcomeEmail, BookingData } from '../services/email.service';
import { ApiResponse } from '../utils/apiResponse';
import { validateBookingDates } from '../utils/booking.utils';
import toDate from '../utils/toDate';
import { checkSenderVerification } from '../utils/email.utils';

// Helper function to convert date strings to Date objects using existing utility
const convertDatesToDateObjects = (bookingData: any): BookingData => {
    return {
        ...bookingData,
        checkIn: toDate(bookingData.checkIn),
        checkOut: toDate(bookingData.checkOut),
    };
};

// Helper function to validate required booking fields
const validateBookingData = (bookingData: any): { isValid: boolean; error?: string } => {
    // Check for required fields with proper handling of 0 values
    const requiredFieldChecks = [
        { field: 'id', value: bookingData.id },
        { field: 'checkIn', value: bookingData.checkIn },
        { field: 'checkOut', value: bookingData.checkOut },
        { field: 'totalAdults', value: bookingData.totalAdults },
        { field: 'totalChildren', value: bookingData.totalChildren }, // 0 is valid
        { field: 'totalPrice', value: bookingData.totalPrice }, // 0 is valid
        { field: 'status', value: bookingData.status },
        { field: 'paymentMethod', value: bookingData.paymentMethod },
        { field: 'villa', value: bookingData.villa },
        { field: 'guest', value: bookingData.guest },
    ];

    for (const check of requiredFieldChecks) {
        // Use !== undefined and !== null to allow 0 values
        if (check.value === undefined || check.value === null || check.value === '') {
            return { isValid: false, error: `Missing required field: ${check.field}` };
        }

        // For numeric fields, ensure they are valid numbers
        if (['totalAdults', 'totalChildren', 'totalPrice'].includes(check.field)) {
            const numValue = Number(check.value);
            if (isNaN(numValue)) {
                return { isValid: false, error: `Invalid numeric value for field: ${check.field}` };
            }
        }
    }

    // Validate villa object
    if (!bookingData.villa || typeof bookingData.villa !== 'object') {
        return { isValid: false, error: 'Villa information is required' };
    }

    if (!bookingData.villa.id || !bookingData.villa.title || !bookingData.villa.address) {
        return { isValid: false, error: 'Missing required villa information (id, title, or address)' };
    }

    // Validate guest object
    if (!bookingData.guest || typeof bookingData.guest !== 'object') {
        return { isValid: false, error: 'Guest information is required' };
    }

    if (!bookingData.guest.id || !bookingData.guest.fullName || !bookingData.guest.email) {
        return { isValid: false, error: 'Missing required guest information (id, fullName, or email)' };
    }

    // Use existing booking date validation utility
    const dateValidation = validateBookingDates(bookingData.checkIn, bookingData.checkOut);
    if (!dateValidation.isValid) {
        return { isValid: false, error: dateValidation.error };
    }

    return { isValid: true };
};

export const sendWelcomeEmailHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            ApiResponse.badRequest(res, 'Email and name are required');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            ApiResponse.badRequest(res, 'Invalid email format');
            return;
        }

        await sendWelcomeEmail(email, name);
        ApiResponse.success(res, null, 'Welcome email sent successfully');
    } catch (error) {
        console.error('Welcome email error:', error);
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send welcome email');
    }
};

export const sendNewBookingNotificationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawBookingData = req.body;

        // Validate booking data
        const validation = validateBookingData(rawBookingData);
        if (!validation.isValid) {
            ApiResponse.badRequest(res, validation.error || 'Invalid booking data');
            return;
        }

        // Convert dates to Date objects
        const bookingData: BookingData = convertDatesToDateObjects(rawBookingData);

        await sendNewBookingNotification(bookingData);
        ApiResponse.success(res, null, 'New booking notification sent successfully');
    } catch (error) {
        console.error('Booking notification error:', error);
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking notification');
    }
};

export const sendBookingConfirmationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawBookingData = req.body;

        // Validate booking data
        const validation = validateBookingData(rawBookingData);
        if (!validation.isValid) {
            ApiResponse.badRequest(res, validation.error || 'Invalid booking data');
            return;
        }

        // Convert dates to Date objects
        const bookingData: BookingData = convertDatesToDateObjects(rawBookingData);

        await sendBookingConfirmation(bookingData);
        ApiResponse.success(res, null, 'Booking confirmation sent successfully');
    } catch (error) {
        console.error('Booking confirmation error:', error);
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking confirmation');
    }
};

export const sendBookingRejectionHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawBookingData = req.body;

        // Validate booking data
        const validation = validateBookingData(rawBookingData);
        if (!validation.isValid) {
            ApiResponse.badRequest(res, validation.error || 'Invalid booking data');
            return;
        }

        // Convert dates to Date objects
        const bookingData: BookingData = convertDatesToDateObjects(rawBookingData);

        await sendBookingRejection(bookingData);
        ApiResponse.success(res, null, 'Booking rejection sent successfully');
    } catch (error) {
        console.error('Booking rejection error:', error);
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking rejection');
    }
};

export const sendBookingCancellationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const rawBookingData = req.body;

        // Validate booking data
        const validation = validateBookingData(rawBookingData);
        if (!validation.isValid) {
            ApiResponse.badRequest(res, validation.error || 'Invalid booking data');
            return;
        }

        // Convert dates to Date objects
        const bookingData: BookingData = convertDatesToDateObjects(rawBookingData);

        await sendBookingCancellation(bookingData);
        ApiResponse.success(res, null, 'Booking cancellation sent successfully');
    } catch (error) {
        console.error('Booking cancellation error:', error);
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking cancellation');
    }
};
export const debugEmailHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        await checkSenderVerification();
        ApiResponse.success(res, null, 'Check your logs for sender verification status');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Debug failed');
    }
};