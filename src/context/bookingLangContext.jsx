import { createContext, useContext, useMemo } from 'react';
import { t } from '../data/booking/translations.js';
import { useGlobalLangState } from './globalTweak.js';

const BookingLangContext = createContext();

export function BookingLangProvider({ children }) {
  const { lang, toggleLang } = useGlobalLangState();
  const value = useMemo(() => ({ lang, toggleLang, tr: t[lang] }), [lang, toggleLang]);
  return <BookingLangContext.Provider value={value}>{children}</BookingLangContext.Provider>;
}

export const useBookingLang = () => useContext(BookingLangContext);
