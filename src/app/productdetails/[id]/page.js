'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Link, Element } from 'react-scroll';
import { Button } from '../../components/ui/button';
import Footer from '../../components/Footer';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

// Lazy load components that aren't needed for initial render
const CarouselComp = React.lazy(() => import('../../components/CarouselComp'));
const DescAccordian = React.lazy(() =>
  import('../../components/DescAccordian')
);

// Facebook Pixel Component
const FacebookPixel = () => {
  useEffect(() => {
    if (!window.fbq) {
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];
        t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}
        (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1398430317981375');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <noscript>
      <img
        height='1'
        width='1'
        style={{ display: 'none' }}
        src='https://www.facebook.com/tr?id=1398430317981375&ev=PageView&noscript=1'
        alt='fb-pixel'
      />
    </noscript>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className='flex h-screen w-full items-center justify-center bg-black'>
    <div className='h-16 w-16 animate-spin rounded-full border-t-4 border-white'></div>
  </div>
);

// Placeholder Thumbnail
const ImagePlaceholder = () => (
  <div className='bg-gray-800 animate-pulse w-full h-full'></div>
);

// Product Image Component with optimization
const ProductImage = ({ src, alt, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src) return <ImagePlaceholder />;

  return (
    <>
      {!isLoaded && <ImagePlaceholder />}
      <Image
        src={src}
        alt={alt || 'Product image'}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        fill
        priority={priority}
        quality={75}
        onLoad={() => setIsLoaded(true)}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      />
    </>
  );
};

// Main Product Detail Page
const ProductDetailPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data fetching in a separate function
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          signal,
          next: { revalidate: 300 }, // Revalidate cache every 5 minutes
        });

        if (!res.ok) throw new Error('Failed to fetch product');

        const data = await res.json();
        if (data?.products) {
          setProduct(data.products);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching product data:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function
    return () => controller.abort();
  }, [params.id]);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle navigation
  const handleGoBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/products/${product?.group || ''}`);
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (!product) {
    return (
      <div className='flex flex-col h-screen w-full items-center justify-center bg-black text-white'>
        {/* <h1 className='text-2xl font-bold mb-4'>Product not found</h1> */}
        <Button onClick={handleGoBack}>Go Back</Button>
      </div>
    );
  }

  // Main content with progressive loading
  return (
    <>
      <FacebookPixel />
      <div className='bg-black min-h-screen'>
        <div className='flex flex-col relative select-none'>
          <Navbar arrow={true} escape={true} />

          {/* Hero Section with Main Image */}
          <div className='fixed top-6 left-[45%] 2xl:left-[47%] z-50'>
            <Image
              src='/assets/kdhlogo3.png'
              alt='Your Logo'
              width={150}
              height={150}
            />
          </div>
          <div
            className={`${
              isScrolled && 'hidden transition-all duration-300'
            } absolute top-[55%] right-0 transform -translate-x-1/2 z-50 transition-all duration-300`}
          >
            <Link
              to='description' // matches your <Element name="description">
              smooth={true}
              duration={600}
              className=' flex flex-col items-center cursor-pointer'
            >
              <ArrowDown size={28} className='animate-pulse anima text-white' />
              {/* <span className='mt-1 text-xs text-white uppercase tracking-wide'>
                Scroll
              </span> */}
            </Link>
          </div>
          <div className='w-full h-screen p-0 m-0 relative'>
            <div className='absolute w-full h-screen top-0 left-0 z-0'>
              {product.images && product.images[1]?.filePath && (
                <ProductImage
                  src={product.images[1].filePath}
                  alt={product.title}
                  priority={true}
                />
              )}
            </div>
            <div className='absolute w-full h-screen top-0 left-0 z-0 bg-black/50 backdrop-blur-md'></div>

            {/* Carousel */}
            <Element name='' className='z-20'>
              <Suspense
                fallback={
                  <div className='w-full h-64 bg-gray-800 animate-pulse'></div>
                }
              >
                <CarouselComp imgArray={product.images || []} />
              </Suspense>
            </Element>
          </div>

          {/* Divider */}
          <Element name='newSection' className='w-full m-0 p-0 hidden md:block'>
            <div className='w-full h-[2px] bg-zinc-200/50 border-b border-zinc-700'></div>
          </Element>

          {/* Description Section */}
          <Element name='description' className='border-b-2 border-zinc-400'>
            <Suspense
              fallback={
                <div className='w-full h-64 bg-gray-800 animate-pulse p-4'>
                  Loading description...
                </div>
              }
            >
              <DescAccordian
                scrollPosition={scrollPosition}
                desc={product.description}
                dimensions={product.dimensions}
                title={product.title}
                pdf={product.pdf}
              />
            </Suspense>
          </Element>

          {/* Footer */}
          <Element name='footer'>
            <Footer />
          </Element>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
