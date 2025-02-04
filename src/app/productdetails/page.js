'use client';
import React, { useState, useEffect } from 'react';
import { Link, Element } from 'react-scroll';
import CarouselComp from '../components/CarouselComp';
import { Button } from '../components/ui/button';
import DescAccordian from '../components/DescAccordian';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const page = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const imgArray = [
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
  ];

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setScrollPosition(scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // const parallaxOffset = Math.max(0, scrollPosition - window.innerHeight);

  return (
    <div className='flex flex-col relative'>
      {/* <Link to='newSection' smooth={true} duration={500}>
        <button className='mt-4 p-2 bg-blue-500 text-white rounded'>
          Scroll to New Section
        </button>
      </Link> */}
      <div className='w-full h-screen p-0 m-0 bg-zinc-200/50'>
        <Element name=''>
          <CarouselComp imgArray={imgArray} />
        </Element>
      </div>
      <Element name='newSection' className=' w-full m-0 p-0 hidden md:block'>
        <div className='w-full h-6 bg-zinc-200/50 '></div>
        <div
          className='w-full p-4  border-y-[1px] border-zinc-400'
          // style={{
          //   transform: `translateY(${scrollPosition * 0.1}px)`, // Simple parallax effect
          //   transition: 'transform 0.1s ease-out',
          // }}
        >
          {' '}
          {/* <div className='flex justify-center items-center h-full'> */}
          <div className='flex justify-around text-lg uppercase text-zinc-700 items-center hover:text-zinc-400 transition-all duration-100 sticky top-0 z-10 px-6 py-0 font-semibold bg-white '>
            <Link to='description' smooth={true} duration={500}>
              <button className='text-lg uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                description
              </button>
            </Link>
            <Link to='inspiration' smooth={true} duration={500}>
              <button className='text-lg uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                inspiration
              </button>
            </Link>
            <Link to='dimensions' smooth={true} duration={500}>
              <button className='text-lg uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                dimensions & download
              </button>
            </Link>
            <Link to='designer' smooth={true} duration={500}>
              <button className='text-lg uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                designer
              </button>
            </Link>
          </div>
          {/* </div> */}
        </div>
      </Element>
      <Element name='description' className='border-b-2 border-zinc-400 '>
        <DescAccordian scrollPosition={scrollPosition} />
      </Element>
      <Element name='dimensions' className='border-b-2 border-zinc-400 '>
        <div className='p-4'>
          <div className='flex flex-col md:flex-row items-center text-zinc-700 px-4 md:px-8 justify-between'>
            <h1 className='uppercase font-bold my-4 md:text-xl'>
              Dimensions and Download
            </h1>
            <div className='flex space-x-8 md:space-x-14'>
              <button className='px-10 py-3 underline hover:bg-red-600 hover:text-white transition-all duration-300 border-zinc-500 border-2 hover:border-red-600 text-lg font-semibold'>
                Dimensions
              </button>
              <button className='px-10 py-3 bg-red-600 text-white hover:bg-red-600 hover:text-white transition-all duration-300 border-zinc-500  text-lg font-semibold'>
                Product sheet
              </button>
            </div>
          </div>
        </div>
      </Element>
      <Element name='footer'>
        <Footer />
      </Element>
      {/* <Link to='newSection' smooth={true} duration={500}>
        <button className='mt-4 p-2 bg-blue-500 text-white rounded'>
          Scroll to New Section
        </button>
      </Link> */}
    </div>
  );
};

export default page;
