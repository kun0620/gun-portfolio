import { createContext, useContext } from 'react';
import { t } from '../data/pipelineTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext();

export function PipelineLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  return <LangContext.Provider value={{ lang, toggleLang, tr: t[lang] }}>{children}</LangContext.Provider>;
}

export const usePipelineLang = () => useContext(LangContext);
