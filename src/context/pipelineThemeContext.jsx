import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const ThemeContext = createContext();

export function PipelineThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const usePipelineTheme = () => useContext(ThemeContext);
