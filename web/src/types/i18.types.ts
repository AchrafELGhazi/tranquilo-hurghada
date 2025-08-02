// types/i18n.types.ts
import React from 'react';

// Supported language codes
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ar';

// Language configuration
export interface Language {
     code: SupportedLanguage;
     name: string;
     nativeName: string;
     flag: string;
     rtl?: boolean;
}

// Translation namespace structure
export interface TranslationNamespaces {
     common: Record<string, string>;
     navigation: Record<string, string>;
     pages: Record<string, string>;
     errors: Record<string, string>;
}

// Translation resources type
export type TranslationResources = {
     [K in SupportedLanguage]: TranslationNamespaces;
};

// Translation key paths (for type safety)
export type TranslationKey =
     | `common.${keyof TranslationNamespaces['common']}`
     | `navigation.${keyof TranslationNamespaces['navigation']}`
     | `pages.${keyof TranslationNamespaces['pages']}`
     | `errors.${keyof TranslationNamespaces['errors']}`;

// Translation function parameters
export interface TranslationParams {
     [key: string]: string | number;
}

// I18n context interface
export interface I18nContextType {
     language: SupportedLanguage;
     languages: Language[];
     setLanguage: (language: SupportedLanguage) => void;
     t: (key: TranslationKey, params?: TranslationParams) => string;
     isLoading: boolean;
     error: string | null;
}

// I18n provider props
export interface I18nProviderProps {
     children: React.ReactNode;
     defaultLanguage?: SupportedLanguage;
     fallbackLanguage?: SupportedLanguage;
}

// Translation interpolation options
export interface InterpolationOptions {
     prefix?: string;
     suffix?: string;
     escapeValue?: boolean;
}