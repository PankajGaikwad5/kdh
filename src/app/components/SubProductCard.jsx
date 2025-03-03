'use client';
import { useState } from 'react';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';

const SubProductCard = ({ title, img, id }) => {
  const [isLoading, setIsLoading] = useState(true);

  const navigateTo = () => {
    window.location.href = `/products/${id}`;
  };

  return (
    <div
      onClick={navigateTo}
      className='cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:z-20'
    >
      <div className='p-0'>
        <div className=' shadow-sm transition-shadow duration-300'>
          <div translateZ='200' className='w-full mt-4'>
            <div className='w-full aspect-[4/3] relative overflow-hidden flex justify-center items-center rounded-lg'>
              {isLoading && (
                <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
              )}
              <Image
                src={img}
                width='300'
                height='300'
                loading='lazy'
                className={`object-cover transition-transform duration-300 rounded hover:scale-105 `}
                alt={title}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>

          <div className='mt-4 space-y-2 flex justify-between items-center'>
            {isLoading ? (
              <div className='w-full h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded'></div>
            ) : (
              <h3 className='text-[0.75rem] md:text-sm font-bold text-gray-800 dark:text-gray-100 truncate text-center w-full uppercase'>
                {title}
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProductCard;
