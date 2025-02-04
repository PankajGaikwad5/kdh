import React from 'react';
import { Poppins, Montserrat } from 'next/font/google';
import { Instagram } from 'lucide-react';

// popins
// montserrat
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});

const Footer = () => {
  return (
    <div className='py-14 px-8 flex flex-col md:flex-row md:justify-evenly'>
      <div className='flex flex-col  text-start px-4'>
        {/* <a href='/'> */}
        <img src='/assets/kdhlogo1.png' alt='' className=' md:w-1/2' />
        {/* </a> */}
      </div>
      <div
        className={`flex flex-col text-xl text-zinc-800 font-medium hover:text-zinc-300  uppercase tracking-widest  line-clamp-6 space-y-4 md:-ml-44`}
      >
        <a
          href='/about'
          className='hover:scale-90 hover:text-zinc-900 transition-all duration-300'
        >
          About
        </a>
        <a
          href='/products'
          className='hover:scale-90 hover:text-zinc-900 transition-all duration-300'
        >
          Products
        </a>
        <a
          href='/catalogue'
          className='hover:scale-90 hover:text-zinc-900 transition-all duration-300'
        >
          Catalogue
        </a>
      </div>
      <div
        className={`flex flex-col text-xl text-zinc-800 font-medium hover:text-zinc-300  uppercase tracking-widest  line-clamp-6 space-y-4`}
      >
        <a
          href='/collaborations'
          className='hover:scale-90 hover:text-zinc-900 transition-all duration-300'
        >
          Collaborations
        </a>
        <a
          href='/contact'
          className='hover:scale-90 hover:text-zinc-900 transition-all duration-300'
        >
          Contact us
        </a>
      </div>
      {/* <div className='my-4'>
        <a
          href='instagram.com'
          className='hover:text-blue-600 transition-all duration-500'
        >
          <Instagram />
        </a>
      </div> */}
    </div>
  );
};

export default Footer;
