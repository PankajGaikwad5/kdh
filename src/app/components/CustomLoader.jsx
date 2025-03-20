// CustomLoader.js
'use client';
import React from 'react';
import '../styles/planet.scss';
import { Html, useProgress } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CustomLoader() {
  const { progress } = useProgress();
  // const { camera } = useThree();
  const loaderPosition = new THREE.Vector3(0, 6, 0); // Desired position in 3D space
  // const screenPosition = loaderPosition.clone().project(camera);

  function getColor(index) {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
    return colors[index % colors.length];
  }
  return (
    <Html
      className='z-10'
      // position={loaderPosition}
      // style={{
      //   position: 'absolute',
      //   top: `${((screenPosition.y + 1) / 2) * 100}%`,
      //   left: `${((screenPosition.x + 1) / 2) * 100}%`,
      //   transform: 'translate(-50%, -50%)',
      //   width: '100%',
      //   height: '100%',
      //   display: 'flex',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      // }}
    >
      {/* <div className='flex justify-center items-center h-screen w-screen ml-28 -mr-96'>
        <div className='content'>
          {Array.from({ length: 16 }).map((_, b) => (
            <div key={b} className='cuboid'>
              {Array.from({ length: 6 }).map((_, s) => (
                <div key={s} className='side'></div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
      {/* <div className='w-full h-screen absolute  flex justify-center items-center'> */}
      <div className='content z-10'>
        {/* <div className='planet'>
          <div className='ring'></div>
          <div className='cover-ring'></div>
          <div className='spots'>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div> */}
        {/* <img
          src='https://www.icegif.com/wp-content/uploads/2023/07/icegif-1262.gif'
          alt='loading'
          className=''
        /> */}
        <div className='flex space-x-2'>
          {[0, 150, 300, 450, 600].map((delay, index) => (
            <span
              key={index}
              className='h-3 w-3 rounded-full animate-bounce'
              style={{
                animationDelay: `${delay}ms`,
                backgroundColor: getColor(index),
              }}
            ></span>
          ))}
        </div>

        <p>loading</p>
      </div>
      {/* </div> */}
    </Html>
  );
}
