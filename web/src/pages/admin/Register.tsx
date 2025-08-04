import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Register = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [firstName, setFirstName] = useState('');
      const [lastName, setLastName] = useState('');
      const [error, setError] = useState('');
      const { register,user } = useAuth();
      const navigate = useNavigate();

      const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                  await register({ email, password, firstName, lastName });
                //   navigate('/');
                console.log(user)
            } catch (err) {
                  setError('Registration failed. Please try again.');
            }
      };

      return (
            <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
                  <h2 className='text-2xl font-bold mb-4'>Register</h2>
                  {error && <p className='text-red-500 mb-4'>{error}</p>}
                  <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                              <label className='block mb-2'>First Name</label>
                              <input
                                    type='text'
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    className='w-full p-2 border rounded'
                                    required
                              />
                        </div>
                        <div className='mb-4'>
                              <label className='block mb-2'>Last Name</label>
                              <input
                                    type='text'
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    className='w-full p-2 border rounded'
                                    required
                              />
                        </div>
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
                              Register
                        </button>
                  </form>
            </div>
      );
};
