import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Info, User, Settings, LogIn, LogOut, Menu, X } from 'lucide-react';

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
              //   {
              //       name: t('navigation.register'),
              //       href: `/${lang}/register`,
              //       icon: <UserPlus className='w-4 h-4' />,
              //   },
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
                            <div className='flex items-center   px-2 py-2'>
                                {baseNavigation.map((item, index) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className={`group relative flex items-center space-x-2 px-2 mx-4 py-2.5  font-medium text-sm transition-all duration-400 overflow-hidden ${
                                                isActive ? 'text-terracotta ' : 'text-terracotta hover:text-cream h'
                                            } ${index < baseNavigation.length - 1 ? 'mr-1' : ''}`}
                                        >
                                            <span className='transition-transform duration-300 group-hover:scale-110 relative z-10'>
                                                {item.icon}
                                            </span>
                                            <span className='tracking-wide font-medium text-sm whitespace-nowrap relative z-10'>
                                                {item.name}
                                            </span>

                                            {/* Improved animated underline - left to right with margin */}
                                            <div
                                                className={`absolute left-2 right-2 h-0.5 bg-terracotta transition-all duration-500 ease-out ${
                                                    isActive
                                                        ? 'bottom-0 mt-2 scale-x-100 origin-left'
                                                        : 'bottom-0 mt-2 scale-x-0 origin-left group-hover:scale-x-100'
                                                }`}
                                                style={{ marginTop: '8px' }}
                                            ></div>
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
                                    const isSignIn = !isAuthenticated && index === 0;
                                    // const isLogout = isAuthenticated && index === 0;

                                    if (isSignIn) {
                                        return (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                onClick={item.onClick}
                                                className='group relative flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden bg-gradient-to-r from-[#D96F32] via-[#C75D2C] to-[#D96F32] bg-size-200 bg-pos-0 hover:bg-pos-100 text-cream border-2 border-[#f8b359aa] hover:border-golden-yellow shadow-lg shadow-terracotta-30 hover:shadow-xl hover:shadow-golden-yellow/40 hover:-translate-y-0.5 active:scale-95'
                                            >
                                                {/* Magic shine effect */}
                                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out'></div>
                                                </div>

                                                <span className='relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-sm'>
                                                    {item.icon}
                                                </span>
                                                <span className='relative z-10 tracking-wide font-semibold group-hover:text-shadow'>
                                                    {item.name}
                                                </span>
                                            </Link>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className='group relative flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden bg-golden-yellow-60 text-burnt-orange shadow-lg shadow-golden-yellow-30 hover:bg-golden-yellow-90 hover:shadow-xl hover:shadow-golden-yellow/40 hover:-translate-y-0.5'
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

                        <div className='flex items-center space-x-3'>
                            <LanguageSelector />

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className='bg-terracotta text-cream p-2 cursor-pointer rounded-xl shadow-lg shadow-terracotta/30 transition-all duration-400 hover:bg-burnt-orange hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-0.5 active:scale-95'
                            >
                                <div className='transition-transform duration-300'>
                                    {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden'>
                        <div className=' border-t border-terracotta-60 shadow-lg'>
                            <div className='px-2 py-6 space-y-1 max-w-xl mx-auto'>
                                {/* Mobile Navigation Items */}
                                {allNavigation.map((item, index) => {
                                    const isActive = location.pathname === item.href;
                                    const isAuthItem = index >= baseNavigation.length;
                                    const isSignInMobile = !isAuthenticated && isAuthItem;

                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={e => {
                                                item.onClick?.(e);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                                                isActive
                                                    ? 'text-white bg-terracotta'
                                                    : isSignInMobile
                                                    ? 'text-white bg-terracotta hover:bg-terracotta-90'
                                                    : isAuthItem
                                                    ? 'text-terracotta bg-terracotta-5 hover:bg-terracotta-10'
                                                    : 'text-gray-700 hover:text-terracotta hover:bg-gray-50'
                                            }`}
                                        >
                                            <span className='text-lg'>{item.icon}</span>
                                            <span className='flex-1'>{item.name}</span>
                                            {isActive && <div className='w-1.5 h-1.5 rounded-full bg-white'></div>}
                                        </Link>
                                    );
                                })}
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

                .bg-size-200 {
                    background-size: 200%;
                }

                .bg-pos-0 {
                    background-position: 0% 50%;
                }

                .bg-pos-100 {
                    background-position: 100% 50%;
                }
            `}</style>
        </>
    );
};
