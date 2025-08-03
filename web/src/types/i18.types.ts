import type { supportedLanguages } from '@/utils/constants';

// Supported language codes
export type SupportedLanguage = typeof supportedLanguages[number];

// Language configuration
export interface Language {
     code: SupportedLanguage;
     name: string;
     nativeName: string;
     flag: string;
     rtl?: boolean;
}


