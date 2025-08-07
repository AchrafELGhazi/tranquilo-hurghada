import { useState, useEffect } from 'react';
import { Play, Maximize, Bed, Bath, Users, Wifi, Car, Waves, ChevronLeft, ChevronRight } from 'lucide-react';

const VillaShowcase = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showVideo, setShowVideo] = useState(false);

    const villaImages = [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage(prev => (prev + 1) % villaImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextImage = () => {
        setCurrentImage(prev => (prev + 1) % villaImages.length);
    };

    const prevImage = () => {
        setCurrentImage(prev => (prev - 1 + villaImages.length) % villaImages.length);
    };

    return (
        <section className='relative py-20 px-6 bg-gradient-to-b from-orange-50 to-white overflow-hidden'>
            <div className='max-w-7xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                        Villa Experience
                    </div>
                    <h2 className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'>
                        Luxury
                        <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                            REDEFINED
                        </span>
                    </h2>
                    <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                        Experience unparalleled comfort in our meticulously designed villa, where every detail creates
                        perfection
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                    {/* Image Gallery */}
                    <div className='relative'>
                        <div className='relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/3]'>
                            {/* Main Image Carousel */}
                            <div className='relative h-full'>
                                {villaImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                                            index === currentImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Villa view ${index + 1}`}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                ))}

                                {/* Gradient Overlay */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent'></div>
                            </div>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevImage}
                                className='absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
                            >
                                <ChevronLeft className='w-5 h-5' />
                            </button>
                            <button
                                onClick={nextImage}
                                className='absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
                            >
                                <ChevronRight className='w-5 h-5' />
                            </button>

                            {/* Video Play Button */}
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className='group w-20 h-20 bg-white/20 backdrop-blur-md border-2 border-white/40 rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300'
                                >
                                    <Play className='w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-300' />
                                </button>
                            </div>

                            {/* View Gallery Button */}
                            <button className='absolute top-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-sm font-medium hover:bg-white/30 transition-all duration-300 flex items-center space-x-2'>
                                <Maximize className='w-4 h-4' />
                                <span>View Gallery</span>
                            </button>

                            {/* Image Indicators */}
                            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                                {villaImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                            index === currentImage
                                                ? 'bg-white scale-125'
                                                : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Villa Details */}
                    <div className='space-y-8'>
                        {/* Key Features Grid */}
                        <div className='grid grid-cols-2 gap-4 mb-8'>
                            <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300'>
                                <Bed className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                                <div className='text-2xl font-bold text-orange-900'>4</div>
                                <div className='text-sm text-orange-700'>Bedrooms</div>
                            </div>
                            <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300'>
                                <Bath className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                                <div className='text-2xl font-bold text-orange-900'>3</div>
                                <div className='text-sm text-orange-700'>Bathrooms</div>
                            </div>
                            <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300'>
                                <Users className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                                <div className='text-2xl font-bold text-orange-900'>10</div>
                                <div className='text-sm text-orange-700'>Guests</div>
                            </div>
                            <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center transform hover:scale-105 transition-all duration-300'>
                                <Waves className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                                <div className='text-2xl font-bold text-orange-900'>50m</div>
                                <div className='text-sm text-orange-700'>to Beach</div>
                            </div>
                        </div>

                        {/* Villa Description */}
                        <div className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-3xl p-8'>
                            <h3 className='text-2xl font-bold text-orange-900 mb-4 font-butler'>
                                Exceptional Amenities
                            </h3>
                            <p className='text-orange-700/80 leading-relaxed mb-6'>
                                Immerse yourself in luxury with our thoughtfully curated amenities, from infinity pool
                                overlooking the Red Sea to private beach access and world-class concierge services.
                            </p>

                            {/* Amenities List */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <Wifi className='w-4 h-4 text-orange-600' />
                                    </div>
                                    <span className='text-sm text-orange-700'>High-Speed WiFi</span>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <Car className='w-4 h-4 text-orange-600' />
                                    </div>
                                    <span className='text-sm text-orange-700'>Private Parking</span>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <Waves className='w-4 h-4 text-orange-600' />
                                    </div>
                                    <span className='text-sm text-orange-700'>Infinity Pool</span>
                                </div>
                                <div className='flex items-center space-x-3'>
                                    <div className='w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center'>
                                        <Users className='w-4 h-4 text-orange-600' />
                                    </div>
                                    <span className='text-sm text-orange-700'>Concierge Service</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button className='w-full group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 transition-all duration-500 rounded-2xl font-semibold text-white shadow-xl hover:shadow-2xl transform hover:scale-105'>
                            <span className='relative z-10'>Explore Full Villa Tour</span>
                            <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
                    <div className='relative max-w-4xl w-full aspect-video bg-black rounded-2xl overflow-hidden'>
                        <button
                            onClick={() => setShowVideo(false)}
                            className='absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 z-10'
                        >
                            ✕
                        </button>
                        {/* Video placeholder - replace with actual video */}
                        <div className='w-full h-full bg-gray-900 flex items-center justify-center'>
                            <div className='text-white text-center'>
                                <Play className='w-16 h-16 mx-auto mb-4 opacity-50' />
                                <p className='text-lg opacity-75'>Villa Tour Video</p>
                                <p className='text-sm opacity-50'>Coming Soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default VillaShowcase;
