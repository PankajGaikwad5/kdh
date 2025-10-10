'use client';
import React, { useRef, useState, useEffect } from 'react';
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

export default function ThreeDCircularGallery() {
  const containerRef = useRef(null);
  const [collectionIndex, setCollectionIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgSize, setImgSize] = useState({ width: 260, height: 260 }); // 1:1
  const [radius, setRadius] = useState(400);

  // ✅ Responsive sizes
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setImgSize({ width: 150, height: 150 });
        setRadius(200);
      } else if (w < 1024) {
        setImgSize({ width: 200, height: 200 });
        setRadius(280);
      } else if (w < 1440) {
        setImgSize({ width: 260, height: 260 });
        setRadius(360);
      } else if (w < 1920) {
        setImgSize({ width: 300, height: 300 });
        setRadius(400);
      } else {
        setImgSize({ width: 340, height: 340 });
        setRadius(460);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentCollection = imagesData[collectionIndex];
  const total = currentCollection.urls.length;

  // ✅ 3D layout animation
  useEffect(() => {
    const items = containerRef.current?.children;
    if (!items) return;

    const gap = imgSize.width * 0.96; // proper gap, not too big

    Array.from(items).forEach((item, i) => {
      const offset = (i - imageIndex + total) % total;
      let x = 0,
        z = 0,
        rotationY = 0,
        scale = 1,
        opacity = 1;

      if (offset === 0) {
        x = 0;
        z = radius;
        rotationY = 0;
        scale = 1;
        opacity = 1;
      } else if (offset === 1) {
        x = gap;
        z = radius * 0.7;
        rotationY = -25;
        scale = 0.85;
        opacity = 0.8;
      } else if (offset === total - 1) {
        x = -gap;
        z = radius * 0.7;
        rotationY = 25;
        scale = 0.85;
        opacity = 0.8;
      } else {
        z = 0;
        opacity = 0;
        scale = 0.6;
      }

      gsap.to(item, {
        x,
        z,
        rotationY,
        scale,
        opacity,
        duration: 1,
        ease: 'power3.out',
      });
    });
  }, [imageIndex, collectionIndex, imgSize, radius, total]);

  // ✅ Smooth collection transition
  const changeCollectionSmoothly = (newCollection, newImage) => {
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      scale: 0.8,
      opacity: 0,
      filter: 'blur(10px)',
      duration: 0.5,
      ease: 'power2.inOut',
    });

    tl.add(() => {
      setCollectionIndex(newCollection);
      setImageIndex(newImage);
    });

    tl.to(containerRef.current, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power2.inOut',
    });
  };

  const rotate = (dir = 1) => {
    const next = imageIndex + dir;
    if (next >= total) {
      const newCollection = (collectionIndex + 1) % imagesData.length;
      changeCollectionSmoothly(newCollection, 0);
    } else if (next < 0) {
      const newCollection =
        (collectionIndex - 1 + imagesData.length) % imagesData.length;
      const lastImg = imagesData[newCollection].urls.length - 1;
      changeCollectionSmoothly(newCollection, lastImg);
    } else {
      setImageIndex(next);
    }
  };

  // ✅ Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') rotate(1);
      if (e.key === 'ArrowLeft') rotate(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  return (
    <>
      <Navbar home={true} />
      <div className='relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden pt-24'>
        <header className='fixed top-3 right-0 md:right-2 w-full flex justify-end items-center p-4 z-30'>
          {/* <a href='/'>
                  <Image
                    src='/assets/kdhlogo3.png'
                    alt='Logo'
                    width={150}
                    height={40}
                    className='object-contain'
                  />
                </a> */}
          <button
            onClick={() => router.back()}
            className='text-white hover:text-gray-300 transition'
          >
            <ArrowLeft size={30} />
          </button>
        </header>
        <div className='fixed top-10 left-0 justify-center items-center w-full flex flex-col gap-10'>
          <h2 className='text-2xl md:text-4xl font-bold text-gray-300 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl text-center'>
            Mandirs
          </h2>
          <h2 className='text-2xl md:text-3xl lg:text-4xl 2xl:mt-40 text-white font-bold  text-center z-20'>
            {currentCollection.title}
          </h2>
        </div>

        <button
          onClick={() => rotate(-1)}
          className='absolute left-4 md:left-10 text-white/70 hover:text-white z-30'
        >
          <ArrowLeft size={40} />
        </button>
        <button
          onClick={() => rotate(1)}
          className='absolute right-4 md:right-10 text-white/70 hover:text-white z-30'
        >
          <ArrowRight size={40} />
        </button>

        <div
          ref={containerRef}
          className='relative flex items-center justify-center'
          style={{
            height: '60vh',
            width: '100%',
            transformStyle: 'preserve-3d',
            perspective: '1300px',
          }}
        >
          {currentCollection.urls.map((url, i) => (
            <div
              key={i}
              className='absolute rounded-xl overflow-hidden shadow-2xl cursor-pointer'
              onClick={() => rotate(1)}
              style={{
                width: imgSize.width,
                height: imgSize.height,
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
              }}
            >
              <img
                src={url}
                alt={currentCollection.title}
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
