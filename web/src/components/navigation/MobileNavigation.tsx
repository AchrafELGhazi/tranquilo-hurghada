import React, { useState, useEffect } from 'react';
import { type Location } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { Menu, X } from 'lucide-react';
import type { AuthContextType } from '@/utils/types';
import { LogoComponent } from './shared/LogoComponent';
import { BookNowButton } from '../common/BookNowButton';
import { MobileMenu } from './mobile/MobileMenu';

interface MobileNavigationProps {
    location: Location;
    lang: string;
    authContext: AuthContextType;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ location, lang, authContext }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <div className='flex justify-between items-center h-16'>
                {/* Logo */}
                <LogoComponent lang={lang} className='h-10' />

                <div className='flex items-center space-x-3'>
                    <LanguageSelector />
                    <BookNowButton lang={lang} mobile />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className='bg-terracotta text-cream p-2 rounded-xl shadow-lg shadow-terracotta/30 transition-all duration-300 hover:bg-burnt-orange hover:shadow-xl hover:shadow-terracotta/40 hover:-translate-y-0.5 active:scale-95'
                        aria-label='Toggle mobile menu'
                    >
                        <div className='transition-transform duration-300'>
                            {isMobileMenuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                location={location}
                lang={lang}
                authContext={authContext}
            />
        </>
    );
};
