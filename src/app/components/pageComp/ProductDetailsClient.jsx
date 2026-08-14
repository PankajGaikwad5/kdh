'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
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
import { useCart } from '@/app/context/CartContext';
import { getCollectionName } from '@/lib/utils';

const AccordionMarbles = dynamic(
  () => import('@/app/components/AccordionMarbles').then((mod) => mod.AccordionMarbles),
  { ssr: false }
);


const formSchema = z.object({
  name: z.string().min(2, 'name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  message: z.string(),
  subject: z.string(),
  product: z.string(),
});

const normalizeKey = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/monstermearr/g, '')
    .replace(/&/g, '')
    .replace(/and/g, '')
    .replace(/\s+/g, '')
    .replace(/bush/g, 'brush')
    .replace(/lavante/g, 'levante')
    .replace(/roso/g, 'rosso')
    .replace(/greenspider/g, 'spidergreen');
};

// ThumbnailGrid Component (keeping original external component structure)
// This should be in a separate ThumbnailGrid.tsx file

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedMarble, setSelectedMarble] = useState(() => {
    if (product?.material !== 'Marble' && !product?.colorImages && !product?.colors && !product?.marbles) return null;
    // If the product explicitly sets defaultMarble (even to null), use that value
    // This allows products whose base isn't Banswara to start unselected (null → shows product.images)
    return 'defaultMarble' in (product || {}) 
      ? product.defaultMarble 
      : (product?.marbles && product.marbles.length > 0)
        ? product.marbles[0].name
        : (product?.material === 'Marble' ? 'Banswara' : null);
  });

  const collectionName = useMemo(() => getCollectionName(product), [product]);

  // Calculate active images based on the selected marble/color variant
  const activeImages = useMemo(() => {
    const imagesSource = product?.marbleImages || product?.colorImages;
    if (selectedMarble && imagesSource) {
      const targetKey = normalizeKey(selectedMarble);
      const matchedKey = Object.keys(imagesSource).find(
        (key) => normalizeKey(key) === targetKey
      );
      const marbleImagesData = matchedKey ? imagesSource[matchedKey] : null;
      if (marbleImagesData && marbleImagesData.length > 0) {
        return marbleImagesData.map((img, idx) => {
          if (typeof img === 'string') {
            return {
              filePath: img,
              fileName: `${selectedMarble}-${idx}`,
              _id: { $oid: `${selectedMarble}-${idx}` },
              thumbnail: img,
            };
          }
          return img;
        });
      }
    }
    return product?.images || [];
  }, [product, selectedMarble]);

  // Spam protection
  const [formLoadTime, setFormLoadTime] = useState(null);
  const [honeypot, setHoneypot] = useState('');

  const pageRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  const totalMedia = (activeImages?.length || 0) + (product?.video ? 1 : 0);
  const isVideoSlide = currentIndex >= (activeImages?.length || 0);

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

  useEffect(() => {
    if (product) {
      const details = [];
      if (collectionName) details.push(`Collection: ${collectionName}`);
      if (selectedMarble) details.push(`Variant: ${selectedMarble}`);
      const productStr = `${product.title}${details.length ? ` (${details.join(', ')})` : ''}`;
      form.setValue('product', productStr);
    }
  }, [product, selectedMarble, collectionName, form]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fade in the whole page
      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      // Fade in image section
      tl.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0.2
      );

      // Reveal text elements with clip-path from bottom to top
      const textEls = detailsRef.current?.querySelectorAll('.gsap-reveal');
      if (textEls?.length) {
        tl.fromTo(
          textEls,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.inOut',
          },
          0.3
        );
      }
    });

    return () => ctx.revert();
  }, []);

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
    // Set form load time for spam detection
    setFormLoadTime(Date.now());

    // Escape key handler
    const handleEsc = (e) => e.key === 'Escape' && router.back();
    window.addEventListener('keydown', handleEsc);

    // Defer Facebook Pixel - load after page is interactive
    const fbTimeout = setTimeout(() => {
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
          'https://connect.facebook.net/en_US/fbevents.js',
        );
        window.fbq('init', '1398430317981375');
        window.fbq('track', 'PageView');
      }
    }, 3000);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      clearTimeout(fbTimeout);
    };
  }, [router]);

  // Preload active images whenever they change (e.g. when marble is selected)
  useEffect(() => {
    const timers = [];
    if (activeImages?.[0]) {
      setImageLoaded(false);
      preloadImage(activeImages[0].filePath);
      if (loadedImages.has(activeImages[0].filePath)) {
        setImageLoaded(true);
      }
      activeImages
        .slice(1)
        .forEach((img, i) => {
          const t = setTimeout(() => preloadImage(img.filePath), i * 100);
          timers.push(t);
        });
    }
    return () => timers.forEach(clearTimeout);
  }, [activeImages, preloadImage, loadedImages]);

  const handleSelectMarble = useCallback((marbleName) => {
    // Determine what the "default" state for this product is
    const productDefault = 'defaultMarble' in (product || {}) 
      ? product.defaultMarble 
      : (product?.marbles && product.marbles.length > 0)
        ? product.marbles[0].name
        : (product?.material === 'Marble' ? 'Banswara' : null);
    setSelectedMarble((prev) => (prev === marbleName ? productDefault : marbleName));
    setCurrentIndex(0);
    setImageLoaded(false);
  }, [product]);

  const handleImageSelect = useCallback(
    (index) => {
      setImageLoaded(
        index >= (activeImages?.length || 0) ||
        loadedImages.has(activeImages[index]?.filePath),
      );
      setCurrentIndex(index);
    },
    [activeImages, loadedImages],
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
        newIndex >= (activeImages?.length || 0) ||
        loadedImages.has(activeImages[newIndex]?.filePath)
      ) {
        setImageLoaded(true);
      }
    },
    [currentIndex, totalMedia, activeImages, loadedImages],
  );

  const onSubmit = async (values) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values,
          honeypot, // Spam detection: should be empty
          timestamp: formLoadTime, // Spam detection: time form was loaded
        }),
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
      { name: 'Spider Green', src: '/marbles/spidergreen.webp' },
    ],
    [],
  );

  return (
    <main
      ref={pageRef}
      style={{ opacity: 0 }}
      className='min-h-screen bg-black text-white'
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

      <div className='grid md:grid-cols-2 items-start pt-14'>
        <section
          ref={imageRef}
          className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'
            } p-4 flex items-center justify-center mt-4`}
        >
          {(activeImages?.length > 0 || product.video) && (
            <div
              className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-[80vh]'
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
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.4s ease',
                }}
              >
                {isVideoSlide && product.video ? (
                  <video
                    src={product.video}
                    className='w-full h-full object-contain'
                    controls
                    onLoadedData={() => setImageLoaded(true)}
                  />
                ) : (
                  activeImages[currentIndex] && (
                    <Image
                      onClick={toggleFullscreen}
                      src={activeImages[currentIndex].filePath}
                      alt={product.title}
                      fill
                      className='object-contain'
                      sizes='(max-width: 768px) 100vw, 50vw'
                      priority={currentIndex === 0}
                      quality={75}
                      onLoad={() => setImageLoaded(true)}
                    />
                  )
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
                images={activeImages}
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

        <section
          ref={detailsRef}
          className='p-4 md:p-10 flex flex-col 2xl:mt-20 justify-between bg-black z-10'
        >
          <div>
            <h1 className='gsap-reveal text-4xl md:text-4xl 2xl:text-6xl 2xl:mb-20 mb-6 capitalize font-light tracking-tight'>
              {product.title}
            </h1>

            {product.collabtext && (
              <div className='gsap-reveal mb-4 flex items-center'>
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
              <div className='gsap-reveal grid grid-cols-2 md:grid-cols-3 gap-2'>
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

              {(product.material === 'Marble' || (product.colors && product.colors.length > 0) || product.colorImages || (product.marbles && product.marbles.length > 0)) && (
                <div className='gsap-reveal flex flex-col gap-2'>
                  <h2 className='text-lg mb-2 uppercase tracking-wide font-medium'>
                    {product.colors || product.colorImages
                      ? 'COLOR VARIATIONS'
                      : product.marbles
                        ? 'MARBLE COMBINATIONS'
                        : 'MARBLES'}
                  </h2>
                  <div className='flex flex-wrap gap-4'>
                    {(product.marbles || product.colors || marbles).map((option) => {
                      const isSelected = selectedMarble === option.name;
                      const imagesSource = product.colorImages || product.marbleImages;
                      const hasCustomImages = !!(
                        imagesSource &&
                        (() => {
                          const targetKey = normalizeKey(option.name);
                          const matchedKey = Object.keys(imagesSource).find(
                            (key) => normalizeKey(key) === targetKey
                          );
                          return matchedKey ? imagesSource[matchedKey].length > 0 : false;
                        })()
                      );
                      return (
                        <button
                          key={option.name}
                          onClick={() => handleSelectMarble(option.name)}
                          className='flex flex-col items-center text-center focus:outline-none group relative transition-transform duration-200 hover:scale-105'
                          title={
                            hasCustomImages
                              ? `Click to view product in ${option.name}`
                              : `View ${option.name} option`
                          }
                        >
                          {option.swatches && option.swatches.length === 2 ? (
                            <div
                              className={`relative w-[70px] h-[70px] overflow-hidden rounded-md flex transition-all duration-300 ${
                                isSelected
                                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-95 opacity-100'
                                  : 'opacity-85 group-hover:opacity-100'
                              }`}
                            >
                              <div className='relative w-1/2 h-full overflow-hidden border-r border-black/40'>
                                <Image
                                  src={option.swatches[0]}
                                  alt={`${option.name} 1`}
                                  fill
                                  className='object-cover'
                                  sizes='35px'
                                />
                              </div>
                              <div className='relative w-1/2 h-full overflow-hidden'>
                                <Image
                                  src={option.swatches[1]}
                                  alt={`${option.name} 2`}
                                  fill
                                  className='object-cover'
                                  sizes='35px'
                                />
                              </div>
                              {/* Subtle dot to indicate this option has custom photos */}
                              {hasCustomImages && !isSelected && (
                                <span className='absolute bottom-1 right-1 w-2.5 h-2.5 bg-white border border-black rounded-full shadow z-10' />
                              )}
                            </div>
                          ) : (
                            <div className='relative w-[70px] h-[70px] overflow-hidden rounded-md'>
                              <Image
                                width={70}
                                height={70}
                                src={option.src || option.swatches?.[0]}
                                alt={option.name}
                                className={`aspect-square object-cover transition-all duration-300 ${
                                  option.rotate ? 'rotate-90' : ''
                                } ${
                                  isSelected
                                    ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-95 opacity-100'
                                    : 'opacity-85 group-hover:opacity-100'
                                }`}
                              />
                              {/* Subtle dot to indicate this option has custom photos */}
                              {hasCustomImages && !isSelected && (
                                <span className='absolute bottom-1 right-1 w-2.5 h-2.5 bg-white border border-black rounded-full shadow' />
                              )}
                            </div>
                          )}
                          <p
                            className={`text-xs w-[85px] mt-2 break-words leading-tight transition-colors duration-200 ${
                              isSelected
                                ? 'text-white font-semibold'
                                : 'text-gray-400 group-hover:text-white'
                            }`}
                          >
                            {option.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  {product.material === 'Marble' && !product.marbles && (
                    <AccordionMarbles
                      selectedMarble={selectedMarble}
                      onSelectMarble={handleSelectMarble}
                      product={product}
                    />
                  )}
                </div>
              )}

              <div className='gsap-reveal mt-6 border-t border-gray-700 pt-4 text-sm text-white font-light whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>

              <div className='gsap-reveal mt-10 flex gap-4 flex-col md:flex-row flex-wrap'>
                {product.pdf && (
                  <a href={product.pdf} target='_blank' rel='noopener noreferrer' className='w-full md:w-auto'>
                    <Button
                      variant='outline'
                      className='px-6 py-2 border w-full border-white text-black rounded-none hover:bg-white/80'
                    >
                      Download Spec Sheet
                    </Button>
                  </a>
                )}
                {isInCart(product._id.$oid, selectedMarble) ? (
                  <Button
                    className='px-6 py-2 border w-full md:w-auto border-red-500 bg-red-500/10 text-red-500 rounded-none hover:bg-red-500 hover:text-white transition-all duration-300 font-medium'
                    onClick={() => removeFromCart(product._id.$oid, selectedMarble)}
                  >
                    Remove from Cart
                  </Button>
                ) : (
                  <Button
                    className='px-6 py-2 border w-full md:w-auto border-white bg-white text-black rounded-none hover:bg-transparent hover:text-white transition-all duration-300 font-medium'
                    onClick={() => addToCart(product, selectedMarble)}
                  >
                    Add to Cart
                  </Button>
                )}
                <Button
                  className='px-6 py-2 border w-full md:w-auto border-white bg-transparent text-white rounded-none hover:bg-white hover:text-black transition-all duration-300'
                  onClick={() => setShowModal(true)}
                >
                  Enquire
                </Button>
              </div>
            </div>
          </div>
        </section>
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
                  {/* Honeypot field - hidden from users, bots will fill it */}
                  <input
                    type='text'
                    name='website'
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{
                      position: 'absolute',
                      left: '-9999px',
                      width: '1px',
                      height: '1px',
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                    tabIndex='-1'
                    autoComplete='off'
                    aria-hidden='true'
                  />
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
