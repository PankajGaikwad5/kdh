// import { NextResponse } from 'next/server';
// import connectMongoDB from '../../../../lib/mongodb';
// import Product from '../../../../models/product';
// // import Features from '../../../models/features';

// export async function GET(request, { params }) {
//   const { id } = await params;
//   await connectMongoDB();

//   try {
//     const products = await Product.findOne({ _id: id });

//     if (!products) {
//       return NextResponse.json({ error: 'Project not found' }, { status: 404 });
//     }

//     // console.log(projects); // Correct method
//     return NextResponse.json({ products }, { status: 200 });
//   } catch (error) {
//     console.error('Error fetching project:', error); // Log the actual error
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// File: /app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../lib/mongodb';
import Product from '../../../../models/product';
import { cache } from 'react';

// Create a cached version of the MongoDB connection
const cachedConnect = cache(async () => {
  await connectMongoDB();
  return true;
});

// Create a cached version of the product fetch function
export const getProductById = cache(async (id) => {
  await cachedConnect();
  return await Product.findOne({ _id: id });
});

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Use cached connection and fetch
    await cachedConnect();
    const products = await getProductById(id);

    if (!products) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Add cache control headers for the browser
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    return NextResponse.json(
      { products },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
