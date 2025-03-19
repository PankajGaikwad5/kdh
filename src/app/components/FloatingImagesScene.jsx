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

  productId,
  name,
  group,
  userData,
}) {
  const ref = useRef();
  const router = useRouter();
  const [aspectRatio, setAspectRatio] = useState(1);
  const { gl } = useThree();

  const texture = useTexture(url);

  useEffect(() => {
    if (texture) {
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
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

  return (
    <group ref={ref} position={position} userData={userData}>
      <mesh onClick={handleClick}>
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
  const { camera, scene, mouse } = useThree();
  const raycaster = new THREE.Raycaster();

  useFrame(() => {
    // Update the raycaster with the current mouse position and camera
    raycaster.setFromCamera(mouse, camera);

    // Find all intersected objects
    const intersects = raycaster.intersectObjects(
      groupRef.current.children,
      true
    );

    // If there's an intersection, get the closest object
    if (intersects.length > 0) {
      const closestObject = intersects[0].object;

      // Trigger hover for the closest object
      if (closestObject !== hoveredImageRef.current) {
        // Reset the previously hovered image
        if (hoveredImageRef.current) {
          const originalScale =
            hoveredImageRef.current.userData.originalScale ||
            new THREE.Vector3(1, 1, 1);
          hoveredImageRef.current.scale.lerp(originalScale, 0.1);
        }

        // Set the new hovered image
        hoveredImageRef.current = closestObject;
        const { name, group } = closestObject.parent.userData; // Assuming userData is set on the parent group
        setHoveredImage({ name, group });

        // Trigger the onHover callback
        if (onImageHover) {
          onImageHover({ name, group, ref: { current: closestObject } });
        }

        // Change cursor to pointer
        document.body.style.cursor = 'pointer';
      }

      // Scale up the hovered image
      const currentScale = hoveredImageRef.current.scale.clone();
      const targetScale = currentScale.clone().normalize().multiplyScalar(2.5);
      hoveredImageRef.current.scale.lerp(
        new THREE.Vector3(targetScale.x, targetScale.y, 1),
        0.1
      );
    } else {
      // No intersection, reset the hovered image
      if (hoveredImageRef.current) {
        const originalScale =
          hoveredImageRef.current.userData.originalScale ||
          new THREE.Vector3(1, 1, 1);
        hoveredImageRef.current.scale.lerp(originalScale, 0.1);
        hoveredImageRef.current = null;
        setHoveredImage(null);

        // Trigger the onOut callback
        if (onImageOut) {
          onImageOut();
        }

        // Reset cursor to default
        document.body.style.cursor = 'auto';
      }
    }

    // Make images face the camera (billboarding)
    groupRef.current.children.forEach((child) => {
      child.lookAt(camera.position);
    });

    // Adjust camera position based on scroll offset
    const offset = scroll.offset;
    const cameraDistance = THREE.MathUtils.lerp(50, 10, offset);
    camera.position.setLength(cameraDistance);
  });

  // Store original scale on mount
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.userData.originalScale = child.scale.clone();
      });
    }
  }, [imagePaths]);

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
            userData={{ name: item.name, group: item.group }} // Store metadata for hover
          />
        );
      })}
    </group>
  );
}

function ScrollHandler({ onScrollIntoSphere, onScrollOutOfSphere }) {
  const scroll = useScroll();

  // Expose scroll functions to the parent component
  useEffect(() => {
    onScrollIntoSphere.current = () => {
      scroll.scroll.current = 1; // Scroll to the end (into the sphere)
    };
    onScrollOutOfSphere.current = () => {
      scroll.scroll.current = 0; // Scroll to the start (out of the sphere)
    };
  }, [scroll, onScrollIntoSphere, onScrollOutOfSphere]);

  return null;
}

export default function FloatingImagesScene() {
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    group: '',
    x: 0,
    y: 0,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs to store scroll functions
  const scrollIntoSphereRef = useRef(() => {});
  const scrollOutOfSphereRef = useRef(() => {});

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const showTooltip = ({ name, group, event }) => {
    setTooltip({
      visible: true,
      name,
      group,
      x: event?.clientX || mousePosition.x,
      y: event?.clientY || mousePosition.y,
    });
  };

  const hideTooltip = () => {
    setTimeout(() => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    }, 100); // Delay hiding the tooltip
  };

  // Scroll into the sphere
  const scrollIntoSphere = () => {
    scrollIntoSphereRef.current();
  };

  // Scroll out of the sphere
  const scrollOutOfSphere = () => {
    scrollOutOfSphereRef.current();
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
            <ScrollHandler
              onScrollIntoSphere={scrollIntoSphereRef}
              onScrollOutOfSphere={scrollOutOfSphereRef}
            />
            <SphericalGallery
              imagePaths={newImagePaths}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
            />
          </ScrollControls>
        </Suspense>
        <ControlsManager autoRotateSpeed={0.5} />
      </Canvas>

      {/* Tooltip */}
      <div
        className={`tooltip ${
          tooltip.visible ? 'visible' : ''
        } hidden md:block`}
        style={{
          top: tooltip.y + 15,
          left: tooltip.x + 15,
        }}
      >
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-divider' />
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      {/* Navigation Buttons */}
      <div className='navigation-buttons flex md:hidden whitespace-nowrap'>
        <button onClick={scrollIntoSphere}>Zoom In</button>
        <button onClick={scrollOutOfSphere}>Zoom Out</button>
      </div>

      {/* Instructions */}
      <div className='instructions whitespace-nowrap hidden'>
        Click and drag to rotate the gallery
      </div>

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
        .navigation-buttons {
          position: fixed;
          bottom: 10px;
          right: 5%;
          gap: 10px;
          z-index: 1000;
        }
        .navigation-buttons button {
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
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
