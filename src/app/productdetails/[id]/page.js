import { products } from '@/app/components/altproducts';
import AltProductDetailsClient from '@/app/components/pageComp/AltProductDetailsClient';
import { notFound } from 'next/navigation';
import {
  getProductId,
  getProductSeo,
  getProductJsonLd,
  getProductUrl,
  SITE_URL,
} from '@/lib/seo';

const findProduct = (id) => products.find((p) => getProductId(p) === id);

export function generateStaticParams() {
  return products.map((p) => ({ id: getProductId(p) }));
}

export async function generateMetadata({ params }) {
  const product = findProduct(params.id);

  if (!product) return {};

  const { title, description, keywords } = getProductSeo(product);
  const url = getProductUrl(product);
  const images = (product.images || []).slice(0, 4).map((img) => ({
    url: `${SITE_URL}${img.filePath || img}`,
    alt: title,
  }));

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Karan Desai Home',
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
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

export default function AltProductDetailsPage({ params }) {
  const product = findProduct(params.id);

  if (!product) notFound();

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product)) }}
      />
      <AltProductDetailsClient product={product} />
    </>
  );
}
