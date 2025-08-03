import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import i18n, { languages } from '@/config/i18n';

export const LanguageSelector: React.FC = () => {
      const { t } = useTranslation();
      const { lang } = useParams();
      const navigate = useNavigate();
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef<HTMLDivElement>(null);
      const currentLanguage = languages.find(l => l.code === lang);

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
            // Get current path without language prefix
            const currentPath = window.location.pathname.replace(/^\/[a-z]{2}\//, '');
            navigate(`/${langCode}/${currentPath}`);
            setIsOpen(false);
      };

      return (
            <div className='relative' ref={dropdownRef}>
                  <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                        aria-label={t('common.language')}
                  >
                        <span className='text-lg'>{currentLanguage?.flag}</span>
                        <span className='hidden sm:inline'>{currentLanguage?.nativeName}</span>
                        <svg
                              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                        >
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                        </svg>
                  </button>

                  {isOpen && (
                        <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50'>
                              <div className='py-1' role='menu'>
                                    {languages.map(lang => (
                                          <button
                                                key={lang.code}
                                                onClick={() => handleLanguageChange(lang.code)}
                                                className={`flex items-center space-x-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                                      lang.code === i18n.language
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                }`}
                                                role='menuitem'
                                          >
                                                <span className='text-lg'>{lang.flag}</span>
                                                <div className='flex flex-col'>
                                                      <span className='font-medium'>{lang.nativeName}</span>
                                                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                            {lang.name}
                                                      </span>
                                                </div>
                                                {lang.code === i18n.language && (
                                                      <svg
                                                            className='w-4 h-4 ml-auto text-blue-600 dark:text-blue-400'
                                                            fill='currentColor'
                                                            viewBox='0 0 20 20'
                                                      >
                                                            <path
                                                                  fillRule='evenodd'
                                                                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                                  clipRule='evenodd'
                                                            />
                                                      </svg>
                                                )}
                                          </button>
                                    ))}
                              </div>
                        </div>
                  )}
            </div>
      );
};
