// Network-topology canvas background as a React component.
import { useEffect, useRef } from 'react';

export default function Topology() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, DPR = Math.min(1.25, window.devicePixelRatio || 1);
    const NODES = [];
    const PACKETS = [];
    const N_COUNT = 54;
    const LINK_DIST = 160;
    let rafId = 0;
    let lastFrame = 0;

    const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--topo-accent').trim() || '#7dd3fc';
    const accent2 = () => getComputedStyle(document.documentElement).getPropertyValue('--topo-accent2').trim() || '#a3e635';

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function init() {
      NODES.length = 0;
      for (let i = 0; i < N_COUNT; i++) {
        NODES.push({ x: Math.random()*W, y: Math.random()*H,
          vx: (Math.random()-.5)*.12, vy: (Math.random()-.5)*.12, hub: Math.random() < .15 });
      }
    }
    function spawnPacket() {
      if (NODES.length < 2) return;
      const a = Math.floor(Math.random()*NODES.length);
      let b = Math.floor(Math.random()*NODES.length);
      if (b === a) b = (b+1) % NODES.length;
      PACKETS.push({ a, b, t: 0, speed: .008 + Math.random()*.012, color: Math.random() < .25 ? accent2() : accent() });
    }
    let packetTimer = 0;
    function draw() {
      ctx.clearRect(0,0,W,H);
      const ac = accent();
      for (const n of NODES) {
        n.x += n.vx; n.y += n.vy;
        if (n.x<-20) n.x=W+20; if (n.x>W+20) n.x=-20;
        if (n.y<-20) n.y=H+20; if (n.y>H+20) n.y=-20;
      }
      ctx.lineWidth = 1;
      for (let i=0;i<NODES.length;i++) for (let j=i+1;j<NODES.length;j++){
        const a=NODES[i], b=NODES[j]; const dx=a.x-b.x, dy=a.y-b.y;
        const d2=dx*dx+dy*dy;
        if (d2<LINK_DIST*LINK_DIST){
          const alpha=(1-Math.sqrt(d2)/LINK_DIST)*.16;
          ctx.strokeStyle=`rgba(125,211,252,${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      for (const n of NODES){
        ctx.fillStyle = n.hub ? ac : 'rgba(125,211,252,.55)';
        ctx.beginPath(); ctx.arc(n.x,n.y,n.hub?2.2:1.2,0,Math.PI*2); ctx.fill();
        if (n.hub){ ctx.strokeStyle='rgba(125,211,252,.25)'; ctx.beginPath(); ctx.arc(n.x,n.y,5,0,Math.PI*2); ctx.stroke(); }
      }
      packetTimer++;
      if (packetTimer>18 && PACKETS.length<16){ spawnPacket(); packetTimer=0; }
      for (let i=PACKETS.length-1;i>=0;i--){
        const p=PACKETS[i]; p.t+=p.speed;
        if (p.t>=1){ PACKETS.splice(i,1); continue; }
        const a=NODES[p.a], b=NODES[p.b]; if (!a||!b){ PACKETS.splice(i,1); continue; }
        const x=a.x+(b.x-a.x)*p.t, y=a.y+(b.y-a.y)*p.t;
        const tx=a.x+(b.x-a.x)*Math.max(0,p.t-.08), ty=a.y+(b.y-a.y)*Math.max(0,p.t-.08);
        ctx.strokeStyle=p.color+'33'; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(x,y); ctx.stroke();
        ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(x,y,1.8,0,Math.PI*2); ctx.fill();
      }
    }
    function step(ts = 0) {
      rafId = requestAnimationFrame(step);
      if (document.hidden || ts - lastFrame < 1000 / 30) return;
      lastFrame = ts;
      draw();
    }
    resize(); init(); step();
    const onR = () => { resize(); init(); };
    window.addEventListener('resize', onR);
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', onR); };
  }, []);

  return <canvas id="topology" ref={ref} className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true" />;
}
