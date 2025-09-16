'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
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
import { products } from '@/app/components/products';
import ThumbnailGrid from '@/app/components/ThumbnailGrid';
import Navbar from '@/app/components/Navbar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'name must be at least 2 characters')
    .max(50, 'name must be at most 50 characters'),
  email: z.string().email('Invalid email address').min(2).max(50),
  message: z.string(),
  subject: z.string(),
  product: z.string(),
});

const ProductDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const MotionImage = motion(Image);
  const [showThumbnailGrid, setShowThumbnailGrid] = useState(false);

  // Calculate total media count and check if current slide is video
  const totalMedia = (product?.images?.length || 0) + (product?.video ? 1 : 0);
  const isVideoSlide = currentIndex >= (product?.images?.length || 0);

  const handleImageSelect = useCallback(
    (index) => {
      setImageLoaded(false);
      setCurrentIndex(index);

      // For video slide, set loaded immediately
      if (index >= (product?.images?.length || 0)) {
        setImageLoaded(true);
      } else if (loadedImages.has(product.images[index].filePath)) {
        setImageLoaded(true);
      }
    },
    [product, loadedImages]
  );

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

  // Preload images aggressively
  const preloadImage = useCallback((src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        setLoadedImages((prev) => new Set([...prev, src]));
        resolve(src);
      };
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  // Inject Facebook Pixel on mount
  useEffect(() => {
    if (window.fbq) return;

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
  }, []);

  async function onSubmit(values) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        window.location.reload();
      } else {
        alert('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Replace API fetch with static data lookup and aggressive preloading
  useEffect(() => {
    if (!params.id) return;

    const foundProduct = products.find((p) => {
      const productId = typeof p._id === 'object' ? p._id.$oid : p._id;
      return productId === params.id;
    });

    if (foundProduct) {
      setProduct(foundProduct);

      // Preload ALL images immediately
      if (foundProduct.images?.length > 0) {
        // Preload first image immediately
        preloadImage(foundProduct.images[0].filePath).then(() => {
          setImageLoaded(true);
        });

        // Preload remaining images in background
        foundProduct.images.slice(1).forEach((image, index) => {
          setTimeout(() => {
            preloadImage(image.filePath);
          }, index * 100); // Stagger loading
        });
      }
    } else {
      console.error('Product not found');
    }
  }, [params.id, preloadImage]);

  // Escape key listener
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        router.back();
        console.log('working');
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [router]);

  const nextImage = useCallback(() => {
    if (!totalMedia) return;
    setImageLoaded(false);
    const nextIndex = (currentIndex + 1) % totalMedia;
    setCurrentIndex(nextIndex);

    // For video slide, set loaded immediately
    if (nextIndex >= (product?.images?.length || 0)) {
      setImageLoaded(true);
    } else if (loadedImages.has(product.images[nextIndex].filePath)) {
      setImageLoaded(true);
    }
  }, [product, currentIndex, loadedImages, totalMedia]);

  const prevImage = useCallback(() => {
    if (!totalMedia) return;
    setImageLoaded(false);
    const prevIndex = currentIndex === 0 ? totalMedia - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);

    // For video slide, set loaded immediately
    if (prevIndex >= (product?.images?.length || 0)) {
      setImageLoaded(true);
    } else if (loadedImages.has(product.images[prevIndex].filePath)) {
      setImageLoaded(true);
    }
  }, [product, currentIndex, loadedImages, totalMedia]);

  // Handle image load completion
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Handle video load completion
  const handleVideoLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  // Set page title and meta tags dynamically
  useEffect(() => {
    if (product?.title) {
      document.title = product.title;

      // Set description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content =
        product.description ||
        `${product.title} - Product specifications and details`;

      // Set keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = `${product.title}, ${
        product.material || ''
      }, furniture, interior design`
        .replace(/,\s*,/g, ',')
        .replace(/^,|,$/g, '');
    }
  }, [product]);

  if (!product)
    return (
      <div className='text-center bg-black text-white py-20 w-full h-screen flex justify-center items-center'>
        <div className='flex flex-col items-center gap-4'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white'></div>
          <p>Loading product...</p>
        </div>
      </div>
    );

  return (
    <main
      className={`min-h-screen bg-black text-white font-sans relative ${montserrat.className}`}
    >
      <Navbar />
      <header className='fixed top-0 right-0 w-full flex justify-end items-center p-4 z-30 bg-black/80 backdrop-blur'>
        {/* <a href='/'>
          <Image
            src='/assets/kdhlogo3.png'
            alt='Logo'
            width={150}
            height={40}
            className='object-contain'
          />
        </a> */}
        <button
          onClick={() => router.back()}
          className='text-white hover:text-gray-300 transition'
        >
          <X size={30} />
        </button>
      </header>

      <div className='grid md:grid-cols-2 pt-14'>
        <section className='relative p-4 flex items-center justify-center bg-black'>
          {(product.images?.length > 0 || product.video) && (
            <div className='relative w-full h-[80vh] overflow-hidden rounded-lg'>
              {/* Loading state */}
              {!imageLoaded && (
                <div className='absolute inset-0 flex items-center justify-center z-10'>
                  <div className='flex flex-col items-center gap-4'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                    <p className='text-sm text-gray-400'>Loading...</p>
                  </div>
                </div>
              )}

              {/* Media content */}
              <div className='relative w-full h-full opacity-100'>
                {isVideoSlide && product.video ? (
                  <video
                    key='product-video'
                    src={product.video}
                    className='w-full h-full object-contain'
                    controls
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                    onLoadedData={handleVideoLoad}
                  />
                ) : (
                  <Image
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                    key={currentIndex}
                    src={product.images[currentIndex].filePath}
                    alt={product.title}
                    className='object-contain'
                    fill
                    sizes='(max-width: 768px) 100vw, 50vw'
                    priority={currentIndex === 0}
                    quality={75}
                    unoptimized={product.images[
                      currentIndex
                    ].filePath.startsWith('http')}
                    onLoad={handleImageLoad}
                    onLoadingComplete={handleImageLoad}
                  />
                )}
              </div>

              {/* Thumbnail Grid Component */}
              <ThumbnailGrid
                images={product.images}
                video={product.video}
                currentIndex={currentIndex}
                onImageSelect={handleImageSelect}
                isOpen={showThumbnailGrid}
                onToggle={() => setShowThumbnailGrid(!showThumbnailGrid)}
              />

              {/* Navigation buttons */}
              {totalMedia > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={!imageLoaded}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20'
                  >
                    <span className='text-xl'>‹</span>
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={!imageLoaded}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-3 hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20'
                  >
                    <span className='text-xl'>›</span>
                  </button>
                </>
              )}

              {/* Media counter */}
              {totalMedia > 1 && (
                <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 rounded-full px-3 py-1 text-sm z-20'>
                  {currentIndex + 1} / {totalMedia}
                </div>
              )}
            </div>
          )}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='p-4 md:p-10 flex flex-col 2xl:flex-row 2xl:mt-20 justify-between 2xl:items-center bg-black z-10'
        >
          <div className=''>
            <h1 className='text-4xl md:text-4xl 2xl:text-6xl 2xl:mb-20 mb-6 capitalize font-light tracking-tight '>
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
                    className='text-white hover:underline transition-all flex items-center'
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

            <div className='flex flex-col gap-4 text-sm 2xl:space-y-20'>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                <div>
                  <h4 className='font-semibold text-gray-400 text-xs   mb-1'>
                    Dimension
                  </h4>
                  <p className='text-white '>
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
                  <h4 className='font-semibold text-gray-400 text-xs  mb-1'>
                    Lead Time
                  </h4>
                  <p className='text-white '>30 Days</p>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-400 text-xs  mb-1'>
                    Material
                  </h4>
                  <p className='text-white '>{product.material}</p>
                </div>
              </div>

              {product.material === 'Marble' && (
                <div>
                  <h2 className='text-lg font-semibold mb-4'>MARBLES</h2>
                  <div className='flex flex-wrap gap-4'>
                    {/* Banswara */}
                    <div className='flex flex-col items-center text-center'>
                      <Image
                        width={70}
                        height={70}
                        src='/marbles/banswara.webp'
                        alt='Banswara'
                        className='aspect-square object-cover'
                      />
                      <p className='text-xs w-[80px] mt-2 break-words'>
                        Banswara
                      </p>
                    </div>

                    {/* Indian Black Bheslana */}
                    <div className='flex flex-col items-center text-center'>
                      <Image
                        width={70}
                        height={70}
                        src='/marbles/indianblackbheslana.webp'
                        alt='Indian Black Bheslana'
                        className='aspect-square object-cover'
                      />
                      <p className='text-xs w-[80px] mt-2 break-words'>
                        Indian Black Bheslana
                      </p>
                    </div>

                    {/* Indian Rosso Levante */}
                    <div className='flex flex-col items-center text-center'>
                      <Image
                        width={70}
                        height={70}
                        src='/marbles/indianrossolevante.webp'
                        alt='Indian Rosso Levante'
                        className='aspect-square object-cover'
                      />
                      <p className='text-xs w-[80px] mt-2 break-words'>
                        Indian Rosso Levante
                      </p>
                    </div>

                    {/* Italian Beige Travertine */}
                    <div className='flex flex-col items-center text-center'>
                      <Image
                        width={70}
                        height={70}
                        src='/marbles/italianbeigetravertine.webp'
                        alt='Italian Beige Travertine'
                        className='aspect-square object-cover'
                      />
                      <p className='text-xs w-[80px] mt-2 break-words'>
                        Italian Beige Travertine
                      </p>
                    </div>

                    {/* Marquina */}
                    <div className='flex flex-col items-center text-center'>
                      <Image
                        width={70}
                        height={70}
                        src='/marbles/marquina.webp'
                        alt='Marquina'
                        className='aspect-square object-cover'
                      />
                      <p className='text-xs w-[80px] mt-2 break-words'>
                        Marquina
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className='mt-6 border-t border-gray-700 pt-4 text-sm  text-white font-light whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>

              <div className='mt-10 flex gap-4 flex-col md:flex-row '>
                <a href={product.pdf} target='_blank' rel='noopener noreferrer'>
                  <Button
                    variant='outline'
                    className=' px-6 py-2 border w-full md:w-auto border-white text-black rounded-none hover:bg-white/80'
                  >
                    Download Spec Sheet
                  </Button>
                </a>
                <Button
                  className=' px-6 py-2 border w-full md:w-auto border-white bg-transparent text-white rounded-none hover:bg-white hover:text-black'
                  onClick={() => setShowModal(true)}
                >
                  Enquire
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Enquiry Modal */}
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
              transition={{ duration: 0.3 }}
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
                  className={`space-y-4 px-4`}
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
                            className='input textarea bg-black text-white placeholder:text-white'
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
                    className='bg-white uppercase text-gray-900 hover:bg-black hover:text-gray-300 transition-all duration-500 ease-in-out rounded-full px-5 tracking-normal font-medium'
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
};

export default ProductDetailsPage;
