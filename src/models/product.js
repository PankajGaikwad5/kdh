import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  images: [
    {
      fileName: { type: String },
      filePath: { type: String }, // This will be the public URL path
    },
  ],
  description: { type: String },
  dimensions: { type: String }, // Optional field
  // Add more fields later if needed
});

const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;
