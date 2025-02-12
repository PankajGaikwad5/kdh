'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const page = () => {
  const [imgArray, setImgArray] = useState([]);
  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/products`);
      const data = await response.json();
      const { products } = data;
      // console.log(products);
      setImgArray(products);
      // console.log(data);
      // console.log(products);
      // console.log(imgArray);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  // React.useEffect(() => {
  //   console.log('Updated imgArray:', imgArray);
  // }, [imgArray]);
  return (
    <div
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* <Navbar /> */}
      <div className='pt-12 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b border-gray-200 dark:border-gray-700'>
          Our Products
        </h1>

        {/* <div className='w-full flex justify-center'> */}
        <div className='grid  sm:grid-cols-2 lg:grid-cols-3'>
          {/* <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} /> */}
          {imgArray.map(({ title, images, _id }) => {
            return (
              <ProductCard
                title={title}
                img={images[0].filePath}
                id={_id}
                key={_id}
              />
            );
          })}
        </div>
        {/* </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default page;
