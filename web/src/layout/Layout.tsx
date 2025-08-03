import React, { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
      children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
      const { t } = useTranslation();
      const location = useLocation();

      const navigation = [
            { name: t('navigation.home'), href: '/', icon: '🏠' },
            { name: t('navigation.about'), href: '/about', icon: 'ℹ️' },
            { name: t('navigation.profile'), href: '/profile', icon: '👤' },
            { name: t('navigation.settings'), href: '/settings', icon: '⚙️' },
      ];

      return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
                  {/* Header */}
                  <header className='bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700'>
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                              <div className='flex justify-between items-center h-16'>
                                    {/* Logo */}
                                    <div className='flex items-center space-x-3'>
                                          <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center'>
                                                <svg
                                                      className='w-5 h-5 text-white'
                                                      fill='none'
                                                      stroke='currentColor'
                                                      viewBox='0 0 24 24'
                                                >
                                                      <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeWidth={2}
                                                            d='M13 10V3L4 14h7v7l9-11h-7z'
                                                      />
                                                </svg>
                                          </div>
                                          <span className='text-xl font-bold text-gray-900 dark:text-white'>
                                                {t('common.appName')}
                                          </span>
                                    </div>

                                    {/* Navigation */}
                                    <nav className='hidden md:flex space-x-8'>
                                          {navigation.map(item => {
                                                const isActive = location.pathname === item.href;
                                                return (
                                                      <Link
                                                            key={item.href}
                                                            to={item.href}
                                                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                                  isActive
                                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                                            }`}
                                                      >
                                                            <span>{item.icon}</span>
                                                            <span>{item.name}</span>
                                                      </Link>
                                                );
                                          })}
                                    </nav>

                                    {/* Language Selector */}
                                    <LanguageSelector />
                              </div>
                        </div>

                        {/* Mobile Navigation */}
                        <div className='md:hidden border-t border-gray-200 dark:border-gray-700'>
                              <div className='px-2 pt-2 pb-3 space-y-1'>
                                    {navigation.map(item => {
                                          const isActive = location.pathname === item.href;
                                          return (
                                                <Link
                                                      key={item.href}
                                                      to={item.href}
                                                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                                            isActive
                                                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                                      }`}
                                                >
                                                      <span>{item.icon}</span>
                                                      <span>{item.name}</span>
                                                </Link>
                                          );
                                    })}
                              </div>
                        </div>
                  </header>

                  {/* Main Content */}
                  <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>

                  {/* Footer */}
                  <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto'>
                        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                              <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                                    © 2025 {t('common.appName')}. {t('common.description')}.
                              </div>
                        </div>
                  </footer>
            </div>
      );
};
