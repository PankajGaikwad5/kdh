import { NextResponse } from 'next/server';
import connectMongoDB from '../../../lib/mongodb';
import Product from '../../../models/product';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    // Parse the incoming multipart/form-data
    const formData = await req.formData();

    // Get text fields from the form data
    const title = formData.get('title');
    const description = formData.get('description');
    const dimensions = formData.get('dimensions') || '';

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
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Retrieve all files sent under the "images" field.
    // (Ensure your client-side form uses the name "images" for file inputs.)
    const files = formData.getAll('images');
    for (const file of files) {
      // The uploaded file is a Web API File object
      if (file instanceof File) {
        // Convert the file to a Node.js Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a unique file name (using timestamp and the original name)
        const fileName = `${Date.now()}-${file.name}`;

        // Define the path on disk (absolute path)
        const filePathOnDisk = path.join(uploadDir, fileName);

        // Write the file to disk
        await fs.promises.writeFile(filePathOnDisk, buffer);

        // Save the relative path (as used by the browser) in the database.
        // Since files in the public folder are served from the root, the URL will be:
        // /assets/products/<fileName>
        images.push({
          fileName,
          filePath: `/assets/products/${fileName}`,
        });
      }
    }

    // Connect to MongoDB and save the new product
    await connectMongoDB();

    const newProduct = await Product.create({
      title,
      description,
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

export async function GET() {
  try {
    await connectMongoDB();
    const products = await Product.find();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}
