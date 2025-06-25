// FloatingImagesScene.jsx - Optimized Version
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

// ─── Starfield with Pronounced Glow ───────────────────────────────────────────
// Updated Starfield with alternating colors
function Starfield({ count = 400, radius = 200 }) {
  const pointsRef = useRef();
  const { gl } = useThree();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos(2 * Math.random() - 1);
      const offset =
        i < count * 0.5
          ? radius + 2 + Math.random() * 40
          : radius + 50 + Math.random() * 100;

      pos[i * 3] = offset * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = offset * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = offset * Math.cos(theta);

      // Alternate between different colors
      if (i % 3 === 0) {
        col[i * 3] = 1; // R - White
        col[i * 3 + 1] = 1; // G
        col[i * 3 + 2] = 1; // B
      } else if (i % 3 === 1) {
        col[i * 3] = 0.2; // R - Blue
        col[i * 3 + 1] = 0.5; // G
        col[i * 3 + 2] = 1; // B
      } else {
        col[i * 3] = 1; // R - Gold
        col[i * 3 + 1] = 0.8; // G
        col[i * 3 + 2] = 0.2; // B
      }
    }
    return { positions: pos, colors: col };
  }, [count, radius]);

  const starTexture = useMemo(() => {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, size, size);
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    // Use gray gradient so vertex colors can show through
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.05, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    return texture;
  }, [gl.capabilities]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
    }
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
        size={3}
        sizeAttenuation
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

// ─── FloatingImage with Link Integration ──────────────────────────────────────
function FloatingImage({
  url,
  position,
  baseScale = 3,
  productId,
  name,
  group,
  userData,
  onImageClick,
}) {
  const ref = useRef();
  const { gl } = useThree();
  const texture = useTexture(url);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (texture && texture.image) {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      setAspectRatio(texture.image.width / texture.image.height);
    }
  }, [texture, gl.capabilities]);

  // Create the href for the link
  const href = productId ? `/productdetails/${productId}` : '/products';

  const handleClick = (e) => {
    e.stopPropagation();
    // Pass the href to the parent so it can handle navigation
    onImageClick({ productId, name, group, href });
  };

  return (
    <group ref={ref} position={position} userData={userData}>
      <mesh onClick={handleClick}>
        <planeGeometry args={[baseScale * aspectRatio, baseScale, 32]} />
        <meshBasicMaterial map={texture} transparent alphaTest={0.5} />
      </mesh>
    </group>
  );
}

// ─── ControlsManager ────────────────────────────────────────────────────────
function ControlsManager({ autoRotateSpeed = 0.5 }) {
  const controlsRef = useRef();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => setIsUserInteracting(true);
    const handleEnd = () => {
      setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000);
    };

    controls.addEventListener('start', handleStart);
    controls.addEventListener('end', handleEnd);
    return () => {
      controls.removeEventListener('start', handleStart);
      controls.removeEventListener('end', handleEnd);
    };
  }, []);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !isUserInteracting;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      autoRotate
      autoRotateSpeed={autoRotateSpeed}
      makeDefault
    />
  );
}

// ─── SphericalGallery ────────────────────────────────────────────────────────
function SphericalGallery({
  imagePaths,
  radius = 20,
  onImageHover,
  onImageOut,
  onImageClick,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const { camera, mouse } = useThree();
  const raycaster = new THREE.Raycaster();
  const hoveredImageRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      groupRef.current.children,
      true
    );

    if (intersects.length > 0) {
      const closest = intersects[0].object;
      if (closest !== hoveredImageRef.current) {
        if (hoveredImageRef.current) {
          const originalScale =
            hoveredImageRef.current.userData.originalScale ||
            new THREE.Vector3(1, 1, 1);
          hoveredImageRef.current.scale.lerp(originalScale, 0.1);
        }
        hoveredImageRef.current = closest;
        const { name, group } = closest.parent.userData;
        if (onImageHover) {
          onImageHover({ name, group });
        }
        document.body.style.cursor = 'pointer';
      }
      const currentScale = hoveredImageRef.current.scale.clone();
      const targetScale = currentScale.clone().normalize().multiplyScalar(2.5);
      hoveredImageRef.current.scale.lerp(
        new THREE.Vector3(targetScale.x, targetScale.y, 1),
        0.1
      );
    } else {
      if (hoveredImageRef.current) {
        const originalScale =
          hoveredImageRef.current.userData.originalScale ||
          new THREE.Vector3(1, 1, 1);
        hoveredImageRef.current.scale.lerp(originalScale, 0.1);
        hoveredImageRef.current = null;
        if (onImageOut) onImageOut();
        document.body.style.cursor = 'auto';
      }
    }

    groupRef.current.children.forEach((child) => {
      child.lookAt(camera.position);
    });

    const offset = scroll.offset;
    const camDist = THREE.MathUtils.lerp(50, 10, offset);
    camera.position.setLength(camDist);
  });

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.userData.originalScale = child.scale.clone();
      });
    }
  }, [imagePaths]);

  return (
    <group ref={groupRef}>
      {imagePaths.map((item, idx) => {
        const phi = Math.acos(-1 + (2 * idx) / imagePaths.length);
        const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;
        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        return (
          <FloatingImage
            key={idx}
            url={item.path}
            position={[x, y, z]}
            baseScale={2.8}
            productId={item.productId}
            name={item.name}
            group={item.group}
            userData={{ name: item.name, group: item.group }}
            onImageClick={onImageClick}
          />
        );
      })}
    </group>
  );
}

// ─── ScrollHandler ───────────────────────────────────────────────────────────
function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTimeout(() => {
          scroll.scroll.current = 1;
        }, 1000);
      } else {
        scroll.scroll.current = 0;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [scroll]);

  useEffect(() => {
    onScrollIntoSphere.current = () => {
      scroll.scroll.current = 1;
    };
    onScrollOutOfSphere.current = () => {
      scroll.scroll.current = 0;
    };
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);

  return null;
}

// ─── Main FloatingImagesScene ─────────────────────────────────────────────────
export default function FloatingImagesScene() {
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
    let animationFrame;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX,
          y: e.clientY,
        }));
      });
      setHasMouseMoved(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  // Optimized navigation handler with immediate navigation
  const handleImageClick = ({ productId, name, group, href }) => {
    // Use window.location for immediate navigation (fastest option)
    window.location.href = href;

    // Alternative: Use router.push with shallow routing for faster navigation
    // router.push(href, undefined, { shallow: true });
  };

  // Aggressive prefetching strategy
  useEffect(() => {
    // Prefetch all product detail pages immediately on mount
    const prefetchTimer = setTimeout(() => {
      newImagePaths.forEach((item, index) => {
        if (item.productId) {
          // Stagger prefetching to avoid overwhelming the browser
          setTimeout(() => {
            router.prefetch(`/productdetails/${item.productId}`);
          }, index * 50); // 50ms delay between each prefetch
        }
      });
      // Also prefetch the products page
      router.prefetch('/products');
    }, 100); // Start prefetching after component mounts

    return () => clearTimeout(prefetchTimer);
  }, [router]);

  // Preload critical resources
  useEffect(() => {
    // Preload the most commonly accessed product pages
    const criticalProductIds = newImagePaths
      .slice(0, 10) // First 10 products are likely most accessed
      .filter((item) => item.productId)
      .map((item) => item.productId);

    criticalProductIds.forEach((productId) => {
      // Create invisible link elements to trigger browser prefetching
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/productdetails/${productId}`;
      document.head.appendChild(link);
    });

    // Cleanup
    return () => {
      const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
      prefetchLinks.forEach((link) => link.remove());
    };
  }, []);

  const showTooltip = ({ name, group }) => {
    if (!hasMouseMoved) return;
    setTooltip((prev) => ({
      ...prev,
      visible: true,
      name,
      group,
    }));
  };

  const hideTooltip = () => {
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 100);
  };

  const scrollIntoSphere = () => {
    scrollIntoSphereRef.current();
  };
  const scrollOutOfSphere = () => {
    scrollOutOfSphereRef.current();
  };

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 65, near: 0.1, far: 2000 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000511',
        }}
      >
        <ambientLight intensity={1} />

        <Starfield count={280} radius={25} />

        <Suspense fallback={<CustomLoader />}>
          <ScrollControls pages={2} damping={0.1}>
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

        <ControlsManager autoRotateSpeed={0.5} />
      </Canvas>

      {/* Tooltip */}
      <div
        className={`tooltip ${
          tooltip.visible && hasMouseMoved ? 'visible' : ''
        } hidden md:block`}
        style={{
          top: tooltip.y + 15,
          left: tooltip.x + 15,
        }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      {/* Mobile navigation buttons */}
      <div className='navigation-buttons flex justify-center w-full md:hidden whitespace-nowrap'>
        <button onClick={scrollOutOfSphere}>
          <Minus size={30} />
        </button>
        <button onClick={scrollIntoSphere}>
          <Plus size={30} />
        </button>
      </div>

      {/* Enhanced prefetching with invisible Link components */}
      <div style={{ display: 'none' }}>
        <Link href='/products' prefetch={true}>
          Products
        </Link>
        {newImagePaths.map((item) =>
          item.productId ? (
            <Link
              key={item.productId}
              href={`/productdetails/${item.productId}`}
              prefetch={true}
            >
              {item.name}
            </Link>
          ) : null
        )}
      </div>

      <style jsx>{`
        .tooltip {
          position: fixed;
          pointer-events: none;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            sans-serif;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.95) translateY(4px);
          transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 200px;
        }
        .tooltip.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .tooltip-name {
          color: white;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 2px;
        }
        .tooltip-group {
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
          font-weight: 400;
          line-height: 1.2;
        }
        .navigation-buttons {
          position: fixed;
          bottom: 20px;
          gap: 10px;
          z-index: 1000;
        }
        .navigation-buttons button {
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 25px;
          font-family: sans-serif;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .navigation-buttons button:hover {
          background: rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </>
  );
}
