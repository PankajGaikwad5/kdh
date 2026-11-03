import { products } from '@/app/components/products';
import {
  SITE_URL,
  getBreadcrumbJsonLd,
  getCollectionTitle,
  getItemListJsonLd,
  summarizeProductTypes,
} from '@/lib/seo';

const getGroupProducts = (group) => products.filter((p) => p.group === group);

export function generateStaticParams() {
  return [...new Set(products.map((p) => p.group).filter(Boolean))].map((group) => ({ group }));
}

export async function generateMetadata({ params }) {
  const group = decodeURIComponent(params.group);
  const items = getGroupProducts(group);
  if (!items.length) return {};

  const name = getCollectionTitle(group);
  const types = summarizeProductTypes(items);
  const url = `${SITE_URL}/collections/${group}`;
  const title = `${name.split(' | ')[0]} Collection – Luxury ${summarizeProductTypes(items, 3)}`;
  const description = `Discover the ${name} collection by Karan Desai Home: ${items.length} limited-edition designer pieces including ${types}. Handcrafted luxury furniture from Mumbai, India.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Karan Desai Home',
      images: items
        .slice(0, 4)
        .map((p) => p.images?.[0]?.filePath)
        .filter(Boolean)
        .map((path) => `${SITE_URL}${path}`),
      type: 'website',
    },
  };
}

export default function CollectionLayout({ children, params }) {
  const group = decodeURIComponent(params.group);
  const items = getGroupProducts(group);
  if (!items.length) return children;

  const name = getCollectionTitle(group);
  const jsonLd = [
    getItemListJsonLd(`${name} Collection – Karan Desai Home`, items),
    getBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Collections', url: `${SITE_URL}/collections` },
      { name, url: `${SITE_URL}/collections/${group}` },
    ]),
  ];

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
