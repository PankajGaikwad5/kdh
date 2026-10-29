'use client';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { products } from '@/app/components/products';
import { formatTitle } from '@/lib/utils';
import { catalogues } from '@/app/components/catalogues';
import Image from 'next/image';
import Link from 'next/link';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import ProductCardV2 from '@/app/components/ProductCardV2';

const GroupProductsPageV2 = () => {
  const { group } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [pdfLink, setPdfLink] = useState('');
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [year, setYear] = useState('');
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const groupProducts = products.filter((p) => p.group === group);
    setFilteredProducts(groupProducts);

    const foundCatalogue = catalogues.find((c) => c.group === group);
    setPdfLink(foundCatalogue ? foundCatalogue.pdf : '');
    setImage1(foundCatalogue ? foundCatalogue.image : '');
    setImage2(foundCatalogue ? foundCatalogue.image2 : '');
    setYear(foundCatalogue ? foundCatalogue.year : '');
  }, [group]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Fade in the whole page
      tl.fromTo(
        pageRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1 }
      );

      // Header content reveal from bottom
      if (headerRef.current) {
        const revealEls = headerRef.current.querySelectorAll('.gsap-reveal');
        if (revealEls.length) {
          tl.fromTo(
            revealEls,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              duration: 0.9,
              stagger: 0.12,
              ease: 'power2.inOut',
            },
            0.2
          );
        }
      }

      // Stagger product cards in
      const cards = gridRef.current?.children;
      if (cards?.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.07,
            ease: 'power2.out',
          },
          0.4
        );
      }
    });

    return () => ctx.revert();
  }, [filteredProducts]);

  const handleDownloadClick = () => {
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/catalogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: formData, group }),
      });

      if (res.ok) {
        setShowModal(false);
        window.open(pdfLink, '_blank');
      } else {
        alert('Failed to send info. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const hasPdf = Boolean(
    pdfLink &&
      pdfLink !== 'not-available' &&
      pdfLink !== '#' &&
      pdfLink.trim() !== '' &&
      !pdfLink.toLowerCase().includes('not-available') &&
      (pdfLink.startsWith('http://') || pdfLink.startsWith('https://') || pdfLink.startsWith('/'))
  );

  return (
    <div
      ref={pageRef}
      style={{ opacity: 0 }}
      className={`min-h-screen flex flex-col bg-white dark:bg-black`}
    >
      <div className='min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={false} home={false} />

        <div ref={headerRef} className=''>
          <div className='w-full text-center flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8'>
            {/* {image1 ? (
              <>
                <div className='gsap-reveal flex gap-8 2xl:gap-8 items-center pb-2 border-b border-gray-800 w-full max-w-3xl 2xl:max-w-5xl justify-center mb-6'>
                  <Image
                    width={200}
                    height={200}
                    alt='KDH Logo'
                    src={'/assets/kdhlogo3.png'}
                    className='w-24 sm:w-36 md:w-52 2xl:w-60 object-contain'
                  />
                  <span className='text-gray-600 text-3xl md:text-5xl mx-2 font-light'>|</span>
                  <Image
                    width={200}
                    height={200}
                    alt='Collaborator Logo'
                    src={image1}
                    className='w-24 sm:w-36 md:w-52 2xl:w-60 object-contain'
                  />
                  {image2 && (
                    <>
                      <span className='text-gray-600 text-3xl md:text-5xl mx-2 font-light'>|</span>
                      <Image
                        width={100}
                        height={100}
                        alt='Collaborator Logo 2'
                        src={image2}
                        className='w-48 2xl:w-60 object-contain'
                      />
                    </>
                  )}
                </div>

                <div className='gsap-reveal flex flex-col gap-3'>
                  <h1 className='text-2xl md:text-4xl font-medium text-gray-200 uppercase w-full md:max-w-3xl tracking-widest'>
                    {group.replace('_', ' ')}
                  </h1>
                </div>
              </>
            ) : ( */}
              <h1 className={`gsap-reveal text-2xl md:text-4xl font-medium py-6 border-b uppercase w-full md:max-w-3xl tracking-widest text-gray-900 border-gray-200 dark:text-gray-200 dark:border-gray-800`}>
                {group.replace('_', ' ')}
                {/* {year && <span className='block text-gray-400 text-sm font-light mt-4 tracking-widest'>{year}</span>} */}
              </h1>
            {/* )} */}

            {hasPdf && (
              <div className='gsap-reveal flex justify-center mt-8'>
                <HoverBorderGradient
                  containerClassName="mt-2"
                  className="bg-black flex items-center justify-center text-xs font-medium uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300 px-6 py-2"
                  as="button"
                  onClick={handleDownloadClick}
                >
                  <span className="mb-[-2px]">Download Catalogue</span>
                </HoverBorderGradient>
              </div>
            )}
          </div>

          <div className='flex justify-center items-center mt-12 w-full'>
            <main
              ref={gridRef}
              className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full flex-grow'
            >
              {filteredProducts.map((product, index) => (
                <ProductCardV2
                  product={product}
                  index={index}
                  key={index}
                />
              ))}
            </main>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'>
          <div className='bg-[#1a1a1a] border border-[#333] rounded-xl p-6 w-11/12 max-w-md'>
            <h2 className='text-xl font-medium mb-6 text-center text-gray-200 tracking-widest uppercase'>
              Get the Catalogue
            </h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <input
                type='text'
                name='name'
                placeholder='Your Name'
                value={formData.name}
                onChange={handleChange}
                required
                className='bg-[#121212] border border-[#333] p-3 rounded-md text-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600'
              />
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='bg-[#121212] border border-[#333] p-3 rounded-md text-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600'
              />
              <input
                type='tel'
                name='phone'
                placeholder='Your Phone'
                value={formData.phone}
                onChange={handleChange}
                required
                className='bg-[#121212] border border-[#333] p-3 rounded-md text-white focus:outline-none focus:border-gray-500 transition-colors placeholder:text-gray-600'
              />
              <button
                type='submit'
                disabled={loading}
                className='bg-white text-black py-3 rounded-md hover:bg-gray-200 transition font-medium tracking-widest uppercase text-sm mt-2'
              >
                {loading ? 'Submitting...' : 'Download Catalogue'}
              </button>
              <button
                type='button'
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-white uppercase tracking-widest text-xs mt-2 text-center transition-colors'
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupProductsPageV2;
