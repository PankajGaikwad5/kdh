'use client';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const imagesData = [
  {
    title: 'Ashram Mandir',
    urls: [
      '/mandirs/ashram-mandir/1.webp',
      '/mandirs/ashram-mandir/2.webp',
      '/mandirs/ashram-mandir/3.webp',
    ],
  },
  {
    title: 'BCR Mandir',
    urls: [
      '/mandirs/bcr-mandir/1.webp',
      '/mandirs/bcr-mandir/2.webp',
      '/mandirs/bcr-mandir/3.webp',
      '/mandirs/bcr-mandir/4.webp',
    ],
  },
  {
    title: 'DC Mandir',
    urls: [
      '/mandirs/dc-mandir/1.webp',
      '/mandirs/dc-mandir/2.webp',
      '/mandirs/dc-mandir/3.webp',
      '/mandirs/dc-mandir/4.webp',
      '/mandirs/dc-mandir/5.webp',
    ],
  },
];

// Flatten all images
const allImages = imagesData.flatMap((group) =>
  group.urls.map((url) => ({ url, title: group.title }))
);

export default function ThreeDCircularGallery() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = allImages.length;

  const [imgSize, setImgSize] = useState({ width: 280, height: 380 });
  const [radius, setRadius] = useState(400);

  // 🔹 Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setImgSize({ width: 160, height: 220 });
        setRadius(220);
      } else if (width < 1024) {
        setImgSize({ width: 220, height: 300 });
        setRadius(300);
      } else if (width < 1440) {
        setImgSize({ width: 280, height: 380 });
        setRadius(400);
      } else if (width < 1920) {
        setImgSize({ width: 320, height: 440 });
        setRadius(480);
      } else {
        setImgSize({ width: 360, height: 480 });
        setRadius(520);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔹 Rotate gallery
  const rotateGallery = useCallback(
    (dir = 1) => {
      setCurrentIndex((prev) => (prev + dir + total) % total);
    },
    [total]
  );

  // 🔹 Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') rotateGallery(1);
      if (e.key === 'ArrowLeft') rotateGallery(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateGallery]);

  // 🔹 GSAP 3D animation
  useEffect(() => {
    const items = containerRef.current.children;

    Array.from(items).forEach((item, i) => {
      const offset = i - currentIndex;
      let rotationY = 0;
      let x = 0;
      let z = 0;
      let scale = 1;
      let opacity = 0;

      if (offset === 0) {
        // Center
        rotationY = 0;
        x = 0;
        z = radius;
        scale = 1;
        opacity = 1;
      } else if (offset === -1 || offset === total - 1) {
        // Left side
        rotationY = 20;
        x = -imgSize.width * 0.9;
        z = radius * 0.7;
        scale = 0.8;
        opacity = 0.8;
      } else if (offset === 1 || offset === -(total - 1)) {
        // Right side
        rotationY = -20;
        x = imgSize.width * 0.9;
        z = radius * 0.7;
        scale = 0.8;
        opacity = 0.8;
      } else {
        opacity = 0;
        scale = 0.6;
        z = 0;
      }

      gsap.to(item, {
        duration: 0.9,
        x,
        z,
        rotationY,
        scale,
        opacity,
        ease: 'power3.out',
      });
    });
  }, [currentIndex, imgSize, radius, total]);

  return (
    <>
      <Navbar home={true} />

      <div className='relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden'>
        <h2 className='text-2xl md:text-4xl lg:text-5xl text-white font-bold md:mb-16 text-center z-20'>
          {allImages[currentIndex].title}
        </h2>

        {/* Navigation buttons */}
        <button
          onClick={() => rotateGallery(-1)}
          className='absolute left-4 md:left-10 text-white/70 hover:text-white transition z-30'
        >
          <ArrowLeft size={40} />
        </button>
        <button
          onClick={() => rotateGallery(1)}
          className='absolute right-4 md:right-10 text-white/70 hover:text-white transition z-30'
        >
          <ArrowRight size={40} />
        </button>

        <div
          ref={containerRef}
          className='relative w-full flex items-center justify-center'
          style={{
            height: '65vh',
            transformStyle: 'preserve-3d',
            perspective: '1300px',
          }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              className='absolute rounded-2xl overflow-hidden shadow-xl cursor-pointer'
              onClick={() => setCurrentIndex(i)}
              style={{
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                width: imgSize.width,
                height: imgSize.height,
              }}
            >
              <img
                src={img.url}
                alt={img.title}
                draggable={false}
                className='w-full h-full object-cover'
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
