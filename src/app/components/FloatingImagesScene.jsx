'use client';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  Image as DreiImage,
} from '@react-three/drei';
import * as THREE from 'three';
import { useRouter } from 'next/navigation';
import { imagePaths } from './imagePaths';

function FloatingImage({
  url,
  position,
  baseScale = 3,
  visibleFront = -50,
  visibleBack = 5,
  fadeZone = 150,
  onHover, // tooltip callback
  onOut,
}) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, url);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const router = useRouter();

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

  const handleClick = () => {
    router.push('/products');
  };

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    if (onHover) onHover('View Product');
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    if (onOut) onOut();
  };

  return (
    <DreiImage
      ref={ref}
      url={url}
      position={position}
      scale={[baseScale * aspect, baseScale, 1]}
      transparent
      material-opacity={0}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}

function FloatingImagesGroup({
  imagePaths,
  spacing = 10,
  amplitudeX = 8,
  amplitudeY = 3,
  baseScale = 3,
  onImageHover, // forwarded tooltip callback
  onImageOut,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const autoScroll = useRef(0);
  const totalDepth = imagePaths.length * spacing;

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const combinedOffset = scroll.offset + autoScroll.current;
    groupRef.current.position.z = totalDepth * (combinedOffset - 1);

    groupRef.current.children.forEach((child, index) => {
      const floatingAmplitude = 0.5;
      const floatingSpeed = 1;
      const offset = index * 0.1;
      child.position.y +=
        Math.sin(time * floatingSpeed + offset) * floatingAmplitude * delta;
    });
  });

  const images = useMemo(() => {
    const duplicates = 2;
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
        <FloatingImage
          key={index}
          {...img}
          onHover={onImageHover}
          onOut={onImageOut}
        />
      ))}
    </group>
  );
}

export default function FloatingImagesScene() {
  const pages = imagePaths.length;
  const [isMobile, setIsMobile] = useState(false);

  // Tooltip state: text, visibility, and screen coordinates
  const [tooltip, setTooltip] = useState({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update tooltip position as the mouse moves
  useEffect(() => {
    const handleMouseMove = (e) => {
      setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showTooltip = (text) => {
    setTooltip((prev) => ({ ...prev, visible: true, text }));
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Adjust parameters based on screen size
  const spacingVal = isMobile ? 15 : 8;
  const amplitudeXVal = isMobile ? 12 : 30;
  const amplitudeYVal = isMobile ? 10 : 20;
  const baseScaleVal = isMobile ? 15 : 22;

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 10 : 60],
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
            onImageHover={showTooltip}
            onImageOut={hideTooltip}
          />
        </ScrollControls>
      </Canvas>

      {/* Tooltip element with a "curtain opening" animation */}
      <div
        className={`tooltip ${tooltip.visible ? 'visible' : ''}`}
        style={{
          top: tooltip.y + 15,
          left: tooltip.x + 15,
        }}
      >
        {tooltip.text}
      </div>

      {/* CSS for the curtain-like animation */}
      <style jsx>{`
        .tooltip {
          position: fixed;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 5px 10px;
          border-radius: 4px;
          pointer-events: none;
          white-space: nowrap;
          z-index: 1000;
          opacity: 0;
          clip-path: inset(0 50% 0 50%);
        }
        .tooltip.visible {
          opacity: 1;
          animation: curtainOpen 0.8s ease-out forwards;
        }
        @keyframes curtainOpen {
          from {
            clip-path: inset(0 50% 0 50%);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
      `}</style>
    </>
  );
}
