'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload, useGLTF } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import MaterialOverride from './MaterialOverride';
import { OrbitControls, MapControls } from '@react-three/drei';
import CustomLoader from './CustomLoader';

function FloatingModel({ url, position, id, ...props }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  // Store the base position to use as the starting point for floating.
  const basePosition = useRef(position);

  // Create a random phase offset so that models don’t all oscillate in sync.
  const phaseOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(...position);
    }
  }, [position]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Keep the base y-level and add a small sine oscillation
      modelRef.current.position.y =
        basePosition.current[1] +
        Math.sin(state.clock.elapsedTime + phaseOffset) * 0.2;
      modelRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh
      ref={modelRef}
      {...props}
      onClick={() => (window.location.href = `/productdetails/${id}`)}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <primitive object={scene} />
    </mesh>
  );
}

function CameraControls() {
  const { camera } = useThree();
  const moveSpeed = 5;
  const sensitivity = 0.002;
  // Adjust this value to change how far the camera moves per scroll
  const scrollSpeed = 0.05;

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

  // Set the initial camera lookAt so that it is aimed at the center of the model spread.
  useEffect(() => {
    camera.lookAt(new THREE.Vector3(0, 6, 0));
  }, [camera]);

  // Register keyboard and mouse event listeners.
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

  // Add a wheel event listener for scroll zooming.
  useEffect(() => {
    const handleWheel = (e) => {
      // e.deltaY > 0 means scrolling down (move backward),
      // e.deltaY < 0 means scrolling up (move forward).
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      // Multiply by -e.deltaY so that negative deltaY moves forward
      camera.position.addScaledVector(forward, -e.deltaY * scrollSpeed);
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera, scrollSpeed]);

  // useFrame updates camera movement and rotation on every frame.
  useFrame((_, delta) => {
    // Keyboard movement
    const speed = moveSpeed * delta;
    const direction = new THREE.Vector3();
    const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

    if (keys.current.KeyW || keys.current.ArrowUp) {
      direction.z -= 1;
    }
    if (keys.current.KeyS || keys.current.ArrowDown) {
      direction.z += 1;
    }
    if (keys.current.KeyA || keys.current.ArrowLeft) {
      direction.x -= 1;
    }
    if (keys.current.KeyD || keys.current.ArrowRight) {
      direction.x += 1;
    }

    direction.normalize();

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

      camera.rotation.y -= deltaX * sensitivity;
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

  return null;
}

export default function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const glb = [
    {
      id: '67a5ed3c4da9b29cd0f10bbf',
      model: 'basin',
    },
    {
      id: '67a5ef4c4da9b29cd0f10bf4',
      model: 'bathtub',
    },
    {
      id: '67a5ef664da9b29cd0f10bfb',
      model: 'cchair',
    },
    {
      id: '67a5ecc44da9b29cd0f10ba2',
      model: 'coffeetable',
    },
    {
      id: '67a5ecc44da9b29cd0f10ba2',
      model: 'coffeetable2',
    },
    {
      id: '67a5ecf94da9b29cd0f10bb6',
      model: 'coffeetable2',
    },
    {
      id: '67a5ec684da9b29cd0f10b8e',
      model: 'console1',
    },
    {
      id: '67a5ece24da9b29cd0f10bac',
      model: 'ctable',
    },
    {
      id: '67a5ecf94da9b29cd0f10bb6',
      model: 'ctable2',
    },
    {
      id: '67a5ecf94da9b29cd0f10bb6',
      model: 'ctkarishma',
    },
    {
      id: '67a5ef974da9b29cd0f10c0a',
      model: 'floorlamp',
    },
    {
      id: '67a5ef974da9b29cd0f10c0a',
      model: 'lemonconsole',
    },
    {
      id: '67a5ec084da9b29cd0f10b7e',
      model: 'library',
    },
    {
      id: '67a5ec494da9b29cd0f10b87',
      model: 'partitionscreen',
    },
    {
      id: '67a5eedf4da9b29cd0f10bd0',
      model: 'planter',
    },
    {
      id: '67a5ebf14da9b29cd0f10b77',
      model: 'tablelamp',
    },
    {
      id: '67a5ef304da9b29cd0f10bea',
      model: 'utable',
    },
    {
      id: '67a5ed9e4da9b29cd0f10bc6',
      model: 'vase',
    },
  ];
  const glbs = [
    'basin',
    'bathtub',
    'cchair',
    'coffeetable',
    'coffeetable2',
    'console1',
    'ctable',
    'ctable2',
    'ctkarishma',
    'floorlamp',
    'lemonconsole',
    'library',
    'partitionscreen',
    'planter',
    'tablelamp',
    'utable',
    'vase',
  ];

  const getRandomPosition = () => {
    // Spread the models horizontally and vertically,
    // and keep z relatively near 0 so they're in front of the camera.
    const x = Math.random() * 40 - 20; // -20 to 20
    const y = Math.random() * 10 + 1; // 1 to 11 (average ~6)
    const z = Math.random() * 10 - 5; // -5 to 5
    return [x, y, z];
  };

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      // Set the camera's y to 6 so it's centered with the models.
      camera={{ position: [0, 6, 15], fov: 50 }}
      className='w-full h-full'
    >
      <MaterialOverride mode={'normal'} />
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<CustomLoader />}>
        {/* <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKURaqIhoE1fzw0AFxNe2UEaubVBY53GTv7kqpl'
          scale={5}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        /> */}
        {/* <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUjAoPH1UhR95a1yWpqvPz7meuoUTAG8HEOb2I'
          scale={5}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        /> */}
        <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUSdbsVtSAKnraNxkI5vbez6dT2q8M0osBfR9A'
          scale={2}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        />
        {/* <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU8gQ5gg64oKUn37W6wsTlRmDBFhGrviIjcMxV'
          scale={5}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        /> */}
        {/* <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU0Ti7frhhiHbrpSCkBA8lKn64duFxNeTWLcq5'
          scale={5}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        /> */}
        {/* <FloatingModel
          url='https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUeCK9h6cFPv1kdbg4tT0YfOS529XxhywHpVoU'
          scale={5}
          id={'67a5e7ce4da9b29cd0f10b51'}
          position={getRandomPosition()}
        /> */}
        <FloatingModel
          url='/sbench.glb'
          scale={5}
          id={'67a5fa124da9b29cd0f10c36'}
          position={getRandomPosition()}
        />
        <FloatingModel
          url='/tbg.glb'
          scale={60}
          id={'67a5eb7e4da9b29cd0f10b69'}
          position={getRandomPosition()}
        />
        {glb.map((models, index) => {
          const { model, id } = models;
          return (
            <FloatingModel
              key={index}
              url={`/glb/${model}.glb`}
              scale={5}
              id={id}
              position={getRandomPosition()}
            />
          );
        })}
      </Suspense>
      {/* <CameraControls /> */}
      {isMobile ? <MapControls /> : <CameraControls />}
      {/* <MapControls /> */}
      <color attach='background' args={['black']} />
    </Canvas>
  );
}
