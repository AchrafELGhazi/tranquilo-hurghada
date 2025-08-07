import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Star,
    Wifi,
    Car,
    Utensils,
    Snowflake,
    Waves,
    Trees,
    MapPin,
    Users,
    Bed,
    Bath,
} from 'lucide-react';
import Map from './Map';

interface Villa {
    id: string;
    title: string;
    description: string;
    address: string;
    city: string;
    country: string;
    pricePerNight: number; // Changed from string to number
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
        if (amenityLower.includes('wifi')) return <Wifi className='w-5 h-5 text-[#D96F32]' />;
        if (amenityLower.includes('parking')) return <Car className='w-5 h-5 text-[#D96F32]' />;
        if (amenityLower.includes('kitchen')) return <Utensils className='w-5 h-5 text-[#D96F32]' />;
        if (amenityLower.includes('air conditioning')) return <Snowflake className='w-5 h-5 text-[#D96F32]' />;
        if (amenityLower.includes('pool')) return <Waves className='w-5 h-5 text-[#D96F32]' />;
        if (amenityLower.includes('garden')) return <Trees className='w-5 h-5 text-[#D96F32]' />;
        return <div className='w-5 h-5 bg-[#F8B259] rounded-full' />;
    };

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                <h1 className='text-3xl md:text-4xl font-bold text-[#C75D2C] mb-4 font-butler'>{villa.title}</h1>
                <div className='flex flex-wrap items-center gap-6 text-[#C75D2C]/80'>
                    <div className='flex items-center space-x-2'>
                        <div className='flex items-center'>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className='w-4 h-4 fill-current text-[#F8B259]' />
                            ))}
                        </div>
                        <span className='font-semibold text-[#C75D2C]'>5.0</span>
                        <span className='text-[#C75D2C]/60'>• 127 reviews</span>
                    </div>
                    <div className='flex items-center space-x-2 text-[#C75D2C]/70'>
                        <MapPin className='w-4 h-4' />
                        <span>
                            {villa.city}, {villa.country}
                        </span>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
            <div className='relative rounded-2xl overflow-hidden border-2 border-[#F8B259]/70 bg-white/20 backdrop-blur-md'>
                <div className='aspect-[16/9] bg-gradient-to-br from-[#F8B259]/20 to-[#D96F32]/20'>
                    <img
                        src={villa.images[currentImageIndex]}
                        alt={`${villa.title} - Image ${currentImageIndex + 1}`}
                        className='w-full h-full object-cover'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.src =
                                'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                        }}
                    />
                </div>

                {/* Navigation Arrows */}
                {villa.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white p-3 rounded-xl border border-[#F8B259]/50 shadow-lg transition-all duration-300 hover:scale-105'
                        >
                            <ChevronLeft className='w-5 h-5 text-[#D96F32]' />
                        </button>
                        <button
                            onClick={nextImage}
                            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-md hover:bg-white p-3 rounded-xl border border-[#F8B259]/50 shadow-lg transition-all duration-300 hover:scale-105'
                        >
                            <ChevronRight className='w-5 h-5 text-[#D96F32]' />
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
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex
                                        ? 'bg-[#F8B259] scale-125'
                                        : 'bg-white/60 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                )}

                {/* Image Counter */}
                <div className='absolute top-4 right-4 bg-[#C75D2C]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-medium'>
                    {currentImageIndex + 1} / {villa.images.length}
                </div>
            </div>

            {/* Villa Info Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
                {/* Main Content */}
                <div className='space-y-8'>
                    {/* Villa Stats */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler'>Villa Overview</h3>
                            <div className='flex items-center space-x-1'>
                                <Star className='w-5 h-5 fill-current text-[#F8B259]' />
                                <span className='text-[#C75D2C] font-semibold'>Premium</span>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                            <div className='text-center p-4 bg-white/30 rounded-xl border border-[#F8B259]/50'>
                                <Users className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                                <div className='text-lg font-bold text-[#C75D2C]'>{villa.maxGuests}</div>
                                <div className='text-sm text-[#C75D2C]/70'>Guests</div>
                            </div>
                            <div className='text-center p-4 bg-white/30 rounded-xl border border-[#F8B259]/50'>
                                <Bed className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                                <div className='text-lg font-bold text-[#C75D2C]'>{villa.bedrooms}</div>
                                <div className='text-sm text-[#C75D2C]/70'>Bedrooms</div>
                            </div>
                            <div className='text-center p-4 bg-white/30 rounded-xl border border-[#F8B259]/50'>
                                <Bath className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                                <div className='text-lg font-bold text-[#C75D2C]'>{villa.bathrooms}</div>
                                <div className='text-sm text-[#C75D2C]/70'>Bathrooms</div>
                            </div>
                            <div className='text-center p-4 bg-white/30 rounded-xl border border-[#F8B259]/50'>
                                <Star className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                                <div className='text-lg font-bold text-[#C75D2C]'>5.0</div>
                                <div className='text-sm text-[#C75D2C]/70'>Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-4 font-butler'>About This Paradise</h3>
                        <p className='text-[#C75D2C]/80 leading-relaxed text-lg'>{villa.description}</p>

                        {/* Decorative divider */}
                        <div className='flex items-center justify-center space-x-4 mt-6'>
                            <div className='w-12 h-0.5 bg-[#F8B259]/60'></div>
                            <div className='w-2 h-2 bg-[#F8B259] rounded-full'></div>
                            <div className='w-16 h-0.5 bg-[#F8B259]/60'></div>
                            <div className='w-2 h-2 bg-[#F8B259] rounded-full'></div>
                            <div className='w-12 h-0.5 bg-[#F8B259]/60'></div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-6 font-butler'>What This Place Offers</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {villa.amenities.map((amenity, index) => (
                                <div
                                    key={index}
                                    className='flex items-center space-x-3 p-3 bg-white/30 rounded-xl border border-[#F8B259]/50 hover:bg-white/50 transition-all duration-300'
                                >
                                    {getAmenityIcon(amenity)}
                                    <span className='text-[#C75D2C] font-medium'>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-6 font-butler'>Where You'll Be</h3>
                        <div className='space-y-6'>
                            <div className='bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20 border border-[#F8B259]/50 rounded-xl p-6'>
                                <div className='flex items-center space-x-3 mb-2'>
                                    <MapPin className='w-5 h-5 text-[#D96F32]' />
                                    <p className='text-[#C75D2C] font-bold text-lg'>
                                        {villa.city}, {villa.country}
                                    </p>
                                </div>
                                <p className='text-[#C75D2C]/70 ml-8'>{villa.address}</p>
                            </div>
                            <div className='overflow-hidden'>
                                <Map address={villa.address} city={villa.city} country={villa.country} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VillaDetails;
