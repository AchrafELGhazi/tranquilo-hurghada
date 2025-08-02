import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { loadTranslations, interpolate, pluralize } from '@/utils/translationLoader';
import type { I18nContextType, SupportedLanguage, TranslationKey, TranslationNamespaces, TranslationParams } from '@/types/i18.types';
import { defaultLanguage, fallbackLanguage, getBrowserLanguage, getStoredLanguage, storeLanguage } from '@/config/languages';
import { languages } from '@/lib/constants';
import { useI18n } from '@/hooks';

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
      children: ReactNode;
      defaultLanguage?: SupportedLanguage;
      fallbackLanguage?: SupportedLanguage;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({
      children,
      defaultLanguage: propDefaultLanguage = defaultLanguage,
      fallbackLanguage: propFallbackLanguage = fallbackLanguage,
}) => {
      const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(propDefaultLanguage);
      const [translations, setTranslations] = useState<TranslationNamespaces | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);

      useEffect(() => {
            const initializeLanguage = () => {
                  const storedLang = getStoredLanguage();
                  const browserLang = getBrowserLanguage();
                  const initialLang = storedLang || browserLang || propDefaultLanguage;

                  setCurrentLanguage(initialLang);
            };

            initializeLanguage();
      }, [propDefaultLanguage]);

      useEffect(() => {
            const loadLanguageTranslations = async () => {
                  setIsLoading(true);
                  setError(null);

                  try {
                        const newTranslations = await loadTranslations(currentLanguage);
                        setTranslations(newTranslations);

                        const isRTL = languages.find(lang => lang.code === currentLanguage)?.rtl || false;
                        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
                        document.documentElement.setAttribute('lang', currentLanguage);
                  } catch (err) {
                        setError('Failed to load translations');
                        console.error('Translation loading error:', err);

                        if (currentLanguage !== propFallbackLanguage) {
                              try {
                                    const fallbackTranslations = await loadTranslations(propFallbackLanguage);
                                    setTranslations(fallbackTranslations);
                              } catch (fallbackErr) {
                                    console.error('Fallback translation loading error:', fallbackErr);
                              }
                        }
                  } finally {
                        setIsLoading(false);
                  }
            };

            loadLanguageTranslations();
      }, [currentLanguage, propFallbackLanguage]);

      const setLanguage = useCallback((language: SupportedLanguage) => {
            if (languages.some(lang => lang.code === language)) {
                  setCurrentLanguage(language);
                  storeLanguage(language);
            }
      }, []);

      const t = useCallback(
            (key: TranslationKey, params: TranslationParams = {}): string => {
                  if (!translations) {
                        return key;
                  }

                  const [namespace, translationKey] = key.split('.') as [keyof TranslationNamespaces, string];
                  const namespaceTranslations = translations[namespace];

                  if (!namespaceTranslations || !translationKey) {
                        return key;
                  }

                  if (params.count !== undefined) {
                        const pluralizedText = pluralize(translationKey, Number(params.count), namespaceTranslations);
                        return interpolate(pluralizedText, params);
                  }

                  const translation = namespaceTranslations[translationKey];
                  if (!translation) {
                        return key;
                  }

                  return interpolate(translation, params);
            },
            [translations]
      );

      const contextValue: I18nContextType = {
            language: currentLanguage,
            languages,
            setLanguage,
            t,
            isLoading,
            error,
      };

      return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};


export const withI18n = <P extends object>(Component: React.ComponentType<P & { t: I18nContextType['t'] }>) => {
      const WrappedComponent = (props: P) => {
            const { t } = useI18n();
            return <Component {...props} t={t} />;
      };

      WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name})`;
      return WrappedComponent;
};
