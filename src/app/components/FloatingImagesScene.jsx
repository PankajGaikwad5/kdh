'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  useTexture,
  OrbitControls,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { newImagePaths } from './imagePaths';
import { Suspense } from 'react';
import CustomLoader from './CustomLoader';

// Enhanced Image component to maintain aspect ratio
function FloatingImage({
  url,
  position,
  baseScale = 3,
  onHover,
  onOut,
  productId,
  name,
  group,
}) {
  const ref = useRef();
  const router = useRouter();
  const [aspectRatio, setAspectRatio] = useState(1);
  const { gl } = useThree();

  // Use useTexture to load and get image dimensions
  const texture = useTexture(url);

  useEffect(() => {
    if (texture) {
      // Use onLoad to get the correct dimensions
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();

      // Ensure texture has loaded
      if (texture.image) {
        const imageAspect = texture.image.width / texture.image.height;
        setAspectRatio(imageAspect);
      }
    }
  }, [texture, gl.capabilities]);

  const handleClick = () => {
    if (productId) {
      router.push(`/productdetails/${productId}`);
    } else {
      router.push('/products');
    }
  };

  const handlePointerOver = (e) => {
    document.body.style.cursor = 'pointer';
    if (onHover) onHover({ name, group, ref, event: e });
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    if (onOut) onOut();
  };

  return (
    <group ref={ref} position={position}>
      {/* Use plane with texture instead of DreiImage for better control */}
      <mesh
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[baseScale * aspectRatio, baseScale, 32]} />
        <meshBasicMaterial map={texture} transparent={true} alphaTest={0.5} />
      </mesh>
    </group>
  );
}

// Custom controls component that manages both orbit controls and auto-rotation
function ControlsManager({ autoRotateSpeed = 0.5 }) {
  const controlsRef = useRef();
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const { gl, camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;

    // Handle start of user interaction
    const handleStart = () => {
      setIsUserInteracting(true);
    };

    // Handle end of user interaction, resume auto-rotation after a delay
    const handleEnd = () => {
      setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000); // Resume auto-rotation after 2 seconds of inactivity
    };

    if (controls) {
      controls.addEventListener('start', handleStart);
      controls.addEventListener('end', handleEnd);
    }

    return () => {
      if (controls) {
        controls.removeEventListener('start', handleStart);
        controls.removeEventListener('end', handleEnd);
      }
    };
  }, []);

  useFrame(() => {
    if (controlsRef.current) {
      // Only auto-rotate when user is not interacting
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

function SphericalGallery({
  imagePaths,
  radius = 20,
  onImageHover,
  onImageOut,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const [hoveredImage, setHoveredImage] = useState(null);
  const hoveredImageRef = useRef(null);
  const { camera } = useThree();

  useFrame(() => {
    // Scale up the hovered image
    if (hoveredImage && hoveredImageRef.current) {
      // Scale while maintaining aspect ratio
      const currentScale = hoveredImageRef.current.scale.clone();
      const targetScale = currentScale.clone().normalize().multiplyScalar(2.5);

      hoveredImageRef.current.scale.lerp(
        new THREE.Vector3(targetScale.x, targetScale.y, 1),
        0.1
      );
    } else {
      // Reset scale of all images to their original size
      groupRef.current.children.forEach((child) => {
        const originalScale =
          child.userData.originalScale || new THREE.Vector3(1, 1, 1);
        child.scale.lerp(originalScale, 0.1);
      });
    }

    // Make images face the camera (billboarding)
    groupRef.current.children.forEach((child) => {
      child.lookAt(camera.position);
    });

    // Adjust camera position based on scroll offset
    const offset = scroll.offset;
    const cameraDistance = THREE.MathUtils.lerp(50, 10, offset); // Move camera closer as user scrolls
    camera.position.setLength(cameraDistance);
  });

  // Store original scale on mount and handle hover
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        // Store original scale for reference
        child.userData.originalScale = child.scale.clone();
      });
    }
  }, [imagePaths]);

  const handleImageHover = ({ name, group, ref, event }) => {
    setHoveredImage({ name, group });
    hoveredImageRef.current = ref.current;
    if (onImageHover) onImageHover({ name, group, event });
  };

  const handleImageOut = () => {
    setHoveredImage(null);
    hoveredImageRef.current = null;
    if (onImageOut) onImageOut();
  };

  return (
    <group ref={groupRef}>
      {imagePaths.map((item, index) => {
        const phi = Math.acos(-1 + (2 * index) / imagePaths.length);
        const theta = Math.sqrt(imagePaths.length * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        return (
          <FloatingImage
            key={index}
            url={item.path}
            position={[x, y, z]}
            baseScale={2.8}
            productId={item.productId}
            name={item.name}
            group={item.group}
            onHover={handleImageHover}
            onOut={handleImageOut}
          />
        );
      })}
    </group>
  );
}

export default function FloatingImagesScene() {
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    group: '',
    x: 0,
    y: 0,
  });

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Only update tooltip position if it's visible
      if (tooltip.visible) {
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX,
          y: e.clientY,
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [tooltip.visible]);

  const showTooltip = ({ name, group, event }) => {
    // Initialize tooltip at the current mouse position
    setTooltip({
      visible: true,
      name,
      group,
      x: event?.clientX || 0,
      y: event?.clientY || 0,
    });
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: 65,
          near: 0.1,
          far: 2000,
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={<CustomLoader />}>
          <ScrollControls pages={2} damping={0.1}>
            <SphericalGallery
              imagePaths={newImagePaths}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
            />
          </ScrollControls>
        </Suspense>
        <ControlsManager autoRotateSpeed={0.5} />
      </Canvas>

      <div
        className={`tooltip ${tooltip.visible ? 'visible' : ''}`}
        style={{
          top: tooltip.y + 15,
          left: tooltip.x + 15,
        }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-divider' />
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      <div className='instructions'>Click and drag to rotate the gallery</div>

      <style jsx>{`
        .tooltip {
          position: fixed;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.85),
            rgba(50, 50, 50, 0.95)
          );
          color: #fff;
          padding: 12px 16px;
          pointer-events: none;
          font-family: sans-serif;
          z-index: 1000;
          opacity: 0;
          transform: scale(0.8);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .tooltip.visible {
          opacity: 1;
          transform: scale(1);
        }
        .tooltip-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .tooltip-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.5);
          margin: 4px 0;
        }
        .tooltip-group {
          font-size: 14px;
        }
        .instructions {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-family: sans-serif;
          font-size: 14px;
          opacity: 0.8;
          pointer-events: none;
          z-index: 1000;
        }
      `}</style>
    </>
  );
}
