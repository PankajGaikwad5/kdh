import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from '../components/Footer';
import { Poppins } from 'next/font/google';
import Image from 'next/image';

const popins = Poppins({
  subsets: ['latin'], // Specify subsets
  weight: ['400', '600', '700'], // Specify weight
});

const page = () => {
  return (
    <div
      className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Navbar isBgBlack={true} arrow={true} />
      <main className='pt-12 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        {/* <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b border-gray-200 dark:border-gray-700'>
          About
        </h1> */}
        <div className='w-full text-center flex justify-center'>
          <h1 className='text-4xl font-bold text-gray-900 dark:text-white pb-8 border-b-2 border-gray-200 dark:border-gray-700 capitalize w-full md:max-w-3xl'>
            about
          </h1>
        </div>
        <div className='p-2 md:p-8 flex justify-center'>
          <Card
            img={'/assets/profile.jpg'}
            imagePosition={'left'}
            title={'Karan Desai'}
            desc={
              'Award Winning Architecture + Interior Design Studio | TedX Speaker'
            }
            // text={``}
          />
        </div>

        <div className='p-2 md:p-8 flex justify-center flex-col'>
          <div className='flex justify-center mb-8'>
            <a href='/' className=''>
              <Image
                src='/assets/kdadlogo.png'
                alt='Logo'
                width={200}
                height={200}
                className=' flex justify-self-center object-contain m-0 p-0  '
              />
            </a>
          </div>
          <p
            className={`font-light text-start flex flex-col space-y-4 ${popins.className}`}
          >
            <span>
              "Imagine transforming everyday spaces into rich, immersive
              experiences—what if art became a part of your daily life?" Karan
              Desai Home is a testament to bringing the experience through
              meticulously crafted furniture and products.
            </span>
            <span>
              KDH specialises in creating art pieces that are not only visually
              striking but also serve a functional purpose. Following the
              success of our Monster collection in 2022, we have consistently
              expanded our portfolio, collaborating with renowned industry
              leaders such as The Quarry, Casa Walls, Bharat Flooring, and more.
              Our dedication to design innovation has earned us international
              recognition, including a prestigious partnership with Serafini
              (Italy).
            </span>

            <span>
              With a commitment to global collaborations and a mission to craft
              extraordinary designs, KDH continues to redefine functional art.
              Our unique approach and creative philosophy aim to inspire and
              captivate, bringing exceptional products to life.
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default page;
