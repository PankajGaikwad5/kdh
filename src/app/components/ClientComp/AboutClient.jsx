'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Card from '../Card';

export default function AboutClient() {
  return (
    <div className='relative z-10'>
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className='max-w-5xl mx-auto'
      >
        <Card
          img='/assets/profile.jpg'
          imagePosition='left'
          title='Karan Desai'
          desc='Award Winning Architecture + Interior Design Studio | TedX Speaker'
        />
      </motion.div>
    </div>
  );
}
