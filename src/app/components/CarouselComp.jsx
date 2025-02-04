'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  Thumbs,
  Pagination,
  A11y,
  Zoom,
  Keyboard,
  Autoplay,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/pagination';

const CarouselComp = ({ imgArray }) => {
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const carouselRef = React.useRef(null);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      carouselRef.current.requestFullscreen?.().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen?.();
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={`relative ${
        isFullscreen ? 'w-screen h-screen' : 'w-full h-screen'
      }`}
      ref={carouselRef}
    >
      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className='absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/75 transition-colors'
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-white'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
            />
          </svg>
        )}
      </button>

      {/* Main Carousel */}
      <Swiper
        lazy='true'
        modules={[
          Navigation,
          Thumbs,
          Pagination,
          A11y,
          Zoom,
          Keyboard,
          Autoplay,
        ]}
        navigation
        spaceBetween={10}
        slidesPerView={1}
        className='w-full h-full' // Full width and height for the carousel
        pagination={{ clickable: true }}
        zoom={true}
        keyboard={{ enabled: true, onlyInViewport: true }}
        autoplay={{
          delay: 3000, // Time in milliseconds between slides
          disableOnInteraction: true, // Keep autoplay running after interaction
        }}
      >
        {imgArray.map((img, index) => (
          <SwiperSlide key={index}>
            <div className='w-full h-full swiper-zoom-container flex items-center justify-center'>
              <img
                src={img}
                alt={`Slide ${index}`}
                loading='lazy'
                className='max-w-full max-h-full object-contain'
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselComp;
