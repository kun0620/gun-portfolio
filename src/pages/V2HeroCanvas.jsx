import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

const RED = 0xff2d2d;
const WHITE = 0xffffff;

const INFRA_NODES = [
  [-3.7, 1.65, -0.35],
  [-2.6, 0.85, 0.2],
  [-3.05, -0.45, -0.1],
  [-1.85, -1.35, 0.25],
  [-0.95, 1.45, -0.2],
  [-0.35, 0.35, 0.35],
  [-0.8, -1.05, -0.25],
  [0.55, 1.05, 0.15],
  [0.95, -0.55, -0.15],
  [1.85, 1.45, -0.05],
  [2.45, 0.15, 0.25],
  [2.05, -1.35, -0.2],
  [3.2, 0.9, 0.15],
  [3.35, -0.85, 0.05],
];

const INFRA_LINKS = [
  [0, 1],
  [0, 4],
  [1, 2],
  [1, 5],
  [2, 3],
  [2, 6],
  [3, 6],
  [4, 5],
  [4, 7],
  [5, 6],
  [5, 8],
  [7, 8],
  [7, 9],
  [8, 10],
  [8, 11],
  [9, 10],
  [10, 12],
  [10, 13],
  [11, 13],
  [12, 13],
];

function createGTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 158px Arial Black, Impact, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
  ctx.shadowBlur = 14;
  ctx.fillText('G', 128, 138);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createHexPoints(radius) {
  return Array.from({ length: 7 }, (_, i) => {
    const angle = (Math.PI / 6) + (i % 6) * (Math.PI / 3);
    return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  });
}

function clampProgress(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

const V2HeroCanvas = forwardRef(function V2HeroCanvas(_, ref) {
  const mountRef = useRef(null);
  const progressRef = useRef(0);
  const renderRef = useRef(null);

  useImperativeHandle(ref, () => ({
    setScrollProgress(progress) {
      progressRef.current = clampProgress(progress);
      renderRef.current?.('scroll');
    },
  }), []);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = el.clientWidth;
    let h = el.clientHeight;
    let rafId;
    let lastFrameTime = 0;
    let currentProgress = progressRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const disposables = [];
    const textures = [];

    const register = (item) => {
      disposables.push(item);
      return item;
    };

    const heroGroup = new THREE.Group();
    heroGroup.position.set(1.7, 0.04, 0);
    scene.add(heroGroup);

    const infraGroup = new THREE.Group();
    const emblemGroup = new THREE.Group();
    heroGroup.add(infraGroup, emblemGroup);

    const gridMat = register(new THREE.LineBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    }));

    const gridLines = [];
    for (let i = -5; i <= 5; i += 1) {
      gridLines.push(new THREE.Vector3(i, -2.8, -0.7), new THREE.Vector3(i, 2.8, -0.7));
      gridLines.push(new THREE.Vector3(-4.8, i * 0.55, -0.7), new THREE.Vector3(4.8, i * 0.55, -0.7));
    }
    const gridGeo = register(new THREE.BufferGeometry().setFromPoints(gridLines));
    const grid = new THREE.LineSegments(gridGeo, gridMat);
    infraGroup.add(grid);

    const linkMat = register(new THREE.LineBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
    }));
    const linkPoints = [];
    INFRA_LINKS.forEach(([a, b]) => {
      linkPoints.push(
        new THREE.Vector3(...INFRA_NODES[a]),
        new THREE.Vector3(...INFRA_NODES[b]),
      );
    });
    const linkGeo = register(new THREE.BufferGeometry().setFromPoints(linkPoints));
    const links = new THREE.LineSegments(linkGeo, linkMat);
    infraGroup.add(links);

    const nodeGeo = register(new THREE.SphereGeometry(0.045, 8, 8));
    const nodeMat = register(new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.84,
      blending: THREE.AdditiveBlending,
    }));
    const nodeGlowGeo = register(new THREE.SphereGeometry(0.1, 8, 8));
    const nodeGlowMat = register(new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
    }));

    const nodes = INFRA_NODES.map((pos) => {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(...pos);
      const glow = new THREE.Mesh(nodeGlowGeo, nodeGlowMat);
      glow.position.copy(node.position);
      infraGroup.add(glow, node);
      return { node, glow };
    });

    const hexShape = new THREE.Shape();
    createHexPoints(1.16).forEach((point, index) => {
      if (index === 0) hexShape.moveTo(point.x, point.y);
      else hexShape.lineTo(point.x, point.y);
    });

    const hexGeo = register(new THREE.ShapeGeometry(hexShape));
    const hexMat = register(new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }));
    const hex = new THREE.Mesh(hexGeo, hexMat);
    emblemGroup.add(hex);

    const hexGlowGeo = register(new THREE.ShapeGeometry(hexShape));
    const hexGlowMat = register(new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }));
    const hexGlow = new THREE.Mesh(hexGlowGeo, hexGlowMat);
    hexGlow.scale.setScalar(1.38);
    hexGlow.position.z = -0.08;
    emblemGroup.add(hexGlow);

    const outlineMat = register(new THREE.LineBasicMaterial({
      color: WHITE,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    }));
    const outlineGeo = register(new THREE.BufferGeometry().setFromPoints(createHexPoints(1.24)));
    const outline = new THREE.Line(outlineGeo, outlineMat);
    outline.position.z = 0.03;
    emblemGroup.add(outline);

    const gTexture = createGTexture();
    textures.push(gTexture);
    const gMat = register(new THREE.SpriteMaterial({
      map: gTexture,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
    }));
    const gSprite = new THREE.Sprite(gMat);
    gSprite.scale.set(1.08, 1.08, 1);
    gSprite.position.z = 0.08;
    emblemGroup.add(gSprite);

    const ringMats = [0.24, 0.16, 0.1].map((opacity) => register(new THREE.MeshBasicMaterial({
      color: RED,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })));
    const rings = [1.55, 2.0, 2.55].map((radius, i) => {
      const geo = register(new THREE.RingGeometry(radius, radius + 0.01, 64));
      const ring = new THREE.Mesh(geo, ringMats[i]);
      ring.rotation.z = i * 0.55;
      emblemGroup.add(ring);
      return ring;
    });

    const tickMat = register(new THREE.LineBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
    }));
    const tickPoints = [];
    for (let i = 0; i < 36; i += 1) {
      const angle = i * (Math.PI / 18);
      const inner = i % 3 === 0 ? 2.32 : 2.42;
      const outer = 2.62;
      tickPoints.push(
        new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle) * inner, 0.04),
        new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle) * outer, 0.04),
      );
    }
    const tickGeo = register(new THREE.BufferGeometry().setFromPoints(tickPoints));
    const ticks = new THREE.LineSegments(tickGeo, tickMat);
    emblemGroup.add(ticks);

    const scanMat = register(new THREE.LineBasicMaterial({
      color: RED,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
    }));
    const scanGeo = register(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-4.6, 0, 0.1),
      new THREE.Vector3(4.6, 0, 0.1),
    ]));
    const scan = new THREE.Line(scanGeo, scanMat);
    infraGroup.add(scan);

    const clock = new THREE.Clock();

    const applyScrollState = (elapsed = 0) => {
      const targetProgress = prefersReducedMotion ? progressRef.current : progressRef.current;
      currentProgress += (targetProgress - currentProgress) * (prefersReducedMotion ? 1 : 0.085);
      const p = currentProgress;
      const pulse = prefersReducedMotion ? 0.5 : (Math.sin(elapsed * 1.7) + 1) * 0.5;
      const idleY = prefersReducedMotion ? 0 : Math.sin(elapsed * 0.55) * 0.055;

      heroGroup.position.x = 1.7 - p * 1.45;
      heroGroup.position.y = 0.04 + idleY - p * 0.26;
      heroGroup.position.z = -p * 0.5;
      heroGroup.scale.setScalar(1 + p * 0.12);

      infraGroup.position.x = -p * 0.35;
      infraGroup.scale.set(1 + p * 0.32, 1 + p * 0.22, 1);
      infraGroup.rotation.y = (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.22) * 0.08) - p * 0.18;
      infraGroup.rotation.x = (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.18) * 0.025) + p * 0.04;

      emblemGroup.position.x = p * 1.42;
      emblemGroup.position.y = p * 0.18;
      emblemGroup.scale.setScalar(1 - p * 0.22);
      emblemGroup.rotation.z = (prefersReducedMotion ? 0 : Math.sin(elapsed * 0.18) * 0.035) + p * 0.18;

      gridMat.opacity = 0.08 + p * 0.12;
      linkMat.opacity = 0.22 + p * 0.18;
      nodeMat.opacity = 0.78 + p * 0.12;
      nodeGlowMat.opacity = 0.12 + p * 0.1;
      hexMat.opacity = 0.9 - p * 0.16;
      hexGlowMat.opacity = 0.12 + pulse * 0.08 - p * 0.02;
      outlineMat.opacity = 0.24 + pulse * 0.16 - p * 0.06;
      gMat.opacity = 0.96 - p * 0.18;
      tickMat.opacity = 0.28 + p * 0.08;
      scanMat.opacity = 0.08 + pulse * 0.12 + p * 0.06;

      hexGlow.scale.setScalar(1.34 + pulse * 0.08 + p * 0.18);
      scan.position.y = prefersReducedMotion ? -0.25 : -2.1 + ((elapsed * 0.34 + p * 1.2) % 4.2);

      rings.forEach((ring, i) => {
        const ringScale = 1 + p * (0.18 + i * 0.08);
        ring.scale.setScalar(ringScale);
      });

      nodes.forEach(({ glow }, i) => {
        const nodePulse = prefersReducedMotion ? 0.5 : (Math.sin(elapsed * 1.8 + i * 0.7) + 1) * 0.5;
        glow.scale.setScalar(0.82 + nodePulse * 0.38 + p * 0.18);
      });
    };

    const render = (reason) => {
      if (reason === 'scroll' && !prefersReducedMotion) return;
      applyScrollState(clock.getElapsedTime());
      renderer.render(scene, camera);
    };
    renderRef.current = render;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();
      if (elapsed - lastFrameTime < 1 / 30) return;
      lastFrameTime = elapsed;

      if (!prefersReducedMotion) {
        rings.forEach((ring, i) => {
          ring.rotation.z += (i % 2 === 0 ? 1 : -1) * (0.0012 + i * 0.00035);
        });
        ticks.rotation.z -= 0.001;
      }

      render();
    };

    if (prefersReducedMotion) {
      render();
    } else {
      animate();
    }

    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      render();
    };
    window.addEventListener('resize', onResize);

    return () => {
      renderRef.current = null;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      textures.forEach((texture) => texture.dispose());
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />;
});

export default V2HeroCanvas;
