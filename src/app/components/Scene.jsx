'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import { Preload, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// function FloatingModel({ url, position, ...props }) {
//   const { scene } = useGLTF(url);
//   const modelRef = useRef();

//   useEffect(() => {
//     if (modelRef.current) {
//       modelRef.current.position.set(...position); // Set initial position
//     }
//   }, [position]);

//   useFrame((state, delta) => {
//     // modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + 2;
//     modelRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2 + 2;
//     modelRef.current.rotation.y += delta * 0.2;
//   });

//   return (
//     <mesh
//       ref={modelRef}
//       {...props}
//       // onClick={() => window.open('https://example.com', '_blank')}
//       onClick={() => (window.location.href = '/productdetails')}
//       onPointerOver={() => (document.body.style.cursor = 'pointer')}
//       onPointerOut={() => (document.body.style.cursor = 'auto')}
//     >
//       <primitive object={scene} />
//     </mesh>
//   );
// }

function FloatingVideo({ url, position = [0, 0, 0], scale = 3 }) {
  const meshRef = useRef();
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    // Create a video element
    const video = document.createElement('video');
    video.src = url;
    video.loop = true;
    video.muted = true; // Ensure autoplay works in many browsers
    video.play();

    // Create a VideoTexture from the video element
    const texture = new THREE.VideoTexture(video);
    texture.flipY = true; // Adjust based on your video's orientation
    setVideoTexture(texture);
  }, [url]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  if (!videoTexture) return null;
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => (window.location.href = '/productdetails')}
    >
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial map={videoTexture} transparent={true} />
    </mesh>
  );
  video.addEventListener('ended', () => {
    console.log('Video ended');
    // If needed, you can restart it manually:
    video.currentTime = 0;
    video.play();
  });
}

// function CameraControls() {
//   const { camera } = useThree();
//   const keys = useRef({
//     ArrowUp: false,
//     ArrowDown: false,
//     ArrowLeft: false,
//     ArrowRight: false,
//   });

//   useEffect(() => {
//     const handleKeyDown = (e) => (keys.current[e.key] = true);
//     const handleKeyUp = (e) => (keys.current[e.key] = false);

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, []);

//   useFrame((_, delta) => {
//     const moveSpeed = 5 * delta;
//     const rotateSpeed = 2 * delta;
//     const direction = new THREE.Vector3();

//     camera.getWorldDirection(direction);

//     if (keys.current.ArrowUp)
//       camera.position.addScaledVector(direction, moveSpeed);
//     if (keys.current.ArrowDown)
//       camera.position.addScaledVector(direction, -moveSpeed);
//     if (keys.current.ArrowLeft) camera.rotation.y += rotateSpeed;
//     if (keys.current.ArrowRight) camera.rotation.y -= rotateSpeed;
//   });

//   return <OrbitControls enableZoom={false} enablePan={false} />;
// }
function CameraControls() {
  const { camera } = useThree();
  const moveSpeed = 5;
  const sensitivity = 0.002;
  const keys = useRef({
    KeyW: false,
    KeyS: false,
    KeyA: false,
    KeyD: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  });

  const mouse = useRef({
    x: 0,
    y: 0,
    isDown: false,
    prevX: 0,
    prevY: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.code] = true);
    const handleKeyUp = (e) => (keys.current[e.code] = false);

    const handleMouseDown = (e) => {
      if (e.button === 0) {
        mouse.current.isDown = true;
        mouse.current.prevX = e.clientX;
        mouse.current.prevY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      mouse.current.isDown = false;
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    // Keyboard movement
    const speed = moveSpeed * delta;
    const direction = new THREE.Vector3();
    const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

    // Get forward/backward direction
    if (keys.current.KeyW || keys.current.ArrowUp) {
      direction.z -= 1;
    }
    if (keys.current.KeyS || keys.current.ArrowDown) {
      direction.z += 1;
    }

    // Get left/right direction
    if (keys.current.KeyA || keys.current.ArrowLeft) {
      direction.x -= 1;
    }
    if (keys.current.KeyD || keys.current.ArrowRight) {
      direction.x += 1;
    }

    direction.normalize();

    // Apply movement relative to camera orientation
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const cameraRotation = new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(
        camera.position,
        camera.position.clone().add(cameraDirection),
        new THREE.Vector3(0, 1, 0)
      )
    );

    rotation.set(cameraRotation.x, cameraRotation.y, 0);

    direction.applyEuler(rotation);
    camera.position.addScaledVector(direction, speed);

    // Mouse rotation
    if (mouse.current.isDown) {
      const deltaX = mouse.current.x - mouse.current.prevX;
      const deltaY = mouse.current.y - mouse.current.prevY;

      // Horizontal rotation
      camera.rotation.y -= deltaX * sensitivity;

      // Vertical rotation (limit to prevent flipping)
      const newPitch = camera.rotation.x - deltaY * sensitivity;
      camera.rotation.x = THREE.MathUtils.clamp(
        newPitch,
        -Math.PI / 2.5,
        Math.PI / 2.5
      );

      mouse.current.prevX = mouse.current.x;
      mouse.current.prevY = mouse.current.y;
    }
  });

  return null; // Remove OrbitControls
}

export default function Scene() {
  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 5, 10], fov: 50 }}
      className='w-full h-full'
    >
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        {/* <FloatingModel url='/shiba/scene.gltf' scale={0.5} /> */}
        {/* {[...Array(16)].map((_, i) => ( */}
        {/* key={i} */}
        {/* <FloatingModel
          url='/shiba/scene.gltf'
          scale={1}
          position={[Math.random() * 10 - 5, 2, Math.random() * 10 - 5]} // Randomize positions
        />
        <FloatingModel
          url='/chair_2.glb'
          scale={1}
          position={[Math.random() * 10 - 5, 2, Math.random() * 10 - 5]} // Randomize positions
        /> */}
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        <FloatingVideo
          url='/assets/chair.webm'
          position={[0, 2, 0]}
          scale={3}
        />
        {/* <FloatingModel
          url='/mb4/m.gltf'
          scale={1}
          position={[Math.random() * 10 - 5, 2, Math.random() * 10 - 5]} // Randomize positions
        /> */}
        {/* ))} */}
        <Preload all />
      </Suspense>
      {/* <PointerLockControls /> */}
      <CameraControls />
      <color attach='background' args={['white']} />
    </Canvas>
  );
}
