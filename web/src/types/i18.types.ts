import type { supportedLanguages } from '@/utils/constants';

export type SupportedLanguage = typeof supportedLanguages[number];

export interface Language {
     code: SupportedLanguage;
     name: string;
     nativeName: string;
     flag: string;
     rtl?: boolean;
}


