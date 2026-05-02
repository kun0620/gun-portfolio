import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { gsap } from 'gsap';

const BG_COLOR = '#050405';
const ACCENT = '#ff2d2d';
const HEX_GRID_COLOR = 'rgba(255, 45, 45, 0.08)';

function clampProgress(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function hexPoints(cx, cy, radius) {
  const points = [];
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - (Math.PI / 2);
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
}

function drawHexagon(ctx, cx, cy, radius, progress = 1) {
  const points = hexPoints(cx, cy, radius);
  const perimeter = radius * 6;
  if (progress < 1) {
    ctx.setLineDash([perimeter * progress, perimeter]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < 6; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawHexGrid(ctx, width, height, radius) {
  const dx = radius * Math.sqrt(3);
  const dy = radius * 1.5;
  const cellRadius = radius * 0.45;
  ctx.strokeStyle = HEX_GRID_COLOR;
  ctx.lineWidth = 0.5;

  for (let row = -1; row * dy < height + radius; row += 1) {
    for (let col = -1; col * dx < width + radius; col += 1) {
      const x = col * dx + (row % 2 !== 0 ? dx / 2 : 0);
      const y = row * dy;
      drawHexagon(ctx, x, y, cellRadius, 1);
    }
  }
}

const V2HeroCanvas = forwardRef(function V2HeroCanvas(_, ref) {
  const canvasRef = useRef(null);
  const progressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setScrollProgress(progress) {
      progressRef.current = clampProgress(progress);
    },
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = {
      outerAngle: 0,
      innerAngle: 0,
      hexProgress: prefersReducedMotion ? 1 : 0,
      dotAlphas: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
      canvasAlpha: prefersReducedMotion ? 1 : 0,
      driftX: 0,
      driftY: 0,
    };

    let width = 0;
    let height = 0;
    let rafId = 0;
    let lastTime = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = state.canvasAlpha;

      ctx.fillStyle = BG_COLOR;
      ctx.fillRect(0, 0, width, height);

      drawHexGrid(ctx, width, height, 60);

      const p = progressRef.current;
      const centerX = width * (0.62 - p * 0.06) + state.driftX;
      const centerY = height * (0.5 - p * 0.02) + state.driftY;
      const outerRadius = 180 - p * 18;
      const innerRadius = 120 + p * 8;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(state.outerAngle);
      ctx.shadowBlur = 40;
      ctx.shadowColor = ACCENT;
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1.5;
      drawHexagon(ctx, 0, 0, outerRadius, state.hexProgress);
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(state.innerAngle);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,45,45,0.4)';
      ctx.lineWidth = 1;
      drawHexagon(ctx, 0, 0, innerRadius, 1);
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(state.outerAngle);
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i - (Math.PI / 2);
        const x = Math.cos(angle) * outerRadius;
        const y = Math.sin(angle) * outerRadius;
        ctx.globalAlpha = state.canvasAlpha * state.dotAlphas[i];
        ctx.fillStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 120px "Arial Black", Impact, sans-serif';
      ctx.shadowColor = 'rgba(255,255,255,0.35)';
      ctx.shadowBlur = 18;
      ctx.fillText('G', 0, 14);
      ctx.restore();
    };

    const loop = (now) => {
      if (!document.hidden && (now - lastTime > 1000 / 30 || !lastTime)) {
        lastTime = now;
        draw();
      }
      rafId = window.requestAnimationFrame(loop);
    };

    resize();
    const gsapCtx = gsap.context(() => {
      if (prefersReducedMotion) return;
      gsap.to(state, { canvasAlpha: 1, duration: 1.2, ease: 'power2.out' });
      gsap.to(state, { hexProgress: 1, duration: 1.8, ease: 'power2.out' });
      gsap.to(state, { outerAngle: Math.PI * 2, duration: 20, repeat: -1, ease: 'none' });
      gsap.to(state, { innerAngle: -Math.PI * 2, duration: 14, repeat: -1, ease: 'none' });
      gsap.to(state, { driftX: 10, driftY: -6, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      state.dotAlphas.forEach((_, i) => {
        gsap.to(state.dotAlphas, {
          [i]: 1,
          duration: 1,
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
          ease: 'sine.inOut',
        });
      });
    }, canvas);

    if (prefersReducedMotion) {
      draw();
    } else {
      rafId = window.requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      gsapCtx.revert();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
});

export default V2HeroCanvas;
