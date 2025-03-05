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

const page = (params) => {
  const [data, setData] = useState({});
  const tempImageData = [
    {
      _id: 1,
      fileName: 'temp',
      filePath: '/assets/loading.gif',
    },
  ];
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
    if (window.history.length > 1) {
      router.back();
    } else {
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

  return (
    <div className='bg-black'>
      <div className='flex flex-col relative overflow-hidden'>
        <Navbar arrow={true} escape={true} />
        <div className='w-full h-screen p-0 m-0 bg-black'>
          <Element name=''>
            <CarouselComp imgArray={images} />
          </Element>
        </div>
        <Element name='newSection' className=' w-full m-0 p-0 hidden md:block'>
          <div className='w-full h-[2px] bg-zinc-200/50 border-b border-zinc-700'></div>
        </Element>
        <Element name='description' className='border-b-2 border-zinc-400 '>
          <DescAccordian
            scrollPosition={scrollPosition}
            desc={description}
            dimensions={dimensions}
            title={title}
          />
        </Element>
        <Element name='footer'>
          <Footer />
        </Element>
      </div>
    </div>
  );
};

export default page;
