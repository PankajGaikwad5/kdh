'use client';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./components/Scene'), {
  ssr: false,
  loading: () => <div className='text-center p-8'>Loading...</div>,
});

export default function Home() {
  return (
    <main className='w-screen h-screen bg-white'>
      <Scene />
    </main>
  );
}
