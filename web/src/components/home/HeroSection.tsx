import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Hero Component with sliding background
const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Placeholder images - replace with actual hotel images
    const heroImages = [
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className='relative h-screen overflow-hidden bg-white  '>
            {/* Sliding Background Images */}
            <div className='absolute inset-0'>
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img
                            src={image}
                            alt={`Tranquilo Hurghada ${index + 1}`}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50'></div>
                    </div>
                ))}
            </div>

            {/* Hero Content */}
            <div className='relative z-10 flex items-center justify-center h-full px-4'>
                <div className='text-center max-w-4xl mx-auto'>
                    <div className='mb-8 animate-fade-in-up'>
                        <h1 className='font-butler-900 text-6xl md:text-8xl text-cream mb-6 leading-tight'>
                            Tranquilo
                            <span className='block text-golden-yellow font-butler-700 text-4xl md:text-5xl mt-2'>
                                Hurghada
                            </span>
                        </h1>
                        <p className='font-roboto-400 text-xl md:text-2xl text-cream-90 max-w-2xl mx-auto leading-relaxed'>
                            Experience pure luxury where the Red Sea meets desert elegance. Your paradise awaits.
                        </p>
                    </div>

                    <div className='space-y-6 animate-fade-in-up-delay'>
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <button className='group px-8 py-4 bg-terracotta hover:bg-burnt-orange transition-all duration-300 rounded-full font-roboto-500 text-cream text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1'>
                                Book Your Stay
                                <span className='inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1'>
                                    →
                                </span>
                            </button>
                            <button className='px-8 py-4 border-2 border-cream text-cream hover:bg-cream hover:text-burnt-orange transition-all duration-300 rounded-full font-roboto-500 text-lg'>
                                Explore Rooms
                            </button>
                        </div>

                        {/* Scroll Indicator */}
                        <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
                            <ChevronDown className='w-8 h-8 text-golden-yellow' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20'>
                {heroImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === currentSlide ? 'bg-golden-yellow scale-125' : 'bg-cream-50 hover:bg-cream-70'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
};
export default HeroSection;
