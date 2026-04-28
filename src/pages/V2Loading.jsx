import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SEGMENTS = 8;

export default function V2Loading({ onComplete }) {
  const rootRef = useRef(null);
  const segsRef = useRef([]);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      completeRef.current?.();
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      complete();
      return undefined;
    }

    const fallbackTimer = window.setTimeout(complete, 1800);
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: complete,
        });
      },
    });

    segsRef.current.forEach((seg, i) => {
      if (seg) {
        tl.to(seg, { backgroundColor: '#ff2d2d', duration: 0.055, ease: 'none' }, i * 0.075);
      }
    });

    tl.to({}, { duration: 0.16 });

    return () => {
      window.clearTimeout(fallbackTimer);
      tl.kill();
    };
  }, []);

  return (
    <div ref={rootRef} className="v2-loading">
      <div className="v2-loading-title">SYSTEM INITIALIZING</div>
      <div className="v2-progress-bar">
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { segsRef.current[i] = el; }}
            className="v2-progress-seg"
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 20,
          fontSize: 11,
          color: 'rgba(255,45,45,0.4)',
          letterSpacing: '0.14em',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        SOUND MUTED
      </div>
    </div>
  );
}
