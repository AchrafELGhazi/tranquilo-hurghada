import { useState } from 'react';
import { ChefHat, Car, Plane, Camera, Waves, Sparkles, Clock, Star, Check, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const ServicesSection = () => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const { lang } = useParams();

    const services = [
        {
            id: 'chef',
            icon: ChefHat,
            title: 'Private Chef Service',
            description: 'Gourmet meals prepared by professional chefs in your villa',
            features: [
                'Personalized menu planning',
                'Local & international cuisine',
                'Special dietary requirements',
                'Market shopping included',
                'Professional presentation',
            ],
            price: 'From €80/meal',
            image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: true,
        },
        {
            id: 'transport',
            icon: Car,
            title: 'Private Transportation',
            description: 'Luxury vehicle transfers and guided tours throughout Hurghada',
            features: [
                'Airport transfers',
                'City tours with guide',
                'Desert safari trips',
                'Shopping excursions',
                'Air-conditioned vehicles',
            ],
            price: 'From €45/trip',
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: false,
        },
        {
            id: 'activities',
            icon: Waves,
            title: 'Water Sports & Diving',
            description: 'Professional diving instruction and water sports equipment',
            features: [
                'PADI certified instructors',
                'Snorkeling equipment rental',
                'Boat trips to coral reefs',
                'Parasailing adventures',
                'Fishing excursions',
            ],
            price: 'From €60/activity',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: true,
        },
        {
            id: 'photography',
            icon: Camera,
            title: 'Photography Services',
            description: 'Professional vacation photography to capture your memories',
            features: [
                'Couple & family sessions',
                'Underwater photography',
                'Drone aerial shots',
                'Edited digital gallery',
                'Print packages available',
            ],
            price: 'From €120/session',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: false,
        },
        {
            id: 'spa',
            icon: Sparkles,
            title: 'In-Villa Spa Services',
            description: 'Relaxing spa treatments in the comfort of your villa',
            features: [
                'Licensed massage therapists',
                'Variety of treatment options',
                'Premium organic products',
                'Couples treatments available',
                'Flexible scheduling',
            ],
            price: 'From €90/treatment',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: false,
        },
        {
            id: 'concierge',
            icon: Clock,
            title: '24/7 Concierge',
            description: 'Round-the-clock assistance for all your needs and requests',
            features: [
                'Restaurant reservations',
                'Event planning assistance',
                'Emergency support',
                'Local recommendations',
                'Multilingual staff',
            ],
            price: 'Included',
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            popular: true,
        },
    ];

    return (
        <section className='relative py-20 px-6 bg-gradient-to-b from-white to-orange-50 overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute top-20 right-10 w-40 h-40 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-2xl'></div>
            <div className='absolute bottom-10 left-10 w-60 h-60 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'></div>

            <div className='max-w-7xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                        Premium Services
                    </div>
                    <h2 className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'>
                        Elevated
                        <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                            EXPERIENCES
                        </span>
                    </h2>
                    <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                        Transform your stay with our curated selection of premium services, each designed to create
                        unforgettable moments
                    </p>
                </div>

                {/* Services Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                    {services.map((service, index) => {
                        const IconComponent = service.icon;
                        return (
                            <div
                                key={service.id}
                                className={`group relative bg-white/80 backdrop-blur-md border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                                    selectedService === service.id
                                        ? 'border-orange-400/80 shadow-xl scale-105'
                                        : 'border-orange-200/50 hover:border-orange-300/60 hover:scale-105'
                                }`}
                                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                            >
                                {/* Popular Badge */}
                                {service.popular && (
                                    <div className='absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold rounded-full'>
                                        POPULAR
                                    </div>
                                )}

                                {/* Service Image */}
                                <div className='relative overflow-hidden aspect-[16/10]'>
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>

                                    {/* Service Icon */}
                                    <div className='absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center'>
                                        <IconComponent className='w-6 h-6 text-orange-600' />
                                    </div>

                                    {/* Price */}
                                    <div className='absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-orange-800'>
                                        {service.price}
                                    </div>
                                </div>

                                {/* Service Content */}
                                <div className='p-6'>
                                    <h3 className='text-xl font-bold text-orange-900 mb-2 group-hover:text-orange-700 transition-colors duration-300'>
                                        {service.title}
                                    </h3>
                                    <p className='text-orange-700/80 text-sm leading-relaxed mb-4'>
                                        {service.description}
                                    </p>

                                    {/* Features List (shown when expanded) */}
                                    <div
                                        className={`transition-all duration-500 overflow-hidden ${
                                            selectedService === service.id
                                                ? 'max-h-96 opacity-100'
                                                : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className='border-t border-orange-200/50 pt-4 mb-4'>
                                            <div className='space-y-2'>
                                                {service.features.map((feature, idx) => (
                                                    <div
                                                        key={idx}
                                                        className='flex items-center space-x-2 text-sm text-orange-700'
                                                    >
                                                        <Check className='w-4 h-4 text-green-600 flex-shrink-0' />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <button className='w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 flex items-center justify-center space-x-2'>
                                            <Link to={`/${lang}/services`}>
                                                <span>Book Service</span>
                                                <ArrowRight className='w-4 h-4' />
                                            </Link>
                                        </button>
                                    </div>

                                    {/* Expand/Collapse Indicator */}
                                    <div className='flex items-center justify-between mt-4'>
                                        <div className='flex items-center space-x-1 text-orange-600'>
                                            <Star className='w-4 h-4 fill-current' />
                                            <span className='text-sm font-medium'>Premium Quality</span>
                                        </div>
                                        <div
                                            className={`text-orange-600 transition-transform duration-300 ${
                                                selectedService === service.id ? 'rotate-180' : ''
                                            }`}
                                        >
                                            <ArrowRight className='w-4 h-4 rotate-90' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Service Packages */}
                <div className='bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 rounded-3xl p-12 text-center'>
                    <h3 className='text-3xl font-bold text-white mb-4 font-butler'>Complete Experience Packages</h3>
                    <p className='text-white/90 text-lg mb-8 max-w-3xl mx-auto'>
                        Combine multiple services for the ultimate luxury vacation. Our packages offer exceptional value
                        and seamless coordination.
                    </p>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white'>
                            <h4 className='text-xl font-bold mb-2'>Essential Package</h4>
                            <p className='text-white/80 text-sm mb-4'>Chef + Transport + Concierge</p>
                            <div className='text-2xl font-bold'>
                                €180<span className='text-base font-normal'>/day</span>
                            </div>
                        </div>
                        <div className='bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 text-white scale-105'>
                            <div className='bg-yellow-400 text-orange-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3'>
                                MOST POPULAR
                            </div>
                            <h4 className='text-xl font-bold mb-2'>Premium Package</h4>
                            <p className='text-white/80 text-sm mb-4'>All services included</p>
                            <div className='text-2xl font-bold'>
                                €320<span className='text-base font-normal'>/day</span>
                            </div>
                        </div>
                        <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-white'>
                            <h4 className='text-xl font-bold mb-2'>Adventure Package</h4>
                            <p className='text-white/80 text-sm mb-4'>Activities + Photo + Transport</p>
                            <div className='text-2xl font-bold'>
                                €240<span className='text-base font-normal'>/day</span>
                            </div>
                        </div>
                    </div>

                    <button className='bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-orange-50 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-3 mx-auto'>
                        <span>View All Packages</span>
                        <ArrowRight className='w-5 h-5' />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
