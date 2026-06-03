'use client';
import React, { useRef, useEffect, useState, useMemo, useCallback, Suspense } from 'react';
import gsap from 'gsap';
import { X, ArrowRight } from 'lucide-react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '600', '700'] });

// Shared — allocated once, never recreated
const PLANE_GEO = new THREE.PlaneGeometry(1, 1);
const TAU       = Math.PI * 2;
const wrapA     = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const damp      = (c, t, l, dt) => c + (t - c) * (1 - Math.exp(-l * dt));
const nearestEq = (c, b) => b + Math.round((c - b) / TAU) * TAU;

// ─── Scattered layout positions by rank (rank 0 = selected/front) ────────────
// Items never overlap: front center, right, left, upper-back
const RANK_LAYOUT = {
   0: { pos: [0,    0,    0   ], scale: 2.2,  op: 1.0  },   // front, large
   1: { pos: [3.4,  0, -1.6], scale: 0.70, op: 0.80 },   // right
  '-1':{ pos: [-3.4, 0, -1.6], scale: 0.70, op: 0.80 },  // left
   2: { pos: [-1.4, 0, -2.4], scale: 0.50, op: 0.60 },   // back left
  '-2':{ pos: [-1.2, 0, -2.4], scale: 0.50, op: 0.60 },  // upper-left back
};

// ─── Scene (all Three.js work lives here) ────────────────────────────────────
function CarouselScene({ products, selectedIndex, onFrontChange }) {
  const N          = products.length;
  const groupRef   = useRef();
  const meshRefs   = useRef([]);
  const dragging   = useRef(false);
  const dragDelta  = useRef(0);
  const lastX      = useRef(0);
  const smoothPos  = useRef({});   // per-mesh { x, y, z }
  const smoothSc   = useRef({});   // per-mesh scale multiplier
  const smoothOp   = useRef({});   // per-mesh opacity
  const baseScales = useRef({});   // per-mesh [sx, sy] at mount
  const selRef     = useRef(selectedIndex);
  const { camera } = useThree();

  // Keep selRef fresh for useFrame (avoids stale closure)
  useEffect(() => { selRef.current = selectedIndex; }, [selectedIndex]);

  const paths    = useMemo(() => products.map((p) => p.path), [products]);
  const raw      = useTexture(paths);
  const textures = useMemo(() => (Array.isArray(raw) ? raw : [raw]), [raw]);

  const materials = useMemo(() => textures.map((tex) => {
    if (!tex) return new THREE.MeshBasicMaterial({ transparent: true });
    tex.colorSpace  = THREE.SRGBColorSpace;
    tex.minFilter   = THREE.LinearMipmapLinearFilter;
    tex.magFilter   = THREE.LinearFilter;
    tex.needsUpdate = true;
    return new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide });
  }), [textures]);

  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  // Rank: how far item i is from the selected item (-2…+2)
  const getRank = (i, sel) => {
    let r = (i - sel + N) % N;
    if (r > Math.floor(N / 2)) r -= N;
    return r;
  };

  // Swipe drag → prev / next (no group rotation)
  useEffect(() => {
    const onDown = (e) => {
      dragging.current = true;
      dragDelta.current = 0;
      lastX.current = e.touches ? e.touches[0].clientX : e.clientX;
    };
    const onMove = (e) => {
      if (!dragging.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      dragDelta.current += x - lastX.current;
      lastX.current = x;
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      if (Math.abs(dragDelta.current) > 48) {
        const next = dragDelta.current < 0
          ? (selRef.current + 1) % N
          : (selRef.current - 1 + N) % N;
        onFrontChange?.(next);
      }
      dragDelta.current = 0;
    };
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('touchmove',  onMove, { passive: true });
    window.addEventListener('touchend',   onUp);
    return () => {
      window.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchstart', onDown);
      window.removeEventListener('touchmove',  onMove);
      window.removeEventListener('touchend',   onUp);
    };
  }, [N, onFrontChange]);

  useFrame(({ clock }, dt) => {
    const t   = clock.getElapsedTime();
    const sel = selRef.current;

    for (let i = 0; i < meshRefs.current.length; i++) {
      const m = meshRefs.current[i];
      if (!m) continue;

      m.lookAt(camera.position);

      const rank   = getRank(i, sel);
      const layout = RANK_LAYOUT[rank] ?? RANK_LAYOUT[2];
      const [tx, ty, tz] = layout.pos;
      const floatY = ty + Math.sin(t * 1.1 + i * 1.33) * 0.12;

      // Smooth position
      if (!smoothPos.current[i]) smoothPos.current[i] = { x: tx, y: floatY, z: tz };
      smoothPos.current[i].x = damp(smoothPos.current[i].x, tx,     7, dt);
      smoothPos.current[i].y = damp(smoothPos.current[i].y, floatY, 7, dt);
      smoothPos.current[i].z = damp(smoothPos.current[i].z, tz,     7, dt);
      m.position.set(smoothPos.current[i].x, smoothPos.current[i].y, smoothPos.current[i].z);

      // Smooth scale
      if (smoothSc.current[i] === undefined) smoothSc.current[i] = layout.scale;
      smoothSc.current[i] = damp(smoothSc.current[i], layout.scale, 9, dt);
      const bs = baseScales.current[i];
      if (bs) m.scale.set(bs[0] * smoothSc.current[i], bs[1] * smoothSc.current[i], 1);

      // Smooth opacity
      if (smoothOp.current[i] === undefined) smoothOp.current[i] = layout.op;
      smoothOp.current[i] = damp(smoothOp.current[i], layout.op, 9, dt);
      if (m.material) m.material.opacity = smoothOp.current[i];
    }
  });

  return (
    <>
      <ambientLight intensity={2} />
      <group ref={groupRef}>
        {products.map((_, i) => {
          const tex    = textures[i];
          const aspect = tex?.image ? tex.image.width / tex.image.height : 1;
          return (
            <mesh
              key={i}
              ref={(el) => {
                meshRefs.current[i] = el;
                if (el && !baseScales.current[i]) {
                  const asp = textures[i]?.image
                    ? textures[i].image.width / textures[i].image.height : 1;
                  baseScales.current[i] = [asp * 1.7, 1.7];
                }
              }}
              geometry={PLANE_GEO}
              material={materials[i]}
              position={[0, 0, 0]}
            />
          );
        })}
      </group>
    </>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────
const CollectionOverlay = ({ isVisible, onClose, products = [] }) => {
  const overlayRef  = useRef(null);
  const titleRef    = useRef(null);
  const controlsRef = useRef(null);
  const [activeIndex, setActiveIndex]     = useState(0);
  const [canvasMounted, setCanvasMounted] = useState(false);
  const lastInteract = useRef(Date.now());

  const items = useMemo(() => products.filter((p) => p?.path).slice(0, 4), [products]);

  useEffect(() => { if (isVisible) { setActiveIndex(0); setCanvasMounted(true); } }, [isVisible]);

  useEffect(() => {
    if (!overlayRef.current) return;
    if (isVisible) {
      gsap.set(overlayRef.current, { display: 'flex' });
      gsap.timeline()
        .fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo([titleRef.current, controlsRef.current], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.1 }, '-=0.2');
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0, duration: 0.3,
        onComplete: () => { gsap.set(overlayRef.current, { display: 'none' }); setCanvasMounted(false); },
      });
    }
  }, [isVisible]);

  const bump = () => { lastInteract.current = Date.now(); };
  const goPrev = useCallback(() => { bump(); setActiveIndex((i) => (i - 1 + items.length) % items.length); }, [items.length]);
  const goNext = useCallback(() => { bump(); setActiveIndex((i) => (i + 1) % items.length); }, [items.length]);
  const goTo   = useCallback((i) => { bump(); setActiveIndex(i); }, []);
  const onFrontChange = useCallback((i) => { bump(); setActiveIndex(i); }, []);

  useEffect(() => {
    if (!isVisible || !items.length) return;
    const id = setInterval(() => { if (Date.now() - lastInteract.current >= 2000) setActiveIndex((i) => (i + 1) % items.length); }, 2000);
    return () => clearInterval(id);
  }, [isVisible, items.length]);

  if (!items.length) return null;

  return (
    <div ref={overlayRef} className={`fixed inset-0 z-40 ${montserrat.className}`} style={{ display: 'none', opacity: 0, background: 'transparent' }}>

      {/* Close */}
      <button onClick={onClose} className='bg-black/10 backdrop-blur-sm absolute top-4 right-4 sm:top-6 sm:right-6 z-30 text-black/60 hover:text-black transition-colors p-2 rounded-full' aria-label='Close'>
        <X size={22} />
      </button>

      {/* Title — top center */}
      {/* <div ref={titleRef} className='absolute top-10 sm:top-28 inset-x-0 flex flex-col items-center pointer-events-none px-4'>
        <span className='text-black/40 uppercase tracking-widest text-[11px] font-medium mb-2'>New Collection Launch</span>
        <h2 className='text-black font-bold uppercase tracking-wider text-center' style={{ fontSize: 'clamp(18px, 3vw, 28px)' }}>
          Jina Shilp Collection is Here
        </h2>
      </div> */}

      {/* Canvas — elevated camera angle gives 3-D depth perspective */}
      {canvasMounted && (
        <div className='absolute inset-0' style={{ cursor: 'grab' }}>
          <Canvas
            camera={{ position: [0, 0.5, 5], fov: 40 }}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <CarouselScene products={items} selectedIndex={activeIndex} onFrontChange={onFrontChange} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Bottom row — name card left, controls right (matches reference) */}
      <div className='absolute bottom-2 md:bottom-8 sm:inset-x-10 z-30 flex flex-col md:flex-row items-start md:items-end justify-between gap-4'>

        {/* Name card — only product name, no description */}
        <div
          ref={titleRef}
          className='rounded-2xl px-2 py-2 text-black '
        >
          <h2 className='text-sm sm:text-2xl font-semibold text-black'>
            {items[activeIndex]?.name ?? ''}
          </h2>
          <p className='text-black font-bold text-sm md:text-2xl uppercase tracking-wider text-center' >
          Jina Shilp Collection
        </p>
        </div>

        {/* Controls — right side */}
        <div ref={controlsRef} className='flex flex-row md:flex-col items-start mx-2 md:mx-0 md:items-end gap-3'>
          {/* Prev / dots / Next */}
          <div className='flex items-center gap-3 rounded-2xl px-4 py-3 bg-white/92' style={{ backdropFilter: 'blur(12px)' }}>
            <button onClick={goPrev} className='p-1.5 rounded-full hover:bg-gray-100 transition' aria-label='Previous'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#374151' strokeWidth='2'><path d='M15 18l-6-6 6-6' strokeLinecap='round' strokeLinejoin='round' /></svg>
            </button>
            <div className='flex items-center gap-2'>
              {items.map((_, i) => (
                <button key={i} onClick={() => goTo(i)} style={{ width: i === activeIndex ? 22 : 10, height: 10, borderRadius: 5, background: i === activeIndex ? '#374151' : '#d1d5db', border: 'none', cursor: 'pointer', padding: 0, transition: 'width 0.3s, background 0.3s' }} />
              ))}
            </div>
            <button onClick={goNext} className='p-1.5 rounded-full hover:bg-gray-100 transition' aria-label='Next'>
              <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='#374151' strokeWidth='2'><path d='M9 6l6 6-6 6' strokeLinecap='round' strokeLinejoin='round' /></svg>
            </button>
          </div>

          {/* Explore button */}
          <Link href='./collections/jina_shilp'>
            <button className='group relative flex items-center gap-2 text-black border border-black/30 hover:border-none font-semibold rounded-full px-6 py-2.5 overflow-hidden hover:scale-105 bg-{e6e6e6} md:bg-none active:scale-95 transition-transform shadow-md text-[0.5rem] md:text-sm 2xl:text-2xl' >
              <span className='relative z-10 flex items-center gap-2'>
                EXPLORE COLLECTION
                <ArrowRight size={13} className='group-hover:translate-x-1 transition-transform' />
              </span>
              <div className='absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-400' />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollectionOverlay;
