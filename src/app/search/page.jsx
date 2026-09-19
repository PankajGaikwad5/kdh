'use client';

import React, { Suspense, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../components/products';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    
    // Filter products
    const filtered = products.filter((p) => 
      p.title.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      (p.group && p.group.toLowerCase().includes(lowerQuery))
    );

    // Group products by collection
    const grouped = filtered.reduce((acc, product) => {
      const groupName = product.group || 'Other';
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(product);
      return acc;
    }, {});

    return grouped;
  }, [query]);

  const groupKeys = Object.keys(results);

  // Helper to format group names, e.g., 'matilda_2024' -> 'Matilda 2024'
  const formatGroupName = (name) => {
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className='min-h-screen bg-black text-white flex flex-col pt-32 px-6 md:px-16'>
      <div className='mb-12'>
        <h1 className='text-3xl md:text-5xl font-light uppercase tracking-widest mb-4'>
          Search Results
        </h1>
        {query && (
          <p className='text-gray-400 text-lg'>
            Showing results for <span className='text-white font-medium'>"{query}"</span>
          </p>
        )}
      </div>

      {groupKeys.length === 0 ? (
        <div className='flex-grow flex items-center justify-center'>
          <p className='text-gray-500 text-xl font-light'>
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className='flex-grow space-y-16 pb-16'>
          {groupKeys.map((group) => (
            <div key={group}>
              <h2 className='text-xl md:text-2xl font-bold uppercase tracking-wider mb-8 text-gray-200 border-b border-gray-800 pb-2'>
                {formatGroupName(group)}
              </h2>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12'>
                {results[group].map((product) => {
                  const id = product._id?.$oid || product._id || product.title;
                  const img =
                    product.images?.[0]?.filePath ||
                    product.images?.[0]?.src ||
                    '/placeholder.png';
                  return (
                    <ProductCard
                      key={id}
                      id={id}
                      title={product.title}
                      img={img}
                      hoveredIndex={hoveredIndex}
                      setHoveredIndex={setHoveredIndex}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar isBgBlack={true} />
      <Suspense fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
      }>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
