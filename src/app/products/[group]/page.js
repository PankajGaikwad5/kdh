'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Footer from '../../components/Footer';

const GroupProductsPage = () => {
  const { group } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchGroupProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        const data = await response.json();
        const groupProducts = data.products.filter(
          (product) => product.group === group
        );
        setFilteredProducts(groupProducts);
      } catch (error) {
        console.error('Error fetching group products:', error);
      }
    };

    if (group) {
      fetchGroupProducts();
    }
  }, [group]);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
      <div className='pt-12 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b border-gray-200 dark:border-gray-700 capitalize'>
          {group.replace('_', ' ')}
        </h1>

        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredProducts.map(({ title, images, _id }) => (
            <ProductCard
              title={title}
              img={images[0]?.filePath}
              id={_id}
              key={_id}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GroupProductsPage;
