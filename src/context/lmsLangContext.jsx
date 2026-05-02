import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/lmsTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext(null);

export function LmsLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();

  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLmsLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLmsLang must be used within LmsLangProvider');
  return ctx;
}
