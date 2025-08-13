import React, { useState, useEffect } from 'react';
import villaApi from '@/api/villaApi';
import { useAuth } from '@/contexts/AuthContext';
import VillaDetails from '@/components/booking/VillaDetails';
import BookingComponent from '@/components/booking/BookingComponent';
import { THToast, THToaster } from '@/components/common/Toast';
import type { Villa } from '@/utils/types';

const Booking: React.FC = () => {
    const [villa, setVilla] = useState<Villa | null>(null);
    const [loading, setLoading] = useState(true);

    const { user, isLoading: authLoading } = useAuth();

    useEffect(() => {
        const loadVilla = async () => {
            try {
                setLoading(true);

                const villasResponse = await villaApi.getAllVillas({
                    limit: 1,
                });

                if (villasResponse.villas && villasResponse.villas.length > 0) {
                    setVilla(villasResponse.villas[0]);
                } else {
                    THToast.error('No Villas Available', 'There are currently no villas available for booking');
                }
            } catch (villaError) {
                console.error('Failed to load villa:', villaError);
                THToast.error('Loading Error', 'Failed to load villa data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

            loadVilla();
      
    }, [authLoading]);

    const handleBookingSuccess = () => {
        if (villa?.id) {
            villaApi
                .getVillaById(villa.id)
                .then(updatedVilla => setVilla(updatedVilla))
                .catch(error => console.error('Failed to reload villa data:', error));
        }
    };

    if (loading || authLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-[#E8DCC6] to-[#F8B259]/20 flex items-center justify-center'>
                <div className='flex flex-col items-center space-y-6'>
                    <div className='relative'>
                        <div className='w-16 h-16 border-4 border-[#F8B259]/30 border-t-[#D96F32] rounded-full animate-spin'></div>
                        <div className='absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#C75D2C]/50 rounded-full animate-spin animation-delay-150'></div>
                    </div>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold text-[#C75D2C] mb-2 font-butler'>
                            Loading Your Villa Experience
                        </h2>
                        <p className='text-[#C75D2C]/70'>Preparing your luxury escape...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!villa) {
        return (
            <>
                <div className='min-h-screen bg-gradient-to-br from-[#E8DCC6] to-[#F8B259]/20 flex items-center justify-center px-4'>
                    <div className='text-center max-w-md'>
                        <div className='w-24 h-24 bg-gradient-to-br from-[#D96F32]/20 to-[#F8B259]/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <div className='text-4xl'>🏠</div>
                        </div>
                        <h2 className='text-3xl font-bold text-[#C75D2C] mb-4 font-butler'>No Villa Available</h2>
                        <p className='text-[#C75D2C]/80 leading-relaxed mb-6'>
                            We couldn't find any available villas at the moment. Please check back later or contact our
                            support team for assistance.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                            <button
                                onClick={() => window.location.reload()}
                                className='bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg'
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => {
                                    const currentPath = window.location.pathname;
                                    const langMatch = currentPath.match(/^\/([a-z]{2})\//);
                                    const lang = langMatch ? langMatch[1] : 'en';
                                    window.location.href = `/${lang}/contact`;
                                }}
                                className='bg-white/50 text-[#C75D2C] px-8 py-3 rounded-xl font-semibold border-2 border-[#F8B259]/50 hover:bg-white/70 transition-all duration-300'
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
                <THToaster position='bottom-right' />
            </>
        );
    }

    return (
        <>
            <div className='min-h-screen bg-[#E8DCC6]'>
                {/* Header with villa status */}
                <div className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-b border-[#F8B259]/30'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>Book Your Stay</h1>
                                <p className='text-[#C75D2C]/70'>Complete your luxury villa booking</p>
                            </div>

                            <div className='flex items-center space-x-3'>
                                {/* Villa Status Indicator */}
                                {villa.status === 'AVAILABLE' && villa.isActive ? (
                                    ''
                                ) : villa.status === 'UNAVAILABLE' ? (
                                    <div className='flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-xl'>
                                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                        <div className='text-red-800'>
                                            <div className='font-semibold text-sm'>✗ Currently Unavailable</div>
                                            <div className='text-xs'>Villa not accepting bookings</div>
                                        </div>
                                    </div>
                                ) : villa.status === 'MAINTENANCE' ? (
                                    <div className='flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl'>
                                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                                        <div className='text-yellow-800'>
                                            <div className='font-semibold text-sm'>🔧 Under Maintenance</div>
                                            <div className='text-xs'>Temporarily unavailable</div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className='relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='lg:col-span-2'>
                        <VillaDetails villa={villa} />
                    </div>

                    <div className='lg:col-span-1'>
                        <BookingComponent villa={villa} user={user} onBookingSuccess={handleBookingSuccess} />
                    </div>
                </div>
            </div>
            <THToaster position='bottom-right' />
        </>
    );
};

export default Booking;
