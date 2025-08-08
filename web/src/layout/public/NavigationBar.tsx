import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { DesktopNavigation } from '@/components/navigation/DesktopNavigation';

export const NavigationBar: React.FC = () => {
    const location = useLocation();
    const { lang } = useParams<{ lang: string }>();
    const authContext = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const currentLang = lang || 'en';

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-20 font-roboto transition-all duration-700 ease-out ${
                    scrolled
                        ? 'bg-cream-90 backdrop-blur-xl shadow-2xl shadow-terracotta-5 border-b border-terracotta-10'
                        : 'bg-cream-80 backdrop-blur-md border-b border-terracotta-50'
                }`}
            >
                <div className='max-w-12xl mx-auto px-4 sm:px-6 lg:px-8'>
                    {/* Desktop Navigation */}
                    <div className='hidden lg:block'>
                        <DesktopNavigation location={location} lang={currentLang} authContext={authContext} />
                    </div>

                    {/* Mobile Navigation */}
                    <div className='lg:hidden'>
                        <MobileNavigation location={location} lang={currentLang} authContext={authContext} />
                    </div>
                </div>
            </header>

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
