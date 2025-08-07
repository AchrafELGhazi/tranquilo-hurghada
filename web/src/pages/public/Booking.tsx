import React, { useState, useEffect } from 'react';
import villaApi from '@/api/villaApi';
import authApi from '@/api/authApi';
import VillaDetails from '@/components/booking/VillaDetails';
import BookingComponent from '@/components/booking/BookingComponent';

interface Villa {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: string;
    maxGuests: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    images: string[];
    status: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: {
        id: string;
        fullName: string;
        email: string;
    };
}

interface User {
    id: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date | null;
}

const Booking: React.FC = () => {
    const [villa, setVilla] = useState<Villa | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Load current user
                const currentUser = await authApi.getCurrentUser();
                setUser(currentUser);

                // Load villa data
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

    const handleBookingSuccess = () => {
        // Handle successful booking (e.g., show notification, redirect, etc.)
        console.log('Booking successful!');
    };

    if (loading) {
        return (
            <div className='min-h-screen bg-white flex items-center justify-center'>
                <div className='flex flex-col items-center space-y-4'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500'></div>
                    <p className='text-gray-600'>Loading villa details...</p>
                </div>
            </div>
        );
    }

    if (error && !villa) {
        return (
            <div className='min-h-screen bg-white flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-6xl mb-4'>🏠</div>
                    <h2 className='text-2xl font-semibold text-gray-900 mb-2'>Oops! Something went wrong</h2>
                    <p className='text-gray-600 mb-4'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors'
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!villa || !user) {
        return (
            <div className='min-h-screen bg-white flex items-center justify-center'>
                <div className='text-center'>
                    <div className='text-6xl mb-4'>🏠</div>
                    <h2 className='text-2xl font-semibold text-gray-900 mb-2'>Villa not found</h2>
                    <p className='text-gray-600'>
                        The villa you're looking for doesn't exist or is no longer available.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-cream'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Villa Details - Takes up 2/3 of the space */}
                <div className='lg:col-span-2'>
                    <VillaDetails villa={villa} />
                </div>

                {/* Booking Component - Takes up 1/3 of the space, sticky */}
                <div className='lg:col-span-1 px-4 sm:px-6 lg:px-8 py-8'>
                    <BookingComponent villa={villa} user={user} onBookingSuccess={handleBookingSuccess} />
                </div>
            </div>
        </div>
    );
};

export default Booking;
