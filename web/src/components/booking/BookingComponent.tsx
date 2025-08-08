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
    LogIn,
    X,
} from 'lucide-react';
import bookingApi from '@/api/bookingApi';
import villaApi from '@/api/villaApi';
import DateRangePickerModal from './DateRangePickerModal';
import type { PaymentMethod, User, Villa } from '@/utils/types';

interface FormData {
    checkIn: string;
    checkOut: string;
    totalGuests: number;
    phone: string;
    dateOfBirth: string;
    paymentMethod: PaymentMethod;
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
    user: User | null;
    onBookingSuccess?: () => void;
}

const FORM_STORAGE_KEY = 'booking_form_data';

const BookingComponent: React.FC<BookingComponentProps> = ({ villa, user, onBookingSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false); // New state for date picker modal

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

    // Load form data from localStorage on mount
    useEffect(() => {
        const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedFormData) {
            try {
                const parsedData = JSON.parse(savedFormData);
                setFormData(prev => ({
                    ...prev,
                    ...parsedData,
                }));
            } catch (error) {
                console.warn('Failed to parse saved form data:', error);
            }
        }
    }, []);

    // Initialize form with user data when user is available
    useEffect(() => {
        if (user) {
            const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
            let savedData = {};

            if (savedFormData) {
                try {
                    savedData = JSON.parse(savedFormData);
                } catch (error) {
                    console.warn('Failed to parse saved form data:', error);
                }
            }

            setFormData(prev => ({
                ...prev,
                // Use user data if available, otherwise fall back to saved form data
                phone: user.phone || (savedData as any).phone || '',
                dateOfBirth: user.dateOfBirth
                    ? new Date(user.dateOfBirth).toISOString().split('T')[0]
                    : (savedData as any).dateOfBirth || '',
            }));
        }
    }, [user]);

    // Save form data to localStorage whenever it changes
    const saveFormDataToStorage = (data: FormData) => {
        try {
            localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save form data to localStorage:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value,
        };

        setFormData(newFormData);
        saveFormDataToStorage(newFormData);

        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    // New function to handle date selection from modal
    const handleDateSelect = (checkIn: string, checkOut: string) => {
        const newFormData = {
            ...formData,
            checkIn,
            checkOut,
        };

        setFormData(newFormData);
        saveFormDataToStorage(newFormData);

        // Clear any existing date errors
        setFormErrors(prev => ({
            ...prev,
            checkIn: '',
            checkOut: '',
            dates: '',
        }));
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

        // Check if user is authenticated
        if (!user) {
            setShowSignInModal(true);
            return;
        }

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

            // Clear form data from localStorage after successful booking
            localStorage.removeItem(FORM_STORAGE_KEY);

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

    const handleSignIn = () => {
        // Get current language from URL or default to 'en'
        const currentPath = window.location.pathname;
        const langMatch = currentPath.match(/^\/([a-z]{2})\//);
        const lang = langMatch ? langMatch[1] : 'en';

        // Redirect to sign in page
        window.location.href = `/${lang}/signin`;
    };

    const calculateTotal = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        return villaApi.calculateTotalPrice(villa.pricePerNight, formData.checkIn, formData.checkOut);
    };

    const calculateNights = () => {
        if (!formData.checkIn || !formData.checkOut) return 0;
        return villaApi.calculateNights(formData.checkIn, formData.checkOut);
    };

    // Format date for display
    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const serviceFee = Math.round(calculateTotal() * 0.05); // 5% service fee
    const cleaningFee = 150; // Fixed cleaning fee
    const totalWithFees = calculateTotal() + serviceFee + cleaningFee;

    return (
        <>
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

                        {!user && (
                            <div className='bg-blue-50/80 backdrop-blur-sm border-2 border-blue-200/60 rounded-xl p-4 mb-6 flex items-start space-x-3'>
                                <LogIn className='w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0' />
                                <div>
                                    <p className='text-blue-800 font-semibold'>Sign in required</p>
                                    <p className='text-blue-700 text-sm mt-1'>
                                        You'll need to sign in to complete your booking. Your form data will be saved.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className='space-y-6'>
                            {/* Date Selection - Updated to use modal */}
                            <div
                                className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl overflow-hidden cursor-pointer hover:bg-white/40 transition-colors'
                                onClick={() => setShowDatePicker(true)}
                            >
                                <div className='grid grid-cols-2'>
                                    <div className='p-4 border-r border-[#F8B259]/50'>
                                        <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                            <Calendar className='w-4 h-4 inline mr-1' />
                                            Check-in
                                        </label>
                                        <div className='text-sm text-[#C75D2C] font-medium'>
                                            {formData.checkIn ? formatDisplayDate(formData.checkIn) : 'Add date'}
                                        </div>
                                    </div>
                                    <div className='p-4'>
                                        <label className='block text-xs font-bold text-[#C75D2C] mb-2 uppercase tracking-wider'>
                                            Check-out
                                        </label>
                                        <div className='text-sm text-[#C75D2C] font-medium'>
                                            {formData.checkOut ? formatDisplayDate(formData.checkOut) : 'Add date'}
                                        </div>
                                    </div>
                                </div>
                                {formData.checkIn && formData.checkOut && (
                                    <div className='px-4 pb-3 border-t border-[#F8B259]/30 bg-[#F8B259]/10'>
                                        <div className='flex items-center justify-center space-x-2 mt-2'>
                                            <Clock className='w-4 h-4 text-[#D96F32]' />
                                            <span className='text-sm font-semibold text-[#C75D2C]'>
                                                {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                                            </span>
                                        </div>
                                    </div>
                                )}
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
                                        <p className='text-red-600 text-xs mt-2 font-medium'>
                                            {formErrors.dateOfBirth}
                                        </p>
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
                                    <h4 className='font-bold text-[#C75D2C] mb-4 font-butler text-lg'>
                                        Price Breakdown
                                    </h4>
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
                                            <span className='font-bold text-[#C75D2C] text-lg'>
                                                {totalWithFees} MAD
                                            </span>
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
                                ) : user ? (
                                    'Request to Book'
                                ) : (
                                    <div className='flex items-center justify-center space-x-2'>
                                        <LogIn className='w-5 h-5' />
                                        <span>Sign in to Book</span>
                                    </div>
                                )}
                            </button>

                            <div className='text-center'>
                                <p className='text-xs text-[#C75D2C]/60 leading-relaxed'>
                                    {user
                                        ? "You won't be charged yet. Your booking request will be reviewed and confirmed within 24 hours."
                                        : 'Sign in to complete your booking. Your form data will be saved automatically.'}
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

            <DateRangePickerModal
                isOpen={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                villaId={villa.id}
                onDateSelect={handleDateSelect}
                initialCheckIn={formData.checkIn}
                initialCheckOut={formData.checkOut}
            />

            {/* Sign In Modal */}
            {showSignInModal && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                    <div className='bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-2xl font-bold text-[#C75D2C] font-butler'>Sign in Required</h3>
                            <button
                                onClick={() => setShowSignInModal(false)}
                                className='p-2 hover:bg-[#F8B259]/20 rounded-xl transition-colors group'
                            >
                                <X className='w-5 h-5 text-[#C75D2C] group-hover:rotate-90 transition-transform duration-200 cursor-pointer' />
                            </button>
                        </div>

                        <div className='text-center mb-6'>
                            <p className='text-[#C75D2C] mb-4'>
                                To complete your booking for <strong className='text-[#D96F32]'>{villa.title}</strong>,
                                please sign in to your account.
                            </p>
                        </div>

                        <div className='flex flex-col space-y-3'>
                            <button
                                onClick={handleSignIn}
                                className='w-full bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white py-3 px-6 rounded-xl font-bold hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg flex items-center justify-center space-x-2'
                            >
                                <LogIn className='w-5 h-5' />
                                <span>Sign In</span>
                            </button>
                            <button
                                onClick={() => setShowSignInModal(false)}
                                className='w-full bg-white/50 text-[#C75D2C] py-3 px-6 rounded-xl font-semibold border-2 border-[#F8B259]/50 hover:bg-white/70 transition-all duration-300'
                            >
                                Continue as Guest
                            </button>
                            <p className='text-sm text-center text-[#C75D2C]/70'>
                                <strong>Note:</strong> Continuing as a guest will not allow you to complete the booking.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BookingComponent;
