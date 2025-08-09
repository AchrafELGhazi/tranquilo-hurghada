import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import type { AuthContextType } from '@/utils/types';

interface MobileUserSectionProps {
    lang: string;
    authContext: AuthContextType;
    onClose: () => void;
}

export const MobileUserSection: React.FC<MobileUserSectionProps> = ({ lang, authContext, onClose }) => {
    const { user, logout, isHost, isAdmin } = authContext;

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
        onClose();
    };

    return (
        <div className='mt-4 pt-3 border-t border-[#F8B259]/50'>
            <div className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 rounded-xl p-3 mb-2'>
                {/* User Info */}
                <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center flex-shrink-0'>
                        <span className='text-white font-bold text-lg'>{user?.fullName?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className='min-w-0 flex-1'>
                        <p className='font-bold text-[#C75D2C] text-sm truncate'>{user?.fullName}</p>
                        <p className='text-[#C75D2C]/70 text-xs truncate'>{user?.email}</p>
                    </div>
                </div>

                {/* User Menu Links */}
                <div className='space-y-0.5'>
                    <Link
                        to={`/${lang}/profile`}
                        onClick={onClose}
                        className='flex items-center space-x-3 px-2 py-2 text-[#C75D2C] hover:bg-white/40 rounded-lg transition-colors duration-200'
                    >
                        <UserCircle className='w-4 h-4 flex-shrink-0' />
                        <span className='text-sm font-medium'>Profile</span>
                    </Link>

                    <Link
                        to={`/${lang}/my-bookings`}
                        onClick={onClose}
                        className='flex items-center space-x-3 px-2 py-2 text-[#C75D2C] hover:bg-white/40 rounded-lg transition-colors duration-200'
                    >
                        <BookOpen className='w-4 h-4 flex-shrink-0' />
                        <span className='text-sm font-medium'>My Bookings</span>
                    </Link>

                    {(isHost() || isAdmin()) && (
                        <Link
                            to={`/${lang}/admin`}
                            onClick={onClose}
                            className='flex items-center space-x-3 px-2 py-2 text-[#C75D2C] hover:bg-white/40 rounded-lg transition-colors duration-200'
                        >
                            <LayoutDashboard className='w-4 h-4 flex-shrink-0' />
                            <span className='text-sm font-medium'>Dashboard</span>
                        </Link>
                    )}

                    <button
                        onClick={handleLogout}
                        className='flex items-center cursor-pointer space-x-3 px-2 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200'
                    >
                        <LogOut className='w-4 h-4 flex-shrink-0' />
                        <span className='text-sm font-medium'>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
