'use client';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import { catalogues } from '../components/catalogues';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { products as allProducts } from '../components/products';

const CollectionCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const titleParts = product.title.split(' | ');
  const mainTitle = titleParts[0];
  const subTitle = titleParts.slice(1).join(' | ');

  // 4 columns logic (lg: screens)
  const isAlternate4 = (Math.floor(index / 4) + (index % 4)) % 2 !== 0;
  const bgDesktop = isAlternate4 ? 'lg:bg-[#1a1a1a]' : 'lg:bg-[#121212]';

  // 2 columns logic (default for mobile & tablet)
  const isAlternate2 = (Math.floor(index / 2) + (index % 2)) % 2 !== 0;
  const bgMobile = isAlternate2 ? 'bg-[#1a1a1a]' : 'bg-[#121212]';

  // 5 columns logic (2xl: screens)
  const isAlternate5 = (Math.floor(index / 5) + (index % 5)) % 2 !== 0;
  const bg2xl = isAlternate5 ? '2xl:bg-[#1a1a1a]' : '2xl:bg-[#121212]';

  const bgColor = `${bgMobile} ${bgDesktop} ${bg2xl}`;

  const catalogItem = catalogues.find((c) => c.group === product.group);
  const year = catalogItem?.year;

  const primaryImage = product.img;
  const collectionProducts = allProducts.filter(p => p.group === product.group);
  const productImages = collectionProducts
    .map(p => {
      const imgs = p.images || [];
      return imgs.length > 0 ? (imgs[0].filePath || imgs[0]) : null;
    })
    .filter(Boolean);
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
      href={`/collections/${product.group}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between h-[280px] md:h-[450px] lg:h-[500px] p-4 md:p-8 md:py-6 group cursor-pointer ${bgColor} transition-colors duration-500 hover:bg-[#222]`}
    >
      {year && (
        <div className='absolute top-3 right-3 md:top-5 md:right-5 text-[10px] md:text-base font-light text-gray-400 tracking-widest z-10'>
          {year}
        </div>
      )}
      <div className='flex-grow flex items-center justify-center overflow-hidden mb-8'>
        <div className='relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105'>
          {uniqueImages.map((imgSrc, i) => {
            if (i !== 0 && !hasHovered) return null;
            const isVisible = i === imgIndex;
            return (
              <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                {imgSrc.includes('http') ? (
                  <img
                    src={imgSrc}
                    alt={product.title}
                    className='object-contain w-full h-full absolute inset-0 '
                  />
                ) : (
                  <Image
                    src={imgSrc}
                    alt={product.title}
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
          {mainTitle}
        </h2>
        
        <p className='text-[10px] md:text-base text-gray-400 uppercase tracking-widest font-light line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-tight md:leading-normal mb-2 md:mb-4'>
          {subTitle || 'KARAN DESAI HOME'}
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

  const products = [
    {
      id: 16,
      title: 'Jina Shilp | Serafini',
      group: 'jina_shilp',
      img: '/js/totem/png.webp',
      projects: 'totem, mirror, dining table',
    },
    {
      id: 15,
      title: 'Monster 4.0 | Square Knots',
      group: 'monster_4.0',
      img: '/monster4.0/mirror/0.webp',
      projects: 'Yoda Totem, Yoda Carpet, Mirror Carpet',
    },
    {
      id: 14,
      title: 'Monster 3.1 | Dimensions',
      group: 'monster_3.1',
      img: '/m3/desk/3.webp',
      projects: '',
    },
    {
      id: 3,
      title: 'Monster 3.0 | Dimensions',
      group: 'monster_3.0',
      img: '/group/1.png',
      projects: 'gattoo | top brewer, yoda',
    },
    {
      id: 11,
      title: 'Matilda 2025',
      group: 'matilda_2025',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUWsDqoIrSVLpqPbsdCUAMXZB0lT2vrWw4RhOu',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 4,
      title: 'Matilda 2024',
      group: 'matilda_2024',
      img: '/group/4.png',
      projects:
        'pendant lights, table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 2,
      title: 'Monster 2.0 | TopBrewer | Bharat Flooring',
      group: 'monster_2.0',
      img: '/group/2.png',
      projects: 'gattoo | top brewer, yoda',
    },
     {
      id: 5,
      title: 'Monster Collectibles | Arjun Rathi',
      group: 'monster_collectibles',
      img: '/group/5.png',
      projects:
        'monster binty, monster brainy, monster gattooffer, monster guard, monster gum, monster grumpy, monster squinty',
    },
    {
      id: 6,
      title: 'Samaveta | Serafini',
      group: 'serafini',
      img: '/group/6.png',
      projects: 'serafini',
    },
    {
      id: 7,
      title: 'Monsformer | Blum',
      group: 'monsformer',
      img: '/group/7.png',
      projects: 'monsformer',
    },
    {
      id: 1,
      title: 'Monster 1.0 | The Quarry',
      group: 'monster_1.0',
      img: '/group/3.png',
      projects: 'monster basin, monster bathtub, monster console',
    },
    {
      id: 12,
      title: 'Matilda 2022',
      group: 'matilda_2022',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUloYwC49DZL6up3G75dgCY2rJjaQFwifBAEky',
      projects:
        '86 side table, side table, chaise longue, marble ball console, marble console, marble screen',
    },
    {
      id: 13,
      title: 'Matilda 2023',
      group: 'matilda_2023',
      img: 'https://ilf6s48f28.ufs.sh/f/A71pwfasMjQ6gBXjHSCZerKAITJasY524vLb0iMwnFhmpSEq',
      projects:
        'av console, bench, console, green, travatine, dining table, side table',
    },
    {
      id: 10,
      title: 'For Friends ',
      group: 'friends',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUw9Nbw65gi1vXhd2AYtoGrDFy59EOsBzTnN6e',
      projects: 'friends',
    },
  ];

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
          className='text-3xl md:text-5xl  text-white uppercase '
        >
          Collections
        </h1>
      </div>

      {/* Grid */}
      <main
        ref={gridRef}
        className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full flex-grow'
      >
        {products.map((product, index) => (
          <CollectionCard key={index} product={product} index={index} />
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
