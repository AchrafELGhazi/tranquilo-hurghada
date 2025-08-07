import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import ruTranslations from '@/locales/ru.json';
import deTranslations from '@/locales/de.json';
import { normalizeLanguageCode } from './normalizeLanguageCode';


i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            fr: { translation: frTranslations },
            ru: { translation: ruTranslations },
            de: { translation: deTranslations },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['path', 'localStorage', 'navigator'],
            lookupFromPathIndex: 0,
            lookupLocalStorage: 'preferred-language',
            caches: ['localStorage'],
            convertDetectedLanguage: normalizeLanguageCode,
        },
    });

export default i18n;
export { normalizeLanguageCode };
