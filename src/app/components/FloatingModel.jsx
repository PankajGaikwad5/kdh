// 'use client';
// import { useRef, useEffect, useMemo } from 'react';
// import { useGLTF } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import MaterialOverride from './MaterialOverride';
// import * as THREE from 'three';

// export default function FloatingModel({ url, position, id, ...props }) {
//   const { scene } = useGLTF(url);
//   const modelRef = useRef();

//   const basePosition = useRef(position);
//   const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);
//   const tempPos = useRef(new THREE.Vector3());

//   // Store the base position to use as the starting point for floating.
//   // const basePosition = useRef(position);

//   // Create a random phase offset so that models don’t all oscillate in sync.
//   // const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

//   // useEffect(() => {
//   //   if (modelRef.current) {
//   //     modelRef.current.position.set(...position);
//   //   }
//   // }, [position]);

//   // useFrame((state, delta) => {
//   //   if (modelRef.current) {
//   //     // Keep the base y-level and add a small sine oscillation
//   //     modelRef.current.position.y =
//   //       basePosition.current[1] +
//   //       Math.sin(state.clock.elapsedTime + phaseOffset) * 0.2;
//   //     modelRef.current.rotation.y += delta * 0.2;
//   //   }
//   // });

//   // return (
//   //   <group>
//   //     <MaterialOverride mode='normal' />
//   //     <mesh
//   //       ref={modelRef}
//   //       {...props}
//   //       onClick={() => (window.location.href = `/productdetails/${id}`)}
//   //       onPointerOver={() => (document.body.style.cursor = 'pointer')}
//   //       onPointerOut={() => (document.body.style.cursor = 'auto')}
//   //     >
//   //       <primitive object={scene} />
//   //     </mesh>
//   //   </group>
//   // );
//   useFrame((state, delta) => {
//     if (modelRef.current) {
//       tempPos.current.set(...basePosition.current);
//       tempPos.current.y +=
//         Math.sin(state.clock.elapsedTime + phaseOffset) * 0.2;
//       modelRef.current.position.copy(tempPos.current);
//       modelRef.current.rotation.y += delta * 0.2;
//     }
//   });

//   return (
//     // <group>
//     //   <MaterialOverride mode='normal' />
//     //   <mesh
//     //     ref={modelRef}
//     //     {...props}
//     //     onClick={() => (window.location.href = `/productdetails/${id}`)}
//     //     onPointerOver={() => (document.body.style.cursor = 'pointer')}
//     //     onPointerOut={() => (document.body.style.cursor = 'auto')}
//     //   >
//     //     <primitive object={scene} />
//     //   </mesh>
//     // </group>
//     <group>
//       <MaterialOverride mode='normal' />
//       {/* Replace <mesh> with <group> to capture clicks on all child geometries */}
//       <group
//         ref={modelRef}
//         {...props}
//         onClick={() => (window.location.href = `/productdetails/${id}`)}
//         onPointerOver={() => (document.body.style.cursor = 'pointer')}
//         onPointerOut={() => (document.body.style.cursor = 'auto')}
//       >
//         <primitive object={scene} />
//       </group>
//     </group>
//   );
// }

'use client';
import { useRef, useMemo, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import MaterialOverride from './MaterialOverride';
import * as THREE from 'three';

export default function FloatingModel({
  url,
  position,
  id,
  scale = [1, 1, 1],
  ...props
}) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();
  const basePosition = useRef(position);
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const tempPos = useRef(new THREE.Vector3());

  // Update the bounding box to account for scaling
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry.computeBoundingBox();
        }
      });
    }
  }, [scale]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      tempPos.current.set(...basePosition.current);
      tempPos.current.y +=
        Math.sin(state.clock.elapsedTime + phaseOffset) * 0.2;
      modelRef.current.position.copy(tempPos.current);
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      <MaterialOverride mode='normal' />
      <group
        ref={modelRef}
        scale={scale} // Apply scaling here
        {...props}
        onClick={() => (window.location.href = `/productdetails/${id}`)}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <primitive object={scene} />
      </group>
    </group>
  );
}
