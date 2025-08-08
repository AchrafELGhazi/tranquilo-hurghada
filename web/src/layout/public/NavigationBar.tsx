import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import {
    Home,
    Info,
    User,
    Settings,
    LogIn,
    LogOut,
    Menu,
    X,
    Calendar,
    ChevronDown,
    UserCircle,
    BookOpen,
    LayoutDashboard,
} from 'lucide-react';

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
    const { isAuthenticated, logout, user, isHost, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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

    const authNavigation: NavigationItem[] = isAuthenticated
        ? []
        : [
              {
                  name: t('navigation.signin'),
                  href: `/${lang}/signin`,
                  icon: <LogIn className='w-4 h-4' />,
              },
          ];

    const allNavigation = [...baseNavigation, ...authNavigation];

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await logout();
        setIsUserDropdownOpen(false);
    };

    const handleBookNowClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `/${lang}/booking`;
    };

    const UserDropdown = () => (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={e => {
                    e.stopPropagation();
                    setIsUserDropdownOpen(!isUserDropdownOpen);
                }}
                className='group relative flex items-center cursor-pointer justify-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-400 overflow-hidden bg-white/40 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] hover:bg-white/60 hover:border-[#D96F32] hover:-translate-y-0.5 shadow-lg hover:shadow-xl min-w-[8rem]'
            >
                <UserCircle className='w-4 h-4 flex-shrink-0' />
                <span className='font-semibold max-w-16 truncate'>{user?.fullName?.split(' ')[0]}</span>
                <ChevronDown
                    className={`w-3 h-3 flex-shrink-0 transition-transform duration-300 ${
                        isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {isUserDropdownOpen && (
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
                            onClick={e => {
                                e.stopPropagation();
                                setIsUserDropdownOpen(false);
                            }}
                            className='flex items-center space-x-3 px-4 py-3 text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#C75D2C] transition-colors duration-200'
                        >
                            <UserCircle className='w-5 h-5 flex-shrink-0' />
                            <span className='font-medium'>Profile</span>
                        </Link>

                        <Link
                            to={`/${lang}/my-bookings`}
                            onClick={e => {
                                e.stopPropagation();
                                setIsUserDropdownOpen(false);
                            }}
                            className='flex items-center space-x-3 px-4 py-3 text-[#C75D2C] hover:bg-[#F8B259]/20 hover:text-[#C75D2C] transition-colors duration-200'
                        >
                            <BookOpen className='w-5 h-5 flex-shrink-0' />
                            <span className='font-medium'>My Bookings</span>
                        </Link>

                        {(isHost() || isAdmin()) && (
                            <Link
                                to={`/${lang}/admin`}
                                onClick={e => {
                                    e.stopPropagation();
                                    setIsUserDropdownOpen(false);
                                }}
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

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 font-roboto transition-all duration-700 ease-out ${
                    scrolled
                        ? 'bg-cream-90 backdrop-blur-xl shadow-2xl shadow-terracotta-5 border-b border-terracotta-10'
                        : 'bg-cream-80 backdrop-blur-md border-b border-terracotta-50'
                }`}
            >
                <div className='max-w-12xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Desktop Layout */}
                    <div className='hidden lg:flex lg:items-center lg:justify-between h-20'>
                        {/* Left: Logo */}
                        <div className='flex-shrink-0'>
                            <Link to={`/${lang}`} className='block'>
                                <img
                                    src='/images/tranquilo-hurghada-logo.png'
                                    alt='Tranquilo Hurghada Logo'
                                    className='h-12 w-auto object-contain transition-transform duration-300 hover:scale-105'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Center: Navigation */}
                        <nav className='flex-1 flex justify-center px-8'>
                            <div className='flex items-center space-x-8'>
                                {baseNavigation.map(item => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className={`group relative flex items-center space-x-2 px-1 py-2 font-medium text-sm transition-all duration-300 ${
                                                isActive
                                                    ? 'text-terracotta'
                                                    : 'text-terracotta hover:text-terracotta/80'
                                            }`}
                                        >
                                            <span className='transition-transform duration-300 group-hover:scale-110 flex-shrink-0'>
                                                {item.icon}
                                            </span>
                                            <span className='tracking-wide font-medium whitespace-nowrap'>
                                                {item.name}
                                            </span>

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
                        </nav>

                        {/* Right: Actions */}
                        <div className='flex items-center space-x-4 flex-shrink-0'>
                            <LanguageSelector />

                            {/* Book Now Button */}
                            <button
                                onClick={handleBookNowClick}
                                className='group relative cursor-pointer flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-500 bg-white/80 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] hover:bg-white hover:border-[#D96F32] hover:text-[#D96F32] shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 whitespace-nowrap overflow-hidden min-w-[8rem]'
                            >
                                {/* Magic shine effect */}
                                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-[#F8B259]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out'></div>
                                </div>
                                <Calendar className='w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110 flex-shrink-0' />
                                <span className='relative z-10 tracking-wide font-bold'>Book Now</span>
                            </button>

                            {/* Auth Section */}
                            <div className='flex items-center'>
                                {isAuthenticated ? (
                                    <UserDropdown />
                                ) : (
                                    authNavigation.map(item => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={item.onClick}
                                            className='group relative flex  items-center justify-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden bg-gradient-to-r from-[#D96F32] via-[#C75D2C] to-[#D96F32] bg-size-200 bg-pos-0 hover:bg-pos-100 text-cream border-2 border-[#f8b359aa] hover:border-golden-yellow shadow-lg shadow-terracotta-30 hover:shadow-xl hover:shadow-golden-yellow/40 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap min-w-[8rem]'
                                        >
                                            {/* Magic shine effect */}
                                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out'></div>
                                            </div>
                                            <span className='relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-sm flex-shrink-0'>
                                                {item.icon}
                                            </span>
                                            <span className='relative z-10 tracking-wide font-semibold group-hover:text-shadow'>
                                                {item.name}
                                            </span>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className='flex justify-between items-center h-16 lg:hidden'>
                        {/* Logo */}
                        <div className='flex-shrink-0'>
                            <Link to={`/${lang}`}>
                                <img
                                    src='/images/tranquilo-hurghada-logo.png'
                                    alt='Tranquilo Hurghada Logo'
                                    className='h-10 w-auto object-contain transition-all duration-300 hover:scale-105'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                    }}
                                />
                            </Link>
                        </div>

                        <div className='flex items-center space-x-3'>
                            <LanguageSelector />

                            {/* Mobile Book Now Button */}
                            <button
                                onClick={handleBookNowClick}
                                className='bg-white/80 backdrop-blur-md border-2 border-[#F8B259]/70 text-[#C75D2C] px-3 py-2 rounded-xl shadow-lg transition-all duration-300 hover:bg-white hover:border-[#D96F32] hover:text-[#D96F32] hover:-translate-y-0.5 active:scale-95'
                            >
                                <Calendar className='w-5 h-5' />
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className='bg-terracotta text-cream p-2 rounded-xl shadow-lg shadow-terracotta/30 transition-all duration-300 hover:bg-burnt-orange hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-0.5 active:scale-95'
                                aria-label='Toggle mobile menu'
                            >
                                <div className='transition-transform duration-300'>
                                    {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className='border-t border-terracotta-60 shadow-lg bg-cream backdrop-blur-md'>
                        <div className='px-4 py-4 space-y-1 max-w-md mx-auto'>
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
                                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive
                                                ? 'text-white bg-terracotta shadow-md'
                                                : isSignInMobile
                                                ? 'text-white bg-terracotta hover:bg-terracotta-90 shadow-md'
                                                : isAuthItem
                                                ? 'text-terracotta bg-terracotta-5 hover:bg-terracotta-10'
                                                : 'text-gray-700 hover:text-terracotta hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className='text-base flex-shrink-0'>{item.icon}</span>
                                        <span className='flex-1'>{item.name}</span>
                                        {isActive && (
                                            <div className='w-1.5 h-1.5 rounded-full bg-white flex-shrink-0'></div>
                                        )}
                                    </Link>
                                );
                            })}

                            {/* Mobile User Menu */}
                            {isAuthenticated && (
                                <div className='mt-4 pt-3 border-t border-[#F8B259]/50'>
                                    <div className='bg-gradient-to-r from-[#F8B259]/20 to-[#D96F32]/20 rounded-xl p-3 mb-2'>
                                        <div className='flex items-center space-x-3 mb-3'>
                                            <div className='w-10 h-10 bg-gradient-to-r from-[#D96F32] to-[#F8B259] rounded-full flex items-center justify-center flex-shrink-0'>
                                                <span className='text-white font-bold text-lg'>
                                                    {user?.fullName?.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p className='font-bold text-[#C75D2C] text-sm truncate'>
                                                    {user?.fullName}
                                                </p>
                                                <p className='text-[#C75D2C]/70 text-xs truncate'>{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className='space-y-0.5'>
                                            <Link
                                                to={`/${lang}/profile`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className='flex items-center space-x-3 px-2 py-2 text-[#C75D2C] hover:bg-white/40 rounded-lg transition-colors duration-200'
                                            >
                                                <UserCircle className='w-4 h-4 flex-shrink-0' />
                                                <span className='text-sm font-medium'>Profile</span>
                                            </Link>

                                            <Link
                                                to={`/${lang}/my-bookings`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className='flex items-center space-x-3 px-2 py-2 text-[#C75D2C] hover:bg-white/40 rounded-lg transition-colors duration-200'
                                            >
                                                <BookOpen className='w-4 h-4 flex-shrink-0' />
                                                <span className='text-sm font-medium'>My Bookings</span>
                                            </Link>

                                            {(isHost() || isAdmin()) && (
                                                <Link
                                                    to='/admin'
                                                    onClick={() => setIsMobileMenuOpen(false)}
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
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className={`${isMobileMenuOpen ? 'h-96' : 'h-16 lg:h-20'} transition-all duration-300`}></div>

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
