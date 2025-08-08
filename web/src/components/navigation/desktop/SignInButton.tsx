import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogIn } from 'lucide-react';

interface SignInButtonProps {
    lang: string;
}

export const SignInButton: React.FC<SignInButtonProps> = ({ lang }) => {
    const { t } = useTranslation();

    return (
        <Link
            to={`/${lang}/signin`}
            className='group relative flex items-center justify-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden bg-gradient-to-r from-[#D96F32] via-[#C75D2C] to-[#D96F32] bg-size-200 bg-pos-0 hover:bg-pos-100 text-cream border-2 border-[#f8b359aa] hover:border-golden-yellow shadow-lg shadow-terracotta-30 hover:shadow-xl hover:shadow-golden-yellow/40 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap min-w-[8rem]'
        >
            {/* Magic shine effect */}
            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out'></div>
            </div>
            <span className='relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-sm flex-shrink-0'>
                <LogIn className='w-4 h-4' />
            </span>
            <span className='relative z-10 tracking-wide font-semibold group-hover:text-shadow'>
                {t('navigation.signin')}
            </span>
        </Link>
    );
};
