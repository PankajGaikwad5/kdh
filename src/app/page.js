'use client';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Image from 'next/image';
import { newImagePaths } from './components/imagePaths';
import { useTheme } from 'next-themes';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

const FloatingImagesScene = dynamic(
  () => import('./components/FloatingImagesScene'),
  {
    ssr: false,
    loading: () => (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000' }} />
    ),
  }
);

import AltProductDetailsClient from './components/pageComp/AltProductDetailsClient';
import { products } from './components/altproducts';

const page = () => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 200 });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const floatingImagesRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Kick off texture preloading progressively during idle time — while the Three.js chunk is still
  // downloading, the browser fetches images into its HTTP cache without memory spikes.
  useEffect(() => {
    const uniquePaths = [...new Set(newImagePaths.map((p) => p.path))];
    let cancelled = false;
    
    // Batch load images during idle time or short timeouts
    const loadBatch = (index) => {
      if (cancelled || index >= uniquePaths.length) return;
      const batchSize = 6;
      const nextIndex = index + batchSize;
      
      for (let i = index; i < Math.min(nextIndex, uniquePaths.length); i++) {
        const img = new window.Image();
        img.src = uniquePaths[i];
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadBatch(nextIndex));
      } else {
        setTimeout(() => loadBatch(nextIndex), 50);
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => loadBatch(0));
    } else {
      setTimeout(() => loadBatch(0), 100);
    }

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ width: 100, height: 100 });
      } else {
        setDimensions({ width: 200, height: 200 });
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedProduct]);

  const handleProductSelect = (productId, href) => {
    const p = products.find((prod) => {
      const id = typeof prod._id === 'object' ? prod._id.$oid : prod._id;
      return id === productId;
    });
    if (p) {
      window.history.pushState(null, '', href);
      setSelectedProduct(p);
    }
  };

  const handleCloseModal = () => {
    window.history.back(); // Triggers popstate which will set selectedProduct to null
  };

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
        id="home-logo-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1,
        }}
        className='flex  justify-center text-start items-start'
      >
        <div className='w-full p-0 mt-2 2xl:mt-7  flex justify-center items-center '>
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
      <FloatingImagesScene onProductSelect={handleProductSelect} />
      
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-transparent">
          <AltProductDetailsClient product={selectedProduct} onClose={handleCloseModal} />
        </div>
      )}

      {/* Theme Toggle Button */}
      {mounted && (
        <div className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-50">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-all duration-300 focus:outline-none shadow-2xl border-2 ${
              theme === 'dark' ? 'bg-transparent border-white' : 'bg-transparent border-black'
            }`}
            aria-label="Toggle Theme"
          >
            <span
              className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full transition-transform duration-300 shadow-sm ${
                theme === 'dark' ? 'translate-x-0.5 bg-white' : 'translate-x-[34px] bg-black'
              }`}
            >
              {theme === 'dark' ? (
                <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      )}
    </main>
  );
};

export default page;
