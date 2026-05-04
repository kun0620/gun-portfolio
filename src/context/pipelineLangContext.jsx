import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/pipelineTranslations.js';
import { useGlobalLangState } from './globalTweak.js';

const LangContext = createContext();

export function PipelineLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang, toggleLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const usePipelineLang = () => useContext(LangContext);
