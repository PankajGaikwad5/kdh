import React from 'react';
import { Poppins, Montserrat, Bebas_Neue } from 'next/font/google';
import { Instagram } from 'lucide-react';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';

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
const bebas = Bebas_Neue({
  subsets: ['latin'], // Specify subsets
  weight: ['400'], // Specify weight
});

const Footer = () => {
  return (
    <div className=' flex flex-col '>
      <div className='pt-4 flex-col flex md:flex-row md:justify-evenly space-x-12 border-t '>
        {/* <div className='flex flex-col md:flex-row gap-4 text-start px-4'>
        <a href='/'>
          <img src='/assets/kdhlogo1.png' alt='' className=' md:w-40' />
        </a>
        <div
          className={`flex items-center text-xl text-zinc-800 font-medium hover:text-zinc-300  uppercase tracking-widest  gap-6   `}
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
      </div>
      <div
        className={`flex items-center  text-xl text-zinc-800 font-medium hover:text-zinc-300  uppercase tracking-widest  gap-6  `}
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
      </div> */}
        <div className='flex py-4 justify-center items-center px-4'>
          <a href='/'>
            <img src='/assets/kdhlogo2.png' alt='' className='w-48 md:w-56' />
          </a>
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
          className={`flex flex-col text-xl text-zinc-800 font-medium mt-4 md:mt-0 hover:text-zinc-300  uppercase tracking-widest  line-clamp-6 space-y-4`}
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
          <div className='my-4 flex gap-4 items-center'>
            <a
              href='https://www.instagram.com/karandesaihome/'
              target='_blank'
              className='hover:text-pink-600 transition-all duration-500'
            >
              <Instagram />
            </a>
            <a
              href='https://wa.me/+917977112242'
              target='_blank'
              className='hover:text-green-600 transition-all duration-500'
            >
              <FaWhatsapp size={25} />
            </a>
            <a
              href='instagram.com'
              target='_blank'
              className='hover:text-blue-600 transition-all duration-500'
            >
              <FaLinkedin size={25} />
            </a>
          </div>
        </div>
      </div>
      <div
        className={`w-full p-4 flex justify-between items-center uppercase text-black/60 ${bebas.className} tracking-widest text-base font-bold`}
      >
        <a
          target='_blank'
          href='https://www.karandesai.in/'
          className='hover:text-black hover:scale-95 transition-all duration-300'
        >
          kdad
        </a>
        <a
          target='_blank'
          href='https://www.karandesai.in/shukhabar'
          className='hover:text-black hover:scale-95 transition-all duration-300'
        >
          shukhabar
        </a>
      </div>
    </div>
  );
};

export default Footer;
