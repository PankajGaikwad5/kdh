// app/about/page.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

import Card from '../components/Card';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
});

const AboutPage = () => {
  return (
    <main
      className={`min-h-screen bg-black z-10 relative text-white font-sans ${montserrat.className}`}
    >
      <Navbar />

      {/* Spacer for header */}
      <div className='h-16' />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-center mb-8'
      >
        <h1 className='text-4xl md:text-5xl font-light tracking-tight capitalize'>
          About
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='max-w-5xl mx-auto'
      >
        <Card
          img='/assets/profile.jpg'
          imagePosition='left'
          title='Karan Desai'
          desc='Award Winning Architecture + Interior Design Studio | TedX Speaker'
        />
      </motion.div>

      {/* Content Section */}
      <section className='px-4 pt-6 pb-12 md:px-14 lg:px-20 relative z-10 bg-black'>
        {/* KDAD Logo Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='flex justify-center mb-12 z-10 relative'
        >
          <a
            href='https://www.karandesai.in/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Image
              src='/assets/kdadlogo2.png'
              alt='KDAD Logo'
              width={400}
              height={400}
              className='object-contain'
            />
          </a>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;
