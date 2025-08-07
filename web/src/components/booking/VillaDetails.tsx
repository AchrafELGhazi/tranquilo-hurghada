import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Wifi, Car, Utensils, Snowflake, Waves, Trees } from 'lucide-react';
import Map from './Map';

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

interface VillaDetailsProps {
    villa: Villa;
}

const VillaDetails: React.FC<VillaDetailsProps> = ({ villa }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % villa.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + villa.images.length) % villa.images.length);
    };

    const getAmenityIcon = (amenity: string) => {
        const amenityLower = amenity.toLowerCase();
        if (amenityLower.includes('wifi')) return <Wifi className='w-5 h-5' />;
        if (amenityLower.includes('parking')) return <Car className='w-5 h-5' />;
        if (amenityLower.includes('kitchen')) return <Utensils className='w-5 h-5' />;
        if (amenityLower.includes('air conditioning')) return <Snowflake className='w-5 h-5' />;
        if (amenityLower.includes('pool')) return <Waves className='w-5 h-5' />;
        if (amenityLower.includes('garden')) return <Trees className='w-5 h-5' />;
        return <div className='w-5 h-5 bg-gray-300 rounded-full' />;
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-2xl md:text-3xl font-semibold text-gray-900 mb-2'>{villa.title}</h1>
                <div className='flex items-center space-x-4 text-sm text-gray-600'>
                    <div className='flex items-center'>
                        <Star className='w-4 h-4 fill-current text-yellow-400 mr-1' />
                        <span className='font-medium'>5</span>
                        
                    </div>
                    
                </div>
            </div>

            {/* Image Gallery */}
            <div className='relative mb-8 rounded-xl overflow-hidden'>
                <div className='aspect-[16/9] bg-gray-200'>
                    <img
                        src={villa.images[currentImageIndex]}
                        alt={`${villa.title} - Image ${currentImageIndex + 1}`}
                        className='w-full h-full object-cover'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/800x450/e5e7eb/6b7280?text=Villa+Image';
                        }}
                    />
                </div>

                {/* Navigation Arrows */}
                {villa.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200'
                        >
                            <ChevronLeft className='w-5 h-5' />
                        </button>
                        <button
                            onClick={nextImage}
                            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200'
                        >
                            <ChevronRight className='w-5 h-5' />
                        </button>
                    </>
                )}

                {/* Image Indicators */}
                {villa.images.length > 1 && (
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2'>
                        {villa.images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Image Counter */}
                <div className='absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm'>
                    {currentImageIndex + 1} / {villa.images.length}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Main Content */}
                <div className='lg:col-span-2 space-y-8'>
                    {/* Villa Info */}
                    <div className='border-b border-gray-200 pb-6'>
                        <div className='flex items-center justify-between mb-4'>
                            <div>
                               
                                <div className='flex items-center space-x-4 text-gray-600 mt-1'>
                                    <span>{villa.maxGuests} guests</span>
                                    <span>·</span>
                                    <span>{villa.bedrooms} bedrooms</span>
                                    <span>·</span>
                                    <span>{villa.bathrooms} bathrooms</span>
                                </div>
                            </div>
                          
                        </div>
                    </div>

                    {/* Description */}
                    <div className='border-b border-gray-200 pb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-3'>About this place</h3>
                        <p className='text-gray-600 leading-relaxed'>{villa.description}</p>
                    </div>

                    {/* Amenities */}
                    <div className='border-b border-gray-200 pb-6'>
                        <h3 className='text-lg font-semibold text-gray-900 mb-4'>What this place offers</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {villa.amenities.map((amenity, index) => (
                                <div key={index} className='flex items-center space-x-3'>
                                    {getAmenityIcon(amenity)}
                                    <span className='text-gray-700'>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <h3 className='text-lg -z-100 font-semibold text-gray-900 mb-4'>Where you'll be</h3>
                        <div className='space-y-4'>
                            <div className='bg-gray-100 rounded-lg p-4'>
                                <p className='text-gray-700 font-medium'>
                                    {villa.city}, {villa.country}
                                </p>
                                <p className='text-gray-600 text-sm mt-1'>{villa.address}</p>
                            </div>
                            <Map address={villa.address} city={villa.city} country={villa.country} />
                        </div>
                    </div>
                </div>

            
            </div>
        </div>
    );
};

export default VillaDetails;
