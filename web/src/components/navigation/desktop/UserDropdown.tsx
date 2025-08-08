import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, UserCircle, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import type { AuthContextType } from '@/utils/types';

interface UserDropdownProps {
    lang: string;
    authContext: AuthContextType;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ lang, authContext }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout, isHost, isAdmin } = authContext;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await logout();
        setIsOpen(false);
    };

    const toggleDropdown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className='group relative flex items-center cursor-pointer justify-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] hover:bg-white/60 hover:border-[#D96F32] hover:-translate-y-0.5 shadow-lg hover:shadow-xl min-w-[8rem]'
            >
                <UserCircle className='w-4 h-4 flex-shrink-0' />
                <span className='font-semibold max-w-16 truncate'>{user?.fullName?.split(' ')[0]}</span>
                <ChevronDown
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border-2 border-[#F8B259]/70 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-down'>
                    {/* User Info Header */}
                    <div className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 px-4 py-3 border-b border-[#F8B259]/50'>
                        <div className='flex items-center space-x-3'>
                            <div className='w-10 h-10 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center flex-shrink-0'>
                                <span className='text-white font-bold text-lg'>
                                    {user?.fullName?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className='min-w-0 flex-1'>
                                <p className='font-bold text-[#C75D2C] text-sm truncate'>{user?.fullName}</p>
                                <p className='text-[#C75D2C]/70 text-xs truncate'>{user?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Links */}
                    <div className='py-2'>
                        <Link
                            to={`/${lang}/profile`}
                            onClick={() => setIsOpen(false)}
                            className='flex items-center space-x-3 px-4 py-3 text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#C75D2C] transition-colors duration-200'
                        >
                            <UserCircle className='w-5 h-5 flex-shrink-0' />
                            <span className='font-medium'>Profile</span>
                        </Link>

                        <Link
                            to={`/${lang}/my-bookings`}
                            onClick={() => setIsOpen(false)}
                            className='flex items-center space-x-3 px-4 py-3 text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#C75D2C] transition-colors duration-200'
                        >
                            <BookOpen className='w-5 h-5 flex-shrink-0' />
                            <span className='font-medium'>My Bookings</span>
                        </Link>

                        {(isHost() || isAdmin()) && (
                            <Link
                                to={`/${lang}/admin`}
                                onClick={() => setIsOpen(false)}
                                className='flex items-center space-x-3 px-4 py-3 text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#C75D2C] transition-colors duration-200'
                            >
                                <LayoutDashboard className='w-5 h-5 flex-shrink-0' />
                                <span className='font-medium'>Dashboard</span>
                            </Link>
                        )}

                        <div className='border-t border-[#F8B259]/50 mt-2 pt-2'>
                            <button
                                onClick={handleLogout}
                                className='flex items-center cursor-pointer space-x-3 px-4 py-3 w-full text-left text-[#C75D2C] hover:bg-red-50 hover:text-red-600 transition-colors duration-200'
                            >
                                <LogOut className='w-5 h-5 flex-shrink-0' />
                                <span className='font-medium'>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
