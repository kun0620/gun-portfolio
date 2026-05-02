import { createContext, useContext, useMemo } from 'react';
import { useGlobalLangState } from './globalTweak.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  const value = useMemo(() => ({ lang, toggleLang }), [lang, toggleLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
