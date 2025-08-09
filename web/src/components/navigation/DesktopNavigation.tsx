import React from 'react';
import { type Location } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import type { AuthContextType } from '@/utils/types';
import { LogoComponent } from './shared/LogoComponent';
import { BookNowButton } from '../common/BookNowButton';
import { AuthSection } from './desktop/AuthSection';
import { NavigationLinks } from './shared/NavigationLinks';

interface DesktopNavigationProps {
    location: Location;
    lang: string;
    authContext: AuthContextType;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ location, lang, authContext }) => {
    return (
        <div className='flex items-center justify-between h-20'>
            {/* Left: Logo */}
            <LogoComponent lang={lang} />

            {/* Center: Navigation */}
            <nav className='flex-1 flex justify-center px-8'>
                <NavigationLinks location={location} lang={lang} />
            </nav>

            {/* Right: Actions */}
            <div className='flex items-center space-x-4 flex-shrink-0'>
                <LanguageSelector />
                <BookNowButton lang={lang} />
                <AuthSection lang={lang} authContext={authContext} />
            </div>
        </div>
    );
};
