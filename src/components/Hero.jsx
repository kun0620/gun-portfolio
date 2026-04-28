import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typewriter } from './Navbar.jsx';
import { useProfile } from '../hooks/useProfile.js';

function SystemPanel({ t }) {
  const rows = [['NET.CORE','ok'],['NET.DIST','ok'],['NET.EDGE','ok'],['SRV.PROD','ok'],['BKUP.OFFSITE','ok'],['DNS.RESOLVE','ok'],['VPN.WG','ok']];
  return (
    <div className="border border-[#1a2330] bg-[#0a0e12]/70 backdrop-blur p-5 font-mono text-[12px] text-[#9aa7b4]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><span className="inline-block w-2 h-2 bg-[color:var(--accent2)] rounded-full" /><span className="text-[#cfd6de]">system.status</span></div>
        <div className="text-[#5d6b7a]">auto-refresh 1s</div>
      </div>
      <div className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-[#121820] pb-1.5">
            <span>{k}</span><span className="text-[color:var(--accent2)]">● {v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero({ tweak, onSoundClick }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const name = t('hero.name');
  const roles = t('hero.roles', { returnObjects: true });
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const h = setInterval(() => { setGlitching(true); setTimeout(() => setGlitching(false), 220); }, 4500);
    return () => clearInterval(h);
  }, []);

  const stagger = (delay) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: .7, delay, ease: [.2,.7,.2,1] } });
  const ASCIIName = () => (
    <motion.div {...stagger(.15)} className="font-mono leading-[.88] text-[clamp(64px,14vw,220px)] font-bold tracking-[-.04em] text-[#e8eef5]">
      <span className={`glitch ${glitching ? 'is-glitching' : ''}`} data-text={name}
        onMouseEnter={() => { setGlitching(true); onSoundClick(); setTimeout(() => setGlitching(false), 500); }}>
        {name}
      </span>
    </motion.div>
  );

  const variants = {
    ascii: (
      <div className="space-y-6">
        <motion.div {...stagger(0)} className="font-mono text-[12px] tracking-[.2em] text-[color:var(--accent)] uppercase">{t('hero.handle')} ./portfolio --init</motion.div>
        <ASCIIName />
        <motion.div {...stagger(.22)} className="font-mono text-[clamp(13px,1.2vw,16px)] text-[#5d6b7a] tracking-[.12em] uppercase flex items-center gap-3">
          <span className="h-px w-8 bg-[#1a2330]" />
          <span className="text-[#9aa7b4]">Gorawit Phinit</span>
          <span className="text-[#3d4956]">·</span>
          <span>IT Engineer</span>
        </motion.div>
        <motion.div {...stagger(.3)} className="font-mono text-[clamp(14px,1.3vw,18px)] text-[#9aa7b4] max-w-2xl">
          <span className="text-[#5d6b7a]">&gt;</span> <Typewriter strings={roles} mode={tweak.roleAnim} />
        </motion.div>
      </div>
    ),
    terminal: (
      <div className="font-mono text-[clamp(18px,2.2vw,28px)] space-y-3 text-[#cfd6de]">
        <motion.div {...stagger(0)}><span className="text-[color:var(--accent)]">{t('hero.handle')}</span> {t('hero.whoami')}</motion.div>
        <motion.div {...stagger(.15)} className="text-[clamp(56px,12vw,180px)] font-bold leading-[.9] tracking-[-.04em] text-[#e8eef5]">{name}</motion.div>
        <motion.div {...stagger(.3)}><span className="text-[#5d6b7a]">&gt;</span> <Typewriter strings={roles} mode={tweak.roleAnim} /></motion.div>
      </div>
    ),
    split: (
      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 items-end">
        <ASCIIName /><motion.div {...stagger(.3)}><SystemPanel t={t} /></motion.div>
      </div>
    ),
    minimal: (
      <div className="space-y-6 max-w-3xl">
        <motion.div {...stagger(0)} className="font-mono text-[clamp(14px,1.2vw,15px)] text-[color:var(--accent)]">{t('hero.handle')} whoami</motion.div>
        <motion.div {...stagger(.15)} className="font-mono text-[clamp(56px,10vw,140px)] font-bold leading-[.9] tracking-[-.04em] text-[#e8eef5]">{name}</motion.div>
        <motion.div {...stagger(.3)} className="font-mono text-[clamp(16px,1.6vw,22px)] text-[#9aa7b4]">
          <span className="text-[#5d6b7a]">&gt;</span> <Typewriter strings={roles} mode={tweak.roleAnim} />
        </motion.div>
      </div>
    ),
  };
  const socials = [
    { label: 'GitHub', href: profile?.github_url },
    { label: 'LinkedIn', href: profile?.linkedin_url },
    { label: 'Line', href: profile?.line_id ? `https://line.me/ti/p/~${profile.line_id}` : null },
    { label: 'Email', href: profile?.email ? `mailto:${profile.email}` : `mailto:${t('contact.email')}` },
  ].filter(item => item.href);

  return (
    <section id="top" className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 content-section">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div {...stagger(0)} className="flex items-center gap-3 mb-8 font-mono text-[11px] text-[#5d6b7a]">
          <span className="h-px flex-1 bg-[#1a2330] max-w-12" /><span>v6.2.0 — portfolio.dark</span><span className="h-px flex-1 bg-[#1a2330]" />
        </motion.div>
        {variants[tweak.heroStyle] || variants.ascii}
        <motion.div {...stagger(.45)} className="mt-10 lg:mt-14 text-[clamp(16px,1.6vw,20px)] text-[#9aa7b4] max-w-2xl font-light">{t('hero.tagline')}</motion.div>
        <motion.div {...stagger(.6)} className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#projects" onMouseEnter={onSoundClick} className="btn inline-flex items-center gap-2 h-11 px-5 font-mono text-[13px] bg-[color:var(--accent)] text-[#080c10] hover:bg-white">
            <span>▸</span> {t('hero.cta1')}
          </a>
          <a href="#contact" onMouseEnter={onSoundClick} className="btn inline-flex items-center gap-2 h-11 px-5 font-mono text-[13px] border border-[#2a3545] text-[#cfd6de] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]">
            {t('hero.cta2')} <span>→</span>
          </a>
          <div className="ml-2 hidden sm:flex items-center gap-2 h-11 px-3 font-mono text-[11px] text-[#9aa7b4] border-l border-[#1a2330]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--accent2)] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--accent2)]" />
            </span>{t('hero.available')}
          </div>
        </motion.div>
        <motion.div {...stagger(.75)} className="mt-14 flex items-center gap-4 font-mono text-[11px] text-[#5d6b7a]">
          <span>{'// socials'}</span><div className="h-px flex-1 bg-[#1a2330] max-w-24" />
          {socials.map(s => (
            <a key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" onMouseEnter={onSoundClick} className="hover:text-[color:var(--accent)] link-u">{s.label}</a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
