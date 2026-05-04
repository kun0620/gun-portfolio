import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const ThemeContext = createContext(null);

export function FinanceThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useFinanceTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useFinanceTheme must be used within FinanceThemeProvider');
  return ctx;
}
