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
import { useRouter } from 'next/navigation';

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

    // ── Sphere positions (computed once for all items) ──
    const positions = useMemo(() => imagePaths.map((_, idx) => {
      const phi   = Math.acos(-1 + (2 * idx) / imagePaths.length);
      const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ];
    }), [imagePaths, radius]);

    // ── Cleanup materials and textures on unmount ──
    useEffect(() => () => {
      materialMap.forEach((mat) => {
        if (mat.map) mat.map.dispose();
        mat.dispose();
      });
      useTexture.clear(uniqueUrls);
    }, [materialMap, uniqueUrls]);

    useFrame(() => {
      if (!ref.current) return;
      const frame = ++tick.current;

      // Rebuild mesh cache only when child count changes
      if (meshCache.current.length !== ref.current.children.length) {
        meshCache.current = ref.current.children.map((g) => g.children[0]).filter(Boolean);
      }

      // Billboard — skip during zoom
      if (!isZooming) {
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
  const scene = useThree((s) => s.scene);

  const onZoomCompleteRef = useRef(onZoomComplete);
  useEffect(() => {
    onZoomCompleteRef.current = onZoomComplete;
  }, [onZoomComplete]);

  useEffect(() => {
    if (!zoomTarget) return;

    let completed = false;
    const done = () => { if (!completed) { completed = true; onZoomCompleteRef.current(); } };

    // Add black fog to the scene to swallow the background stars and other products
    if (!scene.fog) {
      scene.fog = new THREE.Fog('#000000', 100, 200);
    }

    const target = new THREE.Vector3(...zoomTarget.position);
    const dir = target.clone().sub(camera.position).normalize();
    // Use 3.0 instead of 1.5 to prevent the object from getting "too damn big"
    const endPos = target.clone().sub(dir.multiplyScalar(3.0));

    const tl = gsap.timeline({ onComplete: done });

    // Fade the background to black by bringing the fog extremely close (just behind the object)
    gsap.to(scene.fog, {
      near: 0.1,
      far: 4.5,
      duration: 1.0,
      ease: 'power2.out'
    });

    tl.to(camera.position, {
      x: endPos.x, y: endPos.y, z: endPos.z,
      duration: 1.0,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(target),
    });

    const isDesktop = window.innerWidth >= 768;
    
    // Dynamically calculate the exact pan offset needed to place the object at 25vw
    // (the center of the left half of the screen)
    const vFov = camera.fov * Math.PI / 180;
    const visibleHeight = 2 * 3.0 * Math.tan(vFov / 2);
    const visibleWidth = visibleHeight * camera.aspect;
    // We want the camera to move right by exactly 1/4 of the visible width
    // so the object moves left by 1/4 of the screen (landing at 25vw).
    const offsetAmount = isDesktop ? (visibleWidth / 4) : 0; 

    if (offsetAmount > 0) {
      const rightVec = new THREE.Vector3().crossVectors(dir, camera.up).normalize();
      const panObj = { offset: 0 };
      
      tl.to(panObj, {
        offset: offsetAmount,
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          const currentOffset = rightVec.clone().multiplyScalar(panObj.offset);
          camera.position.copy(endPos).add(currentOffset);
          camera.lookAt(target.clone().add(currentOffset));
        }
      });
    }

    // Safety fallback — navigate even if animation somehow stalls
    // Timeout must be longer than the total timeline duration (1.0 + 0.8 = 1.8s)
    const fallback = setTimeout(done, 3000);

    return () => { 
      tl.kill(); 
      clearTimeout(fallback); 
      // Reset fog smoothly when closing product details
      if (scene.fog) {
        gsap.to(scene.fog, { near: 100, far: 200, duration: 0.8 });
      }
    };
  }, [zoomTarget, camera, scene]);

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
export default function FloatingImagesScene({ onProductSelect }) {
  const router = useRouter();
  const isMobile = useMemo(() => typeof window !== 'undefined' && window.innerWidth < 768, []);
  const [zoomTarget, setZoomTarget]        = useState(null);
  const zoomHrefRef          = useRef(null);
  const galleryRef           = useRef(null);
  const scrollIntoSphereRef  = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});
  const tooltipRef           = useRef(null);
  const hasMouseMoved        = useRef(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [isTabVisible, setIsTabVisible] = useState(true);

  // Pause rendering loops when tab is hidden to save memory and CPU/GPU resources
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Force full reload on bfcache restore so the WebGL context + scene reinitialise
  useEffect(() => {
    setZoomTarget(null);
    zoomHrefRef.current = null;

    const resetZoom = () => { 
      setZoomTarget(null); 
      zoomHrefRef.current = null; 
      gsap.to('#home-logo-container', { opacity: 1, duration: 0.8, ease: 'power2.inOut', overwrite: true });
      gsap.to('nav, header, .fixed', { opacity: 1, duration: 0.8, ease: 'power2.inOut', overwrite: true });
    };
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

    // Fade out home page UI elements (Logo, Navbar) for a seamless transition illusion
    gsap.to('#home-logo-container', { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
    gsap.to('nav, header, .fixed', { opacity: 0, duration: 0.8, ease: 'power2.inOut' });
  }, [zoomTarget]);

  const handleZoomComplete = useCallback(() => {
    if (zoomHrefRef.current && onProductSelect) {
      // The productId is available in the href, but it's cleaner to pass the ID directly.
      // Wait, we didn't store productId in ref. Let's extract it from href.
      const match = zoomHrefRef.current.match(/\/productdetails\/(.+)/);
      if (match) {
        onProductSelect(match[1], zoomHrefRef.current);
      }
    }
  }, [onProductSelect]);

  const showTooltip = useCallback(({ name, group }) => {
    if (!hasMouseMoved.current || !tooltipRef.current) return;
    tooltipRef.current.querySelector('.tt-name').textContent  = name;
    tooltipRef.current.querySelector('.tt-group').textContent = group;
    setTooltipVisible(true);
  }, []);

  const hideTooltip = useCallback(() => setTooltipVisible(false), []);

  return (
    <>
      <Canvas
        frameloop={isTabVisible ? 'always' : 'never'}
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
        </Suspense>

        <CameraAnimator zoomTarget={zoomTarget} onZoomComplete={handleZoomComplete} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enabled={!zoomTarget && isTabVisible}
          autoRotate={!zoomTarget && isTabVisible}
          autoRotateSpeed={0.5}
          makeDefault
        />
      </Canvas>

      <div
        ref={tooltipRef}
        className={`tooltip hidden md:block${tooltipVisible ? ' visible' : ''}`}
        style={{ position:'fixed', top:0, left:0 }}
      >
        <div className='tt-name' />
        <div className='tt-group' />
      </div>

      <div className='navigation-buttons flex justify-center w-full md:hidden whitespace-nowrap'>
        <button onClick={() => scrollOutOfSphereRef.current()}><Minus size={30} /></button>
        <button onClick={() => scrollIntoSphereRef.current()}><Plus size={30} /></button>
      </div>

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

