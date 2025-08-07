import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from 'lucide-react';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            <div className='min-h-screen bg-[#F3E9DC] flex items-center justify-center'>
                <div className='text-lg text-[#C75D2C] font-medium'>Redirecting...</div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#F3E9DC] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8'>
            <div className='w-full max-w-4xl'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-[#C75D2C] mb-2'>Create Your Account</h2>
                    <p className='text-[#C75D2C]/70 text-sm'>Join us today and get started</p>
                </div>

                {/* Register Form */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/60 rounded-2xl p-8'>
                    {displayError && (
                        <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'>
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Name Fields Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* First Name */}
                            <div>
                                <label htmlFor='firstName' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                    First Name *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <User className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='firstName'
                                        name='firstName'
                                        type='text'
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        required
                                        disabled={isLoading}
                                        placeholder='First name'
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div>
                                <label htmlFor='lastName' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                    Last Name *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <User className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='lastName'
                                        name='lastName'
                                        type='text'
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        required
                                        disabled={isLoading}
                                        placeholder='Last name'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email and Phone Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Email Field */}
                            <div>
                                <label htmlFor='email' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                    Email Address *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Mail className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='email'
                                        name='email'
                                        type='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        required
                                        disabled={isLoading}
                                        placeholder='Enter your email'
                                    />
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label
                                    htmlFor='phoneNumber'
                                    className='block text-sm font-semibold text-[#C75D2C] mb-2'
                                >
                                    Phone Number
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Phone className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        type='tel'
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        disabled={isLoading}
                                        placeholder='Enter your phone number'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div>
                                <label
                                    htmlFor='dateOfBirth'
                                    className='block text-sm font-semibold text-[#C75D2C] mb-2'
                                >
                                    Date of Birth
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Calendar className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='dateOfBirth'
                                        name='dateOfBirth'
                                        type='date'
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        disabled={isLoading}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div></div> {/* Empty div for spacing */}
                        </div>

                        {/* Password Fields Row */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Password Field */}
                            <div>
                                <label htmlFor='password' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                    Password *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='password'
                                        name='password'
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='w-full pl-12 pr-12 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        required
                                        disabled={isLoading}
                                        placeholder='Enter your password'
                                        minLength={6}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute inset-y-0 right-0 pr-4 flex items-center text-[#D96F32]/60 hover:text-[#D96F32] transition-colors duration-200'
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    htmlFor='confirmPassword'
                                    className='block text-sm font-semibold text-[#C75D2C] mb-2'
                                >
                                    Confirm Password *
                                </label>
                                <div className='relative'>
                                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                        <Lock className='h-5 w-5 text-[#D96F32]/60' />
                                    </div>
                                    <input
                                        id='confirmPassword'
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className='w-full pl-12 pr-12 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                        required
                                        disabled={isLoading}
                                        placeholder='Confirm your password'
                                        minLength={6}
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className='absolute inset-y-0 right-0 pr-4 flex items-center text-[#D96F32]/60 hover:text-[#D96F32] transition-colors duration-200'
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className='h-5 w-5' />
                                        ) : (
                                            <Eye className='h-5 w-5' />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                                isLoading
                                    ? 'bg-[#C75D2C]/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] hover:from-[#C75D2C] hover:to-[#D96F32] hover:transform hover:-translate-y-0.5 active:transform active:translate-y-0'
                            }`}
                        >
                            {isLoading ? (
                                <div className='flex items-center justify-center space-x-2'>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    <span>Creating Account...</span>
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className='mt-8 text-center'>
                        <p className='text-sm text-[#C75D2C]/70'>
                            Already have an account?{' '}
                            <Link
                                to='/login'
                                className='font-semibold text-[#D96F32] hover:text-[#C75D2C] transition-colors duration-200 underline underline-offset-2 decoration-2 decoration-[#F8B259]/50 hover:decoration-[#F8B259]'
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='mt-8 text-center'>
                    <p className='text-xs text-[#C75D2C]/50'>Your information is secure and protected</p>
                </div>
            </div>
        </div>
    );
};
