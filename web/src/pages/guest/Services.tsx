import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Star,
    Clock,
    Users,
    MapPin,
    Calendar,
    CheckCircle,
    ArrowRight,
    Filter,
    Sparkles,
    Award,
    Heart,
    Phone,
    Mail,
} from 'lucide-react';
import { serviceCategories, services, type Service } from '@/data/services';

const Services: React.FC = () => {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filteredServices, setFilteredServices] = useState<Service[]>(services);
    const [scrollY, setScrollY] = useState(0);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredServices(services);
        } else {
            setFilteredServices(services.filter(service => service.category === selectedCategory));
        }
    }, [selectedCategory]);

    const featuredServices = services.filter(service => service.featured);
    const includedServices = services.filter(service => service.category === 'included');

    const getDifficultyColor = (difficulty?: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'text-green-600 bg-green-100';
            case 'Moderate':
                return 'text-yellow-600 bg-yellow-100';
            case 'Challenging':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'included':
                return 'from-emerald-500 to-teal-600';
            case 'adventure':
                return 'from-orange-500 to-red-600';
            case 'wellness':
                return 'from-purple-500 to-pink-600';
            case 'cultural':
                return 'from-amber-500 to-orange-600';
            case 'transport':
                return 'from-blue-500 to-indigo-600';
            case 'custom':
                return 'from-rose-500 to-pink-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className='min-h-screen bg-[#E8DCC6]'>
            {/* Hero Section */}
            <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
                {/* Parallax Background */}
                <div className='absolute inset-0' style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    <img
                        src='/images/services/services-hero.jpg'
                        alt='Tranquilo Services'
                        className='w-full h-full object-cover scale-110'
                        onError={e => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    <div className='absolute inset-0 bg-gradient-to-b from-[#C75D2C]/80 via-[#D96F32]/70 to-[#F8B259]/60'></div>
                    <div className='absolute inset-0 bg-black/40'></div>
                </div>

                {/* Hero Content */}
                <div className='relative z-10 text-center space-y-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto'>
                    <div className='space-y-6'>
                        <div className='inline-block px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white font-medium text-sm tracking-wider uppercase mb-6'>
                            <Sparkles className='w-4 h-4 inline mr-2' />
                            Premium Services
                        </div>
                        <h1 className='text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white font-butler drop-shadow-2xl'>
                            Services
                        </h1>
                        <p className='text-2xl sm:text-3xl lg:text-4xl text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg font-light'>
                            Crafted Experiences for Your Perfect Escape
                        </p>
                    </div>

                    <div className='flex items-center justify-center space-x-6 pt-12'>
                        <div className='w-20 h-0.5 bg-[#F8B259]'></div>
                        <Award className='w-6 h-6 text-[#F8B259]' />
                        <div className='w-32 h-0.5 bg-[#F8B259]'></div>
                        <Heart className='w-6 h-6 text-[#F8B259]' />
                        <div className='w-20 h-0.5 bg-[#F8B259]'></div>
                    </div>

                    <p className='text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed'>
                        From luxury accommodations to thrilling adventures, discover our comprehensive collection of
                        premium services designed to create unforgettable memories in Hurghada.
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
                {/* Welcome & Included Services */}
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        {/* Welcome Message */}
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                Welcome to Paradise
                            </h2>
                            <div className='w-24 h-1 bg-[#F8B259] mx-auto mb-8'></div>
                            <p className='text-xl text-[#C75D2C]/80 max-w-4xl mx-auto leading-relaxed'>
                                Upon arrival, you'll be greeted with a beautifully prepared plate of fresh seasonal
                                fruits and refreshing drinks, setting the tone for your relaxing and indulgent stay.
                            </p>
                        </div>

                        {/* Included Services Grid */}
                        <div className='mb-20'>
                            <h3 className='text-3xl font-bold text-[#C75D2C] font-butler mb-12 text-center'>
                                Everything Included in Your Stay
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {includedServices.map(service => (
                                    <div
                                        key={service.id}
                                        className='bg-white/50 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl p-8 transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group cursor-pointer'
                                        onClick={() => setSelectedService(service)}
                                    >
                                        <div className='aspect-w-16 aspect-h-10 mb-6 overflow-hidden rounded-2xl'>
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700'
                                                onError={e => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/services/placeholder.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between'>
                                                <span className='px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium'>
                                                    Included
                                                </span>
                                                <CheckCircle className='w-5 h-5 text-emerald-600' />
                                            </div>
                                            <h4 className='text-xl font-bold text-[#C75D2C] font-butler group-hover:text-[#D96F32] transition-colors'>
                                                {service.title}
                                            </h4>
                                            <p className='text-[#C75D2C]/80 line-clamp-3'>{service.description}</p>
                                            <div className='flex items-center text-sm text-[#C75D2C]/70'>
                                                <Clock className='w-4 h-4 mr-2' />
                                                {service.duration}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Services */}
                <div className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                Featured Experiences
                            </h2>
                            <div className='w-24 h-1 bg-[#F8B259] mx-auto mb-8'></div>
                            <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                Discover our most popular and exclusive services, carefully curated to provide you with
                                extraordinary experiences.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                            {featuredServices.slice(0, 4).map((service, index) => (
                                <div
                                    key={service.id}
                                    className={`bg-white/60 backdrop-blur-lg border-2 border-[#F8B259]/70 rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-500 group cursor-pointer ${
                                        index === 0 ? 'lg:col-span-2' : ''
                                    }`}
                                    onClick={() => setSelectedService(service)}
                                >
                                    <div className={`grid ${index === 0 ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-0`}>
                                        <div className='aspect-w-16 aspect-h-10 overflow-hidden'>
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className={`w-full ${
                                                    index === 0 ? 'h-80' : 'h-64'
                                                } object-cover transform group-hover:scale-110 transition-transform duration-700`}
                                                onError={e => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/images/services/placeholder.jpg';
                                                }}
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                                            <div className='absolute top-4 left-4'>
                                                <span className='px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold'>
                                                    ⭐ Featured
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            className={`p-8 flex flex-col justify-center ${
                                                index === 0 ? '' : 'space-y-4'
                                            }`}
                                        >
                                            <div className='space-y-4'>
                                                <div className='flex items-center justify-between'>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                                                            service.category
                                                        )} text-white`}
                                                    >
                                                        {service.category.charAt(0).toUpperCase() +
                                                            service.category.slice(1)}
                                                    </span>
                                                    <div className='text-2xl font-bold text-[#D96F32]'>
                                                        {service.price}
                                                    </div>
                                                </div>
                                                <h3
                                                    className={`${
                                                        index === 0 ? 'text-3xl' : 'text-2xl'
                                                    } font-bold text-[#C75D2C] font-butler group-hover:text-[#D96F32] transition-colors`}
                                                >
                                                    {service.title}
                                                </h3>
                                                <p className='text-[#C75D2C]/80 leading-relaxed'>
                                                    {service.description}
                                                </p>
                                                <div className='flex items-center space-x-6 text-sm text-[#C75D2C]/70'>
                                                    <div className='flex items-center'>
                                                        <Clock className='w-4 h-4 mr-2' />
                                                        {service.duration}
                                                    </div>
                                                    {service.groupSize && (
                                                        <div className='flex items-center'>
                                                            <Users className='w-4 h-4 mr-2' />
                                                            {service.groupSize}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className='flex flex-wrap gap-2'>
                                                    {service.highlights.slice(0, 3).map((highlight, idx) => (
                                                        <span
                                                            key={idx}
                                                            className='px-3 py-1 bg-[#F8B259]/20 text-[#C75D2C] rounded-full text-sm'
                                                        >
                                                            {highlight}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* All Services with Filter */}
                <div className='py-20 px-4 sm:px-6 lg:px-8'>
                    <div className='max-w-7xl mx-auto'>
                        <div className='text-center mb-16'>
                            <h2 className='text-4xl sm:text-5xl font-bold text-[#C75D2C] font-butler mb-6'>
                                Complete Service Collection
                            </h2>
                            <div className='w-24 h-1 bg-[#F8B259] mx-auto mb-8'></div>
                            <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                Browse our comprehensive range of services, from essential amenities to extraordinary
                                adventures.
                            </p>
                        </div>

                        {/* Category Filter */}
                        <div className='flex flex-wrap justify-center gap-4 mb-12'>
                            {serviceCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                                        selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white shadow-lg'
                                            : 'bg-white/60 backdrop-blur-md border border-[#F8B259]/50 text-[#C75D2C] hover:bg-white/80'
                                    }`}
                                >
                                    <span className='mr-2'>{category.icon}</span>
                                    {category.name}
                                </button>
                            ))}
                        </div>

                        {/* Services Grid */}
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {filteredServices.map(service => (
                                <div
                                    key={service.id}
                                    className='bg-white/50 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-3xl overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 group cursor-pointer'
                                    onClick={() => setSelectedService(service)}
                                >
                                    <div className='aspect-w-16 aspect-h-10 overflow-hidden relative'>
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className='w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700'
                                            onError={e => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/services/placeholder.jpg';
                                            }}
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent'></div>
                                        <div className='absolute top-4 left-4'>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                                                    service.category
                                                )} text-white`}
                                            >
                                                {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                                            </span>
                                        </div>
                                        {service.featured && (
                                            <div className='absolute top-4 right-4'>
                                                <Star className='w-6 h-6 text-yellow-400 fill-current' />
                                            </div>
                                        )}
                                    </div>

                                    <div className='p-6 space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <h3 className='text-xl font-bold text-[#C75D2C] font-butler group-hover:text-[#D96F32] transition-colors'>
                                                {service.title}
                                            </h3>
                                            <div className='text-xl font-bold text-[#D96F32]'>{service.price}</div>
                                        </div>

                                        <p className='text-[#C75D2C]/80 line-clamp-2'>{service.description}</p>

                                        <div className='flex items-center justify-between text-sm text-[#C75D2C]/70'>
                                            <div className='flex items-center'>
                                                <Clock className='w-4 h-4 mr-2' />
                                                {service.duration}
                                            </div>
                                            {service.groupSize && (
                                                <div className='flex items-center'>
                                                    <Users className='w-4 h-4 mr-2' />
                                                    {service.groupSize}
                                                </div>
                                            )}
                                        </div>

                                        {service.difficulty && (
                                            <div className='flex items-center justify-between'>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                                        service.difficulty
                                                    )}`}
                                                >
                                                    {service.difficulty}
                                                </span>
                                                <button className='text-[#D96F32] hover:text-[#C75D2C] transition-colors'>
                                                    <ArrowRight className='w-5 h-5' />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#D96F32]/20 to-[#F8B259]/20'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='bg-white/60 backdrop-blur-lg border-2 border-[#F8B259]/70 rounded-3xl p-12'>
                            <div className='text-center space-y-8'>
                                <h2 className='text-4xl font-bold text-[#C75D2C] font-butler'>
                                    Ready to Create Your Perfect Experience?
                                </h2>
                                <p className='text-xl text-[#C75D2C]/80 max-w-3xl mx-auto'>
                                    Our concierge team is standing by to help you customize your stay and book any of
                                    our premium services.
                                </p>

                                <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                                    <button className='group relative px-8 py-4 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'>
                                        <span className='relative z-10 flex items-center space-x-3'>
                                            <Phone className='w-5 h-5' />
                                            <span>Call Concierge</span>
                                        </span>
                                        <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    </button>

                                    <button className='group px-8 py-4 backdrop-blur-md bg-white/20 border-2 border-[#F8B259]/50 text-[#C75D2C] hover:bg-white/40 hover:border-[#F8B259] transition-all duration-300 rounded-2xl font-semibold transform hover:-translate-y-0.5'>
                                        <span className='flex items-center space-x-3'>
                                            <Mail className='w-5 h-5' />
                                            <span>Send Message</span>
                                        </span>
                                    </button>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Calendar className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>24/7 Availability</h3>
                                        <p className='text-[#C75D2C]/80'>
                                            Our concierge team is always ready to assist
                                        </p>
                                    </div>

                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <CheckCircle className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>Instant Confirmation</h3>
                                        <p className='text-[#C75D2C]/80'>Quick booking and immediate confirmations</p>
                                    </div>

                                    <div className='text-center'>
                                        <div className='w-16 h-16 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center mx-auto mb-4'>
                                            <Heart className='w-8 h-8 text-white' />
                                        </div>
                                        <h3 className='text-lg font-bold text-[#C75D2C] mb-2'>Personalized Care</h3>
                                        <p className='text-[#C75D2C]/80'>Tailored experiences just for you</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className='fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto'>
                        <div className='relative'>
                            <img
                                src={selectedService.image}
                                alt={selectedService.title}
                                className='w-full h-80 object-cover rounded-t-3xl'
                                onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/services/placeholder.jpg';
                                }}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-3xl'></div>
                            <button
                                onClick={() => setSelectedService(null)}
                                className='absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
                            >
                                ✕
                            </button>
                            <div className='absolute bottom-4 left-6 text-white'>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                                        selectedService.category
                                    )} mb-2 inline-block`}
                                >
                                    {selectedService.category.charAt(0).toUpperCase() +
                                        selectedService.category.slice(1)}
                                </span>
                                <h2 className='text-3xl font-bold font-butler'>{selectedService.title}</h2>
                            </div>
                        </div>

                        <div className='p-8 space-y-6'>
                            <div className='flex items-center justify-between'>
                                <div className='text-3xl font-bold text-[#D96F32]'>{selectedService.price}</div>
                                <div className='flex items-center space-x-4'>
                                    <div className='flex items-center text-[#C75D2C]/70'>
                                        <Clock className='w-5 h-5 mr-2' />
                                        {selectedService.duration}
                                    </div>
                                    {selectedService.groupSize && (
                                        <div className='flex items-center text-[#C75D2C]/70'>
                                            <Users className='w-5 h-5 mr-2' />
                                            {selectedService.groupSize}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className='text-[#C75D2C]/80 text-lg leading-relaxed'>
                                {selectedService.longDescription}
                            </p>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                                <div>
                                    <h3 className='text-xl font-bold text-[#C75D2C] mb-4'>Highlights</h3>
                                    <ul className='space-y-2'>
                                        {selectedService.highlights.map((highlight, index) => (
                                            <li key={index} className='flex items-center text-[#C75D2C]/80'>
                                                <CheckCircle className='w-5 h-5 text-green-600 mr-3 flex-shrink-0' />
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className='text-xl font-bold text-[#C75D2C] mb-4'>What's Included</h3>
                                    <ul className='space-y-2'>
                                        {selectedService.included.map((item, index) => (
                                            <li key={index} className='flex items-center text-[#C75D2C]/80'>
                                                <CheckCircle className='w-5 h-5 text-green-600 mr-3 flex-shrink-0' />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {selectedService.difficulty && (
                                <div className='flex items-center space-x-4'>
                                    <span className='text-[#C75D2C] font-medium'>Difficulty Level:</span>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                                            selectedService.difficulty
                                        )}`}
                                    >
                                        {selectedService.difficulty}
                                    </span>
                                </div>
                            )}

                            <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                                <button className='flex-1 group relative px-8 py-4 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white font-semibold rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'>
                                    <span className='relative z-10'>Book This Service</span>
                                    <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                </button>

                                <button className='px-8 py-4 backdrop-blur-md bg-gray-100 border-2 border-gray-200 text-[#C75D2C] hover:bg-gray-200 transition-all duration-300 rounded-2xl font-semibold'>
                                    Ask Questions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
