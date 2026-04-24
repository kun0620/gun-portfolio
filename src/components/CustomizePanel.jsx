// Public-facing "Customize UI" panel — visitor-facing control to show off customization chops.
import React, { useState, useEffect } from 'react';
import { ACCENTS } from '../lib/utils.js';

export default function CustomizePanel({ tweak, setTweak }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem('customize_seen') === '1'; } catch { return false; }
  });
  useEffect(() => {
    if (open) { try { localStorage.setItem('customize_seen', '1'); } catch {} setSeen(true); }
  }, [open]);

  const Row = ({ label, children }) => (
    <div className="mb-4 last:mb-0">
      <div className="font-mono text-[10px] uppercase tracking-[.15em] text-[#5d6b7a] mb-2">// {label}</div>
      {children}
    </div>
  );
  const Seg = ({ value, onChange, options }) => (
    <div className="flex flex-wrap gap-1">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className={`btn flex-1 min-w-0 h-8 px-2.5 font-mono text-[11px] border transition-colors ${
            value === o.value
              ? 'bg-[color:var(--accent)] text-[#080c10] border-[color:var(--accent)]'
              : 'bg-[#080c10] text-[#9aa7b4] border-[#1a2330] hover:border-[color:var(--accent)]/60 hover:text-[#cfd6de]'
          }`}>
            {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(v => !v)}
        className="fixed z-[55] bottom-5 right-5 group flex items-center gap-2 h-11 pl-3 pr-4 font-mono text-[12px]
                   bg-[#0a0e12]/90 backdrop-blur border border-[color:var(--accent)]/40 text-[color:var(--accent)]
                   hover:bg-[color:var(--accent)] hover:text-[#080c10] hover:border-[color:var(--accent)] btn">
        <span className="relative flex h-2 w-2">
          {!seen && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--accent2)] opacity-60 animate-ping" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--accent2)]" />
        </span>
        <span>{open ? 'close' : 'customize_ui()'}</span>
        <span className="opacity-60 group-hover:opacity-100">{open ? '✕' : '▸'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed z-[55] bottom-20 right-5 w-[320px] max-w-[calc(100vw-24px)]
                        max-h-[calc(100vh-120px)] overflow-y-auto
                        border border-[#1a2330] bg-[#0a0e12]/95 backdrop-blur-lg
                        shadow-[0_20px_60px_-10px_rgba(0,0,0,.8)]"
             style={{ animation: 'fadeSlide .2s ease both' }}>
          <div className="sticky top-0 flex items-center justify-between px-4 h-10 border-b border-[#1a2330] bg-[#060a0d]/95 backdrop-blur">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent2)] animate-pulse" />
              <span className="text-[#cfd6de]">customize.tsx</span>
              <span className="text-[#5d6b7a]">— live</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-[#9aa7b4] hover:text-[#cfd6de] font-mono text-[11px]">[esc]</button>
          </div>

          <div className="p-4">
            <div className="font-mono text-[10.5px] text-[#5d6b7a] mb-4 leading-relaxed">
              {'// tweak the site live — changes persist.'}<br/>
              {'// built as a demo of what I can ship for you.'}
            </div>

            <Row label="accent palette">
              <div className="grid grid-cols-4 gap-1.5">
                {Object.entries(ACCENTS).map(([key, a]) => (
                  <button key={key} onClick={() => setTweak('accent', key)} title={a.name}
                    className={`relative h-10 border transition-all ${tweak.accent === key ? 'border-white scale-[1.02]' : 'border-[#1a2330] hover:border-[#2a3545]'}`}>
                    <div className="absolute inset-0 flex">
                      <div className="flex-1" style={{ background: a.c1 }} />
                      <div className="flex-1" style={{ background: a.c2 }} />
                    </div>
                    {tweak.accent === key && <div className="absolute inset-0 flex items-center justify-center text-[#080c10] font-bold">●</div>}
                  </button>
                ))}
              </div>
            </Row>

            <Row label="background pattern">
              <Seg value={tweak.bgPattern} onChange={v => setTweak('bgPattern', v)}
                   options={[{value:'dots',label:'dots'},{value:'grid',label:'grid'},{value:'scan',label:'scan'}]} />
            </Row>

            <Row label="hero style">
              <Seg value={tweak.heroStyle} onChange={v => setTweak('heroStyle', v)}
                   options={[{value:'ascii',label:'ascii'},{value:'terminal',label:'term'},{value:'split',label:'split'},{value:'minimal',label:'min'}]} />
            </Row>

            <Row label="role cycle">
              <Seg value={tweak.roleAnim} onChange={v => setTweak('roleAnim', v)}
                   options={[{value:'typewriter',label:'typewrite'},{value:'fade',label:'fade'},{value:'terminal',label:'> out'}]} />
            </Row>

            <Row label="density">
              <Seg value={tweak.density} onChange={v => setTweak('density', v)}
                   options={[{value:'compact',label:'compact'},{value:'comfy',label:'comfy'},{value:'spacious',label:'spacious'}]} />
            </Row>

            <Row label="language">
              <Seg value={tweak.lang} onChange={v => setTweak('lang', v)}
                   options={[{value:'en',label:'EN'},{value:'th',label:'TH'}]} />
            </Row>

            <Row label="extras">
              <div className="space-y-1.5">
                {[
                  ['topology', 'network bg'],
                  ['crosshair', 'crosshair cursor'],
                  ['sound', 'terminal beeps'],
                ].map(([k, label]) => (
                  <button key={k} onClick={() => setTweak(k, !tweak[k])}
                    className={`w-full flex items-center justify-between h-8 px-2.5 font-mono text-[11px] border btn ${
                      tweak[k] ? 'border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 text-[color:var(--accent)]' : 'border-[#1a2330] text-[#9aa7b4] hover:border-[#2a3545]'
                    }`}>
                    <span>{label}</span>
                    <span className={`font-mono ${tweak[k] ? 'text-[color:var(--accent2)]' : 'text-[#3d4956]'}`}>{tweak[k] ? '● ON' : '○ OFF'}</span>
                  </button>
                ))}
              </div>
            </Row>

            <button onClick={() => {
              setTweak('accent','sky-lime'); setTweak('bgPattern','dots');
              setTweak('heroStyle','ascii'); setTweak('roleAnim','typewriter');
              setTweak('density','comfy'); setTweak('lang','en');
              setTweak('topology',true); setTweak('crosshair',false); setTweak('sound',false);
            }} className="mt-2 w-full h-8 font-mono text-[11px] text-[#5d6b7a] hover:text-[#cfd6de] border border-dashed border-[#1a2330] hover:border-[#2a3545] btn">
              reset_defaults()
            </button>
          </div>
        </div>
      )}
    </>
  );
}
