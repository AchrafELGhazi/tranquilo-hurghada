import React, { useState, useEffect } from 'react';
import { Calendar, Users, Phone, CreditCard, FileText, AlertCircle, Check } from 'lucide-react';
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
        <div className='sticky top-6 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden'>
            {/* Header */}
            <div className='p-6 border-b border-gray-100'>
                <div className='flex items-baseline space-x-1 mb-1'>
                    <span className='text-2xl font-semibold'>{villa.pricePerNight} MAD</span>
                    <span className='text-gray-600'>night</span>
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>4.9</span>
                    <span className='mx-1'>·</span>
                    <span className='underline'>23 reviews</span>
                </div>
            </div>

            {/* Booking Form */}
            <div className='p-6'>
                {success && (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3'>
                        <Check className='w-5 h-5 text-green-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-green-800 font-medium'>Booking submitted!</p>
                            <p className='text-green-700 text-sm mt-1'>{success}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3'>
                        <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
                        <div>
                            <p className='text-red-800 font-medium'>Error</p>
                            <p className='text-red-700 text-sm mt-1'>{error}</p>
                        </div>
                    </div>
                )}

                <div className='space-y-4'>
                    {/* Dates */}
                    <div className='border border-gray-300 rounded-lg overflow-hidden'>
                        <div className='grid grid-cols-2'>
                            <div className='p-3 border-r border-gray-300'>
                                <label className='block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide'>
                                    Check-in
                                </label>
                                <input
                                    type='date'
                                    name='checkIn'
                                    value={formData.checkIn}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className='w-full text-sm focus:outline-none'
                                />
                            </div>
                            <div className='p-3'>
                                <label className='block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide'>
                                    Check-out
                                </label>
                                <input
                                    type='date'
                                    name='checkOut'
                                    value={formData.checkOut}
                                    onChange={handleInputChange}
                                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                                    className='w-full text-sm focus:outline-none'
                                />
                            </div>
                        </div>
                        {(formErrors.checkIn || formErrors.checkOut || formErrors.dates) && (
                            <div className='px-3 pb-2'>
                                <p className='text-red-500 text-xs'>
                                    {formErrors.checkIn || formErrors.checkOut || formErrors.dates}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Guests */}
                    <div className='border border-gray-300 rounded-lg p-3'>
                        <label className='block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide'>
                            Guests
                        </label>
                        <select
                            name='totalGuests'
                            value={formData.totalGuests}
                            onChange={handleInputChange}
                            className='w-full text-sm focus:outline-none'
                        >
                            {Array.from({ length: villa.maxGuests }, (_, i) => i + 1).map(num => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'guest' : 'guests'}
                                </option>
                            ))}
                        </select>
                        {formErrors.totalGuests && (
                            <p className='text-red-500 text-xs mt-1'>{formErrors.totalGuests}</p>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className='space-y-3'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                <Phone className='w-4 h-4 inline mr-2' />
                                Phone Number *
                            </label>
                            <input
                                type='tel'
                                name='phone'
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder='+212 6 12 34 56 78'
                                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                            {formErrors.phone && <p className='text-red-500 text-xs mt-1'>{formErrors.phone}</p>}
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                <Calendar className='w-4 h-4 inline mr-2' />
                                Date of Birth *
                            </label>
                            <input
                                type='date'
                                name='dateOfBirth'
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            />
                            {formErrors.dateOfBirth && (
                                <p className='text-red-500 text-xs mt-1'>{formErrors.dateOfBirth}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <CreditCard className='w-4 h-4 inline mr-2' />
                            Payment Method *
                        </label>
                        <select
                            name='paymentMethod'
                            value={formData.paymentMethod}
                            onChange={handleInputChange}
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        >
                            <option value='BANK_TRANSFER'>Bank Transfer</option>
                            <option value='PAYMENT_ON_ARRIVAL'>Payment on Arrival</option>
                        </select>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            <FileText className='w-4 h-4 inline mr-2' />
                            Special Requests
                        </label>
                        <textarea
                            name='notes'
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            maxLength={500}
                            placeholder='Any special requests...'
                            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                        />
                        <p className='text-xs text-gray-500 mt-1'>{formData.notes.length}/500 characters</p>
                    </div>

                    {/* Price Breakdown */}
                    {formData.checkIn && formData.checkOut && (
                        <div className='border-t border-gray-200 pt-4 space-y-3'>
                            <h4 className='font-medium text-gray-900'>Price breakdown</h4>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span className='underline'>
                                        {villa.pricePerNight} MAD × {calculateNights()} nights
                                    </span>
                                    <span>{calculateTotal()} MAD</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='underline'>Cleaning fee</span>
                                    <span>{cleaningFee} MAD</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='underline'>Service fee</span>
                                    <span>{serviceFee} MAD</span>
                                </div>
                                <div className='border-t border-gray-200 pt-2 flex justify-between font-semibold'>
                                    <span>Total</span>
                                    <span>{totalWithFees} MAD</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !formData.checkIn || !formData.checkOut}
                        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                            submitting || !formData.checkIn || !formData.checkOut
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                        }`}
                    >
                        {submitting ? 'Submitting...' : 'Request to Book'}
                    </button>

                    <p className='text-xs text-gray-500 text-center'>
                        You won't be charged yet. Your booking request will be sent to the host for approval.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingComponent;
