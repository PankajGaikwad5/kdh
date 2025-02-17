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
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';
import 'swiper/css/pagination';

const MediaRenderer = ({ url, alt }) => {
  const [mediaType, setMediaType] = useState(() => {
    // Check based on file extension first.
    if (/\.(mp4|webm|ogg)$/i.test(url)) return 'video';
    if (/\.(jpe?g|png|gif|bmp|svg)$/i.test(url)) return 'image';
    return 'unknown';
  });

  useEffect(() => {
    if (mediaType === 'unknown') {
      // Attempt a HEAD request to determine the content type.
      fetch(url, { method: 'HEAD' })
        .then((response) => {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('video')) {
            setMediaType('video');
          } else if (contentType && contentType.includes('image')) {
            setMediaType('image');
          } else {
            // Fallback: assume image if we're not sure.
            setMediaType('image');
          }
        })
        .catch(() => {
          // If the HEAD request fails, fallback to image.
          setMediaType('image');
        });
    }
  }, [url, mediaType]);

  if (mediaType === 'video') {
    return (
      <video
        src={url}
        controls
        className='max-w-full max-h-full object-contain'
      />
    );
  }

  // Default to image.
  return (
    <img
      src={url}
      alt={alt}
      loading='lazy'
      className='max-w-full max-h-full object-contain'
    />
  );
};

const CarouselComp = ({ imgArray }) => {
  const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const carouselRef = React.useRef(null);

  // detect if video
  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
  // console.log(isVideo);

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
        isFullscreen ? 'w-screen h-screen' : 'w-full max-w-screen-lg m-0 p-0'
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
        lazy={'true'}
        modules={[Navigation, Thumbs, Pagination, A11y, Zoom, Keyboard]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={10}
        slidesPerView={1}
        className={`w-full ${
          isFullscreen ? 'h-[100vh]' : 'h-[60vh] md:h-[70vh]'
        }`}
        pagination={{ clickable: true }}
        zoom={true}
        keyboard={{ enabled: true, onlyInViewport: true }}
      >
        {imgArray.map((img, index) => (
          <SwiperSlide key={index}>
            <div className='w-full h-full swiper-zoom-container flex items-center justify-center'>
              {/* <img
                src={img}
                alt={`Slide ${index}`}
                loading='lazy'
                className='max-w-full max-h-full object-contain'
              /> */}

              {/* {isVideo(img) ? (
                <video
                  src={img}
                  controls
                  className='max-w-full max-h-full object-contain'
                />
              ) : (
                <img
                  src={img}
                  alt={`Slider ${index}`}
                  loading='lazy'
                  className='max-w-full max-h-full object-contain'
                />
              )} */}
              <MediaRenderer url={img} alt={`Slide ${index}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselComp;
