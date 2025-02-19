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
      id: 1,
      title: 'Monster 1.0 Collection',
      group: 'monster_1.0',
      img: '/assets/products/1738926778783-Slide2.JPG',
      projects: 'monster basin, monster bathtub, monster console',
    },
    {
      id: 2,
      title: 'Monster 2.0 Collection',
      group: 'monster_2.0',
      img: '/assets/products/1738926974587-Slide4.JPG',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 3,
      title: 'Monster 3.0 Collection',
      group: 'monster_3.0',
      img: '/assets/products/1739952336217-Monster%20chai%20Opt%201.52.jpg',
      projects: 'gattoo x top brewer, yoda',
    },
    {
      id: 4,
      title: 'Matilda Collection',
      group: 'matilda',
      img: '/assets/products/1738927300853-Slide6.JPG',
      projects:
        'table lamp, library, partition screen, console 1, console 2, coffee table, center table 1, center table 2, basin, flower vase, planter, side table, u table, bathtub, chair, bench floor lamp',
    },
    {
      id: 5,
      title: 'Monster Collection',
      group: 'monster_collection',
      img: '/assets/products/1738928071412-Slide1.JPG',
      projects:
        'monster binty, monster brainy, monster gattooffer, monster guard, monster gum, monster grumpy, monster squinty',
    },
    {
      id: 6,
      title: 'Serafini X KD Bench',
      group: 'serafini',
      img: '/assets/products/1738930706115-Slide1.JPG',
      projects: 'serafini',
    },
    {
      id: 7,
      title: 'Monsformer',
      group: 'monsformer',
      img: '/assets/products/1738930738995-Slide4.JPG',
      projects: 'monsformer',
    },
  ];

  return (
    <div
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* <Navbar /> */}
      <div className='pt-12  px-4 sm:px-6 lg:px-8 '>
        <h1 className='text-4xl font-bold text-gray-900 max-w-5xl dark:text-white mb-8'>
          Our Products
        </h1>

        <div className='w-full flex justify-center'>
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 max-w-7xl lg:gap-x-10 border-t border-gray-200 pt-4'>
            {/* <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} /> */}
            {/* {imgArray.map(({ title, images, _id }) => {
            return (
              <ProductCard
                title={title}
                img={images[0].filePath}
                id={_id}
                key={_id}
              />
            );
          })} */}
            {products.map(({ title, img, id, group }) => {
              return (
                <SubProductCard title={title} img={img} id={group} key={id} />
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
