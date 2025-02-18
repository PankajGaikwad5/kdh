'use client';
import Image from 'next/image';
import React from 'react';
import { useState } from 'react';
import { Poppins, Montserrat } from 'next/font/google';

// popins
// montserrat
const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['100', '200', '300', '400', '600', '700'], // Specify weight
});
const montserrat = Montserrat({
  subsets: ['latin'], // Specify subsets
  weight: ['100', '200', '300', '400', '600', '700'], // Specify weight
});

const Navbar = ({ isBgBlack, isHomePage }) => {
  const [nav, setNav] = useState(false);
  const newNavTopics = [
    // {
    //   id: 1,
    //   name: 'home',
    //   path: '/',
    // },
    {
      id: 2,
      name: 'about',
      path: 'about',
    },
    {
      id: 3,
      name: 'products',
      path: 'products',
    },
    {
      id: 4,
      name: 'collaborations',
      path: 'collaborations',
    },
    {
      id: 5,
      name: 'catalogue',
      path: 'catalogue',
    },
    {
      id: 6,
      name: 'contact us',
      path: 'contact',
    },
  ];

  const navTopics = [
    `${isHomePage ? '' : 'home'}`,
    'about',
    'products',
    'collaborations',
    'catalogue',
    'contact us',
  ];
  // karan desai homes
  // shu khabar
  return (
    <>
      <div
        className={` w-full flex fixed md:m-10 m-6 font-mono font-extralight text-xs uppercase tracking-wider text-gray-800 navMenu z-30 cursor-pointer ${
          nav && 'open'
        }`}
        onClick={() => setNav(!nav)}
      >
        <span className={` bg-black `}></span>
        <span className={` bg-black `}></span>
        <span className={` bg-black `}></span>
      </div>

      {/* <div className={`${!nav ? 'hidden' : 'block'} relative`}> */}
      <ul
        className={
          !nav
            ? 'absolute w-full h-screen top-0 left-[100%]  flex flex-col p-4 justify-center text-gray-800 items-center duration-500 z-20'
            : `fixed w-full h-screen top-0 left-0 flex flex-col uppercase  ${
                isBgBlack ? 'text-white' : 'text-white'
              } text-3xl justify-center items-start md:max-w-xs bg-black/90 p-4 z-20 duration-500 `
        }
      >
        <ul className={`flex flex-col gap-2 text-2xl font-bold  `}>
          <a
            href='/'
            className={`hover:text-gray-600 transition-all duration-300`}
          >
            home
          </a>
          {newNavTopics.map((items) => {
            const { id, name, path } = items;
            return (
              <li key={id}>
                <a
                  href={path}
                  className='hover:text-gray-600 transition-all duration-300 '
                >
                  {name}
                </a>
              </li>
            );
          })}
          <li className='border-t border-dotted pt-4'>
            <a
              href='shukhabar'
              className='hover:text-gray-600 transition-all duration-300'
            >
              shukhabar
            </a>
          </li>
          <li>
            <a
              href='https://karandesai.in'
              className='hover:text-gray-600 transition-all duration-300'
            >
              kdad
            </a>
          </li>
        </ul>
      </ul>
      {/* </div> */}
    </>
  );
};

export default Navbar;
