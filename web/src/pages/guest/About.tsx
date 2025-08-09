import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Home, Waves, Sun, Users, Award, MapPin, Calendar } from 'lucide-react';

export const About: React.FC = () => {
    const { t } = useTranslation();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className='min-h-screen bg-[#E8DCC6]'>
            {/* Hero Section with Parallax Background */}
            <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
                {/* Parallax Background */}
                <div className='absolute inset-0' style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    <img
                        src='/images/villa-about-hero.jpg'
                        alt='Tranquilo Hurghada Villa'
                        className='w-full h-full object-cover scale-110'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    {/* Dynamic Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-b from-[#C75D2C]/80 via-[#D96F32]/70 to-[#F8B259]/60'></div>
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>

                {/* Hero Content */}
                <div className='relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto'>
                    <div className='space-y-6'>
                        <h1 className='text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white font-butler drop-shadow-2xl'>
                            {t('about.hero.title')}
                        </h1>
                        <p className='text-2xl sm:text-3xl lg:text-4xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg font-light'>
                            {t('about.hero.subtitle')}
                        </p>
                    </div>

                    {/* Elegant Separator */}
                    <div className='flex items-center justify-center space-x-6 pt-12'>
                        <div className='w-20 h-0.5 bg-[#F8B259]'></div>
                        <Waves className='w-6 h-6 text-[#F8B259]' />
                        <div className='w-32 h-0.5 bg-[#F8B259]'></div>
                        <Sun className='w-6 h-6 text-[#F8B259]' />
                        <div className='w-20 h-0.5 bg-[#F8B259]'></div>
                    </div>

                    <p className='text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed'>
                        {t('about.hero.description')}
                    </p>
                </div>

                {/* Floating Elements */}
                <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                    <div className='absolute top-1/4 left-1/6 w-3 h-3 bg-[#F8B259]/40 rounded-full animate-pulse'></div>
                    <div className='absolute top-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-1000'></div>
                    <div className='absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-[#F8B259]/30 rounded-full animate-pulse delay-2000'></div>
                </div>
            </div>
            {/* Main Content */}
            <div className='bg-[#E8DCC6] relative z-10 -mt-1'>
                {/* Our Story Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                {t('about.story.title')}
                            </h2>
                            <div className='w-24 h-1 bg-[#F8B259] mx-auto'></div>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
                            <div className='space-y-8'>
                                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8'>
                                    <Heart className='w-12 h-12 text-[#D96F32] mb-6' />
                                    <h3 className='text-2xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                        {t('about.story.passion.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 leading-relaxed'>
                                        {t('about.story.passion.description')}
                                    </p>
                                </div>

                                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8'>
                                    <Home className='w-12 h-12 text-[#D96F32] mb-6' />
                                    <h3 className='text-2xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                        {t('about.story.vision.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 leading-relaxed'>
                                        {t('about.story.vision.description')}
                                    </p>
                                </div>
                            </div>

                            <div className='relative'>
                                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8 transform hover:scale-105 transition-transform duration-500'>
                                    <img
                                        src='/images/villa-story.jpg'
                                        alt='Villa Story'
                                        className='w-full h-80 object-cover rounded-2xl mb-6'
                                        onError={e => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                    <h3 className='text-2xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                        {t('about.story.dream.title')}
                                    </h3>
                                    <p className='text-[#C75D2C]/80 leading-relaxed'>
                                        {t('about.story.dream.description')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                {t('about.features.title')}
                            </h2>
                            <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                {t('about.features.subtitle')}
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {/* Feature Card 1 */}
                            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                                    <Users className='w-8 h-8 text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                    {t('about.features.capacity.title')}
                                </h3>
                                <p className='text-[#C75D2C]/80'>{t('about.features.capacity.description')}</p>
                            </div>

                            {/* Feature Card 2 */}
                            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                                    <Award className='w-8 h-8 text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                    {t('about.features.luxury.title')}
                                </h3>
                                <p className='text-[#C75D2C]/80'>{t('about.features.luxury.description')}</p>
                            </div>

                            {/* Feature Card 3 */}
                            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8 text-center transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group'>
                                <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300'>
                                    <MapPin className='w-8 h-8 text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-[#C75D2C] mb-4 font-butler'>
                                    {t('about.features.location.title')}
                                </h3>
                                <p className='text-[#C75D2C]/80'>{t('about.features.location.description')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Meet the Owner Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='bg-white/50 backdrop-blur-lg border-2 border-[#F8B259]/70 rounded-3xl p-12'>
                            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                                <div className='text-center lg:text-left space-y-6'>
                                    <h2 className='text-4xl font-bold text-[#C75D2C] font-butler'>
                                        {t('about.owner.title')}
                                    </h2>
                                    <p className='text-lg text-[#C75D2C]/80 leading-relaxed'>
                                        {t('about.owner.description')}
                                    </p>
                                    <div className='flex items-center justify-center lg:justify-start space-x-4'>
                                        <div className='w-12 h-0.5 bg-[#F8B259]'></div>
                                        <span className='text-[#D96F32] font-semibold'>{t('about.owner.name')}</span>
                                        <div className='w-12 h-0.5 bg-[#F8B259]'></div>
                                    </div>
                                </div>

                                <div className='relative'>
                                    <div className='relative overflow-hidden rounded-2xl'>
                                        <img
                                            src='/images/owner-photo.jpg'
                                            alt='Villa Owner'
                                            className='w-full h-96 object-cover transform hover:scale-110 transition-transform duration-700'
                                            onError={e => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-[#C75D2C]/30 to-transparent'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Built with Love Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto text-center'>
                        <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-8'>
                            {t('about.built.title')}
                        </h2>
                        <p className='text-xl text-[#C75D2C]/80 max-w-4xl mx-auto mb-16 leading-relaxed'>
                            {t('about.built.description')}
                        </p>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
                            <div className='text-center'>
                                <div className='text-5xl font-bold text-[#D96F32] mb-2'>2025</div>
                                <p className='text-[#C75D2C]/80'>{t('about.built.year')}</p>
                            </div>
                            <div className='text-center'>
                                <div className='text-5xl font-bold text-[#D96F32] mb-2'>1</div>
                                <p className='text-[#C75D2C]/80'>{t('about.built.villa')}</p>
                            </div>
                            <div className='text-center'>
                                <div className='text-5xl font-bold text-[#D96F32] mb-2'>∞</div>
                                <p className='text-[#C75D2C]/80'>{t('about.built.memories')}</p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className='bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-3xl p-12 text-center'>
                            <h3 className='text-3xl font-bold text-white mb-6 font-butler'>{t('about.cta.title')}</h3>
                            <p className='text-white/90 text-lg mb-8 max-w-2xl mx-auto'>{t('about.cta.subtitle')}</p>
                            <button className='bg-white text-[#D96F32] font-bold py-4 px-12 rounded-xl hover:bg-white/90 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto text-lg'>
                                <Calendar className='w-6 h-6' />
                                <span>{t('about.cta.button')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
