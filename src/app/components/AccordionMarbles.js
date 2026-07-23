'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react'; // optional, needs lucide-react installed

const normalizeKey = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/lavante/g, 'levante')
    .replace(/greenspider/g, 'spidergreen');
};

export function AccordionMarbles({ selectedMarble, onSelectMarble, product }) {
  const [open, setOpen] = useState(false);

  const specialMarbles = [
    { name: 'Red Travertine', src: '/marbles/redtravertine.webp' },
    { name: 'Silver Travertine', src: '/marbles/silvertravertine.webp' },
    { name: 'Statuario', src: '/marbles/statuario.webp' },
    { name: 'Titanium Travertine', src: '/marbles/titaniumtravertine.webp' },
    { name: 'White Travertine', src: '/marbles/whitetravertine.webp', rotate: true },
  ];

  return (
    <div className='flex flex-col items-start justify-start mt-4 w-full'>
      {/* Header */}
      <button
        className='w-full flex items-center justify-between gap-2 text-lg focus:outline-none'
        onClick={() => setOpen(!open)}
      >
        SPECIAL REQUESTS MARBLES
        <ChevronDown
          className={`h-5 w-5 transform transition-transform -mt-2 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className='pt-3 flex flex-wrap gap-4 border-t border-white/10 w-full'>
          {specialMarbles.map((marble) => {
            const isSelected = selectedMarble === marble.name;
            const hasCustomImages = !!(
              product?.marbleImages &&
              (() => {
                const targetKey = normalizeKey(marble.name);
                const matchedKey = Object.keys(product.marbleImages).find(
                  (key) => normalizeKey(key) === targetKey
                );
                return matchedKey ? product.marbleImages[matchedKey].length > 0 : false;
              })()
            );
            return (
              <button
                key={marble.name}
                onClick={() => onSelectMarble?.(marble.name)}
                className='flex flex-col items-center text-center focus:outline-none group relative transition-transform duration-200 hover:scale-105'
                title={
                  hasCustomImages
                    ? `Click to view product in ${marble.name}`
                    : `View ${marble.name} option`
                }
              >
                <div className='relative w-[70px] h-[70px] overflow-hidden rounded-md'>
                  <Image
                    width={70}
                    height={70}
                    src={marble.src}
                    alt={marble.name}
                    className={`aspect-square object-cover transition-all duration-300 ${
                      marble.rotate ? 'rotate-90' : ''
                    } ${
                      isSelected
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-95 opacity-100'
                        : 'opacity-85 group-hover:opacity-100'
                    }`}
                  />
                  {hasCustomImages && !isSelected && (
                    <span className='absolute bottom-1 right-1 w-2.5 h-2.5 bg-white border border-black rounded-full shadow' />
                  )}
                </div>
                <p
                  className={`text-xs w-[80px] mt-2 break-words transition-colors duration-200 ${
                    isSelected
                      ? 'text-white font-semibold'
                      : 'text-gray-400 group-hover:text-white'
                  }`}
                >
                  {marble.name}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
