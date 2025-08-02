import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import type { TranslationResources } from './types/i18.types';

// Combine all translation resources
export const getTranslationResources = (): TranslationResources => ({
     en,
     es,
     fr,
});

// Export individual resources for direct access if needed
export { en, es, fr };