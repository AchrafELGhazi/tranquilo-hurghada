import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, ChevronDown, LogOut, Settings, User, Home } from 'lucide-react';

export const AdminHeader: React.FC = () => {
    const { t } = useTranslation();
    const { lang } = useParams();
    const { user, logout } = useAuth();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.href = `/${lang}/signin`;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className='bg-white/40 backdrop-blur-md border-b-2 border-[#F8B259]/50 shadow-lg relative z-40'>
            <div className='px-6 py-4'>
                <div className='flex justify-between items-center'>
                    {/* Breadcrumb or Page Title */}
                    <div className='flex items-center space-x-4'>
                        <h1 className='text-2xl font-bold text-[#C75D2C] font-butler'>{t('admin.dashboard')}</h1>
                    </div>

                    {/* Header Actions */}
                    <div className='flex items-center space-x-4'>
                        {/* Back to Site */}
                        <Link
                            to={`/${lang}`}
                            className='flex items-center space-x-2 px-4 py-2 text-sm font-medium text-[#C75D2C] hover:text-[#D96F32] bg-white/30 hover:bg-white/50 border-2 border-[#F8B259]/50 rounded-xl transition-all duration-300 cursor-pointer'
                        >
                            <Home className='w-4 h-4' />
                            <span>{t('admin.backToSite')}</span>
                        </Link>

                        {/* Language Selector */}
                        <div className='bg-white/30 border-2 border-[#F8B259]/50 rounded-xl p-1'>
                            <LanguageSelector />
                        </div>

                        {/* Profile Dropdown */}
                        <div className='relative z-50'>
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className='flex items-center cursor-pointer space-x-3 p-3 text-sm font-medium text-[#C75D2C] hover:text-[#D96F32] bg-white/30 hover:bg-white/50 border-2 border-[#F8B259]/50 rounded-xl transition-all duration-300'
                            >
                                <div className='w-8 h-8 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] rounded-xl flex items-center justify-center shadow-lg'>
                                    <span className='text-sm font-bold text-white'>
                                        {user ? getInitials(user.fullName) : 'A'}
                                    </span>
                                </div>
                                <div className='text-left hidden sm:block'>
                                    <div className='font-semibold text-[#C75D2C]'>
                                        {user ? `${user.fullName}` : 'Admin'}
                                    </div>
                                    <div className='text-xs text-[#C75D2C]/70 capitalize'>
                                        {user?.role.toLowerCase() || 'Administrator'}
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        showProfileDropdown ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className='absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-md border-2 border-[#F8B259]/50 rounded-xl shadow-xl overflow-hidden z-[60]'>
                                    {/* User Info Header */}
                                    <div className='px-4 py-3 bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 border-b border-[#F8B259]/30'>
                                        <div className='flex items-center space-x-3'>
                                            <div className='w-10 h-10 bg-gradient-to-r from-[#D96F32] to-[#C75D2C] rounded-xl flex items-center justify-center shadow-lg'>
                                                <span className='text-white font-bold'>
                                                    {user ? getInitials(user.fullName) : 'A'}
                                                </span>
                                            </div>
                                            <div>
                                                <div className='font-semibold text-[#C75D2C]'>
                                                    {user ? `${user.fullName}` : 'Admin User'}
                                                </div>
                                                <div className='text-sm text-[#C75D2C]/70'>
                                                    {user?.email || 'admin@example.com'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className='py-2'>
                                        <Link to={`/${lang}/profile`}>
                                            <button className='w-full cursor-pointer flex items-center space-x-3 px-4 py-3 text-sm text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#D96F32] transition-colors'>
                                                <User className='w-4 h-4' />
                                                <span>Profile Settings</span>
                                            </button>
                                        </Link>

                                        <div className='border-t border-[#F8B259]/30 mt-2 pt-2'>
                                            <button
                                                onClick={handleLogout}
                                                className='w-full cursor-pointer flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors'
                                            >
                                                <LogOut className='w-4 h-4' />
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
