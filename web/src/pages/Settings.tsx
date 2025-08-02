import { useI18n } from '@/hooks';

export const Settings: React.FC = () => {
      const { t, language } = useI18n();

      return (
            <div className='max-w-2xl mx-auto space-y-8'>
                  <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                              {t('pages.settingsTitle')}
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-400'>{t('pages.settingsDescription')}</p>
                  </div>

                  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6'>
                        <div>
                              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                    {t('common.language')}
                              </h3>
                              <p className='text-gray-600 dark:text-gray-400'>
                                    {t('common.currentLang', { lang: language })}
                              </p>
                        </div>

                        <div>
                              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                                    {t('common.theme')}
                              </h3>
                              <div className='flex space-x-4'>
                                    <button className='px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md'>
                                          {t('common.light')}
                                    </button>
                                    <button className='px-4 py-2 bg-gray-800 text-white rounded-md'>
                                          {t('common.dark')}
                                    </button>
                              </div>
                        </div>
                  </div>
            </div>
      );
};
