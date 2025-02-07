import React from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';

const page = () => {
  return (
    // <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
    //   <Navbar />
    //   <div className='pt-24 z-10 max-w-7xl mx-auto'>
    //     <h1
    //       className={`text-3xl border-b-4 border-pink-400 pb-4 tracking-wider font-semibold uppercase px-8`}
    //     >
    //       products
    //     </h1>
    // <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
    //   <Navbar />
    //   <div className='pt-24 max-w-7xl mx-auto'>
    //     <h1 className='text-3xl border-b-4 border-blue-500 pb-4 tracking-wider font-semibold uppercase px-8'>
    //       Products
    //     </h1>
    // <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
    <div
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {/* <Navbar /> */}
      <div className='pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b border-gray-200 dark:border-gray-700'>
          Our Products
        </h1>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-6'>
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
