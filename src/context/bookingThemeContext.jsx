import { createContext, useContext } from 'react';
import { useGlobalThemeState } from './globalTweak.js';

const BookingThemeContext = createContext();

export function BookingThemeProvider({ children }) {
  const { theme, toggleTheme } = useGlobalThemeState();

  return <BookingThemeContext.Provider value={{ theme, toggleTheme }}>{children}</BookingThemeContext.Provider>;
}

export const useBookingTheme = () => useContext(BookingThemeContext);
