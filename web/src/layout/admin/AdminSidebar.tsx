import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Calendar, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { lang } = useParams();
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const adminNavigation = [
        {
            name: t('admin.dashboard'),
            href: `/${lang}/admin`,
            icon: LayoutDashboard,
            exact: true,
        },
        {
            name: t('admin.users'),
            href: `/${lang}/admin/users`,
            icon: Users,
        },
        {
            name: t('admin.bookings'),
            href: `/${lang}/admin/bookings`,
            icon: Calendar,
        },
        {
            name: t('admin.villas'),
            href: `/${lang}/admin/villas`,
            icon: Building2,
        },
    ];

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return location.pathname === href;
        }
        return location.pathname.startsWith(href);
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
        <aside
            className={`bg-gradient-to-b from-[#D4A574] to-[#C8956D] text-white transition-all duration-300 ${
                isCollapsed ? 'w-20' : 'w-72'
            } min-h-screen flex flex-col shadow-2xl border-r-2 border-[#F8B259]/30`}
        >
            {/* Sidebar Header */}
            <div className='p-6 border-b-2 border-[#F8B259]/30'>
                <div className='flex items-center justify-between'>
                    {/* Logo */}
                    {!isCollapsed && (
                        <div className='flex items-center space-x-3'>
                            <img
                                src='/images/tranquilo-hurghada-logo.png'
                                alt='Tranquilo Hurghada'
                                className='h-12 w-auto'
                                onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className='p-2 rounded-xl bg-[#8B4513]/20 hover:bg-[#8B4513]/30 border border-[#8B4513]/50 transition-all duration-300 hover:scale-105'
                    >
                        {isCollapsed ? (
                            <ChevronRight className='w-5 h-5 text-[#8B4513]' />
                        ) : (
                            <ChevronLeft className='w-5 h-5 text-[#8B4513]' />
                        )}
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className='flex-1 px-4 py-6 space-y-2'>
                {adminNavigation.map(item => {
                    const active = isActive(item.href, item.exact);
                    const IconComponent = item.icon;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group ${
                                active
                                    ? 'bg-gradient-to-r from-[#F8B259] to-[#D96F32] text-white shadow-lg scale-105'
                                    : 'text-[#8B4513] hover:text-white hover:bg-white/20 hover:scale-105'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <IconComponent
                                className={`w-5 h-5 ${
                                    active ? 'text-white' : 'text-[#8B4513] group-hover:text-white'
                                } transition-colors`}
                            />
                            {!isCollapsed && <span className='font-semibold'>{item.name}</span>}
                            {!isCollapsed && active && <div className='ml-auto w-2 h-2 bg-white rounded-full'></div>}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className='p-4 border-t-2 border-[#F8B259]/30 bg-gradient-to-r from-[#D4A574]/50 to-[#C8956D]/50'>
                <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                    <div className='w-10 h-10 bg-gradient-to-r from-[#F8B259] to-[#D96F32] rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20'>
                        <span className='text-sm font-bold text-white'>{user ? getInitials(user.fullName) : 'A'}</span>
                    </div>
                    {!isCollapsed && (
                        <div className='flex-1 min-w-0'>
                            <p className='text-sm font-bold text-[#8B4513] truncate'>
                                {user ? `${user.fullName}` : 'Admin User'}
                            </p>
                            <p className='text-xs text-[#8B4513]/70 truncate'>{user?.email || 'admin@example.com'}</p>
                            <div className='flex items-center space-x-1 mt-1'>
                                <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                                <span className='text-xs text-[#8B4513]/60 capitalize'>
                                    {user?.role.toLowerCase() || 'Administrator'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};
