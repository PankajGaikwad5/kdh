// File: /app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../lib/mongodb';
import Product from '../../../../models/product';

// In-memory cache for products (consider Redis for production)
const productCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Connection pool management
let isConnected = false;
let connectionPromise = null;

const getConnection = async () => {
  if (isConnected) return;

  if (!connectionPromise) {
    connectionPromise = connectMongoDB();
  }

  await connectionPromise;
  isConnected = true;
  return;
};

// Optimized product fetch with field selection
const getProductById = async (id) => {
  await getConnection();

  // Only select necessary fields to reduce data transfer
  return await Product.findOne(
    { _id: id },
    {
      title: 1,
      description: 1,
      dimensions: 1,
      group: 1,
      images: 1,
      material: 1,
      pdf: 1,
      _id: 1,
    }
  ).lean(); // Use lean() for better performance
};

export async function GET(request, { params }) {
  const { id } = params;

  // Input validation
  if (!id || id.length !== 24) {
    return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Check cache first
    const cacheKey = `product_${id}`;
    const cached = productCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const headers = new Headers();
      headers.set('Cache-Control', 'public, max-age=300, s-maxage=300');
      headers.set('X-Cache', 'HIT');

      return NextResponse.json(
        { products: cached.data },
        { status: 200, headers }
      );
    }

    // Fetch from database
    const products = await getProductById(id);

    if (!products) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Cache the result
    productCache.set(cacheKey, {
      data: products,
      timestamp: Date.now(),
    });

    // Clean up old cache entries periodically
    if (productCache.size > 100) {
      const now = Date.now();
      for (const [key, value] of productCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          productCache.delete(key);
        }
      }
    }

    // Set optimized cache headers
    const headers = new Headers();
    headers.set(
      'Cache-Control',
      'public, max-age=300, s-maxage=300, stale-while-revalidate=60'
    );
    headers.set('X-Cache', 'MISS');
    headers.set('Vary', 'Accept-Encoding');

    return NextResponse.json({ products }, { status: 200, headers });
  } catch (error) {
    console.error('Error fetching product:', error);

    // Reset connection on database errors
    if (error.name === 'MongoError' || error.name === 'MongoNetworkError') {
      isConnected = false;
      connectionPromise = null;
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
