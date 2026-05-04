import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const LogisticsThemeContext = createContext(null);

export function LogisticsThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <LogisticsThemeContext.Provider value={value}>{children}</LogisticsThemeContext.Provider>;
}

export function useLogisticsTheme() {
  const ctx = useContext(LogisticsThemeContext);
  if (!ctx) throw new Error('useLogisticsTheme must be used within LogisticsThemeProvider');
  return ctx;
}
