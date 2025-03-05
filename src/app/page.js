'use client';
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingImagesScene from './components/FloatingImagesScene';
import Image from 'next/image';

const page = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ width: 200, height: 200 });
      } else {
        setDimensions({ width: 200, height: 200 });
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className='min-h-screen overflow-y-hidden scrollhide overflow-hidden bg-[#232424]'>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          // backgroundImage: 'url("/assets/kdhlogo2.png")',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          zIndex: 1,
        }}
        className='flex  justify-center text-start items-start'
      >
        <div
          // style={{
          //   backgroundImage: 'url("/assets/kdhlogo2.png")',
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          // }}
          className='w-full p-0 mt-6  flex justify-center items-center '
        >
          {/* <h1 className='uppercase md:text-6xl text-center flex flex-col md:gap-4 font-bold'>
            welcome to <span className=''>karan desai home</span>
          </h1> */}
          <Image
            src='/assets/kdhlogo3.png'
            alt='Karan Desai Home Logo'
            width={dimensions.width}
            height={dimensions.height}
            className='flex   justify-self-center object-contain  p-0 hover:cursor-pointer'
          />
        </div>
      </div>
      <Navbar />
      <FloatingImagesScene />
    </div>
  );
};

export default page;
