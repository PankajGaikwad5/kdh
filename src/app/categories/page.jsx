'use client';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { categoryList, deriveCategory } from '../utils/categories';
import { products as allProducts } from '../components/products';

const CategoryCard = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  // 4 columns logic (lg: screens)
  const isAlternate4 = (Math.floor(index / 4) + (index % 4)) % 2 !== 0;
  const bgDesktop = isAlternate4 ? 'lg:bg-[#1a1a1a]' : 'lg:bg-[#121212]';

  // 2 columns logic (default for mobile & tablet)
  const isAlternate2 = (Math.floor(index / 2) + (index % 2)) % 2 !== 0;
  const bgMobile = isAlternate2 ? 'bg-[#1a1a1a]' : 'bg-[#121212]';

  const bgColor = `${bgMobile} ${bgDesktop}`;
  const slug = category.name.toLowerCase().replace(/ /g, '-');

  const categoryProducts = allProducts.filter(p => deriveCategory(p.title).includes(category.name));
  
  const productImages = categoryProducts
    .map(p => {
      const imgs = p.images || [];
      return imgs.length > 0 ? (imgs[0].filePath || imgs[0]) : null;
    })
    .filter(Boolean);
    
  const primaryImage = productImages.length > 0 ? productImages[0] : category.img;
  
  const uniqueImages = [...new Set([primaryImage, ...productImages])].slice(0, 10);

  useEffect(() => {
    let interval;
    if (isHovered && uniqueImages.length > 1) {
      setHasHovered(true);
      interval = setInterval(() => {
        setImgIndex((prev) => (prev + 1) % uniqueImages.length);
      }, 800);
    } else {
      setImgIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, uniqueImages.length]);

  return (
    <Link
      href={`/categories/${slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between h-[280px] md:h-[450px] lg:h-[500px] p-4 md:p-8 md:py-6 group cursor-pointer ${bgColor} transition-colors duration-500 hover:bg-[#222]`}
    >
      <div className='flex-grow flex items-center justify-center overflow-hidden mb-8'>
        <div className='relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105'>
          {uniqueImages.map((imgSrc, i) => {
            if (i !== 0 && !hasHovered) return null;
            const isVisible = i === imgIndex;
            return (
              <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {typeof imgSrc === 'string' && imgSrc.includes('http') ? (
                  <img
                    src={imgSrc}
                    alt={category.name}
                    className='object-contain w-full h-full absolute inset-0 '
                  />
                ) : (
                  <Image
                    src={imgSrc}
                    alt={category.name}
                    fill
                    className='object-contain '
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex flex-col items-start text-left z-10'>
        <h2 className='text-sm md:text-2xl font-medium text-gray-200 uppercase tracking-widest mb-1'>
          {category.name}
        </h2>
        
        <p className='text-[10px] md:text-base text-gray-400 uppercase tracking-widest font-light line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-tight md:leading-normal mb-2 md:mb-4'>
          EXPLORE CATEGORY
        </p>
        
        <HoverBorderGradient
          containerClassName="mt-2"
          className="bg-black/20 flex items-center justify-center text-[8px]  font-medium uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300 px-4 py-[4px]"
          as="div"
        >
          <span className="mb-[-2px]">Discover More</span>
        </HoverBorderGradient>
      </div>
    </Link>
  );
};

const Page = () => {
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.2
      );

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
      className='min-h-screen flex flex-col bg-black overflow-hidden'
    >
      <Navbar />
      
      {/* Sleek Minimal Header */}
      <div className='w-full pt-32 pb-8 px-8 md:px-12 flex items-end'>
        <h1
          ref={headingRef}
          className='text-3xl md:text-5xl font-light text-white uppercase tracking-[0.2em]'
        >
          Categories
        </h1>
      </div>

      {/* Grid */}
      <main
        ref={gridRef}
        className='grid grid-cols-2 lg:grid-cols-4 w-full flex-grow'
      >
        {categoryList.map((category, index) => (
          <CategoryCard key={index} category={category} index={index} />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
