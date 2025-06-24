'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ProductCard = ({ title, img, id, hoveredIndex, setHoveredIndex }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link href={`/productdetails/${id}`}>
      <div
        onMouseEnter={() => setHoveredIndex(id)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`
          group cursor-pointer transform transition flex flex-col justify-center items-center duration-300 hover:scale-[1.02] hover:z-20
          ${
            hoveredIndex !== null && hoveredIndex !== id
              ? 'blur-[2px]'
              : 'blur-0'
          }
        `}
      >
        {/* This wrapper allows the image to pop out */}
        <div className='w-full max-w-[300px] aspect-[4/3] relative rounded-lg overflow-visible group-hover:overflow-visible'>
          {isLoading && (
            <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg' />
          )}

          <Image
            src={img}
            alt={title}
            fill
            className='object-contain transition-transform duration-300 
               group-hover:scale-[1.70]'
            onLoad={() => setIsLoading(false)}
          />
        </div>

        <div className='mt-4 space-y-2 flex justify-center'>
          {isLoading ? (
            <div className='w-3/4 h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded' />
          ) : (
            <h3 className='text-[0.75rem] md:text-sm font-bold text-white text-center uppercase'>
              {title}
            </h3>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
