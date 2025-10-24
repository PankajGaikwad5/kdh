'use client';
import React, { useState, useEffect } from 'react';
import '../styles/planet.scss';
import { Html, useProgress } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CustomLoader() {
  const { progress } = useProgress();
  const [showLoader, setShowLoader] = useState(true);
  const GIF_DURATION = 2500;

  const loaderPosition = new THREE.Vector3(0, 6, 0);

  function getColor(index) {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    return colors[index % colors.length];
  }

  useEffect(() => {
    // Only hide loader when BOTH conditions are met
    if (progress === 100) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, GIF_DURATION);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!showLoader) return null;

  return (
    <Html className='z-10'>
      <div className='content z-10'>
        <div className='relative z-10 font-semibold text-center top-1/2 -mt-28 lg:-mt-8 -translate-y-1/2 text-3xl sm:text-8xl text-white tracking-widest flex flex-col justify-center items-center mb-0'>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={`/optimizedsign.gif`}
              className={`transition-opacity duration-700`}
              alt='Animated signature representing Karan Desai Architecture'
              style={{
                display: 'block',
                width: '320px',
                height: 'auto',
                filter: progress < 100 ? 'grayscale(0.2)' : 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${100 - progress}%`,
                height: '100%',
                background: 'transparent',
                transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 12, color: 'white', pointerEvents: 'none' }}>
          {Math.round(progress)}%
        </div>
      </div>
    </Html>
  );
}
