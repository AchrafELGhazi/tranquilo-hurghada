import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { languages } from '@/config/i18n';

export const useRTL = () => {
      const { lang } = useParams();

      useEffect(() => {
            const currentLanguage = languages.find(l => l.code === lang);
            const isRTL = currentLanguage?.rtl || false;

            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
            document.documentElement.lang = lang || 'en';

            if (isRTL) {
                  document.documentElement.classList.add('rtl');
            } else {
                  document.documentElement.classList.remove('rtl');
            }
      }, [lang]);
};
