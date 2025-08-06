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
            icon: <Home className='w-5 h-5' />,
        },
        {
            name: t('navigation.about'),
            href: `/${lang}/about`,
            icon: <Info className='w-5 h-5' />,
        },
        {
            name: t('navigation.services'),
            href: `/${lang}/services`,
            icon: <User className='w-5 h-5' />,
        },
        {
            name: t('navigation.visitorInfo'),
            href: `/${lang}/visitorInfo`,
            icon: <Settings className='w-5 h-5' />,
        },
        {
            name: t('navigation.contact'),
            href: `/${lang}/contact`,
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
        <>
            {/* Add custom styles */}
            <style>{`
                .navbar-blur {
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                .nav-link {
                    position: relative;
                    overflow: hidden;
                }

                .nav-link::before {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 50%;
                    width: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--terracotta), var(--golden-yellow));
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateX(-50%);
                    border-radius: 2px;
                }

                .nav-link:hover::before,
                .nav-link.active::before {
                    width: 100%;
                }

                .nav-link:hover {
                    transform: translateY(-2px);
                }

                .mobile-menu {
                    background: rgba(243, 233, 220, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                .logo-glow {
                    filter: drop-shadow(0 0 20px rgba(217, 111, 50, 0.3));
                }

                .menu-button {
                    background: linear-gradient(135deg, var(--terracotta), var(--burnt-orange));
                }

                .menu-button:hover {
                    background: linear-gradient(135deg, var(--burnt-orange), var(--terracotta));
                    transform: scale(1.05);
                }

                .auth-button {
                    background: linear-gradient(135deg, var(--golden-yellow), var(--terracotta));
                    box-shadow: 0 4px 15px rgba(217, 111, 50, 0.3);
                }

                .auth-button:hover {
                    box-shadow: 0 6px 20px rgba(217, 111, 50, 0.4);
                    transform: translateY(-2px);
                }

                .mobile-nav-item {
                    background: rgba(255, 255, 255, 0.8);
                    border-left: 4px solid transparent;
                    transition: all 0.3s ease;
                }

                .mobile-nav-item:hover,
                .mobile-nav-item.active {
                    background: rgba(217, 111, 50, 0.1);
                    border-left-color: var(--terracotta);
                    transform: translateX(8px);
                }

                @keyframes slideDown {
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
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>

            <header
                className={`fixed top-0 left-0 right-0 z-50 font-roboto transition-all duration-300 ${
                    scrolled ? 'navbar-blur bg-cream-80 shadow-lg border-b border-terracotta' : 'bg-cream-90'
                }`}
            >
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-20'>
                        {/* Logo */}
                        <div className='flex items-center space-x-4 group'>
                            <div className='logo-glow transition-all duration-300'>
                                {/* Use your existing logo or fallback to gradient */}
                                <img
                                    src='/logo.png'
                                    alt='Tranquilo Hurghada Logo'
                                    className='h-14 w-auto object-contain'
                                    onError={e => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const fallback = target.nextElementSibling as HTMLElement;
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                />
                              
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className='hidden lg:flex items-center space-x-1'>
                            {baseNavigation.map(item => {
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        onClick={item.onClick}
                                        className={`nav-link flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                                            isActive
                                                ? 'active text-burnt-orange bg-white/50'
                                                : 'text-gray-600 hover:text-burnt-orange hover:bg-white/30'
                                        }`}
                                    >
                                        <span className='transition-transform duration-300'>{item.icon}</span>
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Desktop Auth & Language */}
                        <div className='hidden lg:flex items-center space-x-4'>
                            <LanguageSelector />

                            {authNavigation.map(item => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={item.onClick}
                                    className='auth-button flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all duration-300 hover:scale-105'
                                >
                                    {item.icon}
                                    <span className='font-medium'>{item.name}</span>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='menu-button lg:hidden p-3 rounded-xl text-white transition-all duration-300'
                        >
                            {isMobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className='lg:hidden animate-slide-down'>
                        <div className='mobile-menu border-t border-terracotta/20'>
                            <div className='px-4 pt-4 pb-6 space-y-2'>
                                {navigation.map(item => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            onClick={e => {
                                                item.onClick?.(e);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`mobile-nav-item flex items-center space-x-4 px-4 py-4 rounded-xl text-base font-medium transition-all duration-300 ${
                                                isActive ? 'active' : ''
                                            } text-burnt-orange`}
                                        >
                                            <span className='text-terracotta'>{item.icon}</span>
                                            <span>{item.name}</span>
                                        </Link>
                                    );
                                })}

                                <div className='pt-4 border-t border-terracotta/20 mt-4'>
                                    <div className='mobile-nav-item px-4 py-4 rounded-xl transition-all duration-300'>
                                        <LanguageSelector />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer to prevent content overlap since navbar is now fixed */}
            <div className='h-20'></div>
        </>
    );
};
