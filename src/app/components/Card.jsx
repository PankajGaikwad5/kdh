'use client';
import React from 'react';
import { Poppins, Montserrat } from 'next/font/google';

// Poppins
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// Montserrat
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

const Card = ({ imagePosition, title, img }) => {
  // Hardcoded text content from your original code
  const fullText = `Born in 1987, a passionate founder of his eponymous studio, KARAN DESAI | Architecture + Design, focusing on Architecture, Interiors & furniture designing. KD started off with his individual practice right after he gave his Thesis in 2011 from Pillai’s College of Architecture & founded the company in 2012.

The internship under Ar. Ashiesh Shah during a year drop in 2007 carved a path for his career, setting a clear direction toward his goals & dreams.

The studio has expanded to Mangalore, Goa, Delhi, Kullu - Manali, Uttarakhand, Kolkata, Chennai, and more. Inspired by contemporary aesthetics, the studio enhances residential and commercial spaces on various scales. From ideation rooms to offices, homes to private getaways, the team collaborates closely with clients to deliver unique results.

Internationally, we've completed a 20,000 sq.ft. project in Chicago and are currently working on a 15,000 sq.ft. mansion in Washington, D.C.`;

  return (
    <div
      className={`relative flex ${
        imagePosition === 'left' ? '' : 'flex-row-reverse'
      } items-center gap-6 p-6 border border-blue-600 rounded-xl max-w-6xl 
      bg-black shadow-lg transition-all duration-300 hover:shadow-[0_0_15px_2px_rgba(0,162,255,0.8)] hover:border-blue-400`}
    >
      {/* Image and Text Container */}
      <div className='w-full flex flex-col md:flex-row gap-6'>
        {/* Image Section */}
        <img
          src={img}
          alt='Person 1'
          className='w-96 object-cover rounded animateimg'
          style={{ aspectRatio: '3 / 4' }}
        />
        {/* Text Section */}
        <div className='flex-1 space-y-4'>
          <h2 className='text-2xl md:text-3xl font-bold text-white tracking-wider uppercase'>
            {title}
          </h2>
          <h6 className='text-blue-400 uppercase font-semibold'>
            Award Winning Architecture + Interior Design Studio | TedX Speaker
          </h6>
          <div className='overflow-hidden'>
            <p
              className='md:text-lg text-gray-300 font-light leading-relaxed whitespace-pre-line text-content'
              style={{
                animationDelay: `1500ms`,
              }}
            >
              {fullText}
              <span className='cursor'>|</span>
            </p>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* The text-content element is initially masked using clip-path */
        .text-content {
          display: inline-block;
          /* The clip-path inset starts fully closed on the right */
          clip-path: inset(0 100% 0 0);
          animation: reveal 2s steps(100, end) forwards;
        }
        .cursor {
          animation: blink 1s step-start infinite;
        }
        @keyframes reveal {
          from {
            clip-path: inset(0 100% 0 0);
          }
          to {
            clip-path: inset(0 0 0 0);
          }
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
