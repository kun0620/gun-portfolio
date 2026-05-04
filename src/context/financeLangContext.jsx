import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/financeTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext(null);

export function FinanceLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();

  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang, toggleLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useFinanceLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useFinanceLang must be used within FinanceLangProvider');
  return ctx;
}
