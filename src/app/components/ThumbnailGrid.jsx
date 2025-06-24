'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid3X3 } from 'lucide-react';

const ThumbnailGrid = ({
  images,
  currentIndex,
  onImageSelect,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Grid Toggle Button */}
      <button
        onClick={onToggle}
        className='absolute top-4 right-4 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all z-20'
        title='View all images'
      >
        <Grid3X3 size={20} />
      </button>

      {/* Thumbnail Grid Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='relative max-w-2xl w-full'
            >
              <button
                onClick={onToggle}
                className='absolute -top-12 right-0 text-white hover:text-gray-300 transition z-40'
              >
                <X size={24} />
              </button>

              <div className='grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 bg-black/50 rounded-lg'>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onImageSelect(index);
                      onToggle();
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      currentIndex === index
                        ? 'border-white shadow-lg'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.thumbnail || image.filePath}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className='object-cover'
                      quality={60}
                      sizes='150px'
                    />
                    {currentIndex === index && (
                      <div className='absolute inset-0 bg-white/20 flex items-center justify-center'>
                        <div className='w-3 h-3 bg-white rounded-full'></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThumbnailGrid;
