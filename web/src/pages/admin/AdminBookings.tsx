import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Calendar,
    User,
    MapPin,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
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
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'checkIn' | 'checkOut' | 'totalPrice'>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [showFilters, setShowFilters] = useState(false);

    // Action modal state
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [actionType, setActionType] = useState<'confirm' | 'reject' | 'cancel' | 'complete' | null>(null);
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

    useEffect(() => {
        fetchBookings();
    }, [currentPage, statusFilter, sortBy, sortOrder]);

    const handleSearch = () => {
        setCurrentPage(1);
        fetchBookings();
    };

    const openActionModal = (booking: Booking, action: 'confirm' | 'reject' | 'cancel' | 'complete') => {
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
                case 'cancel':
                    await bookingApi.cancelBooking(selectedBooking.id, actionReason);
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
            PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
            CONFIRMED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Confirmed' },
            CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Cancelled' },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            COMPLETED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle, label: 'Completed' },
        };

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
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
            booking.guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.villa.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.villa.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const canPerformAction = (booking: Booking, action: string): boolean => {
        switch (action) {
            case 'confirm':
            case 'reject':
                return booking.status === 'PENDING';
            case 'cancel':
                return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
            case 'complete':
                return booking.status === 'CONFIRMED';
            default:
                return false;
        }
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Header */}
            <div className='flex justify-between items-center'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>Booking Management</h1>
                    <p className='text-gray-600'>Manage all bookings in the system</p>
                </div>
                <div className='text-sm text-gray-600'>Total: {totalCount} bookings</div>
            </div>

            {/* Search and Filters */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* Search */}
                    <div className='flex-1'>
                        <div className='relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                            <input
                                type='text'
                                placeholder='Search by guest name, email, or villa...'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
                    >
                        <Filter className='w-4 h-4 mr-2' />
                        Filters
                    </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className='mt-4 pt-4 border-t border-gray-200'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value=''>All Statuses</option>
                                    <option value='PENDING'>Pending</option>
                                    <option value='CONFIRMED'>Confirmed</option>
                                    <option value='CANCELLED'>Cancelled</option>
                                    <option value='REJECTED'>Rejected</option>
                                    <option value='COMPLETED'>Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Sort By</label>
                                <select
                                    value={sortBy}
                                    onChange={e => setSortBy(e.target.value as any)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value='createdAt'>Date Created</option>
                                    <option value='checkIn'>Check-in Date</option>
                                    <option value='checkOut'>Check-out Date</option>
                                    <option value='totalPrice'>Total Price</option>
                                </select>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value as any)}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                >
                                    <option value='desc'>Descending</option>
                                    <option value='asc'>Ascending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className='flex justify-between items-center'>
                <p className='text-gray-600'>
                    Showing {filteredBookings.length} of {totalCount} bookings
                </p>
            </div>

            {/* Error State */}
            {error && (
                <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-red-800'>{error}</p>
                </div>
            )}

            {/* Bookings Table */}
            <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Guest
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Villa
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Dates
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Guests
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Total
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Status
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Created
                                </th>
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center'>
                                            <User className='w-8 h-8 text-gray-400 mr-3' />
                                            <div>
                                                <div className='text-sm font-medium text-gray-900'>
                                                    {booking.guest.fullName}
                                                </div>
                                                <div className='text-sm text-gray-500'>{booking.guest.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {booking.villa.title}
                                            </div>
                                            <div className='text-sm text-gray-500 flex items-center'>
                                                <MapPin className='w-3 h-3 mr-1' />
                                                {booking.villa.city}, {booking.villa.country}
                                            </div>
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-900'>
                                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {bookingApi.getStayDuration(booking.checkIn, booking.checkOut)} nights
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                        {booking.totalGuests} guests
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='flex items-center text-sm font-medium text-gray-900'>
                                            <DollarSign className='w-4 h-4 mr-1' />
                                            {bookingApi.formatPrice(booking.totalPrice)}
                                        </div>
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(booking.status)}</td>

                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        {formatDateTime(booking.createdAt)}
                                    </td>

                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <div className='flex justify-end space-x-2'>
                                            {canPerformAction(booking, 'confirm') && (
                                                <button
                                                    onClick={() => openActionModal(booking, 'confirm')}
                                                    className='inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors'
                                                >
                                                    <CheckCircle className='w-3 h-3 mr-1' />
                                                    Confirm
                                                </button>
                                            )}

                                            {canPerformAction(booking, 'reject') && (
                                                <button
                                                    onClick={() => openActionModal(booking, 'reject')}
                                                    className='inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
                                                >
                                                    <XCircle className='w-3 h-3 mr-1' />
                                                    Reject
                                                </button>
                                            )}

                                            {canPerformAction(booking, 'cancel') && (
                                                <button
                                                    onClick={() => openActionModal(booking, 'cancel')}
                                                    className='inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors'
                                                >
                                                    <XCircle className='w-3 h-3 mr-1' />
                                                    Cancel
                                                </button>
                                            )}

                                            {canPerformAction(booking, 'complete') && (
                                                <button
                                                    onClick={() => openActionModal(booking, 'complete')}
                                                    className='inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors'
                                                >
                                                    <CheckCircle className='w-3 h-3 mr-1' />
                                                    Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredBookings.length === 0 && !loading && (
                    <div className='text-center py-12'>
                        <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <Calendar className='w-8 h-8 text-gray-400' />
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>No bookings found</h3>
                        <p className='text-gray-600 mb-4'>Try adjusting your search criteria or filters.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className='flex items-center justify-center space-x-2'>
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <ChevronLeft className='w-4 h-4 mr-1' />
                        Previous
                    </button>

                    <div className='flex space-x-1'>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                        currentPage === page
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className='inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Next
                        <ChevronRight className='w-4 h-4 ml-1' />
                    </button>
                </div>
            )}

            {/* Action Modal */}
            {selectedBooking && actionType && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
                    <div className='bg-white rounded-lg p-6 w-full max-w-md'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                            {actionType.charAt(0).toUpperCase() + actionType.slice(1)} Booking
                        </h3>

                        <div className='mb-4'>
                            <p className='text-sm text-gray-600 mb-2'>
                                Guest: <span className='font-medium'>{selectedBooking.guest.fullName}</span>
                            </p>
                            <p className='text-sm text-gray-600 mb-2'>
                                Villa: <span className='font-medium'>{selectedBooking.villa.title}</span>
                            </p>
                            <p className='text-sm text-gray-600'>
                                Dates: {formatDate(selectedBooking.checkIn)} - {formatDate(selectedBooking.checkOut)}
                            </p>
                        </div>

                        {(actionType === 'reject' || actionType === 'cancel') && (
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Reason {actionType === 'reject' ? '(Required)' : '(Optional)'}
                                </label>
                                <textarea
                                    value={actionReason}
                                    onChange={e => setActionReason(e.target.value)}
                                    rows={3}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    placeholder={`Enter reason for ${actionType}...`}
                                    required={actionType === 'reject'}
                                />
                            </div>
                        )}

                        <div className='flex space-x-3'>
                            <button
                                onClick={handleBookingAction}
                                disabled={actionLoading || (actionType === 'reject' && !actionReason.trim())}
                                className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            >
                                {actionLoading ? (
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                                ) : (
                                    <CheckCircle className='w-4 h-4 mr-2' />
                                )}
                                {actionLoading
                                    ? 'Processing...'
                                    : `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}`}
                            </button>

                            <button
                                onClick={closeActionModal}
                                className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors'
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
