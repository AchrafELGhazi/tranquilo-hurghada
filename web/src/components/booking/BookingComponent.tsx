import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Users,
    Phone,
    CreditCard,
    FileText,
    AlertCircle,
    Check,
    Star,
    Award,
    Shield,
    Clock,
} from 'lucide-react';
import bookingApi from '@/api/bookingApi';
import villaApi from '@/api/villaApi';

interface Villa {
    id: string;
    title: string;
    pricePerNight: string;
    maxGuests: number;
}

interface User {
    id: string;
    fullName: string;
    phone?: string;
    dateOfBirth?: Date | null;
}

interface FormData {
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    phone: string;
    dateOfBirth: string;
    paymentMethod: 'BANK_TRANSFER' | 'PAYMENT_ON_ARRIVAL';
    notes: string;
}

interface FormErrors {
    checkIn?: string;
    checkOut?: string;
    phone?: string;
    dateOfBirth?: string;
    totalGuests?: string;
    dates?: string;
}

interface BookingComponentProps {
    villa: Villa;
    user: User;
    onBookingSuccess?: () => void;
}

const BookingComponent: React.FC<BookingComponentProps> = ({ villa, user, onBookingSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<FormData>({
        checkIn: '',
        checkOut: '',
        totalGuests: 1,
        phone: '',
        dateOfBirth: '',
        paymentMethod: 'BANK_TRANSFER',
        notes: '',
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});

    // Initialize form with user data
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        }));
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};

        if (!formData.checkIn) errors.checkIn = 'Check-in date required';
        if (!formData.checkOut) errors.checkOut = 'Check-out date required';
        if (!formData.phone) errors.phone = 'Phone number required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth required';

        if (formData.checkIn && formData.checkOut) {
            const dateValidation = bookingApi.validateBookingDates(formData.checkIn, formData.checkOut);
            if (!dateValidation.isValid) {
                errors.dates = dateValidation.error;
            }
        }

        if (formData.phone && !/^[\+]?[1-9][\d]{8,14}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
            errors.phone = 'Invalid phone number';
        }

        if (formData.dateOfBirth) {
            const today = new Date();
            const dobDate = new Date(formData.dateOfBirth);
            const age = today.getFullYear() - dobDate.getFullYear();

            if (age < 18) {
                errors.dateOfBirth = 'Must be 18 or older';
            }
        }

        if (formData.totalGuests < 1 || formData.totalGuests > villa.maxGuests) {
            errors.totalGuests = `Must be 1-${villa.maxGuests} guests`;
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            setError('');
            setSuccess('');

            const bookingData = {
                villaId: villa.id,
                checkIn: formData.checkIn,
                checkOut: formData.checkOut,
                totalGuests: formData.totalGuests,
                phone: formData.phone,
                dateOfBirth: formData.dateOfBirth,
                paymentMethod: formData.paymentMethod,
                notes: formData.notes,
            };

            await bookingApi.createBooking(bookingData);
            setSuccess('Booking request submitted successfully!');

            setFormData(prev => ({
                ...prev,
                checkIn: '',
                checkOut: '',
                totalGuests: 1,
                notes: '',
            }));

            onBookingSuccess?.();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to create booking';
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const calculateTotal = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        return villaApi.calculateTotalPrice(Number(villa.pricePerNight), formData.checkIn, formData.checkOut);
    };

    const calculateNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        return villaApi.calculateNights(formData.checkIn, formData.checkOut);
    };

    const serviceFee = Math.round(calculateTotal() * 0.05); // 5% service fee
    const cleaningFee = 150; // Fixed cleaning fee
    const totalWithFees = calculateTotal() + serviceFee + cleaningFee;

    return (
        <div className='sticky top-28 space-y-6'>
            {/* Main Booking Card */}
            <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl overflow-hidden shadow-xl'>
                {/* Header */}
                <div className='p-6 border-b border-[#F8B259]/50 bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20'>
                    <div className='flex items-baseline space-x-2 mb-2'>
                        <span className='text-3xl font-bold text-[#C75D2C]'>{villa.pricePerNight}</span>
                        <span className='text-[#C75D2C]/70 font-medium'>MAD</span>
                        <span className='text-[#C75D2C]/70'>/ night</span>
                    </div>
                    <div className='flex items-center space-x-4 text-sm'>
                        <div className='flex items-center space-x-1'>
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className='w-4 h-4 fill-current text-[#F8B259]' />
                            ))}
                            <span className='font-semibold text-[#C75D2C] ml-2'>5.0</span>
                        </div>
                        <span className='text-[#C75D2C]/60'>• 127 reviews</span>
                    </div>
                </div>

                {/* Booking Form */}
                <div className='p-6'>
                    {success && (
                        <div className='bg-green-50/80 backdrop-blur-sm border-2 border-green-200/60 rounded-xl p-4 mb-6 flex items-start space-x-3'>
                            <Check className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                            <div>
                                <p className='text-green-800 font-semibold'>Booking Submitted!</p>
                                <p className='text-green-700 text-sm mt-1'>{success}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-4 mb-6 flex items-start space-x-3'>
                            <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                            <div>
                                <p className='text-red-800 font-semibold'>Booking Error</p>
                                <p className='text-red-700 text-sm mt-1'>{error}</p>
                            </div>
                        </div>
                    )}

                    <div className='space-y-6'>
                        {/* Dates */}
                        <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl overflow-hidden'>
                            <div className='grid grid-cols-2'>
                                <div className='p-4 border-r border-[#F8B259]/50'>
                                    <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                        Check-in
                                    </label>
                                    <input
                                        type='date'
                                        name='checkIn'
                                        value={formData.checkIn}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none font-medium'
                                    />
                                </div>
                                <div className='p-4'>
                                    <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                        Check-out
                                    </label>
                                    <input
                                        type='date'
                                        name='checkOut'
                                        value={formData.checkOut}
                                        onChange={handleInputChange}
                                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                        className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none font-medium'
                                    />
                                </div>
                            </div>
                            {(formErrors.checkIn || formErrors.checkOut || formErrors.dates) && (
                                <div className='px-4 pb-3 border-t border-[#F8B259]/30'>
                                    <p className='text-red-600 text-xs mt-2 font-medium'>
                                        {formErrors.checkIn || formErrors.checkOut || formErrors.dates}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Guests */}
                        <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-4'>
                            <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                <Users className='w-4 h-4 inline mr-2' />
                                Guests
                            </label>
                            <select
                                name='totalGuests'
                                value={formData.totalGuests}
                                onChange={handleInputChange}
                                className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none font-medium'
                            >
                                {Array.from({ length: villa.maxGuests }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? 'guest' : 'guests'}
                                    </option>
                                ))}
                            </select>
                            {formErrors.totalGuests && (
                                <p className='text-red-600 text-xs mt-2 font-medium'>{formErrors.totalGuests}</p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className='space-y-4'>
                            <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-4'>
                                <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                    <Phone className='w-4 h-4 inline mr-2' />
                                    Phone Number *
                                </label>
                                <input
                                    type='tel'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder='+212 6 12 34 56 78'
                                    className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none placeholder-[#C75D2C]/50 font-medium'
                                />
                                {formErrors.phone && (
                                    <p className='text-red-600 text-xs mt-2 font-medium'>{formErrors.phone}</p>
                                )}
                            </div>

                            <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-4'>
                                <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                    <Calendar className='w-4 h-4 inline mr-2' />
                                    Date of Birth *
                                </label>
                                <input
                                    type='date'
                                    name='dateOfBirth'
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    max={
                                        new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                    className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none font-medium'
                                />
                                {formErrors.dateOfBirth && (
                                    <p className='text-red-600 text-xs mt-2 font-medium'>{formErrors.dateOfBirth}</p>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-4'>
                            <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                <CreditCard className='w-4 h-4 inline mr-2' />
                                Payment Method *
                            </label>
                            <select
                                name='paymentMethod'
                                value={formData.paymentMethod}
                                onChange={handleInputChange}
                                className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none font-medium'
                            >
                                <option value='BANK_TRANSFER'>Bank Transfer</option>
                                <option value='PAYMENT_ON_ARRIVAL'>Payment on Arrival</option>
                            </select>
                        </div>

                        {/* Notes */}
                        <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-4'>
                            <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                <FileText className='w-4 h-4 inline mr-2' />
                                Special Requests
                            </label>
                            <textarea
                                name='notes'
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                maxLength={500}
                                placeholder='Any special requests or requirements...'
                                className='w-full text-sm text-[#C75D2C] bg-transparent focus:outline-none placeholder-[#C75D2C]/50 resize-none font-medium'
                            />
                            <p className='text-xs text-[#C75D2C]/60 mt-2'>{formData.notes.length}/500 characters</p>
                        </div>

                        {/* Price Breakdown */}
                        {formData.checkIn && formData.checkOut && (
                            <div className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-2 border-[#F8B259]/50 rounded-xl p-6'>
                                <h4 className='font-bold text-[#C75D2C] mb-4 font-butler text-lg'>Price Breakdown</h4>
                                <div className='space-y-3 text-sm'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[#C75D2C]/80'>
                                            {villa.pricePerNight} MAD × {calculateNights()} nights
                                        </span>
                                        <span className='font-semibold text-[#C75D2C]'>{calculateTotal()} MAD</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[#C75D2C]/80'>Cleaning fee</span>
                                        <span className='font-semibold text-[#C75D2C]'>{cleaningFee} MAD</span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[#C75D2C]/80'>Service fee</span>
                                        <span className='font-semibold text-[#C75D2C]'>{serviceFee} MAD</span>
                                    </div>
                                    <div className='border-t-2 border-[#F8B259]/50 pt-3 flex justify-between items-center'>
                                        <span className='font-bold text-[#C75D2C] text-lg'>Total</span>
                                        <span className='font-bold text-[#C75D2C] text-lg'>{totalWithFees} MAD</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !formData.checkIn || !formData.checkOut}
                            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all duration-300 ${
                                submitting || !formData.checkIn || !formData.checkOut
                                    ? 'bg-[#C75D2C]/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {submitting ? (
                                <div className='flex items-center justify-center space-x-2'>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                'Request to Book'
                            )}
                        </button>

                        <div className='text-center'>
                            <p className='text-xs text-[#C75D2C]/60 leading-relaxed'>
                                You won't be charged yet. Your booking request will be reviewed and confirmed within 24
                                hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className='grid grid-cols-3 gap-3'>
                <div className='bg-white/30 backdrop-blur-md border border-[#F8B259]/50 rounded-xl p-4 text-center'>
                    <Award className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                    <div className='text-xs font-bold text-[#C75D2C]'>Instant</div>
                    <div className='text-xs text-[#C75D2C]/70'>Confirmation</div>
                </div>
                <div className='bg-white/30 backdrop-blur-md border border-[#F8B259]/50 rounded-xl p-4 text-center'>
                    <Shield className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                    <div className='text-xs font-bold text-[#C75D2C]'>Secure</div>
                    <div className='text-xs text-[#C75D2C]/70'>Booking</div>
                </div>
                <div className='bg-white/30 backdrop-blur-md border border-[#F8B259]/50 rounded-xl p-4 text-center'>
                    <Clock className='w-6 h-6 text-[#D96F32] mx-auto mb-2' />
                    <div className='text-xs font-bold text-[#C75D2C]'>24/7</div>
                    <div className='text-xs text-[#C75D2C]/70'>Support</div>
                </div>
            </div>
        </div>
    );
};

export default BookingComponent;
