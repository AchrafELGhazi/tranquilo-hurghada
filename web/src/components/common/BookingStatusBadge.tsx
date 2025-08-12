import React from 'react';
import { Clock, Check, Star, X, AlertCircle } from 'lucide-react';
import { bookingApi } from '@/api/bookingApi';
import type { Booking } from '@/utils/types';

interface BookingStatusBadgeProps {
    status: Booking['status'];
    className?: string;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status, className = '' }) => {
    const statusConfig = {
        PENDING: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
        CONFIRMED: { color: 'bg-green-100 text-green-800 border-green-200', icon: Check },
        COMPLETED: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Star },
        CANCELLED: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: X },
        REJECTED: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color} ${className}`}
        >
            <Icon className='w-3 h-3 mr-1' />
            {bookingApi.getStatusText(status)}
        </span>
    );
};
