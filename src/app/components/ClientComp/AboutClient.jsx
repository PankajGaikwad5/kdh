'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';
import Card from '../Card';

export default function AboutClient() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fade in the whole section
      tl.fromTo(
        sectionRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      // Title reveal from bottom
      tl.fromTo(
        titleRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.2
      );

      // Subtitle reveal from bottom
      tl.fromTo(
        subtitleRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.35
      );

      // Card fade in with subtle scale
      tl.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.97 },
        { opacity: 1, scale: 1, duration: 1.2 },
        0.5
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} style={{ opacity: 0 }} className='relative z-10'>
      {/* SEO-Friendly Static Title */}
      <section className='text-center pt-24 mb-10'>
        <h1
          ref={titleRef}
          className='text-4xl md:text-5xl font-light tracking-tight uppercase'
        >
          About
        </h1>
        <p
          ref={subtitleRef}
          className='mt-3 text-gray-400 max-w-2xl mx-auto text-sm md:text-base'
        >
          Award-winning Architecture and Interior Design studio by Karan Desai.
          Crafting luxury spaces and designer collections inspired by art and
          innovation.
        </p>
      </section>

      {/* Profile Card */}
      <div ref={cardRef} className='max-w-5xl mx-auto'>
        <Card
          img='/assets/profile.jpg'
          imagePosition='left'
          title='Karan Desai'
          desc='Award Winning Architecture + Interior Design Studio | TedX Speaker'
        />
      </div>
    </div>
  );
}
