'use client';
import React, { useState, useEffect } from 'react';
import { Link, Element } from 'react-scroll';
import CarouselComp from '../../components/CarouselComp';
import { Button } from '../../components/ui/button';
import DescAccordian from '../../components/DescAccordian';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import Footer from '../../components/Footer';
import getId from '@/app/components/getId';
import Navbar from '@/app/components/Navbar';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import Navbar from '../components/Navbar';

const page = (params) => {
  const [data, setData] = useState({});
  const tempImageData = [
    {
      _id: 1,
      fileName: 'temp',
      filePath: '/assets/loading.gif',
    },
    {
      _id: 2,
      fileName: 'temp',
      filePath: '/assets/loading.gif',
    },
  ];
  // const { id } = params;
  // console.log(id);
  const [scrollPosition, setScrollPosition] = useState(0);
  const imgArray = [
    {
      fileName: 1,
      filepath: '/monster_basin_p/1.jpg',
    },
    {
      fileName: 2,
      filepath: '/monster_basin_p/1.jpg',
    },
    {
      fileName: 3,
      filepath: '/monster_basin_p/1.jpg',
    },
    {
      fileName: 4,
      filepath: '/monster_basin_p/1.jpg',
    },
  ];

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setScrollPosition(scrollTop);
  };

  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    // If there's a previous page in the history, go back
    if (window.history.length > 1) {
      router.back();
    } else {
      // Otherwise, navigate to the fallback route
      router.push(`/products/${group}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getId(params); // Wait for the async function
      if (result) {
        setData(result);
        // console.log(result);
      }
    };

    fetchData();
  }, [params]);
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const title = data?.products?.title || 'Loading...';
  const description = data?.products?.description || 'Loading...';
  const dimensions = data?.products?.dimensions || 'Loading...';
  const images = data?.products?.images || tempImageData;
  const group = data?.products?.group || '#';

  // const parallaxOffset = Math.max(0, scrollPosition - window.innerHeight);

  return (
    <div className=''>
      <div className='flex flex-col relative overflow-hidden'>
        {/* <button
          className='fixed z-10 left-4 md:left-12 bottom-6 md:bottom-10 bg-white text-black p-2 border-2 border-black rounded-full'
          onClick={handleClick}
        >
          <ArrowLeft size={25} />
        </button> */}
        <Navbar arrow={true} escape={true} />
        {/* <Link to='newSection' smooth={true} duration={500}>
        <button className='mt-4 p-2 bg-blue-500 text-white rounded'>
          Scroll to New Section
        </button>
      </Link> */}
        <div className='w-full h-screen p-0 m-0 bg-black'>
          <Element name=''>
            <CarouselComp imgArray={images} />
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
            <div className='flex justify-around text-md uppercase text-zinc-700 items-center hover:text-zinc-400 transition-all duration-100 sticky top-0 z-10 px-6 py-0 font-semibold bg-white '>
              <Link to='description' smooth={true} duration={500}>
                <button className='text-md uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                  description
                </button>
              </Link>
              <Link to='inspiration' smooth={true} duration={500}>
                <button className='text-md uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                  inspiration
                </button>
              </Link>
              <Link to='dimensions' smooth={true} duration={500}>
                <button className='text-md uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                  dimensions & download
                </button>
              </Link>
              <Link to='designer' smooth={true} duration={500}>
                <button className='text-md uppercase font-semibold hover:text-zinc-900 transition-all duration-500'>
                  designer
                </button>
              </Link>
            </div>
            {/* </div> */}
          </div>
        </Element>
        <Element name='description' className='border-b-2 border-zinc-400 '>
          <DescAccordian
            scrollPosition={scrollPosition}
            desc={description}
            dimensions={dimensions}
            title={title}
          />
        </Element>
        <Element name='dimensions' className='border-b-2 border-zinc-400 '>
          <div className='p-4'>
            <div className='flex flex-col md:flex-row items-center text-zinc-700 px-4 md:px-8 justify-between'>
              <h1 className='uppercase font-bold my-4 md:text-lg'>
                Dimensions and Download
              </h1>
              <div className='flex  flex-col justify-center items-center md:flex-row gap-4 md:space-x-14 px-4'>
                <button className='px-4 py-2 md:px-10 md:py-2 underline hover:bg-red-600 hover:text-white transition-all duration-500 border-zinc-500 border-2 hover:border-red-600 text-base font-semibold'>
                  Dimensions
                </button>
                <button className='px-4 py-2 md:px-10 md:py-2 bg-red-600 text-white hover:bg-red-500 hover:text-white transition-all duration-300 border-zinc-500  text-base font-semibold'>
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
    </div>
  );
};

export default page;
