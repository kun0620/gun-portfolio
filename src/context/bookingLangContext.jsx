import { createContext, useContext } from 'react';
import { t } from '../data/booking/translations.js';
import { useGlobalLangState } from './globalTweak.js';

const BookingLangContext = createContext();

export function BookingLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  return <BookingLangContext.Provider value={{ lang, toggleLang, tr: t[lang] }}>{children}</BookingLangContext.Provider>;
}

export const useBookingLang = () => useContext(BookingLangContext);
