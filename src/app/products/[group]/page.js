'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Footer from '../../components/Footer';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import { products } from '@/app/components/products';

const GroupProductsPage = () => {
  const { group } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    // If there's a previous page in the history, go back
    if (window.history.length > 1) {
      router.back();
    } else {
      // Otherwise, navigate to the fallback route
      router.push(`/products/${group}`);
    }
  };

  useEffect(() => {
    // Filter products based on group from static data
    const groupProducts = products.filter((product) => product.group === group);
    setFilteredProducts(groupProducts);
  }, [group]);

  return (
    <div className='min-h-screen flex flex-col bg-black'>
      <div className=' min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={true} />
        {/* <Navbar arrow={true} /> */}
        <div className='pt-12 px-4 sm:px-6 lg:px-8 '>
          <div className='w-full text-center flex justify-center'>
            <h1 className='text-4xl font-bold text-gray-300  pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'>
              {group.replace('_', ' ')}
            </h1>
          </div>

          <div className='flex justify-center items-center'>
            <div className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4'>
              {filteredProducts.map(({ title, images, _id, index }) => (
                <ProductCard
                  title={title}
                  img={images[0]?.filePath}
                  id={_id.$oid}
                  key={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GroupProductsPage;
