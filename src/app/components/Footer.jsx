'use client';
import React, { useState } from 'react';
import { Poppins, Montserrat, Bebas_Neue } from 'next/font/google';
import { Instagram } from 'lucide-react';
import { FaWhatsapp, FaLinkedin } from 'react-icons/fa';

// Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
});

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Catalogue', href: '/catalogue' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Contact us', href: '/contact' },
];

const Footer = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className='flex flex-col bg-black text-sm font-semibold'>
      <div className='py-2 flex-col w-full flex md:flex-row md:justify-evenly items-center space-x-1 border-t'>
        <div className='flex py-4 justify-center items-center px-4'>
          <a href='/'>
            <img src='/assets/kdhlogo3.png' alt='' className='w-48 md:w-40' />
          </a>
        </div>
        <div className='flex flex-col md:flex-row text-white font-medium uppercase tracking-widest text-center md:space-x-4 space-y-1 md:space-y-0 md:-ml-44'>
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                transition-all duration-300 
                hover:scale-90 hover:text-white 
                ${
                  hoveredIndex !== null && hoveredIndex !== index
                    ? 'blur-sm'
                    : 'blur-0'
                }
              `}
            >
              {link.label}
            </a>
          ))}
          <div className='my-4 md:my-0 flex gap-4 items-center py-4 md:py-0 justify-center'>
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
              href='https://www.linkedin.com/in/karandesaiad/'
              target='_blank'
              className='hover:text-blue-600 transition-all duration-500'
            >
              <FaLinkedin size={25} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
