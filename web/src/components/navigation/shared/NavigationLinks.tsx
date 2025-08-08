import React from 'react';
import { Link, type Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Info, User, Settings } from 'lucide-react';
import type { NavigationItem } from '@/utils/types';

interface NavigationLinksProps {
    location: Location;
    lang: string;
    mobile?: boolean;
}

export const NavigationLinks: React.FC<NavigationLinksProps> = ({ location, lang, mobile = false }) => {
    const { t } = useTranslation();

    const navigationItems: NavigationItem[] = [
        {
            name: t('navigation.home'),
            href: `/${lang}`,
            icon: <Home className='w-4 h-4' />,
        },
        {
            name: t('navigation.about'),
            href: `/${lang}/about`,
            icon: <Info className='w-4 h-4' />,
        },
        {
            name: t('navigation.services'),
            href: `/${lang}/services`,
            icon: <User className='w-4 h-4' />,
        },
        {
            name: t('navigation.practicalInfo'),
            href: `/${lang}/practical-info`,
            icon: <User className='w-4 h-4' />,
        },
        {
            name: t('navigation.contact'),
            href: `/${lang}/contact`,
            icon: <Settings className='w-4 h-4' />,
        },
    ];

    if (mobile) {
        return (
            <div className='space-y-1'>
                {navigationItems.map(item => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive
                                    ? 'text-white bg-terracotta shadow-md'
                                    : 'text-gray-700 hover:text-terracotta hover:bg-gray-50'
                            }`}
                        >
                            <span className='text-base flex-shrink-0'>{item.icon}</span>
                            <span className='flex-1'>{item.name}</span>
                            {isActive && <div className='w-1.5 h-1.5 rounded-full bg-white flex-shrink-0'></div>}
                        </Link>
                    );
                })}
            </div>
        );
    }

    return (
        <div className='flex items-center space-x-8'>
            {navigationItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={`group relative flex items-center space-x-2 px-1 py-2 font-medium text-sm transition-all duration-300 ${
                            isActive ? 'text-terracotta' : 'text-terracotta hover:text-terracotta/80'
                        }`}
                    >
                        <span className='transition-transform duration-300 group-hover:scale-110 flex-shrink-0'>
                            {item.icon}
                        </span>
                        <span className='tracking-wide font-medium whitespace-nowrap'>{item.name}</span>

                        {/* Animated underline */}
                        <div
                            className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-terracotta transition-all duration-300 ease-out ${
                                isActive
                                    ? 'scale-x-100 opacity-100'
                                    : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'
                            }`}
                        />
                    </Link>
                );
            })}
        </div>
    );
};
