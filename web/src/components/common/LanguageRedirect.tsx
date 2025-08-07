import React, { useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isValidLanguage, normalizeLanguage } from '@/utils/languageUtils';
import { supportedLanguages } from '@/utils/constants';

const LanguageRedirect: React.FC = () => {
    const { lang } = useParams<{ lang?: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { i18n } = useTranslation();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Prevent multiple redirects
        if (hasRedirected.current) return;

        const handleLanguageRedirect = () => {
            const currentPath = location.pathname;
            const searchParams = location.search;
            const hash = location.hash;

            // Case 1: No language in URL (root path or missing language)
            if (!lang) {
                hasRedirected.current = true;

                // Try to get language from various sources
                let targetLang = 'en';

                // 1. Check localStorage first (returning user preference)
                const storedLang = localStorage.getItem('preferred-language');
                if (storedLang && supportedLanguages.includes(storedLang as any)) {
                    targetLang = storedLang;
                } else {
                    // 2. Detect from browser
                    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
                    targetLang = normalizeLanguage(browserLang);
                }

                // Redirect to language-prefixed URL
                const newPath = `/${targetLang}${currentPath}${searchParams}${hash}`;
                navigate(newPath, { replace: true });
                return;
            }

            // Case 2: Invalid or non-normalized language in URL
            if (!isValidLanguage(lang)) {
                hasRedirected.current = true;

                // Try to normalize (en-US -> en)
                const normalizedLang = normalizeLanguage(lang);

                // If still invalid after normalization, use default
                const targetLang = supportedLanguages.includes(normalizedLang as any) ? normalizedLang : 'en';

                const newPath = currentPath.replace(`/${lang}`, `/${targetLang}`) + searchParams + hash;
                navigate(newPath, { replace: true });
                return;
            }

            // Case 3: Valid language but needs normalization (en-US -> en)
            const normalizedLang = normalizeLanguage(lang);
            if (lang !== normalizedLang) {
                hasRedirected.current = true;

                const newPath = currentPath.replace(`/${lang}`, `/${normalizedLang}`) + searchParams + hash;
                navigate(newPath, { replace: true });
                return;
            }

            // Case 4: Language is valid and normalized
            // Update i18n if needed
            if (i18n.language !== normalizedLang) {
                i18n.changeLanguage(normalizedLang);
            }

            // Store user preference
            localStorage.setItem('preferred-language', normalizedLang);
        };

        // Small delay to prevent race conditions
        const timer = setTimeout(handleLanguageRedirect, 10);

        return () => {
            clearTimeout(timer);
        };
    }, [lang, location.pathname, location.search, location.hash, navigate, i18n]);

    // Reset redirect flag when location changes significantly
    useEffect(() => {
        hasRedirected.current = false;
    }, [location.key]);

    return null;
};

export default LanguageRedirect;
