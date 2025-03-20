'use client';
import React from 'react';
import { Poppins, Montserrat } from 'next/font/google';

// Poppins
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});
// Montserrat
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});

const Card = ({ imagePosition, title, text, img, desc }) => {
  return (
    <div
      className={`flex ${
        imagePosition === 'left' ? '' : 'flex-row-reverse'
      } items-start gap-6 p-4 border border-gray-500 rounded-lg max-w-7xl hover:shadow-2xl transition-all duration-500 bg-zinc-800 hover:bg-zinc-900`}
    >
      {/* Image and Text Container */}
      <div className='w-full flex flex-col md:flex-row gap-6 flex-shrink-0'>
        {/* Image Section */}
        <img
          src={img}
          alt='Person 1'
          className='w-96 h-96 object-cover rounded animateimg translate-x-[100%]'
          style={{ aspectRatio: '3 / 4' }}
        />
        {/* Text Section */}
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold tracking-widest'>{title}</h2>
          <h6 className='text-base uppercase font-semibold font-sans'>
            {desc}
          </h6>
          <p className='font-light text-gray-300 font-sans'>
            Born in 1987, a passionate founder of his eponymous studio, KARAN
            DESAI | Architecture + Design, focusing on Architecture, Interiors
            &amp; furniture designing, KD started off with his individual
            practice right after he gave his Thesis in 2011 from Pillai’s
            college of architecture &amp; founded the company in 2012.
            <br />
            <br />
            The internship under Ar. Ashiesh Shah during a year drop in 2007,
            carved a path for his career with a clear direction towards his
            goals &amp; dreams which he lives today.
            <br />
            <br />
            The Studio has spread its wings in Mangalore, Goa, Delhi, Kullu -
            Manali, Uttarakhand, Kolkata, Chennai and plan to continue. Inspired
            by contemporary aesthetics and clean lines, the studio beautifies
            projects both residential and commercial on varying scales. From
            ideation rooms to offices, homes to private getaways, the team
            designs projects and products in close association with clients to
            deliver unique results and reflect personal tastes with
            consolidating the studio’s vision.
            <br />
            <br />
            We're also doing projects internationally. We've completed working
            on the order of 20,000 sq.ft. in Chicago and are currently working
            on a 15,000 sq.ft. mansion in Washington, D.C.
          </p>
        </div>
      </div>
      {/* CSS for image animation */}
    </div>
  );
};

export default Card;
