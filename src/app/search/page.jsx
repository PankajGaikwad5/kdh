'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCardV2 from '../components/ProductCardV2';
import { products } from '../components/products';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return {};
    const lowerQuery = query.toLowerCase();

    // Filter products
    const filtered = products.filter((p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.group && p.group.toLowerCase().includes(lowerQuery))
    );

    // Group products by collection
    return filtered.reduce((acc, product) => {
      const groupName = product.group || 'Other';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(product);
      return acc;
    }, {});
  }, [query]);

  const groupKeys = Object.keys(results);

  return (
    <div className='flex flex-col'>
      <div className='w-full text-center flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8'>
        <h1 className='text-2xl md:text-4xl font-medium py-6 border-b uppercase w-full md:max-w-3xl tracking-widest text-gray-900 border-gray-200 dark:text-gray-200 dark:border-gray-800'>
          Search Results
        </h1>
        {query && (
          <p className='mt-6 text-sm md:text-base uppercase tracking-widest text-gray-500 dark:text-gray-400'>
            Showing results for <span className='text-gray-900 dark:text-white font-medium'>"{query}"</span>
          </p>
        )}
      </div>

      {groupKeys.length === 0 ? (
        <div className='flex-grow flex items-center justify-center py-32'>
          <p className='text-gray-500 text-xl font-light'>
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className='flex-grow mt-12 space-y-12'>
          {groupKeys.map((group) => (
            <section key={group}>
              <h2 className='text-center text-lg md:text-2xl font-medium uppercase tracking-widest mb-6 text-gray-900 dark:text-gray-200'>
                {group.replace('_', ' ')}
              </h2>
              <div className='grid grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 w-full'>
                {results[group].map((product, index) => (
                  <ProductCardV2
                    key={product._id?.$oid || index}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className='min-h-screen flex flex-col bg-white dark:bg-black'>
      <div className='min-h-screen grid grid-rows-[1fr_auto]'>
        <Navbar arrow={false} home={false} />
        <Suspense fallback={
          <div className='min-h-screen flex items-center justify-center text-gray-900 dark:text-white'>
            <div className='animate-pulse text-xl'>Loading...</div>
          </div>
        }>
          <SearchResults />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
