'use client';
import { useRef, useState, useMemo } from 'react';
import { Html, Sparkles, useTexture, Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import FloatingModel from './FloatingModel';

export default function LatestProject() {
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);
  const glowColor = hovered ? '#ff00ff' : '#00ffff';

  // Add a pulsing animation
  useFrame((state) => {
    if (modelRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      modelRef.current.scale.set(scale, scale, scale);
    }
  });

  // Add a glowing texture for the model
  const glowTexture = useTexture('/glow.png'); // Replace with your glow texture
  glowTexture.wrapS = glowTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* Floating Model with Special Props */}
      <FloatingModel
        ref={modelRef}
        url='/assets/gchair2.glb' // Replace with your latest project GLB
        position={[0, -5, -17]} // Center position
        scale={10}
        id='67b590d0e03cc2c55c624a5e' // Unique ID for the latest project
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        // onClick={() =>
        //   (window.location.href = '/productdetails/67b58dfde03cc2c55c624373')
        // }
      >
        {/* Add a glowing effect to the model */}
        <meshStandardMaterial
          attach='material'
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={hovered ? 2 : 1}
          map={glowTexture}
          transparent
          opacity={0.8}
        />
      </FloatingModel>

      {/* Add Sparkles for a magical effect */}
      <Sparkles
        count={100}
        scale={15}
        size={3}
        speed={0.2}
        color={glowColor}
        position={[0, 0, 0]}
      />

      {/* Add a glowing ring around the model */}
      <mesh position={[0, -6, -17]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[12, 14, 64]} />
        <meshStandardMaterial
          color={glowColor}
          emissive={glowColor}
          emissiveIntensity={1}
          transparent
          opacity={0.1}
        />
      </mesh>

      <Html
        distanceFactor={10}
        position={[0, 2, -17]}
        onClick={() =>
          (window.location.href = '/productdetails/67b58dfde03cc2c55c624373')
        }
      >
        <div
          style={{
            color: glowColor,
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
          }}
        >
          ✨ Latest Release!
        </div>
      </Html>
    </>
  );
}
