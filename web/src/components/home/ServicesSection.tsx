// Enhanced ServicesSection with comprehensive schema for all service categories

import { useState } from 'react';
import { services, serviceCategories } from '@/data/services';
import { Link, useParams } from 'react-router-dom';

const ServicesSection = () => {
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const { lang } = useParams();

    // Filter services based on active category
    const filteredServices =
        activeCategory === 'all'
            ? services.filter(service => service.featured)
            : services.filter(service => service.category === activeCategory);

    // Comprehensive JSON-LD for all services
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Resort',
                '@id': 'https://www.tranquilo-hurghada.com/#resort',
                name: 'Tranquilo Hurghada',
                description:
                    "Luxury all-inclusive villa resort offering premium accommodations, private chef service, adventure activities, wellness treatments, and cultural experiences on Egypt's Red Sea coast.",
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Hurghada',
                    addressRegion: 'Red Sea Governorate',
                    addressCountry: 'EG',
                },
                amenityFeature: services.map(service => ({
                    '@type': 'LocationFeatureSpecification',
                    name: service.title,
                    value: true,
                })),
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Tranquilo Hurghada Services',
                    itemListElement: services.map((service, index) => ({
                        '@type': 'Offer',
                        name: service.title,
                        description: service.description,
                        category: service.category,
                        price: service.price.includes('€') ? service.price.replace(/[^0-9]/g, '') : '0',
                        priceCurrency: 'EUR',
                        availability: service.available
                            ? 'https://schema.org/InStock'
                            : 'https://schema.org/OutOfStock',
                        itemOffered: {
                            '@type': 'Service',
                            name: service.title,
                            description: service.longDescription,
                            provider: {
                                '@type': 'Organization',
                                name: 'Tranquilo Hurghada',
                            },
                        },
                    })),
                },
            },
            // Individual service schemas for better categorization
            ...services.map(service => ({
                '@type': 'Service',
                '@id': `https://www.tranquilo-hurghada.com/services/${service.id}`,
                name: service.title,
                description: service.longDescription,
                image: service.image,
                serviceType: service.category,
                provider: {
                    '@type': 'Organization',
                    name: 'Tranquilo Hurghada',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Hurghada',
                        addressCountry: 'EG',
                    },
                },
                areaServed: {
                    '@type': 'Place',
                    name: 'Hurghada, Red Sea, Egypt',
                },
                offers: {
                    '@type': 'Offer',
                    price: service.price.includes('€') ? service.price.replace(/[^0-9]/g, '') : '0',
                    priceCurrency: 'EUR',
                    availability: service.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    validFrom: '2024-01-01',
                    validThrough: '2025-12-31',
                },
                additionalProperty: [
                    {
                        '@type': 'PropertyValue',
                        name: 'duration',
                        value: service.duration,
                    },
                    {
                        '@type': 'PropertyValue',
                        name: 'difficulty',
                        value: service.difficulty || 'Not specified',
                    },
                    {
                        '@type': 'PropertyValue',
                        name: 'groupSize',
                        value: service.groupSize || 'Flexible',
                    },
                ],
            })),
        ],
    };

    return (
        <>
            <section
                id='services'
                aria-labelledby='services-heading'
                className='relative py-20 px-6 bg-gradient-to-b from-white to-orange-50 overflow-hidden'
            >
                {/* Background decorations */}
                <div
                    className='absolute top-20 right-10 w-40 h-40 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-2xl'
                    aria-hidden='true'
                ></div>
                <div
                    className='absolute bottom-10 left-10 w-60 h-60 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'
                    aria-hidden='true'
                ></div>

                <div className='max-w-7xl mx-auto'>
                    <header className='text-center mb-16'>
                        <p className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                            All-Inclusive Luxury Villa Services in Hurghada
                        </p>
                        <h2
                            id='services-heading'
                            className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'
                        >
                            Complete Red Sea
                            <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                                LUXURY EXPERIENCE
                            </span>
                        </h2>
                        <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                            From private chef service and diving adventures to cultural tours and spa treatments -
                            everything you need for an unforgettable Red Sea getaway, all included or easily arranged.
                        </p>
                    </header>

                    {/* Service Categories Filter */}
                    <nav className='flex flex-wrap justify-center gap-4 mb-12' aria-label='Service categories'>
                        {serviceCategories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                    activeCategory === category.id
                                        ? 'bg-orange-600 text-white shadow-lg'
                                        : 'bg-white/70 text-orange-700 hover:bg-orange-100 border border-orange-200'
                                }`}
                                aria-pressed={activeCategory === category.id}
                            >
                                <span className='mr-2'>{category.icon}</span>
                                {category.name}
                            </button>
                        ))}
                    </nav>

                    {/* Services Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                        {filteredServices.map(service => (
                            <article
                                key={service.id}
                                itemScope
                                itemType='https://schema.org/Service'
                                className={`group relative bg-white/80 backdrop-blur-md border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                                    selectedService === service.id
                                        ? 'border-orange-400/80 shadow-xl scale-105'
                                        : 'border-orange-200/50 hover:border-orange-300/60 hover:scale-105'
                                } ${service.category === 'included' ? 'ring-2 ring-green-500/30' : ''}`}
                                onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                            >
                                {/* Category Badge */}
                                <span
                                    className={`absolute top-4 right-4 z-10 px-3 py-1 text-white text-xs font-bold rounded-full ${
                                        service.category === 'included'
                                            ? 'bg-green-600'
                                            : service.featured
                                            ? 'bg-gradient-to-r from-orange-600 to-amber-600'
                                            : 'bg-gray-600'
                                    }`}
                                >
                                    {service.category === 'included'
                                        ? 'INCLUDED'
                                        : service.featured
                                        ? 'FEATURED'
                                        : service.category.toUpperCase()}
                                </span>

                                <div className='relative overflow-hidden aspect-[16/10]'>
                                    <img
                                        src={service.image}
                                        alt={`${service.title} - luxury villa service in Hurghada, Red Sea Egypt`}
                                        itemProp='image'
                                        className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                        loading='lazy'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent'></div>

                                    <meta itemProp='name' content={service.title} />
                                    <meta itemProp='description' content={service.description} />
                                    <div
                                        className='absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-orange-800'
                                        itemProp='offers'
                                        itemScope
                                        itemType='https://schema.org/Offer'
                                    >
                                        <meta itemProp='price' content={service.price.replace(/[^0-9]/g, '') || '0'} />
                                        <meta itemProp='priceCurrency' content='EUR' />
                                        {service.price}
                                    </div>
                                </div>

                                <div className='p-6'>
                                    <h3 className='text-xl font-bold text-orange-900 mb-2 group-hover:text-orange-700 transition-colors duration-300'>
                                        {service.title}
                                    </h3>
                                    <p className='text-orange-700/80 text-sm leading-relaxed mb-4'>
                                        {service.description}
                                    </p>

                                    {/* Service Details */}
                                    <div className='flex items-center justify-between text-xs text-orange-600 mb-4'>
                                        <span>⏱️ {service.duration}</span>
                                        {service.groupSize && <span>👥 {service.groupSize}</span>}
                                        {service.difficulty && <span>📊 {service.difficulty}</span>}
                                    </div>

                                    {/* Expanded Content */}
                                    <div
                                        className={`transition-all duration-500 overflow-hidden ${
                                            selectedService === service.id
                                                ? 'max-h-96 opacity-100'
                                                : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <ul className='border-t border-orange-200/50 pt-4 mb-4 space-y-2 list-none'>
                                            {service.highlights.map((highlight, idx) => (
                                                <li
                                                    key={idx}
                                                    className='flex items-center space-x-2 text-sm text-orange-700'
                                                >
                                                    <span className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0'></span>
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            to={`/${lang}/services/${service.id}`}
                                            className='w-full inline-flex items-center justify-center bg-gradient-to-r from-orange-600 to-orange-700 text-white font-semibold py-3 px-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 space-x-2'
                                            aria-label={`Learn more about ${service.title} in Hurghada`}
                                        >
                                            <span>
                                                {service.category === 'included' ? 'Included in Stay' : 'Book Service'}
                                            </span>
                                        </Link>
                                    </div>

                                    {/* Expand Indicator */}
                                    <div className='flex items-center justify-center mt-4'>
                                        <div
                                            className={`text-orange-600 transition-transform duration-300 ${
                                                selectedService === service.id ? 'rotate-180' : ''
                                            }`}
                                            aria-hidden='true'
                                        >
                                            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* All-Inclusive Highlight */}
                    <div className='bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 text-center'>
                        <h3 className='text-3xl font-bold text-white mb-4 font-butler'>
                            All-Inclusive Luxury Villa Experience
                        </h3>
                        <p className='text-white/90 text-lg mb-8 max-w-3xl mx-auto'>
                            Your villa stay includes chef service, airport transfers, housekeeping, security, and
                            concierge - plus easy access to diving, cultural tours, spa treatments, and adventure
                            activities.
                        </p>
                        <Link
                            to={`/${lang}/services`}
                            className='bg-white text-green-600 font-bold py-4 px-8 rounded-xl hover:bg-green-50 hover:transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-3'
                        >
                            <span>Explore All Services</span>
                            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Comprehensive JSON-LD Schema */}
            <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </>
    );
};

export default ServicesSection;
