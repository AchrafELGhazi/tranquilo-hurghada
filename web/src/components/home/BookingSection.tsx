import { useState } from 'react';
import { Calendar, Users, MapPin, ArrowRight, Star, Award } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const BookingSection = () => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState('2');
    const { lang } = useParams();

    return (
        <section className='relative py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden'>
            {/* Background Elements */}
            <div className='absolute top-10 right-10 w-32 h-32 bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-2xl'></div>
            <div className='absolute bottom-20 left-10 w-40 h-40 bg-gradient-radial from-yellow-200/20 to-transparent rounded-full blur-3xl'></div>

            <div className='max-w-6xl mx-auto'>
                {/* Section Header */}
                <div className='text-center mb-16'>
                    <div className='inline-block px-4 py-2 backdrop-blur-md bg-orange-100/50 border border-orange-200/50 rounded-full text-orange-700 font-medium text-sm tracking-wider uppercase mb-6'>
                        Reserve Your Stay
                    </div>
                    <h2 className='font-butler text-5xl md:text-6xl text-orange-900 mb-6 leading-tight'>
                        Book Your
                        <span className='block text-amber-600 font-bold text-3xl md:text-4xl mt-2 font-sans tracking-wide'>
                            PARADISE ESCAPE
                        </span>
                    </h2>
                    <p className='text-lg text-orange-700/80 max-w-3xl mx-auto leading-relaxed'>
                        Secure your luxury villa experience with instant confirmation and premium Red Sea views
                    </p>
                </div>

                {/* Booking Widget */}
                <div className='bg-white/80 backdrop-blur-lg border-2 border-orange-200/50 rounded-3xl p-8 shadow-2xl mb-12'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
                        {/* Check-in Date */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-orange-900 mb-2'>Check-in Date</label>
                            <div className='relative'>
                                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-600' />
                                <input
                                    type='date'
                                    value={checkIn}
                                    onChange={e => setCheckIn(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border-2 border-orange-200/60 rounded-xl bg-white/70 text-orange-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300'
                                />
                            </div>
                        </div>

                        {/* Check-out Date */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-orange-900 mb-2'>Check-out Date</label>
                            <div className='relative'>
                                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-600' />
                                <input
                                    type='date'
                                    value={checkOut}
                                    onChange={e => setCheckOut(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border-2 border-orange-200/60 rounded-xl bg-white/70 text-orange-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300'
                                />
                            </div>
                        </div>

                        {/* Guests */}
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-orange-900 mb-2'>Guests</label>
                            <div className='relative'>
                                <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-600' />
                                <select
                                    value={guests}
                                    onChange={e => setGuests(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border-2 border-orange-200/60 rounded-xl bg-white/70 text-orange-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all duration-300 appearance-none'
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                        <option key={num} value={num}>
                                            {num} Guest{num > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Book Now Button */}
                        <div className='flex items-end'>
                            <button className='w-full group relative px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 transition-all duration-500 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transform hover:scale-105'>
                                <Link to={`/${lang}/booking`}>
                                    <span className='relative z-10 flex items-center justify-center space-x-2'>
                                        <span>Book Now</span>
                                        <ArrowRight className='w-4 h-4 transition-transform duration-300 group-hover:translate-x-1' />
                                    </span>
                                    <div className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className='flex items-center justify-between pt-6 border-t border-orange-200/50'>
                        <div className='flex items-center space-x-4'>
                            <div className='flex items-center space-x-1'>
                                <Star className='w-5 h-5 text-yellow-500 fill-current' />
                                <Star className='w-5 h-5 text-yellow-500 fill-current' />
                                <Star className='w-5 h-5 text-yellow-500 fill-current' />
                                <Star className='w-5 h-5 text-yellow-500 fill-current' />
                                <Star className='w-5 h-5 text-yellow-500 fill-current' />
                                <span className='text-sm text-orange-700 ml-2'>(4.9) 127 reviews</span>
                            </div>
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
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                        <Award className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                        <h3 className='font-semibold text-orange-900 mb-2'>Instant Confirmation</h3>
                        <p className='text-sm text-orange-700'>Immediate booking confirmation</p>
                    </div>
                    <div className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                        <MapPin className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                        <h3 className='font-semibold text-orange-900 mb-2'>Prime Location</h3>
                        <p className='text-sm text-orange-700'>Beachfront Red Sea access</p>
                    </div>
                    <div className='bg-white/60 backdrop-blur-md border border-orange-200/50 rounded-2xl p-6 text-center'>
                        <Users className='w-8 h-8 text-orange-600 mx-auto mb-3' />
                        <h3 className='font-semibold text-orange-900 mb-2'>Concierge Service</h3>
                        <p className='text-sm text-orange-700'>24/7 premium support</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSection;
