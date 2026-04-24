import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from './i18n.js';
import { Navbar } from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Topology from './components/Topology.jsx';
import { About, Skills, Projects, Experience, Contact, KonamiOverlay } from './components/Sections.jsx';
import CustomizePanel from './components/CustomizePanel.jsx';
import {
  applyAccent, applyBgPattern, applyDensity, applyCrosshair, applyTopology,
  beep, useReveal, useKonami, useCrosshairTracker, usePersistent,
} from './lib/utils.js';

export default function App() {
  const [tweak, setTweakState] = usePersistent('gun_tweaks', {
    lang: 'en', accent: 'sky-lime', bgPattern: 'dots', heroStyle: 'ascii',
    roleAnim: 'typewriter', density: 'comfy', crosshair: false, sound: false, topology: true,
  });
  const setTweak = (k, v) => setTweakState(s => ({ ...s, [k]: v }));
  const [konami, setKonami] = useState(false);

  const { i18n: i18nRef } = useTranslation();
  useEffect(() => { i18nRef.changeLanguage(tweak.lang); localStorage.setItem('lang', tweak.lang); document.documentElement.lang = tweak.lang; }, [tweak.lang, i18nRef]);
  useEffect(() => applyAccent(tweak.accent), [tweak.accent]);
  useEffect(() => applyBgPattern(tweak.bgPattern), [tweak.bgPattern]);
  useEffect(() => applyDensity(tweak.density), [tweak.density]);
  useEffect(() => applyCrosshair(tweak.crosshair), [tweak.crosshair]);
  useEffect(() => applyTopology(tweak.topology), [tweak.topology]);

  useReveal();
  useCrosshairTracker(tweak.crosshair);
  useKonami(useCallback(() => { setKonami(true); beep(200,.08); setTimeout(() => beep(880,.08), 120); }, []));
  const onSoundClick = useCallback(() => { if (tweak.sound) beep(620, .035); }, [tweak.sound]);

  return (
    <div className="bg-vignette">
      <Topology />
      <div id="bg-pattern" className="fixed inset-0 z-0 pointer-events-none bg-dots" />
      <div id="xhair" className="fixed z-[70] pointer-events-none hidden">
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 border border-[color:var(--accent)]/70 rounded-full" />
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[color:var(--accent)]" />
      </div>

      <div className="relative z-10">
        <Navbar lang={tweak.lang} setLang={(l) => setTweak('lang', l)} tweak={tweak} onSoundClick={onSoundClick} />
        <main>
          <Hero tweak={tweak} onSoundClick={onSoundClick} />
          <About />
          <Skills />
          <Projects onSoundClick={onSoundClick} />
          <Experience />
          <Contact onSoundClick={onSoundClick} />
        </main>
        <KonamiOverlay on={konami} onClose={() => setKonami(false)} />
        <CustomizePanel tweak={tweak} setTweak={setTweak} />
      </div>
    </div>
  );
}
