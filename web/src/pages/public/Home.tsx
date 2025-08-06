import { useTranslation } from 'react-i18next';

export const Home: React.FC = () => {
    const { t } = useTranslation();

    const handleButtonClick = () => {
        console.log('Button clicked!');
        // Add your logic here
    };

    return (
        <div className='space-y-8'>
            <div className='text-center'>
                <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>{t('pages.homeTitle')}</h1>
                <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>{t('pages.homeSubtitle')}</p>

                {/* Your beautiful Tranquilo hotel button */}
                <button className='' onClick={handleButtonClick}>
                    <p className='font-butler-400 text-burnt-orange'>this is teest</p>{' '}
                </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow'
                    >
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                            {t('common.info')} {i}
                        </h3>
                        <button
                            className='btn-hotel-secondary btn-small'
                            onClick={() => console.log(`Card ${i} clicked`)}
                        >
                            {t('common.learnMore') || 'Learn More'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
