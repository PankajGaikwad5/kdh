'use client';
import React from 'react';
import { Model } from '../../../public/Chair_2';
import { Canvas } from '@react-three/fiber';

function page() {
  return (
    <Canvas className='w-full h-full'>
      <Model />
    </Canvas>
  );
}

export default page;
