import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

function FeaturedModel({ url, scale, position }) {
  const ref = useRef();
  const { scene: threeScene } = useThree();
  const { scene: gltfScene } = useGLTF(url);

  useFrame((state, delta) => {
    if (ref.current) {
      // Slow rotation
      ref.current.rotation.y += delta * 0.5;
      // Pulsating scale effect
      const scaleFactor = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      ref.current.scale.set(
        scale * scaleFactor,
        scale * scaleFactor,
        scale * scaleFactor
      );
    }
  });

  return (
    <primitive
      object={gltfScene}
      ref={ref}
      position={position}
      // Temporarily disable the global override for this object
      onBeforeRender={(renderer, scene, camera) => {
        // Temporarily disable the override material for this group.
        ref.current.userData._savedOverride = scene.overrideMaterial;
        scene.overrideMaterial = null;
      }}
      onAfterRender={(renderer, scene, camera) => {
        // Restore the override material.
        scene.overrideMaterial = ref.current.userData._savedOverride;
      }}
    />
  );
}

export default FeaturedModel;
