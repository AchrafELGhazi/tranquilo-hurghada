import { useI18n } from "@/contexts/I18nContext";

export const About: React.FC = () => {
      const { t } = useI18n();

      return (
            <div className='max-w-4xl mx-auto space-y-8'>
                  <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                              {t('pages.aboutTitle')}
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-400'>{t('pages.aboutDescription')}</p>
                  </div>

                  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-8'>
                        <div className='prose dark:prose-invert max-w-none'>
                              <p className='text-gray-600 dark:text-gray-400 leading-relaxed'>
                                    {t('common.description')}. {t('common.thankyou')} for using our application!
                              </p>

                              <div className='mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                                    <p className='text-blue-800 dark:text-blue-200'>
                                          {t('common.greeting', { name: 'User' })}
                                    </p>
                              </div>
                        </div>
                  </div>
            </div>
      );
};
