import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'gun_tweaks';
const EVENT_NAME = 'gun_tweaks_change';

const DEFAULT_TWEAKS = {
  theme: 'dark',
  lang: 'en',
};

function normalizeTheme(value) {
  return value === 'light' ? 'light' : 'dark';
}

function normalizeLang(value) {
  return value === 'th' ? 'th' : 'en';
}

export function readGunTweaks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TWEAKS };
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      theme: normalizeTheme(parsed?.theme),
      lang: normalizeLang(parsed?.lang),
    };
  } catch {
    return { ...DEFAULT_TWEAKS };
  }
}

export function writeGunTweaksPatch(patch) {
  const next = { ...readGunTweaks(), ...patch };
  const normalized = {
    ...next,
    theme: normalizeTheme(next.theme),
    lang: normalizeLang(next.lang),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // ignore localStorage errors
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
  return normalized;
}

export function subscribeGunTweaks(onChange) {
  const notify = () => onChange(readGunTweaks());
  const onStorage = (event) => {
    if (event.key === STORAGE_KEY) notify();
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener('focus', notify);
  window.addEventListener(EVENT_NAME, notify);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.removeEventListener('focus', notify);
    window.removeEventListener(EVENT_NAME, notify);
  };
}

export function useGlobalThemeState() {
  const [theme, setThemeState] = useState(() => readGunTweaks().theme);

  useEffect(() => subscribeGunTweaks((next) => setThemeState(next.theme)), []);

  const setTheme = useCallback((nextValue) => {
    const current = readGunTweaks().theme;
    const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue;
    writeGunTweaksPatch({ theme: normalizeTheme(resolved) });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}

export function useGlobalLangState() {
  const [lang, setLangState] = useState(() => readGunTweaks().lang);

  useEffect(() => subscribeGunTweaks((next) => setLangState(next.lang)), []);

  const setLang = useCallback((nextValue) => {
    const current = readGunTweaks().lang;
    const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue;
    writeGunTweaksPatch({ lang: normalizeLang(resolved) });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'th' : 'en'));
  }, [setLang]);

  return { lang, setLang, toggleLang };
}
