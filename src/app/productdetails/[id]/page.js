import { products } from '@/app/components/products';
import ProductDetailsClient from '@/app/components/pageComp/ProductDetailsClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const product = products.find((p) => {
    const productId = typeof p._id === 'object' ? p._id.$oid : p._id;
    return productId === params.id;
  });

  if (!product) return {};

  return {
    title: product.title,
    description:
      product.description ||
      `${product.title} - Product specifications and details`,
    keywords: `${product.title}, ${
      product.material || ''
    }, furniture, interior design`,
    alternates: {
      canonical: `https://karandesaihome.com/productdetails/${product._id.$oid}`,
    },
    openGraph: {
      title: 'Karan Desai Home',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

export default function ProductDetailsPage({ params }) {
  const product = products.find((p) => {
    const productId = typeof p._id === 'object' ? p._id.$oid : p._id;
    return productId === params.id;
  });

  if (!product) notFound();

  return <ProductDetailsClient product={product} />;
}
