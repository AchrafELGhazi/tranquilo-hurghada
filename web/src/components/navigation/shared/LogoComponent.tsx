import React from 'react';
import { Link } from 'react-router-dom';

interface LogoComponentProps {
    lang: string;
    className?: string;
}

export const LogoComponent: React.FC<LogoComponentProps> = ({ lang, className = 'h-12' }) => {
    return (
        <div className='flex-shrink-0'>
            <Link to={`/${lang}`} className='block'>
                <img
                    src='/images/tranquilo-hurghada-logo.png'
                    alt='Tranquilo Hurghada Logo'
                    className={`${className} w-auto object-contain transition-transform duration-300 hover:scale-105`}
                    onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                    }}
                />
            </Link>
        </div>
    );
};
