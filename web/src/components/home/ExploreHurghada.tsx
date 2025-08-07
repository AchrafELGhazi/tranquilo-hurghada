import { useState } from 'react';
import {
    MapPin,
    Camera,
    Compass,
    Waves,
    Sun,
    Fish,
    Mountain,
    Utensils,
    ChevronRight,
    Star,
    Clock,
    Users,
    Award,
} from 'lucide-react';

const ExploreHurghada = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const categories = [
        { id: 'all', label: 'All Experiences', icon: Compass },
        { id: 'water', label: 'Water Activities', icon: Waves },
        { id: 'culture', label: 'Cultural Sites', icon: Camera },
        { id: 'dining', label: 'Dining & Nightlife', icon: Utensils },
        { id: 'adventure', label: 'Adventures', icon: Mountain },
    ];

    const experiences = [
        {
            id: 1,
            title: 'Giftun Island Paradise',
            description: 'Pristine white sand beaches and crystal-clear waters perfect for snorkeling and relaxation',
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'water',
            duration: 'Full Day',
            distance: '30 min boat',
            rating: 4.9,
            price: 'From €45',
            highlights: ['Snorkeling', 'Beach Access', 'Lunch Included'],
            featured: true,
        },
        {
            id: 2,
            title: 'Red Sea Diving Adventures',
            description: 'World-class diving sites with vibrant coral reefs and diverse marine life',
            image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'water',
            duration: 'Half Day',
            distance: 'Multiple sites',
            rating: 4.8,
            price: 'From €65',
            highlights: ['PADI Certified', 'Equipment Included', 'All Levels'],
            featured: true,
        },
        {
            id: 3,
            title: 'Desert Safari Experience',
            description: 'Thrilling quad bike adventures through the Eastern Desert with Bedouin culture immersion',
            image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'adventure',
            duration: '6 Hours',
            distance: '45 min drive',
            rating: 4.7,
            price: 'From €55',
            highlights: ['Quad Biking', 'Camel Riding', 'Traditional Dinner'],
            featured: false,
        },
        {
            id: 4,
            title: 'Hurghada Marina Boulevard',
            description: 'Vibrant waterfront promenade with luxury shops, restaurants, and evening entertainment',
            image: 'https://images.unsplash.com/photo-1585262415878-d5b4b0e19e25?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'culture',
            duration: '2-3 Hours',
            distance: '15 min drive',
            rating: 4.5,
            price: 'Free Entry',
            highlights: ['Shopping', 'Dining', 'Marina Views'],
            featured: false,
        },
        {
            id: 5,
            title: 'Submarine Sea World',
            description: 'Underwater adventure without getting wet - explore Red Sea marine life from a submarine',
            image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'water',
            duration: '3 Hours',
            distance: '20 min drive',
            rating: 4.6,
            price: 'From €40',
            highlights: ['Family Friendly', 'Air Conditioned', 'Marine Life'],
            featured: false,
        },
        {
            id: 6,
            title: 'Felucca Sunset Cruise',
            description: 'Traditional Egyptian sailboat cruise with spectacular Red Sea sunset views',
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'culture',
            duration: '2 Hours',
            distance: '5 min walk',
            rating: 4.8,
            price: 'From €30',
            highlights: ['Sunset Views', 'Traditional Boat', 'Refreshments'],
            featured: false,
        },
        {
            id: 7,
            title: 'El Dahar Old Town Market',
            description: 'Authentic Egyptian bazaar experience with traditional crafts, spices, and local culture',
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'culture',
            duration: '2-4 Hours',
            distance: '25 min drive',
            rating: 4.4,
            price: 'Free Entry',
            highlights: ['Local Crafts', 'Traditional Food', 'Authentic Culture'],
            featured: false,
        },
        {
            id: 8,
            title: 'Seafood Harbor Restaurant',
            description: 'Fresh daily catch prepared with Mediterranean flair overlooking the Red Sea',
            image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            category: 'dining',
            duration: '1-2 Hours',
            distance: '10 min drive',
            rating: 4.7,
            price: 'From €25',
            highlights: ['Fresh Seafood', 'Sea Views', 'Live Music'],
            featured: false,
        },
    ];

    const getFilteredExperiences = () => {
        if (activeCategory === 'all') return experiences;
        return experiences.filter(exp => exp.category === activeCategory);
    };

    const getFeaturedExperiences = () => {
        return experiences.filter(exp => exp.featured);
    };

    return (
        <section className='relative py-20 px-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-orange-200/20 to-transparent rounded-full blur-3xl'></div>
            <div className='absolute bottom-0 left-0 w-80 h-80 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'></div>

            <div className='max-w-7xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                        Discover Hurghada
                    </div>
                    <h2 className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'>
                        Endless
                        <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                            ADVENTURES AWAIT
                        </span>
                    </h2>
                    <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                        From pristine coral reefs to ancient desert landscapes, discover the wonders that make Hurghada
                        an unforgettable destination
                    </p>
                </div>

                {/* Featured Experiences Banner */}
                <div className='mb-16'>
                    <h3 className='text-2xl font-bold text-orange-900 mb-8 text-center font-butler'>
                        Must-Experience Highlights
                    </h3>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {getFeaturedExperiences().map(experience => (
                            <div
                                key={experience.id}
                                className='group bg-white/80 backdrop-blur-md border-2 border-orange-200/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500'
                            >
                                <div className='relative overflow-hidden aspect-[16/9]'>
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>

                                    {/* Featured Badge */}
                                    <div className='absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold rounded-full flex items-center space-x-1'>
                                        <Award className='w-3 h-3' />
                                        <span>FEATURED</span>
                                    </div>

                                    {/* Price Badge */}
                                    <div className='absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-orange-800'>
                                        {experience.price}
                                    </div>

                                    {/* Quick Info */}
                                    <div className='absolute bottom-4 left-4 flex items-center space-x-4 text-white'>
                                        <div className='flex items-center space-x-1'>
                                            <Clock className='w-4 h-4' />
                                            <span className='text-sm'>{experience.duration}</span>
                                        </div>
                                        <div className='flex items-center space-x-1'>
                                            <MapPin className='w-4 h-4' />
                                            <span className='text-sm'>{experience.distance}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className='absolute bottom-4 right-4 flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1'>
                                        <Star className='w-4 h-4 text-yellow-400 fill-current' />
                                        <span className='text-white text-sm font-medium'>{experience.rating}</span>
                                    </div>
                                </div>

                                <div className='p-6'>
                                    <h4 className='text-xl font-bold text-orange-900 mb-2 group-hover:text-orange-700 transition-colors duration-300'>
                                        {experience.title}
                                    </h4>
                                    <p className='text-orange-700/80 text-sm leading-relaxed mb-4'>
                                        {experience.description}
                                    </p>

                                    {/* Highlights */}
                                    <div className='flex flex-wrap gap-2 mb-4'>
                                        {experience.highlights.map((highlight, idx) => (
                                            <span
                                                key={idx}
                                                className='px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full'
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>

                                    <button className='flex items-center space-x-2 text-orange-600 font-semibold text-sm hover:text-orange-800 transition-colors duration-300 group'>
                                        <span>Book Experience</span>
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category Filters */}
                <div className='flex flex-wrap justify-center gap-4 mb-12'>
                    {categories.map(category => {
                        const IconComponent = category.icon;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                                    activeCategory === category.id
                                        ? 'bg-orange-600 border-orange-600 text-white shadow-lg scale-105'
                                        : 'bg-white/80 border-orange-200/50 text-orange-700 hover:bg-orange-100/80 hover:border-orange-300/60 hover:scale-105'
                                }`}
                            >
                                <IconComponent className='w-4 h-4' />
                                <span>{category.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Experiences Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                    {getFilteredExperiences()
                        .filter(exp => !exp.featured)
                        .map(experience => (
                            <div
                                key={experience.id}
                                className='group bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-500'
                            >
                                <div className='relative overflow-hidden aspect-[4/3]'>
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                                    {/* Price */}
                                    <div className='absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm border border-white/50 rounded-full text-xs font-bold text-orange-700'>
                                        {experience.price}
                                    </div>

                                    {/* Duration & Distance */}
                                    <div className='absolute bottom-4 left-4 flex flex-col space-y-1 text-white text-xs'>
                                        <div className='flex items-center space-x-1'>
                                            <Clock className='w-3 h-3' />
                                            <span>{experience.duration}</span>
                                        </div>
                                        <div className='flex items-center space-x-1'>
                                            <MapPin className='w-3 h-3' />
                                            <span>{experience.distance}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className='absolute bottom-4 right-4 flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1'>
                                        <Star className='w-3 h-3 text-yellow-400 fill-current' />
                                        <span className='text-white text-xs'>{experience.rating}</span>
                                    </div>
                                </div>

                                <div className='p-5'>
                                    <h4 className='text-lg font-bold text-orange-900 mb-2 group-hover:text-orange-700 transition-colors duration-300'>
                                        {experience.title}
                                    </h4>
                                    <p className='text-orange-700/80 text-sm leading-relaxed mb-3'>
                                        {experience.description}
                                    </p>

                                    {/* Highlights */}
                                    <div className='flex flex-wrap gap-1 mb-3'>
                                        {experience.highlights.slice(0, 2).map((highlight, idx) => (
                                            <span
                                                key={idx}
                                                className='px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full'
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                        {experience.highlights.length > 2 && (
                                            <span className='px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full'>
                                                +{experience.highlights.length - 2} more
                                            </span>
                                        )}
                                    </div>

                                    <button className='flex items-center space-x-2 text-orange-600 font-medium text-sm hover:text-orange-800 transition-colors duration-300 group'>
                                        <span>Learn More</span>
                                        <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Hurghada Stats */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6 mb-16'>
                    <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300'>
                        <Sun className='w-10 h-10 text-orange-600 mx-auto mb-3' />
                        <div className='text-3xl font-bold text-orange-900'>350+</div>
                        <div className='text-sm text-orange-700'>Sunny Days/Year</div>
                    </div>
                    <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300'>
                        <Fish className='w-10 h-10 text-orange-600 mx-auto mb-3' />
                        <div className='text-3xl font-bold text-orange-900'>1000+</div>
                        <div className='text-sm text-orange-700'>Marine Species</div>
                    </div>
                    <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300'>
                        <Waves className='w-10 h-10 text-orange-600 mx-auto mb-3' />
                        <div className='text-3xl font-bold text-orange-900'>50+</div>
                        <div className='text-sm text-orange-700'>Dive Sites</div>
                    </div>
                    <div className='bg-white/80 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300'>
                        <Compass className='w-10 h-10 text-orange-600 mx-auto mb-3' />
                        <div className='text-3xl font-bold text-orange-900'>24°C</div>
                        <div className='text-sm text-orange-700'>Avg Water Temp</div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className='bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-12 text-center'>
                    <h3 className='text-3xl font-bold text-white mb-4 font-butler'>Ready for Your Adventure?</h3>
                    <p className='text-white/90 text-lg mb-8 max-w-2xl mx-auto'>
                        Our local concierge team will help you plan the perfect Hurghada itinerary tailored to your
                        interests and schedule
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                        <button className='bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:bg-orange-50 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3'>
                            <Users className='w-5 h-5' />
                            <span>Speak with Concierge</span>
                        </button>
                        <button className='bg-white/20 backdrop-blur-md border-2 border-white/30 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/30 hover:transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3'>
                            <Compass className='w-5 h-5' />
                            <span>Browse All Activities</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExploreHurghada;
