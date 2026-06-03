// FloatingImagesScene.jsx — Full product count, shared textures/materials, smooth 60fps
'use client';
import React, { useRef, useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { newImagePaths } from './imagePaths';
import CustomLoader from './CustomLoader';
import { Plus, Minus } from 'lucide-react';
import CollectionOverlay from './CollectionOverlay';

// ─── One shared geometry for ALL image planes ────────────────────────────────
const SHARED_GEO = new THREE.PlaneGeometry(1, 1, 1, 1);

// ─── Starfield ────────────────────────────────────────────────────────────────
function Starfield({ count = 200, radius = 200 }) {
  const pointsRef = useRef();
  const tick = useRef(0);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi   = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);
      const r     = i < count * 0.5
        ? radius + 2  + Math.random() * 40
        : radius + 50 + Math.random() * 100;
      pos[i*3]   = r * Math.sin(theta) * Math.cos(phi);
      pos[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
      pos[i*3+2] = r * Math.cos(theta);
      if      (i%3===0) { col[i*3]=1;   col[i*3+1]=1;   col[i*3+2]=1;   }
      else if (i%3===1) { col[i*3]=0.6; col[i*3+1]=0.8; col[i*3+2]=1;   }
      else              { col[i*3]=1;   col[i*3+1]=0.9; col[i*3+2]=0.5; }
    }
    return { positions: pos, colors: col };
  }, [count, radius]);

  const [starTexture, setStarTexture] = useState(null);
  useEffect(() => {
    const size = 32;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size/2,size/2,0, size/2,size/2,size/2);
    g.addColorStop(0,   'rgba(255,255,255,1)');
    g.addColorStop(0.2, 'rgba(255,255,255,0.4)');
    g.addColorStop(1,   'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(size/2,size/2,size/2,0,Math.PI*2); ctx.fill();
    const tex = new THREE.CanvasTexture(c);
    setStarTexture(tex);
    return () => tex.dispose();
  }, []);

  useFrame(() => {
    if (++tick.current % 3 === 0 && pointsRef.current)
      pointsRef.current.rotation.y += 0.0015;
  });

  if (!starTexture) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach='attributes-position' count={count} array={positions} itemSize={3} />
        <bufferAttribute attach='attributes-color'    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial map={starTexture} size={3} sizeAttenuation transparent
        blending={THREE.AdditiveBlending} depthWrite={false} vertexColors />
    </points>
  );
}

// ─── FloatingImage (lightweight — no hooks, receives shared material) ────────
const FloatingImage = React.memo(function FloatingImage({
  material, position, baseScale, productId, name, group, onImageClick,
}) {
  const aspect = material.map?.image
    ? material.map.image.width / material.map.image.height
    : 1;

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    const worldPos = new THREE.Vector3();
    e.object.parent.getWorldPosition(worldPos);
    onImageClick({ productId, name, group, href: productId ? `/productdetails/${productId}` : '/products', worldPosition: [worldPos.x, worldPos.y, worldPos.z] });
  }, [productId, name, group, onImageClick]);

  return (
    <group position={position} userData={{ name, group, originalPosition: position }}>
      <mesh onClick={handleClick} geometry={SHARED_GEO} material={material}
        scale={[baseScale * aspect, baseScale, 1]} />
    </group>
  );
});

// ─── SphericalGallery ─────────────────────────────────────────────────────────
const SphericalGallery = React.forwardRef(
  ({ imagePaths, radius, onImageHover, onImageOut, onImageClick, isZooming }, ref) => {
    const scroll  = useScroll();
    const { camera, mouse } = useThree();

    const raycaster    = useRef(new THREE.Raycaster());
    const hoveredGroup = useRef(null);
    const meshCache    = useRef([]);
    const prevScroll   = useRef(-1);
    const prevMouse    = useRef(new THREE.Vector2(-9, -9));
    const isExploded   = useRef(false);
    const tick         = useRef(0);

    // ── Extract unique URLs and batch-load textures (88 instead of 172) ──
    const uniqueUrls = useMemo(
      () => [...new Set(imagePaths.map((p) => p.path))],
      [imagePaths],
    );

    const textureArray = useTexture(uniqueUrls);

    // ── Build url→shared material map (88 materials, reused across dupes) ──
    const materialMap = useMemo(() => {
      const map = new Map();
      const texArr = Array.isArray(textureArray) ? textureArray : [textureArray];
      uniqueUrls.forEach((url, i) => {
        const tex = texArr[i];
        if (tex) {
          tex.colorSpace  = THREE.SRGBColorSpace;
          tex.minFilter   = THREE.LinearMipmapLinearFilter;
          tex.magFilter   = THREE.LinearFilter;
          tex.needsUpdate = true;
        }
        map.set(url, new THREE.MeshBasicMaterial({
          map: tex, transparent: true, side: THREE.DoubleSide,
        }));
      });
      return map;
    }, [uniqueUrls, textureArray]);

    // ── Sphere positions (computed once for all 172 items) ──
    const positions = useMemo(() => imagePaths.map((_, idx) => {
      const phi   = Math.acos(-1 + (2 * idx) / imagePaths.length);
      const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ];
    }), [imagePaths, radius]);

    useEffect(() => {
      const onExplode = () => { isExploded.current = true;  };
      const onRestore = () => { isExploded.current = false; };
      window.addEventListener('sphereExploded', onExplode);
      window.addEventListener('restoreSphere',  onRestore);
      return () => {
        window.removeEventListener('sphereExploded', onExplode);
        window.removeEventListener('restoreSphere',  onRestore);
      };
    }, []);

    // ── Cleanup materials on unmount ──
    useEffect(() => () => {
      materialMap.forEach((mat) => mat.dispose());
    }, [materialMap]);

    useFrame(() => {
      if (!ref.current) return;
      const frame = ++tick.current;

      // Rebuild mesh cache only when child count changes
      if (meshCache.current.length !== ref.current.children.length) {
        meshCache.current = ref.current.children.map((g) => g.children[0]).filter(Boolean);
      }

      // Billboard — skip when exploded or zooming
      if (!isExploded.current && !isZooming) {
        const cp = camera.position;
        const ch = ref.current.children;
        for (let i = 0, len = ch.length; i < len; i++) ch[i].lookAt(cp);
      }

      // Scroll camera — only on change, skip during zoom
      if (!isZooming) {
        const off = scroll.offset;
        if (Math.abs(off - prevScroll.current) > 0.0005) {
          prevScroll.current = off;
          camera.position.setLength(THREE.MathUtils.lerp(50, 15, off));
        }
      }

      // Raycast every 4 frames AND only when mouse moved
      if (frame % 4 !== 0) return;
      const dx = mouse.x - prevMouse.current.x;
      const dy = mouse.y - prevMouse.current.y;
      if (dx*dx + dy*dy < 0.000004 && !hoveredGroup.current) return;
      prevMouse.current.set(mouse.x, mouse.y);

      raycaster.current.setFromCamera(mouse, camera);
      const hits = raycaster.current.intersectObjects(meshCache.current, false);

      if (hits.length > 0) {
        const grp = hits[0].object.parent;
        if (grp !== hoveredGroup.current) {
          if (hoveredGroup.current)
            gsap.to(hoveredGroup.current.scale, { x:1,y:1,z:1, duration:0.25, overwrite:true });
          hoveredGroup.current = grp;
          gsap.to(grp.scale, { x:1.5,y:1.5,z:1.5, duration:0.25, overwrite:true });
          const { name, group } = grp.userData;
          onImageHover?.({ name, group });
          document.body.style.cursor = 'pointer';
        }
      } else if (hoveredGroup.current) {
        gsap.to(hoveredGroup.current.scale, { x:1,y:1,z:1, duration:0.25, overwrite:true });
        hoveredGroup.current = null;
        onImageOut?.();
        document.body.style.cursor = 'auto';
      }
    });

    return (
      <group ref={ref}>
        {imagePaths.map((item, idx) => (
          <FloatingImage
            key={`${item.productId}-${idx}`}
            material={materialMap.get(item.path)}
            position={positions[idx]}
            baseScale={2.8}
            productId={item.productId}
            name={item.name}
            group={item.group}
            onImageClick={onImageClick}
          />
        ))}
      </group>
    );
  },
);
SphericalGallery.displayName = 'SphericalGallery';

// ─── CameraAnimator (smooth zoom into clicked product) ───────────────────────
function CameraAnimator({ zoomTarget, onZoomComplete }) {
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    if (!zoomTarget) return;

    let completed = false;
    const done = () => { if (!completed) { completed = true; onZoomComplete(); } };

    const target = new THREE.Vector3(...zoomTarget.position);
    const dir = target.clone().sub(camera.position).normalize();
    const endPos = target.clone().sub(dir.multiplyScalar(1.5));

    const tween = gsap.to(camera.position, {
      x: endPos.x, y: endPos.y, z: endPos.z,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => camera.lookAt(target),
      onComplete: done,
    });

    // Safety fallback — navigate even if animation somehow stalls
    const fallback = setTimeout(done, 2000);

    return () => { tween.kill(); clearTimeout(fallback); };
  }, [zoomTarget, camera, onZoomComplete]);

  return null;
}

// ─── IntroTextOverlay ─────────────────────────────────────────────────────────
function IntroTextOverlay({ isVisible, onComplete }) {
  const rootRef    = useRef(null);
  const contentRef = useRef(null);
  const labelRef   = useRef(null);
  const eventRef   = useRef(null);
  const lineRef    = useRef(null);
  const collabRef  = useRef(null);

  useEffect(() => {
    if (!isVisible || !rootRef.current) return;

    gsap.set(rootRef.current, { opacity: 0 });
    gsap.set(contentRef.current, { y: 0, scale: 1, opacity: 1 });
    gsap.set([labelRef.current, eventRef.current, collabRef.current], { y: 20, opacity: 0 });
    gsap.set(lineRef.current, { scaleX: 0, opacity: 0, transformOrigin: 'center' });

    const tl = gsap.timeline({
      onComplete: () => {
        const exit = gsap.timeline({ onComplete });
        gsap.set(contentRef.current, { transformOrigin: '50% 50%' });
        // Step 1 — scale down in place
        exit.to(contentRef.current, {
          scale: 0.65,
          duration: 0.85, ease: 'power2.inOut',
        });
        // Step 2 — fly up and fade, starts 0.4s after scale begins
        exit.to(contentRef.current, {
          scale: 0, opacity: 0,
          duration: 0.9, ease: 'power2.in',
        }, '+=0.0');
        exit.to(rootRef.current, {
          scale: 0,opacity: 0, duration: 0.45, ease: 'power1.in',
        }, '-=0.45');
      },
    });

    tl.to(rootRef.current,  { opacity: 1, duration: 0.4, ease: 'power2.out' });
    tl.to(labelRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '+=0.05');
    tl.to(eventRef.current, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.2');
    tl.to(lineRef.current,  { scaleX: 1, opacity: 1, duration: 0.45, ease: 'power2.inOut' }, '-=0.05');
    tl.to(collabRef.current,{ y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.1');
    tl.to({}, { duration: 2.2 });

    return () => tl.kill();
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div ref={contentRef} style={{
        textAlign: 'center',
        fontFamily: "'Montserrat', 'Helvetica Neue', sans-serif",
        color: '#111',
        width: '100%',
        padding: '0 clamp(20px, 5vw, 60px)',
        willChange: 'transform, opacity',
      }}>

        {/* "PRESENTING AT" label */}
        <p ref={labelRef} style={{
          margin: '0 0 clamp(14px, 2.5vw, 26px)',
          fontSize: 'clamp(9px, 1.1vw, 14px)',
          fontWeight: 500,
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.4)',
          willChange: 'transform,opacity',
        }}>
          Presenting at
        </p>

        {/* Event block — name + location */}
        <div ref={eventRef} style={{ marginBottom: 'clamp(24px, 4vw, 40px)', willChange: 'transform,opacity' }}>
          <p style={{
            margin: '0 0 clamp(6px, 1vw, 12px)',
            fontSize: 'clamp(28px, 5.2vw, 78px)',
            fontWeight: 300,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#111',
            lineHeight: 1,
          }}>
            Salone Raritas
          </p>
          <p style={{
            margin: 0,
            fontSize: 'clamp(10px, 1.35vw, 17px)',
            fontWeight: 300,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.45)',
          }}>
            Rho Fiera · Milano · 2026
          </p>
        </div>

        {/* Divider */}
        <div ref={lineRef} style={{
          width: 'clamp(36px, 4vw, 56px)',
          height: '1px',
          background: 'rgba(0,0,0,0.18)',
          margin: '0 auto clamp(24px, 4vw, 40px)',
          willChange: 'transform,opacity',
        }} />

        {/* Collaboration block */}
        <div ref={collabRef} style={{ willChange: 'transform,opacity' }}>
          <p style={{
            margin: '0 0 clamp(6px, 1vw, 10px)',
            fontSize: 'clamp(9px, 1.1vw, 14px)',
            fontWeight: 400,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.4)',
          }}>
            In collaboration with
          </p>
          <svg
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 387.98 54.85"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: 'clamp(140px, 22vw, 320px)',
              height: 'auto',
              opacity: 0.82,
              display: 'block',
              margin: '0 auto',
            }}
          >
            <g fill="#000">
              <path d="M0 39.46c.73 4.37 2.44 7.81 5.07 10.24 2.76 2.51 6.33 3.79 10.6 3.79 4.5 0 8.31-1.5 11.34-4.47 3-2.94 4.53-6.72 4.53-11.24 0-3.36-.92-6.23-2.75-8.53-1.85-2.33-4.83-4.33-8.87-5.96l-5.09-2.08c-3.91-1.61-5.89-3.8-5.89-6.52 0-1.97.78-3.62 2.31-4.92 1.5-1.29 3.41-1.95 5.68-1.95 1.84 0 3.37.38 4.56 1.14 1.05.61 2.12 1.82 3.24 3.67l5.3-3.14c-3.2-5.28-7.46-7.85-13.02-7.85-4.2 0-7.76 1.26-10.57 3.76-2.79 2.46-4.21 5.55-4.21 9.2 0 5.49 3.31 9.56 10.13 12.45l4.92 2.05c1.31.56 2.44 1.16 3.39 1.78.96.63 1.76 1.32 2.38 2.05a7.6 7.6 0 0 1 1.39 2.46c.29.88.44 1.85.44 2.9 0 2.61-.85 4.79-2.54 6.5s-3.83 2.58-6.38 2.58c-3.21 0-5.69-1.19-7.39-3.53-.88-1.15-1.5-3.07-1.87-5.87L0 39.45Z"/>
              <path d="M50.67 53.49h27.05v-6.14H57.27V27.29h19.86v-6.14H57.27V7.79h20.45V1.66H50.67z"/>
              <path d="M125.04 53.49h8.05l-15.66-21.55.83-.18c3.25-.7 5.9-2.31 7.88-4.79 1.98-2.49 2.99-5.51 2.99-8.98 0-4.43-1.6-9.97-4.76-12.66-2.88-2.43-7.67-3.67-14.25-3.67h-8.47v51.83h6.6V32.61h2.22zm-13.8-26.2h-3V7.79h3.29c7.42 0 11.19 4.73 11.19 10.3 0 5.91-3.86 9.2-11.48 9.2"/>
              <path d="M188.96 53.49h7.23L172.27.21l-24.82 53.27h7.11l6.1-13.31h22.55l5.75 13.31Zm-8.41-19.45h-17.2l8.8-19.25z"/>
              <path d="M215.33 53.49h6.59v-26.2h17.15v-6.14h-17.15V7.79h17.78V1.66h-24.37z"/>
              <path d="M270.22 1.66v51.83h-6.6V1.66z"/>
              <path d="m300.75 16.02 37.2 38.83V1.65h-6.6v37.27L294.15 0v53.49h6.6z"/>
              <path d="M368.47 1.66v51.83h-6.6V1.66z"/>
              <path d="M382.75 2.68c2.28 0 4.14 1.86 4.14 4.14s-1.86 4.14-4.14 4.14-4.14-1.86-4.14-4.14 1.86-4.14 4.14-4.14m0-1.09c-2.89 0-5.23 2.34-5.23 5.23s2.34 5.23 5.23 5.23 5.23-2.34 5.23-5.23-2.34-5.23-5.23-5.23"/>
              <path d="M385.12 9.06c-.31-.55-.89-1.68-1.02-1.84 1.79-1.03.83-3.28-.66-3.28-1.04 0-2 0-2.34.01-.07 0-.13.06-.13.13v5.09c0 .09.07.16.16.16h.92c.09 0 .16-.06.16-.15V7.37l.63-.02 1 1.97h1.12c.15.01.25-.13.18-.26Zm-1.68-2.78h-1.24V5.02h1.3c.08 0 .51.14.51.66s-.57.61-.57.61Z"/>
            </g>
          </svg>
        </div>

      </div>
    </div>
  );
}

// ─── SceneController ──────────────────────────────────────────────────────────
function SceneController({ galleryRef, setShowIntroText, setOverlayVisible, skipIntro }) {
  const hasAnimated = useRef(false);
  const timelineRef = useRef(null);
  const activeAnims = useRef([]);

  useEffect(() => {
    if (skipIntro || hasAnimated.current) return;
    const t = setTimeout(startAnimation, 50);
    return () => clearTimeout(t);
  }, [skipIntro]);

  function startAnimation() {
    if (!galleryRef.current || hasAnimated.current) return;
    hasAnimated.current = true;
    try { localStorage.setItem('kdh_visited_date', new Date().toDateString()); } catch {}
    const group = galleryRef.current;
    const tl = gsap.timeline();
    timelineRef.current = tl;

    tl.to(group.rotation, { y: group.rotation.y + Math.PI*2, duration:2.5, ease:'power3.in' }, 'start');
    tl.addLabel('explode', '-=0.1');
    tl.call(() => {
      window.dispatchEvent(new Event('sphereExploded'));
      group.children.forEach((child) => {
        if (!child.position) return;
        const dir  = child.position.clone().normalize();
        const dist = 200 + Math.random() * 150;
        activeAnims.current.push(
          gsap.to(child.position, { x:dir.x*dist, y:dir.y*dist, z:dir.z*dist, duration:3.5, ease:'power2.out' }),
          gsap.to(child.rotation, {
            x: Math.random()*Math.PI*8, y: Math.random()*Math.PI*8, z: Math.random()*Math.PI*8,
            duration:3.5, ease:'power2.out',
          }),
        );
      });
      // Show cinematic intro text first, then overlay after it completes
      setTimeout(() => setShowIntroText(true), 500);
    }, null, 'explode');
  }

  useEffect(() => {
    const restore = () => {
      if (!galleryRef.current) return;
      setShowIntroText(false);
      setOverlayVisible(false);
      const group = galleryRef.current;
      activeAnims.current.forEach((a) => a.kill());
      activeAnims.current = [];

      activeAnims.current.push(
        gsap.to(group.rotation, { y: group.rotation.y + Math.PI, duration:3, ease:'power2.out' }),
      );
      group.children.forEach((child) => {
        const p = child.userData.originalPosition;
        if (!p) return;
        activeAnims.current.push(
          gsap.to(child.position, { x:p[0], y:p[1], z:p[2], duration:3,   ease:'power3.inOut', delay:0.2 }),
          gsap.to(child.rotation, { x:0,    y:0,    z:0,    duration:3,   ease:'power2.inOut', delay:0.2 }),
          gsap.to(child.scale,    { x:1,    y:1,    z:1,    duration:2,   ease:'power2.out'              }),
        );
      });
    };
    window.addEventListener('restoreSphere', restore);
    return () => window.removeEventListener('restoreSphere', restore);
  }, [galleryRef, setShowIntroText, setOverlayVisible]);

  useEffect(() => () => {
    timelineRef.current?.kill();
    activeAnims.current.forEach((a) => a.kill());
  }, []);

  return null;
}

// ─── ScrollHandler ────────────────────────────────────────────────────────────
function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();
  useEffect(() => {
    onScrollIntoSphere.current  = () => { if (scroll.scroll) scroll.scroll.current = 1; };
    onScrollOutOfSphere.current = () => { if (scroll.scroll) scroll.scroll.current = 0; };
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FloatingImagesScene() {
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);
  const skipIntro = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try { return localStorage.getItem('kdh_visited_date') === new Date().toDateString(); } catch { return false; }
  }, []);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [showIntroText, setShowIntroText]  = useState(false);
  const [zoomTarget, setZoomTarget]        = useState(null);
  const zoomHrefRef          = useRef(null);
  const galleryRef           = useRef(null);
  const scrollIntoSphereRef  = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});
  const tooltipRef           = useRef(null);
  const hasMouseMoved        = useRef(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const rippleRef            = useRef(null);

  // Force full reload on bfcache restore so the WebGL context + scene reinitialise
  useEffect(() => {
    setZoomTarget(null);
    zoomHrefRef.current = null;

    const resetZoom = () => { setZoomTarget(null); zoomHrefRef.current = null; };
    const onPageShow = (e) => {
      if (e.persisted) window.location.reload();
    };

    window.addEventListener('popstate', resetZoom);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('popstate', resetZoom);
      window.removeEventListener('pageshow', onPageShow);
    };
  }, []);

  // ── White ripple: expand on explode, contract on restore ──
  useEffect(() => {
    const onExplode = () => {
      if (!rippleRef.current) return;
      gsap.killTweensOf(rippleRef.current);
      gsap.set(rippleRef.current, { display: 'block', clipPath: 'circle(0% at 50% 50%)' });
      gsap.to(rippleRef.current, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 1.1,
        ease: 'power2.out',
      });
    };
    const onRestore = () => {
      if (!rippleRef.current) return;
      gsap.killTweensOf(rippleRef.current);
      gsap.to(rippleRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 1.0,
        ease: 'power2.in',
        onComplete: () => {
          if (rippleRef.current) gsap.set(rippleRef.current, { display: 'none' });
        },
      });
    };
    window.addEventListener('sphereExploded', onExplode);
    window.addEventListener('restoreSphere',  onRestore);
    return () => {
      window.removeEventListener('sphereExploded', onExplode);
      window.removeEventListener('restoreSphere',  onRestore);
    };
  }, []);

  const monsterProducts = useMemo(() =>
    newImagePaths.filter((p) => p.group?.includes('Jina Shilp')), []);

  useEffect(() => {
    let rafId;
    const onMove = (e) => {
      hasMouseMoved.current = true;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (tooltipRef.current) {
          tooltipRef.current.style.top  = `${e.clientY + 15}px`;
          tooltipRef.current.style.left = `${e.clientX + 15}px`;
        }
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafId); };
  }, []);

  const handleImageClick = useCallback(({ productId, href, worldPosition }) => {
    if (!productId || zoomTarget) return;
    if (!worldPosition || !Array.isArray(worldPosition) || worldPosition.some(v => !isFinite(v))) return;
    zoomHrefRef.current = href;
    setZoomTarget({ position: worldPosition, href });
    setTooltipVisible(false);
  }, [zoomTarget]);

  const handleZoomComplete = useCallback(() => {
    if (zoomHrefRef.current) window.location.href = zoomHrefRef.current;
  }, []);

  const showTooltip = useCallback(({ name, group }) => {
    if (!hasMouseMoved.current || !tooltipRef.current) return;
    tooltipRef.current.querySelector('.tt-name').textContent  = name;
    tooltipRef.current.querySelector('.tt-group').textContent = group;
    setTooltipVisible(true);
  }, []);

  const hideTooltip        = useCallback(() => setTooltipVisible(false), []);
  const handleCloseOverlay = useCallback(() => window.dispatchEvent(new Event('restoreSphere')), []);

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 65, near: 0.1, far: 800 }}
        dpr={isMobile ? [0.5, 1] : [1, 1.5]}
        gl={{ powerPreference: 'high-performance', antialias: false, stencil: false, depth: true, alpha: false }}
        style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', background:'#000' }}
      >
        <ambientLight intensity={1} />
        <Starfield count={isMobile ? 80 : 200} radius={25} />

        <Suspense fallback={<CustomLoader />}>
          <ScrollControls pages={2} damping={0.1}>
            <ScrollHandler onScrollIntoSphere={scrollIntoSphereRef} onScrollOutOfSphere={scrollOutOfSphereRef} />
            <SphericalGallery
              ref={galleryRef}
              imagePaths={newImagePaths}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
              onImageClick={handleImageClick}
              isZooming={!!zoomTarget}
              radius={20}
            />
          </ScrollControls>
          <SceneController galleryRef={galleryRef} setShowIntroText={setShowIntroText} setOverlayVisible={setOverlayVisible} skipIntro={skipIntro} />
        </Suspense>

        <CameraAnimator zoomTarget={zoomTarget} onZoomComplete={handleZoomComplete} />
        <OrbitControls enableZoom={false} enablePan={false}
          enabled={!zoomTarget}
          autoRotate={!overlayVisible && !zoomTarget} autoRotateSpeed={0.5} makeDefault />
      </Canvas>

      {/* White ripple background overlay */}
      <div
        ref={rippleRef}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          background: '#e6e6e6',
          clipPath: 'circle(0% at 50% 50%)',
          pointerEvents: 'none',
          willChange: 'clip-path',
        }}
      />

      <div className={`zoom-transition ${zoomTarget ? ' active' : ''}`} />

      <IntroTextOverlay
        isVisible={showIntroText}
        onComplete={() => { setShowIntroText(false); setOverlayVisible(true); }}
      />

      <CollectionOverlay isVisible={overlayVisible} onClose={handleCloseOverlay} products={monsterProducts} />

      <div
        ref={tooltipRef}
        className={`tooltip hidden md:block${tooltipVisible && !overlayVisible ? ' visible' : ''}`}
        style={{ position:'fixed', top:0, left:0 }}
      >
        <div className='tt-name' />
        <div className='tt-group' />
      </div>

      {!overlayVisible && (
        <div className='navigation-buttons flex justify-center w-full md:hidden whitespace-nowrap'>
          <button onClick={() => scrollOutOfSphereRef.current()}><Minus size={30} /></button>
          <button onClick={() => scrollIntoSphereRef.current()}><Plus size={30} /></button>
        </div>
      )}

      <style jsx>{`
        .zoom-transition {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: black; opacity: 0; pointer-events: none;
          transition: opacity 1s ease-in 0.15s;
          z-index: 998;
          visibility: hidden;
        }
        .zoom-transition.active { opacity: 1; pointer-events: all; visibility: visible; }
        .tooltip {
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 1000; opacity: 0;
          transform: scale(0.95) translateY(4px);
          transition: opacity 0.15s, transform 0.15s;
          background: rgba(15,15,15,0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; padding: 8px 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          will-change: transform, opacity;
        }
        .tooltip.visible { opacity:1; transform:scale(1) translateY(0); }
        .tt-name  { color:white; font-size:13px; font-weight:600; margin-bottom:2px; }
        .tt-group { color:rgba(255,255,255,0.65); font-size:11px; }
        .navigation-buttons { position:fixed; bottom:20px; gap:10px; z-index:1000; }
        .navigation-buttons button {
          background:rgba(0,0,0,0.5); color:white; border:none;
          padding:6px 10px; border-radius:25px; cursor:pointer;
        }
      `}</style>
    </>
  );
}
