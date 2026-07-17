'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import Navbar from '../components/Navbar';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Bebas_Neue } from 'next/font/google';
import Footer from '../components/Footer';
import Link from 'next/link';

const bebas = Bebas_Neue({
  subsets: ['latin'], // Specify subsets
  weight: ['400'], // Specify weight
});

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'name must be at least 2 characters')
    .max(50, 'name must be at most 50 characters'),
  email: z.string().email('Invalid email address').min(2).max(50),
  message: z.string(),
  subject: z.string(),
  number: z.string(),
});

const page = () => {
  // Track when form was loaded (for spam detection)
  const [formLoadTime, setFormLoadTime] = useState(null);
  const [honeypot, setHoneypot] = useState('');
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

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

      // Heading reveal from bottom
      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.2
      );

      // Form section slide up and fade
      tl.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        0.35
      );

      // Info section - reveal each child with stagger
      const infoEls = infoRef.current?.children;
      if (infoEls?.length) {
        tl.fromTo(
          infoEls,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.9,
            stagger: 0.12,
            ease: 'power2.inOut',
          },
          0.45
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      subject: 'Contact Form',
      number: '',
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
          honeypot, // Spam detection: should be empty
          timestamp: formLoadTime, // Spam detection: time form was loaded
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
  return (
    <>
      <div
        ref={pageRef}
        style={{ opacity: 0 }}
        className='min-h-screen flex flex-col bg-gradient-to-b bg-black'
      >
        <div
          className='min-h-screen text-white'
          // style={{
          //   backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          // }}
        >
          <Navbar arrow={true} />
          <main className='pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='w-full text-center flex justify-center'>
              <h1
                ref={headingRef}
                className='text-4xl font-bold text-gray-200 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'
              >
                Contact Us
              </h1>
            </div>
            <div className='w-full text-white flex justify-center items-center flex-col lg:flex-row gap-8 py-12  '>
              <div
                ref={formRef}
                className='w-full max-w-lg z-10 tracking-widest p-6 flex flex-col border border-gray-800 hover:border-gray-200 rounded-lg  hover:shadow-2xl transition-all duration-500 '
              >
                <p
                  className='text-xs font-bold mb-2 uppercase font-light'
                >
                  By appointment only*
                </p>
                <Form {...form}>
                  <form
                    // action='https://getform.io/f/bjjjprgb'
                    // method='POST'
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
                      name='number'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact No.</FormLabel>
                          <FormControl>
                            <Input
                              className='text-black border border-zinc-400'
                              placeholder='Enter No.'
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
                      className='bg-white uppercase text-gray-900 hover:bg-black hover:text-white transition-all duration-500 ease-in-out  border-zinc-600 rounded-none border px-5 tracking-normal font-medium mt-2'
                    >
                      Submit
                    </Button>
                  </form>
                </Form>
              </div>
              {/*  */}
              <div
                ref={infoRef}
                className='w-full max-w-lg text-xs z-10 font-thin text-white p-4 flex flex-col space-y-4 my-12 py-10'
              >
                <div className='flex flex-wrap items-center gap-8 text-center '>
                  <a
                    href='mailto:info@karandesai.in'
                    className='flex flex-col underline pt-2 text-xl md:text-xs font-extralight'
                  >
                    info@karandesai.in
                  </a>
                  <h1
                    className={`text-3xl sm:text-4xl tracking-widest hidden md:flex -mb-2 ${bebas.className}`}
                  >
                    karan
                  </h1>
                </div>

                <div className='flex flex-col sm:flex-row gap-4 sm:gap-12 items-start sm:items-center pb-4 text-start sm:text-left'>
                  <p
                    className='flex flex-col text-sm md:text-xs font-light'
                  >
                    <a
                      href='https://maps.app.goo.gl/LDt3TN9yLwB5n6yg7'
                      className='underline'
                      target='_blank'
                    >
                      Shah Industrial Estate, 1001 PARINEE I, 7-A, Andheri West,
                      Mumbai, Maharashtra 400053
                    </a>
                  </p>
                  <div className='flex  gap-4'>
                    <h1
                      className={`${bebas.className} text-3xl sm:text-4xl tracking-widest md:hidden`}
                    >
                      karan
                    </h1>
                    <h1
                      className={`${bebas.className} text-3xl sm:text-4xl tracking-widest md:-mr-4`}
                    >
                      desai
                    </h1>
                  </div>
                  <div className='font-sans flex items-center space-x-2 justify-center sm:justify-start'>
                    <a href='https://wa.me/+917977112242' target='_blank'>
                      <FaWhatsapp
                        size={25}
                        className='text-green-700 hover:text-green-500 transition-all duration-300'
                      />
                    </a>
                    <a
                      href='https://wa.me/+917977112242'
                      className='font-semibold text-sm sm:text-md'
                      target='_blank'
                    >
                      +917977112242
                    </a>
                  </div>
                </div>

                <div
                  className='flex flex-col gap-4 sm:flex-row sm:gap-6 font-normal sm:text-left tracking-widest'
                >
                  <p className='text-green-400'>
                    We are not a normal team of architects and interior
                    designers, but a unified movement of innovators and creators
                    of unique design experiences.
                  </p>
                  <p className='text-blue-400'>
                    We offer extraordinary design solutions which contribute to
                    the well-being of our customers and bring real value to
                    their life and work. By entering the space we created, you
                    will feel as if you were in your imagination.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default page;
