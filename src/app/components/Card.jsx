'use client';
import React, { useState, useEffect } from 'react';
import {
  Poppins,
  Montserrat,
  Anton,
  Dekko,
  Londrina_Shadow,
} from 'next/font/google';
// caligraphitti

// Fonts
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});
const newFont = Anton({
  subsets: ['latin'],
  weight: ['400'],
});
const newPFont = Dekko({
  subsets: ['latin'],
  weight: ['400'],
});
const titleFont = Londrina_Shadow({
  subsets: ['latin'],
  weight: ['400'],
});

const Card = ({ imagePosition, title, img }) => {
  // Hardcoded text content
  const fullText = `Born in 1987, a passionate founder of his eponymous studio, KARAN DESAI | Architecture + Design, focusing on Architecture, Interiors & furniture designing. KD started off with his individual practice right after he gave his Thesis in 2011 from Pillai’s College of Architecture & founded the company in 2012.

The internship under Ar. Ashiesh Shah during a year drop in 2007 carved a path for his career, setting a clear direction toward his goals & dreams.`;

  // State for the typewriter effect
  const [typedText, setTypedText] = useState('');
  const [index, setIndex] = useState(0);
  const [startTyping, setStartTyping] = useState(false);
  const typingSpeed = 5; // Adjust typing speed (ms per character)

  // Delay the start of the typing effect by 2500ms
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setStartTyping(true);
    }, 4000);

    return () => clearTimeout(delayTimer);
  }, []);

  // Typewriter logic (runs only after startTyping is true)
  useEffect(() => {
    if (!startTyping) return; // do nothing until delay is over

    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex(index + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    }
  }, [startTyping, index, fullText]);

  return (
    <div
      className={`relative flex flex-col md:flex-row ${
        imagePosition === 'left' ? '' : 'md:flex-row-reverse'
      } items-start gap-6 py-6 px-4 md:px-8 max-w-4xl bg-transparent rounded-xl shadow-xl transition-transform duration-300 hover:scale-105`}
    >
      {/* Doodle behind the text */}
      <div className="absolute -z-10 w-2/3 h-2/3 bg-[url('/images/doodle-shape.png')] bg-no-repeat bg-contain opacity-10 top-10 left-8 pointer-events-none" />

      {/* Image Section with floating animation */}
      <div className='relative h-auto flex-shrink-0 md:-mt-12 animate-float'>
        {/* <div className='absolute -top-2 -left-2 w-full h-full bg-white/10 rounded transform rotate-1' /> */}
        <img
          src={img}
          alt='Person 1'
          className='relative w-80 object-cover rounded transform -rotate-2  
            transition-transform duration-300 hover:rotate-0 hover:scale-105 shadow-lg animateimg'
          style={{ aspectRatio: '3 / 4' }}
        />
      </div>

      {/* Text Section */}
      <div className='flex-1 space-y-4'>
        {/* Title with gradient text, drop shadow, and scribble highlight */}
        <div className='relative inline-block'>
          <div className="absolute -z-10 -top-2 -left-4 w-[120%] h-6 bg-[url('/images/scribble-underline.png')] bg-no-repeat bg-contain pointer-events-none" />
          <h2
            className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#fffc4f] uppercase tracking-widest title name-content ${titleFont.className} `}
            style={{ animationDelay: '1500ms' }}
          >
            {title}
          </h2>
        </div>

        {/* Subtitle with clip-path reveal animation */}
        <h6
          className={`text-sm  uppercase tracking-widest text-black bg-[#feba34] p-1 name-content ${newFont.className}`}
          style={{ animationDelay: '2300ms' }}
        >
          Award Winning Architecture + Interior Design Studio | TedX Speaker
        </h6>

        {/* Body Text with conditional typewriter rendering */}
        <div
          className={`md:text-lg font-light leading-relaxed tracking-wide whitespace-pre-line ${newPFont.className} text-[#68ffa7] rounded`}
        >
          {startTyping && (
            <>
              <span className='typewriter'>{typedText}</span>
              <span className='cursor'>|</span>
            </>
          )}
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        /* Floating animation for the image */
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        /* Title & Subtitle reveal animations (clip-path) */
        .name-content {
          display: inline-block;
          clip-path: inset(0 100% 0 0);
          animation: reveal 1s steps(100, end) forwards;
        }
        @keyframes reveal {
          from {
            transform: translateY(100%);
            clip-path: inset(0 100% 0 0);
          }
          to {
            transform: translateY(0);
            clip-path: inset(0 0 0 0);
          }
        }

        /* Unique Title Styling */
        .title {
          background: linear-gradient(90deg, #0dd, #0af);
          background-clip: text;
          -webkit-background-clip: text;
          text-shadow: 2px 2px 6px rgba(0, 255, 255, 0.4);
        }

        /* Typewriter cursor blink */
        .cursor {
          margin-left: 2px;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Card;
