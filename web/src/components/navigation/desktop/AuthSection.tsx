import type { AuthContextType } from '@/utils/types';
import React from 'react';
import { SignInButton } from './SignInButton';
import { UserDropdown } from './UserDropdown';

interface AuthSectionProps {
    lang: string;
    authContext: AuthContextType;
}

export const AuthSection: React.FC<AuthSectionProps> = ({ lang, authContext }) => {
    return (
        <div className='flex items-center'>
            {authContext.isAuthenticated ? (
                <UserDropdown lang={lang} authContext={authContext} />
            ) : (
                <SignInButton lang={lang} />
            )}
        </div>
    );
};
