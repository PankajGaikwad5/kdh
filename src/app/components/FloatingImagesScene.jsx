// FloatingImagesScene.jsx - With Pinch-to-Zoom
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

// ─── Pinch-to-Zoom Handler Hook ──────────────────────────────────────────────
function usePinchZoom(onZoomChange) {
  const [isZooming, setIsZooming] = useState(false);
  const lastTouchDistance = useRef(0);
  const lastWheelTime = useRef(0);

  useEffect(() => {
    let touchStartDistance = 0;
    let initialZoom = 0;

    // Touch events for mobile pinch
    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        touchStartDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        lastTouchDistance.current = touchStartDistance;
        setIsZooming(true);
        e.preventDefault();
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2 && touchStartDistance > 0) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        const scale = currentDistance / touchStartDistance;
        const zoomLevel = Math.max(0, Math.min(1, 1 - (scale - 1) * 0.5));

        onZoomChange(zoomLevel);
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e) => {
      if (e.touches.length < 2) {
        touchStartDistance = 0;
        setIsZooming(false);
      }
    };

    // Wheel events for trackpad/mouse wheel
    const handleWheel = (e) => {
      const now = Date.now();
      const timeDiff = now - lastWheelTime.current;
      lastWheelTime.current = now;

      // Detect trackpad vs mouse wheel
      const isTrackpad = Math.abs(e.deltaY) < 50 && timeDiff < 50;

      if (isTrackpad || e.ctrlKey) {
        // Trackpad or Ctrl+wheel for zoom
        e.preventDefault();
        setIsZooming(true);

        const zoomSensitivity = 0.01;
        const deltaZoom = -e.deltaY * zoomSensitivity;

        // Get current zoom level and apply change
        onZoomChange((prevZoom) => {
          const newZoom = Math.max(0, Math.min(1, prevZoom + deltaZoom));
          return newZoom;
        });

        // Reset zooming state after a delay
        setTimeout(() => setIsZooming(false), 100);
      }
    };

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('wheel', handleWheel);
    };
  }, [onZoomChange]);

  return isZooming;
}

// ─── Starfield with Pronounced Glow ───────────────────────────────────────────
function Starfield({ count = 400, radius = 200 }) {
  const pointsRef = useRef();
  const { gl } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
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
    }
    return pos;
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
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.05, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.2)');
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
      </bufferGeometry>
      <pointsMaterial
        map={starTexture}
        size={3}
        sizeAttenuation
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
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

  const href = productId ? `/productdetails/${productId}` : '/products';

  const handleClick = (e) => {
    e.stopPropagation();
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

// ─── Enhanced ControlsManager with Zoom Disable ──────────────────────────────
function ControlsManager({ autoRotateSpeed = 0.5, isZooming = false }) {
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
      controlsRef.current.autoRotate = !isUserInteracting && !isZooming;
      // Disable orbit controls when zooming to prevent conflicts
      controlsRef.current.enabled = !isZooming;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false} // Disable built-in zoom to use custom pinch-to-zoom
      enablePan={false}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI - Math.PI / 6}
      autoRotate
      autoRotateSpeed={autoRotateSpeed}
      makeDefault
    />
  );
}

// ─── SphericalGallery with Zoom Control ───────────────────────────────────────
function SphericalGallery({
  imagePaths,
  radius = 20,
  onImageHover,
  onImageOut,
  onImageClick,
  zoomLevel = 0,
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

    // Combine scroll offset and zoom level for camera distance
    const scrollOffset = scroll.offset;
    const combinedZoom = Math.max(scrollOffset, zoomLevel);
    const camDist = THREE.MathUtils.lerp(50, 10, combinedZoom);
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

// ─── ScrollHandler with Zoom Integration ──────────────────────────────────────
function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 768) {
  //       setTimeout(() => {
  //         scroll.scroll.current = 1;
  //       }, 1000);
  //     } else {
  //       scroll.scroll.current = 0;
  //     }
  //   };
  //   handleResize();
  //   window.addEventListener('resize', handleResize);
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [scroll]);

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

// ─── Main FloatingImagesScene with Pinch-to-Zoom ──────────────────────────────
export default function FloatingImagesScene() {
  const router = useRouter();
  const [hasMouseMoved, setHasMouseMoved] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    group: '',
    x: 0,
    y: 0,
  });
  const scrollIntoSphereRef = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});

  // Handle zoom changes from pinch-to-zoom
  const handleZoomChange = (newZoomLevel) => {
    if (typeof newZoomLevel === 'function') {
      setZoomLevel((prev) => {
        const result = newZoomLevel(prev);
        return result;
      });
    } else {
      setZoomLevel(newZoomLevel);
    }
  };

  // Use the pinch-to-zoom hook
  const isZooming = usePinchZoom(handleZoomChange);

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

  const handleImageClick = ({ productId, name, group, href }) => {
    window.location.href = href;
  };

  // Aggressive prefetching strategy
  useEffect(() => {
    const prefetchTimer = setTimeout(() => {
      newImagePaths.forEach((item, index) => {
        if (item.productId) {
          setTimeout(() => {
            router.prefetch(`/productdetails/${item.productId}`);
          }, index * 50);
        }
      });
      router.prefetch('/products');
    }, 100);

    return () => clearTimeout(prefetchTimer);
  }, [router]);

  useEffect(() => {
    const criticalProductIds = newImagePaths
      .slice(0, 10)
      .filter((item) => item.productId)
      .map((item) => item.productId);

    criticalProductIds.forEach((productId) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/productdetails/${productId}`;
      document.head.appendChild(link);
    });

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
              zoomLevel={zoomLevel}
            />
          </ScrollControls>
        </Suspense>

        <ControlsManager autoRotateSpeed={0.5} isZooming={isZooming} />
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

      {/* Zoom indicator */}
      {isZooming && (
        <div className='zoom-indicator'>
          <div className='zoom-bar'>
            <div
              className='zoom-fill'
              style={{ width: `${zoomLevel * 100}%` }}
            />
          </div>
          <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
        </div>
      )}

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
        .zoom-indicator {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            sans-serif;
          font-size: 12px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .zoom-bar {
          width: 60px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          overflow: hidden;
        }
        .zoom-fill {
          height: 100%;
          background: white;
          transition: width 0.1s ease;
        }
      `}</style>
    </>
  );
}
