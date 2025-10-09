'use client';
import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

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

// Flatten all images with titles
const allImages = imagesData.flatMap((group) =>
  group.urls.map((url) => ({ url, title: group.title }))
);

export default function ThreeDCircularGallery() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [radius, setRadius] = useState(300);
  const [imgSize, setImgSize] = useState({ width: 200, height: 300 });
  const total = allImages.length;

  // Update radius & image size based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(150);
        setImgSize({ width: 120, height: 180 });
      } else if (width < 1024) {
        setRadius(250);
        setImgSize({ width: 180, height: 270 });
      } else {
        setRadius(400);
        setImgSize({ width: 250, height: 350 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const rotateGallery = (dir = 1) => {
    setCurrentIndex((prev) => (prev + dir + total) % total);
  };

  useEffect(() => {
    const items = containerRef.current.children;
    const angleStep = 360 / total;

    Array.from(items).forEach((item, i) => {
      const offset = i - currentIndex;
      const angle = offset * angleStep;

      gsap.to(item, {
        rotationY: angle,
        z: radius * Math.cos((angle * Math.PI) / 180),
        x: radius * Math.sin((angle * Math.PI) / 180),
        scale: offset === 0 ? 1 : 0.7,
        opacity: Math.abs(offset) > total / 2 ? 0 : 1,
        width: imgSize.width,
        height: imgSize.height,
        duration: 0.8,
        transformOrigin: '50% 50%',
        ease: 'power3.out',
      });
    });
  }, [currentIndex, radius, imgSize]);

  return (
    <>
      <Navbar home={true} />
      <header className='fixed top-3 right-0 md:right-2 w-full flex justify-end items-center p-4 z-30'>
        <button className='text-white hover:text-gray-300 transition'>
          <ArrowLeft size={30} />
        </button>
      </header>

      <div className='min-h-screen bg-black flex flex-col items-center justify-center p-6 perspective-[1200px]'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl text-white font-bold mb-6 text-center px-4'>
          {allImages[currentIndex].title}
        </h2>

        <div
          ref={containerRef}
          className='relative w-full max-w-[90vw] h-[60vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center'
          style={{ transformStyle: 'preserve-3d' }}
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              className='absolute rounded-xl overflow-hidden shadow-lg cursor-pointer '
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                width: imgSize.width,
                height: imgSize.height,
              }}
              onClick={() => setCurrentIndex(i)}
            >
              <img
                src={img.url}
                alt={img.title}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        <div className='flex gap-4 mt-6'>
          <button
            onClick={() => rotateGallery(-1)}
            className='px-5 py-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition'
          >
            ◀ Prev
          </button>
          <button
            onClick={() => rotateGallery(1)}
            className='px-5 py-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition'
          >
            Next ▶
          </button>
        </div>
      </div>
    </>
  );
}
