import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { userApi, type ChangePasswordData } from '@/api/userApi';

interface ChangePasswordProps {
    onAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onAlert }) => {
    const [loading, setLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Password visibility state
    const [passwordVisibility, setPasswordVisibility] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setPasswordVisibility(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await userApi.changePasswordSafe(passwordForm);

            if (result.success) {
                onAlert('success', 'Password changed successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                const errorMessages = result.errors?.join(', ') || 'Failed to change password';
                onAlert('error', errorMessages);
            }
        } catch (error: any) {
            onAlert('error', error.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center mb-6'>
                <Lock className='w-5 h-5 text-[#D96F32] mr-2' />
                <h2 className='text-xl font-semibold text-[#C75D2C] font-butler'>Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className='max-w-md'>
                <div className='mb-6'>
                    <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                        Current Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D96F32]'>
                            <Lock className='w-4 h-4' />
                        </div>
                        <input
                            type={passwordVisibility.current ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={e =>
                                setPasswordForm(prev => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                }))
                            }
                            placeholder='Enter current password'
                            className='w-full pl-10 pr-12 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => togglePasswordVisibility('current')}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#D96F32] hover:text-[#C75D2C] transition-colors'
                        >
                            {passwordVisibility.current ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        </button>
                    </div>
                </div>

                <div className='mb-6'>
                    <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                        New Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D96F32]'>
                            <Lock className='w-4 h-4' />
                        </div>
                        <input
                            type={passwordVisibility.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={e =>
                                setPasswordForm(prev => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                }))
                            }
                            placeholder='Enter new password'
                            className='w-full pl-10 pr-12 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => togglePasswordVisibility('new')}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#D96F32] hover:text-[#C75D2C] transition-colors'
                        >
                            {passwordVisibility.new ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        </button>
                    </div>
                    <p className='mt-2 text-xs text-[#C75D2C]/70 bg-white/30 border border-[#F8B259]/30 rounded-lg p-2'>
                        Must be at least 8 characters with uppercase, lowercase, and number
                    </p>
                </div>

                <div className='mb-8'>
                    <label className='block text-sm font-medium text-[#C75D2C] mb-2'>
                        Confirm New Password <span className='text-red-500'>*</span>
                    </label>
                    <div className='relative'>
                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D96F32]'>
                            <Lock className='w-4 h-4' />
                        </div>
                        <input
                            type={passwordVisibility.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={e =>
                                setPasswordForm(prev => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                }))
                            }
                            placeholder='Confirm new password'
                            className='w-full pl-10 pr-12 py-3 border-2 border-[#F8B259]/50 rounded-xl bg-white/40 text-[#C75D2C] placeholder-[#C75D2C]/50 focus:outline-none focus:border-[#D96F32] transition-all duration-300'
                            required
                        />
                        <button
                            type='button'
                            onClick={() => togglePasswordVisibility('confirm')}
                            className='absolute inset-y-0 right-0 pr-3 flex items-center text-[#D96F32] hover:text-[#C75D2C] transition-colors'
                        >
                            {passwordVisibility.confirm ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                        </button>
                    </div>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className='bg-gradient-to-r  from-[#D96F32] to-[#C75D2C] cursor-pointer text-white px-8 py-3 rounded-xl hover:from-[#C75D2C] hover:to-[#D96F32] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2'
                >
                    {loading ? (
                        <>
                            <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                            <span>Changing...</span>
                        </>
                    ) : (
                        <>
                            <Lock className='w-4 h-4' />
                            <span>Change Password</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
