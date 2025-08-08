import React, { useState, useEffect } from 'react';
import villaApi from '@/api/villaApi';
import authApi from '@/api/authApi';
import VillaDetails from '@/components/booking/VillaDetails';
import BookingComponent from '@/components/booking/BookingComponent';
import type { User, Villa } from '@/utils/types';

const Booking: React.FC = () => {
    const [villa, setVilla] = useState<Villa | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                try {
                    const currentUser = await authApi.getCurrentUser();
                    setUser(currentUser);
                } catch (userError) {
                    setUser(null);
                }

                const villasResponse = await villaApi.getAllVillas({ limit: 1 });

                if (villasResponse.villas && villasResponse.villas.length > 0) {
                    setVilla(villasResponse.villas[0]);
                } else {
                    setError('No villas available');
                }
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
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

    if (error && !villa) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-[#E8DCC6] to-[#F8B259]/20 flex items-center justify-center px-4'>
                <div className='text-center max-w-md'>
                    <div className='w-24 h-24 bg-gradient-to-br from-[#D96F32]/20 to-[#F8B259]/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <div className='text-4xl'>🏠</div>
                    </div>
                    <h2 className='text-3xl font-bold text-[#C75D2C] mb-4 font-butler'>Oops! Something went wrong</h2>
                    <p className='text-[#C75D2C]/80 mb-6 leading-relaxed'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!villa) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-[#E8DCC6] to-[#F8B259]/20 flex items-center justify-center px-4'>
                <div className='text-center max-w-md'>
                    <div className='w-24 h-24 bg-gradient-to-br from-[#D96F32]/20 to-[#F8B259]/20 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <div className='text-4xl'>🏠</div>
                    </div>
                    <h2 className='text-3xl font-bold text-[#C75D2C] mb-4 font-butler'>Villa not found</h2>
                    <p className='text-[#C75D2C]/80 leading-relaxed'>
                        The villa you're looking for doesn't exist or is no longer available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#E8DCC6]'>
            {/* Decorative background elements */}
            <div className='absolute top-20 right-10 w-40 h-40 bg-gradient-radial from-[#F8B259]/20 to-transparent rounded-full blur-2xl'></div>
            <div className='absolute bottom-20 left-10 w-60 h-60 bg-gradient-radial from-[#D96F32]/10 to-transparent rounded-full blur-3xl'></div>

            <div className='relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Villa Details - Takes up 2/3 of the space */}
                <div className='lg:col-span-2'>
                    <VillaDetails villa={villa} />
                </div>

                {/* Booking Component - Takes up 1/3 of the space, sticky */}
                <div className='lg:col-span-1'>
                    <BookingComponent villa={villa} user={user} />
                </div>
            </div>
        </div>
    );
};

export default Booking;
