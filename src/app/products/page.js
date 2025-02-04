import React from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import ProductCard from '../components/ProductCard';

const page = () => {
  return (
    <div className=''>
      <Navbar />
      <div className='pt-24'>
        <h1
          className={`text-3xl border-b-4 border-pink-400 pb-4 tracking-wider  font-semibold uppercase px-8`}
        >
          projects
        </h1>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full p-6 m-0 bg-gray-200/20'>
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
          <ProductCard title='first product' img={'/img/1.jpg'} />
        </div>
      </div>
    </div>
  );
};

export default page;
