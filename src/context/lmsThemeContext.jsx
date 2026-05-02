import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const ThemeContext = createContext(null);

export function LmsThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useLmsTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useLmsTheme must be used within LmsThemeProvider');
  return ctx;
}
