'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { products } from '@/app/components/products';
import Image from 'next/image';
import Link from 'next/link';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { deriveCategory } from '@/app/utils/categories';

const ProductCardV2 = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 4 columns logic (lg: screens)
  const isAlternate4 = (Math.floor(index / 4) + (index % 4)) % 2 !== 0;
  const bgDesktop = isAlternate4 ? 'lg:bg-[#1a1a1a]' : 'lg:bg-[#121212]';

  // 2 columns logic (default for mobile & tablet)
  const isAlternate2 = (Math.floor(index / 2) + (index % 2)) % 2 !== 0;
  const bgMobile = isAlternate2 ? 'bg-[#1a1a1a]' : 'bg-[#121212]';

  const bgColor = `${bgMobile} ${bgDesktop}`;

  const primaryImage = product.images?.[0]?.filePath || '';
  const title = product.title || '';
  const collectionName = product.group?.replace('_', ' ') || '';
  
  const hoverImage = product.images?.[1]?.filePath || primaryImage;

  return (
    <Link
      href={`/productdetails/${product._id.$oid}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between h-[280px] md:h-[450px] lg:h-[500px] p-4 md:p-8 md:py-6 group cursor-pointer ${bgColor} transition-colors duration-500 hover:bg-[#222] overflow-hidden`}
    >
      {/* Default Content */}
      <div className={`flex-grow flex items-center justify-center overflow-hidden mb-8 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <div className='relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105'>
          {primaryImage && (
            primaryImage.includes('http') ? (
              <img
                src={primaryImage}
                alt={title}
                className='object-contain w-full h-full absolute inset-0 '
              />
            ) : (
              <Image
                src={primaryImage}
                alt={title}
                fill
                className='object-contain '
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            )
          )}
        </div>
      </div>

      <div className={`flex flex-col items-start text-left z-10 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className='text-sm md:text-xl font-medium text-gray-200 uppercase tracking-widest mb-1 line-clamp-1'>
          {title}
        </h2>
        
        <p className='text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-light line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-tight md:leading-normal mb-2 md:mb-4'>
          {collectionName}
        </p>
      </div>

      {/* Hover Overlay Content */}
      <div 
        className={`absolute inset-0 z-20 flex items-end justify-center pb-8 md:pb-12 transition-all duration-700 ease-out ${isHovered ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)]'}`}
      >
        <div className="absolute inset-0 bg-black/15 z-10 transition-opacity duration-700"></div>
        {hoverImage && (
          hoverImage.includes('http') ? (
            <img
              src={hoverImage}
              alt={`${title} hover`}
              className='absolute inset-0 w-full h-full object-cover z-0 transform transition-transform duration-1000 scale-100 group-hover:scale-105'
            />
          ) : (
            <Image
              src={hoverImage}
              alt={`${title} hover`}
              fill
              className='absolute inset-0 object-cover z-0 transform transition-transform duration-1000 scale-100 group-hover:scale-105'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )
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

const CategoryProductsPage = () => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    // Decode the slug to get the display name
    const categoryName = decodeURIComponent(category).replace(/-/g, ' ');
    
    // Filter products whose derived category matches (case insensitive)
    const matchedProducts = products.filter((p) => {
      const derived = deriveCategory(p.title);
      return derived.toLowerCase() === categoryName.toLowerCase();
    });
    setFilteredProducts(matchedProducts);
  }, [category]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      if (headerRef.current) {
        const revealEls = headerRef.current.querySelectorAll('.gsap-reveal');
        if (revealEls.length) {
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
      }

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
  }, [filteredProducts]);

  const displayCategory = decodeURIComponent(category).replace(/-/g, ' ');

  return (
    <div
      ref={pageRef}
      style={{ opacity: 0 }}
      className='min-h-screen flex flex-col bg-black'
    >
      <div className='min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={false} home={false} />

        <div ref={headerRef} className='pt-28'>
          <div className='w-full text-center flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8'>
            <h1 className='gsap-reveal text-2xl md:text-4xl font-medium text-gray-200 pb-6 border-b border-gray-800 uppercase w-full md:max-w-3xl tracking-widest'>
              {displayCategory}
            </h1>
          </div>

          <div className='flex justify-center items-center mt-12 w-full'>
            {filteredProducts.length > 0 ? (
              <main
                ref={gridRef}
                className='grid grid-cols-2 lg:grid-cols-4 w-full flex-grow'
              >
                {filteredProducts.map((product, index) => (
                  <ProductCardV2
                    product={product}
                    index={index}
                    key={index}
                  />
                ))}
              </main>
            ) : (
              <div className="flex-grow flex items-center justify-center py-20 text-gray-500 tracking-widest uppercase">
                No products found in this category
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default CategoryProductsPage;
