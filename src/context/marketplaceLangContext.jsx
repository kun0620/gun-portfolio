import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/marketplaceTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext();

export function LangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang, toggleLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
