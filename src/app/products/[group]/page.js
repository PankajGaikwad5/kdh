'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProductCard from '../../components/ProductCard';
import Footer from '../../components/Footer';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const GroupProductsPage = () => {
  const { group } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/products/${group}`);
    }
  };

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
    <div className='min-h-screen flex flex-col bg-black'>
      <div className=' min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={true} />
        <div className='pt-12 px-4 sm:px-6 lg:px-8 '>
          <div className='flex justify-center items-center'>
            <div className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4'>
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
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GroupProductsPage;
