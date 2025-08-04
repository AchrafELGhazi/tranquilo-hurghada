import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import i18n from '@/utils/i18n';

export const useSyncLanguage = () => {
    const { lang } = useParams<{ lang: string }>();

    useEffect(() => {
        if (lang && i18n.language !== lang) {
            i18n.changeLanguage(lang).then(() => {
                localStorage.setItem('preferred-language', lang);
            });
        }
    }, [lang]);
};