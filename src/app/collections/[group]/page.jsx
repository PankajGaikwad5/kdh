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

const ProductCardV2 = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 4 columns logic (lg: screens)
  const isAlternate4 = (Math.floor(index / 4) + (index % 4)) % 2 !== 0;
  const bgDesktop = isAlternate4 ? 'lg:bg-[#1a1a1a]' : 'lg:bg-[#121212]';

  // 2 columns logic (default for mobile & tablet)
  const isAlternate2 = (Math.floor(index / 2) + (index % 2)) % 2 !== 0;
  const bgMobile = isAlternate2 ? 'bg-[#1a1a1a]' : 'bg-[#121212]';

  const bgColor = `${bgMobile} ${bgDesktop}`;

  const primaryImage = product.images?.[0]?.filePath || '';
  const title = formatTitle(product.title) || '';
  const collectionName = product.group?.replace('_', ' ') || '';

  // Custom Hover Image logic
  let hoverImageIndex = 1; // default 2nd image
  if (product.group === 'jina_shilp') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('coffee table')) hoverImageIndex = 1; // 2nd image
    else if (titleLower.includes('totem')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('dining table')) hoverImageIndex = 1; // 2nd image
    else if (titleLower.includes('mirror')) hoverImageIndex = 2; // 3rd image
    else if (titleLower.includes('pillar bench')) hoverImageIndex = 1; // 2nd image
  } else if (product.group === 'monster_4.0') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('yodaa')) hoverImageIndex = 1; // 2nd image
    else if (titleLower.includes('mearr')) hoverImageIndex = 1; // 2nd image
    else if (titleLower.includes('monster rug')) hoverImageIndex = 1; // 2nd image
  } else if (product.group === 'monster_3.0') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('chandelier')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('coffee table')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('ottoman')) hoverImageIndex = 8; // 9th image
    else if (titleLower.includes('dining kids chair')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('dining chair')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('chardwood chair')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('gattoo chair')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('dining table')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('console')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('planter')) hoverImageIndex = 7; // 8th image
    else if (titleLower.includes('library art edition')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('library')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('bench')) hoverImageIndex = 5; // 6th image
  } else if (product.group === 'matilda_2024') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('pendant light')) hoverImageIndex = 7; // 8th image
    else if (titleLower.includes('partition')) hoverImageIndex = 8; // 9th image
    else if (titleLower.includes('center table 1')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('center table 2')) hoverImageIndex = 7; // 8th image
    else if (titleLower.includes('u-table')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('console')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('coffee table')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('floor lamp')) hoverImageIndex = 9; // 10th image
    else if (titleLower.includes('library')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('planter')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('dining table')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('flower vase')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('table lamp')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('basin')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('side table')) hoverImageIndex = 6; // 7th image
  } else if (product.group === 'monster_2.0') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('gatto')) hoverImageIndex = 9; // 10th image
    else if (titleLower.includes('yodaa')) hoverImageIndex = 2; // 3rd image
  } else if (product.group === 'monster_collectibles') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('gum')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('gattoofer') || titleLower.includes('gattooffer')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('squinty')) hoverImageIndex = 8; // 9th image
    else if (titleLower.includes('grumpy')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('brainy')) hoverImageIndex = 7; // 8th image
    else if (titleLower.includes('binty')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('buddha')) hoverImageIndex = 1; // 2nd image
    else if (titleLower.includes('guard')) hoverImageIndex = 5; // 6th image
  } else if (product.group === 'serafini' || product.group === 'samaveta') {
    // Assuming the group name might be serafini based on the catalogue data I saw earlier, but covering both just in case
    const titleLower = title.toLowerCase();
    if (titleLower.includes('bench')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('console')) hoverImageIndex = 5; // 6th image
  } else if (product.group === 'monster_1.0') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('basin')) hoverImageIndex = 8; // 9th image
    else if (titleLower.includes('bathtub')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('console')) hoverImageIndex = 5; // 6th image
  } else if (product.group === 'matilda_2022') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('bed side table')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('side table')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('console')) hoverImageIndex = 5; // 6th image
  } else if (product.group === 'monster_3.1') {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('burnt ombr')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('upholstered')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('round dining table')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('dining table')) hoverImageIndex = 5; // 6th image
    else if (titleLower.includes('center table')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('coffee table')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('console storage') || titleLower.includes('consolestorage')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('console')) hoverImageIndex = 6; // 7th image
    else if (titleLower.includes('desk')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('floor lamp') || titleLower.includes('floorlamp')) hoverImageIndex = 3; // 4th image
    else if (titleLower.includes('mirror')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('shelv')) hoverImageIndex = 4; // 5th image
    else if (titleLower.includes('side table')) hoverImageIndex = 4; // 5th image
  }
  
  const hoverImage = product.images?.[hoverImageIndex]?.filePath || product.images?.[1]?.filePath || primaryImage;

  return (
    <Link
      href={`/productdetails/${product._id.$oid}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col justify-between h-[280px] md:h-[450px] lg:h-[500px] p-4 md:p-8 md:py-6 group cursor-pointer ${bgColor} transition-colors duration-500 hover:bg-[#222] overflow-hidden`}
    >
      {/* Default Content */}
      <div className={`flex-grow flex items-center justify-center overflow-hidden mb-8 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <div className='relative w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105'>
          {primaryImage && (
            primaryImage.includes('http') ? (
              <img
                src={primaryImage}
                alt={title}
                className='object-contain w-full h-full absolute inset-0 '
              />
            ) : (
              <Image
                src={primaryImage}
                alt={title}
                fill
                className='object-contain '
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            )
          )}
        </div>
      </div>

      <div className={`flex flex-col items-start text-left z-10 transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
        <h2 className='text-sm md:text-xl font-base text-gray-200 uppercase tracking-widest mb-1 line-clamp-1'>
          {title}
        </h2>
        
        {/* <p className='text-[10px] md:text-sm text-gray-400 uppercase tracking-widest font-light line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-tight md:leading-normal mb-2 md:mb-4'>
          {collectionName}
        </p> */}
      </div>

      {/* Hover Overlay Content */}
      <div 
        className={`absolute inset-0 z-20 flex items-end justify-center pb-8 md:pb-12 transition-all duration-700 ease-out ${isHovered ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_100%_0_0)]'}`}
      >
        <div className="absolute inset-0 bg-black/15 z-10 transition-opacity duration-700"></div>
        {hoverImage && (
          hoverImage.includes('http') ? (
            <img
              src={hoverImage}
              alt={`${title} hover`}
              className='absolute inset-0 w-full h-full object-cover z-0 transform transition-transform duration-1000 scale-100 group-hover:scale-105'
            />
          ) : (
            <Image
              src={hoverImage}
              alt={`${title} hover`}
              fill
              className='absolute inset-0 object-cover z-0 transform transition-transform duration-1000 scale-100 group-hover:scale-105'
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          )
        )}
        <div className="relative z-20 transition-opacity duration-500 delay-100 opacity-0 group-hover:opacity-100">
          <HoverBorderGradient
            containerClassName="mt-2"
            className="bg-black/20 flex items-center justify-center text-[8px] font-medium uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300 px-4 py-[4px]"
            as="div"
          >
            <span className="mb-[-2px]">View Details</span>
          </HoverBorderGradient>
        </div>
      </div>
    </Link>
  );
};

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
      className='min-h-screen flex flex-col bg-black'
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
              <h1 className='gsap-reveal text-2xl md:text-4xl font-medium text-gray-200 py-6 border-b border-gray-800 uppercase w-full md:max-w-3xl tracking-widest'>
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
              className='grid grid-cols-2 lg:grid-cols-4 w-full flex-grow'
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
