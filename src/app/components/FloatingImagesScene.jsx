// components/FloatingImagesScene.js
'use client';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  Image as DreiImage,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation'; // Import the router

function FloatingImage({
  url,
  position,
  baseScale = 3,
  visibleFront = -30,
  visibleBack = 5,
  fadeZone = 100,
}) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, url);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const router = useRouter(); // Initialize the router

  const computeOpacity = (worldZ) => {
    if (worldZ < visibleFront - fadeZone) return 0;
    if (worldZ < visibleFront)
      return (worldZ - (visibleFront - fadeZone)) / fadeZone;
    if (worldZ <= visibleBack) return 1;
    if (worldZ <= visibleBack + fadeZone)
      return 1 - (worldZ - visibleBack) / fadeZone;
    return 0;
  };

  useFrame(() => {
    if (ref.current) {
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      ref.current.material.opacity = computeOpacity(worldPos.z);
    }
  });

  // Handle click event
  const handleClick = () => {
    router.push('/productdetails/67a5eaba4da9b29cd0f10b63'); // Navigate to the product details page
  };

  // Handle pointer over event
  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer'; // Change cursor to pointer
  };

  // Handle pointer out event
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'; // Reset cursor to default
  };

  return (
    <DreiImage
      ref={ref}
      url={url}
      position={position}
      scale={[baseScale * aspect, baseScale, 1]}
      transparent
      material-opacity={0}
      onClick={handleClick} // Add click handler
      onPointerOver={handlePointerOver} // Add pointer over handler
      onPointerOut={handlePointerOut} // Add pointer out handler
    />
  );
}

function FloatingImagesGroup({
  imagePaths,
  spacing = 10,
  amplitudeX = 8,
  amplitudeY = 3,
  baseScale = 3,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const autoScroll = useRef(0);
  const totalDepth = imagePaths.length * spacing;
  const scrollSpeed = 0.005; // in normalized units per second

  // Add a floating effect by animating the Y position over time
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Increase the autoScroll value every frame
    // autoScroll.current += delta * scrollSpeed;
    // Combine the user's scroll offset with the auto scroll
    const combinedOffset = scroll.offset + autoScroll.current;
    // Position the group accordingly (adjust the -1 offset as needed)
    groupRef.current.position.z = totalDepth * (combinedOffset - 1);

    // Apply floating effect to each image
    groupRef.current.children.forEach((child, index) => {
      const floatingAmplitude = 0.5; // Adjust the amplitude of the floating effect
      const floatingSpeed = 1; // Adjust the speed of the floating effect
      const offset = index * 0.1; // Add a slight offset for variation

      // Animate the Y position using a sine wave
      child.position.y +=
        Math.sin(time * floatingSpeed + offset) * floatingAmplitude * delta;
    });
  });

  const images = useMemo(() => {
    const duplicates = 2; // Number of duplicates for seamless looping
    let images = [];
    for (let i = 0; i < duplicates; i++) {
      imagePaths.forEach((url, index) => {
        const z = index * spacing + i * totalDepth;
        const x = amplitudeX * Math.sin(index + i * imagePaths.length);
        const y = amplitudeY * Math.cos(index + i * imagePaths.length);
        images.push({ url, position: [x, y, z], baseScale });
      });
    }
    return images;
  }, [imagePaths, spacing, amplitudeX, amplitudeY, baseScale, totalDepth]);

  return (
    <group ref={groupRef}>
      {images.map((img, index) => (
        <FloatingImage key={index} {...img} />
      ))}
    </group>
  );
}

export default function FloatingImagesScene() {
  const imagePaths = [
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUnYy0rpbYcoeRKumWaHxyTj5q3bfMXB6INAUz',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU6j61uIRfb3HGeOz01MiLoldKrZaXQIxANWuV',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUDREVUe78FYI8sxbtc2ngQN4ZeSPwOKkv5yAj',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUEmod5KYFi7GYsQA2my03DTouek5wnIJXgjpV',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKURnYINB2E1fzw0AFxNe2UEaubVBY53GTv7kqp',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUX8it72vLaynKVcYuZHCDm1IeJRfoT4vBxS8i',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUUEThKlBY1Vx48e2bhPHIZJqsnBOSArl5D3MT',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUnM2ku7bYcoeRKumWaHxyTj5q3bfMXB6INAUz',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUJw4h4udtZQpOq9no3vVs5yPKXR8gEYuikGUw',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUA1rftpJ1oeY2wnF0zQbWX83C4KujdSqt6MUT',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUis2A7futvKDOET5eW3SHhqPAcFjuRb8YMGi7',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU2oARZRaDNvkE7HG39CYgFqmlMw2jVAoxdcnf',
    'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUreGqMKNnDI67jcCaomXhZLsJd91f4YGitMHP',

    // Repeat the array enough times to ensure smooth looping
    ...Array(7)
      .fill([
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUnYy0rpbYcoeRKumWaHxyTj5q3bfMXB6INAUz',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU6j61uIRfb3HGeOz01MiLoldKrZaXQIxANWuV',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUDREVUe78FYI8sxbtc2ngQN4ZeSPwOKkv5yAj',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUEmod5KYFi7GYsQA2my03DTouek5wnIJXgjpV',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKURnYINB2E1fzw0AFxNe2UEaubVBY53GTv7kqp',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUX8it72vLaynKVcYuZHCDm1IeJRfoT4vBxS8i',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUUEThKlBY1Vx48e2bhPHIZJqsnBOSArl5D3MT',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUnM2ku7bYcoeRKumWaHxyTj5q3bfMXB6INAUz',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUJw4h4udtZQpOq9no3vVs5yPKXR8gEYuikGUw',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUA1rftpJ1oeY2wnF0zQbWX83C4KujdSqt6MUT',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUis2A7futvKDOET5eW3SHhqPAcFjuRb8YMGi7',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU2oARZRaDNvkE7HG39CYgFqmlMw2jVAoxdcnf',
        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUreGqMKNnDI67jcCaomXhZLsJd91f4YGitMHP',
      ])
      .flat(),
  ];

  // Set pages to the number of images (or adjust for extra scroll room)
  const pages = imagePaths.length;

  // State for responsive adjustments
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust parameters based on screen size
  const spacingVal = isMobile ? 15 : 12;
  const amplitudeXVal = isMobile ? 12 : 30;
  const amplitudeYVal = isMobile ? 10 : 12;
  const baseScaleVal = isMobile ? 15 : 15;

  return (
    <Canvas
      camera={{
        position: [0, 0, isMobile ? 10 : 5],
        fov: isMobile ? 85 : 75,
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
      <ScrollControls pages={pages} damping={1}>
        <FloatingImagesGroup
          imagePaths={imagePaths}
          spacing={spacingVal}
          amplitudeX={amplitudeXVal}
          amplitudeY={amplitudeYVal}
          baseScale={baseScaleVal}
        />
      </ScrollControls>
    </Canvas>
  );
}
