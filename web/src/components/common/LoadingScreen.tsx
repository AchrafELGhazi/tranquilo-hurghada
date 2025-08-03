import { PropagateLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';

export interface LoadingScreenProps {
      progress?: number;
      message?: string;
      className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress = 0, message, className = '' }) => {
      const { t } = useTranslation();

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
            <div className={`flex flex-col items-center justify-center min-h-screen ${className}`}>
                  <div className='mb-8'>
                        <PropagateLoader color='#3B82F6' />
                  </div>

                  <div className='text-xl font-semibold mb-2'>{getLoadingMessage()}</div>

                  <div className='w-64 h-2 bg-gray-200 rounded-full mb-4'>
                        <div
                              className='h-full bg-blue-500 rounded-full transition-all duration-300'
                              style={{ width: `${progress}%` }}
                        />
                  </div>

                  <div className='text-lg mb-4'>{progress}%</div>

                  <div className='text-sm text-gray-500'>{getStepDescription()}</div>
            </div>
      );
};
