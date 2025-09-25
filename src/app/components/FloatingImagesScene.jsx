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

// Optimized Starfield with reduced count
function Starfield({ count = 200, radius = 200 }) {
  const pointsRef = useRef();

  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * radius * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * radius * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * radius * 2;
    }
    return positions;
  }, [count, radius]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0002;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach='attributes-position'
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        sizeAttenuation
        transparent
        alphaTest={0.5}
        color='#ffffff'
      />
    </points>
  );
}

// Optimized FloatingImage with simplified materials
function FloatingImage({
  url,
  position,
  baseScale = 2.5,
  productId,
  name,
  group,
  onImageClick,
}) {
  const ref = useRef();
  const texture = useTexture(url);
  const [aspectRatio, setAspectRatio] = useState(1);

  useEffect(() => {
    if (texture && texture.image) {
      setAspectRatio(texture.image.width / texture.image.height);
      // Dispose of texture on unmount to free memory
      return () => texture.dispose();
    }
  }, [texture]);

  const handleClick = (e) => {
    e.stopPropagation();
    onImageClick({
      productId,
      name,
      group,
      href: `/productdetails/${productId}`,
    });
  };

  return (
    <group ref={ref} position={position}>
      <mesh onClick={handleClick}>
        <planeGeometry args={[baseScale * aspectRatio, baseScale]} />
        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Simplified ControlsManager
function ControlsManager({ autoRotateSpeed = 0.3 }) {
  const controlsRef = useRef();

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

// Optimized SphericalGallery with performance improvements
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

  // Memoized sphere positions
  const positions = useMemo(() => {
    const radius = 15;
    return imagePaths.map((_, idx) => {
      const phi = Math.acos(-1 + (2 * idx) / imagePaths.length);
      const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return [x, y, z];
    });
  }, [imagePaths.length]);

  useFrame(() => {
    if (!groupRef.current) return;

    frameCount.current++;

    // Only check hover every 3 frames for performance
    if (frameCount.current % 3 === 0) {
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
          onImageHover({ name, group });
        }
        closest.scale.lerp(new THREE.Vector3(1.3, 1.3, 1), 0.1);
      } else if (hoveredImageRef.current) {
        hoveredImageRef.current.scale.setScalar(1);
        hoveredImageRef.current = null;
        onImageOut();
      }
    }

    // Rotate images to face camera (simplified)
    groupRef.current.children.forEach((child, index) => {
      child.lookAt(camera.position);
    });

    // Camera animation based on scroll
    const offset = scroll.offset;
    const camDist = 10 + 40 * (1 - offset);
    camera.position.setLength(camDist);
  });

  return (
    <group ref={groupRef}>
      {imagePaths.map((item, idx) => (
        <FloatingImage
          key={idx}
          url={item.path}
          position={positions[idx]}
          baseScale={2.2}
          productId={item.productId}
          name={item.name}
          group={item.group}
          userData={{ name: item.name, group: item.group }}
          onImageClick={onImageClick}
        />
      ))}
    </group>
  );
}

// ScrollHandler remains the same
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
    return () => window.removeEventListener('resize', handleResize);
  }, [scroll]);

  useEffect(() => {
    onScrollIntoSphere.current = () => (scroll.scroll.current = 1);
    onScrollOutOfSphere.current = () => (scroll.scroll.current = 0);
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);

  return null;
}

// Main component with aggressive optimizations
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

  // Throttled mouse movement
  useEffect(() => {
    let timeout;
    const handleMouseMove = (e) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
          setHasMouseMoved(true);
          timeout = null;
        }, 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  // Fast navigation
  const handleImageClick = ({ href }) => {
    window.location.href = href;
  };

  // Aggressive prefetching
  useEffect(() => {
    // Prefetch critical pages first
    const criticalIds = newImagePaths.slice(0, 5).map((item) => item.productId);

    criticalIds.forEach((productId, index) => {
      setTimeout(() => {
        router.prefetch(`/productdetails/${productId}`);
      }, index * 100);
    });

    // Prefetch collections page
    setTimeout(() => {
      router.prefetch('/collections');
    }, 500);

    // Preload remaining products in background
    const remainingIds = newImagePaths.slice(5).map((item) => item.productId);
    setTimeout(() => {
      remainingIds.forEach((productId, index) => {
        setTimeout(() => {
          router.prefetch(`/productdetails/${productId}`);
        }, index * 50);
      });
    }, 1000);
  }, [router]);

  const showTooltip = ({ name, group }) => {
    if (!hasMouseMoved) return;
    setTooltip((prev) => ({ ...prev, visible: true, name, group }));
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  const scrollIntoSphere = () => scrollIntoSphereRef.current();
  const scrollOutOfSphere = () => scrollOutOfSphereRef.current();

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
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
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 1.5]} // Lower DPR for better performance
      >
        <ambientLight intensity={0.8} />

        <Starfield count={150} radius={100} />

        <Suspense fallback={null}>
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

        <ControlsManager autoRotateSpeed={0.3} />
      </Canvas>

      {/* Tooltip */}
      <div
        className={`tooltip ${
          tooltip.visible && hasMouseMoved ? 'visible' : ''
        } hidden md:block`}
        style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      {/* Mobile navigation */}
      <div className='navigation-buttons md:hidden'>
        <button onClick={scrollOutOfSphere}>
          <Minus size={24} />
        </button>
        <button onClick={scrollIntoSphere}>
          <Plus size={24} />
        </button>
      </div>

      {/* Hidden prefetch links */}
      <div style={{ display: 'none' }}>
        <Link href='/collections' prefetch />
        {newImagePaths.slice(0, 10).map((item) => (
          <Link
            key={item.productId}
            href={`/productdetails/${item.productId}`}
            prefetch
          />
        ))}
      </div>

      <style jsx>{`
        .tooltip {
          position: fixed;
          pointer-events: none;
          z-index: 1000;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.2s, transform 0.2s;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          border-radius: 6px;
          padding: 8px 12px;
          max-width: 200px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .tooltip.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .tooltip-name {
          color: white;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .tooltip-group {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
        }
        .navigation-buttons {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 1000;
        }
        .navigation-buttons button {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: none;
          padding: 8px;
          border-radius: 50%;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
      `}</style>
    </>
  );
}
