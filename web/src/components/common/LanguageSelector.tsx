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

    // Get flag image path
    const getFlagImage = (langCode: string) => `/flags/${langCode}.png`;

    return (
        <>
            {/* Custom styles for the language selector */}
            <style>{`
                .language-dropdown {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(217, 111, 50, 0.1);
                }

                .language-button {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(217, 111, 50, 0.2);
                }

                .language-button:hover {
                    background: rgba(255, 255, 255, 0.9);
                    border-color: var(--terracotta);
                    box-shadow: 0 4px 12px rgba(217, 111, 50, 0.15);
                    transform: translateY(-1px);
                }

                .language-item {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .language-item:hover {
                    background: linear-gradient(90deg, rgba(217, 111, 50, 0.1), rgba(248, 178, 89, 0.1));
                    transform: translateX(4px);
                }

                .language-item.active {
                    background: linear-gradient(90deg, rgba(217, 111, 50, 0.15), rgba(248, 178, 89, 0.15));
                    border-left: 3px solid var(--terracotta);
                }

                .flag-image {
                    width: 25px;
                    height: 20px;
                    object-fit: cover;
                    background-color: transparent;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animate-slide-down {
                    animation: slideDown 0.2s ease-out;
                }

                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }

                .animate-pulse {
                    animation: pulse 2s ease-in-out infinite;
                }
            `}</style>

            <div className='relative font-roboto' ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='language-button flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 transition-all duration-300 hover:text-burnt-orange group'
                    aria-label={t('common.language')}
                >
                    <div className='relative'>
                        <Globe className='w-4 h-4 transition-all duration-300 group-hover:rotate-12' />
                        {currentLanguage && (
                            <div className='absolute -top-1 -right-1 w-3 h-3 rounded-full overflow-hidden border border-white shadow-sm'>
                                <img
                                    src={getFlagImage(currentLanguage.code)}
                                    alt={currentLanguage.name}
                                    className='w-full h-full object-cover'
                                    onError={e => {
                                        // Fallback to emoji if image fails
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                            parent.innerHTML = currentLanguage.flag;
                                            parent.classList.add('text-xs', 'flex', 'items-center', 'justify-center');
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <span className='hidden sm:inline font-medium'>{currentLanguage?.nativeName || 'Language'}</span>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className='animate-slide-down absolute right-0 mt-2 w-56 language-dropdown rounded-2xl shadow-xl ring-1 ring-black ring-opacity-5 z-50 overflow-hidden'>
                        <div className='py-2' role='menu'>
                            <div className='px-4 py-2 border-b  border-terracotta'>
                                <p className='text-xs font-semibold text-terracotta uppercase tracking-wider'>
                                    Choose Language
                                </p>
                            </div>
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`language-item flex items-center space-x-3 w-full px-4 py-3 text-sm text-left ${
                                        lang.code === i18n.language
                                            ? 'active text-burnt-orange'
                                            : 'text-gray-700 hover:text-burnt-orange'
                                    }`}
                                    role='menuitem'
                                >
                                    <div className='flex-shrink-0'>
                                        <img
                                            src={getFlagImage(lang.code)}
                                            alt={lang.name}
                                            className='flag-image'
                                            onError={e => {
                                                // Fallback to emoji if image fails
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = document.createElement('span');
                                                fallback.textContent = lang.flag;
                                                fallback.className = 'text-lg';
                                                target.parentElement?.appendChild(fallback);
                                            }}
                                        />
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <p className='font-medium truncate'>{lang.nativeName}</p>
                                        <p className='text-xs text-gray-500 truncate'>{lang.name}</p>
                                    </div>
                                    {lang.code === i18n.language && (
                                        <div className='flex-shrink-0'>
                                            <div className='w-6 h-6 bg-gradient-to-r from-terracotta to-golden-yellow rounded-full flex items-center justify-center'>
                                                <Check className='w-3 h-3 text-white' />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
