// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X, Grid3X3 } from 'lucide-react';

// const ThumbnailGrid = ({
//   images,
//   currentIndex,
//   onImageSelect,
//   isOpen,
//   onToggle,
// }) => {
//   return (
//     <>
//       {/* Grid Toggle Button */}
//       <button
//         onClick={onToggle}
//         className='absolute top-4 right-4 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all z-20'
//         title='View all images'
//       >
//         <Grid3X3 size={20} />
//       </button>

//       {/* Thumbnail Grid Modal */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className='absolute inset-0 bg-black/90 backdrop-blur-sm z-30 flex items-center justify-center p-4'
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className='relative max-w-2xl w-full'
//             >
//               <button
//                 onClick={onToggle}
//                 className='absolute -top-12 right-0 text-white hover:text-gray-300 transition z-40'
//               >
//                 <X size={24} />
//               </button>

//               <div className='grid grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-4 bg-black/50 rounded-lg'>
//                 {images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       onImageSelect(index);
//                       onToggle();
//                     }}
//                     className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
//                       currentIndex === index
//                         ? 'border-white shadow-lg'
//                         : 'border-gray-600 hover:border-gray-400'
//                     }`}
//                   >
//                     <Image
//                       src={image.thumbnail || image.filePath}
//                       alt={`Thumbnail ${index + 1}`}
//                       fill
//                       className='object-cover'
//                       quality={60}
//                       sizes='150px'
//                     />
//                     {currentIndex === index && (
//                       <div className='absolute inset-0 bg-white/20 flex items-center justify-center'>
//                         <div className='w-3 h-3 bg-white rounded-full'></div>
//                       </div>
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default ThumbnailGrid;
'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Grid3X3 } from 'lucide-react';
import { useEffect } from 'react';

const ThumbnailGrid = ({
  images,
  currentIndex,
  onImageSelect,
  isOpen,
  onToggle,
  onEscape,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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
            className='fixed inset-0 bg-transparent backdrop-blur-md z-50 flex items-center justify-center p-6'
            onClick={onToggle}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='relative  w-full bg-gradient-to-br bg-transparent backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className='flex items-center justify-between p-6 border-b border-white/10'>
                <h3 className='text-xl font-light text-white'>All Images</h3>
                <button
                  onClick={onToggle}
                  className='text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full'
                >
                  <X size={20} />
                </button>
              </div>

              {/* Thumbnail Grid */}
              <div className='p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent'>
                <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                  {images.map((image, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      onClick={() => {
                        onImageSelect(index);
                        onToggle();
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
                        currentIndex === index
                          ? 'border-white shadow-white/25 shadow-lg ring-2 ring-white/30'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      <Image
                        src={image.filePath}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-110'
                        quality={70}
                        sizes='200px'
                      />

                      {/* Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

                      {/* Current indicator */}
                      {currentIndex === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className='absolute inset-0 flex items-center justify-center'
                        >
                          <div className='w-4 h-4 bg-white rounded-full shadow-lg border-2 border-black/20'></div>
                        </motion.div>
                      )}

                      {/* Image number */}
                      <div className='absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                        {index + 1}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className='px-6 py-4 border-t border-white/10 bg-black/20'>
                <p className='text-sm text-gray-400 text-center'>
                  Click any image to view • {images.length} images total
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThumbnailGrid;
