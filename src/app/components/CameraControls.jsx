'use client';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useSpring } from '@react-spring/three';

export default function CameraControls() {
  const { camera } = useThree();
  const moveSpeed = 10;
  const sensitivity = 0.002;
  const scrollSpeed = 0.05;
  const boundaryRadius = 30;
  const clampVector = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

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

  // Camera starting position (above)
  const [startAnimation, setStartAnimation] = useState(false);

  // Spring animation for smooth camera drop
  const { y } = useSpring({
    y: startAnimation ? 0 : 5,
    config: { mass: 1, tension: 120, friction: 20 },
  });

  useEffect(() => {
    setStartAnimation(true);
  }, []);

  // Clamp camera position
  // const clampCameraPosition = (position) => {
  //   const vector = new THREE.Vector3(position.x, position.y, position.z);
  //   if (vector.length() > boundaryRadius) {
  //     vector.normalize().multiplyScalar(boundaryRadius);
  //   }
  //   camera.position.copy(vector);
  // };

  const clampCameraPosition = (position) => {
    clampVector.current.copy(position);
    if (clampVector.current.length() > boundaryRadius) {
      clampVector.current.normalize().multiplyScalar(boundaryRadius);
    }
    camera.position.copy(clampVector.current);
  };

  // Use `useFrame` to smoothly update the camera position
  // useFrame((_, delta) => {
  //   const speed = moveSpeed * delta;
  //   const direction = new THREE.Vector3();
  //   const rotation = new THREE.Euler(0, 0, 0, 'YXZ');

  //   // Move camera down smoothly based on animation
  //   camera.position.y = y.get(); // This ensures smooth transition from y=5 to y=0

  //   if (keys.current.KeyW || keys.current.ArrowUp) {
  //     direction.z -= 1;
  //   }
  //   if (keys.current.KeyS || keys.current.ArrowDown) {
  //     direction.z += 1;
  //   }
  //   if (keys.current.KeyA || keys.current.ArrowLeft) {
  //     direction.x -= 1;
  //   }
  //   if (keys.current.KeyD || keys.current.ArrowRight) {
  //     direction.x += 1;
  //   }

  //   direction.normalize();

  //   const cameraDirection = new THREE.Vector3();
  //   camera.getWorldDirection(cameraDirection);
  //   const cameraRotation = new THREE.Euler().setFromRotationMatrix(
  //     new THREE.Matrix4().lookAt(
  //       camera.position,
  //       camera.position.clone().add(cameraDirection),
  //       new THREE.Vector3(0, 1, 0)
  //     )
  //   );

  //   rotation.set(cameraRotation.x, cameraRotation.y, 0);
  //   direction.applyEuler(rotation);
  //   camera.position.addScaledVector(direction, speed);

  //   // Clamp camera position after movement
  //   clampCameraPosition(camera.position);

  //   // Mouse rotation
  //   if (mouse.current.isDown) {
  //     const deltaX = mouse.current.x - mouse.current.prevX;
  //     const deltaY = mouse.current.y - mouse.current.prevY;

  //     camera.rotation.y -= deltaX * sensitivity;
  //     const newPitch = camera.rotation.x - deltaY * sensitivity;
  //     camera.rotation.x = THREE.MathUtils.clamp(
  //       newPitch,
  //       -Math.PI / 2.5,
  //       Math.PI / 2.5
  //     );

  //     mouse.current.prevX = mouse.current.x;
  //     mouse.current.prevY = mouse.current.y;
  //   }
  // });

  useFrame((_, delta) => {
    const speed = moveSpeed * delta;
    const direction = new THREE.Vector3();

    // Add input directions based on keys
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

    // Normalize if needed
    if (direction.length() > 0) {
      direction.normalize();
    }

    // Apply the camera's quaternion to move in its local direction
    direction.applyQuaternion(camera.quaternion);
    camera.position.addScaledVector(direction, speed);

    // Optionally, if you want to constrain to horizontal movement:
    // direction.y = 0; direction.normalize(); // before applying quaternion

    // Clamp camera position after movement
    clampCameraPosition(camera.position);

    // Mouse rotation handling remains unchanged
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

  useEffect(() => {
    camera.rotation.order = 'YXZ';
    // const handleWheel = (e) => {
    //   e.preventDefault();
    //   const forward = new THREE.Vector3();
    //   camera.getWorldDirection(forward);
    //   camera.position.addScaledVector(forward, -e.deltaY * scrollSpeed);

    //   const right = new THREE.Vector3();
    //   right.crossVectors(forward, camera.up).normalize();
    //   camera.position.addScaledVector(right, -e.deltaX * scrollSpeed);

    //   clampCameraPosition(camera.position);
    // };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.getWorldDirection(forward.current);
      forward.current.multiplyScalar(-e.deltaY * scrollSpeed);
      camera.position.add(forward.current);

      right.current.crossVectors(forward.current, camera.up).normalize();
      right.current.multiplyScalar(-e.deltaX * scrollSpeed);
      camera.position.add(right.current);

      clampCameraPosition(camera.position);
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [camera, scrollSpeed]);

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

  return null;
}
