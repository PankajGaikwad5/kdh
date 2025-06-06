// import mongoose from 'mongoose';

// const ProductSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   group: { type: String, required: false },
//   images: [
//     {
//       fileName: { type: String },
//       filePath: { type: String }, // This will be the public URL path
//     },
//   ],
//   description: { type: String },
//   dimensions: { type: String }, // Optional field
//   // Add more fields later if needed
// });

// const Product =
//   mongoose.models.Product || mongoose.model('Product', ProductSchema);

// export default Product;
// models/product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this product'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this product'],
    },
    material: {
      type: String,
      default: '',
    },
    group: {
      type: String,
      default: '',
    },
    dimensions: {
      type: String,
      default: '',
    },
    pdf: {
      type: String,
      default: '',
    },
    images: [
      {
        fileName: String,
        filePath: String,
        thumbnail: String, // Add thumbnail field for optimized loading
      },
    ],
    // Add these fields for better performance
    featuredImage: {
      type: Number, // Index of the featured image in the images array
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
productSchema.index({ group: 1 });
productSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware to ensure at least one image has a thumbnail
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0) {
    this.images.forEach((image) => {
      if (!image.thumbnail) {
        image.thumbnail = image.filePath;
      }
    });
  }
  next();
});

// Virtual for getting the featured image
productSchema.virtual('featuredImageUrl').get(function () {
  if (this.images && this.images.length > 0) {
    const index =
      this.featuredImage < this.images.length ? this.featuredImage : 0;
    return this.images[index].filePath;
  }
  return '';
});

// Virtual for getting the featured thumbnail
productSchema.virtual('featuredThumbnail').get(function () {
  if (this.images && this.images.length > 0) {
    const index =
      this.featuredImage < this.images.length ? this.featuredImage : 0;
    return this.images[index].thumbnail || this.images[index].filePath;
  }
  return '';
});

// Method to increment view count
productSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

// Set toJSON and toObject options to include virtuals
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Check if the model is already defined to prevent errors in development
const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
