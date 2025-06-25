import { products } from './products';

export async function generateMetadata({ params }) {
  const foundProduct = products.find((p) => {
    const productId = typeof p._id === 'object' ? p._id.$oid : p._id;
    return productId === params.id;
  });

  return {
    title: foundProduct?.title || 'Product Details',
    description: foundProduct?.description || 'Product specifications',
  };
}
