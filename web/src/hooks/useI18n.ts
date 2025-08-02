import { I18nContext } from "@/contexts/I18nContext";
import type { I18nContextType } from "@/types/i18.types";
import { useContext } from "react";

export const useI18n = (): I18nContextType => {
      const context = useContext(I18nContext);
      if (context === undefined) {
            throw new Error('useI18n must be used within an I18nProvider');
      }
      return context;
};