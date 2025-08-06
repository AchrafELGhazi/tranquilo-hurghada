import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, Check, Globe } from 'lucide-react';
import i18n from '@/utils/i18n';
import { languages } from '@/utils/constants';

export const LanguageSelector: React.FC = () => {
    const { t } = useTranslation();
    const { lang: urlLang } = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const currentLanguage = languages.find(l => l.code === urlLang);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode: string) => {
        const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '');
        navigate(`/${langCode}/${currentPath}`);
        setIsOpen(false);

        const newLang = languages.find(l => l.code === langCode);
        document.documentElement.dir = newLang?.rtl ? 'rtl' : 'ltr';
    };

    const getFlagImage = (langCode: string) => `/flags/${langCode}.png`;

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='group flex cursor-pointer items-center gap-2 px-2 py-1.5 bg-white/80 hover:bg-white/95 backdrop-blur-sm border border-terracotta-20 hover:border-terracotta rounded-lg text-sm font-medium text-gray-700 hover:text-burnt-orange transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-terracotta-20 focus:outline-none focus:ring-1 focus:ring-amber-400'
                aria-expanded={isOpen}
                aria-haspopup='true'
            >
                <Globe className='w-4 h-4' />

                {currentLanguage && (
                    <div className='w-5 h-4 rounded-sm overflow-hidden shadow-sm '>
                        <img
                            src={getFlagImage(currentLanguage.code)}
                            alt={currentLanguage.name}
                            className='w-full h-full object-cover'
                            onError={e => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                    parent.innerHTML = currentLanguage.flag;
                                    parent.className += ' flex items-center justify-center text-xs bg-gray-50';
                                }
                            }}
                        />
                    </div>
                )}

                <span className='hidden md:inline font-medium text-xs'>
                    {currentLanguage?.nativeName || 'Language'}
                </span>

                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-black/10 border border-terracotta-20 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200'>
                    {/* Header */}
                    <div className='px-3 py-2 bg-gradient-to-r from-terracotta-10 to-golden-yellow-10 border-b border-terracotta-20'>
                        <div className='flex items-center gap-2'>
                            <Globe className='w-3 h-3 text-terracotta' />
                            <span className='text-xs font-semibold text-terracotta'>{t('common.chooseLanguage') }</span>
                        </div>
                    </div>

                    {/* Language Options */}
                    <div className='py-1'>
                        {languages.map(lang => {
                            const isActive = lang.code === i18n.language;
                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`relative w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 hover:translate-x-1 hover:bg-terracotta-10 group ${
                                        isActive
                                            ? 'bg-terracotta-10 text-burnt-orange font-medium border-l-2 border-terracotta'
                                            : 'text-gray-700 hover:text-burnt-orange'
                                    }`}
                                >
                                    {/* Hover gradient effect */}
                                    <div className='absolute inset-0 bg-gradient-to-r from-terracotta-10 to-golden-yellow-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10' />

                                    <div className='w-6 h-4 rounded-sm overflow-hidden shadow-sm border border-white/50 flex-shrink-0'>
                                        <img
                                            src={getFlagImage(lang.code)}
                                            alt={`${lang.name} flag`}
                                            className='w-full h-full object-cover'
                                            onError={e => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = document.createElement('div');
                                                fallback.textContent = lang.flag;
                                                fallback.className =
                                                    'text-sm flex items-center justify-center w-full h-full bg-gray-50';
                                                target.parentElement?.appendChild(fallback);
                                            }}
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='font-medium text-sm truncate'>{lang.nativeName}</div>
                                        <div className='text-xs text-gray-500 truncate'>{lang.name}</div>
                                    </div>

                                    {isActive && (
                                        <div className='flex-shrink-0'>
                                            <div className='w-5 h-5 bg-golden-yellow rounded-full flex items-center justify-center shadow-md'>
                                                <Check className='w-3 h-3 text-white' />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
