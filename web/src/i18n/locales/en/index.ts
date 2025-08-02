import type { TranslationNamespaces } from '@/i18n/types/i18.types';
import { common } from './common';
import { navigation } from './navigation';
import { pages } from './pages';
import { errors } from './errors';

export const en: TranslationNamespaces = {
     common,
     navigation,
     pages,
     errors,
};

export * from './common';
export * from './navigation';
export * from './pages';
export * from './errors';