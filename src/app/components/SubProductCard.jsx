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
      <CardContainer className='p-0'>
        <CardBody className='bg-white dark:bg-gray-800 rounded-xl p-4 max-w-72 max-h-72 md:max-w-max md:max-h-max border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300'>
          <CardItem translateZ='200' className='w-full mt-4'>
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
          </CardItem>

          <div className='mt-4 space-y-2 flex justify-between items-center'>
            {isLoading ? (
              <div className='w-full h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded'></div>
            ) : (
              <h3 className='text-sm font-bold text-gray-800 dark:text-gray-100 truncate text-center w-full uppercase'>
                {title}
              </h3>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default SubProductCard;
