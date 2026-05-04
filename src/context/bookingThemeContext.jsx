import { createContext, useContext, useMemo } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const BookingThemeContext = createContext();

export function BookingThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <BookingThemeContext.Provider value={value}>{children}</BookingThemeContext.Provider>;
}

export const useBookingTheme = () => useContext(BookingThemeContext);
