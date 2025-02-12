'use client';
import dynamic from 'next/dynamic';
import {
  Pointer,
  Mouse,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
  loading: () => <div className='text-center p-8'>Loading...</div>,
});

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        setShowOverlay(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className='w-screen h-screen bg-white relative'>
      <div
        className={`absolute z-50 bg-white/10 text-white top-[40%] left-[33%] p-4 rounded ${
          showOverlay ? 'flex' : 'hidden'
        } flex-col gap-2 `}
      >
        <h1 className='flex gap-2'>
          <Pointer />
          <span>Click and hold to rotate</span>
        </h1>
        <h1 className='flex gap-2'>
          <Mouse />
          <span>Scroll up, down, left and right to move around</span>
        </h1>
        <h1 className='flex gap-2'>
          <span>Alternatively use</span>
          <div className='flex'>
            <ChevronLeft />
            <ChevronUp />
            <ChevronDown />
            <ChevronRight />
            <span className='mr-2'>or</span>
            <span className='uppercase flex gap-1 font-bold'>
              <span>W</span>
              <span>A</span>
              <span>S</span>
              <span>D</span>
            </span>
          </div>
          <span>To move around</span>
        </h1>
        <h1>
          Press <span className='font-extrabold'>ENTER</span> to continue
        </h1>
      </div>
      <Scene />
    </main>
  );
}
