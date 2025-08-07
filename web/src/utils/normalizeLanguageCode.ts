import { supportedLanguages } from "./constants";

export const normalizeLanguageCode = (langCode: string): string => {
    if (!langCode) return 'en';

    const primaryLang = langCode.toLowerCase().split('-')[0];

    if (supportedLanguages.includes(primaryLang as any)) {
        return primaryLang;
    }

    return 'en';
};