// scripts/generate-thumbnails.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string - adjust if needed
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables.');
  console.log('Please create a .env file in your project root with:');
  console.log('MONGODB_URI=your_mongodb_connection_string');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define Product Schema (minimal version just for this script)
const productSchema = new mongoose.Schema({
  title: String,
  images: [
    {
      fileName: String,
      filePath: String,
      thumbnail: String,
    },
  ],
});

// Create model (or use existing one)
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

async function generateThumbnails() {
  try {
    console.log('Starting thumbnail generation...');

    // Get all products
    const products = await Product.find();
    console.log(`Found ${products.length} products to process`);

    // Make sure directories exist
    const uploadDir = path.join(process.cwd(), 'public');
    const thumbsDir = path.join(
      process.cwd(),
      'public',
      'assets',
      'products',
      'thumbnails'
    );

    if (!fs.existsSync(thumbsDir)) {
      console.log(`Creating thumbnails directory: ${thumbsDir}`);
      fs.mkdirSync(thumbsDir, { recursive: true });
    }

    let totalImages = 0;
    let successCount = 0;
    let errorCount = 0;

    // Process each product
    for (const product of products) {
      console.log(`Processing product: ${product.title}`);

      // Skip if no images
      if (!product.images || product.images.length === 0) {
        console.log('  No images found for this product, skipping');
        continue;
      }

      totalImages += product.images.length;
      let productUpdated = false;

      // Process each image
      for (const image of product.images) {
        if (!image.filePath) {
          console.log('  Image missing filePath, skipping');
          errorCount++;
          continue;
        }

        // Get file name from path
        const fileName = path.basename(image.filePath);

        // Determine paths
        // Assuming filePath is something like "/assets/products/image.jpg"
        const originalPath = path.join(process.cwd(), 'public', image.filePath);
        const thumbPath = path.join(thumbsDir, fileName);
        const thumbRelativePath = `/assets/products/thumbnails/${fileName}`;

        console.log(`  Processing image: ${fileName}`);
        console.log(`    Original path: ${originalPath}`);
        console.log(`    Thumbnail path: ${thumbPath}`);

        // Check if original file exists
        if (!fs.existsSync(originalPath)) {
          console.error(
            `    ERROR: Original file not found at ${originalPath}`
          );
          errorCount++;
          continue;
        }

        // Check if thumbnail already exists
        if (fs.existsSync(thumbPath) && image.thumbnail) {
          console.log(`    Thumbnail already exists, skipping`);
          successCount++;
          continue;
        }

        // Generate thumbnail
        try {
          await sharp(originalPath)
            .resize(400, 300, { fit: 'cover' })
            .toFile(thumbPath);

          // Update MongoDB record
          image.thumbnail = thumbRelativePath;
          productUpdated = true;
          successCount++;
          console.log(`    ✓ Generated thumbnail successfully`);
        } catch (err) {
          console.error(`    ERROR processing ${fileName}:`, err.message);
          errorCount++;
        }
      }

      // Save updated product if changes were made
      if (productUpdated) {
        try {
          await product.save();
          console.log(`  ✓ Saved product with updated thumbnail references`);
        } catch (saveErr) {
          console.error(`  ERROR saving product:`, saveErr.message);
        }
      }
    }

    console.log('\nThumbnail generation complete!');
    console.log(`Processed ${totalImages} images`);
    console.log(`Success: ${successCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('Error in thumbnail generation:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
generateThumbnails();
