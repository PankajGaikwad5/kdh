import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingImagesScene from './components/FloatingImagesScene';
import Image from 'next/image';

const page = () => {
  return (
    <div className='min-h-screen overflow-y-hidden'>
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
        className='flex justify-center text-start items-start'
      >
        <div
          // style={{
          //   backgroundImage: 'url("/assets/kdhlogo2.png")',
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          // }}
          className='w-full p-0 -mt-4 flex justify-center items-center'
        >
          {/* <h1 className='uppercase md:text-6xl text-center flex flex-col md:gap-4 font-bold'>
            welcome to <span className=''>karan desai home</span>
          </h1> */}
          <Image
            src='/assets/kdadlogo.png'
            alt='Karan Desai Home Logo'
            width={200}
            height={200}
            className=' md:flex justify-self-center object-contain  p-0 hidden hover:cursor-pointer'
          />
        </div>
      </div>
      <Navbar isBgBlack={true} />
      <FloatingImagesScene />
    </div>
  );
};

export default page;
