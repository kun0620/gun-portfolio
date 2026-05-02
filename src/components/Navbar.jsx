// Navbar + Typewriter component
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useLiveStatus } from '../lib/utils.js';
import { getPublicUrl } from '../lib/supabase.js';
import { useProfile } from '../hooks/useProfile.js';

/* ── Typewriter ──────────────────────────────────────────────────── */
export function Typewriter({ strings = [], mode = 'typewriter', className = '' }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | pause | erasing

  useEffect(() => {
    if (!strings.length) return;
    const target = strings[idx % strings.length];

    if (mode === 'fade') {
      const t = setInterval(() => setIdx(i => i + 1), 2600);
      return () => clearInterval(t);
    }

    if (mode === 'terminal') {
      setDisplayed('');
      setPhase('typing');
    }

    let timeout;
    if (phase === 'typing') {
      if (displayed.length < target.length) {
        timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55);
      } else {
        timeout = setTimeout(() => setPhase('pause'), 1800);
      }
    } else if (phase === 'pause') {
      timeout = setTimeout(() => setPhase('erasing'), 400);
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(d => d.slice(0, -1)), 28);
      } else {
        setIdx(i => i + 1);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, idx, strings, mode]);

  if (mode === 'fade') {
    return (
      <AnimatePresence mode="wait">
        <motion.span key={idx} className={className}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}>
          {strings[idx % strings.length]}
        </motion.span>
      </AnimatePresence>
    );
  }

  if (mode === 'terminal') {
    return (
      <span className={className}>
        <span className="text-[color:var(--accent2)] mr-1.5 select-none">{'>'}</span>
        {displayed}<span className="caret" />
      </span>
    );
  }

  // typewriter (default)
  return (
    <span className={className}>
      {displayed}<span className="caret" />
    </span>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────── */
export function Navbar({ lang, setLang, tweak, onSoundClick }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const status = useLiveStatus();
  const cvUrl = profile?.cv_url ? getPublicUrl(profile.cv_url) : null;
  const commitRef = import.meta.env.VITE_COMMIT_REF || import.meta.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local';
  const deployLabel = import.meta.env.VITE_DEPLOY_ID || status.deploys;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setVisible(y < lastY.current || y < 80);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { key: 'nav.about', id: 'about' },
    { key: 'nav.skills', id: 'skills' },
    { key: 'nav.projects', id: 'projects' },
    { key: 'nav.showcase', id: 'showcase' },
    { key: 'nav.experience', id: 'experience' },
    { key: 'nav.contact', id: 'contact' },
  ];

  const scrollTo = (id) => {
    onSoundClick?.();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const tickerItems = [
    `${t('status.ping')} ${status.ping}ms`,
    `${t('status.uptime')} ${status.uptime}`,
    `${t('status.deploys')} ${deployLabel}`,
    `${t('status.location')} TH/BKK`,
    `${t('status.lastCommit')} ${commitRef}`,
    `${t('status.online')} ●`,
  ];

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-[#060a0d]/95 backdrop-blur border-b border-[#1a2330]' : ''}`}
      animate={{ y: visible ? 0 : -80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}>

      {/* Status ticker */}
      <div className="border-b border-[#1a2330] bg-[#060a0d]/80 overflow-hidden h-7 flex items-center">
        <div className="flex-shrink-0 font-mono text-[10px] text-[color:var(--accent2)] px-3 border-r border-[#1a2330] h-full flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[color:var(--accent2)] animate-pulse" />
          {t('status.online')}
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-track font-mono text-[10px] text-[#5d6b7a]">
            {[...tickerItems].map((item, i) => (
              <span key={i} className="mx-8">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="flex items-center justify-between px-4 md:px-8 h-12">
        {/* Logo */}
        <button onClick={() => scrollTo('top')} className="font-mono text-[13px] font-bold text-[color:var(--accent)] tracking-widest glitch" data-text="GUN.DEV">
          GUN.DEV
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <button key={l.key} onClick={() => scrollTo(l.id)}
              className="link-u font-mono text-[12px] text-[#9aa7b4] hover:text-[#cfd6de] transition-colors">
              {t(l.key)}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button onClick={() => { onSoundClick?.(); setLang(lang === 'en' ? 'th' : 'en'); }}
            className="btn font-mono text-[11px] px-2.5 h-7 border border-[#1a2330] text-[#9aa7b4] hover:border-[color:var(--accent)]/60 hover:text-[color:var(--accent)] transition-colors">
            {lang === 'en' ? 'TH' : 'EN'}
          </button>
          {/* CV */}
          {cvUrl ? (
            <a href={cvUrl} download
              className="btn hidden sm:flex items-center gap-1.5 font-mono text-[11px] px-3 h-7 border border-[color:var(--accent)]/40 text-[color:var(--accent)] hover:bg-[color:var(--accent)] hover:text-[#080c10] transition-colors">
              {t('nav.cv')}
            </a>
          ) : (
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] px-3 h-7 border border-[#1a2330] text-[#5d6b7a] opacity-60">
              {t('nav.cv')}
            </span>
          )}
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-1 text-[#9aa7b4]">
            <div className={`w-5 h-px bg-current mb-1.5 transition-transform ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <div className={`w-5 h-px bg-current mb-1.5 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-px bg-current transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#1a2330] bg-[#060a0d]/98 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map(l => (
                <button key={l.key} onClick={() => scrollTo(l.id)}
                  className="text-left font-mono text-[13px] text-[#9aa7b4] hover:text-[color:var(--accent)] transition-colors py-1">
                  <span className="text-[color:var(--accent2)] mr-2">{'>'}</span>{t(l.key)}
                </button>
              ))}
              {cvUrl ? (
                <a href={cvUrl} download className="font-mono text-[12px] text-[color:var(--accent)] mt-1">
                  ↓ {t('nav.cv')}
                </a>
              ) : (
                <span className="font-mono text-[12px] text-[#5d6b7a] mt-1 opacity-60">
                  ↓ {t('nav.cv')}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
