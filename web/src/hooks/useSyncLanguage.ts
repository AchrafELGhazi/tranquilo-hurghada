import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import i18n from '@/config/i18n';

export const useSyncLanguage = () => {
     const { lang } = useParams();

     useEffect(() => {
          if (lang && i18n.language !== lang) {
               i18n.changeLanguage(lang);
          }
     }, [lang]);
};