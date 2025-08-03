import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const AdminHeader: React.FC = () => {
      const { t } = useTranslation();
      const { lang } = useParams();

      return (
            <header className='bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700'>
                  <div className='px-6 py-4'>
                        <div className='flex justify-between items-center'>
                              {/* Breadcrumb or Page Title */}
                              <div className='flex items-center space-x-4'>
                                    <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                                          {t('admin.dashboard')}
                                    </h1>
                              </div>

                              {/* Header Actions */}
                              <div className='flex items-center space-x-4'>
                                    {/* Back to Site */}
                                    <Link
                                          to={`/${lang}`}
                                          className='flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'
                                    >
                                          <svg
                                                className='w-4 h-4'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                          >
                                                <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      strokeWidth={2}
                                                      d='M10 19l-7-7m0 0l7-7m-7 7h18'
                                                />
                                          </svg>
                                          <span>{t('admin.backToSite')}</span>
                                    </Link>

                                    {/* Notifications */}
                                    <button className='relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                                          <svg
                                                className='w-5 h-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                          >
                                                <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      strokeWidth={2}
                                                      d='M15 17h5l-5 5v-5zM15 17H9a2 2 0 01-2-2V9a2 2 0 012-2h6m0 10V9a2 2 0 00-2-2H9'
                                                />
                                          </svg>
                                          <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500'></span>
                                    </button>

                                    {/* Language Selector */}
                                    <LanguageSelector />

                                    {/* Profile Dropdown */}
                                    <div className='relative'>
                                          <button className='flex items-center space-x-2 p-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors'>
                                                <div className='w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center'>
                                                      <span className='text-xs font-medium text-white'>A</span>
                                                </div>
                                                <span>Admin</span>
                                                <svg
                                                      className='w-4 h-4'
                                                      fill='none'
                                                      stroke='currentColor'
                                                      viewBox='0 0 24 24'
                                                >
                                                      <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeWidth={2}
                                                            d='M19 9l-7 7-7-7'
                                                      />
                                                </svg>
                                          </button>
                                    </div>
                              </div>
                        </div>
                  </div>
            </header>
      );
};
