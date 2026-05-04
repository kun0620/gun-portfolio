import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/healthTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext(null);

export function HealthLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();

  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang, toggleLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useHealthLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useHealthLang must be used within HealthLangProvider');
  return ctx;
}
