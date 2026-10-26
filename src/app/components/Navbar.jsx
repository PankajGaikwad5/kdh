'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronRight, Instagram, Search, X, ShoppingBag } from 'lucide-react';
import { FaWhatsapp, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';
import { products } from './products'; // adjust path if needed
import { categoryList } from '@/app/utils/categories';
import { useCart } from '@/app/context/CartContext';
import { useTheme } from 'next-themes';
import ThemeToggle from './ThemeToggle';

// Cart and contact live in the menu's side column
const primaryItems = [
  { name: 'home', path: '' },
  { name: 'about', path: 'about' },
  { name: 'collections', path: 'collections' },
  { name: 'categories', isDropdown: true },
  { name: 'mandirs', path: 'mandirs' },
  { name: 'collaborations', path: 'collaborations' },
  { name: 'press', path: 'press' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/karandesaihome/', Icon: Instagram },
  { label: 'YouTube', href: 'https://www.youtube.com/@KarandesaiAD', Icon: FaYoutube },
  { label: 'WhatsApp', href: 'https://wa.me/+917977112242', Icon: FaWhatsapp },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/karandesaiad/', Icon: FaLinkedin },
];

const categoryHref = (name) => `/categories/${name.toLowerCase().replace(/ /g, '-')}`;

// Hover-to-open only where there's a real mouse and the side-by-side layout
const isDesktop = () =>
  window.matchMedia('(min-width: 768px) and (hover: hover)').matches;

const Navbar = ({ isBgBlack, arrow, escape, home }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const router = useRouter();
  const [nav, setNav] = useState(false);
  const [white, setWhite] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [results, setResults] = useState([]);
  const { cartCount, isInitialized } = useCart();
  const pathname = usePathname();

  const handleClick = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/collections`);
    }
  };

  const closeNav = () => {
    setNav(false);
    setWhite(false);
    setShowCategories(false);
    setHovered(null);
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

  // Escape close (search + menu)
  useEffect(() => {
    const handleEscapeSearch = (event) => {
      if (event.key === 'Escape') {
        setShowSearch(false);
        closeNav();
      }
    };
    document.addEventListener('keydown', handleEscapeSearch, true);
    return () =>
      document.removeEventListener('keydown', handleEscapeSearch, true);
  }, []);

  // Lock page scroll while nav is open
  useEffect(() => {
    document.body.style.overflow = nav ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [nav]);

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

  return (
    <>
      {/* Hamburger */}
      <div
        className={`flex fixed md:m-8 m-6 font-extralight text-xs uppercase tracking-wider text-gray-800 navMenu z-[60] cursor-pointer ${
          nav && 'open'
        }`}
        onClick={() => {
          if (nav) {
            closeNav();
          } else {
            setNav(true);
            setWhite(true);
          }
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

      {/* Top-right Actions (Cart & Search) */}
      <div
        className={`fixed top-6 ${
          !home ? 'right-7' : 'right-16'
        } z-40 flex items-center gap-3`}
      >
        {/* Shopping Cart Button */}
        <Link
          href='/cart'
          className='p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all relative flex items-center justify-center'
          title='View Cart'
        >
          <ShoppingBag size={20} />
          {isInitialized && cartCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md'>
              {cartCount}
            </span>
          )}
        </Link>

        {/* 🔍 Search icon */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className='p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all flex items-center justify-center'
        >
          {showSearch ? <X size={20} /> : <Search size={20} />}
        </button>
      </div>

      {/* Search overlay */}
      {showSearch && (
        <div
          className='fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex justify-center items-start p-6'
          onClick={() => setShowSearch(false)} // click outside closes
        >
          <div
            className='bg-transparent w-full max-w-lg p-6 relative'
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside box
          >
            {/* Search input */}
            <div className='flex items-center border rounded-full px-3 py-2 border-white bg-transparent'>
              <Search className='text-white mr-2' size={18} />
              <input
                type='text'
                placeholder='Search products...'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim().length > 0) {
                    setShowSearch(false);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
                className='flex-1 outline-none bg-transparent text-white placeholder-white/50'
                autoFocus
              />
              {query && (
                <button
                  onClick={() => {
                    setShowSearch(false);
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className='p-1.5 rounded-full mr-2 transition-all duration-300 flex items-center justify-center bg-white text-black hover:bg-white/80'
                  title="View all results"
                >
                  <ArrowRight size={16} />
                </button>
              )}
              <button
                onClick={() => {
                  setQuery('');
                  setShowSearch(false);
                }}
                className='transition-all text-white hover:opacity-70'
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
                      className='group flex items-center gap-4 p-3 rounded-lg transition-all hover:bg-white'
                      onClick={() => setShowSearch(false)}
                    >
                      <Image
                        src={item.images?.[0].filePath || '/placeholder.png'} // first image or fallback
                        alt={item.title}
                        width={100}
                        height={100}
                        className='w-32 h-32 object-cover'
                      />
                      <span className='font-medium transition-colors text-white group-hover:text-black'>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* No results */}
            {query && results.length === 0 && (
              <p className='mt-4 text-center font-medium text-white'>
                No products found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Full-page menu: covers the page so only the menu is clickable */}
      <div
        className={`nav-menu nav-screen fixed inset-0 z-[56] flex flex-col transition-[opacity,visibility] duration-500 ${
          nav ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Top bar (hamburger sits above this, top-left) */}
        <div
          className='shrink-0 flex items-center justify-end h-20 md:h-24 px-6 md:px-8'
          onClick={(e) => e.target === e.currentTarget && closeNav()}
        >
          <span className='hidden md:block text-[10px] 2xl:text-xs tracking-[0.4em] uppercase opacity-50'>
            Esc to close
          </span>
        </div>

        {/* Body */}
        <div
          className='flex-1 min-h-0 overflow-y-auto px-8 md:pl-16 lg:pl-24 md:pr-8 pt-2 md:pt-6 pb-10 md:grid md:grid-cols-12 md:gap-x-8 md:content-start md:items-start'
          onClick={(e) => e.target === e.currentTarget && closeNav()}
        >
          {/* Primary pages */}
          <nav className='md:col-span-6 lg:col-span-5'>
            <p className='nav-label mb-4 md:mb-6'>Menu</p>
            <ul onMouseLeave={() => setHovered(null)}>
              {primaryItems.map(({ name, path, isDropdown }, i) => {
                const isCurrent = !isDropdown && pathname === `/${path}`;
                const isLit = hovered === name || (isDropdown && showCategories);
                const content = (
                  <>
                    <span className='w-6 md:w-10 shrink-0 text-[10px] 2xl:text-xs tracking-normal tabular-nums opacity-40'>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className='nav-primary'>{name}</span>
                    {isCurrent && <span className='ml-4 h-1.5 w-1.5 shrink-0 rounded-full bg-current self-center' />}
                    {isDropdown && (
                      <ChevronRight
                        size={14}
                        className={`ml-3 shrink-0 self-center opacity-60 transition-transform duration-300 ${
                          showCategories ? 'rotate-90 md:rotate-0 md:translate-x-1' : ''
                        }`}
                      />
                    )}
                  </>
                );
                const linkClass = `flex items-baseline w-fit py-1 md:py-1.5 uppercase text-left transition-all duration-300 ${
                  isLit ? 'opacity-100 md:translate-x-2' : hovered || showCategories ? 'opacity-30' : 'opacity-100'
                }`;

                return (
                  <li
                    key={name}
                    className={`transition-all duration-700 ease-out ${
                      nav ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: nav ? `${120 + i * 50}ms` : '0ms' }}
                  >
                    {isDropdown ? (
                      <>
                        <button
                          className={linkClass}
                          onMouseEnter={() => {
                            setHovered(name);
                            if (isDesktop()) setShowCategories(true);
                          }}
                          onClick={() => setShowCategories(!showCategories)}
                        >
                          {content}
                        </button>
                        {/* Phones: categories expand below */}
                        <ul
                          className={`md:hidden pl-6 overflow-hidden transition-all duration-500 ${
                            showCategories ? 'max-h-[500px] py-2' : 'max-h-0'
                          }`}
                        >
                          {categoryList.map((category) => (
                            <li key={category.name}>
                              <Link href={categoryHref(category.name)} onClick={closeNav} className='nav-sub block py-2'>
                                {category.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Link
                        href={`/${path}`}
                        onClick={closeNav}
                        onMouseEnter={() => {
                          setHovered(name);
                          setShowCategories(false);
                        }}
                        className={linkClass}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Tablet/desktop: categories open to the right of the list */}
          <div
            className={`hidden md:block md:col-span-6 lg:col-span-4 transition-opacity duration-500 ${
              nav && showCategories ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className='nav-rule border-l pl-8 lg:pl-12'>
              <p className='nav-label mb-6 flex justify-between'>
                <span>Categories</span>
                <span className='tabular-nums'>{String(categoryList.length).padStart(2, '0')}</span>
              </p>
              <ul>
                {categoryList.map((category, i) => (
                  <li
                    key={category.name}
                    className={`transition-all duration-500 ease-out ${
                      showCategories ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                    }`}
                    style={{ transitionDelay: showCategories ? `${60 + i * 35}ms` : '0ms' }}
                  >
                    <Link
                      href={categoryHref(category.name)}
                      onClick={closeNav}
                      className='nav-sub group flex items-center py-2 2xl:py-3 opacity-70 hover:opacity-100 transition-opacity'
                    >
                      <span className='h-px w-0 bg-current transition-all duration-300 group-hover:w-5 group-hover:mr-3' />
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Shop / contact / social */}
          <aside
            className={`mt-12 md:mt-14 lg:mt-0 md:col-span-12 lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-x-8 gap-y-10 transition-all duration-700 ease-out ${
              nav ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: nav ? '450ms' : '0ms' }}
          >
            <div>
              <p className='nav-label mb-4'>Shop</p>
              <ul className='nav-info space-y-2.5'>
                <li>
                  <Link href='/cart' onClick={closeNav} className='hover:opacity-60 transition-opacity'>
                    Cart{isInitialized && cartCount > 0 ? ` (${cartCount})` : ''}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      closeNav();
                      setShowSearch(true);
                    }}
                    className='hover:opacity-60 transition-opacity'
                  >
                    Search
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <p className='nav-label mb-4'>Get in touch</p>
              <ul className='nav-info space-y-2.5'>
                <li>
                  <a href='mailto:info@karandesai.in' className='hover:opacity-60 transition-opacity'>
                    info@karandesai.in
                  </a>
                </li>
                <li>
                  <a href='https://wa.me/+917977112242' target='_blank' rel='noopener noreferrer' className='hover:opacity-60 transition-opacity'>
                    +91 79771 12242
                  </a>
                </li>
                <li>
                  <Link href='/contact' onClick={closeNav} className='inline-flex items-center gap-2 hover:opacity-60 transition-opacity'>
                    Contact us <ArrowRight size={14} />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className='nav-label mb-4'>Follow</p>
              <div className='flex items-center gap-5'>
                {socialLinks.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={label}
                    className='opacity-70 hover:opacity-100 transition-opacity'
                  >
                    <Icon size={17} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom bar */}
        <div className='nav-rule shrink-0 mx-8 md:ml-16 lg:ml-24 md:mr-8 border-t py-4 flex items-center justify-between gap-6'>
          <div className='flex flex-col md:flex-row gap-3 md:gap-10 text-[10px] 2xl:text-xs tracking-[0.3em] uppercase opacity-60'>
            <span>&copy; {new Date().getFullYear()} Karan Desai Home</span>
            <div className='flex gap-6'>
              <Link href='/privacy-policy' onClick={closeNav} className='hover:opacity-60 transition-opacity'>
                Privacy Policy
              </Link>
              <Link href='/terms-and-conditions' onClick={closeNav} className='hover:opacity-60 transition-opacity'>
                Terms & Conditions
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Back Arrow */}
      {arrow && (
        <button
          className='hidden md:block fixed z-50 left-4 md:left-12 bottom-6 md:bottom-10 hover:bg-white/70 duration-500 transition-all text-white p-2 border-2 border-white/20 hover:text-black rounded-full'
          onClick={handleClick}
        >
          <ArrowLeft size={25} />
        </button>
      )}
    </>
  );
};

export default Navbar;
