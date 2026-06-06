'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Montserrat } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '600', '700'],
});

const pressItems = [
  { id: 1,  name: 'Architectural Digest', link: '#', img: '/press/architectural-digest.png' },
  { id: 2,  name: 'Wallpaper*',           link: '#', img: '/press/wallpaper.png'            },
  { id: 3,  name: 'Dezeen',               link: '#', img: '/press/dezeen.png'               },
  { id: 4,  name: 'T Magazine',           link: '#', img: '/press/t-magazine.png'           },
  { id: 5,  name: 'Surface',              link: '#', img: '/press/surface.png'              },
  { id: 6,  name: 'IFDM',                 link: 'https://ifdm.design/2026/02/26/house-of-santal-brings-south-asian-design-to-nyc/', img: '/press/ifdm.png'                 },
  { id: 7,  name: 'Livingetc.',           link: '#', img: '/press/livingetc.png'            },
  { id: 8,  name: 'Observer',             link: '#', img: '/press/observer.png'             },
  { id: 9,  name: 'Business of Home',     link: '#', img: '/press/business-of-home.png'    },
  { id: 10, name: 'The PR Net',           link: 'https://theprnet.com/news/43334', img: '/press/the-pr-net.png'           },
  { id: 11, name: 'Trend Hunter',         link: '#', img: '/press/trend-hunter.png'         },
  { id: 12, name: 'amNY',                 link: '#', img: '/press/amny.png'                 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function PressPage() {
  const pageRef  = useRef(null);
  const headingRef = useRef(null);
  const pressRef = useRef(null);

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

      const pressItems = pressRef.current?.children;
      if (pressItems?.length) {
        tl.fromTo(
          pressItems,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
          0.4
        );
      }

    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="bg-black min-h-screen"
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

        {/* Press Coverage */}
        {/* <div className="mt-12 mb-6 flex items-center gap-4">
          <span className={`text-xs uppercase tracking-widest text-gray-500 whitespace-nowrap ${montserrat.className}`}>
            Press Coverage
          </span>
          <div className="flex-1 h-px bg-gray-800" />
        </div> */}

        <div
          ref={pressRef}
          className="flex flex-wrap justify-center pb-24"
        >
          {pressItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group basis-1/2 md:basis-1/3 flex flex-col items-center justify-center gap-4 py-16 cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.name}
                className="max-h-10 max-w-[180px] w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className={`text-[10px] uppercase tracking-widest text-gray-500 group-hover:text-gray-300 transition-colors duration-300 ${montserrat.className}`}>
                View Article →
              </span>
            </a>
          ))}
        </div>


      </div>

      <Footer />
    </div>
  );
}
