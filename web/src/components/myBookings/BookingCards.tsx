import React from 'react';
import { Eye, X, Users, Baby } from 'lucide-react';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import { canCancelBooking, formatPrice } from '@/utils/bookingUtils';
import type { Booking, UserRole } from '@/utils/types';

interface BookingCardsProps {
    bookings: Booking[];
    currentUserId: string;
    userRole: UserRole;
    cancelling: string | null;
    onViewDetails: (booking: Booking) => void;
    onCancelBooking: (booking: Booking) => void;
}

export const BookingCards: React.FC<BookingCardsProps> = ({
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
        <div className='lg:hidden space-y-4 p-4'>
            {bookings.map(booking => (
                <div key={booking.id} className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 space-y-4'>
                    <div className='flex justify-between items-start'>
                        <div>
                            <h3 className='font-semibold text-[#C75D2C]'>{booking.villa?.title || 'Villa'}</h3>
                            <p className='text-xs text-[#C75D2C]/60'>#{booking.id.slice(-8)}</p>
                        </div>
                        <BookingStatusBadge status={booking.status} />
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                            <p className='text-[#C75D2C]/60'>Check-in</p>
                            <p className='font-medium text-[#C75D2C]'>{formatDate(booking.checkIn)}</p>
                        </div>
                        <div>
                            <p className='text-[#C75D2C]/60'>Check-out</p>
                            <p className='font-medium text-[#C75D2C]'>{formatDate(booking.checkOut)}</p>
                        </div>
                        <div>
                            <p className='text-[#C75D2C]/60'>Guests</p>
                            <div className='flex items-center space-x-2'>
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
                        </div>
                        <div>
                            <p className='text-[#C75D2C]/60'>Total</p>
                            <p className='font-bold text-[#C75D2C]'>{formatPrice(booking.totalPrice, 'EUR')}</p>
                        </div>
                    </div>

                    <div className='flex justify-between items-center pt-2 border-t border-[#F8B259]/30'>
                        <p className='text-xs text-[#C75D2C]/60'>
                            {booking.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Payment on Arrival'}
                        </p>
                        <div className='flex items-center space-x-2'>
                            <button
                                onClick={() => onViewDetails(booking)}
                                className='p-2 bg-[#D96F32]/20 cursor-pointer text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                            >
                                <Eye className='w-4 h-4' />
                            </button>
                            {canCancelBooking(booking, currentUserId, userRole) && (
                                <button
                                    onClick={() => onCancelBooking(booking)}
                                    disabled={cancelling === booking.id}
                                    className='p-2 bg-red-100 text-red-600 cursor-pointer rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50'
                                >
                                    <X className='w-4 h-4' />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
