import { supportedLanguages } from "./constants";

export const normalizeLanguageCode = (langCode: string | undefined | null): string => {
    if (!langCode || typeof langCode !== 'string') return 'en';

    const cleanLangCode = langCode.trim().toLowerCase();
    const primaryLang = cleanLangCode.split('-')[0];

    if (supportedLanguages.includes(primaryLang as any)) {
        return primaryLang;
    }

    return 'en';
};