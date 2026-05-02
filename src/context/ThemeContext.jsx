import { createContext, useContext } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
