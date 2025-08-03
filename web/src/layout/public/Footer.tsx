import React from 'react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
      const { t } = useTranslation();

      return (
            <footer className='bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto'>
                  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                        <div className='text-center text-sm text-gray-500 dark:text-gray-400'>
                              © 2025 {t('common.appName')}. {t('common.description')}.
                        </div>
                  </div>
            </footer>
      );
};
