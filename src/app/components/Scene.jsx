// 'use client';
// import { useMemo, useState, useEffect, Suspense, useRef } from 'react';
// import * as THREE from 'three';
// import { Canvas } from '@react-three/fiber';
// import FloatingModel from './FloatingModel';
// import LatestProject from './LatestProject';
// import CustomLoader from './CustomLoader';
// import CameraControls from './CameraControls';
// import { glb } from './glb';
// import { staticModels } from './staticmodels';

// // Custom hook to generate evenly distributed positions
// function useEvenlyDistributedPositions(
//   count,
//   radius,
//   exclusionCenter,
//   exclusionRadius
// ) {
//   return useMemo(() => {
//     const positions = [];
//     const offset = 2 / count;
//     const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle
//     for (let i = 0; i < count; i++) {
//       // Fibonacci sphere algorithm: evenly distributes points on a sphere surface
//       let y = i * offset - 1 + offset / 2;
//       let r = Math.sqrt(1 - y * y);
//       let phi = i * increment;
//       let x = Math.cos(phi) * r;
//       let z = Math.sin(phi) * r;
//       let pos = new THREE.Vector3(x * radius, y * radius, z * radius);

//       // If the computed point is too close to the fixed model, push it out to the boundary of the exclusion sphere.
//       if (pos.distanceTo(exclusionCenter) < exclusionRadius) {
//         const direction = new THREE.Vector3()
//           .subVectors(pos, exclusionCenter)
//           .normalize();
//         pos = exclusionCenter
//           .clone()
//           .add(direction.multiplyScalar(exclusionRadius));
//       }
//       positions.push([pos.x, pos.y, pos.z]);
//     }
//     return positions;
//   }, [count, radius, exclusionCenter, exclusionRadius]);
// }

// export default function Scene() {
//   const latestProjectPos = new THREE.Vector3(0, -5, -17);
//   const exclusionRadius = 20;

//   // Define your static floating models (excluding LatestProject)

//   // Models from your glb array
//   const dynamicModels = glb; // assume this is an array of model objects

//   // Total count for which we need positions:
//   const totalModelsCount = staticModels.length + dynamicModels.length;

//   // Precompute positions with an even distribution
//   const positions = useEvenlyDistributedPositions(
//     totalModelsCount,
//     35,
//     latestProjectPos,
//     exclusionRadius
//   );

//   // A simple tooltip state (unchanged from your code)
//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     content: '',
//     position: [0, 0],
//   });

//   // If on mobile, redirect (as per your original useEffect)
//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       if (mobile) window.location.href = '/products';
//     };
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <>
//       <Canvas
//         gl={{ antialias: true, powerPreference: 'high-performance' }}
//         camera={{ position: [0, 0, 17], fov: 75 }}
//         className='w-full h-full z-0'
//       >
//         <ambientLight intensity={0.8} />
//         <pointLight position={[10, 10, 10]} />
//         <Suspense fallback={<CustomLoader />}>
//           {
//             // Render static models with precomputed positions
//             staticModels.map((model, index) => (
//               <FloatingModel
//                 key={model.id}
//                 url={model.url}
//                 scale={model.scale}
//                 id={model.id}
//                 position={positions[index]}
//                 onHover={(id, [x, y]) =>
//                   setTooltip({
//                     visible: true,
//                     content: model.tooltip,
//                     position: [x, y],
//                   })
//                 }
//                 onUnhover={() =>
//                   setTooltip({ visible: false, content: '', position: [0, 0] })
//                 }
//               />
//             ))
//           }
//           {
//             // Render dynamic models from glb using remaining positions
//             dynamicModels.map((model, index) => {
//               // Offset the index so the positions array matches up
//               const posIndex = staticModels.length + index;
//               return (
//                 <FloatingModel
//                   key={model.id}
//                   url={`/glb/${model.model}.glb`}
//                   scale={5}
//                   id={model.id}
//                   position={positions[posIndex]}
//                   onHover={(id, [x, y]) =>
//                     setTooltip({
//                       visible: true,
//                       content: model.name,
//                       position: [x, y],
//                     })
//                   }
//                   onUnhover={() =>
//                     setTooltip({
//                       visible: false,
//                       content: '',
//                       position: [0, 0],
//                     })
//                   }
//                 />
//               );
//             })
//           }
//           {/*
//             Render your fixed LatestProject separately.
//             Its position remains unchanged.
//           */}
//           <LatestProject
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Gattoo Chair',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//           />
//         </Suspense>
//         <CameraControls />
//         <color attach='background' args={['black']} />
//       </Canvas>
//       {tooltip.visible && (
//         <div
//           style={{
//             position: 'fixed',
//             left: tooltip.position[0] + 15,
//             top: tooltip.position[1] - 15,
//             pointerEvents: 'none',
//             color: 'white',
//             padding: '8px',
//             borderRadius: '4px',
//             whiteSpace: 'nowrap',
//           }}
//         >
//           {tooltip.content}
//         </div>
//       )}
//     </>
//   );
// }

'use client';
import { useMemo, useState, useEffect, Suspense, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import FloatingModel from './FloatingModel';
import LatestProject from './LatestProject';
import CustomLoader from './CustomLoader';
import CameraControls from './CameraControls';
import { glb } from './glb';
import { staticModels } from './staticmodels';

// Since the LatestProject position is constant, we define it outside the component.
const latestProjectPos = new THREE.Vector3(0, -5, -17);

// Custom hook to generate evenly distributed positions
function useEvenlyDistributedPositions(
  count,
  radius,
  exclusionCenter,
  exclusionRadius
) {
  return useMemo(() => {
    const positions = [];
    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < count; i++) {
      // Fibonacci sphere algorithm: evenly distributes points on a sphere surface
      let y = i * offset - 1 + offset / 2;
      let r = Math.sqrt(1 - y * y);
      let phi = i * increment;
      let x = Math.cos(phi) * r;
      let z = Math.sin(phi) * r;
      let pos = new THREE.Vector3(x * radius, y * radius, z * radius);

      // If the computed point is too close to the fixed model, push it out to the exclusion boundary.
      if (pos.distanceTo(exclusionCenter) < exclusionRadius) {
        const direction = pos.clone().sub(exclusionCenter).normalize();
        pos = exclusionCenter
          .clone()
          .add(direction.multiplyScalar(exclusionRadius));
      }
      positions.push([pos.x, pos.y, pos.z]);
    }
    return positions;
  }, [count, radius, exclusionCenter, exclusionRadius]);
}

export default function Scene() {
  const dynamicModels = glb;
  const totalModelsCount = staticModels.length + dynamicModels.length;

  // Precompute positions with an even distribution.
  const positions = useEvenlyDistributedPositions(
    totalModelsCount,
    35,
    latestProjectPos,
    20
  );

  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    position: [0, 0],
  });

  // Mobile redirect on resize.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        window.location.href = '/products';
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized tooltip handlers.
  const handleHover = useCallback((content, pos) => {
    setTooltip({ visible: true, content, position: pos });
  }, []);

  const handleUnhover = useCallback(() => {
    setTooltip({ visible: false, content: '', position: [0, 0] });
  }, []);

  return (
    <>
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 17], fov: 75 }}
        className='w-full h-full z-0'
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<CustomLoader />}>
          {staticModels.map((model, index) => (
            <FloatingModel
              key={model.id}
              url={model.url}
              scale={model.scale}
              id={model.id}
              position={positions[index]}
              onHover={(id, pos) => handleHover(model.tooltip, pos)}
              onUnhover={handleUnhover}
            />
          ))}
          {dynamicModels.map((model, index) => {
            const posIndex = staticModels.length + index;
            return (
              <FloatingModel
                key={model.id}
                url={`/glb/${model.model}.glb`}
                scale={5}
                id={model.id}
                position={positions[posIndex]}
                onHover={(id, pos) => handleHover(model.name, pos)}
                onUnhover={handleUnhover}
              />
            );
          })}
          {/* Render the fixed LatestProject separately. */}
          <LatestProject
            onHover={(id, pos) => handleHover('Gattoo Chair', pos)}
            onUnhover={handleUnhover}
          />
        </Suspense>

        <CameraControls />
        <color attach='background' args={['black']} />
      </Canvas>
      {tooltip.visible && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.position[0] + 15,
            top: tooltip.position[1] - 15,
            pointerEvents: 'none',
            color: 'white',
            padding: '8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </>
  );
}
