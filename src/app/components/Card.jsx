'use client';
import React from 'react';
import { Poppins, Montserrat } from 'next/font/google';

// Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const Card = ({ imagePosition, title, img }) => {
  const fullText = `Born in 1987, a passionate founder of his eponymous studio, KARAN DESAI | Architecture + Design, focusing on Architecture, Interiors & furniture designing. KD started off with his individual practice right after he gave his Thesis in 2011 from Pillai’s College of Architecture & founded the company in 2012.

The internship under Ar. Ashiesh Shah during a year drop in 2007 carved a path for his career, setting a clear direction toward his goals & dreams.
`;

  return (
    <div
      className={`relative flex ${
        imagePosition === 'left' ? '' : 'flex-row-reverse'
      } items-center gap-10 py-6 rounded-xl max-w-4xl bg-black shadow-xl transition-all duration-300 hover:scale-105`}
    >
      {/* Image Section */}
      <img
        src={img}
        alt='Person 1'
        className='w-64 object-cover rounded animateimg transition-transform duration-300 hover:scale-105'
        style={{ aspectRatio: '3 / 4' }}
      />
      {/* Text Section */}
      <div className='flex-1 space-y-4'>
        {/* Title with gradient text, drop shadow, and reveal animation */}
        <h2
          className='text-3xl md:text-4xl font-bold uppercase tracking-wider title name-content'
          style={{ animationDelay: '1500ms' }}
        >
          {title}
        </h2>
        {/* Subtitle with elegant italic styling and reveal animation */}
        <h6
          className='text-lg md:text-xl font-medium italic uppercase tracking-widest text-blue-400 name-content'
          style={{ animationDelay: '2300ms' }}
        >
          Award Winning Architecture + Interior Design Studio | TedX Speaker
        </h6>
        {/* Body Text with refined spacing and the original reveal animation */}
        <div className='overflow-hidden'>
          <p
            className='md:text-lg text-gray-300 font-light leading-relaxed tracking-wide whitespace-pre-line text-content'
            style={{ animationDelay: '3500ms' }}
          >
            {fullText}
          </p>
        </div>
      </div>
      <style jsx>{`
        /* Retain your original clip-path reveal animation */
        .text-content {
          display: inline-block;
          clip-path: inset(0 100% 0 0);
          animation: reveal 2s steps(100, end) forwards;
        }
        .name-content {
          display: inline-block;
          clip-path: inset(0 100% 0 0);
          animation: reveal 1s steps(100, end) forwards;
        }
        @keyframes reveal {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
        }
        /* Unique Title Styling */
        .title {
          background: linear-gradient(90deg, #2563eb, #14b8a6);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          text-shadow: 2px 2px 6px rgba(20, 184, 166, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Card;
