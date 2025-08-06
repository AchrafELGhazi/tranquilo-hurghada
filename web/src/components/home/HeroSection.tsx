import { useState, useEffect } from 'react';
import { Award, Calendar, ChevronDown, MapPin, Star, Users } from 'lucide-react';
import { useTypewriter } from '@/hooks/useTypewriter';
import FloatingBadge from '../common/FloatingBadge';


const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const heroImages = [
        // 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
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
        <section className='relative pt-10 min-h-screen overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200'>
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
                        <div className='absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-orange-400/10'></div>
                    </div>
                ))}
            </div>

            {/* Floating Elements & Tags */}
            <FloatingBadge
                delay={0}
                className={`absolute top-20 left-8 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-2xl px-4 py-2 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out`}
            >
                <div className='flex items-center space-x-2'>
                    <Award className='w-5 h-5 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-sm'>5-Star Luxury</span>
                </div>
            </FloatingBadge>

            <FloatingBadge
                delay={1000}
                className={`absolute top-32 right-8 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-2xl px-4 py-2 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out delay-1000`}
            >
                <div className='flex items-center space-x-2'>
                    <MapPin className='w-5 h-5 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-sm'>Red Sea Coast</span>
                </div>
            </FloatingBadge>

            <FloatingBadge
                delay={2000}
                className={`absolute bottom-40 left-8 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-2xl px-4 py-2 z-20 ${
                    isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-24 opacity-0'
                } transition-all duration-1000 ease-out delay-[2000ms]`}
            >
                <div className='flex items-center space-x-2'>
                    <Users className='w-5 h-5 text-yellow-400' />
                    <span className='text-orange-50 font-medium text-sm'>Exclusive Experience</span>
                </div>
            </FloatingBadge>

            {/* Rating Badge */}
            <div
                className={`absolute top-8 left-1/2 transform -translate-x-1/2 z-30 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                } transition-all duration-800 ease-out`}
            >
                <div className='backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-full px-6 py-3 flex items-center space-x-3'>
                    <div className='flex items-center space-x-1'>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                        ))}
                    </div>
                    <div className='h-4 w-px bg-orange-50/30'></div>
                    <span className='text-orange-50 font-medium text-sm'>4.9/5 • 1,247 Reviews</span>
                </div>
            </div>

            {/* Main Hero Content */}
            <div className='relative  z-10 flex items-center justify-center h-full px-4'>
                <div className='text-center max-w-5xl mx-auto'>
                    {/* Pre-title */}
                    <div
                        className={`mb-6 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                        } transition-all duration-800 ease-out delay-300`}
                    >
                        <span className='inline-block px-3 py-1 backdrop-blur-md bg-orange-50/10 border border-orange-50/20 rounded-full text-yellow-400 font-medium text-xs tracking-widest uppercase'>
                            Welcome to Paradise
                        </span>
                    </div>

                    {/* Main Title */}
                    <div
                        className={`mb-8 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                        } transition-all duration-800 ease-out delay-500`}
                    >
                        <h1 className='font-butler-900 text-5xl md:text-8xl lg:text-9xl text-orange-50 mb-4 leading-none'>
                            Tranquilo
                            <span className='block text-yellow-400 font-bold text-4xl md:text-6xl lg:text-7xl mt-2'>
                                Hurghada
                            </span>
                        </h1>
                    </div>

                    {/* Typewriter Subtitle */}
                    <div
                        className={`mb-8 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                        } transition-all duration-800 ease-out delay-700`}
                    >
                        <div className='h-16 flex items-center justify-center'>
                            <p className='font-normal text-2xl md:text-3xl text-orange-50/90 leading-relaxed'>
                                {typewriterText}
                                <span className='text-yellow-400 ml-1 font-thin animate-pulse'>{cursor}</span>
                            </p>
                        </div>
                    </div>

                    {/* Story Elements */}
                    <div
                        className={`mb-12 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                        } transition-all duration-800 ease-out delay-900`}
                    >
                        <p className='font-normal text-lg md:text-xl text-orange-50/80 max-w-3xl mx-auto leading-relaxed'>
                            Where ancient Egyptian mystique meets contemporary luxury. Nestled between golden desert
                            dunes and the crystal-clear waters of the Red Sea, your extraordinary escape awaits.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div
                        className={`space-y-8 ${
                            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                        } transition-all duration-800 ease-out delay-1100`}
                    >
                        <div className='flex flex-col sm:flex-row gap-6 justify-center'>
                            <button className='group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-600 transition-all duration-500 rounded-full font-semibold text-orange-50 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 animate-pulse'>
                                <span className='relative z-10'>Reserve Your Suite</span>
                                <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <span className='inline-block ml-3 transition-transform duration-300 group-hover:translate-x-2'>
                                    →
                                </span>
                            </button>

                            <button className='group px-8 py-4 backdrop-blur-md bg-orange-50/10 border-2 border-orange-50/30 text-orange-50 hover:bg-orange-50/10 hover:border-orange-50/50 transition-all duration-500 rounded-full font-medium text-lg transform hover:-translate-y-1'>
                                Virtual Tour
                                <Calendar className='inline-block ml-3 w-5 h-5 transition-transform duration-300 group-hover:rotate-12' />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className='flex flex-wrap justify-center gap-8 mt-12'>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-yellow-400'>150+</div>
                                <div className='text-orange-50/70 font-normal text-sm'>Luxury Suites</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-yellow-400'>24/7</div>
                                <div className='text-orange-50/70 font-normal text-sm'>Concierge Service</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-3xl md:text-4xl font-bold text-yellow-400'>5★</div>
                                <div className='text-orange-50/70 font-normal text-sm'>Guest Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Scroll Indicator */}
            <div
                className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                } transition-all duration-800 ease-out delay-[1300ms]`}
            >
                <div className='flex flex-col items-center space-y-2'>
                    <span className='text-orange-50/70 font-normal text-xs tracking-widest uppercase'>
                        Discover More
                    </span>
                    <ChevronDown className='w-6 h-6 text-yellow-400 animate-pulse' />
                </div>
            </div>

            {/* Ambient Light Effect */}
            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/20 via-transparent to-transparent rounded-full blur-3xl opacity-30 animate-pulse'></div>
        </section>
    );
};

export default HeroSection;
