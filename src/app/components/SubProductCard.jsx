'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const SubProductCard = ({ title, img, id, hoveredIndex, setHoveredIndex }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSize, setImageSize] = useState(300); // default image size

  // Detect screen width and update image size
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setImageSize(500); // 2xl+
      } else if (width >= 1280) {
        setImageSize(360); // xl
      } else {
        setImageSize(300); // default
      }
    };

    updateSize(); // run once on mount
    window.addEventListener('resize', updateSize); // listen to screen resize

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <Link href={`/collections/${id}`}>
      <div
        onMouseEnter={() => setHoveredIndex(id)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`
                group cursor-pointer transform transition flex flex-col justify-center items-center duration-300 hover:scale-[1.02] hover:z-20
                ${
                  hoveredIndex !== null && hoveredIndex !== id
                    ? 'blur-0'
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

export default SubProductCard;
