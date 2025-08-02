import { useI18n } from "@/contexts/I18nContext";

export const Profile: React.FC = () => {
      const { t } = useI18n();

      return (
            <div className='max-w-2xl mx-auto space-y-8'>
                  <div className='text-center'>
                        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
                              {t('pages.profileTitle')}
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-400'>{t('pages.profileDescription')}</p>
                  </div>

                  <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6'>
                        <form className='space-y-4'>
                              <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                          {t('common.hello')}
                                    </label>
                                    <input
                                          type='text'
                                          placeholder={t('common.searchPlaceholder')}
                                          className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                                    />
                              </div>

                              <div className='flex space-x-3'>
                                    <button
                                          type='button'
                                          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                                    >
                                          {t('common.save')}
                                    </button>
                                    <button
                                          type='button'
                                          className='px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors'
                                    >
                                          {t('common.cancel')}
                                    </button>
                              </div>
                        </form>
                  </div>
            </div>
      );
};
