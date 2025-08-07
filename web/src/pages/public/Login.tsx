import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link, useParams } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { lang } = useParams();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        clearError();

        if (!email || !password) {
            setLocalError('Please fill in all fields');
            return;
        }

        try {
            await login({ email, password });
            // Navigation will be handled by the useEffect above
        } catch (err: any) {
            setLocalError(err.message || 'Login failed. Please check your credentials.');
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
        <div className='min-h-screen bg-[#F3E9DC] flex items-center justify-center px-4 sm:px-6 lg:px-8 -mt-6'>
            <div className='w-full max-w-md'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h2 className='text-3xl font-bold text-[#C75D2C] mb-2'>Welcome Back</h2>
                    <p className='text-[#C75D2C]/70 text-sm'>Please sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/60 rounded-2xl p-8'>
                    {displayError && (
                        <div className='mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm'>
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Email Field */}
                        <div>
                            <label htmlFor='email' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Mail className='h-5 w-5 text-[#D96F32]/60' />
                                </div>
                                <input
                                    id='email'
                                    type='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className='w-full pl-12 pr-4 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                    required
                                    disabled={isLoading}
                                    placeholder='Enter your email'
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor='password' className='block text-sm font-semibold text-[#C75D2C] mb-2'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-[#D96F32]/60' />
                                </div>
                                <input
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className='w-full pl-12 pr-12 py-3 border-2 border-[#F8B259]/60 rounded-xl bg-white/50 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] focus:bg-white/80 transition-all duration-300'
                                    required
                                    disabled={isLoading}
                                    placeholder='Enter your password'
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
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className='mt-8 text-center'>
                        <p className='text-sm text-[#C75D2C]/70'>
                            Don't have an account?{' '}
                            <Link
                                to={`/${lang}/register`}
                                className='font-semibold text-[#D96F32] hover:text-[#C75D2C] transition-colors duration-200 underline underline-offset-2 decoration-2 decoration-[#F8B259]/50 hover:decoration-[#F8B259]'
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className='mt-8 text-center'>
                    <p className='text-xs text-[#C75D2C]/50'>Secure login powered by modern encryption</p>
                </div>
            </div>
        </div>
    );
};
