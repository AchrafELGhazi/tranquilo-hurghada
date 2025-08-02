import { useI18n } from '@/hooks';
import React from 'react';
import { PropagateLoader } from 'react-spinners';

export interface LoadingScreenProps {
      progress?: number;
      message?: string;
      className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0, message, className = '' }) => {
      const { t } = useI18n();

      const getLoadingMessage = () => {
            if (message) return message;

            if (progress < 20) return t('common.preparing');
            if (progress < 40) return t('common.loadingTranslations');
            if (progress < 60) return t('common.initializingRouter');
            if (progress < 80) return t('common.settingUpComponents');
            if (progress < 100) return t('common.applyingTheme');
            return t('common.almostReady');
      };

      const getStepDescription = () => {
            if (progress < 20) return t('common.startingUp');
            if (progress < 40) return t('common.loadingResources');
            if (progress < 60) return t('common.configuringApp');
            if (progress < 80) return t('common.finalizingSetup');
            return t('common.readyToLaunch');
      };

      return (
            <div
                  className={`fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 ${className}`}
            >
                  <div className='text-center max-w-md mx-auto px-6'>
                        <div className='mb-8 flex justify-center'>
                              <PropagateLoader
                                    color='currentColor'
                                    className='text-black dark:text-white'
                                    size={15}
                                    speedMultiplier={0.8}
                              />
                        </div>

                        <h2 className='text-xl font-medium text-gray-800 dark:text-gray-200 mb-2'>
                              {getLoadingMessage()}
                        </h2>

                        <p className='text-sm font-mono text-gray-500 dark:text-gray-400 mb-4'>{progress}%</p>

                        <p className='text-sm text-gray-500 dark:text-gray-400'>{getStepDescription()}</p>
                  </div>
            </div>
      );
};
