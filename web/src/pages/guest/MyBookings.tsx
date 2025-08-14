import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import bookingApi, { type BookingFilters } from '@/api/bookingApi';
import emailApi from '@/api/emailApi';
import { useAuth } from '@/contexts/AuthContext';
import { THToast } from '@/components/common/Toast';
import type { Booking, UserRole } from '@/utils/types';

import { BookingHeader } from '@/components/myBookings/BookingHeader';
import { BookingFiltersComponent } from '@/components/myBookings/BookingFilters';
import { BookingTable } from '@/components/myBookings/BookingTable';
import { BookingCards } from '@/components/myBookings/BookingCards';
import { BookingPagination } from '@/components/myBookings/BookingPagination';
import { BookingDetailsModal } from '@/components/myBookings/BookingDetailsModal';
import { CancelBookingModal } from '@/components/myBookings/CancelBookingModal';

import { transformBookingDataForEmail, createUpdatedBooking } from '@/utils/emailUtils';

const MyBookings: React.FC = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

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

    const sendCancellationEmail = async (booking: Booking, cancellationReason: string): Promise<void> => {
        try {
            const emailBookingData = transformBookingDataForEmail(booking, cancellationReason, user);
            await emailApi.sendBookingCancellation(emailBookingData);
            console.log('Booking cancellation email sent successfully');
        } catch (error) {
            console.error('Failed to send booking cancellation email:', error);
            THToast.warning('Email Notice', 'Booking cancelled but notification email could not be sent');
        }
    };

    const handleCancelBooking = async (cancellationReason: string) => {
        if (!selectedBooking || !user) return;

        try {
            setCancelling(selectedBooking.id);
            await bookingApi.cancelBooking(selectedBooking.id, cancellationReason);
            const updatedBooking = createUpdatedBooking(selectedBooking, cancellationReason, user);
            setBookings(prev => prev.map(booking => (booking.id === selectedBooking.id ? updatedBooking : booking)));
            sendCancellationEmail(selectedBooking, cancellationReason);
            THToast.success('Booking Cancelled', 'Your booking has been cancelled successfully');
            setShowCancelModal(false);
            setSelectedBooking(null);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to cancel booking';
            setError(errorMsg);
            THToast.error('Cancellation Failed', errorMsg);
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

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
    };

    const handleCancelBookingClick = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowCancelModal(true);
    };

    const handleCloseDetailsModal = () => {
        setSelectedBooking(null);
    };

    const handleShowCancelModalFromDetails = () => {
        setShowCancelModal(true);
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
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
                <BookingHeader onRefresh={fetchBookings} loading={loading} />

                {/* Filters */}
                <BookingFiltersComponent filters={filters} onFilterChange={handleFilterChange} />

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

                {/* Bookings Table/Cards */}
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
                            <BookingTable
                                bookings={bookings}
                                currentUserId={user.id}
                                userRole={user.role as UserRole}
                                cancelling={cancelling}
                                onViewDetails={handleViewDetails}
                                onCancelBooking={handleCancelBookingClick}
                            />

                            {/* Mobile Cards */}
                            <BookingCards
                                bookings={bookings}
                                currentUserId={user.id}
                                userRole={user.role as UserRole}
                                cancelling={cancelling}
                                onViewDetails={handleViewDetails}
                                onCancelBooking={handleCancelBookingClick}
                            />

                            {/* Pagination */}
                            <BookingPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </div>

            {/* Booking Details Modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                currentUserId={user.id}
                userRole={user.role as UserRole}
                onClose={handleCloseDetailsModal}
                onCancelBooking={handleShowCancelModalFromDetails}
            />

            {/* Cancel Booking Modal */}
            <CancelBookingModal
                booking={selectedBooking}
                isOpen={showCancelModal}
                cancelling={cancelling === selectedBooking?.id}
                onClose={handleCloseCancelModal}
                onConfirm={handleCancelBooking}
            />
        </div>
    );
};

export default MyBookings;
