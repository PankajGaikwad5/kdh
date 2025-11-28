'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Montserrat } from 'next/font/google';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import ThumbnailGrid from '@/app/components/ThumbnailGrid';
import Navbar from '@/app/components/Navbar';
import { AccordionMarbles } from '@/app/components/AccordionMarbles';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const formSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  message: z.string(),
  subject: z.string(),
  product: z.string(),
});

// ThumbnailGrid Component (keeping original external component structure)
// This should be in a separate ThumbnailGrid.tsx file

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalMedia = (product?.images?.length || 0) + (product?.video ? 1 : 0);
  const isVideoSlide = currentIndex >= (product?.images?.length || 0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      subject: 'Product Enquiry',
      product: '',
    },
  });

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const preloadImage = useCallback((src) => {
    const img = new window.Image();
    img.onload = () => setLoadedImages((prev) => new Set([...prev, src]));
    img.src = src;
  }, []);

  // Consolidated initialization effect
  useEffect(() => {
    // Facebook Pixel
    if (!window.fbq) {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
      window.fbq('init', '1398430317981375');
      window.fbq('track', 'PageView');
    }

    // Preload images
    if (product?.images?.[0]) {
      preloadImage(product.images[0].filePath);
      setImageLoaded(true);
      product.images
        .slice(1)
        .forEach((img, i) =>
          setTimeout(() => preloadImage(img.filePath), i * 100)
        );
    }

    // Escape key handler
    const handleEsc = (e) => e.key === 'Escape' && router.back();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [product, router, preloadImage]);

  const handleImageSelect = useCallback(
    (index) => {
      setImageLoaded(
        index >= (product?.images?.length || 0) ||
          loadedImages.has(product.images[index]?.filePath)
      );
      setCurrentIndex(index);
    },
    [product, loadedImages]
  );

  const navigate = useCallback(
    (direction) => {
      if (!totalMedia) return;
      setImageLoaded(false);
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % totalMedia
          : currentIndex === 0
          ? totalMedia - 1
          : currentIndex - 1;
      setCurrentIndex(newIndex);
      if (
        newIndex >= (product?.images?.length || 0) ||
        loadedImages.has(product.images[newIndex]?.filePath)
      ) {
        setImageLoaded(true);
      }
    },
    [currentIndex, totalMedia, product, loadedImages]
  );

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values }),
      });
      alert(res.ok ? 'Message sent successfully!' : 'Failed to send message');
      if (res.ok) window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const marbles = useMemo(
    () => [
      { name: 'Banswara', src: '/marbles/banswara.webp' },
      {
        name: 'Indian Black Bheslana',
        src: '/marbles/indianblackbheslana.webp',
      },
      { name: 'Indian Rosso Levante', src: '/marbles/indianrossolevante.webp' },
      {
        name: 'Italian Beige Travertine',
        src: '/marbles/italianbeigetravertine.webp',
        rotate: true,
      },
      { name: 'Marquina', src: '/marbles/marquina.webp' },
    ],
    []
  );

  return (
    <main
      className={`min-h-screen bg-black text-white ${montserrat.className}`}
    >
      <Navbar home={true} />
      <header className='fixed top-3 right-2 w-full flex justify-end p-4 z-30'>
        <button
          onClick={() => router.back()}
          className='text-white hover:text-gray-300'
        >
          <X size={30} />
        </button>
      </header>

      <div className='grid md:grid-cols-2 pt-14'>
        <section
          className={`${
            isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
          } p-4 flex items-center justify-center`}
        >
          {(product.images?.length > 0 || product.video) && (
            <div
              className={`relative w-full ${
                isFullscreen ? 'h-screen' : 'h-[80vh]'
              } rounded-lg overflow-hidden`}
            >
              {!imageLoaded && (
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
                  <p className='text-sm text-gray-400 ml-4'>Loading...</p>
                </div>
              )}

              <div
                className='relative w-full h-full'
                style={{ opacity: imageLoaded ? 1 : 0 }}
              >
                {isVideoSlide && product.video ? (
                  <video
                    src={product.video}
                    className='w-full h-full object-contain'
                    controls
                    onLoadedData={() => setImageLoaded(true)}
                  />
                ) : (
                  <Image
                    src={product.images[currentIndex].filePath}
                    alt={product.title}
                    fill
                    className='object-contain'
                    sizes='(max-width: 768px) 100vw, 50vw'
                    priority={currentIndex === 0}
                    quality={75}
                    unoptimized={product.images[
                      currentIndex
                    ].filePath.startsWith('http')}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className='absolute top-4 right-4 text-white bg-black/60 rounded-full p-2 hover:bg-white hover:text-black transition-all z-20'
              >
                {isFullscreen ? (
                  <X size={20} />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />
                  </svg>
                )}
              </button>

              <ThumbnailGrid
                images={product.images}
                video={product.video}
                currentIndex={currentIndex}
                onImageSelect={handleImageSelect}
                isOpen={showThumbnailGrid}
                onToggle={() => setShowThumbnailGrid(!showThumbnailGrid)}
              />

              {totalMedia > 1 && (
                <>
                  <button
                    onClick={() => navigate('prev')}
                    disabled={!imageLoaded}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all disabled:opacity-50 z-20'
                  >
                    <span className='text-xl'>‹</span>
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    disabled={!imageLoaded}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all disabled:opacity-50 z-20'
                  >
                    <span className='text-xl'>›</span>
                  </button>
                  <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 text-sm z-20'>
                    {currentIndex + 1} / {totalMedia}
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='p-4 md:p-10 flex flex-col 2xl:mt-20 justify-between bg-black z-10'
        >
          <div>
            <h1 className='text-4xl md:text-4xl 2xl:text-6xl 2xl:mb-20 mb-6 capitalize font-light tracking-tight'>
              {product.title}
            </h1>

            {product.collabtext && (
              <div className='mb-4 flex items-center'>
                <span className='text-gray-400 text-sm mr-2'>
                  Collaboration with
                </span>
                {product.collablink ? (
                  <a
                    href={product.collablink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white hover:underline flex items-center'
                  >
                    {product.collabtext}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-4 w-4 ml-1'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                      />
                    </svg>
                  </a>
                ) : (
                  <span className='text-white'>{product.collabtext}</span>
                )}
              </div>
            )}

            <div className='flex flex-col gap-4 text-sm 2xl:space-y-8'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <div>
                  <h4 className='font-semibold text-gray-400 text-xs mb-1'>
                    Dimension
                  </h4>
                  <p className='text-white'>
                    {product.dimensions?.includes('http') ? (
                      <a
                        href={product.dimensions}
                        target='_blank'
                        className='underline text-blue-400 hover:text-blue-200'
                      >
                        View Dimensions
                      </a>
                    ) : (
                      product.dimensions
                    )}
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-400 text-xs mb-1'>
                    Lead Time
                  </h4>
                  <p className='text-white'>30 Days</p>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-400 text-xs mb-1'>
                    Material
                  </h4>
                  <p className='text-white'>{product.material}</p>
                </div>
              </div>

              {product.material === 'Marble' && (
                <div className='flex flex-col gap-2'>
                  <h2 className='text-lg mb-2'>MARBLES</h2>
                  <div className='flex flex-wrap gap-4'>
                    {marbles.map((marble) => (
                      <div
                        key={marble.name}
                        className='flex flex-col items-center text-center'
                      >
                        <Image
                          width={70}
                          height={70}
                          src={marble.src}
                          alt={marble.name}
                          className={`aspect-square object-cover ${
                            marble.rotate ? 'rotate-90' : ''
                          }`}
                        />
                        <p className='text-xs w-[80px] mt-2 break-words'>
                          {marble.name}
                        </p>
                      </div>
                    ))}
                  </div>
                  <AccordionMarbles />
                </div>
              )}

              <div className='mt-6 border-t border-gray-700 pt-4 text-sm text-white font-light whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>

              <div className='mt-10 flex gap-4 flex-col md:flex-row flex-wrap'>
                <a href={product.pdf} target='_blank' rel='noopener noreferrer'>
                  <Button
                    variant='outline'
                    className='px-6 py-2 border w-full md:w-auto border-white text-black rounded-none hover:bg-white/80'
                  >
                    Download Spec Sheet
                  </Button>
                </a>
                <Button
                  className='px-6 py-2 border w-full md:w-auto border-white bg-transparent text-white rounded-none hover:bg-white hover:text-black'
                  onClick={() => setShowModal(true)}
                >
                  Enquire
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='bg-black/70 p-8 rounded-md w-full max-w-md relative'
            >
              <button
                onClick={() => setShowModal(false)}
                className='absolute top-3 right-3 text-gray-600 hover:text-black'
              >
                <X size={20} />
              </button>
              <h2 className='text-xl font-semibold mb-4'>Enquire</h2>
              <Form {...form}>
                <form
                  className='space-y-4 px-4'
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-black text-white placeholder:text-white'
                            placeholder='Enter your name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-black text-white placeholder:text-white'
                            placeholder='Enter your email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='product'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-black text-white placeholder:text-white'
                            placeholder='Please specify the product name'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='message'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter your message'
                            className='bg-black text-white placeholder:text-white'
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    className='bg-white uppercase text-gray-900 hover:bg-black hover:text-gray-300 rounded-full px-5'
                  >
                    Submit
                  </Button>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
