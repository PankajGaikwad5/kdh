'use client';
import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '../../components/ui/3d-card';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';

const ProductCard = ({ title, img, id }) => {
  // const router = useRouter();

  const navigateTo = () => {
    window.location.href = `/productdetails/${id}`;
  };

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      onClick={navigateTo}
      className='cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:z-20'
      // /assets/products/1738927177034-Slide1.JPG
    >
      <div className='p-0'>
        <div className='duration-300'>
          <div className='w-full mt-4'>
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
              <h3 className='text-[0.75rem] md:text-sm font-bold text-white truncate text-center w-full uppercase'>
                {title}
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
