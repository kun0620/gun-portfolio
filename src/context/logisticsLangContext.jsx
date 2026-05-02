import { createContext, useContext, useMemo } from 'react';
import { logisticsTranslations } from '../data/logistics/translations.js';
import { useGlobalLangState } from './globalTweak.js';

const LogisticsLangContext = createContext(null);

export function LogisticsLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();

  const value = useMemo(() => ({ lang, toggleLang, tr: logisticsTranslations[lang] }), [lang]);
  return <LogisticsLangContext.Provider value={value}>{children}</LogisticsLangContext.Provider>;
}

export function useLogisticsLang() {
  const ctx = useContext(LogisticsLangContext);
  if (!ctx) throw new Error('useLogisticsLang must be used within LogisticsLangProvider');
  return ctx;
}
