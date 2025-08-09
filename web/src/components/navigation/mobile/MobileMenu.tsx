import React from 'react';
import { Link, type Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';
import type { AuthContextType } from '@/utils/types';
import { MobileUserSection } from './MobileUserSection';
import { NavigationLinks } from '../shared/NavigationLinks';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    location: Location;
    lang: string;
    authContext: AuthContextType;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, location, lang, authContext }) => {
    const { t } = useTranslation();
    const { isAuthenticated } = authContext;

    return (
        <div
            className={`overflow-hidden border-t border-terracotta-50 transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <div className='shadow-lg'>
                <div className='px-0 py-3 space-y-1 max-w-md mx-auto'>
                    <NavigationLinks location={location} lang={lang} mobile />

                    {!isAuthenticated && (
                        <Link
                            to={`/${lang}/signin`}
                            onClick={onClose}
                            className='flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-white bg-terracotta hover:bg-terracotta-90 shadow-md'
                        >
                            <LogIn className='w-4 h-4 flex-shrink-0' />
                            <span className='flex-1'>{t('navigation.signin')}</span>
                        </Link>
                    )}

                    {isAuthenticated && <MobileUserSection lang={lang} authContext={authContext} onClose={onClose} />}
                </div>
            </div>
        </div>
    );
};
