import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translations
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import deTranslations from '@/locales/de.json';
import ptTranslations from '@/locales/pt.json';
import arTranslations from '@/locales/ar.json';
import type { Language } from '@/types/i18.types';

export const supportedLanguages = ['en', 'es', 'fr', 'de', 'pt', 'ar'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const languages: Language[] = [
     {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          flag: '🇺🇸',
          rtl: false,
     },
     {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          flag: '🇪🇸',
          rtl: false,
     },
     {
          code: 'fr',
          name: 'French',
          nativeName: 'Français',
          flag: '🇫🇷',
          rtl: false,
     },
     {
          code: 'de',
          name: 'German',
          nativeName: 'Deutsch',
          flag: '🇩🇪',
          rtl: false,
     },
     {
          code: 'pt',
          name: 'Portuguese',
          nativeName: 'Português',
          flag: '🇵🇹',
          rtl: false,
     },
     {
          code: 'ar',
          name: 'Arabic',
          nativeName: 'العربية',
          flag: '🇸🇦',
          rtl: true,
     },
];

i18n
     .use(LanguageDetector)
     .use(initReactI18next)
     .init({
          resources: {
               en: { translation: enTranslations },
               es: { translation: esTranslations },
               fr: { translation: frTranslations },
               de: { translation: deTranslations },
               pt: { translation: ptTranslations },
               ar: { translation: arTranslations },
          },
          fallbackLng: 'en',
          interpolation: {
               escapeValue: false, // React already protects against XSS
          },
          detection: {
               order: ['path', 'localStorage'],
               lookupFromPathIndex: 0,
               lookupLocalStorage: 'preferred-language',
               caches: ['localStorage'],
          },
     });

export default i18n;