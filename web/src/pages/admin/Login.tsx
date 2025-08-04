import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
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
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-lg'>Redirecting...</div>
            </div>
        );
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>

            {displayError && (
                <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{displayError}</div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                    </label>
                    <input
                        id='email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                        disabled={isLoading}
                        placeholder='Enter your email'
                    />
                </div>

                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        required
                        disabled={isLoading}
                        placeholder='Enter your password'
                    />
                </div>

                <button
                    type='submit'
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                        isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                    Don't have an account?{' '}
                    <Link to='/register' className='text-blue-500 hover:text-blue-600 font-medium'>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};
