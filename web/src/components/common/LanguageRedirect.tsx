import i18n, { normalizeLanguageCode } from "@/utils/i18n";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const LanguageRedirect: React.FC = () => {
    const { lang } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!lang) {
            // Get the detected language and normalize it
            const detectedLang = normalizeLanguageCode(i18n.language);
            navigate(`/${detectedLang}${location.pathname}`, { replace: true });
        } else {
            // Normalize the current URL language parameter
            const normalizedLang = normalizeLanguageCode(lang);

            // If the URL has a locale code (like en-US), redirect to normalized version
            if (lang !== normalizedLang) {
                const newPath = location.pathname.replace(`/${lang}`, `/${normalizedLang}`);
                navigate(newPath, { replace: true });
                return;
            }

            // Update i18n language if different from current
            if (i18n.language !== normalizedLang) {
                i18n.changeLanguage(normalizedLang);
            }
        }
    }, [lang, location, navigate]);

    return null;
};
export default LanguageRedirect;