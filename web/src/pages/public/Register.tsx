import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

export const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        dateOfBirth: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const { register, isAuthenticated, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Clear errors when component mounts
    useEffect(() => {
        clearError();
        setLocalError('');
    }, [clearError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setLocalError('Please fill in all required fields');
            return false;
        }

        if (formData.password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return false;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return false;
        }

        if (formData.phoneNumber && !/^\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            setLocalError('Please enter a valid phone number (10-15 digits)');
            return false;
        }

        if (formData.dateOfBirth) {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            if (birthDate > today) {
                setLocalError('Date of birth cannot be in the future');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!validateForm()) {
            return;
        }

        try {
            const registerData = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber ? parseInt(formData.phoneNumber.replace(/\s/g, '')) : undefined,
                dateOfBirth: formData.dateOfBirth || undefined,
            };
            await register(registerData);
            // Navigation will be handled by the useEffect above
        } catch (err: any) {
            setLocalError(err.message || 'Registration failed. Please try again.');
        }
    };

    const displayError = localError || error;

    if (isAuthenticated) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-lg'>Redirecting...</div>
            </div>
        );
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Create Account</h2>

            {displayError && (
                <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{displayError}</div>
            )}

            <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 mb-2'>
                            First Name *
                        </label>
                        <input
                            id='firstName'
                            name='firstName'
                            type='text'
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            required
                            disabled={isLoading}
                            placeholder='First name'
                        />
                    </div>

                    <div>
                        <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 mb-2'>
                            Last Name *
                        </label>
                        <input
                            id='lastName'
                            name='lastName'
                            type='text'
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            required
                            disabled={isLoading}
                            placeholder='Last name'
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email *
                    </label>
                    <input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                        disabled={isLoading}
                        placeholder='Enter your email'
                    />
                </div>

                <div>
                    <label htmlFor='phoneNumber' className='block text-sm font-medium text-gray-700 mb-2'>
                        Phone Number
                    </label>
                    <input
                        id='phoneNumber'
                        name='phoneNumber'
                        type='tel'
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        disabled={isLoading}
                        placeholder='Enter your phone number'
                    />
                </div>

                <div>
                    <label htmlFor='dateOfBirth' className='block text-sm font-medium text-gray-700 mb-2'>
                        Date of Birth
                    </label>
                    <div className='relative'>
                        <input
                            id='dateOfBirth'
                            name='dateOfBirth'
                            type='date'
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            disabled={isLoading}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                    </div>
                </div>

                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                        Password *
                    </label>
                    <input
                        id='password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                        disabled={isLoading}
                        placeholder='Enter your password'
                        minLength={6}
                    />
                </div>

                <div>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                        Confirm Password *
                    </label>
                    <input
                        id='confirmPassword'
                        type='password'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                        disabled={isLoading}
                        placeholder='Confirm your password'
                        minLength={6}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>

            <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                    Already have an account?{' '}
                    <Link to='/login' className='text-blue-500 hover:text-blue-600 font-medium'>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};