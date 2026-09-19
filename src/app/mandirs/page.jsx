'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import SubProductCard from '../components/SubProductCard';
import Footer from '../components/Footer';
import { mandirs } from '../components/mandirsData';

const MandirsPage = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fade in the whole page
      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      // Heading reveal from bottom
      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.2
      );

      // Stagger cards in
      const cards = gridRef.current?.children;
      if (cards?.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: 'power2.out',
          },
          0.4
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div
        ref={pageRef}
        style={{ opacity: 0 }}
        className='min-h-screen flex flex-col bg-gradient-to-b bg-black'
      >
        <Navbar />
        {/* Grid container fills the available vertical space */}
        <div className='w-full text-center flex justify-center'>
          <h1
            ref={headingRef}
            className='text-2xl md:text-4xl font-bold text-gray-300 pt-20 md:pt-7 pb-3 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'
          >
            Mandirs
          </h1>
        </div>

        <main
          ref={gridRef}
          className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4 md:mx-14 my-10 md:my-6 '
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {mandirs.map(({ title, images, _id }, index) => (
            <SubProductCard
              key={index}
              title={title}
              img={images[0]?.filePath || '/placeholder.webp'}
              id={_id.$oid}
              basePath='/mandirdetailpage'
              subtleHover={true}
              hoveredIndex={hoveredIndex}
              setHoveredIndex={setHoveredIndex}
            />
          ))}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MandirsPage;
