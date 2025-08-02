// config/languages.ts

import type { Language, SupportedLanguage } from "@/types/i18.types";

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

export const defaultLanguage: SupportedLanguage = 'en';
export const fallbackLanguage: SupportedLanguage = 'en';

// Get browser language preference
export const getBrowserLanguage = (): SupportedLanguage => {
     const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
     return languages.some(lang => lang.code === browserLang) ? browserLang : defaultLanguage;
};

// Get language from localStorage
export const getStoredLanguage = (): SupportedLanguage | null => {
     try {
          const stored = localStorage.getItem('preferred-language') as SupportedLanguage;
          return languages.some(lang => lang.code === stored) ? stored : null;
     } catch {
          return null;
     }
};

// Store language preference
export const storeLanguage = (language: SupportedLanguage): void => {
     try {
          localStorage.setItem('preferred-language', language);
     } catch {
          // Silent fail for environments without localStorage
     }
};