'use client';
import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import SubProductCard from '../components/SubProductCard';
import Footer from '../components/Footer';

const page = () => {
  const [imgArray, setImgArray] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  // const fetchProjects = async () => {
  //   try {
  //     const response = await fetch(`/api/products`);
  //     const data = await response.json();
  //     const { products } = data;
  //     setImgArray(products);
  //   } catch (error) {
  //     console.error('Error fetching projects:', error);
  //   }
  // };

  // React.useEffect(() => {
  //   fetchProjects();
  // }, []);

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
      title: 'Jina Shilp X Serafini',
      group: 'jina_shilp',
      img: '/js/totem/png.webp',
      projects: 'totem, mirror, dining table',
    },
    {
      id: 15,
      title: 'Monster 4.0 X Square Knots',
      group: 'monster_4.0',
      img: '/monster4.0/mirror/mirrorpng.webp',
      projects: 'Yoda Totem, Yoda Carpet, Mirror Carpet',
    },
    {
      id: 14,
      title: 'Monster 3.1 X Dimensions',
      group: 'monster_3.1',
      img: '/m3/desk/3.png',
      projects: '',
    },
    {
      id: 3,
      title: 'Monster 3.0 X Dimensions',
      group: 'monster_3.0',
      img: '/group/1.png',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 2,
      title: 'Monster 2.0 X TopBrewer X Bharat Flooring',
      group: 'monster_2.0',
      img: '/group/2.png',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 1,
      title: 'Monster 1.0 X The Quarry',
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
      id: 4,
      title: 'Matilda 2024',
      group: 'matilda_2024',
      img: '/group/4.png',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
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
      id: 5,
      title: 'Monster Collectibles X Arjun Rathi',
      group: 'monster_collectibles',
      img: '/group/5.png',
      projects:
        'monster binty, monster brainy, monster gattooffer, monster guard, monster gum, monster grumpy, monster squinty',
    },
    {
      id: 6,
      title: 'Samaveta X Serafini',
      group: 'serafini',
      img: '/group/6.png',
      projects: 'serafini',
    },
    {
      id: 7,
      title: 'Monsformer X Blum',
      group: 'monsformer',
      img: '/group/7.png',
      projects: 'monsformer',
    },
    // {
    //   id: 8,
    //   title: 'Matilda 2025',
    //   group: 'matilda-2025',
    //   img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUWsDqoIrSVLpqPbsdCUAMXZB0lT2vrWw4RhOu',
    //   projects: 'matilda-2025',
    // },
    // {
    //   id: 9,
    //   title: 'Conference Monster Table',
    //   group: 'conference_monster',
    //   img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUSbVP7zAKnraNxkI5vbez6dT2q8M0osBfR9At',
    //   projects: 'conference_monster',
    // },
    {
      id: 10,
      title: 'For Friends ',
      group: 'friends',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUw9Nbw65gi1vXhd2AYtoGrDFy59EOsBzTnN6e',
      projects: 'friends',
    },
  ];

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
            className='text-2xl md:text-4xl font-bold text-gray-300 pt-20 md:pt-7 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'
          >
            Collections
          </h1>
        </div>

        <main
          ref={gridRef}
          className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4 md:mx-14 my-10 md:my-6 '
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {products.map(({ title, img, group, id, index }) => (
            <SubProductCard
              key={index}
              title={title}
              img={img}
              id={group}
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

export default page;
