import { createContext, useContext, useMemo } from 'react';
import { pulsehubTranslations } from '../data/pulsehub/translations.js';
import { useGlobalLangState } from './globalTweak.js';

const PulsehubLangContext = createContext(null);

export function PulsehubLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();

  const value = useMemo(() => ({ lang, toggleLang, tr: pulsehubTranslations[lang] }), [lang]);
  return <PulsehubLangContext.Provider value={value}>{children}</PulsehubLangContext.Provider>;
}

export function usePulsehubLang() {
  const ctx = useContext(PulsehubLangContext);
  if (!ctx) throw new Error('usePulsehubLang must be used within PulsehubLangProvider');
  return ctx;
}
