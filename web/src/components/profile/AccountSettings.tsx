import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { userApi } from '@/api/userApi';

interface AccountSettingsProps {
    onAlert: (type: 'success' | 'error' | 'info', message: string) => void;
    onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onAlert, onLogout }) => {
    const [loading, setLoading] = useState(false);

    const handleAccountDeactivation = async () => {
        const password = prompt('Please enter your password to confirm account deactivation:');
        if (!password) return;

        setLoading(true);
        try {
            await userApi.deactivateAccount(password);
            onAlert('success', 'Account deactivated successfully. You will be logged out.');
            setTimeout(() => onLogout(), 2000);
        } catch (error: any) {
            onAlert('error', error.message || 'Failed to deactivate account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center mb-6'>
                <Trash2 className='w-5 h-5 text-[#D96F32] mr-2' />
                <h2 className='text-xl font-semibold text-[#C75D2C] font-butler'>Account Settings</h2>
            </div>

            <div className='bg-red-50/80 backdrop-blur-sm border-2 border-red-200/60 rounded-xl p-6'>
                <div className='flex items-start space-x-4'>
                    <div className='bg-red-100 p-3 rounded-xl'>
                        <AlertCircle className='w-6 h-6 text-red-600' />
                    </div>
                    <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-red-800 mb-2'>Danger Zone</h3>
                        <p className='text-red-700 mb-4 text-sm leading-relaxed'>
                            Deactivating your account will prevent you from logging in and accessing your data. This
                            action cannot be undone and you will lose access to all your bookings and profile
                            information.
                        </p>
                        <button
                            onClick={handleAccountDeactivation}
                            disabled={loading}
                            className='bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2'
                        >
                            {loading ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                                    <span>Deactivating...</span>
                                </>
                            ) : (
                                <>
                                    <Trash2 className='w-4 h-4' />
                                    <span>Deactivate Account</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
