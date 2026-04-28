import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../hooks/useProfile.js';
import { useProjects } from '../hooks/useProjects.js';
import { useExperience } from '../hooks/useExperience.js';
import { useV2Animations } from '../lib/gsap/v2Animations.js';
import V2Loading from './V2Loading.jsx';

const V2HeroCanvas = lazy(() => import('./V2HeroCanvas.jsx'));

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function V2CanvasFallback() {
  return (
    <div className="v2-canvas-fallback absolute inset-0" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => <span key={i} />)}
    </div>
  );
}

function SectionHeader({ num, title }) {
  return (
    <>
      <div className="flex items-center gap-4 mb-5" data-reveal>
        <span className="v2-num">{num}</span>
        <hr className="v2-rule" />
      </div>
      <h2 className="v2-section-h2 mb-10" data-reveal>{title}</h2>
    </>
  );
}

export default function V2Landing() {
  const rootRef = useRef(null);
  const heroCanvasApiRef = useRef(null);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: profile } = useProfile();
  const { data: dbProjects } = useProjects();
  const { data: dbExperience } = useExperience();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [renderCanvas, setRenderCanvas] = useState(false);
  useV2Animations(rootRef, heroCanvasApiRef, loaded);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wide = window.matchMedia('(min-width: 768px)');
    const sync = () => setRenderCanvas(wide.matches && !reduced.matches);
    sync();
    wide.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      wide.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  useEffect(() => {
    if (!renderCanvas) return undefined;
    const preload = window.setTimeout(() => {
      import('./V2HeroCanvas.jsx');
    }, 120);
    return () => window.clearTimeout(preload);
  }, [renderCanvas]);

  const setLang = (nextLang) => {
    i18n.changeLanguage(nextLang);
    localStorage.setItem('lang', nextLang);
  };

  const highlights = t('v2.highlights.items', { returnObjects: true });
  const navLinks = t('v2.nav.links', { returnObjects: true });
  const localeProjects = t('projects.items', { returnObjects: true });
  const localeExp = t('experience.items', { returnObjects: true });
  const heroHudItems = ['FACTORY INFRA', 'ERP SUPPORT', 'WEB SYSTEMS', 'AUTOMATION'];
  const heroStatusItems = ['ONLINE', 'SECURE', 'READY'];

  const projects = useMemo(() => {
    if (!dbProjects) return localeProjects.slice(0, 3);
    return dbProjects.slice(0, 3).map((p) => ({
      tag: p.tag,
      name: p[`name_${lang}`] ?? p.name_en,
      sub: p[`sub_${lang}`] ?? p.sub_en,
      body: p[`body_${lang}`] ?? p.body_en,
      stack: p.stack ?? [],
      metrics: Array.isArray(p.metrics) ? p.metrics : [],
    }));
  }, [dbProjects, localeProjects, lang]);

  const experience = useMemo(() => {
    if (!dbExperience) return localeExp.slice(0, 3);
    return dbExperience.slice(0, 3).map((e) => ({
      range: e[`range_${lang}`] ?? e.range_en,
      role: e.role,
      org: e[`org_${lang}`] ?? e.org_en,
      body: e[`body_${lang}`] ?? e.body_en,
    }));
  }, [dbExperience, localeExp, lang]);

  const stats = [
    { label: t('v2.proof.stats.projects'), value: String(projects.length).padStart(2, '0') },
    { label: t('v2.proof.stats.years'), value: profile?.stat_1_value || '5+' },
    { label: t('v2.proof.stats.response'), value: t('v2.proof.responseValue') },
  ];

  if (!loaded) {
    return <V2Loading onComplete={handleLoadingComplete} />;
  }

  return (
    <div ref={rootRef} className="v2-root min-h-screen">
      <div className="v2-bg-noise" />

      {/* ── Nav ── */}
      <header data-v2-nav className="v2-nav fixed top-0 inset-x-0 z-50">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="v2-logo">gun.it</a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToId(link.id)}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
              className="v2-btn-muted h-9 px-3 text-xs uppercase"
            >
              {lang === 'en' ? 'TH' : 'EN'}
            </button>
            <a href="/" className="v2-btn-muted hidden sm:inline-flex h-9 px-3 text-xs items-center">
              Legacy
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="v2-btn-muted md:hidden h-9 px-3 text-xs"
            >
              Menu
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-[rgba(255,45,45,0.15)] bg-black/95">
            <div className="max-w-[1160px] mx-auto px-5 py-3 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { scrollToId(link.id); setMenuOpen(false); }}
                  className="text-left text-sm text-white/80 py-1"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section
          id="v2-hero"
          className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        >
          {/* Three.js network canvas is desktop-only; mobile/reduced-motion keeps the lightweight fallback. */}
          {renderCanvas ? (
            <Suspense fallback={<V2CanvasFallback />}>
              <V2HeroCanvas ref={heroCanvasApiRef} />
            </Suspense>
          ) : (
            <V2CanvasFallback />
          )}

          {/* HUD corners */}
          <div className="v2-hud-corner v2-hud-tl" />
          <div className="v2-hud-corner v2-hud-tr" />
          <div className="v2-hud-corner v2-hud-bl" />
          <div className="v2-hud-corner v2-hud-br" />

          <div className="v2-hero-hud v2-hero-hud-left hidden lg:flex" data-hero-hud aria-hidden="true">
            {heroHudItems.map((item, index) => (
              <span key={item} className="v2-hud-label">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item}
              </span>
            ))}
          </div>

          <div className="v2-hero-hud v2-hero-hud-right hidden xl:flex" data-hero-hud aria-hidden="true">
            {heroStatusItems.map((item) => (
              <span key={item} className="v2-hud-label v2-hud-label-status">{item}</span>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1160px] mx-auto px-5 md:px-8 pt-28 pb-20">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,45,45,0.35)] text-[rgba(255,100,100,0.9)] px-3 py-1 text-xs mb-6"
              data-hero-el
            >
              {t('v2.hero.badge')}
            </div>
            <h1 className="v2-headline max-w-4xl" data-hero-el>
              {t('v2.hero.title')}
            </h1>
            <p className="v2-subtitle mt-5 max-w-2xl" data-hero-el>
              {t('v2.hero.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-hero-el>
              <button
                onClick={() => scrollToId('v2-projects')}
                className="v2-btn-primary h-11 px-6 text-sm"
              >
                {t('v2.hero.ctaPrimary')}
              </button>
              <button
                onClick={() => scrollToId('v2-contact')}
                className="v2-btn-muted h-11 px-6 text-sm"
              >
                {t('v2.hero.ctaSecondary')}
              </button>
            </div>

            {/* Stats row under CTA */}
            <div
              className="mt-12 flex gap-10 flex-wrap border-t border-[rgba(255,45,45,0.15)] pt-8"
              data-hero-el
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-[#ff2d2d]">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => scrollToId('v2-highlights')}
            className="v2-scroll-cue"
            data-scroll-indicator
            aria-label="Scroll to systems"
          >
            <span>SCROLL</span>
            <i />
          </button>
        </section>

        {/* ── 01 Capabilities ── */}
        <section
          id="v2-highlights"
          className="max-w-[1160px] mx-auto px-5 md:px-8 mt-28 md:mt-40"
        >
          <SectionHeader num="01" title={t('v2.highlights.title')} />
          <div className="grid md:grid-cols-3 gap-4" data-stagger-group>
            {highlights.map((item) => (
              <article key={item.title} data-stagger-item className="v2-card rounded-2xl p-6">
                <h3 className="text-white text-lg font-semibold">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mt-2">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 02 Work ── */}
        <section
          id="v2-projects"
          className="max-w-[1160px] mx-auto px-5 md:px-8 mt-28 md:mt-40"
        >
          <SectionHeader num="02" title={t('v2.projects.title')} />
          <div className="grid md:grid-cols-3 gap-4" data-stagger-group>
            {projects.map((project) => (
              <article key={project.name} data-stagger-item className="v2-card rounded-2xl p-6">
                <div className="text-[rgba(255,100,100,0.9)] text-xs mb-3 font-mono">
                  {project.tag}
                </div>
                <h3 className="text-white text-lg font-semibold">{project.name}</h3>
                <p className="text-white/50 text-xs mt-1">{project.sub}</p>
                <p className="text-white/65 text-sm mt-3 leading-relaxed">{project.body}</p>
                {project.metrics?.length > 0 && (
                  <div className="v2-project-metrics" aria-label="Project metrics">
                    {project.metrics.slice(0, 3).map(([label, value]) => (
                      <span key={`${label}-${value}`}>
                        <strong>{value}</strong>
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {project.stack.slice(0, 4).map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] text-white/65 border border-[rgba(255,45,45,0.2)] px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── 03 Experience ── */}
        <section
          id="v2-experience"
          className="max-w-[1160px] mx-auto px-5 md:px-8 mt-28 md:mt-40"
        >
          <SectionHeader num="03" title={t('v2.experience.title')} />
          <div className="grid md:grid-cols-3 gap-4" data-stagger-group>
            {experience.map((item) => (
              <article
                key={`${item.range}-${item.role}`}
                data-stagger-item
                className="v2-card rounded-2xl p-6"
              >
                <div className="text-[rgba(255,100,100,0.8)] text-xs font-mono">{item.range}</div>
                <h3 className="text-white text-lg font-semibold mt-2">{item.role}</h3>
                <div className="text-white/50 text-sm mt-1">{item.org}</div>
                <p className="text-white/65 text-sm mt-3 leading-relaxed">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── 04 Contact ── */}
        <section
          id="v2-contact"
          className="max-w-[1160px] mx-auto px-5 md:px-8 mt-28 md:mt-40 pb-24"
          data-reveal
        >
          <SectionHeader num="04" title={t('v2.contact.title')} />
          <div className="v2-panel rounded-2xl p-6 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-white/65 max-w-xl">{t('contact.body')}</p>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <a
                href={`mailto:${profile?.email || t('contact.email')}`}
                className="v2-btn-primary h-11 px-6 text-sm inline-flex items-center"
              >
                {t('v2.contact.ctaPrimary')}
              </a>
              <a href="/" className="v2-btn-muted h-11 px-6 text-sm inline-flex items-center">
                {t('v2.contact.ctaSecondary')}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
