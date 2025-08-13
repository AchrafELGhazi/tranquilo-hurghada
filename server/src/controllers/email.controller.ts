import { Request, Response } from 'express';
import { sendNewBookingNotification, sendBookingConfirmation, sendBookingRejection, sendBookingCancellation, sendWelcomeEmail, BookingData } from '../services/email.service';
import { ApiResponse } from '../utils/apiResponse';

export const sendWelcomeEmailHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, name } = req.body;
        if (!email || !name) {
            ApiResponse.badRequest(res, 'Email and name are required');
            return;
        }
        await sendWelcomeEmail(email, name);
        ApiResponse.success(res, null, 'Welcome email sent successfully');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send welcome email');
    }
};

export const sendNewBookingNotificationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingData: BookingData = req.body;
        await sendNewBookingNotification(bookingData);
        ApiResponse.success(res, null, 'New booking notification sent successfully');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking notification');
    }
};

export const sendBookingConfirmationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingData: BookingData = req.body;
        await sendBookingConfirmation(bookingData);
        ApiResponse.success(res, null, 'Booking confirmation sent successfully');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking confirmation');
    }
};

export const sendBookingRejectionHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingData: BookingData = req.body;
        await sendBookingRejection(bookingData);
        ApiResponse.success(res, null, 'Booking rejection sent successfully');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking rejection');
    }
};

export const sendBookingCancellationHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const bookingData: BookingData = req.body;
        await sendBookingCancellation(bookingData);
        ApiResponse.success(res, null, 'Booking cancellation sent successfully');
    } catch (error) {
        ApiResponse.serverError(res, error instanceof Error ? error.message : 'Failed to send booking cancellation');
    }
};