import { supportedLanguagesSet, type SupportedLanguage } from "./constants";

export const normalizeLanguage = (lang: string): SupportedLanguage => {
    if (!lang) return 'en';

    const normalized = lang.split('-')[0].toLowerCase();
    return supportedLanguagesSet.has(normalized as SupportedLanguage)
        ? (normalized as SupportedLanguage)
        : 'en';
};

export const detectBrowserLanguage = (): SupportedLanguage => {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return normalizeLanguage(browserLang);
};

export const getLanguageFromPath = (pathname: string): SupportedLanguage | null => {
    const match = pathname.match(/^\/([a-zA-Z-]+)/);
    if (match) {
        const normalized = match[1].split('-')[0].toLowerCase();
        return supportedLanguagesSet.has(normalized as SupportedLanguage)
            ? (normalized as SupportedLanguage)
            : null;
    }
    return null;
};

export const isValidLanguage = (lang: string): lang is SupportedLanguage => {
    const normalized = lang.split('-')[0].toLowerCase();
    return supportedLanguagesSet.has(normalized as SupportedLanguage);
};

export const buildLocalizedPath = (path: string, lang: string): string => {
    const normalizedLang = normalizeLanguage(lang);

    // Remove existing language prefix if present
    const cleanPath = path.replace(/^\/[a-zA-Z-]+/, '');

    // Add normalized language prefix
    return `/${normalizedLang}${cleanPath}`;
};