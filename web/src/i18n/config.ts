import type { Language, SupportedLanguage } from "./types/i18.types";

export const SUPPORTED_LANGUAGES: Language[] = [
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
];

// Default configuration
export const I18N_CONFIG = {
     defaultLanguage: 'en' as SupportedLanguage,
     fallbackLanguage: 'en' as SupportedLanguage,
     storageKey: 'preferred-language',

     // Interpolation settings
     interpolation: {
          prefix: '{{',
          suffix: '}}',
          escapeValue: false,
     },

     // Detection settings
     detection: {
          // Order of language detection
          order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

          // Cache user language
          caches: ['localStorage'],

          // Optional: cookie settings if using cookies
          cookieMinutes: 10080, // 7 days
          cookieDomain: 'localhost',
     },

     // Development settings
     debug: import.meta.env.DEV,
     saveMissing: import.meta.env.DEV,

     // Performance settings
     load: 'languageOnly', // 'all' | 'currentOnly' | 'languageOnly'
     preload: ['en'], // Preload specific languages

     // Namespace settings
     defaultNS: 'common',
     fallbackNS: 'common',
     ns: ['common', 'navigation', 'pages', 'errors'],
} as const;

// Helper functions
export const getLanguageByCode = (code: string): Language | undefined => {
     return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const isLanguageSupported = (code: string): code is SupportedLanguage => {
     return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

export const getLanguageFromNavigator = (): SupportedLanguage => {
     if (typeof navigator === 'undefined') return I18N_CONFIG.defaultLanguage;

     const navigatorLanguage = navigator.language.split('-')[0];
     return isLanguageSupported(navigatorLanguage)
          ? navigatorLanguage
          : I18N_CONFIG.defaultLanguage;
};

export const getLanguageFromStorage = (): SupportedLanguage | null => {
     if (typeof localStorage === 'undefined') return null;

     const stored = localStorage.getItem(I18N_CONFIG.storageKey);
     return stored && isLanguageSupported(stored) ? stored : null;
};

export const setLanguageInStorage = (language: SupportedLanguage): void => {
     if (typeof localStorage !== 'undefined') {
          localStorage.setItem(I18N_CONFIG.storageKey, language);
     }
};