'use client';
import { useEffect } from 'react';
import CarouselComp from './CarouselComp';
import DescAccordian from './DescAccordian';
import { X } from 'lucide-react';

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => (document.body.style.overflow = 'auto');
  }, []);

  return (
    <div className='relative min-h-screen'>
      <button
        onClick={onClose}
        className='fixed top-4 right-4 z-50 p-2 text-white hover:text-gray-300 transition-colors'
      >
        <X size={24} />
      </button>

      <div className='w-full h-screen p-0 m-0'>
        <CarouselComp imgArray={product.images} />
      </div>

      <div className='w-full h-[2px] bg-zinc-200/50 border-b border-zinc-700 hidden md:block' />

      <div className='border-b-2 border-zinc-400'>
        <DescAccordian
          desc={product.description}
          dimensions={product.dimensions}
          title={product.title}
        />
      </div>
    </div>
  );
};

export default ProductModal;
