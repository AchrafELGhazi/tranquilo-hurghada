import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            setError('');
            // Navigate to the home page or dashboard after successful login
            //   navigate('/');
            console.log('user hna', user);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };
    if (isLoading) {
        return <div>Logging in...</div>;
    }
    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
            <h2 className='text-2xl font-bold mb-4'>Login</h2>
            {error && <p className='text-red-500 mb-4'>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block mb-2'>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block mb-2'>Password</label>
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className='w-full p-2 border rounded'
                        required
                    />
                </div>
                <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600'>
                    Login
                </button>
            </form>
        </div>
    );
};
