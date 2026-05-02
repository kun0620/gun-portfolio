import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { beep } from '../lib/utils.js';
import { supabase, getPublicUrl } from '../lib/supabase.js';
import { useProfile } from '../hooks/useProfile.js';
import { useProjects } from '../hooks/useProjects.js';
import { useExperience } from '../hooks/useExperience.js';

export function SectionHeader({ kicker, title, id }) {
  return (
    <div id={id} className="mb-10">
      <div className="font-mono text-[11px] text-[color:var(--accent)] mb-2 tracking-wider">{kicker}</div>
      <h2 className="text-[clamp(28px,4vw,44px)] font-semibold tracking-tight text-[#e8eef5]">{title}</h2>
    </div>
  );
}

export function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: profile } = useProfile();

  const body = profile?.[`bio_${lang}`] ?? t('about.body', { returnObjects: true });
  const localeStats = t('about.stats', { returnObjects: true });
  const stats = profile ? [
    { value: profile.stat_1_value, label: profile[`stat_1_label_${lang}`] },
    { value: profile.stat_2_value, label: profile[`stat_2_label_${lang}`] },
    { value: profile.stat_3_value, label: profile[`stat_3_label_${lang}`] },
  ] : localeStats;
  const photoUrl = profile?.photo_url ? getPublicUrl(profile.photo_url) : null;

  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader id="about" kicker={t('about.kicker')} title={t('about.title')} />
        <div className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-16">
          <div className="reveal">
            <div className="relative aspect-[4/5] border border-[#1a2330] bg-[#0a0e12] overflow-hidden">
              {photoUrl ? (
                <img src={photoUrl} alt="Gorawit Phinit" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-dots opacity-40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#2a3545] flex items-center justify-center font-mono text-[color:var(--accent)] text-xs tracking-widest">GUN.jpg</div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-[color:var(--accent)]/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-[color:var(--accent)]/30" />
                </>
              )}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#5d6b7a]">
                <span>IMG_0421.RAW</span><span className="text-[color:var(--accent2)]">● REC</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-[#5d6b7a]">
                <span>f/1.8 · 1/125s · ISO 400</span><span>+</span>
              </div>
            </div>
          </div>
          <div className="reveal">
            <div className="space-y-6 text-[17px] text-[#cfd6de] leading-relaxed max-w-2xl" style={{ textWrap: 'pretty' }}>
              {(Array.isArray(body) ? body : [body]).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-10 grid grid-cols-3 gap-px bg-[#1a2330] border border-[#1a2330]">
              {stats.map((s, i) => (
                <div key={i} className="bg-[#080c10] p-5">
                  <div className="font-mono text-[clamp(24px,3vw,36px)] font-bold text-[color:var(--accent)]">{s.value}</div>
                  <div className="font-mono text-[11px] text-[#5d6b7a] mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const { t } = useTranslation();
  const groups = t('skills.groups', { returnObjects: true });
  const icons = { "Infrastructure & Network": "◫", "Web Development": "◈", "AI & Tools": "✦" };
  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader id="skills" kicker={t('skills.kicker')} title={t('skills.title')} />
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g, gi) => (
            <div key={g.name} className="reveal border border-[#1a2330] bg-[#0a0e12]/50 p-6" style={{ transitionDelay: `${gi*80}ms` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 border border-[color:var(--accent)]/40 flex items-center justify-center text-[color:var(--accent)] font-mono">{icons[g.name] || '▸'}</div>
                <div><div className="font-mono text-[11px] text-[#5d6b7a]">0{gi+1} /</div><div className="font-semibold text-[#e8eef5]">{g.name}</div></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(it => (
                  <span key={it} className="font-mono text-[11px] px-2 py-1 border border-[#1a2330] bg-[#080c10] text-[#cfd6de] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] transition-colors">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects({ onSoundClick }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: dbProjects } = useProjects();
  const localeItems = t('projects.items', { returnObjects: true });

  const items = dbProjects
    ? dbProjects.map(p => ({
        tag: p.tag,
        name: p[`name_${lang}`] ?? p.name_en,
        sub: p[`sub_${lang}`] ?? p.sub_en,
        body: p[`body_${lang}`] ?? p.body_en,
        stack: p.stack ?? [],
        metrics: p.metrics ?? null,
        featured: p.featured,
        case_study_url: p.case_study_url,
        github_url: p.github_url,
        live_url: p.live_url,
      }))
    : localeItems;

  const filtered = useMemo(() => items.filter(p => p.tag === 'INFRA'), [items]);

  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader id="projects" kicker={t('projects.kicker')} title={t('projects.title')} />
        <div className="flex items-center gap-2 mb-8 font-mono text-[12px]">
          <span className="h-8 px-3 border border-[color:var(--accent)]/50 text-[color:var(--accent)] inline-flex items-center">INFRA</span>
          <div className="ml-auto text-[#5d6b7a]">{filtered.length} entries</div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((p, i) => (
            <motion.article key={p.name+i} initial={{ opacity:0, y: 24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-80px' }} transition={{ duration:.6, delay: i*.06 }}
              className="group relative border border-[#1a2330] bg-[#0a0e12]/50 hover:border-[color:var(--accent)]/60 transition-all duration-200 overflow-hidden md:grid md:grid-cols-[1.35fr_1fr]">
              <div className="p-7 lg:p-9">
                <div className="flex items-center gap-3 font-mono text-[11px] mb-4">
                  <span className={`px-2 py-0.5 border ${
                    p.tag === 'INFRA'
                      ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                      : p.tag === 'WEB'
                        ? 'border-[color:var(--accent2)] text-[color:var(--accent2)]'
                        : 'border-[#a78bfa] text-[#a78bfa]'
                  }`}>{p.tag}</span>
                  {p.featured && <span className="text-[#5d6b7a]">★ featured</span>}
                  <span className="text-[#5d6b7a]">{String(i+1).padStart(2,'0')} / {filtered.length}</span>
                </div>
                <h3 className="text-[22px] lg:text-[28px] font-semibold text-[#e8eef5] group-hover:text-[color:var(--accent)] transition-colors" style={{ textWrap:'balance' }}>{p.name}</h3>
                <div className="font-mono text-[12px] text-[#5d6b7a] mt-1">{p.sub}</div>
                <p className="mt-4 text-[15px] text-[#9aa7b4] leading-relaxed max-w-2xl" style={{ textWrap:'pretty' }}>{p.body}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map(s => <span key={s} className="font-mono text-[10.5px] px-1.5 py-0.5 border border-[#1a2330] text-[#9aa7b4]">{s}</span>)}
                </div>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-[#1a2330] p-7 lg:p-9 bg-[#060a0d] bg-grid flex flex-col">
                {(p.case_study_url || p.github_url || p.live_url) && (
                  <div className="mt-6 flex items-center gap-4 font-mono text-[11px]">
                    {p.case_study_url && <a href={p.case_study_url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] link-u">read_case_study()</a>}
                    {p.case_study_url && (p.github_url || p.live_url) && <span className="text-[#5d6b7a]">·</span>}
                    {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-[#9aa7b4] hover:text-[color:var(--accent)] link-u">git.log</a>}
                    {p.github_url && p.live_url && <span className="text-[#5d6b7a]">·</span>}
                    {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-[#9aa7b4] hover:text-[color:var(--accent)] link-u">open_live()</a>}
                  </div>
                )}
                {p.metrics && (
                  <div className="mt-6">
                    <div className="font-mono text-[11px] text-[#5d6b7a] mb-4">// metrics.log</div>
                    <div className="space-y-5">
                      {p.metrics.map(([k, v]) => (
                        <div key={k} className="pb-4 border-b border-[#121820] last:border-0">
                          <div className="font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider">{k}</div>
                          <div className="font-mono text-[32px] font-bold text-[color:var(--accent)] mt-1">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { data: dbExp } = useExperience();

  const items = dbExp
    ? dbExp.map(e => ({
        range: e[`range_${lang}`] ?? e.range_en,
        role: e.role,
        org: e[`org_${lang}`] ?? e.org_en,
        body: e[`body_${lang}`] ?? e.body_en,
      }))
    : t('experience.items', { returnObjects: true });
  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader id="experience" kicker={t('experience.kicker')} title={t('experience.title')} />
        <div className="relative pl-8 md:pl-12">
          <div className="timeline-line absolute left-[7px] md:left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-[color:var(--accent)]/80 via-[color:var(--accent)]/30 to-transparent" />
          <ol className="space-y-10">
            {items.map((e, i) => (
              <li key={i} className="reveal relative" style={{ transitionDelay: `${i*120}ms` }}>
                <div className="absolute -left-8 md:-left-12 top-1.5 w-4 h-4 border border-[color:var(--accent)] bg-[#080c10] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[color:var(--accent)]" /></div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <div className="font-mono text-[11px] text-[color:var(--accent)] tracking-wider">{e.range}</div>
                  <div className="font-mono text-[10px] text-[#5d6b7a]">NODE_{String(i+1).padStart(2,'0')}</div>
                </div>
                <h3 className="mt-1 text-[20px] font-semibold text-[#e8eef5]">{e.role}</h3>
                <div className="font-mono text-[13px] text-[#9aa7b4]">{e.org}</div>
                <p className="mt-2 text-[15px] text-[#9aa7b4] leading-relaxed max-w-2xl" style={{ textWrap:'pretty' }}>{e.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Contact({ onSoundClick }) {
  const { t } = useTranslation();
  const { data: profile } = useProfile();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', message:'' });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setError(null);
    const { error: insertError } = await supabase.from('messages').insert([{ name: form.name, email: form.email, message: form.message }]);
    setSending(false);
    if (insertError) {
      setError(insertError.message || 'Could not send message. Please try email or Line.');
      return;
    }
    setForm({ name:'', email:'', message:'' });
    setSent(true); beep(880,.08); setTimeout(() => beep(1320,.08), 120);
  };

  const qrUrl = profile?.wechat_qr_url ? getPublicUrl(profile.wechat_qr_url) : null;
  const socials = [
    { label: 'GitHub',   icon: '⌘', href: profile?.github_url || null, sub: profile?.github_url || 'not set' },
    { label: 'LinkedIn', icon: 'in', href: profile?.linkedin_url || null, sub: profile?.linkedin_url || 'not set' },
    { label: 'Line',     icon: 'L',  href: profile?.line_id ? `https://line.me/ti/p/~${profile.line_id}` : null, sub: profile?.line_id || 'not set' },
    { label: 'Email',    icon: '@',  href: profile?.email ? `mailto:${profile.email}` : null, sub: profile?.email || t('contact.email') },
  ];

  return (
    <section className="relative content-section py-24 border-t border-[#121820]">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionHeader id="contact" kicker={t('contact.kicker')} title={t('contact.title')} />
        <div className="grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16">
          <form onSubmit={submit} className="reveal space-y-5">
            <p className="text-[16px] text-[#9aa7b4] max-w-xl leading-relaxed" style={{ textWrap:'pretty' }}>{t('contact.body')}</p>
            <div className="border border-[#1a2330] bg-[#0a0e12]/60 font-mono text-[13px]">
              <div className="flex items-center gap-2 px-3 h-8 border-b border-[#1a2330] text-[11px] text-[#5d6b7a]">
                <span className="w-2 h-2 rounded-full bg-[#ff6b6b]/60" /><span className="w-2 h-2 rounded-full bg-[#fbbf24]/60" /><span className="w-2 h-2 rounded-full bg-[color:var(--accent2)]/60" />
                <span className="ml-2">~/contact.sh</span>
              </div>
              <div className="p-5 space-y-4">
                {['name','email'].map(k => (
                  <label key={k} className="block">
                    <span className="block text-[11px] text-[#5d6b7a] mb-1">&gt; {t(`contact.form.${k}`)}</span>
                    <input type={k==='email'?'email':'text'} value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))}
                      className="w-full bg-transparent border-b border-[#1a2330] focus:border-[color:var(--accent)] outline-none py-1.5 text-[#cfd6de] placeholder:text-[#3d4956]" placeholder={`${t(`contact.form.${k}`)}...`} required />
                  </label>
                ))}
                <label className="block">
                  <span className="block text-[11px] text-[#5d6b7a] mb-1">&gt; {t('contact.form.message')}</span>
                  <textarea rows={4} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    className="w-full bg-transparent border border-[#1a2330] focus:border-[color:var(--accent)] outline-none p-2.5 text-[#cfd6de] placeholder:text-[#3d4956] resize-none" placeholder={`${t('contact.form.message')}...`} required />
                </label>
              </div>
              <div className="flex items-center justify-between px-5 pb-5">
                {error ? <span className="font-mono text-[12px] text-[#ff6b6b]">[error] {error}</span>
                  : sent ? <span className="font-mono text-[12px] text-[color:var(--accent2)]">{t('contact.form.sent')}</span>
                  : <span className="font-mono text-[12px] text-[#5d6b7a]">press Enter or click →</span>}
                <button type="submit" disabled={sending} onMouseEnter={onSoundClick} className="btn inline-flex items-center gap-2 h-10 px-5 font-mono text-[12px] bg-[color:var(--accent)] text-[#080c10] hover:bg-white disabled:opacity-50">
                  {sending ? 'sending...' : t('contact.form.send')} <span>▸</span>
                </button>
              </div>
            </div>
          </form>

          <div className="reveal space-y-5">
            {/* WeChat QR */}
            <div className="border border-[#1a2330] bg-[#0a0e12]/60 p-6 flex gap-5 items-start">
              <div className="w-28 h-28 bg-white p-2 shrink-0 flex items-center justify-center overflow-hidden">
                {qrUrl
                  ? <img src={qrUrl} alt="WeChat QR" className="w-full h-full object-contain" />
                  : <span className="font-mono text-[9px] text-[#080c10]">QR · scan me</span>}
              </div>
              <div>
                <div className="font-mono text-[11px] text-[#5d6b7a]">// wechat</div>
                <div className="font-semibold text-[#e8eef5]">{t('contact.qr')}</div>
                <div className="mt-2 text-[13px] text-[#9aa7b4]">scan to add</div>
                {profile?.line_id && <div className="mt-3 font-mono text-[11px] text-[color:var(--accent)]">{profile.line_id}</div>}
              </div>
            </div>

            {/* Social links */}
            <div className="border border-[#1a2330] bg-[#0a0e12]/60 divide-y divide-[#121820]">
              {socials.map(({ label, icon, href, sub }) => {
                const Comp = href ? 'a' : 'div';
                return (
                <Comp key={label} href={href || undefined} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  onMouseEnter={href ? onSoundClick : undefined}
                  className={`flex items-center gap-4 px-5 py-3.5 group ${href ? 'hover:bg-[#121820]/50' : 'opacity-60'}`}>
                  <span className="w-8 h-8 border border-[#1a2330] flex items-center justify-center font-mono text-[color:var(--accent)] group-hover:border-[color:var(--accent)]">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#e8eef5]">{label}</div>
                    <div className="font-mono text-[11px] text-[#5d6b7a] truncate">{sub}</div>
                  </div>
                  {href && <span className="text-[color:var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>}
                </Comp>
              )})}
            </div>
          </div>
        </div>

        <footer className="mt-20 pt-6 border-t border-[#121820] flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#5d6b7a]">
          <span>{t('footer')}</span>
          <span className="ml-auto">press <span className="kbd">↑↑↓↓←→←→BA</span> for a surprise</span>
        </footer>
      </div>
    </section>
  );
}

export function KonamiOverlay({ on, onClose }) {
  if (!on) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-[#080c10]/90 backdrop-blur flex items-center justify-center p-6" onClick={onClose}>
      <div className="max-w-xl w-full border border-[color:var(--accent)] bg-[#0a0e12] p-7 font-mono text-[13px]">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[color:var(--accent)]">◉ ROOT SHELL GRANTED</div>
          <button onClick={onClose} className="text-[#9aa7b4] hover:text-[#cfd6de]">[esc]</button>
        </div>
        <pre className="text-[#cfd6de] leading-5 text-[12px]">{`$ sudo cat /etc/gun.secret
> actually spent 4 years in a factory near Rayong
> still keeps a Cisco 2960 on the desk as decoration
> drinks oat-milk latte, breaks things, fixes them twice
> LF: remote-first work with decent factory clients
> PGP: 0xDEADBEEF — email for fingerprint`}</pre>
        <div className="mt-4 text-[#5d6b7a]">// click anywhere to close</div>
      </div>
    </div>
  );
}
