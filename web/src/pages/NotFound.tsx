import { useI18n } from "@/contexts/I18nContext";

export const NotFound: React.FC = () => {
      const { t } = useI18n();

      return (
            <div className='text-center space-y-6'>
                  <div className='text-6xl'>404</div>
                  <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>{t('errors.pageNotFound')}</h1>
                  <p className='text-gray-600 dark:text-gray-400'>{t('errors.resourceNotFound')}</p>
                  <button
                        onClick={() => window.history.back()}
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                  >
                        {t('common.back') || 'Go Back'}
                  </button>
            </div>
      );
};
