'use client';
import React, { useState, useEffect, useMemo, Suspense, memo } from 'react';
import { Link, Element } from 'react-scroll';
import { Button } from '../../components/ui/button';
import Footer from '../../components/Footer';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import Head from 'next/head';

// Preload critical components
import('../../components/CarouselComp');
import('../../components/DescAccordian');

// Lazy load non-critical components
const CarouselComp = React.lazy(() => import('../../components/CarouselComp'));
const DescAccordian = React.lazy(() =>
  import('../../components/DescAccordian')
);

// Memoized Facebook Pixel Component
const FacebookPixel = memo(() => {
  useEffect(() => {
    // Use requestIdleCallback for non-critical FB pixel
    const loadFBPixel = () => {
      if (window.fbq) return;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      script.onload = () => {
        window.fbq('init', '1398430317981375');
        window.fbq('track', 'PageView');
      };

      // Initialize fbq function
      window.fbq =
        window.fbq ||
        function () {
          (window.fbq.q = window.fbq.q || []).push(arguments);
        };

      document.head.appendChild(script);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadFBPixel);
    } else {
      setTimeout(loadFBPixel, 100);
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
});

// Optimized Loading Spinner
const LoadingSpinner = memo(() => (
  <div className='flex h-screen w-full items-center justify-center bg-black'>
    <div className='h-16 w-16 animate-spin rounded-full border-t-4 border-white'></div>
  </div>
));

// Optimized Image Placeholder
const ImagePlaceholder = memo(() => (
  <div className='bg-gray-800 w-full h-full flex items-center justify-center'>
    <div className='w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin'></div>
  </div>
));

// Highly optimized Product Image Component
const ProductImage = memo(({ src, alt, priority = false, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) return <ImagePlaceholder />;

  return (
    <div className={`relative w-full h-full ${className}`}>
      {!isLoaded && <ImagePlaceholder />}
      <Image
        src={src}
        alt={alt || 'Product image'}
        className={`object-cover transition-opacity duration-200 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        fill
        priority={priority}
        quality={priority ? 85 : 75}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGxEiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      />
    </div>
  );
});

// Main Product Detail Page with extensive optimizations
const ProductDetailPage = ({ params }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Optimized scroll state with reduced re-renders
  const [scrollState, setScrollState] = useState({
    position: 0,
    isScrolled: false,
  });

  // Throttled scroll handler
  const handleScroll = useMemo(() => {
    let ticking = false;
    return () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrollState((prev) => {
            const isScrolled = scrollY > 10;
            if (
              prev.isScrolled !== isScrolled ||
              Math.abs(prev.position - scrollY) > 10
            ) {
              return { position: scrollY, isScrolled };
            }
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Optimized data fetching with better error handling and caching
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setProduct(null); // Reset product state

        // Add cache busting only if needed
        const cacheParam =
          process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';

        const res = await fetch(`/api/products/${params.id}${cacheParam}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'max-age=300',
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Product not found');
          } else {
            setError(`HTTP ${res.status}: ${res.statusText}`);
          }
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        if (!data?.products) {
          setError('Product not found');
          setIsLoading(false);
          return;
        }

        setProduct(data.products);
        setIsLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching product:', error);
          setError(error.message);
        }
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [params.id]);

  const handleGoBack = useMemo(
    () => (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push(`/products/${product?.group || ''}`);
      }
    },
    [router, product?.group]
  );

  // Memoized hero image data
  const heroImage = useMemo(() => {
    return product?.images?.[1]?.filePath || null;
  }, [product?.images]);

  // Early returns for loading and error states
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className='flex flex-col h-screen w-full items-center justify-center bg-black text-white'>
        <h1 className='text-xl mb-4'>{error || 'Product not found'}</h1>
        <Button onClick={handleGoBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${product.title} | Karan Desai Home`}</title>
        <meta
          name='description'
          content={`Discover ${product.title} from the ${product.group} collection at Karan Desai Home.`}
        />
        <meta
          name='keywords'
          content={`Karan Desai Home, ${product.title}, ${product.group}, luxury furniture, designer decor`}
        />
        <meta
          property='og:title'
          content={`${product.title} | Karan Desai Home`}
        />
        <meta
          property='og:description'
          content={`Explore the ${product.group} collection and more at Karan Desai Home.`}
        />
        {heroImage && <link rel='preload' as='image' href={heroImage} />}
      </Head>

      <FacebookPixel />

      <div className='bg-black min-h-screen'>
        <div className='flex flex-col relative select-none'>
          <Navbar arrow={true} escape={true} />

          {/* Logo - consider making this a CSS background for better performance */}
          <div className='fixed top-6 left-[45%] 2xl:left-[47%] z-50'>
            <Image
              src='/assets/kdhlogo3.png'
              alt='Karan Desai Home Logo'
              width={150}
              height={150}
              priority
              quality={90}
            />
          </div>

          {/* Scroll arrow - only render when needed */}
          {!scrollState.isScrolled && (
            <div className='absolute top-[55%] right-0 transform -translate-x-1/2 z-50 transition-opacity duration-300'>
              <Link
                to='description'
                smooth={true}
                duration={600}
                className='flex flex-col items-center cursor-pointer'
              >
                <ArrowDown size={28} className='animate-pulse text-white' />
              </Link>
            </div>
          )}

          {/* Hero Section */}
          <div className='w-full h-screen p-0 m-0 relative'>
            {/* Background Image */}
            <div className='absolute w-full h-screen top-0 left-0 z-0'>
              {heroImage && (
                <ProductImage
                  src={heroImage}
                  alt={product.title}
                  priority={true}
                />
              )}
            </div>

            {/* Overlay */}
            <div className='absolute w-full h-screen top-0 left-0 z-10 bg-black/50 backdrop-blur-sm'></div>

            {/* Carousel */}
            <Element name='' className='relative z-20'>
              <Suspense
                fallback={
                  <div className='w-full h-64 bg-gray-800 animate-pulse'></div>
                }
              >
                <CarouselComp imgArray={product.images || []} />
              </Suspense>
            </Element>
          </div>

          {/* Section Divider */}
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
                scrollPosition={scrollState.position}
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

export default memo(ProductDetailPage);
