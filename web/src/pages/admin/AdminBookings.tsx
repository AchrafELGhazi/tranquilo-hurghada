import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Calendar,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Eye,
    CreditCard,
    Users,
    Baby,
    User,
    Home,
    Mail,
    Phone,
} from 'lucide-react';
import { bookingApi, type BookingFilters } from '@/api/bookingApi';
import { THToast, THToaster } from '@/components/common/Toast';
import type { Booking, BookingStatus } from '@/utils/types';
import { useAuth } from '@/contexts/AuthContext';
import getPaymentBadge from '@/components/common/PaymentBadge';
import { BookingStatusBadge } from '@/components/common/BookingStatusBadge';
import { formatDate, formatDateTime } from '@/utils/date';
import villaApi from '@/api/villaApi';
import { canTogglePayment, formatPrice, getStayDuration } from '@/utils/bookingUtils';

export const AdminBookings: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Filters
    const [searchInput, setSearchInput] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Action modal state
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [actionType, setActionType] = useState<'confirm' | 'reject' | 'complete' | null>(null);
    const [actionReason, setActionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [paymentToggleLoading, setPaymentToggleLoading] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const filters: BookingFilters = {
                page: currentPage,
                limit: 20,
                sortBy,
                sortOrder,
            };

            if (statusFilter) {
                filters.status = statusFilter as BookingStatus;
            }

            const response = await bookingApi.getAllBookings(filters);
            setBookings(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotalCount(response.pagination.totalCount);
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to fetch bookings';
            THToast.error('Loading Error', errorMsg);
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchBookings();
    }, [currentPage, statusFilter, sortBy, sortOrder]);

    const openActionModal = (booking: Booking, action: 'confirm' | 'reject' | 'complete') => {
        setSelectedBooking(booking);
        setActionType(action);
        setActionReason('');
    };

    const closeActionModal = () => {
        setSelectedBooking(null);
        setActionType(null);
        setActionReason('');
    };

    const handleBookingAction = async () => {
        if (!selectedBooking || !actionType) return;

        if (actionType === 'reject' && !actionReason.trim()) {
            THToast.error('Reason Required', 'Please provide a reason for rejecting this booking');
            return;
        }

        try {
            setActionLoading(true);

            const actionPromise = async () => {
                switch (actionType) {
                    case 'confirm':
                        await bookingApi.confirmBooking(selectedBooking.id);
                        break;
                    case 'reject':
                        await bookingApi.rejectBooking(selectedBooking.id, actionReason);
                        break;
                    case 'complete':
                        await bookingApi.completeBooking(selectedBooking.id);
                        break;
                }
            };

            THToast.promise(actionPromise(), {
                loading: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}ing booking...`,
                success: `Booking ${
                    actionType === 'confirm' ? 'confirmed' : actionType === 'reject' ? 'rejected' : 'completed'
                } successfully!`,
                error: (err: any) => err.message || `Failed to ${actionType} booking`,
            });

            await actionPromise();
            closeActionModal();
            fetchBookings();
        } catch (err: any) {
            // Error is already handled by THToast.promise
        } finally {
            setActionLoading(false);
        }
    };

    const handleTogglePayment = async (booking: Booking) => {
        if (!user || !canTogglePayment(booking, user.id, user.role)) {
            THToast.error('Access Denied', 'You do not have permission to update payment status');
            return;
        }

        try {
            setPaymentToggleLoading(booking.id);

            const togglePromise = async () => {
                await bookingApi.toggleBookingPaymentStatus(booking.id);
            };

            THToast.promise(togglePromise(), {
                loading: 'Updating payment status...',
                success: `Payment status updated successfully!`,
                error: (err: any) => err.message || 'Failed to update payment status',
            });

            await togglePromise();
            fetchBookings();
        } catch (err: any) {
            // Error is already handled by THToast.promise
        } finally {
            setPaymentToggleLoading(null);
        }
    };

    const handleRefresh = async () => {
        THToast.info('Refreshing', 'Updating bookings list...');
        await fetchBookings();
    };



    const filteredBookings = bookings.filter(
        booking =>
            booking.guest?.fullName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.guest?.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.villa?.title?.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.villa?.city?.toLowerCase().includes(searchInput.toLowerCase())
    );

    const canPerformAction = (booking: Booking, action: string): boolean => {
        switch (action) {
            case 'confirm':
                return booking.status === 'PENDING' || booking.status === 'REJECTED';
            case 'reject':
                return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
            case 'complete':
                return booking.status === 'CONFIRMED';
            default:
                return false;
        }
    };

    return (
        <>
            <div className='min-h-screen'>
                <div className='max-w-7xl mx-auto space-y-6'>
                    {/* Header */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                            <div>
                                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Bookings</h1>
                                <p className='text-[#C75D2C]/70 mt-1'>
                                    Manage all villa reservations
                                    {totalCount > 0 && ` (${totalCount} total, ${filteredBookings.length} shown)`}
                                </p>
                            </div>
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className='flex items-center space-x-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-4 py-2 rounded-xl font-medium hover:from-[#C75D2C] hover:to-[#D96F32] transition-all duration-300 disabled:opacity-50'
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-4'>
                        <div className='flex flex-col space-y-4'>
                            {/* Search Bar */}
                            <div className='flex items-center space-x-2'>
                                <div className='relative flex-1 max-w-md'>
                                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                        <Search className='h-4 w-4 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        type='text'
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                        placeholder='Search by guest name, email, or villa...'
                                        className='w-full pl-10 pr-3 py-2 border-2 border-[#F8B259]/50 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300 text-sm'
                                    />
                                </div>
                            </div>

                            {/* Filter Controls */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <Filter className='w-4 h-4 text-[#D96F32]' />
                                    <span className='text-sm font-medium text-[#C75D2C]'>Status:</span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'All', value: '' },
                                        { label: 'Pending', value: 'PENDING' },
                                        { label: 'Confirmed', value: 'CONFIRMED' },
                                        { label: 'Cancelled', value: 'CANCELLED' },
                                        { label: 'Rejected', value: 'REJECTED' },
                                        { label: 'Completed', value: 'COMPLETED' },
                                    ].map(status => (
                                        <button
                                            key={status.label}
                                            onClick={() => setStatusFilter(status.value)}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                                statusFilter === status.value
                                                    ? 'bg-[#D96F32] text-white'
                                                    : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                            }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Controls */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='flex items-center space-x-2'>
                                    <span className='text-sm font-medium text-[#C75D2C]'>Sort By:</span>
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'Date Created', value: 'createdAt' },
                                        { label: 'Check-in', value: 'checkIn' },
                                        { label: 'Check-out', value: 'checkOut' },
                                        { label: 'Total Price', value: 'totalPrice' },
                                    ].map(sort => (
                                        <button
                                            key={sort.label}
                                            onClick={() => setSortBy(sort.value as any)}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                                sortBy === sort.value
                                                    ? 'bg-[#F8B259] text-[#C75D2C]'
                                                    : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                            }`}
                                        >
                                            {sort.label}
                                        </button>
                                    ))}
                                </div>
                                <div className='flex flex-wrap gap-2'>
                                    {[
                                        { label: 'Newest First', value: 'desc' },
                                        { label: 'Oldest First', value: 'asc' },
                                    ].map(order => (
                                        <button
                                            key={order.label}
                                            onClick={() => setSortOrder(order.value as any)}
                                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                                sortOrder === order.value
                                                    ? 'bg-[#F8B259] text-[#C75D2C]'
                                                    : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                            }`}
                                        >
                                            {order.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl overflow-hidden'>
                        {loading ? (
                            <div className='p-8 text-center'>
                                <div className='w-8 h-8 border-2 border-[#D96F32]/30 border-t-[#D96F32] rounded-full animate-spin mx-auto mb-4'></div>
                                <p className='text-[#C75D2C]/70'>Loading bookings...</p>
                            </div>
                        ) : filteredBookings.length === 0 ? (
                            <div className='p-8 text-center'>
                                <Calendar className='w-12 h-12 text-[#D96F32]/50 mx-auto mb-4' />
                                <h3 className='text-lg font-semibold text-[#C75D2C] mb-2'>No bookings found</h3>
                                <p className='text-[#C75D2C]/70'>Try adjusting your search or filter criteria.</p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className='hidden lg:block overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-b-2 border-[#F8B259]/50'>
                                            <tr>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                    Guest
                                                </th>
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
                                                    Payment
                                                </th>
                                                <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-[#F8B259]/30'>
                                            {filteredBookings.map(booking => (
                                                <tr
                                                    key={booking.id}
                                                    className='hover:bg-white/20 transition-colors duration-200'
                                                >
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center space-x-3'>
                                                            <div className='w-10 h-10 bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 rounded-lg flex items-center justify-center'>
                                                                <User className='w-5 h-5 text-[#D96F32]' />
                                                            </div>
                                                            <div>
                                                                <p className='font-semibold text-[#C75D2C]'>
                                                                    {booking.guest?.fullName || 'N/A'}
                                                                </p>
                                                                <p className='text-xs text-[#C75D2C]/60'>
                                                                    {booking.guest?.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center space-x-2'>
                                                            <Home className='w-4 h-4 text-[#D96F32]' />
                                                            <div>
                                                                <p className='font-medium text-[#C75D2C]'>
                                                                    {booking.villa?.title || 'N/A'}
                                                                </p>
                                                                <p className='text-xs text-[#C75D2C]/60'>
                                                                    {booking.villa?.city}, {booking.villa?.country}
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
                                                            {getPaymentBadge(booking.isPaid)}
                                                            {user &&
                                                                canTogglePayment(
                                                                    booking,
                                                                    user.id,
                                                                    user.role
                                                                ) && (
                                                                    <button
                                                                        onClick={() => handleTogglePayment(booking)}
                                                                        disabled={paymentToggleLoading === booking.id}
                                                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                                            booking.isPaid
                                                                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        } disabled:opacity-50`}
                                                                    >
                                                                        {paymentToggleLoading === booking.id ? (
                                                                            <div className='w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin'></div>
                                                                        ) : booking.isPaid ? (
                                                                            'Mark Unpaid'
                                                                        ) : (
                                                                            'Mark Paid'
                                                                        )}
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                    <td className='px-6 py-4'>
                                                        <div className='flex items-center space-x-2'>
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                                                                title='View Details'
                                                            >
                                                                <Eye className='w-4 h-4' />
                                                            </button>
                                                            {canPerformAction(booking, 'confirm') && (
                                                                <button
                                                                    onClick={() => openActionModal(booking, 'confirm')}
                                                                    className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
                                                                    title='Confirm Booking'
                                                                >
                                                                    <CheckCircle className='w-4 h-4' />
                                                                </button>
                                                            )}
                                                            {canPerformAction(booking, 'reject') && (
                                                                <button
                                                                    onClick={() => openActionModal(booking, 'reject')}
                                                                    className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                                                                    title='Reject Booking'
                                                                >
                                                                    <XCircle className='w-4 h-4' />
                                                                </button>
                                                            )}
                                                            {canPerformAction(booking, 'complete') && (
                                                                <button
                                                                    onClick={() => openActionModal(booking, 'complete')}
                                                                    className='p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors'
                                                                    title='Complete Booking'
                                                                >
                                                                    <CheckCircle className='w-4 h-4' />
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
                                    {filteredBookings.map(booking => (
                                        <div
                                            key={booking.id}
                                            className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 space-y-4'
                                        >
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <h3 className='font-semibold text-[#C75D2C]'>
                                                        {booking.guest?.fullName || 'Guest'}
                                                    </h3>
                                                    <p className='text-sm text-[#C75D2C]/60'>
                                                        {booking.villa?.title || 'Villa'}
                                                    </p>
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
                                                <div className='flex items-center space-x-2'>
                                                    {getPaymentBadge(booking.isPaid)}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                    </button>
                                                    {canPerformAction(booking, 'confirm') && (
                                                        <button
                                                            onClick={() => openActionModal(booking, 'confirm')}
                                                            className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors'
                                                        >
                                                            <CheckCircle className='w-4 h-4' />
                                                        </button>
                                                    )}
                                                    {canPerformAction(booking, 'reject') && (
                                                        <button
                                                            onClick={() => openActionModal(booking, 'reject')}
                                                            className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors'
                                                        >
                                                            <XCircle className='w-4 h-4' />
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
                                                Page {currentPage} of {totalPages} ({totalCount} total bookings)
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                                                >
                                                    <ChevronLeft className='w-4 h-4' />
                                                </button>
                                                <span className='px-3 py-1 text-sm text-[#C75D2C]'>{currentPage}</span>
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
                {selectedBooking && !actionType && (
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
                            {/* Modal Header */}
                            <div className='flex items-center justify-between p-6 border-b border-[#F8B259]/30'>
                                <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Booking Details</h3>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                                >
                                    <XCircle className='w-5 h-5 text-[#C75D2C]' />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className='p-6 space-y-6'>
                                {/* Booking Overview */}
                                <div className='bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10 rounded-xl p-4'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h4 className='text-lg font-bold text-[#C75D2C]'>
                                                Booking #{selectedBooking.id.slice(-8)}
                                            </h4>
                                            <p className='text-sm text-[#C75D2C]/60'>
                                                Created: {formatDateTime(selectedBooking.createdAt)}
                                            </p>
                                        </div>
                                        <div className='text-right space-y-2'>
                                            <BookingStatusBadge status={selectedBooking.status} />
                                            {selectedBooking.isPaid && (
                                                <div>
                                                    <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200'>
                                                        <CheckCircle className='w-3 h-3 mr-1' />
                                                        Paid
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Guest & Villa Information */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <div>
                                        <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                            <User className='w-4 h-4 mr-2' />
                                            Guest Information
                                        </h5>
                                        <div className='bg-white/30 rounded-lg p-4 space-y-3'>
                                            <div className='flex items-center space-x-2'>
                                                <User className='w-4 h-4 text-[#D96F32]' />
                                                <span className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.guest?.fullName || 'N/A'}
                                                </span>
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <Mail className='w-4 h-4 text-[#D96F32]' />
                                                <span className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.guest?.email || 'N/A'}
                                                </span>
                                            </div>
                                            {selectedBooking.guest?.phone && (
                                                <div className='flex items-center space-x-2'>
                                                    <Phone className='w-4 h-4 text-[#D96F32]' />
                                                    <span className='font-medium text-[#C75D2C]'>
                                                        {selectedBooking.guest.phone}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                            <Home className='w-4 h-4 mr-2' />
                                            Villa Information
                                        </h5>
                                        <div className='bg-white/30 rounded-lg p-4 space-y-2'>
                                            <div>
                                                <label className='text-sm text-[#C75D2C]/60'>Villa Name</label>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.villa?.title || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className='text-sm text-[#C75D2C]/60'>Location</label>
                                                <p className='font-medium text-[#C75D2C]'>
                                                    {selectedBooking.villa?.city}, {selectedBooking.villa?.country}
                                                </p>
                                            </div>
                                            {selectedBooking.villa?.address && (
                                                <div>
                                                    <label className='text-sm text-[#C75D2C]/60'>Address</label>
                                                    <p className='font-medium text-[#C75D2C]'>
                                                        {selectedBooking.villa.address}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stay Details */}
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                        <Calendar className='w-4 h-4 mr-2' />
                                        Stay Details
                                    </h5>
                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <p className='text-sm text-[#C75D2C]/60'>Check-in</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDate(selectedBooking.checkIn)}
                                            </p>
                                        </div>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <p className='text-sm text-[#C75D2C]/60'>Check-out</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDate(selectedBooking.checkOut)}
                                            </p>
                                        </div>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <p className='text-sm text-[#C75D2C]/60'>Duration</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {getStayDuration(
                                                    selectedBooking.checkIn,
                                                    selectedBooking.checkOut
                                                )}{' '}
                                                nights
                                            </p>
                                        </div>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <p className='text-sm text-[#C75D2C]/60'>Total Guests</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.totalAdults + selectedBooking.totalChildren}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='mt-4 grid grid-cols-2 gap-4'>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <Users className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                            <p className='font-medium text-[#C75D2C]'>{selectedBooking.totalAdults}</p>
                                            <p className='text-sm text-[#C75D2C]/60'>Adults</p>
                                        </div>
                                        <div className='bg-white/30 rounded-lg p-3 text-center'>
                                            <Baby className='w-6 h-6 text-[#D96F32] mx-auto mb-1' />
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.totalChildren}
                                            </p>
                                            <p className='text-sm text-[#C75D2C]/60'>Children</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div>
                                    <h5 className='font-semibold text-[#C75D2C] mb-3 flex items-center'>
                                        <CreditCard className='w-4 h-4 mr-2' />
                                        Payment Information
                                    </h5>
                                    <div className='bg-white/30 rounded-lg p-4 space-y-3'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[#C75D2C]/60'>Total Amount</span>
                                            <span className='font-bold text-[#C75D2C] text-lg'>
                                                {formatPrice(selectedBooking.totalPrice, 'EUR')}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[#C75D2C]/60'>Payment Method</span>
                                            <span className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.paymentMethod === 'BANK_TRANSFER'
                                                    ? 'Bank Transfer'
                                                    : 'Payment on Arrival'}
                                            </span>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-[#C75D2C]/60'>Payment Status</span>
                                            <div className='flex items-center space-x-2'>
                                                {getPaymentBadge(selectedBooking.isPaid)}
                                                {user &&
                                                    canTogglePayment(
                                                        selectedBooking,
                                                        user.id,
                                                        user.role
                                                    ) && (
                                                        <button
                                                            onClick={() => handleTogglePayment(selectedBooking)}
                                                            disabled={paymentToggleLoading === selectedBooking.id}
                                                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                                selectedBooking.isPaid
                                                                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            } disabled:opacity-50`}
                                                        >
                                                            {paymentToggleLoading === selectedBooking.id ? (
                                                                <div className='w-3 h-3 border border-current/30 border-t-current rounded-full animate-spin'></div>
                                                            ) : selectedBooking.isPaid ? (
                                                                'Mark Unpaid'
                                                            ) : (
                                                                'Mark Paid'
                                                            )}
                                                        </button>
                                                    )}
                                            </div>
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
                                                            Qty: {service.quantity}
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

                                {/* Special Notes */}
                                {selectedBooking.notes && (
                                    <div>
                                        <h5 className='font-semibold text-[#C75D2C] mb-3'>Special Requests</h5>
                                        <div className='bg-white/30 rounded-lg p-4'>
                                            <p className='text-[#C75D2C]'>{selectedBooking.notes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Reasons */}
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
                            <div className='flex justify-between items-center p-6 border-t border-[#F8B259]/30'>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className='px-4 py-2 text-[#C75D2C] hover:bg-[#F8B259]/20 rounded-lg transition-colors'
                                >
                                    Close
                                </button>
                                <div className='flex items-center space-x-2'>
                                    {canPerformAction(selectedBooking, 'confirm') && (
                                        <button
                                            onClick={() => openActionModal(selectedBooking, 'confirm')}
                                            className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2'
                                        >
                                            <CheckCircle className='w-4 h-4' />
                                            <span>Confirm</span>
                                        </button>
                                    )}
                                    {canPerformAction(selectedBooking, 'reject') && (
                                        <button
                                            onClick={() => openActionModal(selectedBooking, 'reject')}
                                            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2'
                                        >
                                            <XCircle className='w-4 h-4' />
                                            <span>Reject</span>
                                        </button>
                                    )}
                                    {canPerformAction(selectedBooking, 'complete') && (
                                        <button
                                            onClick={() => openActionModal(selectedBooking, 'complete')}
                                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
                                        >
                                            <CheckCircle className='w-4 h-4' />
                                            <span>Complete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Modal */}
                {selectedBooking && actionType && (
                    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                        <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 w-full max-w-md'>
                            <div className='flex items-center justify-between mb-6'>
                                <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>
                                    {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Booking
                                </h3>
                                <button
                                    onClick={closeActionModal}
                                    className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                                >
                                    <XCircle className='w-5 h-5 text-[#C75D2C]' />
                                </button>
                            </div>

                            <div className='mb-4'>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <p className='text-sm text-[#C75D2C]/60 mb-2'>
                                        Guest:{' '}
                                        <span className='font-medium text-[#C75D2C]'>
                                            {selectedBooking.guest?.fullName}
                                        </span>
                                    </p>
                                    <p className='text-sm text-[#C75D2C]/60 mb-2'>
                                        Villa:{' '}
                                        <span className='font-medium text-[#C75D2C]'>
                                            {selectedBooking.villa?.title}
                                        </span>
                                    </p>
                                    <p className='text-sm text-[#C75D2C]/60'>
                                        Dates:{' '}
                                        <span className='font-medium text-[#C75D2C]'>
                                            {formatDate(selectedBooking.checkIn)} -{' '}
                                            {formatDate(selectedBooking.checkOut)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {actionType === 'reject' && (
                                <div className='mb-4'>
                                    <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                                        Reason (Required)
                                    </label>
                                    <textarea
                                        value={actionReason}
                                        onChange={e => setActionReason(e.target.value)}
                                        rows={3}
                                        className='w-full border-2 border-[#F8B259]/50 rounded-xl px-3 py-2 bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        placeholder={`Enter reason for ${actionType}...`}
                                        required={actionType === 'reject'}
                                    />
                                </div>
                            )}

                            <div className='flex space-x-3'>
                                <button
                                    onClick={handleBookingAction}
                                    disabled={actionLoading || (actionType === 'reject' && !actionReason.trim())}
                                    className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium'
                                >
                                    {actionLoading ? (
                                        <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                                    ) : (
                                        <CheckCircle className='w-4 h-4 mr-2' />
                                    )}
                                    {actionLoading
                                        ? 'Processing...'
                                        : `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
                                </button>

                                <button
                                    onClick={closeActionModal}
                                    className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-white/50 text-[#C75D2C] rounded-xl hover:bg-white/70 transition-all duration-300 font-medium'
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <THToaster position='bottom-right' />
        </>
    );
};
