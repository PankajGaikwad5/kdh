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
import { newImagePaths } from './imagePaths';
import { Suspense } from 'react';
import CustomLoader from './CustomLoader';

function FloatingImage({
  url,
  position,
  baseScale = 3,
  visibleLeft = -80,
  visibleRight = 80,
  fadeZone = 40,
  onHover,
  onOut,
  productId,
  name,
  group,
}) {
  const ref = useRef();
  const texture = useLoader(THREE.TextureLoader, url);
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const router = useRouter();

  // Same opacity function but we'll reverse positioning later
  const computeOpacity = (worldX) => {
    if (worldX > visibleRight + fadeZone) return 0;
    if (worldX > visibleRight) return 1 - (worldX - visibleRight) / fadeZone;
    if (worldX >= visibleLeft) return 1;
    if (worldX >= visibleLeft - fadeZone)
      return (worldX - (visibleLeft - fadeZone)) / fadeZone;
    return 0;
  };

  useFrame(() => {
    if (ref.current) {
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      ref.current.material.opacity = computeOpacity(worldPos.x);
    }
  });

  const handleClick = () => {
    if (productId) {
      router.push(`/productdetails/${productId}`);
    } else {
      router.push('/products');
    }
  };

  const handlePointerOver = () => {
    if (ref.current) {
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      const opacity = computeOpacity(worldPos.x);
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
  spacing = 30,
  depthVariation = 10,
  yVariation = 10,
  baseScale = 3,
  onImageHover,
  onImageOut,
}) {
  const groupRef = useRef();
  const scroll = useScroll();
  const autoScroll = useRef(0);
  const totalWidth = imagePaths.length * spacing;
  const scrollSpeed = 0.0002;

  useFrame((state, delta) => {
    autoScroll.current = (autoScroll.current + scrollSpeed * delta) % 1;
    const time = state.clock.getElapsedTime();
    const combinedOffset = scroll.offset + autoScroll.current;

    // Reverse direction: negative sign makes items move from left to right
    groupRef.current.position.x = -totalWidth * (combinedOffset - 1);

    // Add subtle floating animation
    groupRef.current.children.forEach((child, index) => {
      const floatingAmplitude = 0.3;
      const floatingSpeed = 0.5;
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

        // Position images horizontally with negative X to start from left
        const x = -index * spacing - i * totalWidth;
        // Small variations in Z for subtle depth
        const z = -10 + Math.sin(index * 0.5) * depthVariation;
        // Alternate image positions vertically in a deterministic way
        const y = (index % 2 === 0 ? 1 : -1) * (index % 4) * yVariation * 0.25;

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
  }, [imagePaths, spacing, depthVariation, yVariation, baseScale, totalWidth]);

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
  const duplicates = 0.09;
  const pages = newImagePaths.length * duplicates;
  const [isMobile, setIsMobile] = useState(false);

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
  const spacingVal = isMobile ? 10 : 20;
  const depthVariationVal = isMobile ? 5 : 5;
  const yVariationVal = isMobile ? 30 : 30;
  const baseScaleVal = isMobile ? 15 : 22;

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 50],
          fov: isMobile ? 75 : 65,
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
        <ScrollControls
          pages={pages}
          damping={0.5}
          horizontal={true}
          reversed={false}
        >
          <Suspense fallback={<CustomLoader />}>
            <FloatingImagesGroup
              imagePaths={newImagePaths}
              spacing={spacingVal}
              depthVariation={depthVariationVal}
              yVariation={yVariationVal}
              baseScale={baseScaleVal}
              onImageHover={showTooltip}
              onImageOut={hideTooltip}
            />
          </Suspense>
        </ScrollControls>
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
