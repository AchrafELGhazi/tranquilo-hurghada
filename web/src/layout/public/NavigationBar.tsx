import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Info, User, Settings, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const baseNavigation: NavigationItem[] = [
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
            name: t('navigation.visitorInfo'),
            href: `/${lang}/visitorInfo`,
            icon: <Settings className='w-4 h-4' />,
        },
        {
            name: t('navigation.contact'),
            href: `/${lang}/contact`,
            icon: <Settings className='w-4 h-4' />,
        },
    ];

    const authNavigation: NavigationItem[] = isAuthenticated
        ? [
              {
                  name: t('navigation.logout'),
                  href: '#',
                  icon: <LogOut className='w-4 h-4' />,
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
                  icon: <LogIn className='w-4 h-4' />,
              },
              {
                  name: t('navigation.register'),
                  href: `/${lang}/register`,
                  icon: <UserPlus className='w-4 h-4' />,
              },
          ];

    const allNavigation = [...baseNavigation, ...authNavigation];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 font-roboto transition-all duration-700 ease-out ${
                    scrolled
                        ? 'bg-cream-90 backdrop-blur-xl shadow-2xl shadow-terracotta-5 border-b border-terracotta-10'
                        : 'bg-cream-80 backdrop-blur-md border-b border-terracotta-50'
                }`}
            >
                <div className='max-w-12xl mx-auto px-6 lg:px-6'>
                    {/* Desktop Layout */}
                    <div className='hidden lg:grid lg:grid-cols-3 lg:items-center h-20'>
                        {/* Left: Logo */}
                        <div className='flex justify-start'>
                            <div className='group cursor-pointer'>
                                <Link to={`/${lang}`}>
                                <img
                                    src='/images/tranquilo-hurghada-logo.png'
                                    alt='Tranquilo Hurghada Logo'
                                    className='h-12 w-auto object-contain '
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Center: Base Navigation */}
                        <nav className='flex justify-center mr-10'>
                            <div className='flex items-center bg-cream-10   backdrop-blur-sm rounded-full px-2 py-2 shadow-lg shadow-terracotta-10 border border-terracotta-50'>
                                {baseNavigation.map((item, index) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-400 ${
                                                isActive
                                                    ? 'text-cream bg-terracotta shadow-lg shadow-terracotta-30'
                                                    : 'text-terracotta hover:text-cream hover:bg-terracotta-90 hover:shadow-md hover:shadow-terracotta-20'
                                            } ${index < baseNavigation.length - 1 ? 'mr-1' : ''}`}
                                        >
                                            <span className='transition-transform duration-300 group-hover:scale-110'>
                                                {item.icon}
                                            </span>
                                            <span className='tracking-wide font-medium text-sm whitespace-nowrap'>
                                                {item.name}
                                            </span>

                                          
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        {/* Right: Auth & Language */}
                        <div className='flex justify-end items-center space-x-4'>
                                <LanguageSelector />

                            {/* Auth Buttons */}
                            <div className='flex items-center space-x-2'>
                                {authNavigation.map((item, index) => {
                                    const isPrimary = index === 0;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className={`group relative flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden ${
                                                isPrimary
                                                    ? 'bg-terracotta text-cream shadow-lg shadow-terracotta-30 hover:bg-burnt-orange hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-0.5'
                                                    : 'bg-golden-yellow-60 text-burnt-orange shadow-lg shadow-golden-yellow-30 hover:bg-golden-yellow-90 hover:shadow-xl hover:shadow-golden-yellow/40 hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {/* Subtle shine effect */}
                                            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000'></div>

                                            <span className='relative z-10 transition-transform duration-300 group-hover:scale-110'>
                                                {item.icon}
                                            </span>
                                            <span className='relative z-10 tracking-wide font-semibold'>
                                                {item.name}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className='flex justify-between items-center h-20 lg:hidden'>
                        {/* Logo */}
                        <div className='group'>
                            <img
                                src='/images/tranquilo-hurghada-logo.png'
                                alt='Tranquilo Hurghada Logo'
                                className='h-10 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-sm'
                                onError={e => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='bg-terracotta text-cream p-3 rounded-xl shadow-lg shadow-terracotta/30 transition-all duration-400 hover:bg-burnt-orange hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-0.5 active:scale-95'
                        >
                            <div className='transition-transform duration-300'>
                                {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden animate-slide-down'>
                        <div className='bg-cream/95 backdrop-blur-xl border-t border-terracotta/20 shadow-xl'>
                            <div className='px-6 pt-6 pb-8 space-y-3 max-w-sm mx-auto'>
                                {/* Mobile Navigation Items */}
                                {allNavigation.map((item, index) => {
                                    const isActive = location.pathname === item.href;
                                    const isAuthItem = index >= baseNavigation.length;

                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={e => {
                                                item.onClick?.(e);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`group relative flex items-center space-x-4 p-4 rounded-2xl font-medium text-base transition-all duration-400 border ${
                                                isActive
                                                    ? 'text-cream bg-terracotta border-terracotta shadow-lg shadow-terracotta/30'
                                                    : isAuthItem
                                                    ? 'text-burnt-orange bg-golden-yellow/20 border-golden-yellow/30 hover:bg-golden-yellow/30 hover:border-golden-yellow/50 hover:shadow-md'
                                                    : 'text-terracotta bg-white/50 border-white/50 hover:bg-terracotta/10 hover:border-terracotta/30 hover:shadow-md'
                                            }`}
                                        >
                                            <span
                                                className={`transition-all duration-300 group-hover:scale-110 ${
                                                    isActive
                                                        ? 'text-cream'
                                                        : isAuthItem
                                                        ? 'text-burnt-orange'
                                                        : 'text-terracotta'
                                                }`}
                                            >
                                                {item.icon}
                                            </span>
                                            <span className='tracking-wide font-medium flex-1'>{item.name}</span>

                                            {/* Arrow indicator */}
                                            <div
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                    isActive
                                                        ? 'bg-cream scale-100'
                                                        : 'bg-transparent group-hover:bg-terracotta group-hover:scale-100 scale-0'
                                                }`}
                                            ></div>
                                        </Link>
                                    );
                                })}

                                {/* Mobile Language Selector */}
                                <div className='pt-4 mt-6 border-t border-terracotta/20'>
                                    <div className='bg-white/50 backdrop-blur-sm border border-white/50 rounded-2xl p-4 hover:bg-white/60 hover:border-terracotta/20 transition-all duration-400'>
                                        <div className='flex items-center justify-center'>
                                            <LanguageSelector />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer */}
            <div className='h-20'></div>

            <style>{`
                @keyframes slide-down {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-down {
                    animation: slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
            `}</style>
        </>
    );
};
