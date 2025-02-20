'use client';
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Arrow = () => {
  const router = useRouter();
  const [nav, setNav] = useState(false);
  const handleClick = (e) => {
    e.preventDefault();
    // If there's a previous page in the history, go back
    if (window.history.length > 1) {
      router.back();
    } else {
      // Otherwise, navigate to the fallback route
      router.push(`/products/${group}`);
    }
  };

  return (
    <button
      className='fixed z-50 left-4 md:left-12 bottom-6 md:bottom-10 bg-white/20 hover:bg-white/70 duration-500 transition-all text-black p-2 border-2 border-black rounded-full'
      onClick={handleClick}
    >
      <ArrowLeft size={25} />
    </button>
  );
};

export default Arrow;
