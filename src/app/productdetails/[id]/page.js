'use client';

import React, { useEffect, useState } from 'react';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

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

  async function onSubmit(values) {
    // Do something with the form values.
    // console.log(values);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        // Refresh the page
        window.location.reload();
      } else {
        alert('Failed to send the message. Please try again.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownload = async (event) => {
    event.preventDefault();
    const fileUrl = pdf;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
            'Cache-Control': 'max-age=300',
          },
        });

        if (!res.ok) return console.error('Failed to fetch product');

        const data = await res.json();
        if (!data?.products) return;

        setProduct(data.products);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching product:', error);
        }
      }
    };

    fetchData();
  }, [params]);

  const nextImage = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you can call your API or send email
    setShowModal(false);
    setFormData({ name: '', email: '', message: '' });
  };
  console.log(product);

  if (!product) return <div className='text-center py-20'>Loading...</div>;

  return (
    <main
      className={`min-h-screen bg-black text-white font-sans relative ${montserrat.className}`}
    >
      <header className='fixed top-0  left-0 w-full flex justify-between items-center p-4 z-50 bg-black/80 backdrop-blur'>
        <Image
          src='/assets/kdhlogo3.png'
          alt='Logo'
          width={150}
          height={40}
          className='object-contain'
        />
        <button
          onClick={() => router.back()}
          className='text-white hover:text-gray-300 transition'
        >
          <X size={28} />
        </button>
      </header>

      <div className='grid md:grid-cols-2 pt-20'>
        <section className='relative p-4 flex items-center justify-center bg-black'>
          {product.images?.length > 0 && (
            <div className='relative w-full h-[80vh] overflow-hidden rounded-lg'>
              <AnimatePresence mode='wait'>
                <motion.img
                  key={currentIndex}
                  src={product.images[currentIndex].filePath}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className='w-full h-full object-contain'
                />
              </AnimatePresence>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className='absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-2 hover:bg-white hover:text-black'
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/60 rounded-full p-2 hover:bg-white hover:text-black'
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}
        </section>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='p-10 flex flex-col justify-between bg-black z-10'
        >
          <div>
            <h1 className='text-4xl md:text-4xl mb-6 capitalize font-light tracking-tight'>
              {product.title}
            </h1>
            <div className='flex flex-col gap-4 text-sm'>
              <div className='grid grid-cols-3 '>
                <div>
                  <h4 className='font-semibold  text-gray-400 text-xs mb-1'>
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
                  <h4 className='font-semibold  text-gray-400 text-xs mb-1'>
                    Lead Time
                  </h4>
                  <p className='text-white'>30 Days</p>
                </div>
                <div>
                  <h4 className='font-semibold  text-gray-400 text-xs mb-1'>
                    Material
                  </h4>
                  <p className='text-white'>{product.material}</p>
                </div>
              </div>

              <div className='mt-6 border-t border-gray-700 pt-4 text-sm text-white font-light whitespace-pre-line leading-relaxed'>
                {product.description}
              </div>

              <div className='mt-10 flex gap-4'>
                <a href={product.pdf} target='_blank' rel='noopener noreferrer'>
                  <Button
                    variant='outline'
                    className='px-6 py-2 border border-white text-black rounded-none hover:bg-white/80'
                  >
                    Download Spec Sheet
                  </Button>
                </a>
                <Button
                  className='px-6 py-2 border border-white bg-transparent text-white rounded-none hover:bg-white hover:text-black'
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
                  // action='https://getform.io/f/bjjjprgb'
                  // method='POST'
                  className={`space-y-4 px-4 `}
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  {/* <h1 className='font-semibold uppercase'>
                    Email us to get the 3d model sent to your email
                  </h1> */}
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
