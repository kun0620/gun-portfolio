import { createContext, useContext } from 'react';
import { t } from '../data/marketplaceTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext();

export function LangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  const tr = t[lang];
  return <LangContext.Provider value={{ lang, toggleLang, tr }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
