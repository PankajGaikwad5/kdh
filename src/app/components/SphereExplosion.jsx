// SphereExplosion.jsx - Handles sphere destruction and reassembly
'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useSphereExplosion(sphereRef) {
  const originalPositions = useRef([]);
  const originalRotations = useRef([]);
  const originalScales = useRef([]);
  const explodedPositions = useRef([]);
  const explodedRotations = useRef([]);
  const hasExploded = useRef(false);
  const isStored = useRef(false);

  // Store original positions when sphere loads
  useEffect(() => {
    const storePositions = () => {
      if (
        sphereRef.current &&
        sphereRef.current.children.length > 0 &&
        !isStored.current
      ) {
        originalPositions.current = [];
        originalRotations.current = [];
        originalScales.current = [];

        sphereRef.current.children.forEach((child) => {
          originalPositions.current.push(child.position.clone());
          originalRotations.current.push(child.rotation.clone());
          originalScales.current.push(child.scale.clone());
        });

        isStored.current = true;
      }
    };

    const interval = setInterval(() => {
      if (!isStored.current) {
        storePositions();
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [sphereRef]);

  const explodeSphere = () => {
    if (!sphereRef.current || hasExploded.current) return;
    hasExploded.current = true;

    explodedPositions.current = [];
    explodedRotations.current = [];

    // MASSIVE EXPLOSION - everything blasts away instantly
    sphereRef.current.children.forEach((child, index) => {
      if (child.position) {
        const direction = child.position.clone().normalize();
        const distance = 200 + Math.random() * 150;

        // Calculate exploded position
        const explodedPos = {
          x: direction.x * distance,
          y: direction.y * distance,
          z: direction.z * distance,
        };

        // Calculate exploded rotation
        const explodedRot = {
          x: Math.random() * Math.PI * 8,
          y: Math.random() * Math.PI * 8,
          z: Math.random() * Math.PI * 8,
        };

        // Store exploded positions for reverse animation
        explodedPositions.current.push(explodedPos);
        explodedRotations.current.push(explodedRot);

        // Blast away FAST
        gsap.to(child.position, {
          x: explodedPos.x,
          y: explodedPos.y,
          z: explodedPos.z,
          duration: 2,
          ease: 'power3.out',
        });

        // Violent spinning
        gsap.to(child.rotation, {
          x: explodedRot.x,
          y: explodedRot.y,
          z: explodedRot.z,
          duration: 2,
          ease: 'power2.out',
        });

        // Fade out
        gsap.to(child.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          delay: 0.5,
          ease: 'power2.in',
        });
      }
    });

    // Reassemble after 3 seconds - EXACT REVERSE
    setTimeout(() => {
      reassembleSphere();
    }, 3000);
  };

  const reassembleSphere = () => {
    if (!sphereRef.current) return;

    // REVERSE ANIMATION - exact opposite of explosion
    sphereRef.current.children.forEach((child, index) => {
      if (originalPositions.current[index]) {
        // First, restore scale (fade in) - REVERSE of fade out
        gsap.to(child.scale, {
          x: originalScales.current[index].x,
          y: originalScales.current[index].y,
          z: originalScales.current[index].z,
          duration: 1.5,
          ease: 'power2.out', // Reverse of power2.in
        });

        // Fly back from exploded position to original - REVERSE path
        gsap.to(child.position, {
          x: originalPositions.current[index].x,
          y: originalPositions.current[index].y,
          z: originalPositions.current[index].z,
          duration: 2,
          ease: 'power3.in', // Reverse of power3.out - accelerating back
          delay: 0.5,
        });

        // Reverse the spinning - unwind back to original rotation
        gsap.to(child.rotation, {
          x: originalRotations.current[index].x,
          y: originalRotations.current[index].y,
          z: originalRotations.current[index].z,
          duration: 2,
          ease: 'power2.in', // Reverse of power2.out
          delay: 0.5,
        });
      }
    });

    // Reset explosion flag after reassembly
    setTimeout(() => {
      hasExploded.current = false;
    }, 3000);
  };

  return { explodeSphere };
}
