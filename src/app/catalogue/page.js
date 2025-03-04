'use client';
import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const page = () => {
  const handleDownload = async (event, url) => {
    event.preventDefault();
    const fileUrl = url;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'file.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b bg-black'>
      <div
        className='min-h-screen text-white'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        <Navbar arrow={true} />
        <div className='w-full pt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='w-full text-center flex justify-center'>
            <h1 className='text-4xl font-bold text-gray-200 dark:text-white pb-8 border-b-2 border-gray-800 dark:border-gray-700 capitalize w-full md:max-w-3xl'>
              Catalogue
            </h1>
          </div>
          <div className='w-full flex justify-center mt-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-8 gap-x-14 gap-y-16'>
              <div className='uppercase flex flex-col gap-3'>
                <img src='/collabs/kdxserafini.jpeg' alt='' className='w-72' />
                <h1 className='font-bold tracking-widest'>kd x serafini</h1>
                <span>
                  <a
                    href=''
                    onClick={(event) =>
                      handleDownload(
                        event,
                        'https://res.cloudinary.com/dfpxvbkwt/image/upload/v1738908580/KD_X_Serafini_Catalogue_aeieux.pdf'
                      )
                    }
                    className=' text-blue-600 text-start rounded hover:text-blue-900 transition-all duration-300'
                  >
                    download catalogue pdf
                  </a>
                </span>
              </div>
              <div className='uppercase flex flex-col gap-3'>
                <img src='/collabs/matilda.jpeg' alt='' className='w-72' />
                <h1 className='font-bold tracking-widest'>matilda</h1>
                <span>
                  <a
                    href=''
                    onClick={(event) =>
                      handleDownload(
                        event,
                        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUczc3ZpOzfU0v5mZaj1HWcAwKFCxykrE2NGSI'
                      )
                    }
                    className='text-blue-600 hover:text-blue-900 transition-all duration-300'
                  >
                    download catalogue pdf
                  </a>
                </span>
              </div>
              <div className='uppercase flex flex-col gap-3'>
                <img src='/collabs/monster1.0.jpeg' alt='' className='w-72' />
                <h1 className='font-bold tracking-widest'>monster 1.0</h1>
                <span>
                  <a
                    href=''
                    onClick={(event) =>
                      handleDownload(
                        event,
                        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUne69xubYcoeRKumWaHxyTj5q3bfMXB6INAUz'
                      )
                    }
                    className='text-blue-600 hover:text-blue-900 transition-all duration-300'
                  >
                    download catalogue pdf
                  </a>
                </span>
              </div>
              <div className='uppercase flex flex-col gap-3'>
                <img src='/collabs/monster2.0.jpeg' alt='' className='w-72' />
                <h1 className='font-bold tracking-widest'>monster2.0</h1>
                <span>
                  <a
                    href=''
                    onClick={(event) =>
                      handleDownload(
                        event,
                        'https://7h4qznnnsa.ufs.sh/f/8EYZaNz64oKUQsSTArCgpKiS14YXmU2JDcwG0vBsCL6dWNyP'
                      )
                    }
                    className='text-blue-600 hover:text-blue-900 transition-all duration-300'
                  >
                    download catalogue pdf
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default page;
