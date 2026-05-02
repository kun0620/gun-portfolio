import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar } from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Topology from './components/Topology.jsx';
import { About, Skills, Projects, Experience, Contact, KonamiOverlay } from './components/Sections.jsx';
import Showcase from './components/Showcase.jsx';
import CustomizePanel from './components/CustomizePanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import {
  applyAccent, applyBgPattern, applyDensity, applyCrosshair, applyTopology,
  beep, useReveal, useKonami, useCrosshairTracker,
} from './lib/utils.js';
import { readGunTweaks, subscribeGunTweaks, writeGunTweaksPatch } from './context/globalTweak.js';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const EcommerceStorefrontPage = lazy(() => import('./pages/EcommerceStorefrontPage.jsx'));
const KradoMarketplacePage = lazy(() => import('./pages/KradoMarketplacePage.jsx'));
const PipelinePage = lazy(() => import('./pages/PipelinePage.jsx'));
const BookingPage = lazy(() => import('./pages/BookingPage.jsx'));
const LearnlyPage = lazy(() => import('./pages/LearnlyPage.jsx'));
const FinancePage = lazy(() => import('./pages/FinancePage.jsx'));
const HealthPage = lazy(() => import('./pages/HealthPage.jsx'));
const LogisticsPage = lazy(() => import('./pages/LogisticsPage.jsx'));
const PulseHubPage = lazy(() => import('./pages/PulseHubPage.jsx'));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[#080c10] text-[#9aa7b4] grid place-items-center font-mono text-sm">
      loading...
    </div>
  );
}

const DEFAULT_TWEAK = {
  lang: 'en', accent: 'sky-lime', bgPattern: 'dots', heroStyle: 'ascii',
  roleAnim: 'typewriter', density: 'comfy', theme: 'dark', crosshair: false, sound: false, topology: true,
};

function Portfolio({ tweak, setTweak }) {
  const [konami, setKonami] = useState(false);

  const { i18n: i18nRef } = useTranslation();
  useEffect(() => { i18nRef.changeLanguage(tweak.lang); localStorage.setItem('lang', tweak.lang); document.documentElement.lang = tweak.lang; }, [tweak.lang, i18nRef]);
  useEffect(() => applyAccent(tweak.accent), [tweak.accent]);
  useEffect(() => applyBgPattern(tweak.bgPattern), [tweak.bgPattern]);
  useEffect(() => applyDensity(tweak.density), [tweak.density]);
  useEffect(() => applyCrosshair(tweak.crosshair), [tweak.crosshair]);
  useEffect(() => applyTopology(tweak.topology), [tweak.topology]);
  useEffect(() => {
    document.documentElement.dataset.themeMode = tweak.theme;
  }, [tweak.theme]);

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
          <Showcase />
          <Experience />
        <Contact onSoundClick={onSoundClick} />
      </main>
      <KonamiOverlay on={konami} onClose={() => setKonami(false)} />
    </div>
  </div>
  );
}

export default function App() {
  const [tweak, setTweakState] = useState(() => ({ ...DEFAULT_TWEAK, ...readGunTweaks() }));

  useEffect(() => subscribeGunTweaks((next) => {
    setTweakState((prev) => ({ ...prev, ...next }));
  }), []);

  const setTweak = useCallback((key, value) => {
    setTweakState((prev) => {
      const next = { ...prev, [key]: value };
      writeGunTweaksPatch(next);
      return next;
    });
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <>
          <Routes>
            <Route path="/" element={<Portfolio tweak={tweak} setTweak={setTweak} />} />
            <Route path="/demo/saas-dashboard" element={<DashboardPage />} />
            <Route path="/demo/ecommerce-storefront" element={<EcommerceStorefrontPage />} />
            <Route path="/demo/two-sided-marketplace" element={<KradoMarketplacePage />} />
            <Route path="/demo/crm-sales-pipeline" element={<PipelinePage />} />
            <Route path="/demo/booking-reservation" element={<BookingPage />} />
            <Route path="/demo/lms-course-platform" element={<LearnlyPage />} />
            <Route path="/demo/personal-finance-tracker" element={<FinancePage />} />
            <Route path="/demo/patient-portal" element={<HealthPage />} />
            <Route path="/demo/logistics-live-tracking" element={<LogisticsPage />} />
            <Route path="/demo/social-community" element={<PulseHubPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <CustomizePanel tweak={tweak} setTweak={setTweak} />
        </>
      </Suspense>
    </BrowserRouter>
  );
}
