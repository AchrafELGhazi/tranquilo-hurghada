import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
      SUPPORTED_LANGUAGES,
      I18N_CONFIG,
      getLanguageFromStorage,
      setLanguageInStorage,
      getLanguageFromNavigator,
} from '@/i18n/config';
import { getTranslationResources } from '@/i18n/resources';
import { interpolateString } from '@/i18n/utils/interpolation';
import type { I18nContextType, I18nProviderProps, SupportedLanguage, TranslationKey, TranslationParams } from '@/i18n/types/i18.types';

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<I18nProviderProps> = ({
      children,
      defaultLanguage = I18N_CONFIG.defaultLanguage,
      fallbackLanguage = I18N_CONFIG.fallbackLanguage,
}) => {
      const [language, setLanguageState] = useState<SupportedLanguage>(() => {
            // Language detection priority: storage > navigator > default
            return getLanguageFromStorage() || getLanguageFromNavigator() || defaultLanguage;
      });

      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState<string | null>(null);

      // Load translation resources
      const resources = getTranslationResources();

      // Translation function with type safety
      const t = useCallback(
            (key: TranslationKey, params?: TranslationParams): string => {
                  try {
                        const [namespace, translationKey] = key.split('.') as [
                              keyof (typeof resources)[SupportedLanguage],
                              string
                        ];

                        // Get translation from current language
                        let translation = resources[language]?.[namespace]?.[translationKey];

                        // Fallback to fallback language if translation not found
                        if (!translation && language !== fallbackLanguage) {
                              translation = resources[fallbackLanguage]?.[namespace]?.[translationKey];

                              if (I18N_CONFIG.debug && !translation) {
                                    console.warn(
                                          `Translation missing for key: ${key} in languages: ${language}, ${fallbackLanguage}`
                                    );
                              }
                        }

                        // If still no translation, return the key or a missing translation message
                        if (!translation) {
                              if (I18N_CONFIG.saveMissing) {
                                    console.warn(`Missing translation: ${key}`);
                              }
                              return I18N_CONFIG.debug ? `[Missing: ${key}]` : key;
                        }

                        // Interpolate parameters if provided
                        return params ? interpolateString(translation, params) : translation;
                  } catch (err) {
                        console.error('Translation error:', err);
                        return key;
                  }
            },
            [language, fallbackLanguage, resources]
      );

      // Change language function
      const setLanguage = useCallback(
            async (newLanguage: SupportedLanguage) => {
                  if (newLanguage === language) return;

                  setIsLoading(true);
                  setError(null);

                  try {
                        // Validate language is supported
                        if (!resources[newLanguage]) {
                              throw new Error(`Language ${newLanguage} is not supported`);
                        }

                        // Update state and storage
                        setLanguageState(newLanguage);
                        setLanguageInStorage(newLanguage);

                        // Update document language attribute
                        if (typeof document !== 'undefined') {
                              document.documentElement.lang = newLanguage;

                              // Update direction for RTL languages
                              const languageConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === newLanguage);
                              document.documentElement.dir = languageConfig?.rtl ? 'rtl' : 'ltr';
                        }
                  } catch (err) {
                        const errorMessage = err instanceof Error ? err.message : 'Failed to change language';
                        setError(errorMessage);
                        console.error('Language change error:', err);
                  } finally {
                        setIsLoading(false);
                  }
            },
            [language, resources]
      );

      // Initialize document language on mount
      useEffect(() => {
            if (typeof document !== 'undefined') {
                  document.documentElement.lang = language;

                  const languageConfig = SUPPORTED_LANGUAGES.find(lang => lang.code === language);
                  document.documentElement.dir = languageConfig?.rtl ? 'rtl' : 'ltr';
            }
      }, [language]);

      const contextValue: I18nContextType = {
            language,
            languages: SUPPORTED_LANGUAGES,
            setLanguage,
            t,
            isLoading,
            error,
      };

      return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

// Custom hook to use i18n context
export const useI18n = (): I18nContextType => {
      const context = useContext(I18nContext);

      if (context === undefined) {
            throw new Error('useI18n must be used within an I18nProvider');
      }

      return context;
};
