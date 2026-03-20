// FloatingImagesScene.jsx - Optimized Version with Luxurious Animation
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
import gsap from 'gsap';
import { newImagePaths } from './imagePaths';
import CustomLoader from './CustomLoader';
import { Plus, Minus } from 'lucide-react';
import CollectionOverlay from './CollectionOverlay';

// ─── Starfield ───────────────────────────────────────────────────────────────
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

      // Alternate between different colors: White, Blue-ish, Gold-ish
      if (i % 3 === 0) {
        col[i * 3] = 1;
        col[i * 3 + 1] = 1;
        col[i * 3 + 2] = 1;
      } else if (i % 3 === 1) {
        col[i * 3] = 0.6;
        col[i * 3 + 1] = 0.8;
        col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = 1;
        col[i * 3 + 1] = 0.9;
        col[i * 3 + 2] = 0.5;
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
      size / 2,
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Cleanup texture on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (starTexture) {
        starTexture.dispose();
      }
    };
  }, [starTexture]);

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
        // blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </points>
  );
}

// ─── FloatingImage ────────────────────────────────────────────────────────────
const FloatingImage = React.memo(function FloatingImage({
  url,
  position,
  baseScale = 3,
  productId,
  name,
  group,
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
    <group
      ref={ref}
      position={position}
      userData={{ name, group, originalPosition: position }}
    >
      <mesh onClick={handleClick}>
        <planeGeometry args={[baseScale * aspectRatio, baseScale, 32]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
});

// ─── SphericalGallery ─────────────────────────────────────────────────────────
// ForwardRef to allow parent GSAP control
const SphericalGallery = React.forwardRef(
  (
    { imagePaths, radius = 20, onImageHover, onImageOut, onImageClick },
    ref,
  ) => {
    const scroll = useScroll();
    const { camera, mouse } = useThree();
    const raycaster = new THREE.Raycaster();
    const hoveredImageRef = useRef(null);

    useFrame(() => {
      if (!ref.current) return;

      // Interaction Logic (Hover)
      // Only raycast if NOT animating explosively (optional optimization)
      // We can check if any animation is active via a prop or ref, but simple is fine.

      raycaster.setFromCamera(mouse, camera);
      const groups = ref.current.children;
      // We need to intersect the meshes inside the groups
      // Note: Assuming FloatingImage structure is Group -> Mesh
      const meshes = groups.map((g) => g.children[0]).filter(Boolean);

      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const closestMesh = intersects[0].object;
        const closestGroup = closestMesh.parent;

        if (closestGroup !== hoveredImageRef.current) {
          if (hoveredImageRef.current) {
            gsap.to(hoveredImageRef.current.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.2,
            });
          }
          hoveredImageRef.current = closestGroup;
          const { name, group } = closestGroup.userData;
          if (onImageHover && document.body.style.cursor !== 'none') {
            onImageHover({ name, group });
          }
          document.body.style.cursor = 'pointer';
        }

        gsap.to(closestGroup.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.2 });
      } else {
        if (hoveredImageRef.current) {
          gsap.to(hoveredImageRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.2,
          });
          hoveredImageRef.current = null;
          if (onImageOut) onImageOut();
          document.body.style.cursor = 'auto';
        }
      }

      // Billboard effect
      ref.current.children.forEach((child) => {
        child.lookAt(camera.position);
      });

      // Scroll Camera Effect
      const offset = scroll.offset;
      const camDist = THREE.MathUtils.lerp(50, 15, offset);

      // Check if camera is being controlled by GSAP (we can use userData flag if needed, or just let it override if not exploded)
      camera.position.setLength(camDist);
    });

    return (
      <group ref={ref}>
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
              onImageClick={onImageClick}
            />
          );
        })}
      </group>
    );
  },
);
SphericalGallery.displayName = 'SphericalGallery';

// ─── Animation Manager Component ──────────────────────────────────────────────
function SceneController({ galleryRef, setOverlayVisible }) {
  const { camera, scene } = useThree();
  const [hasAnimated, setHasAnimated] = useState(false);
  const timelineRef = useRef(null);
  const activeAnimationsRef = useRef([]);

  useEffect(() => {
    if (hasAnimated) return;

    // Trigger animation sequence (2.5s delay after mount)
    const delay = setTimeout(() => {
      startAnimation();
    }, 50);

    return () => clearTimeout(delay);
  }, [hasAnimated]);

  const startAnimation = () => {
    if (!galleryRef.current) return;
    setHasAnimated(true);

    const tl = gsap.timeline();
    timelineRef.current = tl;
    const group = galleryRef.current;

    // Phase 1: Spin Only
    tl.to(
      group.rotation,
      {
        y: group.rotation.y + Math.PI * 2, // Fast spin
        duration: 2.5,
        ease: 'power3.in',
      },
      'start',
    );

    // Phase 2: EXPLOSION - SLOWED DOWN for luxurious feel
    tl.addLabel('explode', '-=0.1');

    tl.call(
      () => {
        group.children.forEach((child) => {
          if (child.position) {
            const direction = child.position.clone().normalize();
            const distance = 200 + Math.random() * 150;

            // Blast away SLOWER and SMOOTHER
            const posAnim = gsap.to(child.position, {
              x: direction.x * distance,
              y: direction.y * distance,
              z: direction.z * distance,
              duration: 3.5, // Increased from 2s to 3.5s
              ease: 'power2.out', // Smoother easing
            });
            activeAnimationsRef.current.push(posAnim);

            // Spinning
            const rotAnim = gsap.to(child.rotation, {
              x: Math.random() * Math.PI * 8,
              y: Math.random() * Math.PI * 8,
              z: Math.random() * Math.PI * 8,
              duration: 3.5,
              ease: 'power2.out',
            });
            activeAnimationsRef.current.push(rotAnim);
          }
        });

        // Reveal Overlay with slight delay
        setTimeout(() => setOverlayVisible(true), 500);
      },
      null,
      'explode',
    );
  };

  // Listen for Close Event
  useEffect(() => {
    const restoreHandler = () => {
      if (!galleryRef.current) return;
      setOverlayVisible(false);
      const group = galleryRef.current;

      // Kill any active animations before starting new ones
      activeAnimationsRef.current.forEach((anim) => anim.kill());
      activeAnimationsRef.current = [];

      // Settle group rotation
      const groupRotAnim = gsap.to(group.rotation, {
        y: group.rotation.y + Math.PI,
        duration: 3,
        ease: 'power2.out',
      });
      activeAnimationsRef.current.push(groupRotAnim);

      // Restore children - Slower reassembly
      group.children.forEach((child) => {
        const targetPos = child.userData.originalPosition;
        if (targetPos) {
          // Fly back from exploded position to original
          const posAnim = gsap.to(child.position, {
            x: targetPos[0],
            y: targetPos[1],
            z: targetPos[2],
            duration: 3, // Slower (3s instead of 2s)
            ease: 'power3.inOut', // Smooth S-curve
            delay: 0.2,
          });
          activeAnimationsRef.current.push(posAnim);

          // Reverse the spinning
          const rotAnim = gsap.to(child.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 3,
            ease: 'power2.inOut',
            delay: 0.2,
          });
          activeAnimationsRef.current.push(rotAnim);

          // Ensure scale is robust
          const scaleAnim = gsap.to(child.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2,
            ease: 'power2.out',
          });
          activeAnimationsRef.current.push(scaleAnim);
        }
      });
    };

    window.addEventListener('restoreSphere', restoreHandler);
    return () => window.removeEventListener('restoreSphere', restoreHandler);
  }, [galleryRef, setOverlayVisible]);

  // Cleanup all GSAP animations on unmount
  useEffect(() => {
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      activeAnimationsRef.current.forEach((anim) => anim.kill());
      activeAnimationsRef.current = [];
    };
  }, []);

  return null;
}

// ─── ScrollHandler ───────────────────────────────────────────────────────────
function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 768) {
  //       setTimeout(() => {
  //         if (scroll.scroll) scroll.scroll.current = 0;
  //       }, 1000);
  //     } else {
  //       if (scroll.scroll) scroll.scroll.current = 0;
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
      if (scroll.scroll) scroll.scroll.current = 1;
    };
    onScrollOutOfSphere.current = () => {
      if (scroll.scroll) scroll.scroll.current = 0;
    };
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);

  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────
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

  const [overlayVisible, setOverlayVisible] = useState(false);
  const galleryRef = useRef(null);

  const scrollIntoSphereRef = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});

  const upcoming = [
    {
      name: 'Gattoo Chair',
      path: '/new4/4-1.webp',
      group: 'Monster 3.0',
      productId: '67b590d0e03cc2c55c624a5e',
    },
    {
      name: 'Monster Bench',
      path: '/new4/4-2.webp',
      group: 'Monster 3.0',
      productId: '67b590b8e03cc2c55c624a5b',
    },
  ];

  // const monsterProducts = useMemo(() => {
  //   return upcoming;
  // }, []);

  const monsterProducts = useMemo(() => {
    return newImagePaths.filter(
      (p) =>
        p.group &&
        (p.group.includes('Jina Shilp') || p.group.includes('Jina Shilp')),
    );
  }, []);

  useEffect(() => {
    let animationFrame;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
      });
      setHasMouseMoved(true);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleImageClick = ({ productId, href }) => {
    if (productId) window.location.href = href;
  };

  const showTooltip = ({ name, group }) => {
    if (!hasMouseMoved) return;
    setTooltip((prev) => ({ ...prev, visible: true, name, group }));
  };

  const hideTooltip = () => {
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 100);
  };

  const handleCloseOverlay = () => {
    window.dispatchEvent(new Event('restoreSphere'));
  };

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 65, near: 0.1, far: 2000 }}
        className='canvas-container'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000000',
        }}
      >
        <ambientLight intensity={1} />
        <Starfield count={350} radius={25} />

        <Suspense fallback={<CustomLoader />}>
          <ScrollControls pages={2} damping={0.1}>
            <ScrollHandler
              onScrollIntoSphere={scrollIntoSphereRef}
              onScrollOutOfSphere={scrollOutOfSphereRef}
            />
            <SphericalGallery
              ref={galleryRef}
              imagePaths={newImagePaths}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
              onImageClick={handleImageClick}
              radius={20}
            />
          </ScrollControls>
          <SceneController
            galleryRef={galleryRef}
            setOverlayVisible={setOverlayVisible}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!overlayVisible}
          autoRotateSpeed={0.5}
          makeDefault
        />
      </Canvas>

      <CollectionOverlay
        isVisible={overlayVisible}
        onClose={handleCloseOverlay}
        products={monsterProducts}
      />

      <div
        className={`tooltip ${tooltip.visible && hasMouseMoved && !overlayVisible ? 'visible' : ''} hidden md:block`}
        style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      {!overlayVisible && (
        <div className='navigation-buttons flex justify-center w-full md:hidden whitespace-nowrap'>
          <button onClick={() => scrollOutOfSphereRef.current()}>
            {' '}
            <Minus size={30} />{' '}
          </button>
          <button onClick={() => scrollIntoSphereRef.current()}>
            {' '}
            <Plus size={30} />{' '}
          </button>
        </div>
      )}

      <style jsx>{`
        .tooltip {
          position: fixed;
          pointer-events: none;
          font-family:
            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.95) translateY(4px);
          transition:
            opacity 0.15s,
            transform 0.15s;
          background: rgba(15, 15, 15, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .tooltip.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        .tooltip-name {
          color: white;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .tooltip-group {
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
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
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
