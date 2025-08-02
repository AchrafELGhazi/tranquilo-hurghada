
import type { SupportedLanguage, TranslationNamespaces } from '@/types/i18.types';

export const loadTranslations = async (language: SupportedLanguage): Promise<TranslationNamespaces> => {
     try {
          switch (language) {
               case 'en':
                    const en = await import('@/i18n/locales/en');
                    return {
                         common: en.common,
                         navigation: en.navigation,
                         pages: en.pages,
                         errors: en.errors,
                    };
               case 'ar':
                    const ar = await import('@/i18n/locales/ar');
                    return {
                         common: ar.common,
                         navigation: ar.navigation,
                         pages: ar.pages,
                         errors: ar.errors,
                    };
               case 'es':
                    const es = await import('@/i18n/locales/es');
                    return {
                         common: es.common,
                         navigation: es.navigation,
                         pages: es.pages,
                         errors: es.errors,
                    };
               case 'fr':
                    const fr = await import('@/i18n/locales/fr');
                    return {
                         common: fr.common,
                         navigation: fr.navigation,
                         pages: fr.pages,
                         errors: fr.errors,
                    };
               case 'de':
                    const de = await import('@/i18n/locales/de');
                    return {
                         common: de.common,
                         navigation: de.navigation,
                         pages: de.pages,
                         errors: de.errors,
                    };
               case 'pt':
                    const pt = await import('@/i18n/locales/pt');
                    return {
                         common: pt.common,
                         navigation: pt.navigation,
                         pages: pt.pages,
                         errors: pt.errors,
                    };
               default:
                    throw new Error(`Unsupported language: ${language}`);
          }
     } catch (error) {
          console.error(`Failed to load translations for ${language}:`, error);
          const en = await import('@/i18n/locales/en');
          return {
               common: en.common,
               navigation: en.navigation,
               pages: en.pages,
               errors: en.errors,
          };
     }
};

export const interpolate = (template: string, params: Record<string, string | number> = {}): string => {
     return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return params[key]?.toString() || match;
     });
};

export const pluralize = (
     key: string,
     count: number,
     translations: Record<string, string>
): string => {
     const pluralKey = `${key}_plural`;

     if (count === 1) {
          return translations[key] || key;
     } else if (translations[pluralKey]) {
          return translations[pluralKey];
     } else {
          return translations[key] || key;
     }
};