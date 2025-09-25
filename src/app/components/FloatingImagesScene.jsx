// FloatingImagesScene.jsx - SSR Safe & Optimized
'use client';
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  OrbitControls,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { newImagePaths } from './imagePaths';
import CustomLoader from './CustomLoader';
import { Plus, Minus } from 'lucide-react';

// ─── Client-side Check Hook ──────────────────────────────────────────────────
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

// ─── Optimized Starfield ─────────────────────────────────────────────────────
function Starfield({ count = 150 }) {
  const pointsRef = useRef();
  const { gl } = useThree();

  const { positions, colors, starTexture } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    // Simplified star positioning
    for (let i = 0; i < count; i++) {
      const radius = 100 + Math.random() * 150;
      pos[i * 3] = (Math.random() - 0.5) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * radius;

      // Only two color types
      if (i % 2 === 0) {
        col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 1; // White
      } else {
        col[i * 3] = 0.3;
        col[i * 3 + 1] = 0.6;
        col[i * 3 + 2] = 1; // Blue
      }
    }

    // Create star texture safely
    let texture;
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.1, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.magFilter = THREE.LinearFilter;
      texture.minFilter = THREE.LinearFilter;
    } else {
      // Fallback for SSR
      texture = new THREE.Texture();
    }

    return { positions: pos, colors: col, starTexture: texture };
  }, [count]);

  useFrame(() => {
    if (pointsRef.current) pointsRef.current.rotation.y += 0.0003;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach='attributes-color'
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        size={2}
        sizeAttenuation
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

// ─── Optimized FloatingImage ─────────────────────────────────────────────────
function FloatingImage({
  url,
  position,
  productId,
  name,
  group,
  onImageClick,
}) {
  const ref = useRef();
  const texture = useTexture(url);
  const [aspectRatio, setAspectRatio] = useState(1);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1, 4, 4), []);

  useEffect(() => {
    if (texture?.image) {
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      setAspectRatio(texture.image.width / texture.image.height);
    }
  }, [texture]);

  const handleClick = (e) => {
    e.stopPropagation();
    onImageClick({
      productId,
      name,
      group,
      href: productId ? `/productdetails/${productId}` : '/products',
    });
  };

  return (
    <group ref={ref} position={position} userData={{ name, group, productId }}>
      <mesh onClick={handleClick} geometry={geometry}>
        <meshBasicMaterial map={texture} transparent alphaTest={0.5} />
      </mesh>
    </group>
  );
}

// ─── Simplified Controls ─────────────────────────────────────────────────────
function ControlsManager() {
  const controlsRef = useRef();
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => setIsInteracting(true);
    const handleEnd = () => setTimeout(() => setIsInteracting(false), 1500);

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);
    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
    };
  }, []);

  useFrame(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = !isInteracting;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      autoRotate
      autoRotateSpeed={0.3}
    />
  );
}

// ─── Optimized SphericalGallery ──────────────────────────────────────────────
function SphericalGallery({
  imagePaths,
  onImageHover,
  onImageOut,
  onImageClick,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const { camera, mouse } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const hoveredImageRef = useRef(null);
  const frameCount = useRef(0);

  const positions = useMemo(() => {
    const radius = 18;
    return imagePaths.map((_, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / imagePaths.length);
      const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;
      return [
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi),
      ];
    });
  }, [imagePaths]);

  useFrame(() => {
    frameCount.current++;

    if (frameCount.current % 3 === 0 && groupRef.current) {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        groupRef.current.children,
        true
      );

      if (intersects.length > 0) {
        const closest = intersects[0].object;
        if (closest !== hoveredImageRef.current) {
          if (hoveredImageRef.current) {
            hoveredImageRef.current.scale.setScalar(1);
          }
          hoveredImageRef.current = closest;
          const { name, group } = closest.parent.userData;
          onImageHover?.({ name, group });
          if (typeof document !== 'undefined') {
            document.body.style.cursor = 'pointer';
          }
        }
        hoveredImageRef.current.scale.lerp(new THREE.Vector3(1.8, 1.8, 1), 0.1);
      } else if (hoveredImageRef.current) {
        hoveredImageRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        hoveredImageRef.current = null;
        onImageOut?.();
        if (typeof document !== 'undefined') {
          document.body.style.cursor = 'auto';
        }
      }
    }

    if (frameCount.current % 2 === 0) {
      const camDist = THREE.MathUtils.lerp(45, 12, scroll.offset);
      camera.position.setLength(camDist);

      groupRef.current?.children.forEach((child) =>
        child.lookAt(camera.position)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {imagePaths.map((item, idx) => (
        <FloatingImage
          key={`${item.productId}-${idx}`}
          url={item.path}
          position={positions[idx]}
          productId={item.productId}
          name={item.name}
          group={item.group}
          onImageClick={onImageClick}
        />
      ))}
    </group>
  );
}

// ─── ScrollHandler ───────────────────────────────────────────────────────────
function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setTimeout(() => (scroll.scroll.current = 1), 500);
      } else {
        scroll.scroll.current = 0;
      }
    };

    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [scroll]);

  useEffect(() => {
    onScrollIntoSphere.current = () => (scroll.scroll.current = 1);
    onScrollOutOfSphere.current = () => (scroll.scroll.current = 0);
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);

  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function FloatingImagesScene() {
  const isClient = useIsClient();
  const router = useRouter();
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    group: '',
    x: 0,
    y: 0,
  });
  const scrollIntoSphereRef = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});

  useEffect(() => {
    if (!isClient) return;

    let frame;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
      });
      setHasMouseMoved(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, [isClient]);

  const handleImageClick = ({ href }) => {
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const prefetch = () => {
      const productIds = newImagePaths
        .filter((item) => item.productId)
        .slice(0, 8);
      productIds.forEach((item, i) => {
        setTimeout(
          () => router.prefetch(`/productdetails/${item.productId}`),
          i * 100
        );
      });
    };
    const timer = setTimeout(prefetch, 1000);
    return () => clearTimeout(timer);
  }, [router, isClient]);

  const showTooltip = ({ name, group }) => {
    if (hasMouseMoved)
      setTooltip((prev) => ({ ...prev, visible: true, name, group }));
  };

  const hideTooltip = () => {
    setTimeout(() => setTooltip((prev) => ({ ...prev, visible: false })), 50);
  };

  // Don't render Canvas on server
  if (!isClient) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000511',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <CustomLoader />
      </div>
    );
  }

  const devicePixelRatio =
    typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1;

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 45], fov: 60, near: 0.1, far: 1000 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000511',
        }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        dpr={devicePixelRatio}
      >
        <ambientLight intensity={0.8} />
        <Starfield count={150} />
        <Suspense fallback={<CustomLoader />}>
          <ScrollControls pages={2} damping={0.15}>
            <ScrollHandler
              onScrollIntoSphere={scrollIntoSphereRef}
              onScrollOutOfSphere={scrollOutOfSphereRef}
            />
            <SphericalGallery
              imagePaths={newImagePaths}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
              onImageClick={handleImageClick}
            />
          </ScrollControls>
        </Suspense>
        <ControlsManager />
      </Canvas>

      <div
        className={`tooltip ${
          tooltip.visible && hasMouseMoved ? 'visible' : ''
        } hidden md:block`}
        style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      <div className='navigation-buttons flex justify-center w-full md:hidden'>
        <button onClick={() => scrollOutOfSphereRef.current()}>
          <Minus size={28} />
        </button>
        <button onClick={() => scrollIntoSphereRef.current()}>
          <Plus size={28} />
        </button>
      </div>

      <div style={{ display: 'none' }}>
        <Link href='/products' prefetch>
          Products
        </Link>
        {newImagePaths.slice(0, 10).map(
          (item) =>
            item.productId && (
              <Link
                key={item.productId}
                href={`/productdetails/${item.productId}`}
                prefetch
              >
                {item.name}
              </Link>
            )
        )}
      </div>

      <style jsx>{`
        .tooltip {
          position: fixed;
          pointer-events: none;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.9);
          transition: all 0.12s ease;
          max-width: 180px;
          background: rgba(0, 0, 0, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 6px 10px;
          font-family: system-ui;
        }
        .tooltip.visible {
          opacity: 1;
          transform: scale(1);
        }
        .tooltip-name {
          color: white;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 1px;
        }
        .tooltip-group {
          color: rgba(255, 255, 255, 0.6);
          font-size: 10px;
        }
        .navigation-buttons {
          position: fixed;
          bottom: 20px;
          gap: 12px;
          z-index: 1000;
        }
        .navigation-buttons button {
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .navigation-buttons button:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
}
