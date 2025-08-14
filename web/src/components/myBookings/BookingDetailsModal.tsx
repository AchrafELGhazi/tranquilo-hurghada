import React from 'react';
import { X, Calendar, Users, CreditCard, User, Mail, Phone, Home, Baby, MapPin } from 'lucide-react';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import { canCancelBooking, formatPrice, getStayDuration } from '@/utils/bookingUtils';
import type { Booking, UserRole } from '@/utils/types';

interface BookingDetailsModalProps {
    booking: Booking | null;
    currentUserId: string;
    userRole: UserRole;
    onClose: () => void;
    onCancelBooking: () => void;
}

interface SectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, icon, children }) => (
    <div className='space-y-3'>
        <h5 className='font-semibold text-[#C75D2C] flex items-center text-base'>
            {icon}
            <span className='ml-2'>{title}</span>
        </h5>
        {children}
    </div>
);

interface InfoRowProps {
    label: string;
    value: string | number | React.ReactNode;
    className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, className = '' }) => (
    <div className={`flex justify-between items-center ${className}`}>
        <span className='text-[#C75D2C]/60 text-sm'>{label}</span>
        <span className='font-medium text-[#C75D2C]'>{value}</span>
    </div>
);

interface InfoGridItemProps {
    label: string;
    value: string | number;
}

const InfoGridItem: React.FC<InfoGridItemProps> = ({ label, value }) => (
    <div>
        <label className='text-sm text-[#C75D2C]/60 block mb-1'>{label}</label>
        <p className='font-medium text-[#C75D2C]'>{value}</p>
    </div>
);

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
    booking,
    currentUserId,
    userRole,
    onClose,
    onCancelBooking,
}) => {
    if (!booking) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatDateWithDay = (dateString: string) => {
        const date = new Date(dateString);
        return {
            formatted: formatDate(dateString),
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        };
    };

    const checkInDate = formatDateWithDay(booking.checkIn);
    const checkOutDate = formatDateWithDay(booking.checkOut);

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
            <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl'>
                {/* Modal Header */}
                <div className='sticky top-0 bg-white/95 backdrop-blur-md flex items-center justify-between p-6 border-b border-[#F8B259]/30'>
                    <div>
                        <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Booking Details</h3>
                        <p className='text-sm text-[#C75D2C]/60'>#{booking.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className='p-2 hover:bg-[#F8B259]/20 rounded-xl cursor-pointer transition-colors'
                        aria-label='Close modal'
                    >
                        <X className='w-5 h-5 text-[#C75D2C]' />
                    </button>
                </div>

                {/* Modal Content */}
                <div className='p-6 space-y-6'>
                    {/* Booking Overview */}
                    <div className='bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10 rounded-xl p-5 border border-[#F8B259]/20'>
                        <div className='flex justify-between items-start gap-4'>
                            <div className='flex-1'>
                                <h4 className='text-lg font-bold text-[#C75D2C] mb-1'>
                                    {booking.villa?.title || 'Villa Booking'}
                                </h4>
                                <div className='flex items-center text-sm text-[#C75D2C]/60'>
                                    <Calendar className='w-4 h-4 mr-1' />
                                    <span>Booked: {formatDate(booking.createdAt)}</span>
                                </div>
                            </div>
                            <div className='text-right'>
                                <BookingStatusBadge status={booking.status} />
                            </div>
                        </div>
                    </div>

                    {/* Stay Details */}
                    <Section title='Stay Details' icon={<Calendar className='w-4 h-4 text-[#D96F32]' />}>
                        <div className='bg-white/30 rounded-lg p-4 border border-[#F8B259]/20'>
                            <div className='grid grid-cols-2 gap-4 mb-4'>
                                <InfoGridItem
                                    label='Check-in'
                                    value={`${checkInDate.formatted} (${checkInDate.day})`}
                                />
                                <InfoGridItem
                                    label='Check-out'
                                    value={`${checkOutDate.formatted} (${checkOutDate.day})`}
                                />
                                <InfoGridItem
                                    label='Duration'
                                    value={`${getStayDuration(booking.checkIn, booking.checkOut)} nights`}
                                />
                                <InfoGridItem
                                    label='Total Guests'
                                    value={`${booking.totalAdults + booking.totalChildren} guests`}
                                />
                            </div>
                            <div className='pt-3 border-t border-[#F8B259]/30'>
                                <div className='flex items-center justify-center space-x-6'>
                                    <div className='flex items-center space-x-2 text-[#C75D2C]'>
                                        <Users className='w-4 h-4 text-[#D96F32]' />
                                        <span className='font-medium'>{booking.totalAdults} Adults</span>
                                    </div>
                                    {booking.totalChildren > 0 && (
                                        <div className='flex items-center space-x-2 text-[#C75D2C]'>
                                            <Baby className='w-4 h-4 text-[#D96F32]' />
                                            <span className='font-medium'>{booking.totalChildren} Children</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Guest Information */}
                    {booking.guest && (
                        <Section title='Guest Information' icon={<User className='w-4 h-4 text-[#D96F32]' />}>
                            <div className='bg-white/30 rounded-lg p-4 border border-[#F8B259]/20 space-y-3'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-[#D96F32]/20 rounded-full flex items-center justify-center'>
                                        <User className='w-4 h-4 text-[#D96F32]' />
                                    </div>
                                    <span className='font-medium text-[#C75D2C]'>{booking.guest.fullName}</span>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-[#D96F32]/20 rounded-full flex items-center justify-center'>
                                        <Mail className='w-4 h-4 text-[#D96F32]' />
                                    </div>
                                    <span className='font-medium text-[#C75D2C]'>{booking.guest.email}</span>
                                </div>
                                {booking.guest.phone && (
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-8 h-8 bg-[#D96F32]/20 rounded-full flex items-center justify-center'>
                                            <Phone className='w-4 h-4 text-[#D96F32]' />
                                        </div>
                                        <span className='font-medium text-[#C75D2C]'>{booking.guest.phone}</span>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {/* Payment Information */}
                    <Section title='Payment Information' icon={<CreditCard className='w-4 h-4 text-[#D96F32]' />}>
                        <div className='bg-white/30 rounded-lg p-4 border border-[#F8B259]/20 space-y-3'>
                            <InfoRow
                                label='Total Amount'
                                value={formatPrice(booking.totalPrice, 'EUR')}
                                className='pb-3 border-b border-[#F8B259]/30'
                            />
                            <InfoRow
                                label='Payment Method'
                                value={
                                    booking.paymentMethod === 'BANK_TRANSFER' ? 'Bank Transfer' : 'Payment on Arrival'
                                }
                            />
                            <InfoRow
                                label='Payment Status'
                                value={
                                    <span
                                        className={`font-medium ${
                                            booking.isPaid ? 'text-green-600' : 'text-orange-600'
                                        }`}
                                    >
                                        {booking.isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                }
                            />
                        </div>
                    </Section>

                    {/* Villa Information */}
                    {booking.villa && (
                        <Section title='Villa Information' icon={<Home className='w-4 h-4 text-[#D96F32]' />}>
                            <div className='bg-white/30 rounded-lg p-4 border border-[#F8B259]/20 space-y-3'>
                                <InfoRow label='Villa Name' value={booking.villa.title} />
                                <InfoRow label='Location' value={`${booking.villa.city}, ${booking.villa.country}`} />
                                {booking.villa.address && (
                                    <div className='pt-2 border-t border-[#F8B259]/30'>
                                        <div className='flex items-start space-x-2'>
                                            <MapPin className='w-4 h-4 text-[#D96F32] mt-1' />
                                            <div>
                                                <p className='text-sm text-[#C75D2C]/60 mb-1'>Address</p>
                                                <p className='font-medium text-[#C75D2C]'>{booking.villa.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {/* Additional Services */}
                    {booking.bookingServices && booking.bookingServices.length > 0 && (
                        <Section title='Additional Services' icon={<CreditCard className='w-4 h-4 text-[#D96F32]' />}>
                            <div className='space-y-2'>
                                {booking.bookingServices.map(service => (
                                    <div
                                        key={service.id}
                                        className='bg-white/30 rounded-lg p-3 border border-[#F8B259]/20 flex justify-between items-center'
                                    >
                                        <div>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {service.service?.title || 'Service'}
                                            </p>
                                            <p className='text-sm text-[#C75D2C]/60'>
                                                Qty: {service.quantity} × {formatPrice(service.unitPrice, 'EUR')}
                                            </p>
                                        </div>
                                        <span className='font-bold text-[#C75D2C]'>
                                            {formatPrice(service.totalPrice, 'EUR')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* Special Notes */}
                    {booking.notes && (
                        <Section title='Special Requests' icon={<Mail className='w-4 h-4 text-[#D96F32]' />}>
                            <div className='bg-white/30 rounded-lg p-4 border border-[#F8B259]/20'>
                                <p className='text-[#C75D2C] italic'>"{booking.notes}"</p>
                            </div>
                        </Section>
                    )}

                    {/* Cancellation/Rejection Reason */}
                    {(booking.cancellationReason || booking.rejectionReason) && (
                        <Section
                            title={booking.cancellationReason ? 'Cancellation Reason' : 'Rejection Reason'}
                            icon={<X className='w-4 h-4 text-red-600' />}
                        >
                            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                <p className='text-red-700 italic'>
                                    "{booking.cancellationReason || booking.rejectionReason}"
                                </p>
                            </div>
                        </Section>
                    )}
                </div>

                {/* Modal Actions */}
                <div className='sticky bottom-0 bg-white/95 backdrop-blur-md flex justify-between items-center p-6 border-t border-[#F8B259]/30'>
                    <button
                        onClick={onClose}
                        className='px-6 py-2 text-[#C75D2C] hover:bg-[#F8B259]/20 rounded-lg transition-colors font-medium'
                    >
                        Close
                    </button>
                    {canCancelBooking(booking, currentUserId, userRole) && (
                        <button
                            onClick={onCancelBooking}
                            className='px-6 py-2 bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-medium'
                        >
                            <X className='w-4 h-4' />
                            <span>Cancel Booking</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
