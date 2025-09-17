'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react'; // optional, needs lucide-react installed

export function AccordionMarbles() {
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-col items-start justify-start'>
      {/* Header */}
      <button
        className='w-full flex items-center justify-between pt-4 gap-2  text-lg'
        onClick={() => setOpen(!open)}
      >
        SPECIAL REQUESTS MARBLES
        <ChevronDown
          className={`h-5 w-5 transform transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className='pt-3 flex flex-wrap gap-4 border-t'>
          {/* Example Item */}
          {/* Banswara */}
          <div className='flex flex-col items-start'>
            <Image
              width={70}
              height={70}
              src='/marbles/redtravertine.webp'
              alt='Red Travertine'
              className='aspect-square object-cover'
            />
            <p className='text-xs w-[80px] mt-2 break-words'>Red Travertine</p>
          </div>

          {/* Indian Black Bheslana */}
          <div className='flex flex-col items-start'>
            <Image
              width={70}
              height={70}
              src='/marbles/silvertravertine.webp'
              alt='Silver Travertine'
              className='aspect-square object-cover'
            />
            <p className='text-xs w-[80px] mt-2 break-words'>
              Silver Travertine
            </p>
          </div>

          {/* Indian Rosso Levante */}
          <div className='flex flex-col items-start'>
            <Image
              width={70}
              height={70}
              src='/marbles/statuario.webp'
              alt='Statuario'
              className='aspect-square object-cover'
            />
            <p className='text-xs w-[80px] mt-2 break-words'>Statuario</p>
          </div>

          {/* Italian Beige Travertine */}
          <div className='flex flex-col items-start'>
            <Image
              width={70}
              height={70}
              src='/marbles/titaniumtravertine.webp'
              alt='Titanium Travertine'
              className='aspect-square object-cover'
            />
            <p className='text-xs w-[80px] mt-2 break-words'>
              Titanium Travertine
            </p>
          </div>

          {/* Marquina */}
          <div className='flex flex-col items-start'>
            <Image
              width={70}
              height={70}
              src='/marbles/whitetravertine.webp'
              alt='White Travertine'
              className='aspect-square object-cover'
            />
            <p className='text-xs w-[80px] mt-2 break-words'>
              White Travertine
            </p>
          </div>

          {/* Add other marbles here... */}
        </div>
      )}
    </div>
  );
}
