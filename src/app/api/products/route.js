import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Product from '../../../models/product';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { cache } from 'react'; // Add this import for the cache function

// Cache MongoDB connection
const cachedConnect = cache(async () => {
  await connectMongoDB();
  return true;
});

// Cache products by group
const getProductsByGroup = cache(async (group) => {
  if (group) {
    return await Product.find({ group });
  }
  return await Product.find();
});

export async function POST(req) {
  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Get text fields from the form data
    const title = formData.get('title');
    const description = formData.get('description');
    const dimensions = formData.get('dimensions') || '';
    const group = formData.get('group') || '';

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Prepare an array to hold image information
    const images = [];

    // Ensure the upload directory exists:
    const uploadDir = path.join(process.cwd(), 'public', 'assets', 'products');
    const thumbsDir = path.join(
      process.cwd(),
      'public',
      'assets',
      'products',
      'thumbnails'
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (!fs.existsSync(thumbsDir)) {
      fs.mkdirSync(thumbsDir, { recursive: true });
    }

    // Retrieve all files sent under the "images" field.
    const files = formData.getAll('images');
    for (const file of files) {
      // The uploaded file is a Web API File object
      if (file instanceof File) {
        // Convert the file to a Node.js Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a unique file name (using timestamp and the original name)
        const fileName = `${Date.now()}-${file.name}`;
        const filePathOnDisk = path.join(uploadDir, fileName);
        const thumbPathOnDisk = path.join(thumbsDir, fileName);

        // Process and save images
        try {
          // Save original (but resized to a reasonable max size)
          await sharp(buffer)
            .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
            .toFile(filePathOnDisk);

          // Create thumbnail
          await sharp(buffer)
            .resize(400, 300, { fit: 'cover' })
            .toFile(thumbPathOnDisk);

          // Add to images array
          images.push({
            fileName,
            filePath: `/assets/products/${fileName}`,
            thumbnail: `/assets/products/thumbnails/${fileName}`,
          });
        } catch (err) {
          console.error('Error processing image:', err);
          // Fallback to original method if sharp fails
          await fs.promises.writeFile(filePathOnDisk, buffer);
          images.push({
            fileName,
            filePath: `/assets/products/${fileName}`,
          });
        }
      }
    }

    // Connect to MongoDB and save the new product
    await connectMongoDB();

    const newProduct = await Product.create({
      title,
      description,
      group,
      dimensions,
      images,
    });

    return NextResponse.json(
      { msg: 'Product saved successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving product:', error);
    return NextResponse.json(
      { error: 'Error saving product' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Use cached connection
    await cachedConnect();

    // Get search parameters from the request
    const { searchParams } = new URL(req.url);
    const group = searchParams.get('group');

    // Use cached query
    const products = await getProductsByGroup(group);

    // Add cache control headers
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

    return NextResponse.json(
      { products },
      {
        headers,
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
