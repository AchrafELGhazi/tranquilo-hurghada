import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    CreditCard,
    X,
    AlertCircle,
    Eye,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    Baby,
    Phone,
    Mail,
    User,
    Home,
} from 'lucide-react';
import bookingApi, { type BookingFilters } from '@/api/bookingApi';
import { useAuth } from '@/contexts/AuthContext';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import type { Booking } from '@/utils/types';
import { canCancelBooking, formatPrice, getStatusText, getStayDuration } from '@/utils/bookingUtils';

const MyBookings: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState<BookingFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await bookingApi.getMyBookings(filters);
            setBookings(response.data);
            setCurrentPage(response.pagination.currentPage);
            setTotalPages(response.pagination.totalPages);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to fetch bookings';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user, filters]);

    const handleCancelBooking = async () => {
        if (!selectedBooking || !user) return;

        try {
            setCancelling(selectedBooking.id);
            await bookingApi.cancelBooking(selectedBooking.id, cancellationReason);

            setBookings(prev =>
                prev.map(booking =>
                    booking.id === selectedBooking.id
                        ? { ...booking, status: 'CANCELLED', cancellationReason }
                        : booking
                )
            );

            setShowCancelModal(false);
            setSelectedBooking(null);
            setCancellationReason('');
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to cancel booking';
            setError(errorMsg);
        } finally {
            setCancelling(null);
        }
    };

    const handleFilterChange = (newFilters: Partial<BookingFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (!user) {
        return (
            <div className='min-h-screen bg-[#E8DCC6] flex items-center justify-center'>
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 text-center'>
                    <AlertCircle className='w-12 h-12 text-[#D96F32] mx-auto mb-4' />
                    <h2 className='text-xl font-bold text-[#C75D2C] mb-2'>Please Sign In</h2>
                    <p className='text-[#C75D2C]/70'>You need to be signed in to view your bookings.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#E8DCC6] py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>My Bookings</h1>
                            <p className='text-[#C75D2C]/70 mt-1'>Manage your villa reservations</p>
                        </div>
                        <button
                            onClick={fetchBookings}
                            disabled={loading}
                            className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50'
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex items-center space-x-2'>
                            <Filter className='w-4 h-4 text-[#D96F32]' />
                            <span className='text-sm font-medium text-[#C75D2C]'>Filter by status:</span>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map(status => (
                                <button
                                    key={status}
                                    onClick={() =>
                                        handleFilterChange({ status: status === 'ALL' ? undefined : (status as any) })
                                    }
                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                        (status === 'ALL' && !filters.status) || filters.status === status
                                            ? 'bg-[#D96F32] text-white'
                                            : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                    }`}
                                >
                                    {status === 'ALL' ? 'All' : getStatusText(status as any)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-4 flex items-start space-x-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-red-800 font-semibold'>Error</p>
                            <p className='text-red-700 text-sm mt-1'>{error}</p>
                        </div>
                    </div>
                )}

                {/* Bookings Table */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl overflow-hidden'>
                    {loading ? (
                        <div className='p-8 text-center'>
                            <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                            <p className='text-[#C75D2C]/70'>Loading your bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className='p-8 text-center'>
                            <Calendar className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                            <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No bookings found</h3>
                            <p className='text-[#C75D2C]/70'>You haven't made any bookings yet.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
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
                                            <tr
                                                key={booking.id}
                                                className='hover:bg-white/20 transition-colors duration-200'
                                            >
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-3'>
                                                        <div className='w-12 h-12 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-lg flex items-center justify-center'>
                                                            <Home className='w-5 h-5 text-[#D96F32]' />
                                                        </div>
                                                        <div>
                                                            <p className='font-semibold text-[#C75D2C]'>
                                                                {booking.villa?.title || 'Villa'}
                                                            </p>
                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                #{booking.id.slice(-8)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <p className='text-[#C75D2C] font-medium'>
                                                        {formatDate(booking.checkIn)}
                                                    </p>
                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                        {new Date(booking.checkIn).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                        })}
                                                    </p>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <p className='text-[#C75D2C] font-medium'>
                                                        {formatDate(booking.checkOut)}
                                                    </p>
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
                                                            <span className='font-medium text-[#C75D2C]'>
                                                                {booking.totalAdults}
                                                            </span>
                                                        </div>
                                                        {booking.totalChildren > 0 && (
                                                            <div className='flex items-center space-x-1'>
                                                                <Baby className='w-4 h-4 text-[#D96F32]' />
                                                                <span className='font-medium text-[#C75D2C]'>
                                                                    {booking.totalChildren}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <p className='font-bold text-[#C75D2C]'>
                                                        {formatPrice(booking.totalPrice, 'EUR')}
                                                    </p>
                                                    <p className='text-xs text-[#C75D2C]/60'>
                                                        {booking.paymentMethod === 'BANK_TRANSFER'
                                                            ? 'Bank Transfer'
                                                            : 'On Arrival'}
                                                    </p>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <BookingStatusBadge status={booking.status} />
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-2'>
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className='p-2 bg-[#D96F32]/20 cursor-pointer text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                                                            title='View Details'
                                                        >
                                                            <Eye className='w-4 h-4' />
                                                        </button>
                                                        {canCancelBooking(booking, user.id, user.role) && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedBooking(booking);
                                                                    setShowCancelModal(true);
                                                                }}
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

                            {/* Mobile Cards */}
                            <div className='lg:hidden space-y-4 p-4'>
                                {bookings.map(booking => (
                                    <div
                                        key={booking.id}
                                        className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 space-y-4'
                                    >
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='font-semibold text-[#C75D2C]'>
                                                    {booking.villa?.title || 'Villa'}
                                                </h3>
                                                <p className='text-xs text-[#C75D2C]/60'>#{booking.id.slice(-8)}</p>
                                            </div>
                                            <BookingStatusBadge status={booking.status} />
                                        </div>

                                        <div className='grid grid-cols-2 gap-4 text-sm'>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Check-in</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {formatDate(booking.checkIn)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Check-out</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {formatDate(booking.checkOut)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Guests</p>
                                                <div className='flex items-center space-x-2'>
                                                    <div className='flex items-center space-x-1'>
                                                        <Users className='w-4 h-4 text-[#D96F32]' />
                                                        <span className='font-medium text-[#C75D2C]'>
                                                            {booking.totalAdults}
                                                        </span>
                                                    </div>
                                                    {booking.totalChildren > 0 && (
                                                        <div className='flex items-center space-x-1'>
                                                            <Baby className='w-4 h-4 text-[#D96F32]' />
                                                            <span className='font-medium text-[#C75D2C]'>
                                                                {booking.totalChildren}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Total</p>
                                                <p className='font-bold text-[#C75D2C]'>
                                                    {formatPrice(booking.totalPrice, 'EUR')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex justify-between items-center pt-2 border-t border-[#F8B259]/30'>
                                            <p className='text-xs text-[#C75D2C]/60'>
                                                {booking.paymentMethod === 'BANK_TRANSFER'
                                                    ? 'Bank Transfer'
                                                    : 'Payment on Arrival'}
                                            </p>
                                            <div className='flex items-center space-x-2'>
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className='p-2 bg-[#D96F32]/20 cursor-pointer text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                                                >
                                                    <Eye className='w-4 h-4' />
                                                </button>
                                                {canCancelBooking(booking, user.id, user.role) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowCancelModal(true);
                                                        }}
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='px-6 py-4 border-t-2 border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-[#C75D2C]/70'>
                                            Page {currentPage} of {totalPages}
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronLeft className='w-4 h-4' />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronRight className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Booking Details Modal */}
            {selectedBooking && !showCancelModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between p-6 border-b border-[#F8B259]/30'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Booking Details</h3>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl cursor-pointer transition-colors'
                            >
                                <X className='w-5 h-5 text-[#C75D2C]' />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className='p-6 space-y-6'>
                            {/* Booking Overview */}
                            <div className='bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10 rounded-xl p-4'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h4 className='text-lg font-bold text-[#C75D2C]'>
                                            {selectedBooking.villa?.title || 'Villa Booking'}
                                        </h4>
                                        <p className='text-sm text-[#C75D2C]/60'>#{selectedBooking.id}</p>
                                    </div>
                                    <div className='text-right'>
                                        <BookingStatusBadge status={selectedBooking.status} />
                                        <p className='text-sm text-[#C75D2C]/60 mt-1'>
                                            Booked: {formatDate(selectedBooking.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stay Details */}
                            <div>
                                <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                    <Calendar className='w-4 h-4 mr-2' />
                                    Stay Details
                                </h5>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='text-sm text-[#C75D2C]/60'>Check-in</label>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {formatDate(selectedBooking.checkIn)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-sm text-[#C75D2C]/60'>Check-out</label>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {formatDate(selectedBooking.checkOut)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-sm text-[#C75D2C]/60'>Duration</label>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {getStayDuration(selectedBooking.checkIn, selectedBooking.checkOut)} nights
                                        </p>
                                    </div>
                                    <div>
                                        <label className='text-sm text-[#C75D2C]/60'>Guests</label>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {selectedBooking.totalAdults} adults
                                            {selectedBooking.totalChildren > 0 &&
                                                `, ${selectedBooking.totalChildren} children`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Information */}
                            {selectedBooking.guest && (
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                        <User className='w-4 h-4 mr-2' />
                                        Guest Information
                                    </h5>
                                    <div className='space-y-2'>
                                        <div className='flex items-center space-x-2'>
                                            <User className='w-4 h-4 text-[#D96F32]' />
                                            <span className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.guest.fullName}
                                            </span>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <Mail className='w-4 h-4 text-[#D96F32]' />
                                            <span className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.guest.email}
                                            </span>
                                        </div>
                                        {selectedBooking.guest.phone && (
                                            <div className='flex items-center space-x-2'>
                                                <Phone className='w-4 h-4 text-[#D96F32]' />
                                                <span className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.guest.phone}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Payment Information */}
                            <div>
                                <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                    <CreditCard className='w-4 h-4 mr-2' />
                                    Payment Information
                                </h5>
                                <div className='bg-white/30 rounded-lg p-4 space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-[#C75D2C]/60'>Total Amount</span>
                                        <span className='font-bold text-[#C75D2C] text-lg'>
                                            {formatPrice(selectedBooking.totalPrice, 'EUR')}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-[#C75D2C]/60'>Payment Method</span>
                                        <span className='font-medium text-[#C75D2C]'>
                                            {selectedBooking.paymentMethod === 'BANK_TRANSFER'
                                                ? 'Bank Transfer'
                                                : 'Payment on Arrival'}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-[#C75D2C]/60'>Payment Status</span>
                                        <span
                                            className={`font-medium ${
                                                selectedBooking.isPaid ? 'text-green-600' : 'text-red-600'
                                            }`}
                                        >
                                            {selectedBooking.isPaid ? 'Paid' : 'Not Paid'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Services */}
                            {selectedBooking.bookingServices && selectedBooking.bookingServices.length > 0 && (
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3'>Additional Services</h5>
                                    <div className='space-y-2'>
                                        {selectedBooking.bookingServices.map(service => (
                                            <div
                                                key={service.id}
                                                className='bg-white/30 rounded-lg p-3 flex justify-between items-center'
                                            >
                                                <div>
                                                    <p className='font-medium text-[#C75D2C]'>
                                                        {service.service?.title || 'Service'}
                                                    </p>
                                                    <p className='text-sm text-[#C75D2C]/60'>
                                                        Qty: {service.quantity} ×{' '}
                                                        {formatPrice(service.unitPrice, 'EUR')}
                                                    </p>
                                                </div>
                                                <span className='font-medium text-[#C75D2C]'>
                                                    {formatPrice(service.totalPrice, 'EUR')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Villa Information */}
                            {selectedBooking.villa && (
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                        <Home className='w-4 h-4 mr-2' />
                                        Villa Information
                                    </h5>
                                    <div className='bg-white/30 rounded-lg p-4 space-y-2'>
                                        <div>
                                            <label className='text-sm text-[#C75D2C]/60'>Villa Name</label>
                                            <p className='font-medium text-[#C75D2C]'>{selectedBooking.villa.title}</p>
                                        </div>
                                        <div>
                                            <label className='text-sm text-[#C75D2C]/60'>Location</label>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.villa.city}, {selectedBooking.villa.country}
                                            </p>
                                        </div>
                                        {selectedBooking.villa.address && (
                                            <div>
                                                <label className='text-sm text-[#C75D2C]/60'>Address</label>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.villa.address}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Special Notes */}
                            {selectedBooking.notes && (
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3'>Special Requests</h5>
                                    <div className='bg-white/30 rounded-lg p-4'>
                                        <p className='text-[#C75D2C]'>{selectedBooking.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Cancellation/Rejection Reason */}
                            {(selectedBooking.cancellationReason || selectedBooking.rejectionReason) && (
                                <div>
                                    <h5 className='font-semibold text-red-700 mb-3'>
                                        {selectedBooking.cancellationReason
                                            ? 'Cancellation Reason'
                                            : 'Rejection Reason'}
                                    </h5>
                                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                                        <p className='text-red-700'>
                                            {selectedBooking.cancellationReason || selectedBooking.rejectionReason}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Actions */}
                        <div className='flex justify-between cursor-pointer items-center p-6 border-t border-[#F8B259]/30'>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className='px-4 py-2 text-[#C75D2C] hover:bg-[#F8B259]/20 rounded-lg transition-colors'
                            >
                                Close
                            </button>
                            {canCancelBooking(selectedBooking, user.id, user.role) && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className='px-4 py-2 bg-red-600 text-white cursor-pointer rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2'
                                >
                                    <X className='w-4 h-4' />
                                    <span>Cancel Booking</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 max-w-md w-full'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Cancel Booking</h3>
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancellationReason('');
                                }}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                            >
                                <X className='w-5 h-5 text-[#C75D2C]' />
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <p className='text-[#C75D2C]'>
                                Are you sure you want to cancel your booking for{' '}
                                <strong>{selectedBooking.villa?.title || 'this villa'}</strong>?
                            </p>

                            <div>
                                <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                                    Reason for cancellation (optional)
                                </label>
                                <textarea
                                    value={cancellationReason}
                                    onChange={e => setCancellationReason(e.target.value)}
                                    rows={3}
                                    className='w-full px-3 py-2 border-2 border-[#F8B259]/50 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] resize-none'
                                    placeholder="Please let us know why you're cancelling..."
                                />
                            </div>

                            <div className='flex space-x-3 pt-4'>
                                <button
                                    onClick={() => {
                                        setShowCancelModal(false);
                                        setCancellationReason('');
                                    }}
                                    className='flex-1 py-2 px-4 border-2 border-[#F8B259]/50 text-[#C75D2C] rounded-xl hover:bg-white/50 transition-colors'
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling === selectedBooking.id}
                                    className='flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2'
                                >
                                    {cancelling === selectedBooking.id ? (
                                        <>
                                            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                            <span>Cancelling...</span>
                                        </>
                                    ) : (
                                        <>
                                            <X className='w-4 h-4' />
                                            <span>Cancel Booking</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;
