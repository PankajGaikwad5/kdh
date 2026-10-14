'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { getCollectionName, formatTitle } from '@/lib/utils';
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
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const { cart, isInitialized, removeFromCart, clearCart } = useCart();
  
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const itemsRef = useRef(null);

  const [formLoadTime, setFormLoadTime] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendStage, setSendStage] = useState(0);

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
    setSentSuccess(false);
    setSendStage(1);

    const timer1 = setTimeout(() => setSendStage(2), 400);
    const timer2 = setTimeout(() => setSendStage(3), 1100);

    const productNames = cart.map(item => {
      const collectionName = item.collectionName || getCollectionName(item);
      const details = [];
      if (collectionName) details.push(`Collection: ${collectionName}`);
      if (item.selectedMarble) details.push(`Variant: ${item.selectedMarble}`);
      return `${item.title}${details.length ? ` (${details.join(', ')})` : ''}`;
    }).join(', ');

    const cartItems = cart.map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image,
      selectedMarble: item.selectedMarble || null,
      material: item.material || null,
      collectionName: item.collectionName || getCollectionName(item) || null,
    }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: {
            name: values.name,
            email: values.email ? values.email.trim() : '',
            number: values.phone, // Maps to 'number' in contact API
            message: values.message || 'Cart Inquiry for products.',
            subject: values.subject || 'Luxury Product Cart Inquiry',
            product: productNames,
            isCart: true,
            source: 'cart',
            cartItems: cartItems,
          },
          honeypot,
          timestamp: formLoadTime,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (response.ok) {
        setSendStage(4);
        setSentSuccess(true);
        setTimeout(() => {
          clearCart();
          router.push('/collections');
        }, 2200);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to submit the enquiry. Please try again.');
      }
    } catch (error) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isInitialized) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isLight ? 'border-black' : 'border-white'}`} />
      </div>
    );
  }

  return (
    <>
      <div
        ref={pageRef}
        style={{ opacity: 0 }}
        className={`min-h-screen flex flex-col transition-colors duration-500 ${
          isLight ? 'bg-white text-black' : 'bg-gradient-to-b bg-black text-white'
        }`}
      >
        <div className='min-h-screen flex flex-col justify-between'>
          <Navbar arrow={true} />
          
          <main className='pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full pb-16'>
            {/* Header */}
            <div className='w-full text-center flex justify-center'>
              <h1
                ref={headingRef}
                className={`text-2xl md:text-4xl font-bold pb-8 border-b-2 uppercase w-full md:max-w-3xl transition-colors duration-500 ${
                  isLight ? 'text-black border-zinc-200' : 'text-gray-200 border-gray-800'
                }`}
              >
                Your Cart
              </h1>
            </div>

            {cart.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className={`text-lg mb-8 tracking-widest uppercase font-light ${isLight ? 'text-zinc-600' : 'text-gray-400'}`}>
                  Your cart is empty
                </p>
                <Link
                  href='/collections'
                  className={`uppercase transition-all duration-300 ease-in-out border rounded-none px-8 py-3 tracking-widest font-semibold inline-block ${
                    isLight
                      ? 'bg-black text-white border-black hover:bg-zinc-800 hover:!text-white'
                      : 'bg-white text-black border-zinc-600 hover:bg-black hover:!text-white'
                  }`}
                  style={{ color: isLight ? '#ffffff' : undefined }}
                >
                  Browse Collections
                </Link>
              </div>
            ) : (
              <div className='w-full flex flex-col lg:flex-row gap-8 justify-center items-start py-12'>
                
                {/* Left: Cart Items List */}
                <div
                  ref={itemsRef}
                  className={`w-full lg:max-w-xl z-10 tracking-widest p-6 flex flex-col border rounded-lg transition-all duration-500 space-y-6 ${
                    isLight
                      ? 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xl'
                      : 'border-gray-800 bg-black/40 hover:border-gray-200 hover:shadow-2xl'
                  }`}
                >
                  <p className={`text-xs font-bold uppercase font-light border-b pb-2 ${isLight ? 'border-zinc-200 text-zinc-900' : 'border-gray-800 text-zinc-200'}`}>
                    Items Selected ({cart.length})
                  </p>
                  
                  <div className='space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar'>
                    {cart.map((item, index) => {
                      const collectionName = item.collectionName || getCollectionName(item);
                      return (
                        <div
                          key={`${item.id}-${item.selectedMarble || index}`}
                          className={`flex gap-4 p-3 border rounded-md items-center relative group transition-all duration-300 ${
                            isLight
                              ? 'border-zinc-200 bg-zinc-50/80 hover:border-zinc-300'
                              : 'border-gray-800 bg-black/40 hover:border-gray-600'
                          }`}
                        >
                          <div className={`relative w-20 h-20 overflow-hidden border rounded-sm flex-shrink-0 ${
                            isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-black border-gray-800'
                          }`}>
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className='object-contain'
                              sizes='80px'
                            />
                          </div>

                          <div className='flex-1 min-w-0 pr-8'>
                            <h2 className={`text-sm font-semibold tracking-wider capitalize truncate mb-1 ${
                              isLight ? 'text-zinc-900' : 'text-gray-200'
                            }`}>
                              {formatTitle(item.title)}
                            </h2>
                            {collectionName && (
                              <p className={`text-xs tracking-normal font-light mb-0.5 ${isLight ? 'text-zinc-500' : 'text-gray-400'}`}>
                                Collection: <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>{collectionName}</span>
                              </p>
                            )}
                            {item.material && (
                              <p className={`text-xs tracking-normal font-light ${isLight ? 'text-zinc-500' : 'text-gray-400'}`}>
                                Material: <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>{item.material}</span>
                              </p>
                            )}
                            {item.selectedMarble && (
                              <p className={`text-xs tracking-normal mt-0.5 font-light ${isLight ? 'text-zinc-500' : 'text-gray-400'}`}>
                                Variant: <span className={isLight ? 'text-zinc-900 font-medium' : 'text-white'}>{item.selectedMarble}</span>
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id, item.selectedMarble)}
                            className='text-gray-400 hover:text-red-500 transition-colors p-2 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer'
                            title='Remove item'
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Enquiry Form */}
                <div
                  ref={formRef}
                  className={`w-full lg:max-w-lg z-10 tracking-widest p-6 flex flex-col border rounded-lg transition-all duration-500 ${
                    isLight
                      ? 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xl'
                      : 'border-gray-800 bg-black/40 hover:border-gray-200 hover:shadow-2xl'
                  }`}
                >
                  <p className={`text-xs font-bold mb-2 uppercase font-light ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
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
                            <FormLabel className={isLight ? 'text-zinc-800 font-medium text-xs' : 'text-zinc-300 text-xs'}>
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={`border transition-colors duration-200 ${
                                  isLight
                                    ? 'bg-zinc-50 text-black border-zinc-300 placeholder:text-zinc-400 focus:bg-white focus:border-black'
                                    : 'bg-black text-white border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-300'
                                }`}
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
                            <FormLabel className={isLight ? 'text-zinc-800 font-medium text-xs' : 'text-zinc-300 text-xs'}>
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={`border transition-colors duration-200 ${
                                  isLight
                                    ? 'bg-zinc-50 text-black border-zinc-300 placeholder:text-zinc-400 focus:bg-white focus:border-black'
                                    : 'bg-black text-white border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-300'
                                }`}
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
                            <FormLabel className={isLight ? 'text-zinc-800 font-medium text-xs' : 'text-zinc-300 text-xs'}>
                              Contact No.
                            </FormLabel>
                            <FormControl>
                              <Input
                                className={`border transition-colors duration-200 ${
                                  isLight
                                    ? 'bg-zinc-50 text-black border-zinc-300 placeholder:text-zinc-400 focus:bg-white focus:border-black'
                                    : 'bg-black text-white border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-300'
                                }`}
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
                            <FormLabel className={isLight ? 'text-zinc-800 font-medium text-xs' : 'text-zinc-300 text-xs'}>
                              Message
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder='Enter your message'
                                className={`input textarea border transition-colors duration-200 ${
                                  isLight
                                    ? 'bg-zinc-50 text-black border-zinc-300 placeholder:text-zinc-400 focus:bg-white focus:border-black'
                                    : 'bg-black text-white border-zinc-700 placeholder:text-zinc-500 focus:border-zinc-300'
                                }`}
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
                        <Link href='/privacy-policy' className={`underline transition-colors duration-300 ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>
                          Privacy Policy
                        </Link>{' '}
                        and agree to our{' '}
                        <Link href='/terms-and-conditions' className={`underline transition-colors duration-300 ${isLight ? 'hover:text-black' : 'hover:text-white'}`}>
                          Terms & Conditions
                        </Link>.
                      </div>

                      {/* Visual Progress indicator when sending */}
                      {loading && (
                        <div className={`p-4 rounded border text-xs flex flex-col gap-3 transition-all duration-300 shadow-md ${
                          isLight 
                            ? 'bg-zinc-100 border-zinc-300 text-zinc-900' 
                            : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                        }`}>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2.5 font-medium'>
                              <Loader2 className={`w-4 h-4 animate-spin ${isLight ? 'text-black' : 'text-white'}`} />
                              <span className='font-semibold tracking-wide'>
                                {sendStage === 1 && 'Submitting your enquiry...'}
                                {sendStage === 2 && 'Processing product details...'}
                                {sendStage >= 3 && 'Finalizing submission...'}
                              </span>
                            </div>
                            <span className={`text-[10px] tracking-wider uppercase font-mono font-semibold ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                              {sendStage === 1 && '30%'}
                              {sendStage === 2 && '65%'}
                              {sendStage >= 3 && '85%'}
                            </span>
                          </div>
                          <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`}>
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${isLight ? 'bg-black' : 'bg-white'}`}
                              style={{
                                width: sendStage === 1 ? '30%' : sendStage === 2 ? '65%' : '85%',
                              }}
                            />
                          </div>
                          <p className={`text-[11px] font-light leading-tight ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                            Please wait while your enquiry is being submitted...
                          </p>
                        </div>
                      )}

                      {/* Visual Success notification */}
                      {sentSuccess && (
                        <div className='p-4 rounded border text-xs flex flex-col gap-2.5 bg-emerald-950/40 border-emerald-600 text-emerald-200 transition-all duration-300 shadow-md'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <CheckCircle2 className='w-4 h-4 text-emerald-400 shrink-0' />
                              <span className='font-semibold text-emerald-100 text-sm'>Enquiry Sent Successfully!</span>
                            </div>
                            <span className='text-[10px] font-mono uppercase text-emerald-400 font-bold'>100% Complete</span>
                          </div>
                          <div className='w-full h-1.5 rounded-full overflow-hidden bg-emerald-950'>
                            <div className='h-full rounded-full bg-emerald-400 w-full transition-all duration-300' />
                          </div>
                          <p className='text-emerald-300/90 text-xs mt-0.5 leading-normal'>
                            We have received your enquiry and our team will get back to you soon on the details you provided. Redirecting to collections...
                          </p>
                        </div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type='submit'
                        disabled={loading || sentSuccess}
                        className={`uppercase transition-all duration-300 ease-in-out border rounded-none px-5 tracking-normal font-medium mt-2 w-full h-12 flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                          isLight
                            ? 'bg-black text-white border-black hover:bg-zinc-800 hover:!text-white disabled:bg-zinc-900 disabled:opacity-90 disabled:text-white'
                            : 'bg-white text-black border-zinc-600 hover:bg-black hover:!text-white disabled:bg-zinc-200 disabled:opacity-80 disabled:text-black'
                        }`}
                        style={{ color: isLight ? '#ffffff' : undefined }}
                      >
                        {loading ? (
                          <div className='flex items-center justify-center gap-2.5 text-white'>
                            <Loader2 className='w-4 h-4 animate-spin text-white' />
                            <span className='tracking-wider font-semibold text-xs text-white' style={{ color: '#ffffff' }}>
                              Sending Enquiry ({sendStage === 1 ? '30%' : sendStage === 2 ? '65%' : '85%'})
                            </span>
                          </div>
                        ) : sentSuccess ? (
                          <div className='flex items-center justify-center gap-2 text-emerald-400'>
                            <CheckCircle2 className='w-4 h-4 text-emerald-400' />
                            <span className='tracking-wider font-semibold text-xs text-emerald-400'>
                              Enquiry Sent!
                            </span>
                          </div>
                        ) : (
                          <span 
                            className={`tracking-wider font-medium text-xs ${isLight ? 'text-white' : 'text-black group-hover:text-white'}`}
                            style={{ color: isLight ? '#ffffff' : undefined }}
                          >
                            Submit Inquiry
                          </span>
                        )}
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
