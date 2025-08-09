import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, AlertCircle, Mail, Crown, Shield } from 'lucide-react';
import { THToaster } from '@/components/common/Toast';
import ProfileOverview from '@/components/profile/ProfileOverview';
import EditProfile from '@/components/profile/EditProfile';
import ChangePassword from '@/components/profile/ChangePassword';
import AccountSettings from '@/components/profile/AccountSettings';

interface TabProps {
    id: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 cursor-pointer font-medium text-sm rounded-xl transition-all duration-300 ${
            isActive
                ? 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white shadow-lg'
                : 'bg-white/50 text-[#C75D2C] hover:bg-white/70 border-2 border-[#F8B259]/50'
        }`}
    >
        {label}
    </button>
);

const Profile: React.FC = () => {
    const { user: authUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Crown className='w-5 h-5 text-purple-600' />;
            case 'HOST':
                return <Shield className='w-5 h-5 text-green-600' />;
            default:
                return <User className='w-5 h-5 text-blue-600' />;
        }
    };

    const getRoleBadge = (role: string) => {
        const configs = {
            ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
            HOST: 'bg-green-100 text-green-800 border-green-200',
            GUEST: 'bg-blue-100 text-blue-800 border-blue-200',
        };

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    configs[role as keyof typeof configs]
                }`}
            >
                {getRoleIcon(role)}
                <span className='ml-1'>{role}</span>
            </span>
        );
    };

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'profile', label: 'Edit Profile' },
        { id: 'password', label: 'Change Password' },
        { id: 'account', label: 'Account Settings' },
    ];

    const renderTabContent = () => {
        if (!authUser) return null;

        switch (activeTab) {
            case 'overview':
                return <ProfileOverview user={authUser} />;

            case 'profile':
                return <EditProfile user={authUser} />;

            case 'password':
                return <ChangePassword />;

            case 'account':
                return <AccountSettings onLogout={logout} />;

            default:
                return <ProfileOverview user={authUser} />;
        }
    };

    if (!authUser) {
        return (
            <div className='min-h-screen bg-[#E8DCC6] flex items-center justify-center'>
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-8 text-center'>
                    <AlertCircle className='w-12 h-12 text-[#D96F32] mx-auto mb-4' />
                    <h2 className='text-xl font-bold text-[#C75D2C] mb-2'>Please Sign In</h2>
                    <p className='text-[#C75D2C]/70'>You need to be signed in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#E8DCC6] py-8 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-4xl mx-auto space-y-6'>
                {/* Header */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <div className='flex items-center space-x-4'>
                            <div className='bg-gradient-to-br from-[#F8B259]/30 to-[#D96F32]/30 p-4 rounded-2xl'>
                                <User className='w-8 h-8 text-[#D96F32]' />
                            </div>
                            <div>
                                <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>{authUser.fullName}</h1>
                                <p className='text-[#C75D2C]/70 flex items-center mt-1'>
                                    <Mail className='w-4 h-4 mr-1' />
                                    {authUser.email}
                                </p>
                                <div className='mt-2'>{getRoleBadge(authUser.role)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-3'>
                    {tabs.map(tab => (
                        <Tab
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            isActive={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    {renderTabContent()}
                </div>
            </div>

            <THToaster position='bottom-right' />
        </div>
    );
};

export default Profile;
