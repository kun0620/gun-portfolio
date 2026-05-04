import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const PulsehubThemeContext = createContext(null);

export function PulsehubThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <PulsehubThemeContext.Provider value={value}>{children}</PulsehubThemeContext.Provider>;
}

export function usePulsehubTheme() {
  const ctx = useContext(PulsehubThemeContext);
  if (!ctx) throw new Error('usePulsehubTheme must be used within PulsehubThemeProvider');
  return ctx;
}
