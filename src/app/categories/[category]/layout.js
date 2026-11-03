import { products } from '@/app/components/products';
import { deriveCategory } from '@/app/utils/categories';
import {
  CATEGORY_SEO,
  SITE_URL,
  categorySlug,
  findCategoryBySlug,
  getBreadcrumbJsonLd,
  getItemListJsonLd,
  summarizeProductTypes,
} from '@/lib/seo';

const getCategoryProducts = (name) =>
  products.filter((p) => deriveCategory(p.title).includes(name));

export async function generateMetadata({ params }) {
  const category = findCategoryBySlug(params.category);
  if (!category) return {};

  const items = getCategoryProducts(category.name);
  const intro = CATEGORY_SEO[category.name] || `Luxury ${category.name.toLowerCase()} furniture`;
  const url = `${SITE_URL}/categories/${encodeURIComponent(categorySlug(category.name))}`;
  const title = `${intro.split(' – ')[0]} | ${summarizeProductTypes(items, 4)}`;
  const description = `${intro} by Karan Desai Home. ${items.length} handcrafted, limited-edition designer pieces made in India.`;

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

export default function CategoryLayout({ children, params }) {
  const category = findCategoryBySlug(params.category);
  if (!category) return children;

  const url = `${SITE_URL}/categories/${encodeURIComponent(categorySlug(category.name))}`;
  const jsonLd = [
    getItemListJsonLd(`${category.name} – Karan Desai Home`, getCategoryProducts(category.name)),
    getBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Categories', url: `${SITE_URL}/categories` },
      { name: category.name, url },
    ]),
  ];

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
