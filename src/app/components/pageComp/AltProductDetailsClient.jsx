'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { X, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react';
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
import { getCollectionName, formatTitle } from '@/lib/utils';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { formatProductDescription } from '@/app/utils/formatDescription';

const AccordionMarbles = dynamic(
  () => import('@/app/components/AccordionMarbles').then((mod) => mod.AccordionMarbles),
  { ssr: false }
);


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .regex(/^[0-9+\-\s()]+$/, { message: 'Please enter a valid phone number.' }),
  product: z.string().min(1, { message: 'Product name is required' }),
  message: z.string().optional(),
  subject: z.string().default('Product Enquiry'),
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

export default function ProductDetailsClient({ product, onClose }) {
  const router = useRouter();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const thumbRefs = useRef([]);
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

  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
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

      const isDesktop = window.innerWidth >= 768;

      // Subtle fade in for the page
      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0
      );

      if (isDesktop) {
        // Image just subtly scales since the container opacity handles the fade
        tl.fromTo(
          imageRef.current,
          { scale: 0.98 },
          { scale: 1, duration: 0.6, ease: 'power3.inOut' },
          0
        );

        // Elegant top-to-bottom reveal for text
        const textEls = detailsRef.current?.querySelectorAll('.gsap-reveal');
        if (textEls?.length) {
          tl.fromTo(
            textEls,
            { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0, x: 20 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              x: 0,
              duration: 0.8,
              stagger: 0.05,
              ease: 'power3.out'
            },
            0.3
          );
        }
      } else {
        // Very subtle scale for the image on mobile (container handles opacity)
        tl.fromTo(
          imageRef.current,
          { scale: 0.98 },
          { scale: 1, duration: 0.8 },
          0
        );

        // Elegant top-to-bottom reveal for text
        const textEls = detailsRef.current?.querySelectorAll('.gsap-reveal');
        if (textEls?.length) {
          tl.fromTo(
            textEls,
            { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: 'power3.out'
            },
            0.1
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  // Centering active thumbnail in horizontal scroll without scrolling the page
  useEffect(() => {
    if (isFullscreen) {
      const activeThumb = thumbRefs.current[currentIndex];
      if (activeThumb) {
        const container = activeThumb.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const thumbLeft = activeThumb.offsetLeft;
          const thumbWidth = activeThumb.clientWidth;
          container.scrollTo({
            left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [currentIndex, isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const preloadImage = useCallback((src) => {
    const img = new window.Image();
    img.onload = () => setLoadedImages((prev) => new Set([...prev, src]));
    img.src = src;
  }, []);

  // Silently fetch user location via IP geolocation
  const userLocationRef = useRef('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.city) {
          userLocationRef.current = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
        }
      })
      .catch(() => {
        // Silently fail – location is optional
      });
    return () => controller.abort();
  }, []);

  // Escape key handler (separated to handle full screen and modals)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else if (showModal) {
          setShowModal(false);
        } else {
          router.back();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [router, isFullscreen, showModal]);

  // Consolidated initialization effect
  useEffect(() => {
    // Set form load time for spam detection
    setFormLoadTime(Date.now());

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
      clearTimeout(fbTimeout);
    };
  }, []);

  // Preload active images whenever they change (e.g. when marble is selected)
  useEffect(() => {
    const timers = [];
    if (activeImages?.length > 0) {
      // Preload the first image immediately
      preloadImage(activeImages[0].filePath);
      
      // Preload the rest with a slight stagger
      activeImages
        .slice(1)
        .forEach((img, i) => {
          const t = setTimeout(() => preloadImage(img.filePath), i * 100);
          timers.push(t);
        });
    }
    return () => timers.forEach(clearTimeout);
  }, [activeImages, preloadImage]);

  const handleSelectMarble = useCallback((marbleName) => {
    // Determine what the "default" state for this product is
    const productDefault = 'defaultMarble' in (product || {}) 
      ? product.defaultMarble 
      : (product?.marbles && product.marbles.length > 0)
        ? product.marbles[0].name
        : (product?.material === 'Marble' ? 'Banswara' : null);
        
    const nextMarble = selectedMarble === marbleName ? productDefault : marbleName;
    if (selectedMarble !== nextMarble) {
      setSelectedMarble(nextMarble);
      setCurrentIndex(0);
      setImageLoaded(false);
    }
  }, [product, selectedMarble]);

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
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          values: {
            name: values.name,
            email: values.email,
            number: values.phone, // Maps to 'number' in contact API
            message: values.message || `Product enquiry for ${values.product}`,
            subject: values.subject || 'Product Enquiry',
            product: values.product,
            location: userLocationRef.current,
          },
          honeypot, // Spam detection: should be empty
          timestamp: formLoadTime || Date.now() - 3500, // Spam detection: time form was loaded
        }),
      });

      if (res.ok) {
        alert('Enquiry submitted successfully!');
        setShowModal(false);
        form.reset({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: 'Product Enquiry',
          product: form.getValues('product'),
        });
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || data.msg || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
      style={{ opacity: 0, fontFamily: '"Poppins", sans-serif' }}
      className='min-h-screen bg-black text-white'
    >
      <Navbar home={true} />
      <header className='fixed top-3 right-2 flex justify-end p-4 z-30'>
        <button
          onClick={() => (onClose ? onClose() : router.back())}
          className='text-white hover:text-gray-300'
        >
          <X size={30} />
        </button>
      </header>

      <div className='grid md:grid-cols-[45%_55%] xl:grid-cols-[40%_60%] items-start pt-16'>
        <section
          ref={imageRef}
          className="relative flex flex-col items-center justify-start w-full md:h-[calc(100vh-6rem)]"
        >
          {(activeImages?.length > 0 || product.video) && (
            <div className="w-full px-4 md:px-8 xl:px-12 py-4 lg:py-2 flex flex-col justify-between h-[55vh] md:h-full gap-4">
              <div className="flex justify-end gap-2 w-full">
                <button
                  onClick={() => setShowThumbnailGrid(!showThumbnailGrid)}
                  className='text-gray-400 bg-white/10 rounded-full p-1.5 w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-all z-20'
                  title='View all media'
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className='text-gray-400 bg-white/10 rounded-full p-1.5 w-8 h-8 flex items-center justify-center hover:bg-white hover:text-black transition-all z-20'
                  title="View Fullscreen"
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3' />
                  </svg>
                </button>
              </div>
              <div
                className="relative flex-1 flex items-center justify-center w-full group/slider rounded-lg overflow-hidden bg-transparent min-h-0"
              >
                {!imageLoaded && (
                  <div className='absolute inset-0 flex items-center justify-center z-10'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
                  </div>
                )}

                <div
                  className='relative w-full h-full flex items-center justify-center select-none'
                  style={{
                    opacity: imageLoaded ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <AnimatePresence mode="wait">
                    {isVideoSlide && product.video ? (
                      <motion.video
                        key="video"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        src={product.video}
                        className='max-w-full max-h-full object-contain'
                        controls
                        autoPlay
                        onLoadedData={() => setImageLoaded(true)}
                      />
                    ) : (
                      activeImages[currentIndex] && (
                        <motion.div
                          key={currentIndex}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className="relative flex items-center justify-center w-full h-full"
                        >
                          <img
                            onClick={toggleFullscreen}
                            src={activeImages[currentIndex].filePath}
                            alt={product.title}
                            className='max-w-full max-h-full object-contain cursor-pointer'
                            onLoad={() => setImageLoaded(true)}
                          />
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {totalMedia > 1 && (
                <div className='flex items-center justify-center gap-8 z-20 h-16'>
                  <button
                    onClick={() => navigate('prev')}
                    disabled={!imageLoaded}
                    className='text-gray-400 hover:text-white transition-all disabled:opacity-50 z-20 px-2'
                  >
                    <span className='text-3xl font-light'>‹</span>
                  </button>
                  <div className='text-sm text-gray-400 font-medium tracking-widest '>
                    {currentIndex + 1} / {totalMedia}
                  </div>
                  <button
                    onClick={() => navigate('next')}
                    disabled={!imageLoaded}
                    className='text-gray-400 hover:text-white transition-all disabled:opacity-50 z-20 px-2'
                  >
                    <span className='text-3xl font-light'>›</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

                <section
          ref={detailsRef}
          className='p-4 md:px-6 lg:px-10 lg:py-2 flex flex-col justify-between h-auto md:h-[calc(100vh-6rem)] bg-black z-10'
        >
          <style dangerouslySetInnerHTML={{ __html: "@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;650&display=swap'); @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');" }} />
          <div className='flex flex-col overflow-y-auto flex-1 min-h-0 md:pr-4' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className='flex justify-between items-end mb-6'>
            <h1 className='gsap-reveal lowercase tracking-wide text-4xl md:text-[2.5rem] lg:text-[3rem]' style={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 650, lineHeight: 1 }}>
              {formatTitle(product.title)}
            </h1>
            {collectionName && (
              <p className="gsap-reveal uppercase text-sm text-gray-400" >
                {collectionName}
              </p>
            )}
            </div>

            <div className="flex flex-col gap-4 justify-center text-sm" style={{ fontFamily: '"Poppins", sans-serif' }}>
              {product.inspiration && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Inspiration</div>
                  <div className="flex-1 font-thin text-white text-xs">{product.inspiration}</div>
                </div>
              )}
              {product.concept && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Concept</div>
                  <div className="flex-1 font-thin text-white text-xs">{product.concept}</div>
                </div>
              )}

              {product.material && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Material</div>
                  <div className="flex-1 font-thin text-white text-xs">{product.material}</div>
                </div>
              )}

              {product.finish && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Finish</div>
                  <div className="flex-1 font-thin text-white text-xs">{product.finish}</div>
                </div>
              )}

              {product.dimensions && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Dimension</div>
                  <div className="flex-1 font-thin text-white text-xs flex flex-col gap-1">
                    {product.dimensions.split('|').map((part, idx) => {
                      const splitIdx = part.indexOf(':');
                      if (splitIdx !== -1) {
                        const label = part.substring(0, splitIdx).trim();
                        const val = part.substring(splitIdx + 1).trim();
                        return (
                          <div key={idx} className="flex">
                            <span className="w-20 shrink-0">{label}:</span>
                            <span>{val}</span>
                          </div>
                        );
                      }
                      return <div key={idx}>{part.trim()}</div>;
                    })}
                  </div>
                </div>
              )}

              {product.category && (
                <div className="gsap-reveal flex gap-4 border-b border-white/20 pb-4">
                  <div className="w-24 md:w-32 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Category</div>
                  <div className="flex-1 font-thin text-white text-xs">{product.category}</div>
                </div>
              )}

              {(product.material === 'Marble' || product.marbles || product.colors) && (
                <div className="gsap-reveal flex flex-col gap-4 pb-4">
                  <div className="w-full md:w-64 shrink-0 text-gray-400 uppercase tracking-widest text-xs ">Recommended Materials</div>
                  <div className="flex-1 flex flex-row flex-wrap gap-x-7 gap-y-10 md:gap-9 pl-6 pt-2">
                    {(product.marbles || product.colors || marbles).map((m, idx) => {
                      const isSelected = selectedMarble === m.name;
                      return (
                        <button 
                          key={m.name + idx} 
                          onClick={() => handleSelectMarble(m.name)}
                          className="relative flex flex-col items-center group cursor-pointer focus:outline-none"
                        >
                          <div className={`w-10 h-10 relative overflow-hidden rounded-full transition-all duration-300 group-hover:scale-110 ${isSelected ? 'ring-1 ring-white ring-offset-2 ring-offset-black bg-white/20' : 'border border-white/20 bg-white/10'}`}>
                             <Image src={m.src || m.swatches?.[0]} alt={m.name} fill className={`object-cover ${m.rotate ? 'rotate-90' : ''}`} />
                          </div>
                          <span className={`absolute top-12 left-1/2 -translate-x-1/2 text-[9px] uppercase text-center w-[6rem] break-words leading-tight transition-opacity duration-300 z-20 pointer-events-none ${isSelected ? 'text-white opacity-100' : 'text-gray-400 opacity-0 group-hover:opacity-100'}`}>{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='gsap-reveal flex gap-4 w-full mt-4 md:mt-0 h-16 items-center shrink-0'>
            <div className="w-32 hidden md:block"></div>
            <div className='flex-1 flex flex-col sm:flex-row gap-4 sm:items-center justify-start md:justify-end'>
              {product.pdf && (
                <a href={product.pdf} target='_blank' rel='noopener noreferrer' className='w-full md:w-auto'>
                  <HoverBorderGradient
                    containerClassName="mt-0 border-gray-400"
                    className="bg-black/20 flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors duration-300 px-6 py-[8px]"
                    as="button"
                  >
                    <span className="mb-[-2px]">Download Spec Sheet</span>
                  </HoverBorderGradient>
                </a>
              )}
              {isInCart(product._id.$oid, selectedMarble) ? (
                <div onClick={() => removeFromCart(product._id.$oid, selectedMarble)}>
                  <HoverBorderGradient
                    containerClassName="mt-0"
                    className="bg-red-500/20 flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-red-500 group-hover:text-white transition-colors duration-300 px-6 py-[8px]"
                    as="button"
                  >
                    <span className="mb-[-2px]">Remove from Cart</span>
                  </HoverBorderGradient>
                </div>
              ) : (
                <div onClick={() => addToCart(product, selectedMarble)}>
                  <HoverBorderGradient
                    containerClassName="mt-0 border-gray-400"
                    className="bg-black/20 flex items-center justify-center text-[10px] font-medium uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors duration-300 px-6 py-[8px]"
                    as="button"
                  >
                    <span className="mb-[-2px]">Add to Cart</span>
                  </HoverBorderGradient>
                </div>
              )}
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
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4'
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className='bg-zinc-950 border border-zinc-800 p-6 sm:p-8 rounded-xl w-full max-w-md relative max-h-[90vh] overflow-y-auto'
            >
              <button
                onClick={() => setShowModal(false)}
                className='absolute top-4 right-4 text-gray-400 hover:text-white transition'
              >
                <X size={20} />
              </button>
              <h2 className='text-xl font-semibold mb-4 text-white'>Enquire</h2>
              <Form {...form}>
                <form
                  className='space-y-4'
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
                        <FormLabel className='text-gray-300'>Name</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500'
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
                        <FormLabel className='text-gray-300'>Email</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500'
                            placeholder='Enter your email'
                            type='email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-300'>Mobile Number</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500'
                            placeholder='Enter your mobile number'
                            type='tel'
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
                        <FormLabel className='text-gray-300'>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            className='bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500'
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
                        <FormLabel className='text-gray-300'>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Enter your message'
                            className='bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 resize-none'
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type='submit'
                    disabled={submitting}
                    className='w-full bg-white uppercase text-black hover:bg-gray-200 transition font-medium tracking-wider py-2 rounded-md'
                  >
                    {submitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Lightbox Carousel Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 md:p-8 select-none"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between w-full text-white">
              <span className="text-xs md:text-sm tracking-widest font-light uppercase">
                {product.title} <span className="opacity-50">— {currentIndex + 1} / {totalMedia}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowThumbnailGrid(!showThumbnailGrid)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer border border-white/10"
                  aria-label="Toggle thumbnail grid"
                  title="View all media"
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all cursor-pointer border border-white/10"
                  aria-label="Close fullscreen view"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Centered Image display */}
            <div className="relative flex-1 flex items-center justify-center w-full h-full my-4 overflow-hidden">
              <AnimatePresence>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                  {isVideoSlide && product.video ? (
                    <video
                      src={product.video}
                      className="max-w-full max-h-full object-contain"
                      controls
                      autoPlay
                    />
                  ) : (
                    <img
                      src={activeImages[currentIndex]?.filePath}
                      alt={`${product.title} - Image ${currentIndex + 1}`}
                      className="max-w-full max-h-full object-contain pointer-events-none"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {totalMedia > 1 && (
                <>
                  <button
                    onClick={() => navigate('prev')}
                    className="absolute left-2 md:left-8 text-gray-400 hover:text-white transition-all cursor-pointer p-4"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={50} className='text-gray-400 hover:text-white' />
                  </button>
                  <button
                    onClick={() => navigate('next')}
                    className="absolute right-2 md:right-8 text-gray-400 hover:text-white transition-all cursor-pointer p-4"
                    aria-label="Next image"
                  >
                    <ChevronRight size={50} className='text-gray-400 hover:text-white' />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation Strip */}
            {totalMedia > 1 && (
              <div className="w-full max-w-[1000px] mx-auto overflow-hidden">
                <div className="relative flex gap-2 overflow-x-auto py-2 scroll-smooth select-none scrollbar-none" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {activeImages?.map((img, idx) => (
                    <button
                      key={idx}
                      ref={(el) => (thumbRefs.current[idx] = el)}
                      onClick={() => handleImageSelect(idx)}
                      className={`relative w-16 h-12 md:w-20 md:h-14 shrink-0 overflow-hidden border transition-all ${idx === currentIndex
                        ? 'border-white scale-105 opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-85'
                        }`}
                    >
                      <Image src={img.filePath} fill sizes="80px" unoptimized={true} className="object-cover pointer-events-none" alt="" />
                    </button>
                  ))}
                  {product.video && (
                    <button
                      ref={(el) => (thumbRefs.current[activeImages?.length || 0] = el)}
                      onClick={() => handleImageSelect(activeImages?.length || 0)}
                      className={`relative w-16 h-12 md:w-20 md:h-14 shrink-0 overflow-hidden border transition-all bg-zinc-900 flex items-center justify-center ${activeImages?.length === currentIndex
                        ? 'border-white scale-105 opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-85'
                        }`}
                    >
                      <span className="text-[10px] text-white font-medium tracking-wider">VIDEO</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thumbnail Grid Modal (Rendered at root to avoid clipping) */}
      <ThumbnailGrid
        images={activeImages}
        video={product.video}
        currentIndex={currentIndex}
        onImageSelect={handleImageSelect}
        isOpen={showThumbnailGrid}
        onToggle={() => setShowThumbnailGrid(!showThumbnailGrid)}
      />
    </main>
  );
}

