import { useState, useEffect } from 'react';
import { Award, Calendar, ChevronDown, MapPin, Users, Star } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';
import FloatingBadge from '../common/FloatingBadge';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const heroImages = [
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ];

    const typewriterTexts = [
        'Where luxury meets the Red Sea',
        'Your desert oasis awaits',
        'Experience Egyptian hospitality',
        'Paradise found in Hurghada',
    ];

    const { text: typewriterText, cursor } = useTypewriter(typewriterTexts, {
        speed: 80,
        deleteSpeed: 40,
        delayBetweenTexts: 3000,
        loop: true,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroImages.length);
        }, 6000);

        const loadTimer = setTimeout(() => setIsLoaded(true), 500);

        return () => {
            clearInterval(timer);
            clearTimeout(loadTimer);
        };
    }, []);

    return (
        <section
            className='relative h-screen overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200'
            style={{ height: 'calc(100vh - 80px)' }}
        >
            {/* Dynamic Background with Parallax Effect */}
            <div className='absolute inset-0'>
                {heroImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
                            index === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}
                    >
                        <img
                            src={image}
                            alt={`Tranquilo Hurghada Experience ${index + 1}`}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50'></div>
                        <div className='absolute inset-0 bg-gradient-to-t from-purple-900/20 via-pink-500/10 to-amber-400/10'></div>
                    </div>
                ))}
            </div>

            {/* Top Left */}
            <FloatingBadge
                delay={0}
                className={`hidden md:block absolute top-10 left-6 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-xl px-3 py-1.5 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out`}
            >
                <div className='flex items-center space-x-1.5'>
                    <Award className='w-4 h-4 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-xs'>5-Star Luxury</span>
                </div>
            </FloatingBadge>

            {/* Top Right */}
            <FloatingBadge
                delay={500}
                className={`hidden md:block absolute top-10 right-6 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-xl px-3 py-1.5 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out delay-500`}
            >
                <div className='flex items-center space-x-1.5'>
                    <MapPin className='w-4 h-4 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-xs'>Red Sea Coast</span>
                </div>
            </FloatingBadge>

            {/* Bottom Left */}
            <FloatingBadge
                delay={1000}
                className={`hidden md:block absolute bottom-10 left-6 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-xl px-3 py-1.5 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out delay-1000`}
            >
                <div className='flex items-center space-x-1.5'>
                    <Users className='w-4 h-4 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-xs'>Exclusive Resort</span>
                </div>
            </FloatingBadge>

            {/* Bottom Right */}
            <FloatingBadge
                delay={1500}
                className={`hidden md:block absolute bottom-10 right-6 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-xl px-3 py-1.5 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out delay-[1500ms]`}
            >
                <div className='flex items-center space-x-1.5'>
                    <Star className='w-4 h-4 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-xs'>Premium Service</span>
                </div>
            </FloatingBadge>

            {/* Main Content */}
            <div className='relative z-10 flex items-center justify-center h-full px-6'>
                <div className='text-center max-w-4xl mx-auto'>
                    {/* Pre-title */}
                    <div
                        className={`mb-4 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } transition-all duration-800 ease-out delay-300`}
                    >
                        <span className='inline-block px-3 py-1.5 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-full text-yellow-400 font-medium text-sm tracking-wider uppercase'>
                            Welcome to Paradise
                        </span>
                    </div>

                    {/* Main Title with Better Typography */}
                    <div
                        className={`mb-6 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } transition-all duration-800 ease-out delay-500`}
                    >
                        <h1 className='font-butler text-6xl md:text-7xl lg:text-9xl text-orange-50 mb-2 leading-none font-light tracking-tight'>
                            Tranquilo
                            <span className='block text-yellow-400 font-bold text-3xl md:text-4xl lg:text-5xl mt-1 font-sans tracking-wide'>
                                HURGHADA
                            </span>
                        </h1>
                    </div>

                    {/* Typewriter Subtitle with Better Font */}
                    <div
                        className={`mb-6 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } transition-all duration-800 ease-out delay-700`}
                    >
                        <div className='h-12 flex items-center justify-center'>
                            <p className='font-mono text-xl md:text-2xl text-orange-50/90 leading-relaxed tracking-wide'>
                                {typewriterText}
                                <span className='text-yellow-400 ml-1 animate-pulse'>{cursor}</span>
                            </p>
                        </div>
                    </div>

                    {/* Concise Description */}
                    <div
                        className={`mb-8 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } transition-all duration-800 ease-out delay-900`}
                    >
                        <p className='font-light text-base md:text-lg text-orange-50/80 max-w-3xl mx-auto leading-relaxed'>
                            Where ancient Egyptian mystique meets contemporary luxury along the crystal-clear Red Sea
                            coast.
                        </p>
                    </div>

                    {/* Compact Action Buttons */}
                    <div
                        className={`space-y-6 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                        } transition-all duration-800 ease-out delay-1100`}
                    >
                        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                            <button className='group relative px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 transition-all duration-500 rounded-full font-semibold text-orange-50 text-base shadow-xl hover:shadow-2xl transform hover:scale-105'>
                                <span className='relative z-10'>Reserve Your Suite</span>
                                <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <span className='inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1'>
                                    →
                                </span>
                            </button>

                            <button className='group px-6 py-3 backdrop-blur-md bg-orange-50/10 border-2 border-orange-50/30 text-orange-50 hover:bg-orange-50/20 hover:border-orange-50/50 transition-all duration-500 rounded-full font-medium text-base transform hover:-translate-y-0.5'>
                                View Services
                                <Calendar className='inline-block ml-2 w-4 h-4 transition-transform duration-300 group-hover:rotate-12' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Scroll Indicator */}
            <div
                className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } transition-all duration-800 ease-out delay-[1300ms]`}
            >
                <div className='flex flex-col items-center space-y-1'>
                    <span className='text-orange-50/70 font-light text-xs tracking-wider uppercase'>Discover More</span>
                    <ChevronDown className='w-5 h-5 text-yellow-400 animate-pulse' />
                </div>
            </div>

            {/* Subtle Ambient Light Effect */}
            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gradient-radial from-yellow-400/15 via-transparent to-transparent rounded-full blur-3xl opacity-40 animate-pulse'></div>
        </section>
    );
};

export default HeroSection;
