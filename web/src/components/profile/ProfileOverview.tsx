import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, RefreshCw, CheckCircle } from 'lucide-react';
import { userApi } from '@/api/userApi';
import type { User as ComponentUser } from '@/utils/types';

interface ProfileOverviewProps {
    user: ComponentUser;
    onAlert: (type: 'success' | 'error' | 'info', message: string) => void;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user, onAlert }) => {
    const [profileStatus, setProfileStatus] = useState<{
        isComplete: boolean;
        missing: string[];
    } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfileStatus = async () => {
            try {
                const status = await userApi.checkProfileComplete();
                setProfileStatus(status);
            } catch (error) {
                console.error('Failed to load profile status:', error);
            }
        };

        loadProfileStatus();
    }, []);

    const refreshProfile = async () => {
        setLoading(true);
        try {
            const updatedUser = await userApi.getProfile();
            if (profileStatus) {
                const status = await userApi.checkProfileComplete();
                setProfileStatus(status);
            }
            onAlert('success', 'Profile refreshed successfully!');
        } catch (error: any) {
            onAlert('error', error.message || 'Failed to refresh profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className='flex items-center mb-6'>
                <User className='w-5 h-5 text-[#D96F32] mr-2' />
                <h2 className='text-xl font-semibold text-[#C75D2C] font-butler'>Profile Overview</h2>
            </div>

            {/* Profile Completeness */}
            {profileStatus && (
                <div
                    className={`backdrop-blur-sm border-2 rounded-xl p-4 mb-6 ${
                        profileStatus.isComplete
                            ? 'bg-green-50/80 border-green-200/60'
                            : 'bg-yellow-50/80 border-yellow-200/60'
                    }`}
                >
                    <div className='flex items-center'>
                        <CheckCircle
                            className={`w-5 h-5 mr-2 ${
                                profileStatus.isComplete ? 'text-green-600' : 'text-yellow-600'
                            }`}
                        />
                        <span
                            className={`font-medium ${profileStatus.isComplete ? 'text-green-800' : 'text-yellow-800'}`}
                        >
                            {profileStatus.isComplete ? 'Your profile is complete!' : 'Your profile is incomplete'}
                        </span>
                    </div>
                    {!profileStatus.isComplete && profileStatus.missing.length > 0 && (
                        <p className='text-yellow-700 mt-1 text-sm'>Missing: {profileStatus.missing.join(', ')}</p>
                    )}
                </div>
            )}

            {/* User Information */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <Mail className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Email</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>{user.email}</p>
                </div>

                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <User className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Full Name</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>{user.fullName}</p>
                </div>

                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <Phone className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Phone</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>{user.phone || 'Not provided'}</p>
                </div>

                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <Calendar className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Date of Birth</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                </div>

                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <Calendar className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Member Since</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>

                <div className='bg-white/30 border border-[#F8B259]/50 rounded-xl p-4'>
                    <div className='flex items-center mb-2'>
                        <RefreshCw className='w-4 h-4 text-[#D96F32] mr-2' />
                        <h3 className='text-sm font-medium text-[#C75D2C]/70'>Last Updated</h3>
                    </div>
                    <p className='text-[#C75D2C] font-medium'>{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;
