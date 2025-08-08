import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    User,
    CheckCircle,
    AlertCircle,
    Mail,
    Crown,
    Shield,
    X,
} from 'lucide-react';
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
        className={`px-6 py-3  cursor-pointer font-medium text-sm rounded-xl transition-all duration-300 ${
            isActive
                ? 'bg-gradient-to-r from-[#D96F32] to-[#C75D2C] text-white shadow-lg'
                : 'bg-white/50 text-[#C75D2C] hover:bg-white/70 border-2 border-[#F8B259]/50'
        }`}
    >
        {label}
    </button>
);

interface AlertProps {
    type: 'success' | 'error' | 'info';
    message: string;
    onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    const bgColor =
        type === 'success'
            ? 'bg-green-50/80 border-green-200/60'
            : type === 'error'
            ? 'bg-red-50/80 border-red-200/60'
            : 'bg-blue-50/80 border-blue-200/60';

    const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';

    const Icon = type === 'success' ? CheckCircle : AlertCircle;

    return (
        <div className={`${bgColor} backdrop-blur-sm border-2 rounded-xl p-4 flex items-start space-x-3 mb-6`}>
            <Icon className={`w-5 h-5 ${textColor} mt-0.5 flex-shrink-0`} />
            <div className='flex-1'>
                <p className={`${textColor} font-semibold`}>
                    {type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}
                </p>
                <p className={`${textColor} text-sm mt-1`}>{message}</p>
            </div>
            <button onClick={onClose} className={`${textColor} hover:opacity-70 transition-opacity`}>
                <X className='w-5 h-5' />
            </button>
        </div>
    );
};

const Profile: React.FC = () => {
    const { user: authUser, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

    const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), 5000);
    };

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
                return <ProfileOverview user={authUser} onAlert={showAlert} />;
            case 'profile':
                return <EditProfile user={authUser} onAlert={showAlert} />;
            case 'password':
                return <ChangePassword onAlert={showAlert} />;
            case 'account':
                return <AccountSettings onAlert={showAlert} onLogout={logout} />;
            default:
                return <ProfileOverview user={authUser} onAlert={showAlert} />;
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

                {/* Alert */}
                {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

                {/* Tabs */}
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

                {/* Tab Content */}
                <div className='bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl p-6'>
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;