import { languages } from '@/utils/constants';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
