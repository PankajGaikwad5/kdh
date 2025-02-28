import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingImagesScene from './components/FloatingImagesScene';

const page = () => {
  return (
    <div className='min-h-screen overflow-y-hidden'>
      <Navbar isBgBlack={true} />
      <FloatingImagesScene />
    </div>
  );
};

export default page;
