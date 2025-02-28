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
import { imagePaths, newImagePaths } from './imagePaths';
import { Suspense } from 'react';
import CustomLoader from './CustomLoader';

function FloatingImage({
  url,
  position,
  baseScale = 3,
  visibleFront = -50,
  visibleBack = 5,
  fadeZone = 150,
  onHover, // tooltip callback
  onOut,
  productId,
  name,
  group,
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
    if (productId) {
      router.push(`/productdetails/${productId}`);
    } else {
      // Fallback if no productId is provided
      router.push('/products');
    }
  };

  const handlePointerOver = () => {
    // document.body.style.cursor = 'pointer';
    // if (onHover) onHover('View Product');
    // if (onHover) onHover(`${name}\n${group}`);
    // if (onHover) onHover({ name, group });
    // if (ref.current.material.opacity < 0.5) return;
    // document.body.style.cursor = 'pointer';
    // if (onHover) onHover({ name, group });
    if (ref.current) {
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      const opacity = computeOpacity(worldPos.z);
      // Only show tooltip if the image is nearly fully visible
      if (opacity < 0.7) return;
    }
    document.body.style.cursor = 'pointer';
    if (onHover) onHover({ name, group });
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
      imagePaths.forEach((item, index) => {
        const url = item.path;
        const z = index * spacing + i * totalDepth;
        const x = amplitudeX * Math.sin(index + i * imagePaths.length);
        const y = amplitudeY * Math.cos(index + i * imagePaths.length);
        images.push({
          url,
          position: [x, y, z],
          baseScale,
          productId: item.productId,
          name: item.name,
          group: item.group,
        });
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
  const pages = newImagePaths.length;
  // const duplicates = 1;
  // const pages = newImagePaths.length * duplicates;
  const [isMobile, setIsMobile] = useState(false);

  // Tooltip state: text, visibility, and screen coordinates
  const [tooltip, setTooltip] = useState({
    visible: false,
    name: '',
    group: '',
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

  const showTooltip = ({ name, group }) => {
    setTooltip((prev) => ({ ...prev, visible: true, name, group }));
  };

  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };

  // Adjust parameters based on screen size
  const spacingVal = isMobile ? 7 : 8;
  const amplitudeXVal = isMobile ? 15 : 40;
  const amplitudeYVal = isMobile ? 30 : 30;
  const baseScaleVal = isMobile ? 18 : 25;

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
          <Suspense fallback={<CustomLoader />}>
            <FloatingImagesGroup
              imagePaths={newImagePaths}
              spacing={spacingVal}
              amplitudeX={amplitudeXVal}
              amplitudeY={amplitudeYVal}
              baseScale={baseScaleVal}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
            />
          </Suspense>
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
        <div className='tooltip-name'>{tooltip.name}</div>
        <div className='tooltip-divider' />
        <div className='tooltip-group'>{tooltip.group}</div>
      </div>

      {/* CSS for the curtain-like animation */}
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
          border-radius: 8px;
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
      `}</style>
    </>
  );
}
