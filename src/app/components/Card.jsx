import React from 'react';
import { Poppins, Montserrat } from 'next/font/google';

// popins
// montserrat
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});

const Card = ({ imagePosition, title, text, img, desc }) => {
  const pFont = popins.className;
  return (
    //  {/* Team Member Card */}
    <div
      className={`flex ${
        imagePosition === 'left' ? '' : 'flex-row-reverse'
      } items-start gap-6 p-4 border border-gray-600 rounded-lg  max-w-7xl hover:shadow-2xl transition-all duration-500 bg-zinc-100 `}
    >
      {/* Image Section */}
      <div className='w-full flex flex-col md:flex-row gap-6 flex-shrink-0 '>
        <img
          // src='https://imgs.search.brave.com/FzIb_7_K0GtKCiCYvBH7ZoMI7buSHhwfON2RHP7kliA/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9j/cmF6eS1tYW4tbG9v/a2luZy1jYW1lcmFf/MjMtMjE0NzgwODE1/MC5qcGc_c2VtdD1h/aXNfaHlicmlk'
          src={img}
          alt='Person 1'
          className='w-96 h-96  object-cover rounded'
          style={{ aspectRatio: '3 / 4' }}
        />
        <div className='space-y-2'>
          <h2 className={`text-2xl font-bold ${montserrat.className}`}>
            {title}
          </h2>
          <h6
            className={`text-base uppercase font-semibold  ${montserrat.className} font-sans`}
          >
            {desc}
          </h6>
          {/* <p className='text-sm text-gray-300 font-sans'>
          John is an experienced architect with a passion for innovative design
          solutions that blend form and function. Lorem ipsum dolor sit amet,
          consectetur adipisicing elit.
        </p> */}
          <p className={`font-light text-gray-800 font-sans ${pFont}`}>
            {/* {text} */}
            Born in 1987, a passionate founder of his eponymous studio, KARAN
            DESAI | Architecture + Design, focusing on Architecture, Interiors &
            furniture designing, KD started off with his individual practice
            right after he gave his Thesis in 2011 from Pillai’s college of
            architecture & founded the company in 2012.
            <br />
            <br /> The internship under Ar. Ashiesh Shah during a year drop in
            2007, carved a path for his career with a clear direction towards
            his goals & dreams which he lives today. <br />
            <br /> The Studio has spread its wings in Mangalore, Goa, Delhi,
            Kullu - Manali, Uttarakhand, Kolkata, Chennai and plan to continue.
            Inspired by contemporary aesthetics and clean lines, the studio
            beautifies projects both residential and commercial on varying
            scales. From ideation rooms to offices , homes to private getaways,
            the team designs projects and products in close association with
            clients to deliver unique results and reflect personal tastes with
            consolidating the studio’s vision.
            <br />
            <br />
            We're also doing projects internationally, We've completed working
            on the order of 20,000 sq.ft. in Chicago and currently working on
            15,000 sq.ft Mansion in Washington, D.C.
            {/* Contact:{' '} */}
            {/* <a href='mailto:john.doe@example.com' className='text-blue-400'>
            john.doe@example.com */}
            {/* </a> */}
          </p>
        </div>
      </div>
      {/* Text Section */}
    </div>
  );
};

export default Card;
