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
    Home,
    Calendar,
    User,
    Mail,
    Phone,
    Crown,
    CheckCircle,
    XCircle,
    Wrench,
    Award,
} from 'lucide-react';
import Map from './Map';
import type { Villa } from '@/utils/types';

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

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return <CheckCircle className='w-5 h-5 text-green-600' />;
            case 'UNAVAILABLE':
                return <XCircle className='w-5 h-5 text-red-600' />;
            case 'MAINTENANCE':
                return <Wrench className='w-5 h-5 text-yellow-600' />;
            default:
                return <Home className='w-5 h-5 text-[#D96F32]' />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AVAILABLE':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'UNAVAILABLE':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'MAINTENANCE':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getServiceCategoryColor = (category: string) => {
        const colorMap: Record<string, string> = {
            INCLUDED: 'bg-green-100 text-green-800 border-green-200',
            ADVENTURE: 'bg-orange-100 text-orange-800 border-orange-200',
            WELLNESS: 'bg-purple-100 text-purple-800 border-purple-200',
            CULTURAL: 'bg-blue-100 text-blue-800 border-blue-200',
            TRANSPORT: 'bg-gray-100 text-gray-800 border-gray-200',
            CUSTOM: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        };
        return colorMap[category] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return (
        <div className='space-y-8'>
            {/* Header */}
            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                <div className='flex items-start justify-between mb-4'>
                    <div className='flex-1'>
                        <h1 className='text-3xl md:text-4xl font-bold text-[#C75D2C] mb-4 font-butler'>
                            {villa.title}
                        </h1>
                        <div className='flex flex-wrap items-center gap-6 text-[#C75D2C]/80'>
                            <div className='flex items-center space-x-2'>
                                <div className='flex items-center'>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className='w-4 h-4 fill-current text-[#F8B259]' />
                                    ))}
                                </div>
                                <span className='font-semibold text-[#C75D2C]'>5.0</span>
                            </div>
                            <div className='flex items-center space-x-2 text-[#C75D2C]/70'>
                                <MapPin className='w-4 h-4' />
                                <span>
                                    {villa.city}, {villa.country}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-end space-y-2'>
                        <div
                            className={`px-3 py-1 rounded-full border ${getStatusColor(
                                villa.status
                            )} flex items-center space-x-2`}
                        >
                            {getStatusIcon(villa.status)}
                            <span className='text-sm font-medium capitalize'>{villa.status.toLowerCase()}</span>
                        </div>
                       
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
                                <div className='text-sm text-[#C75D2C]/70'>Max Guests</div>
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

                        {/* Additional Villa Stats */}
                        <div className='mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-[#F8B259]/10 to-[#D96F32]/10 rounded-xl border border-[#F8B259]/30'>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-[#D96F32]'>{villa.pricePerNight}</div>
                                <div className='text-sm text-[#C75D2C]/70'>EUR per night</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-[#D96F32]'>{villa.services?.length || 0}</div>
                                <div className='text-sm text-[#C75D2C]/70'>Services</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-[#D96F32]'>{villa.bookings?.length || 0}</div>
                                <div className='text-sm text-[#C75D2C]/70'>Bookings</div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-4 font-butler'>About This Paradise</h3>
                        <p className='text-[#C75D2C]/80 leading-relaxed text-lg'>
                            {villa.description || 'Experience luxury and comfort in this beautiful villa.'}
                        </p>

                        {/* Decorative divider */}
                        <div className='flex items-center justify-center space-x-4 mt-6'>
                            <div className='w-12 h-0.5 bg-[#F8B259]/60'></div>
                            <div className='w-2 h-2 bg-[#F8B259] rounded-full'></div>
                            <div className='w-16 h-0.5 bg-[#F8B259]/60'></div>
                            <div className='w-2 h-2 bg-[#F8B259] rounded-full'></div>
                            <div className='w-12 h-0.5 bg-[#F8B259]/60'></div>
                        </div>
                    </div>

                    {/* Address Details */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-6 font-butler'>Address & Location</h3>
                        <div className='space-y-4'>
                            <div className='bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20 border border-[#F8B259]/50 rounded-xl p-6'>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <div className='flex items-center space-x-3 mb-3'>
                                            <MapPin className='w-5 h-5 text-[#D96F32]' />
                                            <p className='text-[#C75D2C] font-bold text-lg'>Full Address</p>
                                        </div>
                                        <div className='ml-8 space-y-1'>
                                            <p className='text-[#C75D2C] font-medium'>{villa.address}</p>
                                            <p className='text-[#C75D2C]/80'>
                                                {villa.city}, {villa.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='flex items-center space-x-3 mb-3'>
                                            <Home className='w-5 h-5 text-[#D96F32]' />
                                            <p className='text-[#C75D2C] font-bold text-lg'>Location Details</p>
                                        </div>
                                        <div className='ml-8 space-y-1'>
                                            <p className='text-[#C75D2C]/80'>
                                                City: <span className='font-medium text-[#C75D2C]'>{villa.city}</span>
                                            </p>
                                            <p className='text-[#C75D2C]/80'>
                                                Country:{' '}
                                                <span className='font-medium text-[#C75D2C]'>{villa.country}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                        <h3 className='text-xl font-bold text-[#C75D2C] mb-6 font-butler'>What This Place Offers</h3>
                        {villa.amenities && villa.amenities.length > 0 ? (
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
                        ) : (
                            <div className='text-center py-8 text-[#C75D2C]/60'>
                                <Home className='w-12 h-12 mx-auto mb-4 text-[#F8B259]' />
                                <p>No amenities listed for this villa.</p>
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    {villa.services && villa.services.length > 0 && (
                        <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6 sm:p-8'>
                            <h3 className='text-xl font-bold text-[#C75D2C] mb-6 font-butler'>Available Services</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                {villa.services.map(service => (
                                    <div
                                        key={service.id}
                                        className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4 hover:bg-white/50 transition-all duration-300'
                                    >
                                        <div className='flex items-start justify-between mb-3'>
                                            <div className='flex-1'>
                                                <div className='flex items-center space-x-2 mb-2'>
                                                    <h4 className='font-bold text-[#C75D2C]'>{service.title}</h4>
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getServiceCategoryColor(
                                                            service.category
                                                        )}`}
                                                    >
                                                        {service.category}
                                                    </span>
                                                    {/* {service.isFeatured && <Award className='w-4 h-4 text-[#F8B259]' />} */}
                                                </div>
                                                <p className='text-[#C75D2C]/80 text-sm mb-2'>{service.description}</p>
                                                {service.longDescription && (
                                                    <p className='text-[#C75D2C]/60 text-xs mb-3'>
                                                        {service.longDescription}
                                                    </p>
                                                )}
                                            </div>
                                        
                                        </div>

                                        {service.image && (
                                            <div className='mb-3'>
                                                <img
                                                    src={service.image}
                                                    alt={service.title}
                                                    className='w-full h-32 object-cover rounded-lg'
                                                    onError={e => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Map */}
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
                            <div className='overflow-hidden rounded-xl'>
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
