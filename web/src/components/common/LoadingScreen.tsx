import React from 'react';
import { Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export interface LoadingScreenProps {
      progress?: number;
      message?: string;
      showProgress?: boolean;
      className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
      progress = 75,
      message,
      showProgress = true,
      className = '',
}) => {
      const { t } = useI18n();

      const displayMessage = message || t('common.loading');

      return (
            <div
                  className={`fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50 ${className}`}
            >
                  <div className='text-center max-w-md mx-auto px-6'>
                        {/* Logo or App Icon */}
                        <div className='mb-8'>
                              <div className='w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg'>
                                    <Loader2 className='h-10 w-10 animate-spin text-white' />
                              </div>
                        </div>

                        {/* Loading Text */}
                        <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4'>
                              {displayMessage}
                        </h2>

                        {/* Progress Bar */}
                        {showProgress && (
                              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 overflow-hidden'>
                                    <div
                                          className='bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out'
                                          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                                    />
                              </div>
                        )}

                        {/* Loading Dots Animation */}
                        <div className='flex justify-center space-x-1' aria-label={t('common.loadingDots')}>
                              {[0, 1, 2].map(index => (
                                    <div
                                          key={index}
                                          className='w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce'
                                          style={{
                                                animationDelay: `${index * 0.1}s`,
                                                animationDuration: '0.6s',
                                          }}
                                    />
                              ))}
                        </div>

                        {/* Optional subtitle */}
                        <p className='text-sm text-gray-600 dark:text-gray-400 mt-4'>{t('common.pleaseWait')}</p>
                  </div>
            </div>
      );
};
