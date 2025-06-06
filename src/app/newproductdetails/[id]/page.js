'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['300', '400', '600', '700'], // Specify weight
});

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'max-age=300',
          },
        });

        if (!res.ok) return console.error('Failed to fetch product');

        const data = await res.json();
        if (!data?.products) return;

        setProduct(data.products);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching product:', error);
        }
      }
    };

    fetchData();
    // return () => controller.abort();
  }, [params]);

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (!product)
    return <div className='text-center py-20 text-gray-500'>Loading...</div>;

  return (
    <main
      className={`min-h-screen bg-white text-black font-sans relative ${montserrat.className}`}
    >
      {/* Header with logo and close button */}
      <header className='fixed top-0 left-0 w-full flex justify-between items-center p-4 z-50 bg-white/80 backdrop-blur border-b border-gray-200'>
        <Image
          src='/assets/kdhlogo2.png'
          alt='Logo'
          width={150}
          height={40}
          className='object-contain'
        />
        <button
          onClick={() => router.back()}
          className='text-black hover:text-gray-600 transition'
        >
          <X size={28} />
        </button>
      </header>

      <div className='grid md:grid-cols-2 pt-20'>
        {/* Left: Image Carousel */}
        <section className='relative p-4 flex items-center justify-center '>
          {product.images?.length > 0 && (
            <div className='relative w-full h-[80vh] overflow-hidden rounded-lg'>
              <AnimatePresence mode='wait'>
                <motion.img
                  key={currentIndex}
                  src={product.images[currentIndex].filePath}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className='w-full h-full object-contain'
                />
              </AnimatePresence>

              {/* Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-black bg-white/70 border border-gray-300 rounded-full p-2 hover:bg-black hover:text-white'
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-black bg-white/70 border border-gray-300 rounded-full p-2 hover:bg-black hover:text-white'
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}
        </section>

        {/* Right: Details */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='p-10 flex flex-col justify-between bg-white z-10'
        >
          <div>
            <h1 className='text-4xl md:text-4xl  mb-6 capitalize font-light'>
              {product.title}
            </h1>
            <div className='flex flex-col gap-4 text-sm'>
              <div className='grid grid-cols-3'>
                <div>
                  <h4 className='font-semibold  text-gray-500 text-xs mb-1'>
                    Dimension
                  </h4>
                  <p className='text-gray-900'>
                    {product.dimensions?.includes('http') ? (
                      <a
                        href={product.dimensions}
                        target='_blank'
                        className='underline text-blue-600 hover:text-blue-400'
                      >
                        View Dimensions
                      </a>
                    ) : (
                      product.dimensions
                    )}
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold  text-gray-500 text-xs mb-1'>
                    Lead Time
                  </h4>
                  <p className='text-gray-900'>30 Days</p>
                </div>
                <div>
                  <h4 className='font-semibold  text-gray-500 text-xs mb-1'>
                    Material
                  </h4>
                  <p className='text-gray-900'>Brass and Glass</p>
                </div>
              </div>

              <div className='mt-6 border-t border-gray-300 pt-4 text-sm text-black whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>

              <div className='mt-10 flex gap-4'>
                <a href={product.pdf} target='_blank' rel='noopener noreferrer'>
                  <Button
                    variant='outline'
                    className='px-6 py-2 border border-black text-black rounded-none hover:bg-gray-100'
                  >
                    Download Spec Sheet
                  </Button>
                </a>
                <Button className='px-6 py-2 border border-black bg-black text-white rounded-none hover:bg-gray-800'>
                  Enquire
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
