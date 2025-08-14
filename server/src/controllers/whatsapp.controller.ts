// whatsapp.controller.ts
import { Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { sendBookingNotificationMessage } from '../services/whatsapp.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { validatePhoneNumber } from '../utils/whatsapp.utils';

export const sendBookingNotification = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            phoneNumber,
            guestName,
            checkInDate,
            checkOutDate,
            bookingRef,
            villaTitle
        } = req.body;

        // Validate required fields
        if (!phoneNumber || !guestName || !checkInDate || !checkOutDate || !bookingRef) {
            return ApiResponse.badRequest(
                res,
                'Missing required fields: phoneNumber, guestName, checkInDate, checkOutDate, bookingRef'
            );
        }

        // Validate phone number format
        if (!validatePhoneNumber(phoneNumber)) {
            return ApiResponse.badRequest(res, 'Invalid phone number format. Use international format (+1234567890)');
        }

        // Validate dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            return ApiResponse.badRequest(res, 'Invalid date format. Use YYYY-MM-DD');
        }

        if (checkOut <= checkIn) {
            return ApiResponse.badRequest(res, 'Check-out date must be after check-in date');
        }

        // Send WhatsApp notification
        const result = await sendBookingNotificationMessage({
            phoneNumber,
            guestName: guestName.trim(),
            checkInDate,
            checkOutDate,
            bookingRef: bookingRef.trim(),
            villaTitle: villaTitle?.trim() || 'Tranquilo Hurghada villa'
        });

        if (result.success) {
            return ApiResponse.success(
                res,
                result.data,
                'WhatsApp booking notification sent successfully'
            );
        } else {
            return ApiResponse.serverError(
                res,
                result.error || 'Failed to send WhatsApp notification'
            );
        }

    } catch (error: any) {
        console.error('Error in sendBookingNotification:', error);
        return ApiResponse.serverError(
            res,
            'An error occurred while sending WhatsApp notification'
        );
    }
};