'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Poppins, Montserrat } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, X } from 'lucide-react';
import Link from 'next/link';
import { products } from './products'; // adjust path if needed

// Fonts
const popins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '600', '700'],
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '600', '700'],
});

const Navbar = ({ isBgBlack, arrow, escape, home }) => {
  const router = useRouter();
  const [nav, setNav] = useState(false);
  const [white, setWhite] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/collections/${group}`);
    }
  };

  // Escape close (nav)
  useEffect(() => {
    const handleEscape = (event) => {
      if (escape && event.key === 'Escape') {
        handleClick(event);
      }
    };
    document.addEventListener('keydown', handleEscape, true);
    return () => document.removeEventListener('keydown', handleEscape, true);
  }, []);

  // Escape close (search)
  useEffect(() => {
    const handleEscapeSearch = (event) => {
      if (event.key === 'Escape') {
        setShowSearch(false);
      }
    };
    document.addEventListener('keydown', handleEscapeSearch, true);
    return () =>
      document.removeEventListener('keydown', handleEscapeSearch, true);
  }, []);

  // Search logic
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const newNavTopics = [
    { id: 2, name: 'about', path: 'about' },
    { id: 3, name: 'collections', path: 'collections' },
    { id: 7, name: 'mandirs', path: 'mandirs' },
    { id: 4, name: 'collaborations', path: 'collaborations' },
    // { id: 5, name: 'catalogue', path: 'catalogue' },
    { id: 6, name: 'contact us', path: 'contact' },
  ];

  return (
    <>
      {/* Hamburger */}
      <div
        className={`w-full flex fixed md:m-8 m-6 font-extralight text-xs uppercase tracking-wider text-gray-800 navMenu z-50 cursor-pointer ${
          nav && 'open'
        }`}
        onClick={() => {
          setNav(!nav);
          setWhite(!white);
        }}
      >
        <span
          className={`${
            isBgBlack ? (!white ? 'bg-black' : 'bg-white') : 'bg-white'
          }`}
        />
        <span
          className={`${
            isBgBlack ? (!white ? 'bg-black' : 'bg-white') : 'bg-white'
          }`}
        />
        <span
          className={`${
            isBgBlack ? (!white ? 'bg-black' : 'bg-white') : 'bg-white'
          }`}
        />
      </div>

      {/* 🔍 Search icon (top-right) */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className={`fixed top-6 ${
          !home ? 'right-7' : 'right-16'
        }  z-50 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all`}
      >
        {showSearch ? <X size={20} /> : <Search size={20} />}
      </button>

      {/* Search overlay */}
      {showSearch && (
        <div
          className='fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex justify-center items-start p-6'
          onClick={() => setShowSearch(false)} // click outside closes
        >
          <div
            className='bg-transparent rounded-xl shadow-xl w-full max-w-lg p-6 relative'
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside box
          >
            {/* Search input */}
            <div className='flex items-center border border-gray-300 rounded-full px-3 py-2'>
              <Search className='text-gray-500 mr-2' size={18} />
              <input
                type='text'
                placeholder='Search products...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className='flex-1 outline-none text-gray-300 bg-transparent placeholder-gray-200'
                autoFocus
              />
              <button
                onClick={() => {
                  setQuery('');
                  setShowSearch(false);
                }}
                className='text-gray-500 hover:text-gray-700'
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul className='mt-4 space-y-2 max-h-72 overflow-y-auto srch-scrollbar'>
                {results.map((item) => (
                  <li key={item._id.$oid}>
                    <Link
                      href={`/productdetails/${item._id.$oid}`}
                      className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition'
                      onClick={() => setShowSearch(false)}
                    >
                      <Image
                        src={item.images?.[0].filePath || '/placeholder.png'} // first image or fallback
                        alt={item.title}
                        width={100}
                        height={100}
                        className='w-32 h-32 object-cover rounded-md'
                      />
                      <span className='text-gray-300 font-medium'>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <p className='mt-4 text-gray-500 text-center'>
                No products found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Nav menu */}
      <ul
        className={
          !nav
            ? 'absolute w-full h-screen bottom-[100%] flex flex-col p-4 justify-center items-start md:max-w-[13rem] text-gray-800 duration-500 z-20 uppercase'
            : `fixed w-full h-screen left-0 bottom-0 flex flex-col uppercase ${
                isBgBlack ? 'text-white' : 'text-white'
              } justify-center items-start md:max-w-[13rem] 2xl:max-w-[20rem] tracking-widest bg-black/90 p-4 z-20 duration-500`
        }
      >
        <ul
          className={`flex flex-col font-semibold text-sm 2xl:text-3xl ${popins.className}`}
        >
          <Link
            href='/'
            className='hover:text-gray-600 transition-all duration-300'
          >
            home
          </Link>
          {newNavTopics.map(({ id, name, path }) => (
            <li key={id}>
              <Link
                href={`/${path}`}
                className='hover:text-gray-600 transition-all duration-300'
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </ul>

      {/* Back Arrow */}
      {arrow && (
        <button
          className='hidden md:block fixed z-50 left-4 md:left-12 bottom-6 md:bottom-10 bg-white/20 hover:bg-white/70 duration-500 transition-all text-white p-2 border-2 border-white/20 hover:text-black rounded-full'
          onClick={handleClick}
        >
          <ArrowLeft size={25} />
        </button>
      )}
    </>
  );
};

export default Navbar;
