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
      <CardContainer className='p-0'>
        <CardBody className='bg-white dark:bg-gray-800 rounded-xl p-4 max-w-72 max-h-72 md:max-w-max md:max-h-max border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300'>
          <CardItem
            translateZ='200'
            // rotateX={20}
            // rotateZ={-10}
            className='w-full mt-4'
          >
            <div className='w-full aspect-[4/3] relative overflow-hidden flex justify-center items-center rounded-lg'>
              {/* <Image
                src={img}
                // fill
                width='1000'
                height='1000'
                loading='lazy'
                // sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover transition-transform duration-300 rounded hover:scale-105'
                alt={title}
              /> */}
              {isLoading && (
                <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse'></div>
              )}
              <Image
                src={img}
                width='1000'
                height='1000'
                loading='lazy'
                className={`object-cover transition-transform duration-300 rounded hover:scale-105 ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                alt={title}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </CardItem>

          <div className='mt-4 space-y-2 flex justify-between items-center'>
            {isLoading ? (
              <div className='w-full h-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded'></div>
            ) : (
              <h3 className='text-lg text-gray-800 dark:text-gray-100 truncate text-center w-full uppercase font-semibold'>
                {title}
              </h3>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default ProductCard;
