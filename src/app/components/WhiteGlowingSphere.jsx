'use client';
import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

export default function WhiteGlowingSphere({ position = [0, 0, 0] }) {
  const sphereRef = useRef();
  const { scene } = useThree();

  // Optionally animate the emissive intensity to simulate a pulsating glow.
  useFrame((state) => {
    if (sphereRef.current) {
      const pulse = 1 + 0.5 * Math.sin(state.clock.elapsedTime * 3);
      sphereRef.current.material.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh
      ref={sphereRef}
      position={position}
      // Disable the global material override for this sphere.
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color='white'
        emissive='white'
        emissiveIntensity={2}
        roughness={0.1}
        metalness={0.5}
      />
    </mesh>
  );
}
