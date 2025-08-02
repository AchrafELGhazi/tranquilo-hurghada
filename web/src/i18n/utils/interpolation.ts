import type { TranslationParams, InterpolationOptions } from '../types/i18n.types';
import { I18N_CONFIG } from '../config';

/**
 * Interpolates parameters into a translation string
 * Supports basic interpolation with {{key}} syntax
 */
export const interpolateString = (
     template: string,
     params: TranslationParams,
     options: InterpolationOptions = {}
): string => {
     const { prefix = I18N_CONFIG.interpolation.prefix, suffix = I18N_CONFIG.interpolation.suffix } = options;

     return template.replace(
          new RegExp(`${escapeRegExp(prefix)}([^${escapeRegExp(suffix)}]+)${escapeRegExp(suffix)}`, 'g'),
          (match, key) => {
               const trimmedKey = key.trim();
               const value = params[trimmedKey];

               if (value === undefined || value === null) {
                    console.warn(`Interpolation parameter "${trimmedKey}" is missing in translation`);
                    return match; // Return original placeholder if parameter is missing
               }

               return String(value);
          }
     );
};

/**
 * Handles pluralization for translation strings
 * Simple implementation that checks for _plural suffix
 */
export const handlePluralization = (
     key: string,
     count: number,
     translations: Record<string, string>
): string => {
     const baseTranslation = translations[key];
     const pluralTranslation = translations[`${key}_plural`];

     // If no plural form exists, return base translation
     if (!pluralTranslation) {
          return baseTranslation || key;
     }

     // Simple plural rule for English-like languages
     // For more complex plural rules, consider using libraries like plural-forms
     return count === 1 ? baseTranslation : pluralTranslation;
};

/**
 * Formats numbers according to locale
 */
export const formatNumber = (
     value: number,
     locale: string,
     options?: Intl.NumberFormatOptions
): string => {
     try {
          return new Intl.NumberFormat(locale, options).format(value);
     } catch (error) {
          console.warn(`Failed to format number for locale ${locale}:`, error);
          return value.toString();
     }
};

/**
 * Formats dates according to locale
 */
export const formatDate = (
     date: Date | string | number,
     locale: string,
     options?: Intl.DateTimeFormatOptions
): string => {
     try {
          const dateObj = date instanceof Date ? date : new Date(date);
          return new Intl.DateTimeFormat(locale, options).format(dateObj);
     } catch (error) {
          console.warn(`Failed to format date for locale ${locale}:`, error);
          return String(date);
     }
};

/**
 * Formats currency according to locale
 */
export const formatCurrency = (
     amount: number,
     currency: string,
     locale: string
): string => {
     try {
          return new Intl.NumberFormat(locale, {
               style: 'currency',
               currency: currency.toUpperCase(),
          }).format(amount);
     } catch (error) {
          console.warn(`Failed to format currency for locale ${locale}:`, error);
          return `${amount} ${currency}`;
     }
};

/**
 * Escapes special characters for use in regular expressions
 */
const escapeRegExp = (string: string): string => {
     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Advanced interpolation with support for formatters
 */
export const interpolateWithFormatters = (
     template: string,
     params: TranslationParams,
     locale: string,
     options: InterpolationOptions = {}
): string => {
     const { prefix = '{{', suffix = '}}' } = options;

     return template.replace(
          new RegExp(`${escapeRegExp(prefix)}([^${escapeRegExp(suffix)}]+)${escapeRegExp(suffix)}`, 'g'),
          (match, expression) => {
               const trimmedExpression = expression.trim();

               // Check for formatter syntax: key, formatter(options)
               const formatterMatch = trimmedExpression.match(/^(\w+),\s*(\w+)(?:\(([^)]*)\))?$/);

               if (formatterMatch) {
                    const [, key, formatter, optionsStr] = formatterMatch;
                    const value = params[key];

                    if (value === undefined || value === null) {
                         console.warn(`Parameter "${key}" is missing for formatter "${formatter}"`);
                         return match;
                    }

                    // Parse formatter options
                    let formatterOptions = {};
                    if (optionsStr) {
                         try {
                              formatterOptions = JSON.parse(`{${optionsStr}}`);
                         } catch (error) {
                              console.warn(`Invalid formatter options: ${optionsStr}`);
                         }
                    }

                    // Apply formatter
                    switch (formatter) {
                         case 'number':
                              return formatNumber(Number(value), locale, formatterOptions);
                         case 'date':
                              return formatDate(value as Date, locale, formatterOptions);
                         case 'currency':
                              const currency = (formatterOptions as any).currency || 'USD';
                              return formatCurrency(Number(value), currency, locale);
                         default:
                              console.warn(`Unknown formatter: ${formatter}`);
                              return String(value);
                    }
               }

               // Simple parameter substitution
               const value = params[trimmedExpression];
               return value !== undefined && value !== null ? String(value) : match;
          }
     );
};