// 'use client';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Preload, useGLTF, Text } from '@react-three/drei';
// import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
// import * as THREE from 'three';
// import MaterialOverride from './MaterialOverride';
// import CustomLoader from './CustomLoader';
// import { glb } from './glb';
// import CameraControls from './CameraControls';
// import FloatingModel from './FloatingModel';
// import LatestProject from './LatestProject';

// export default function Scene() {
//   const [isMobile, setIsMobile] = useState(false);
//   const latestProjectPos = new THREE.Vector3(0, -5, -17);
//   const exclusionRadius = 10;
//   const [tooltip, setTooltip] = useState({
//     visible: false,
//     content: '',
//     position: [0, 0],
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768; // Adjust the breakpoint as needed
//       setIsMobile(mobile);

//       // Redirect to '/products' if on mobile
//       if (mobile) {
//         // alert('redirecting to products page');
//         window.location.href = '/products';
//       }
//     };

//     handleResize(); // Initial check
//     window.addEventListener('resize', handleResize);

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const getRandomPosition = () => {
//     // const radius = 25; // Adjust the radius to control spread distance
//     // const theta = Math.random() * Math.PI * 5; // Random angle around Y-axis
//     // const phi = Math.acos(2 * Math.random() - 1); // Random angle from top to bottom
//     // const distance = Math.cbrt(Math.random()) * radius; // Uniform distribution within sphere

//     // // Convert spherical coordinates to Cartesian
//     // const x = distance * Math.sin(phi) * Math.cos(theta);
//     // const y = distance * Math.cos(phi);
//     // const z = distance * Math.sin(phi) * Math.sin(theta);

//     // return [x, y, z];
//     const radius = 25;
//     let pos = new THREE.Vector3();
//     let attempts = 0;

//     do {
//       const theta = Math.random() * Math.PI * 2;
//       const phi = Math.acos(2 * Math.random() - 1);
//       const distance = Math.cbrt(Math.random()) * radius;

//       pos.set(
//         distance * Math.sin(phi) * Math.cos(theta),
//         distance * Math.cos(phi),
//         distance * Math.sin(phi) * Math.sin(theta)
//       );

//       attempts++;

//       if (attempts > 10) break;
//     } while (pos.distanceTo(latestProjectPos) < exclusionRadius);

//     return [pos.x, pos.y, pos.z];
//   };

//   return (
//     <>
//       <Canvas
//         gl={{ antialias: true, powerPreference: 'high-performance' }}
//         // Set the camera's y to 6 so it's centered with the models.
//         camera={{ position: [0, 0, 0], fov: 75 }}
//         className='w-full h-full z-0'
//       >
//         {/* <MaterialOverride mode={'normal'} /> */}
//         <ambientLight intensity={0.8} />
//         <pointLight position={[10, 10, 10]} />
//         <Suspense fallback={<CustomLoader />}>
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Console',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/mconsole.glb'
//             scale={5}
//             id={'67b59041e03cc2c55c624a4b'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: ' Monster Bench',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/mb4.glb'
//             scale={5}
//             id={'67b590b8e03cc2c55c624a5b'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Dining Chair',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/draco/dchair.glb'
//             scale={8}
//             id={'67b59060e03cc2c55c624a4e'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Dining Kids Chair',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/kchair.glb'
//             scale={0.1}
//             id={'67b5e69de03cc2c55c62bd22'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Planters',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/mplanters.glb'
//             scale={5}
//             id={'67b59111e03cc2c55c624a64'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Chandelier',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/mchandelier2.glb'
//             scale={5}
//             id={'67b590e8e03cc2c55c624a61'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Library',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/mlibrary3.glb'
//             scale={1}
//             id={'67b590a6e03cc2c55c624a58'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Monster Dining Table',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/assets/mdining.glb'
//             scale={5}
//             id={'67b59097e03cc2c55c624a54'}
//             position={getRandomPosition()}
//           />
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
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({ visible: true, content: 'Yoda', position: [x, y] })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/mtotem.glb'
//             scale={5}
//             id={'67a5eb9f4da9b29cd0f10b71'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Samaveta Bench',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/sbench.glb'
//             scale={5}
//             id={'67a5fa124da9b29cd0f10c36'}
//             position={getRandomPosition()}
//           />
//           <FloatingModel
//             onHover={(id, [x, y]) =>
//               setTooltip({
//                 visible: true,
//                 content: 'Gattoo X Top Brewer',
//                 position: [x, y],
//               })
//             }
//             onUnhover={() =>
//               setTooltip({ visible: false, content: '', position: [0, 0] })
//             }
//             url='/tbg.glb'
//             scale={60}
//             id={'67a5eb7e4da9b29cd0f10b69'}
//             position={getRandomPosition()}
//           />
//           {glb.map((models, index) => {
//             const { model, id, name } = models;
//             return (
//               <FloatingModel
//                 onHover={(name, [x, y]) => {
//                   setTooltip({
//                     visible: true,
//                     content: models.name,
//                     position: [x, y],
//                   });
//                 }}
//                 onUnhover={() =>
//                   setTooltip({ visible: false, content: '', position: [0, 0] })
//                 }
//                 key={index}
//                 url={`/glb/${model}.glb`}
//                 scale={5}
//                 id={id}
//                 position={getRandomPosition()}
//               />
//             );
//           })}
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
import { useMemo, useState, useEffect, Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import FloatingModel from './FloatingModel';
import LatestProject from './LatestProject';
import CustomLoader from './CustomLoader';
import CameraControls from './CameraControls';
import { glb } from './glb';

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

      // If the computed point is too close to the fixed model, push it out to the boundary of the exclusion sphere.
      if (pos.distanceTo(exclusionCenter) < exclusionRadius) {
        const direction = new THREE.Vector3()
          .subVectors(pos, exclusionCenter)
          .normalize();
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
  const latestProjectPos = new THREE.Vector3(0, -5, -17);
  const exclusionRadius = 30;

  // Define your static floating models (excluding LatestProject)
  const staticModels = [
    {
      url: '/mconsole.glb',
      scale: 20,
      id: '67b59041e03cc2c55c624a4b',
      tooltip: 'Monster Console',
    },
    {
      url: '/mconsole2.glb',
      scale: 20,
      id: '67a5eaba4da9b29cd0f10b63',
      tooltip: 'Monster Console',
    },
    {
      url: '/mbathtub2.glb',
      scale: 5,
      id: '67a5e9914da9b29cd0f10b58',
      tooltip: 'Monster Bathtub',
    },
    {
      url: '/mbasin.glb',
      scale: 25,
      id: '67a5e7ce4da9b29cd0f10b51',
      tooltip: 'Monster Basin',
    },
    {
      url: '/assets/mb4.glb',
      scale: 5,
      id: '67b590b8e03cc2c55c624a5b',
      tooltip: 'Monster Bench',
    },
    {
      url: '/draco/dchair.glb',
      scale: 15,
      id: '67b59060e03cc2c55c624a4e',
      tooltip: 'Monster Dining Chair',
    },
    {
      url: '/assets/kchair.glb',
      scale: 0.3,
      id: '67b5e69de03cc2c55c62bd22',
      tooltip: 'Monster Dining Kids Chair',
    },
    {
      url: '/assets/mplanters.glb',
      scale: 5,
      id: '67b59111e03cc2c55c624a64',
      tooltip: 'Monster Planters',
    },
    {
      url: '/assets/mchandelier2.glb',
      scale: 5,
      id: '67b590e8e03cc2c55c624a61',
      tooltip: 'Monster Chandelier',
    },
    {
      url: '/assets/mlibrary3.glb',
      scale: 1,
      id: '67b590a6e03cc2c55c624a58',
      tooltip: 'Monster Library',
    },
    {
      url: '/assets/mdining.glb',
      scale: 5,
      id: '67b59097e03cc2c55c624a54',
      tooltip: 'Monster Dining Table',
    },
    {
      url: '/mtotem.glb',
      scale: 5,
      id: '67a5eb9f4da9b29cd0f10b71',
      tooltip: 'Yoda',
    },
    {
      url: '/sbench.glb',
      scale: 5,
      id: '67a5fa124da9b29cd0f10c36',
      tooltip: 'Samaveta Bench',
    },
    {
      url: '/tbg.glb',
      scale: 60,
      id: '67a5eb7e4da9b29cd0f10b69',
      tooltip: 'Gattoo X Top Brewer',
    },
  ];

  // Models from your glb array
  const dynamicModels = glb; // assume this is an array of model objects

  // Total count for which we need positions:
  const totalModelsCount = staticModels.length + dynamicModels.length;

  // Precompute positions with an even distribution
  const positions = useEvenlyDistributedPositions(
    totalModelsCount,
    30,
    latestProjectPos,
    exclusionRadius
  );

  // A simple tooltip state (unchanged from your code)
  const [tooltip, setTooltip] = useState({
    visible: false,
    content: '',
    position: [0, 0],
  });

  // If on mobile, redirect (as per your original useEffect)
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      if (mobile) window.location.href = '/products';
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
          {
            // Render static models with precomputed positions
            staticModels.map((model, index) => (
              <FloatingModel
                key={model.id}
                url={model.url}
                scale={model.scale}
                id={model.id}
                position={positions[index]}
                onHover={(id, [x, y]) =>
                  setTooltip({
                    visible: true,
                    content: model.tooltip,
                    position: [x, y],
                  })
                }
                onUnhover={() =>
                  setTooltip({ visible: false, content: '', position: [0, 0] })
                }
              />
            ))
          }
          {
            // Render dynamic models from glb using remaining positions
            dynamicModels.map((model, index) => {
              // Offset the index so the positions array matches up
              const posIndex = staticModels.length + index;
              return (
                <FloatingModel
                  key={model.id}
                  url={`/glb/${model.model}.glb`}
                  scale={5}
                  id={model.id}
                  position={positions[posIndex]}
                  onHover={(id, [x, y]) =>
                    setTooltip({
                      visible: true,
                      content: model.name,
                      position: [x, y],
                    })
                  }
                  onUnhover={() =>
                    setTooltip({
                      visible: false,
                      content: '',
                      position: [0, 0],
                    })
                  }
                />
              );
            })
          }
          {/*
            Render your fixed LatestProject separately.
            Its position remains unchanged.
          */}
          <LatestProject
            onHover={(id, [x, y]) =>
              setTooltip({
                visible: true,
                content: 'Gattoo Chair',
                position: [x, y],
              })
            }
            onUnhover={() =>
              setTooltip({ visible: false, content: '', position: [0, 0] })
            }
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
