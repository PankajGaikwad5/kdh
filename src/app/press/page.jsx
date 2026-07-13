'use client';

import { useEffect, useRef, useState, Fragment } from 'react';
import gsap from 'gsap';
import { Montserrat } from 'next/font/google';
import Image from 'next/image';
import { X, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '600', '700'],
});

const magazines = [
  {
    id: 1,
    name: 'Cover',
    issue: 'June 2026 Issue',
    coverImage: '/press/mags/cover1.webp',
    featuredImages: ['/press/mags/cover2.webp', '/press/mags/cover3.webp'],
    description: 'A special feature showcasing the unique design details across multiple editorial spreads.',
  },
  {
    id: 2,
    name: 'India Today Home',
    issue: 'June 2026 Issue',
    coverImage: '/press/mags/ithome1.webp',
    featuredImages: ['/press/mags/ithome2.webp'],
    description: 'Featuring the custom KDH Marble Console collection and minimal design aesthetics in a high-end luxury residence.',
  },
  {
    id: 3,
    name: 'Fortune India',
    issue: 'June 2026 Issue',
    coverImage: '/press/mags/fortune1.webp',
    featuredImages: ['/press/mags/fortune2.webp'],
    description: 'An exclusive feature highlighting the handcrafted brass details and futuristic design of the new Monster lighting series.',
  },
];

// const pressItems = [
//   { id: 0, name: 'India Today', link: 'https://www.indiatoday.in/magazine/supplement/story/20260629-stone-and-soul-jinashilp-collection-2929024-2026-06-19' },
//   { id: 1, name: 'Architectural Digest', link: 'https://www.architecturaldigest.com/story/lena-dunhams-designer-on-championing-your-inner-child' },
//   { id: 2, name: 'Wallpaper*', link: 'https://www.wallpaper.com/design-interiors/house-of-santal-south-asian-design-gallery-new-york' },
//   { id: 3, name: 'Dezeen', link: 'https://www.dezeen.com/2026/02/23/house-of-santal-new-york-city-edition-1/' },
//   { id: 4, name: 'T Magazine', link: 'https://www.nytimes.com/2026/02/19/t-magazine/sauna-new-zealand.html' },
//   { id: 5, name: 'Surface', link: 'https://www.surfacemag.com/articles/house-of-santal-new-york-south-asian-design-gallery/' },
//   { id: 6, name: 'IFDM', link: 'https://ifdm.design/2026/02/26/house-of-santal-brings-south-asian-design-to-nyc/' },
//   { id: 7, name: 'Livingetc.', link: 'https://www.livingetc.com/features/design-diary-march-2026' },
//   { id: 8, name: 'Observer', link: 'https://observer.com/2026/03/interview-raksha-sanikam-house-of-santal-nyc-south-asian-design-furniture-luxury/' },
//   { id: 9, name: 'Business of Home', link: 'https://businessofhome.com/articles/man-wah-makes-a-58-7-million-acquisition-tiktok-has-a-new-us-owner-and-more#' },
//   { id: 10, name: 'The PR Net', link: 'https://theprnet.com/news/43334' },
//   { id: 11, name: 'Trend Hunter', link: 'https://www.trendhunter.com/trends/house-of-santal' },
//   { id: 12, name: 'amNY', link: 'https://www.amny.com/entertainment/house-of-santal-south-asian-craftsmanship-midtown/' },
// ];

// ─────────────────────────────────────────────────────────────────────────────

export default function PressPage() {
  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const magazinesRef = useRef(null);
  const pressRef = useRef(null);

  const [selectedMagazine, setSelectedMagazine] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const zoomContainerRef = useRef(null);

  const handleImageLoad = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const closeZoom = () => {
    setZoomedImage(null);
    setIsZoomedIn(false);
    setMousePos({ x: 0.5, y: 0.5 });
  };

  const handleMouseMove = (e) => {
    if (!isZoomedIn || !zoomContainerRef.current) return;
    const { left, top, width, height } = zoomContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomedImage) {
          closeZoom();
        } else if (selectedMagazine) {
          setSelectedMagazine(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage, selectedMagazine]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

      tl.fromTo(
        headingRef.current,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        0.2
      );

      const magItems = magazinesRef.current?.children;
      if (magItems?.length) {
        tl.fromTo(
          magItems,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
          0.3
        );
      }

      const pressItemsElements = pressRef.current?.children;
      if (pressItemsElements?.length) {
        tl.fromTo(
          pressItemsElements,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
          0.5
        );
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-black min-h-screen text-zinc-100"
      style={{
        opacity: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")`,
      }}
    >
      <Navbar arrow={true} isBgBlack={false} />

      <div className="w-full pt-12 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 min-h-screen">

        {/* Heading */}
        <div className="w-full text-center flex justify-center">
          <h1
            ref={headingRef}
            className={`text-2xl md:text-4xl font-bold text-gray-200 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl ${montserrat.className}`}
          >
            Press
          </h1>
        </div>

        {/* Magazines Section */}
        <div className="mt-16 mb-8 flex items-center gap-4">
          <span className={`text-xs uppercase tracking-widest text-zinc-500 whitespace-nowrap ${montserrat.className}`}>
            Featured Publications
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        <div
          ref={magazinesRef}
          className="grid grid-cols-1 gap-y-10 gap-x-8 pb-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {magazines.map((mag) => (
            <div
              key={mag.id}
              onClick={() => {
                setSelectedMagazine(mag);
              }}
              className="group cursor-pointer relative flex flex-col rounded-xl overflow-hidden bg-zinc-950/40 border border-zinc-900 transition-all duration-500 hover:border-zinc-700/80 hover:shadow-2xl hover:shadow-white/[0.01]"
            >
              {/* Image Aspect ratio 3/4 */}
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-900">
                {!loadedImages[`mag-${mag.id}-cover`] && (
                  <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-600">Loading...</span>
                  </div>
                )}
                <Image
                  src={mag.coverImage}
                  alt={`${mag.name} Cover`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  onLoad={() => handleImageLoad(`mag-${mag.id}-cover`)}
                />

                {/* Hover action overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-4 py-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-200 text-[10px] uppercase tracking-widest font-semibold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                    <BookOpen size={12} className="text-zinc-400" />
                    <span>View Feature</span>
                  </div>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-5 flex flex-col gap-1.5 border-t border-zinc-900">
                <span className={`text-[10px] uppercase tracking-widest text-zinc-500 font-semibold ${montserrat.className}`}>
                  {mag.issue}
                </span>
                <h3 className={`text-base font-bold text-zinc-200 group-hover:text-white transition-colors duration-300 uppercase tracking-wide ${montserrat.className}`}>
                  {mag.name}
                </h3>
                {/* <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-light">
                  {mag.description}
                </p> */}
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* Double-Page Spread Lightbox Modal */}
      {selectedMagazine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-300">
          <div className="absolute inset-0" onClick={() => setSelectedMagazine(null)} />

          <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md">
              <div>
                <h3 className={`text-lg font-bold text-white uppercase tracking-wider ${montserrat.className}`}>
                  {selectedMagazine.name}
                </h3>
                <p className="text-xs text-zinc-500 tracking-widest uppercase mt-0.5 font-semibold">
                  {selectedMagazine.issue}
                </p>
              </div>
              <button
                onClick={() => setSelectedMagazine(null)}
                className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-colors duration-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center justify-start md:justify-center">

              {/* Spread layout - stacked on mobile, side-by-side on desktop */}
              <div className="w-full flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl">
                {/* Cover Spread */}
                <div className="w-full md:flex-1 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">Magazine Cover</span>
                  <div
                    onClick={() => { setZoomedImage(selectedMagazine.coverImage); setIsZoomedIn(false); }}
                    className="relative w-full max-w-[320px] aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800/80 shadow-2xl cursor-zoom-in hover:opacity-95 transition-opacity duration-300"
                  >
                    {!loadedImages[`modal-${selectedMagazine.id}-cover`] && (
                      <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">Loading...</span>
                      </div>
                    )}
                    <Image
                      src={selectedMagazine.coverImage}
                      alt={`${selectedMagazine.name} Cover`}
                      fill
                      priority
                      className="object-cover"
                      onLoad={() => handleImageLoad(`modal-${selectedMagazine.id}-cover`)}
                    />
                  </div>
                </div>

                {selectedMagazine.featuredImages.map((imgUrl, index) => (
                  <Fragment key={index}>
                    {/* Vertical Divider */}
                    <div className="hidden md:block w-px self-stretch bg-zinc-800/60 my-4" />

                    {/* Feature Spread */}
                    <div className="w-full md:flex-1 flex flex-col items-center justify-center">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                        Featured Page {selectedMagazine.featuredImages.length > 1 ? index + 1 : ''}
                      </span>
                      <div
                        onClick={() => { setZoomedImage(imgUrl); setIsZoomedIn(false); }}
                        className="relative w-full max-w-[320px] aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800/80 shadow-2xl cursor-zoom-in hover:opacity-95 transition-opacity duration-300"
                      >
                        {!loadedImages[`modal-${selectedMagazine.id}-feature-${index}`] && (
                          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-600">Loading...</span>
                          </div>
                        )}
                        <Image
                          src={imgUrl}
                          alt={`${selectedMagazine.name} Feature ${index + 1}`}
                          fill
                          priority
                          className="object-cover"
                          onLoad={() => handleImageLoad(`modal-${selectedMagazine.id}-feature-${index}`)}
                        />
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>

              {/* Description */}
              {/* <div className="mt-8 text-center max-w-xl">
                <p className="text-xs text-zinc-400 font-light leading-relaxed italic">
                  "{selectedMagazine.description}"
                </p>
              </div> */}

            </div>
          </div>
        </div>
      )}

      {/* Zoomed Full View Image Popup */}
      {zoomedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm transition-opacity duration-300">
          <div className="absolute inset-0 cursor-zoom-out" onClick={closeZoom} />

          <div className="relative w-full max-w-5xl max-h-[90vh] z-10 flex flex-col items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-colors duration-200 z-20"
              aria-label="Close zoom view"
            >
              <X size={20} />
            </button>

            {/* Responsive containment of image with hover panning zoom */}
            <div
              ref={zoomContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => isZoomedIn && setMousePos({ x: 0.5, y: 0.5 })}
              className="relative w-[90vw] h-[80vh] max-w-4xl max-h-[80vh] overflow-hidden select-none rounded-lg bg-black/20"
            >
              <div
                onClick={() => setIsZoomedIn(!isZoomedIn)}
                style={{
                  transformOrigin: isZoomedIn ? `${mousePos.x * 100}% ${mousePos.y * 100}%` : 'center',
                  transition: isZoomedIn ? 'transform 0.25s ease-out' : 'transform 0.3s ease-out, transform-origin 0.3s ease-out',
                }}
                className={`relative w-full h-full ${isZoomedIn ? 'scale-[1.8] cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
              >
                <Image
                  src={zoomedImage}
                  alt="Full View Publication"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
