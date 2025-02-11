import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function MaterialOverride({ mode }) {
  const { scene } = useThree();

  useEffect(() => {
    let overrideMat = null;
    // Choose a material based on mode
    if (mode === 'normal') {
      overrideMat = new THREE.MeshNormalMaterial();
    } else if (mode === 'wireframe') {
      overrideMat = new THREE.MeshBasicMaterial({ wireframe: true });
    }
    // For "solid" (or default) mode, leave overrideMat as null.
    scene.overrideMaterial = overrideMat;
    // Clean up on unmount or when mode changes
    return () => {
      scene.overrideMaterial = null;
    };
  }, [mode, scene]);

  return null;
}

export default MaterialOverride;
