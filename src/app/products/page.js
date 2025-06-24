'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import SubProductCard from '../components/SubProductCard';
import Footer from '../components/Footer';

const page = () => {
  const [imgArray, setImgArray] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      const { products } = data;
      setImgArray(products);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const products = [
    {
      id: 3,
      title: 'Monster 3.0 X Dimensions',
      group: 'monster_3.0',
      img: '/group/1.png',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 2,
      title: 'Monster 2.0 Collection',
      group: 'monster_2.0',
      img: '/group/2.png',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 1,
      title: 'Monster 1.0 Collection',
      group: 'monster_1.0',
      img: '/group/3.png',
      projects: 'monster basin, monster bathtub, monster console',
    },
    {
      id: 4,
      title: 'Matilda 2024',
      group: 'matilda-2024',
      img: '/group/4.png',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 11,
      title: 'Matilda 2025',
      group: 'matilda-2025',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUWsDqoIrSVLpqPbsdCUAMXZB0lT2vrWw4RhOu',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 5,
      title: 'Monster Collectibles',
      group: 'monster_collectibles',
      img: '/group/5.png',
      projects:
        'monster binty, monster brainy, monster gattooffer, monster guard, monster gum, monster grumpy, monster squinty',
    },
    {
      id: 6,
      title: 'KD X Serafini',
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
      <div className='min-h-screen flex flex-col bg-gradient-to-b bg-black'>
        <Navbar />
        {/* Grid container fills the available vertical space */}

        <main className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4 md:mx-14 my-10 md:my-6 '>
          {products.map(({ title, img, group, id }) => (
            <SubProductCard
              key={id}
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
