'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { collabs } from '../components/collabs';
import { useEffect, useState } from 'react';
import CustomCarousel from '../components/CustomCarouselComp';
import { X } from 'lucide-react';
import { Poppins, Montserrat } from 'next/font/google';

const popins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const page = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project.images);
    // console.log(project.images);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedProject) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProject]);

  return (
    <div
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* <Navbar /> */}
      <div className='w-full pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen '>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b border-gray-200 dark:border-gray-700'>
          Collaborations
        </h1>
        {/* <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-6 space-y-16 2xl:space-y-56 items-center'>
          <div className='flex justify-center items-center'>
            <img src='/assets/query.png' alt='' className='object-cover' />
          </div>
          <div className='flex justify-center items-center mt-5'>
            <img
              src='/assets/topb.png'
              alt='topbrewer'
              className='object-cover'
            />
          </div>
          <div className='flex justify-center items-center'>
            <img
              src='https://3.imimg.com/data3/CH/KI/MY-5246137/bharat-floorings-logo-120x120.jpg'
              alt=''
              className='object-cover'
            />
          </div>
          <div className='flex justify-center items-center'>
            <img
              src='https://foremostmarbles.com/wp-content/uploads/2021/09/FM-LOGO-copy-1536x292.png'
              alt=''
              className='object-cover'
            />
          </div>
          <div className='flex justify-center items-center'>
            <img src='/assets/casa.png' alt='' className='object-cover' />
          </div>
          <div className='flex justify-center items-center  '>
            <img src='/assets/serafini.png' alt='' className='object-cover ' />
          </div>
        </div> */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3  p-6 space-y-8 items-center py-10'>
          {collabs.map((project) => (
            <div
              key={project._id.$oid || project._id}
              className='flex justify-center items-center'
            >
              <img
                src={project.images[0]?.fileUrl}
                alt={project.title}
                className='object-cover cursor-pointer'
                onClick={() => openModal(project)}
              />
            </div>
          ))}
        </div>
        <Footer />
      </div>
      {selectedProject && (
        <div className='fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50'>
          <button
            className='absolute top-14 left-14 z-10 text-white text-4xl font-bold'
            onClick={closeModal}
            aria-label='Close modal'
          >
            <X size={40} />
          </button>
          <div className='relative w-full max-w-4xl p-4'>
            <CustomCarousel
              imgArray={selectedProject.map((image) => image.fileUrl)}
            />
          </div>
          {/* <a
            href='/kdad'
            className='absolute right-20 bottom-14 underline  z-10 tracking-widest text-blue-600'
          >
            know more
          </a> */}
        </div>
      )}
    </div>
  );
};

export default page;
