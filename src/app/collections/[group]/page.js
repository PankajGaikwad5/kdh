'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ProductCard from '../../components/ProductCard';
import { products } from '@/app/components/products';
import { catalogues } from '@/app/components/catalogues';
import Image from 'next/image';
import { X } from 'lucide-react';

const GroupProductsPage = () => {
  const { group } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [pdfLink, setPdfLink] = useState('');
  const router = useRouter();
  const [image1, setImage1] = useState();
  const [image2, setImage2] = useState();
  const [year, setYear] = useState('');

  useEffect(() => {
    const groupProducts = products.filter((p) => p.group === group);
    setFilteredProducts(groupProducts);

    const foundCatalogue = catalogues.find((c) => c.group === group);
    setPdfLink(foundCatalogue ? foundCatalogue.pdf : '');
    setImage1(foundCatalogue ? foundCatalogue.image : '');
    setImage2(foundCatalogue ? foundCatalogue.image2 : '');
    setYear(foundCatalogue ? foundCatalogue.year : '');
  }, [group]);

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
        // open the catalogue
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

  return (
    <div className='min-h-screen flex flex-col bg-black'>
      <div className='min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={true} home={true} />

        <header className='fixed top-3 right-0 md:right-2 w-full flex justify-end items-center p-4 z-30'>
          <button
            onClick={() => router.back()}
            className='text-white hover:text-gray-300 transition'
          >
            <ArrowLeft size={30} />
          </button>
        </header>

        <div className='pt-20 md:pt-7 px-4 sm:px-6 lg:px-8'>
          <div className='w-full text-center flex flex-col justify-center items-center'>
            {!pdfLink && (
              <h1 className='text-4xl font-bold text-gray-300 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'>
                {group.replace('_', ' ')}
              </h1>
            )}
            {/* <h1 className='text-4xl font-bold text-gray-300 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'>
              {group.replace('_', ' ')}
            </h1> */}

            {pdfLink && (
              <>
                <div className='flex gap-8 2xl:gap-16 items-center pb-2 border-b-2 border-gray-800 w-full max-w-3xl justify-center mb-4'>
                  <Image
                    width={200}
                    height={200}
                    src={'/assets/kdhlogo3.png'}
                    className='2xl:w-96'
                  />
                  <X className='text-white' size={30} />
                  <Image
                    width={200}
                    height={200}
                    src={image1}
                    className=' 2xl:w-96'
                  />
                  {image2 && (
                    <>
                      <X className='text-white' size={30} />
                      <Image
                        width={100}
                        height={100}
                        src={image2}
                        className='mb-6 2xl:w-96'
                      />
                    </>
                  )}
                </div>

                <div className='flex flex-col gap-3'>
                  {/* <h1 className='text-xl -mt-6 px-72 text-gray-300 pb-2 border-b-2 border-gray-800 w-full md:max-w-3xl'>
                presents
              </h1> */}
                  <h1 className='text-4xl font-bold text-gray-300  uppercase w-full md:max-w-3xl'>
                    {group.replace('_', ' ')}
                    <p className='text-white text-xs font-normal'>{`(${year})`}</p>
                  </h1>
                </div>
              </>
            )}

            {pdfLink && (
              <div className='flex justify-center mt-8'>
                <button
                  onClick={handleDownloadClick}
                  className='px-8 py-3 border border-gray-600 text-gray-300 rounded-lg 
      hover:bg-gray-800 hover:text-white transition-all duration-300'
                >
                  Download Catalogue
                </button>
              </div>
            )}
          </div>
          {/* <div className='w-full text-center flex flex-col justify-center items-center'>
           <h1 className='text-4xl font-bold text-gray-300 pb-8 border-b-2 border-gray-800 uppercase w-full md:max-w-3xl'>
              {group.replace('_', ' ')}
            </h1> 

            <div className='flex gap-4 items-center'>
              <h1 className='text-4xl font-bold text-gray-300 mt-4 uppercase w-full md:max-w-3xl'>
                MONSTER 1.0
                <span>
                  <p className='text-white text-xs font-normal'>{`(2022)`}</p>
                </span>
              </h1>
              <X className='text-white' size={30} />
              <Image
                width={250}
                height={250}
                src={'/assets/dimensions.png'}
                className='mb-10'
              />
            </div>

            {/* {pdfLink && (
              <button
                onClick={handleDownloadClick}
                className='mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition'
              >
                Download Catalogue
              </button>
            )} 
          </div> */}

          <div className='flex justify-center items-center'>
            <div className='flex-grow grid grid-cols-2 md:grid-cols-4 pt-10 gap-4 p-4'>
              {filteredProducts.map(({ title, images, _id, index }) => (
                <ProductCard
                  title={title}
                  img={images[0]?.filePath}
                  id={_id.$oid}
                  key={index}
                  hoveredIndex={hoveredIndex}
                  setHoveredIndex={setHoveredIndex}
                />
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50'>
          <div className='bg-white rounded-xl p-6 w-11/12 max-w-md'>
            <h2 className='text-xl font-semibold mb-4 text-center'>
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
                className='border p-2 rounded-md'
              />
              <input
                type='email'
                name='email'
                placeholder='Your Email'
                value={formData.email}
                onChange={handleChange}
                required
                className='border p-2 rounded-md'
              />
              <input
                type='tel'
                name='phone'
                placeholder='Your Phone'
                value={formData.phone}
                onChange={handleChange}
                required
                className='border p-2 rounded-md'
              />
              <button
                type='submit'
                disabled={loading}
                className='bg-black text-white py-2 rounded-md hover:bg-gray-900 transition'
              >
                {loading ? 'Submitting...' : 'Download / View Catalogue'}
              </button>
              <button
                type='button'
                onClick={() => setShowModal(false)}
                className='text-gray-600 hover:underline text-sm mt-2 text-center'
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

export default GroupProductsPage;
