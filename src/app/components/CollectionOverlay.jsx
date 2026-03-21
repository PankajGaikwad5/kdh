'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Poppins, Montserrat } from 'next/font/google';
import Link from 'next/link';
const popins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const CollectionOverlay = ({ isVisible, onClose, products = [] }) => {
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const productsRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // Entrance Animation
      const tl = gsap.timeline();

      // Ensure visibility
      gsap.set(containerRef.current, { display: 'flex', opacity: 1 });
      gsap.set(cardRef.current, { y: 100, opacity: 0, scale: 0.9 });

      // 1. Reveal Container
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.5,
      });

      // 2. Card slides up from center (simulating "from inside sphere")
      tl.to(
        cardRef.current,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.3',
      );

      // 3. Elements stagger in
      tl.fromTo(
        [titleRef.current, productsRef.current, buttonRef.current],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' },
        '-=0.4',
      );
    } else {
      // Exit Animation
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            gsap.set(containerRef.current, { display: 'none' });
          },
        });
      }
    }
  }, [isVisible]);

  if (!products.length && isVisible) return null; // Safety

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none hidden ${montserrat.className}`}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        className='relative w-full max-w-4xl mx-3 sm:mx-4 md:mx-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 lg:p-12 shadow-2xl pointer-events-auto overflow-hidden max-h-[95vh] overflow-y-auto'
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 text-white/50 hover:text-white transition-colors duration-300 p-2.5 sm:p-2 rounded-full hover:bg-white/10 z-20 touch-manipulation'
          aria-label='Close overlay'
        >
          <X size={20} className='sm:w-6 sm:h-6' />
        </button>

        {/* Shine Effect Background */}
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none' />

        <div className='relative z-10 flex flex-col items-center text-center space-y-4 sm:space-y-6 md:space-y-8'>
          {/* Title Section */}
          <div ref={titleRef} className='space-y-1.5 sm:space-y-2 px-2 sm:px-0'>
            <span className='text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.3em] text-white uppercase'>
              New Collection Launch
            </span>
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-wide px-2'>
              {/* Monster 4.0 is here,{' '} */}
              <span className='font-semibold text-white/90 uppercase'>
                Jina Shilp Collection is Here
              </span>
            </h2>
          </div>

          {/* Products Grid */}
          <div
            ref={productsRef}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full mt-2 sm:mt-3 md:mt-4'
          >
            {/* We will showcase up to 3 products */}
            {products.slice(0, 4).map((product, idx) => (
              <div
                key={idx}
                className='group relative flex flex-col items-center'
              >
                <div className='relative w-full aspect-square bg-white/5 rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-gray-500/30 transition-all duration-500 flex items-center justify-center p-3 sm:p-4'>
                  {/* Placeholder for Product Image - Assuming we have URLs */}
                  {product.path ? (
                    <img
                      src={product.path}
                      alt={product.name}
                      className='object-contain w-full h-full transform group-hover:scale-110 transition-transform duration-700'
                    />
                  ) : (
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full' />
                  )}
                </div>
                <h3 className='mt-2.5 sm:mt-3 md:mt-4 text-xs sm:text-sm font-medium text-white/50 group-hover:text-white transition-colors'>
                  {product.name || `Product ${idx + 1}`}
                </h3>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div
            ref={buttonRef}
            className='pt-2 sm:pt-3 md:pt-4 w-full sm:w-auto'
          >
            <button className='group relative px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black font-medium tracking-wider text-xs sm:text-sm rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto touch-manipulation'>
              <Link href='./collections/js'>
                <span className='relative z-10 flex items-center justify-center gap-2'>
                  EXPLORE COLLECTION
                  <ArrowRight
                    size={14}
                    className='sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform'
                  />
                </span>
                <div className='absolute inset-0 bg-gray-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out' />
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionOverlay;
