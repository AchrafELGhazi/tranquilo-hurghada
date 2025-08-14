import React from 'react';
import { Eye, X, Users, Baby, Home } from 'lucide-react';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import { canCancelBooking, formatPrice } from '@/utils/bookingUtils';
import type { Booking, UserRole } from '@/utils/types';

interface BookingTableProps {
    bookings: Booking[];
    currentUserId: string;
    userRole: UserRole;
    cancelling: string | null;
    onViewDetails: (booking: Booking) => void;
    onCancelBooking: (booking: Booking) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
    bookings,
    currentUserId,
    userRole,
    cancelling,
    onViewDetails,
    onCancelBooking,
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className='hidden lg:block overflow-x-auto'>
            <table className='w-full'>
                <thead className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-b-2 border-[#F8B259]/50'>
                    <tr>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Villa
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Check-in
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Check-out
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Guests
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Total
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Status
                        </th>
                        <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-[#F8B259]/30'>
                    {bookings.map(booking => (
                        <tr key={booking.id} className='hover:bg-white/20 transition-colors duration-200'>
                            <td className='px-6 py-4'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-12 h-12 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-lg flex items-center justify-center'>
                                        <Home className='w-5 h-5 text-[#D96F32]' />
                                    </div>
                                    <div>
                                        <p className='font-semibold text-[#C75D2C]'>
                                            {booking.villa?.title || 'Villa'}
                                        </p>
                                        <p className='text-xs text-[#C75D2C]/60'>#{booking.id.slice(-8)}</p>
                                    </div>
                                </div>
                            </td>
                            <td className='px-6 py-4'>
                                <p className='text-[#C75D2C] font-medium'>{formatDate(booking.checkIn)}</p>
                                <p className='text-xs text-[#C75D2C]/60'>
                                    {new Date(booking.checkIn).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                    })}
                                </p>
                            </td>
                            <td className='px-6 py-4'>
                                <p className='text-[#C75D2C] font-medium'>{formatDate(booking.checkOut)}</p>
                                <p className='text-xs text-[#C75D2C]/60'>
                                    {new Date(booking.checkOut).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                    })}
                                </p>
                            </td>
                            <td className='px-6 py-4'>
                                <div className='flex items-center space-x-3'>
                                    <div className='flex items-center space-x-1'>
                                        <Users className='w-4 h-4 text-[#D96F32]' />
                                        <span className='font-medium text-[#C75D2C]'>{booking.totalAdults}</span>
                                    </div>
                                    {booking.totalChildren > 0 && (
                                        <div className='flex items-center space-x-1'>
                                            <Baby className='w-4 h-4 text-[#D96F32]' />
                                            <span className='font-medium text-[#C75D2C]'>{booking.totalChildren}</span>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className='px-6 py-4'>
                                <p className='font-bold text-[#C75D2C]'>{formatPrice(booking.totalPrice, 'EUR')}</p>
                                <p className='text-xs text-[#C75D2C]/60'>
                                    {booking.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'On Arrival'}
                                </p>
                            </td>
                            <td className='px-6 py-4'>
                                <BookingStatusBadge status={booking.status} />
                            </td>
                            <td className='px-6 py-4'>
                                <div className='flex items-center space-x-2'>
                                    <button
                                        onClick={() => onViewDetails(booking)}
                                        className='p-2 bg-[#D96F32]/20 cursor-pointer text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                                        title='View Details'
                                    >
                                        <Eye className='w-4 h-4' />
                                    </button>
                                    {canCancelBooking(booking, currentUserId, userRole) && (
                                        <button
                                            onClick={() => onCancelBooking(booking)}
                                            disabled={cancelling === booking.id}
                                            className='p-2 bg-red-100 cursor-pointer text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50'
                                            title='Cancel Booking'
                                        >
                                            <X className='w-4 h-4' />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
