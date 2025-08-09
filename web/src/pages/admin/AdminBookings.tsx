import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    AlertCircle,
    Eye,
} from 'lucide-react';
import { bookingApi, type BookingFilters } from '@/api/bookingApi';
import type { Booking, BookingStatus } from '@/utils/types';

export const AdminBookings: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);

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
            console.log('Fetched bookings:', response);
            setBookings(response.data);
            setTotalPages(response.pagination.totalPages);
            setTotalCount(response.pagination.totalCount);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    // Apply filters - update query params and trigger API call
    const applyFilters = () => {
        setCurrentPage(1);
        fetchBookings();
    };

    // Handle page change
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

        try {
            setActionLoading(true);

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

            closeActionModal();
            fetchBookings(); // Refresh the list
        } catch (err: any) {
            setError(err.message || `Failed to ${actionType} booking`);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusBadge = (status: Booking['status']) => {
        const statusConfig = {
            PENDING: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: Clock,
                label: 'Pending',
            },
            CONFIRMED: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: CheckCircle,
                label: 'Confirmed',
            },
            CANCELLED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Cancelled',
            },
            REJECTED: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: XCircle,
                label: 'Rejected',
            },
            COMPLETED: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-200',
                icon: CheckCircle,
                label: 'Completed',
            },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
            >
                <Icon className='w-3 h-3 mr-1' />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredBookings = bookings.filter(
        booking =>
            booking.guest.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.guest.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.villa.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            booking.villa.city.toLowerCase().includes(searchInput.toLowerCase())
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
        <div className='min-h-screen'>
            <div className='max-w-7xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div>
                            <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Admin Bookings</h1>
                            <p className='text-[#C75D2C]/70 mt-1'>
                                Manage all registered bookings{' '}
                                {totalCount > 0 && `(${totalCount} total, ${filteredBookings.length} shown)`}
                            </p>
                        </div>
                        <div className='flex items-center space-x-3'>
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
                                    onKeyPress={e => e.key === 'Enter' && applyFilters()}
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
                                                ? 'bg-[#DEB887] text-[#8B4513]'
                                                : 'bg-white/50 text-[#C75D2C] hover:bg-white/70'
                                        }`}
                                    >
                                        {sort.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <div className='flex items-center space-x-2'>
                                <span className='text-sm font-medium text-[#C75D2C]'>Order:</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {[
                                    { label: 'Descending', value: 'desc' },
                                    { label: 'Ascending', value: 'asc' },
                                ].map(order => (
                                    <button
                                        key={order.label}
                                        onClick={() => setSortOrder(order.value as any)}
                                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                                            sortOrder === order.value
                                                ? 'bg-[#DEB887] text-[#8B4513]'
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
                            <div className='block overflow-x-auto'>
                                <table className='w-full'>
                                    <thead className='bg-gradient-to-r from-[#F8B259]/20 to-[#DEB887]/20 border-b-2 border-[#F8B259]/50'>
                                        <tr>
                                            <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Guest
                                            </th>
                                            {/* <th className='px-6 py-4 text-left text-xs font-bold text-[#C75D2C] uppercase tracking-wider'>
                                                Villa
                                            </th> */}
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
                                                Created
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
                                                        <div className='w-12 h-12 bg-gradient-to-br from-[#F8B259]/30 to-[#DEB887]/30 rounded-lg flex items-center justify-center'>
                                                            <span className='text-sm font-medium text-[#8B4513]'>
                                                                {booking.guest.fullName?.charAt(0)?.toUpperCase() ||
                                                                    'G'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className='font-semibold text-[#C75D2C]'>
                                                                {booking.guest.fullName || 'N/A'}
                                                            </p>
                                                            <p className='text-xs text-[#C75D2C]/60'>
                                                                {booking.guest.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* <td className='px-6 py-4'>
                                                    <div>
                                                        <div className='text-sm font-medium text-[#C75D2C]'>
                                                            {booking.villa.title}
                                                        </div>
                                                    </div>
                                                </td> */}

                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-[#C75D2C]'>
                                                        {formatDate(booking.checkIn)}
                                                    </div>
                                                    <div className='text-sm text-[#C75D2C]/60'>
                                                        {bookingApi.getStayDuration(booking.checkIn, booking.checkOut)}{' '}
                                                        nights
                                                    </div>
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='text-sm text-[#C75D2C]'>
                                                        {formatDate(booking.checkOut)}
                                                    </div>
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-[#C75D2C]'>
                                                    {booking.totalGuests} guests
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    <div className='flex items-center text-sm font-medium text-[#C75D2C]'>
                                                        <DollarSign className='w-4 h-4 mr-1' />
                                                        {bookingApi.formatPrice(booking.totalPrice)}
                                                    </div>
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap'>
                                                    {getStatusBadge(booking.status)}
                                                </td>

                                                <td className='px-6 py-4 whitespace-nowrap text-sm text-[#C75D2C]/60'>
                                                    {formatDateTime(booking.createdAt)}
                                                </td>

                                                <td className='px-6 py-4'>
                                                    <div className='flex items-center space-x-2'>
                                                        <button
                                                            onClick={() => setSelectedBooking(booking)}
                                                            className='p-2 bg-[#D96F32]/20 text-[#D96F32] rounded-lg hover:bg-[#D96F32]/30 transition-colors duration-200'
                                                            title='View Details'
                                                        >
                                                            <Eye className='w-4 h-4' />
                                                        </button>

                                                        {canPerformAction(booking, 'confirm') && (
                                                            <button
                                                                onClick={() => openActionModal(booking, 'confirm')}
                                                                className='p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200'
                                                                title='Confirm Booking'
                                                            >
                                                                <CheckCircle className='w-4 h-4' />
                                                            </button>
                                                        )}

                                                        {canPerformAction(booking, 'reject') && (
                                                            <button
                                                                onClick={() => openActionModal(booking, 'reject')}
                                                                className='p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200'
                                                                title='Reject Booking'
                                                            >
                                                                <XCircle className='w-4 h-4' />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='px-6 py-4 border-t-2 border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/10 to-[#DEB887]/10'>
                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-[#C75D2C]/70'>
                                            Page {currentPage} of {totalPages} ({totalCount} total bookings)
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className='p-2 rounded-lg bg-white/50 text-[#C75D2C] hover:bg-white/70 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                            >
                                                <ChevronLeft className='w-4 h-4' />
                                            </button>
                                            <span className='px-3 py-1 text-sm text-[#C75D2C]'>{currentPage}</span>
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
            {selectedBooking && !actionType && (
                <div
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4'
                    style={{ zIndex: 999999 }}
                >
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Booking Details</h3>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors'
                            >
                                <XCircle className='w-5 h-5 text-[#C75D2C]' />
                            </button>
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Guest Information</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Name</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.guest.fullName}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Email</p>
                                            <p className='font-medium text-[#C75D2C]'>{selectedBooking.guest.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Villa Information</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Villa</p>
                                            <p className='font-medium text-[#C75D2C]'>{selectedBooking.villa.title}</p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Location</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.villa.city}, {selectedBooking.villa.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Booking Details</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Check-in</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDate(selectedBooking.checkIn)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Check-out</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {formatDate(selectedBooking.checkOut)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Guests</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.totalGuests} guests
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Duration</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {bookingApi.getStayDuration(
                                                    selectedBooking.checkIn,
                                                    selectedBooking.checkOut
                                                )}{' '}
                                                nights
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Payment Information</h4>
                                    <div className='space-y-2 text-sm'>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Total Price</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {bookingApi.formatPrice(selectedBooking.totalPrice)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Payment Method</p>
                                            <p className='font-medium text-[#C75D2C]'>
                                                {selectedBooking.paymentMethod.replace('_', ' ')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className='text-[#C75D2C]/60'>Status</p>
                                            <div className='mt-1'>{getStatusBadge(selectedBooking.status)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes and Reasons Section */}
                            {(selectedBooking.notes ||
                                selectedBooking.rejectionReason ||
                                selectedBooking.cancellationReason) && (
                                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                    <h4 className='font-semibold text-[#C75D2C] mb-3'>Additional Information</h4>
                                    <div className='space-y-3 text-sm'>
                                        {selectedBooking.notes && (
                                            <div>
                                                <p className='text-[#C75D2C]/60'>Notes</p>
                                                <p className='font-medium text-[#C75D2C] bg-white/30 p-2 rounded-lg'>
                                                    {selectedBooking.notes}
                                                </p>
                                            </div>
                                        )}
                                        {selectedBooking.rejectionReason && (
                                            <div>
                                                <p className='text-red-600/80'>Rejection Reason</p>
                                                <p className='font-medium text-red-700 bg-red-50/50 p-2 rounded-lg border border-red-200/50'>
                                                    {selectedBooking.rejectionReason}
                                                </p>
                                            </div>
                                        )}
                                        {selectedBooking.cancellationReason && (
                                            <div>
                                                <p className='text-yellow-600/80'>Cancellation Reason</p>
                                                <p className='font-medium text-yellow-700 bg-yellow-50/50 p-2 rounded-lg border border-yellow-200/50'>
                                                    {selectedBooking.cancellationReason}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                                <h4 className='font-semibold text-[#C75D2C] mb-3'>Booking Timeline</h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Created</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {formatDateTime(selectedBooking.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[#C75D2C]/60'>Last Updated</p>
                                        <p className='font-medium text-[#C75D2C]'>
                                            {formatDateTime(selectedBooking.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {selectedBooking && actionType && (
                <div
                    className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[999999] flex items-center justify-center p-4'
                    style={{ zIndex: 999999 }}
                >
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
                                    <span className='font-medium text-[#C75D2C]'>{selectedBooking.guest.fullName}</span>
                                </p>
                                <p className='text-sm text-[#C75D2C]/60 mb-2'>
                                    Villa:{' '}
                                    <span className='font-medium text-[#C75D2C]'>{selectedBooking.villa.title}</span>
                                </p>
                                <p className='text-sm text-[#C75D2C]/60'>
                                    Dates:{' '}
                                    <span className='font-medium text-[#C75D2C]'>
                                        {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}
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
    );
};
