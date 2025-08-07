import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    CreditCard,
    Clock,
    Check,
    X,
    AlertCircle,
    Eye,
    MapPin,
    Star,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import bookingApi, { type Booking, type BookingFilters } from '@/api/bookingApi';
import { useAuth } from '@/contexts/AuthContext';

const MyBookings: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    // Pagination and filters
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
            setBookings(response.bookings);
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

            // Update local state
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

    const getStatusBadge = (status: Booking['status']) => {
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
            >
                <Icon className='w-3 h-3 mr-1' />
                {bookingApi.getStatusText(status)}
            </span>
        );
    };

    const handleFilterChange = (newFilters: Partial<BookingFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
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
                                    {status === 'ALL' ? 'All' : bookingApi.getStatusText(status as any)}
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
                                                Dates
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
                                                            <MapPin className='w-5 h-5 text-[#D96F32]' />
                                                        </div>
                                                        <div>
                                                            <p className='font-semibold text-[#C75D2C]'>
                                                                {booking.villa.name}
                                                            </p>
                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                #{booking.id.slice(-8)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='text-sm'>
                                                        <p className='text-[#C75D2C] font-medium'>
                                                            {new Date(booking.checkIn).toLocaleDateString()}
                                                        </p>
                                                        <p className='text-[#C75D2C]/60'>
                                                            to {new Date(booking.checkOut).toLocaleDateString()}
                                                        </p>
                                                        <p className='text-xs text-[#C75D2C]/60'>
                                                            {bookingApi.getStayDuration(
                                                                booking.checkIn,
                                                                booking.checkOut
                                                            )}{' '}
                                                            nights
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-1 text-[#C75D2C]'>
                                                        <Users className='w-4 h-4' />
                                                        <span className='font-medium'>{booking.totalGuests}</span>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>
                                                    <div className='text-sm'>
                                                        <p className='font-bold text-[#C75D2C]'>
                                                            {bookingApi.formatPrice(booking.totalPrice, 'MAD')}
                                                        </p>
                                                        <div className='flex items-center space-x-1 text-xs text-[#C75D2C]/60'>
                                                            <CreditCard className='w-3 h-3' />
                                                            <span>
                                                                {booking.paymentMethod === 'BANK_TRANSFER'
                                                                    ? 'Bank Transfer'
                                                                    : 'On Arrival'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='px-6 py-4'>{getStatusBadge(booking.status)}</td>
                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-2'>
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors duration-200'
                                                            title='View Details'
                                                        >
                                                            <Eye className='w-4 h-4' />
                                                        </button>
                                                        {bookingApi.canCancelBooking(booking, user.id, user.role) && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedBooking(booking);
                                                                    setShowCancelModal(true);
                                                                }}
                                                                disabled={cancelling === booking.id}
                                                                className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50'
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
                                                <h3 className='font-semibold text-[#C75D2C]'>{booking.villa.name}</h3>
                                                <p className='text-xs text-[#C75D2C]/60'>#{booking.id.slice(-8)}</p>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <div className='grid grid-cols-2 gap-4 text-sm'>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Check-in</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {new Date(booking.checkIn).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Check-out</p>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {new Date(booking.checkOut).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Guests</p>
                                                <div className='flex items-center space-x-1'>
                                                    <Users className='w-4 h-4 text-[#D96F32]' />
                                                    <span className='font-medium text-[#C75D2C]'>
                                                        {booking.totalGuests}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Total</p>
                                                <p className='font-bold text-[#C75D2C]'>
                                                    {bookingApi.formatPrice(booking.totalPrice, 'MAD')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className='flex justify-between items-center pt-2 border-t border-[#F8B259]/30'>
                                            <div className='flex items-center space-x-1 text-xs text-[#C75D2C]/60'>
                                                <CreditCard className='w-3 h-3' />
                                                <span>
                                                    {booking.paymentMethod === 'BANK_TRANSFER'
                                                        ? 'Bank Transfer'
                                                        : 'On Arrival'}
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors duration-200'
                                                >
                                                    <Eye className='w-4 h-4' />
                                                </button>
                                                {bookingApi.canCancelBooking(booking, user.id, user.role) && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowCancelModal(true);
                                                        }}
                                                        disabled={cancelling === booking.id}
                                                        className='p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200 disabled:opacity-50'
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
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronLeft className='w-4 h-4' />
                                            </button>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
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
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Booking Details</h3>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                            >
                                <X className='w-5 h-5 text-[#C75D2C]' />
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-2'>Villa Information</h4>
                                    <p className='font-medium text-[#C75D2C]'>{selectedBooking.villa.name}</p>
                                    <p className='text-sm text-[#C75D2C]/60'>Booking ID: #{selectedBooking.id}</p>
                                </div>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-2'>Status</h4>
                                    {getStatusBadge(selectedBooking.status)}
                                </div>
                            </div>

                            <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                <h4 className='font-semibold text-[#C75D2C] mb-3'>Stay Details</h4>
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Check-in</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {new Date(selectedBooking.checkIn).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Check-out</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {new Date(selectedBooking.checkOut).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Guests</p>
                                        <p className='font-medium text-[#C75D2C]'>{selectedBooking.totalGuests}</p>
                                    </div>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Nights</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {bookingApi.getStayDuration(
                                                selectedBooking.checkIn,
                                                selectedBooking.checkOut
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                <h4 className='font-semibold text-[#C75D2C] mb-3'>Payment Information</h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Total Amount</p>
                                        <p className='font-bold text-[#C75D2C] text-lg'>
                                            {bookingApi.formatPrice(selectedBooking.totalPrice, 'MAD')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Payment Method</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {selectedBooking.paymentMethod === 'BANK_TRANSFER'
                                                ? 'Bank Transfer'
                                                : 'Payment on Arrival'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {selectedBooking.notes && (
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-2'>Special Requests</h4>
                                    <p className='text-[#C75D2C]/80'>{selectedBooking.notes}</p>
                                </div>
                            )}

                            {(selectedBooking.rejectionReason || selectedBooking.cancellationReason) && (
                                <div className='bg-red-50/80 border border-red-200/60 rounded-xl p-4'>
                                    <h4 className='font-semibold text-red-800 mb-2'>
                                        {selectedBooking.rejectionReason ? 'Rejection Reason' : 'Cancellation Reason'}
                                    </h4>
                                    <p className='text-red-700'>
                                        {selectedBooking.rejectionReason || selectedBooking.cancellationReason}
                                    </p>
                                </div>
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
                                <strong>{selectedBooking.villa.name}</strong>?
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
                                    className='flex-1 py-2 px-4 border-2 border-[#F8B259]/50 text-[#C75D2C] rounded-xl hover:bg-white/50 transition-colors duration-300'
                                >
                                    Keep Booking
                                </button>
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling === selectedBooking.id}
                                    className='flex-1 py-2 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center space-x-2'
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
