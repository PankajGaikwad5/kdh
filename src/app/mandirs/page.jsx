'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { formatTitle } from '@/lib/utils';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { mandirs } from '../components/mandirsData';

const MandirCard = ({ mandir, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 4 columns logic (lg: screens)
  const isAlternate4 = (Math.floor(index / 4) + (index % 4)) % 2 !== 0;
  const bgDesktop = isAlternate4
    ? 'lg:bg-gray-100 lg:dark:bg-[#1a1a1a]'
    : 'lg:bg-gray-200 lg:dark:bg-[#121212]';

  // 2 columns logic (default for mobile & tablet)
  const isAlternate2 = (Math.floor(index / 2) + (index % 2)) % 2 !== 0;
  const bgMobile = isAlternate2
    ? 'bg-gray-100 dark:bg-[#1a1a1a]'
    : 'bg-gray-200 dark:bg-[#121212]';

  // 5 columns logic (2xl: screens)
  const isAlternate5 = (Math.floor(index / 5) + (index % 5)) % 2 !== 0;
  const bg2xl = isAlternate5
    ? '2xl:bg-gray-100 2xl:dark:bg-[#1a1a1a]'
    : '2xl:bg-gray-200 2xl:dark:bg-[#121212]';

  const bgColor = `${bgMobile} ${bgDesktop} ${bg2xl}`;

  const primaryImage = mandir.images?.[0]?.filePath || '';
  const hoverImage = mandir.images?.[1]?.filePath || primaryImage;
  const title = formatTitle(mandir.title) || '';

  return (
    <Link
      href={`/mandirdetailpage/${mandir._id.$oid}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between h-[280px] md:h-[450px] lg:h-[500px] p-4 md:p-8 md:py-6 group cursor-pointer ${bgColor} transition-colors duration-500 hover:bg-gray-300 dark:hover:bg-[#222] overflow-hidden`}
    >
      {/* Default Content */}
      <div className={`absolute inset-0 overflow-hidden transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={title}
            fill
            className='object-cover transform transition-transform duration-700 ease-out group-hover:scale-105'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        <div className='absolute inset-0 bg-[rgba(0,0,0,0.25)]' />
        <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent' />
      </div>

      {/* Explicit #fff: globals.css turns .text-white black in light mode */}
      <div className={`relative mt-auto flex flex-col items-start text-left z-10 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className='text-sm md:text-xl font-base uppercase tracking-widest mb-1 line-clamp-1 text-[#fff] drop-shadow-md'>
          {title}
        </h2>
      </div>

      {/* Hover Overlay Content */}
      <div
        className={`absolute inset-0 z-20 flex items-end justify-center pb-8 md:pb-12 transition-all duration-700 ease-out ${isHovered ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)]'}`}
      >
        <div className="absolute inset-0 bg-black/15 z-10 transition-opacity duration-700"></div>
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${title} hover`}
            fill
            className='absolute inset-0 object-cover z-0 transform transition-transform duration-1000 scale-100 group-hover:scale-105'
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        )}
        <div className="relative z-20 transition-opacity duration-500 delay-100 opacity-0 group-hover:opacity-100">
          <HoverBorderGradient
            containerClassName="mt-2"
            className="bg-black/20 flex items-center justify-center text-[8px] font-medium uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300 px-4 py-[4px]"
            as="div"
          >
            <span className="mb-[-2px]">View Details</span>
          </HoverBorderGradient>
        </div>
      </div>
    </Link>
  );
};

const MandirsPage = () => {
  const pageRef = useRef(null);
  const headerRef = useRef(null);
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

      // Header content reveal from bottom
      const revealEls = headerRef.current?.querySelectorAll('.gsap-reveal');
      if (revealEls?.length) {
        tl.fromTo(
          revealEls,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.inOut',
          },
          0.2
        );
      }

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
    <div
      ref={pageRef}
      style={{ opacity: 0 }}
      className='min-h-screen flex flex-col bg-white dark:bg-black'
    >
      <div className='min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={false} home={false} />

        <div ref={headerRef}>
          <div className='w-full text-center flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8'>
            <h1 className='gsap-reveal text-2xl md:text-4xl font-medium py-6 border-b uppercase w-full md:max-w-3xl tracking-widest text-gray-900 border-gray-200 dark:text-gray-200 dark:border-gray-800'>
              Mandirs
            </h1>
          </div>

          <div className='flex justify-center items-center mt-12 w-full'>
            <main
              ref={gridRef}
              className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full flex-grow'
            >
              {mandirs.map((mandir, index) => (
                <MandirCard key={mandir._id.$oid} mandir={mandir} index={index} />
              ))}
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MandirsPage;
