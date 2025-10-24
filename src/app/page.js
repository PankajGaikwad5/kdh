'use client';
import React, { useEffect, useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingImagesScene from './components/FloatingImagesScene';
import Image from 'next/image';

const page = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const floatingImagesRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ width: 100, height: 100 });
      } else {
        setDimensions({ width: 200, height: 200 });
      }
    };

    //   // const handleKeyDown = (event) => {
    //   //   if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    //   //     // Scroll FloatingImagesScene into focus
    //   //     if (floatingImagesRef.current) {
    //   //       floatingImagesRef.current.scrollIntoView({
    //   //         behavior: 'smooth',
    //   //         block: 'center',
    //   //       });
    //   //       floatingImagesRef.current.focus();
    //   //     }
    //   //   }
    //   // };
    //   window.focus(floatingImagesRef.current);

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <main className='min-h-screen select-none overflow-y-hidden scrollhide overflow-hidden bg-[#232424]'>
      <div className='hidden'>
        <h1>Karan Desai Home</h1>
        <h2>Karan Desai</h2>
        <h2>Karan Desai Acrhitect</h2>
        <h2>Karan Desai Acrhitect + Design</h2>
        <h2>Architect</h2>
        <h2>Designer</h2>
        <h2>Interior Designer</h2>
        <h2>Serafini</h2>
        <h2>Casa walls</h2>
        <h2>Dimensions</h2>
        <h2>Top Brewer</h2>
        <h2>Gattoo</h2>
        <h2>Monster</h2>
        <p>Discover the innovative architectural designs of Karan Desai Home</p>
        <p>
          Karan Desai Award Winning Architecture + Interior Design Studio | TedX
          Speaker Karan DesaiBorn in 1987, a passionate founder of his eponymous
          studio, KARAN DESAI | Architecture + Design, focusing on Architecture,
          Interiors & furniture designing, KD started off with his individual
          practice right after he gave his Thesis in 2011 from Pillai’s college
          of architecture & founded the company in 2012. The internship under
          Ar. Ashiesh Shah during a year drop in 2007, carved a path for his
          career with a clear direction towards his goals & dreams which he
          lives today. The Studio has spread its wings in Mangalore, Goa, Delhi,
          Kullu - Manali, Uttarakhand, Kolkata, Chennai and plan to continue.
          Inspired by contemporary aesthetics and clean lines, the studio
          beautifies projects both residential and commercial on varying scales.
          From ideation rooms to offices , homes to private getaways, the team
          designs projects and products in close association with clients to
          deliver unique results and reflect personal tastes with consolidating
          the studio’s vision. We're also doing projects internationally, We've
          completed working on the order of 20,000 sq.ft. in Chicago and
          currently working on 15,000 sq.ft Mansion in Washington, D.C.
        </p>
        <p>
          "Imagine transforming everyday spaces into rich, immersive
          experiences—what if art became a part of your daily life?" Karan Desai
          Home is a testament to bringing the experience through meticulously
          crafted furniture and products. KDH specialises in creating art pieces
          that are not only visually striking but also serve a functional
          purpose. Following the success of our Monster collection in 2022, we
          have consistently expanded our portfolio, collaborating with renowned
          industry leaders such as The Quarry, Casa Walls, Bharat Flooring, and
          more. Our dedication to design innovation has earned us international
          recognition, including a prestigious partnership with Serafini
          (Italy). With a commitment to global collaborations and a mission to
          craft extraordinary designs, KDH continues to redefine functional art.
          Our unique approach and creative philosophy aim to inspire and
          captivate, bringing exceptional products to life.
        </p>
        <p>
          'KDAD', 'Karan Desai', 'Karan Desai Architecture and Design', 'modern
          architecture', 'contemporary architecture', 'innovative architecture',
          'creative architecture', 'architectural design', 'modern design',
          'sustainable architecture', 'eco-friendly design', 'residential
          architecture', 'commercial architecture', 'interior design',
          'architectural portfolio', 'design studio', 'urban design',
          'minimalist design', 'award-winning architecture', 'architecture
          firm', 'creative design solutions', 'luxury architecture', 'modern
          building design', 'architectural innovation', 'architectural trends',
          'design inspiration', 'architectural projects',
        </p>
        <p>https://karandesaihome.com</p>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          // backgroundImage: 'url("/assets/kdhlogo2.png")',
          // backgroundSize: 'cover',
          // backgroundPosition: 'center',
          zIndex: 1,
        }}
        className='flex  justify-center text-start items-start'
      >
        <div
          // style={{
          //   backgroundImage: 'url("/assets/kdhlogo2.png")',
          //   backgroundSize: 'cover',
          //   backgroundPosition: 'center',
          // }}
          className='w-full p-0 mt-2 2xl:mt-7  flex justify-center items-center '
        >
          {/* <h1 className='uppercase md:text-6xl text-center flex flex-col md:gap-4 font-bold'>
            welcome to <span className=''>karan desai home</span>
          </h1> */}
          <Image
            src='/assets/kdhlogo3.png'
            alt='Karan Desai Home Logo'
            width={dimensions.width}
            height={dimensions.height}
            className='flex   justify-self-center object-contain  p-0 hover:cursor-pointer'
          />
        </div>
      </div>
      <Navbar />
      {/* <FloatingImagesScene /> */}
      {/* <div ref={floatingImagesRef} tabIndex={-1} className='focus:outline-none'> */}
      <FloatingImagesScene />
      {/* </div> */}
    </main>
  );
};

export default page;
