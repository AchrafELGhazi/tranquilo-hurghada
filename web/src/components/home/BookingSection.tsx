import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Star, Award } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DateRangePickerModal from '../booking/DateRangePickerModal';

const FORM_STORAGE_KEY = 'booking_form_data';

interface FormData {
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    phone?: string;
    dateOfBirth?: string;
    paymentMethod?: string;
    notes?: string;
}

const BookingSection: React.FC = () => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('2');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { lang } = useParams<{ lang: string }>();

    useEffect(() => {
        const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedFormData) {
            try {
                const parsedData: FormData = JSON.parse(savedFormData);
                if (parsedData.checkIn) setCheckIn(parsedData.checkIn);
                if (parsedData.checkOut) setCheckOut(parsedData.checkOut);
                if (parsedData.totalGuests) setGuests(parsedData.totalGuests.toString());
            } catch (error) {
                console.warn('Failed to parse saved form data:', error);
            }
        }
    }, []);

    const saveFormDataToStorage = (newCheckIn: string, newCheckOut: string, newGuests: string) => {
        try {
            let existingData: Partial<FormData> = {};
            try {
                const existing = localStorage.getItem(FORM_STORAGE_KEY);
                if (existing) {
                    existingData = JSON.parse(existing);
                }
            } catch {
                existingData = {};
            }
            const formData: FormData = {
                ...existingData,
                checkIn: newCheckIn,
                checkOut: newCheckOut,
                totalGuests: parseInt(newGuests, 10),
            };
            localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        } catch (error) {
            console.warn('Failed to save form data to localStorage:', error);
        }
    };

    const handleDateSelect = (newCheckIn: string, newCheckOut: string) => {
        setCheckIn(newCheckIn);
        setCheckOut(newCheckOut);
        saveFormDataToStorage(newCheckIn, newCheckOut, guests);
    };

    const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newGuests = e.target.value;
        setGuests(newGuests);
        saveFormDataToStorage(checkIn, checkOut, newGuests);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const timeDiff = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };

    return (
        <>
            {/* LodgingBusiness Schema for SEO */}
            <script type='application/ld+json'>
                {JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'LodgingBusiness',
                    name: 'Tranquilo Hurghada Luxury Villa',
                    description:
                        'Luxury beachfront villa in Hurghada, Egypt, with private pool, premium Red Sea views, and concierge service.',
                    image: 'https://www.tranquilo-hurghada.com/images/villa-main.jpg',
                    address: {
                        '@type': 'PostalAddress',
                        addressLocality: 'Hurghada',
                        addressRegion: 'Red Sea Governorate',
                        addressCountry: 'EG',
                    },
                    priceRange: '€150 - €300 per night',
                    telephone: '+20 123 456 7890',
                    amenityFeature: [
                        { '@type': 'LocationFeatureSpecification', name: 'Private pool' },
                        { '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi' },
                        { '@type': 'LocationFeatureSpecification', name: 'Beachfront' },
                    ],
                    url: 'https://www.tranquilo-hurghada.com',
                })}
            </script>

            <section
                className='relative py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden'
                aria-labelledby='booking-heading'
            >
                <div
                    className='absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-2xl'
                    aria-hidden='true'
                ></div>
                <div
                    className='absolute bottom-20 left-10 w-40 h-40 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'
                    aria-hidden='true'
                ></div>

                <div className='max-w-6xl mx-auto'>
                    <header className='text-center mb-16'>
                        <span className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                            Reserve Your Stay
                        </span>
                        <h2
                            id='booking-heading'
                            className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'
                        >
                            Book Your
                            <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                                Luxury Beachfront Villa in Hurghada
                            </span>
                        </h2>
                        <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                            Experience the perfect Red Sea getaway — secure your private villa with{' '}
                            <strong>instant booking confirmation</strong>, panoramic sea views, and 5-star amenities.
                        </p>
                    </header>

                    <div className='bg-white/80 backdrop-blur-lg border-2 border-orange-200/50 rounded-3xl p-8 shadow-2xl mb-12'>
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
                            {/* Date Picker */}
                            <div className='md:col-span-2'>
                                <button
                                    type='button'
                                    className='bg-white/50 border-2 border-orange-200/60 rounded-xl overflow-hidden w-full h-full hover:bg-white/70 transition-all duration-300'
                                    onClick={() => setShowDatePicker(true)}
                                    aria-label='Select check-in and check-out dates'
                                >
                                    <div className='grid grid-cols-2 h-full'>
                                        <div className='p-4 border-r border-orange-200/60 flex flex-col justify-center'>
                                            <label className='text-sm font-semibold text-orange-900 mb-2 flex items-center'>
                                                <Calendar className='w-4 h-4 mr-2' aria-hidden='true' />
                                                Check-in Date
                                            </label>
                                            <div className='text-orange-900 font-medium'>
                                                {checkIn ? formatDisplayDate(checkIn) : 'Add date'}
                                            </div>
                                        </div>
                                        <div className='p-4 flex flex-col justify-center'>
                                            <label className='block text-sm font-semibold text-orange-900 mb-2'>
                                                Check-out Date
                                            </label>
                                            <div className='text-orange-900 font-medium'>
                                                {checkOut ? formatDisplayDate(checkOut) : 'Add date'}
                                            </div>
                                        </div>
                                    </div>
                                    {checkIn && checkOut && (
                                        <div className='px-4 pb-3 border-t border-orange-200/50 bg-orange-50/50 text-center'>
                                            <span className='text-sm font-semibold text-orange-700'>
                                                {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Guests */}
                            <div>
                                <label htmlFor='guests' className='block text-sm font-semibold text-orange-900 mb-2'>
                                    Guests
                                </label>
                                <div className='relative'>
                                    <Users
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-600'
                                        aria-hidden='true'
                                    />
                                    <select
                                        id='guests'
                                        value={guests}
                                        onChange={handleGuestsChange}
                                        className='w-full pl-10 pr-4 py-3 border-2 border-orange-200/60 rounded-xl bg-white/70 text-orange-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 appearance-none'
                                        aria-label='Select number of guests'
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                            <option key={num} value={num}>
                                                {num} Guest{num > 1 ? 's' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Book Now */}
                            <div className='flex items-end'>
                                <Link
                                    to={`/${lang}/booking`}
                                    className='w-full group relative px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 text-center'
                                    aria-label='Book your luxury beachfront villa now'
                                >
                                    <span className='flex items-center justify-center space-x-2 relative z-10'>
                                        <span>Book Now</span>
                                        <ArrowRight
                                            className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1'
                                            aria-hidden='true'
                                        />
                                    </span>
                                    <span
                                        className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                        aria-hidden='true'
                                    ></span>
                                </Link>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='flex items-center justify-between pt-6 border-t border-orange-200/50'>
                            <div className='flex items-center space-x-1'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className='w-5 h-5 text-yellow-500 fill-current' aria-hidden='true' />
                                ))}
                                <span className='text-sm text-orange-700 ml-2'>(4.9) 127 reviews</span>
                            </div>
                            <div className='text-right'>
                                <div className='text-2xl font-bold text-orange-900'>
                                    €150<span className='text-lg font-normal text-orange-700'>/night</span>
                                </div>
                                <div className='text-sm text-orange-600'>Free cancellation</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <ul
                        className='grid grid-cols-1 md:grid-cols-3 gap-6'
                        aria-label='Key benefits of staying at Tranquilo Hurghada'
                    >
                        <li className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                            <Award className='w-8 h-8 text-orange-600 mx-auto mb-3' aria-hidden='true' />
                            <h3 className='font-semibold text-orange-900 mb-2'>Instant Confirmation</h3>
                            <p className='text-sm text-orange-700'>Your villa is booked immediately — no waiting.</p>
                        </li>
                        <li className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                            <MapPin className='w-8 h-8 text-orange-600 mx-auto mb-3' aria-hidden='true' />
                            <h3 className='font-semibold text-orange-900 mb-2'>Prime Red Sea Location</h3>
                            <p className='text-sm text-orange-700'>Beachfront access with breathtaking views.</p>
                        </li>
                        <li className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                            <Users className='w-8 h-8 text-orange-600 mx-auto mb-3' aria-hidden='true' />
                            <h3 className='font-semibold text-orange-900 mb-2'>Concierge Service</h3>
                            <p className='text-sm text-orange-700'>24/7 personalized assistance during your stay.</p>
                        </li>
                    </ul>
                </div>
            </section>

            <DateRangePickerModal
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                villaId='tranquilo-hurghada'
                onDateSelect={handleDateSelect}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
            />
        </>
    );
};

export default BookingSection;
