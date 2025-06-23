'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import Link from 'next/link';

const SubProductCard = ({ title, img, id, hoveredIndex, setHoveredIndex }) => {
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = () => {
    window.location.href = `/products/${id}`;
  };

  return (
    <Link href={`/products/${id}`}>
      <div
        onMouseEnter={() => setHoveredIndex(id)}
        onMouseLeave={() => setHoveredIndex(null)}
        // onClick={navigateTo}
        className={`cursor-pointer  hover:scale-[1.02] transform transition duration-300 ${
          hoveredIndex !== null && hoveredIndex !== id
            ? 'blur-[2px]'
            : 'blur-0 z-40'
        }`}
      >
        <div className='p-0'>
          <div className='duration-300'>
            <div className='w-full mt-4'>
              <div className='w-full aspect-[4/3] relative  flex justify-center items-center rounded-lg'>
                {isLoading && (
                  <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
                )}
                <Image
                  src={img}
                  width='300'
                  height='300'
                  loading='lazy'
                  className={`object-cover transition-transform duration-300 rounded hover:scale-[1.70] `}
                  alt={title}
                  onLoad={() => setIsLoading(false)}
                />
              </div>
            </div>

            <div className='mt-4 space-y-2 flex justify-between items-center'>
              {isLoading ? (
                <div className='w-full h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded'></div>
              ) : (
                <h3 className='text-[0.75rem] md:text-sm font-bold text-white truncate text-center w-full uppercase'>
                  {title}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SubProductCard;
