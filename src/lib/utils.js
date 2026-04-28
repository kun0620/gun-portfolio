// Shared hooks, palette, and helpers for the Vite version.
import { useEffect, useRef, useState, useCallback } from 'react';

export const ACCENTS = {
  "sky-lime":   { c1: "#7dd3fc", c2: "#a3e635", name: "Sky + Lime" },
  "cyan-green": { c1: "#00d4ff", c2: "#00ff88", name: "Cyan + Green (neon)" },
  "white-cyan": { c1: "#f5f5f5", c2: "#7dd3fc", name: "White + Cyan" },
  "red-cyan":   { c1: "#ff6b6b", c2: "#7dd3fc", name: "Red alert + Cyan" },
};

export function applyAccent(key) {
  const a = ACCENTS[key] || ACCENTS["sky-lime"];
  const r = document.documentElement;
  r.style.setProperty('--accent',  a.c1);
  r.style.setProperty('--accent2', a.c2);
  r.style.setProperty('--topo-accent',  a.c1);
  r.style.setProperty('--topo-accent2', a.c2);
}

export function applyBgPattern(key) {
  const el = document.getElementById('bg-pattern');
  if (!el) return;
  el.className = 'fixed inset-0 z-0 pointer-events-none ' +
    ({ dots: 'bg-dots', grid: 'bg-grid', scan: 'bg-dots bg-scan' }[key] || 'bg-dots');
  document.body.classList.toggle('bg-scan', key === 'scan');
}

export function applyDensity(key) { document.documentElement.dataset.density = key; }
export function applyCrosshair(on) {
  document.body.classList.toggle('cursor-crosshair', !!on);
  const x = document.getElementById('xhair');
  if (x) x.classList.toggle('hidden', !on);
}
export function applyTopology(on) {
  const c = document.getElementById('topology');
  if (c) c.style.display = on ? 'block' : 'none';
}

let __audioCtx;
export function beep(freq = 440, dur = 0.06) {
  try {
    if (!__audioCtx) __audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = __audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  } catch (e) {}
}

export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal, .timeline-line').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function useKonami(onUnlock) {
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let i = 0;
    const handler = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[i]) { i++; if (i === seq.length) { i = 0; onUnlock(); } }
      else { i = (k === seq[0]) ? 1 : 0; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onUnlock]);
}

export function useCrosshairTracker(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById('xhair');
    if (!el) return;
    const onMove = (e) => { el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px'; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [enabled]);
}

export function useLiveStatus() {
  const startedAt = useRef(Date.now());
  const [state, setState] = useState({ ping: 14, uptime: '0d 00:00:00', deploys: 'local' });
  useEffect(() => {
    const t = setInterval(() => {
      setState(s => {
        const elapsed = Math.floor((Date.now() - startedAt.current) / 1000);
        const days = Math.floor(elapsed / 86400);
        const hh = Math.floor((elapsed % 86400) / 3600);
        const mm = Math.floor((elapsed % 3600) / 60);
        const ss = elapsed % 60;
        const uptime = `${days}d ${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
        const ping = Math.max(8, Math.min(28, s.ping + (Math.random()*4-2)));
        return { ...s, ping: Math.round(ping), uptime };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return state;
}

// Minimal i18n-aware hook that re-renders when lang or persisted tweaks change.
export function usePersistent(key, def) {
  const [v, set] = useState(() => {
    try { const s = localStorage.getItem(key); return s === null ? def : JSON.parse(s); }
    catch { return def; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, set];
}
