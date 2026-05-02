import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const ThemeContext = createContext(null);

export function HealthThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useHealthTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useHealthTheme must be used within HealthThemeProvider');
  return ctx;
}
