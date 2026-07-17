'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import gsap from 'gsap';


const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  email: z.string().email('Invalid email address').min(2).max(50),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  message: z.string().optional(),
  subject: z.string(),
});

export default function CartPage() {
  const router = useRouter();
  const { cart, isInitialized, removeFromCart, clearCart } = useCart();
  
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const itemsRef = useRef(null);

  const [formLoadTime, setFormLoadTime] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  // GSAP entrance animations
  useEffect(() => {
    if (isInitialized) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Fade in the whole page
        tl.fromTo(
          pageRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 }
        );

        // Heading reveal from bottom
        tl.fromTo(
          headingRef.current,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
          0.2
        );

        // Cart items section reveal
        if (itemsRef.current) {
          tl.fromTo(
            itemsRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1 },
            0.35
          );
        }

        // Form section slide up and fade
        if (formRef.current) {
          tl.fromTo(
            formRef.current,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1 },
            0.45
          );
        }
      });

      return () => ctx.revert();
    }
  }, [isInitialized]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      subject: 'Luxury Product Cart Inquiry',
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    const productNames = cart.map(item => {
      return `${item.title}${item.selectedMarble ? ` (${item.selectedMarble})` : ''}`;
    }).join(', ');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: {
            name: values.name,
            email: values.email,
            number: values.phone, // Maps to 'number' in contact API
            message: values.message || 'Cart Inquiry for products.',
            subject: values.subject,
            product: productNames,
          },
          honeypot,
          timestamp: formLoadTime,
        }),
      });

      if (response.ok) {
        alert('Enquiry submitted successfully!');
        clearCart();
        router.push('/collections');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit the enquiry. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isInitialized) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center text-white'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white' />
      </div>
    );
  }

  return (
    <>
      <div
        ref={pageRef}
        style={{ opacity: 0 }}
        className='min-h-screen flex flex-col bg-gradient-to-b bg-black'
      >
        <div
          className='min-h-screen text-white flex flex-col justify-between'
          
        >
          <Navbar arrow={true} />
          
          <main className='pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full pb-16'>
            {/* Header */}
            <div className='w-full text-center flex justify-center'>
              <h1
                ref={headingRef}
                className='text-2xl md:text-4xl font-bold text-gray-200 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'
              >
                Your Cart
              </h1>
            </div>

            {cart.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className='text-gray-400 text-lg mb-8 tracking-widest uppercase font-light'>
                  Your cart is empty
                </p>
                <Link
                  href='/collections'
                  className='bg-white uppercase text-gray-900 hover:bg-black hover:text-white transition-all duration-500 ease-in-out border-zinc-600 rounded-none border px-8 py-3 tracking-widest font-semibold'
                >
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className='w-full flex flex-col lg:flex-row gap-8 justify-center items-start py-12'>
                
                {/* Left: Cart Items List */}
                <div
                  ref={itemsRef}
                  className='w-full lg:max-w-xl z-10 tracking-widest p-6 flex flex-col border border-gray-800 hover:border-gray-200 rounded-lg hover:shadow-2xl transition-all duration-500 space-y-6'
                >
                  <p className='text-xs font-bold uppercase font-light border-b border-gray-800 pb-2'>
                    Items Selected ({cart.length})
                  </p>
                  
                  <div className='space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar'>
                    {cart.map((item, index) => (
                      <div
                        key={`${item.id}-${item.selectedMarble || index}`}
                        className='flex gap-4 p-3 border border-gray-800 rounded-md items-center relative group transition-all duration-300 hover:border-gray-600 bg-black/40'
                      >
                        <div className='relative w-20 h-20 bg-black overflow-hidden border border-gray-800 rounded-sm flex-shrink-0'>
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className='object-contain'
                            sizes='80px'
                          />
                        </div>

                        <div className='flex-1 min-w-0 pr-8'>
                          <h2 className='text-sm font-semibold tracking-wider text-gray-200 capitalize truncate mb-1'>
                            {item.title}
                          </h2>
                          <p className='text-xs text-gray-400 tracking-normal font-light'>
                            Material: <span className='text-white'>{item.material}</span>
                          </p>
                          {item.selectedMarble && (
                            <p className='text-xs text-gray-400 tracking-normal mt-0.5 font-light'>
                              Variant: <span className='text-white'>{item.selectedMarble}</span>
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.selectedMarble)}
                          className='text-gray-500 hover:text-red-500 transition-colors p-2 absolute right-2 top-1/2 -translate-y-1/2'
                          title='Remove item'
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Enquiry Form */}
                <div
                  ref={formRef}
                  className='w-full lg:max-w-lg z-10 tracking-widest p-6 flex flex-col border border-gray-800 hover:border-gray-200 rounded-lg hover:shadow-2xl transition-all duration-500'
                >
                  <p className='text-xs font-bold mb-2 uppercase font-light'>
                    Inquiry details
                  </p>
                  
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className='space-y-4'
                    >
                      {/* Honeypot field for bot/spam check */}
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
                                className='text-black border border-zinc-400'
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
                                className='text-black border border-zinc-400'
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
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact No.</FormLabel>
                            <FormControl>
                              <Input
                                className='text-black border border-zinc-400'
                                placeholder='Enter contact number'
                                {...field}
                                type='number'
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
                                className='input textarea text-black border border-zinc-400'
                                rows={5}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className='text-[10px] text-zinc-500 font-light leading-relaxed tracking-wider pt-2'>
                        By submitting this form, you consent to our processing of your personal data as outlined in our{' '}
                        <Link href='/privacy-policy' className='underline hover:text-white transition-colors duration-300'>
                          Privacy Policy
                        </Link>{' '}
                        and agree to our{' '}
                        <Link href='/terms-and-conditions' className='underline hover:text-white transition-colors duration-300'>
                          Terms & Conditions
                        </Link>.
                      </div>

                      <Button
                        type='submit'
                        disabled={loading}
                        className='bg-white uppercase text-gray-900 hover:bg-black hover:text-white transition-all duration-500 ease-in-out border-zinc-600 rounded-none border px-5 tracking-normal font-medium mt-2 w-full h-11'
                      >
                        {loading ? 'Submitting...' : 'Submit Inquiry'}
                      </Button>
                    </form>
                  </Form>
                </div>

              </div>
            )}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
