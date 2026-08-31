'use client';
import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Collections', href: '/collections' },
  { label: 'Mandirs', href: 'mandirs' },
  // { label: 'Catalogue', href: '/catalogue' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'Contact us', href: '/contact' },
];

const Footer = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className='flex flex-col bg-black text-xs md:text-xs 2xl:text-sm font-semibold relative z-10 '>
      <div className='py-2 flex-col w-full flex md:flex-row md:justify-evenly items-center space-x-1 border-t'>
        <div className='flex py-4 justify-center items-center px-4'>
          <Link href='/'>
            <img
              src='/assets/kdhlogo3.png'
              alt=''
              className='w-48 md:w-24 2xl:w-44'
            />
          </Link>
        </div>
        <div className='flex flex-col md:flex-row items-center text-white font-medium uppercase tracking-widest text-center md:space-x-4 space-y-1 md:space-y-0 md:-ml-44 '>
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                hover:scale-90 hover:text-white 
                transition-all duration-300 
                ${
                  hoveredIndex !== null && hoveredIndex !== index
                    ? 'blur-[2px]'
                    : 'blur-0'
                }
              `}
            >
              {link.label}
            </Link>
          ))}
          <div className='my-4 md:my-0 flex gap-4 items-center py-4 md:py-0 justify-center xl:text-xl'>
            <Link
              href='https://www.instagram.com/karandesaihome/'
              target='_blank'
              className='hover:text-pink-600 transition-all duration-500'
            >
              <Instagram />
            </Link>
            <Link
              href='https://www.youtube.com/@KarandesaiAD'
              target='_blank'
              className='hover:text-pink-600 transition-all duration-500'
            >
              <FaYoutube />
            </Link>
            <Link
              href='https://wa.me/+917977112242'
              target='_blank'
              className='hover:text-green-600 transition-all duration-500'
            >
              <FaWhatsapp size={25} />
            </Link>
            <Link
              href='https://www.linkedin.com/in/karandesaiad/'
              target='_blank'
              className='hover:text-blue-600 transition-all duration-500'
            >
              <FaLinkedin size={25} />
            </Link>
          </div>
        </div>
      </div>
      {/* Bottom bar for Copyright and Legal Links */}
      <div className='border-t border-zinc-900 py-4 w-full flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4 text-[10px] text-zinc-500 font-light tracking-wider bg-zinc-950/40'>
        <span>&copy; {new Date().getFullYear()} KARAN DESAI HOME. ALL RIGHTS RESERVED.</span>
        <span className='hidden md:inline text-zinc-800'>|</span>
        <div className='flex gap-4'>
          <Link href='/privacy-policy' className='hover:text-white transition-colors duration-300 uppercase'>
            Privacy Policy
          </Link>
          <span className='text-zinc-800'>|</span>
          <Link href='/terms-and-conditions' className='hover:text-white transition-colors duration-300 uppercase'>
            Terms & Conditions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
