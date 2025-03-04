'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import SubProductCard from '../components/SubProductCard';
import Footer from '../components/Footer';

const page = () => {
  const [imgArray, setImgArray] = useState([]);
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
      title: 'Monster 3.0 Collection',
      group: 'monster_3.0',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUnYy0rpbYcoeRKumWaHxyTj5q3bfMXB6INAUz',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 2,
      title: 'Monster 2.0 Collection',
      group: 'monster_2.0',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUMeOsVlwfQbC4M3ZGkSm6KPAV10HlYU9dinrX',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 1,
      title: 'Monster 1.0 Collection',
      group: 'monster_1.0',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUreGqMKNnDI67jcCaomXhZLsJd91f4YGitMHP',
      projects: 'monster basin, monster bathtub, monster console',
    },
    {
      id: 4,
      title: 'Matilda Collection',
      group: 'matilda',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUA1rftpJ1oeY2wnF0zQbWX83C4KujdSqt6MUT',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 5,
      title: 'Monster Collectibles',
      group: 'monster_collection',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKU8C1mTl64oKUn37W6wsTlRmDBFhGrviIjcMxV',
      projects:
        'monster binty, monster brainy, monster gattooffer, monster guard, monster gum, monster grumpy, monster squinty',
    },
    {
      id: 6,
      title: 'KD Bench X Serafini',
      group: 'serafini',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUDRVbUDg8FYI8sxbtc2ngQN4ZeSPwOKkv5yAj',
      projects: 'serafini',
    },
    {
      id: 7,
      title: 'Monsformer X Blum',
      group: 'monsformer',
      img: 'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUJw4h4udtZQpOq9no3vVs5yPKXR8gEYuikGUw',
      projects: 'monsformer',
    },
  ];

  return (
    <>
      <div className='min-h-screen flex flex-col bg-gradient-to-b bg-black'>
        <Navbar />
        {/* Grid container fills the available vertical space */}

        <main className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4 '>
          {products.map(({ title, img, group, id }) => (
            <SubProductCard key={id} title={title} img={img} id={group} />
          ))}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default page;
