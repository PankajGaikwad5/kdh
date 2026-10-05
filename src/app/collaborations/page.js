'use client';
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { collabs } from '../components/collabs';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import CustomCarousel from '../components/CustomCarouselComp';
import { X } from 'lucide-react';
import { Poppins, Montserrat } from 'next/font/google';
import { set } from 'mongoose';

const popins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const page = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectImages, setSelectedProjectImages] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (project) => {
    setSelectedProject(project);
    setSelectedProjectImages(project.images);
    // console.log(project.images);
    setActiveIndex(0); // reset when opening
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
      className={isLight ? 'bg-white' : 'bg-black'}
      style={!isLight ? {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      } : {}}
    >
      <Navbar arrow={true} />
      <div className='w-full pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen '>
        <div className='w-full text-center flex justify-center'>
          <h1 className={`text-2xl md:text-4xl font-bold pb-8 border-b-2 uppercase w-full md:max-w-3xl ${isLight ? 'text-gray-900 border-gray-200' : 'text-gray-200 border-gray-800'}`}>
            Collaborations
          </h1>
        </div>
        <div className='grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 p-6 py-10'>
          {collabs.map((project) => {
            // Apply smaller size to these specific large logos
            const isLargeLogo = ['the quarry', 'Top Brewer', 'bft'].includes(
              project.title,
            );
            const sizeClasses = isLargeLogo
              ? 'max-w-[280px] max-h-44'
              : 'max-w-[360px] max-h-56';
              
            const getLogoImage = (proj, lightMode) => {
              const defaultImg = proj.images[0]?.fileUrl;
              if (!lightMode) return defaultImg;

              const titleLower = proj.title.toLowerCase();
              const titleMap = {
                'arjun rathi': '/lightthemecollab/arjun_rathi.webp',
                'bft': '/lightthemecollab/bft.webp',
                'casa': '/lightthemecollab/casa.webp',
                'dimension': '/lightthemecollab/dimension.webp',
                'marble': '/lightthemecollab/marble.webp',
                'serafini': '/lightthemecollab/serafini.webp',
                'square knots': '/lightthemecollab/square_knots.webp',
                'the quarry': '/lightthemecollab/the_quarry.webp',
                'top brewer': '/lightthemecollab/top_brewer.webp'
              };

              for (const [key, path] of Object.entries(titleMap)) {
                if (titleLower.includes(key)) {
                  return path;
                }
              }

              return defaultImg;
            };

            return (
              <div
                key={project._id.$oid || project._id}
                className='flex flex-col h-[320px] items-center justify-end'
              >
                <div className='flex-grow w-full flex items-center justify-center'>
                  <img
                    src={getLogoImage(project, isLight)}
                    alt={project.title}
                    className={`object-contain cursor-pointer ${sizeClasses} w-full transition-transform duration-300 hover:scale-105`}
                    onClick={() => openModal(project)}
                  />
                </div>
                <h1 className={`mt-6 text-sm md:text-base font-medium tracking-wider ${isLight ? 'text-black' : 'text-white'}`}>
                  {project.year}
                </h1>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
      {selectedProject && (
        <div className='fixed flex-col w-full h-screen inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50'>
          <button
            className='absolute top-14 left-14 z-10 text-white text-4xl font-bold'
            onClick={closeModal}
            aria-label='Close modal'
          >
            <X size={40} />
          </button>
          <div className='relative w-full max-w-4xl p-4'>
            <CustomCarousel
              imgArray={selectedProjectImages.map((image) => image.fileUrl)}
              onSlideChange={setActiveIndex}
            />
          </div>
          {/* {selectedProject.title === 'serafini' && (
            <h3 className='text-white'>{selectedProject.details}</h3>
          )} */}
          {selectedProject.title === 'serafini' ? (
            <h3 className='text-white'>
              {selectedProjectImages[activeIndex]?.name || ''}
            </h3>
          ) : (
            <h3 className='text-white'>{selectedProject.details}</h3>
          )}

          <a
            href={`${selectedProject.moreDetails}`}
            className='absolute right-20 bottom-14 underline  z-10 tracking-widest text-blue-600'
          >
            {selectedProject.singleProduct ? 'Check Out' : 'View Collection'}
          </a>
        </div>
      )}
    </div>
  );
};

export default page;
