import React from 'react';
import { MapPin } from 'lucide-react';
import type { PopularDestination } from '@/api/statsApi';

interface PopularDestinationsProps {
    destinations: PopularDestination[];
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ destinations }) => (
    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
        <h3 className='text-lg font-semibold text-[#C75D2C] font-butler mb-4 flex items-center'>
            <MapPin className='w-5 h-5 mr-2' />
            Popular Destinations
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {destinations.length === 0 ? (
                <div className='col-span-full text-center py-8'>
                    <p className='text-[#C75D2C]/60'>No destination data available</p>
                </div>
            ) : (
                destinations.map(destination => (
                    <div
                        key={destination.city}
                        className='bg-white/60 backdrop-blur-sm border border-[#F8B259]/30 rounded-xl p-4 hover:bg-white/80 transition-all duration-300'
                    >
                        <div className='flex items-center mb-2'>
                            <MapPin className='w-4 h-4 text-[#D96F32] mr-2' />
                            <h4 className='font-medium text-[#C75D2C]'>{destination.city}</h4>
                        </div>
                        <p className='text-2xl font-bold text-[#D96F32] mb-1'>{destination.bookings}</p>
                        <p className='text-sm text-[#C75D2C]/60'>bookings</p>
                    </div>
                ))
            )}
        </div>
    </div>
);
