import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en.js';
import { th } from './locales/th.js';

function getInitialLang() {
  try {
    const tweaksRaw = localStorage.getItem('gun_tweaks');
    if (tweaksRaw) {
      const tweaks = JSON.parse(tweaksRaw);
      if (tweaks?.lang === 'th' || tweaks?.lang === 'en') return tweaks.lang;
    }
    const legacyLang = localStorage.getItem('lang');
    if (legacyLang === 'th' || legacyLang === 'en') return legacyLang;
  } catch {
    // ignore storage parse errors
  }
  return 'en';
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, th: { translation: th } },
  lng: getInitialLang(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
