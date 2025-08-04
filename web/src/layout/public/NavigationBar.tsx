import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Info, User, Settings, LogIn, UserPlus, LogOut, Zap } from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}

export const NavigationBar: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { lang } = useParams();
    const { isAuthenticated, logout } = useAuth();

    const baseNavigation: NavigationItem[] = [
        {
            name: t('navigation.home'),
            href: `/${lang}`,
            icon: <Home className='w-5 h-5' />,
        },
        {
            name: t('navigation.about'),
            href: `/${lang}/about`,
            icon: <Info className='w-5 h-5' />,
        },
        {
            name: t('navigation.profile'),
            href: `/${lang}/profile`,
            icon: <User className='w-5 h-5' />,
        },
        {
            name: t('navigation.settings'),
            href: `/${lang}/settings`,
            icon: <Settings className='w-5 h-5' />,
        },
    ];

    const authNavigation: NavigationItem[] = isAuthenticated
        ? [
              {
                  name: t('navigation.logout'),
                  href: '#',
                  icon: <LogOut className='w-5 h-5' />,
                  onClick: (e: React.MouseEvent) => {
                      e.preventDefault();
                      logout();
                  },
              },
          ]
        : [
              {
                  name: t('navigation.signin'),
                  href: `/${lang}/signin`,
                  icon: <LogIn className='w-5 h-5' />,
              },
              {
                  name: t('navigation.register'),
                  href: `/${lang}/register`,
                  icon: <UserPlus className='w-5 h-5' />,
              },
          ];

    const navigation = [...baseNavigation, ...authNavigation];

    return (
        <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <div className='flex items-center space-x-3'>
                        <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                            <Zap className='w-5 h-5 text-white' />
                        </div>
                        <span className='text-xl font-bold text-gray-900 dark:text-white'>{t('common.appName')}</span>
                    </div>

                    {/* Navigation */}
                    <nav className='hidden md:flex space-x-8'>
                        {navigation.map(item => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={item.onClick}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Language Selector */}
                    <LanguageSelector />
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className='md:hidden border-t border-gray-200 dark:border-gray-700'>
                <div className='px-2 pt-2 pb-3 space-y-1'>
                    {navigation.map(item => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={item.onClick}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};
