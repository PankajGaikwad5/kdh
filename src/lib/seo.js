import { getCollectionName, collectionTitlesMap } from '@/lib/utils';
import { categoryList, deriveCategory } from '@/app/utils/categories';

export const SITE_URL = 'https://karandesaihome.com';
export const BRAND = 'Karan Desai Home';

// Ordered most-specific first: the first match wins.
const PRODUCT_TYPES = [
  ['bed side table', 'Bedside Table'],
  ['side table', 'Side Table'],
  ['center table', 'Center Table'],
  ['coffee table', 'Coffee Table'],
  ['round dining table', 'Round Dining Table'],
  ['dining table', 'Dining Table'],
  ['conference table', 'Conference Table'],
  ['study table', 'Study Table'],
  ['u-table', 'U Table'],
  ['u table', 'U Table'],
  ['kids chair', 'Kids Chair'],
  ['dining chair', 'Dining Chair'],
  ['bar stool', 'Bar Stool'],
  ['chair', 'Chair'],
  ['sofa', 'Sofa'],
  ['ottoman', 'Ottoman'],
  ['bench', 'Bench'],
  ['console storage', 'Storage Console'],
  ['console', 'Console Table'],
  ['chest of drawer', 'Chest of Drawers'],
  ['desk', 'Desk'],
  ['shelving', 'Shelving Unit'],
  ['library', 'Bookshelf'],
  ['tea bar', 'Tea Bar'],
  ['bar', 'Bar Unit'],
  ['wash basin', 'Wash Basin'],
  ['basin', 'Wash Basin'],
  ['bathtub', 'Bathtub'],
  ['chandelier', 'Chandelier'],
  ['pendant', 'Pendant Light'],
  ['floor lamp', 'Floor Lamp'],
  ['floorlamp', 'Floor Lamp'],
  ['table lamp', 'Table Lamp'],
  ['lamp', 'Lamp'],
  ['mirror', 'Mirror'],
  ['planter', 'Planter'],
  ['vase', 'Vase'],
  ['rug', 'Rug'],
  ['partition', 'Partition Screen'],
  ['screen', 'Partition Screen'],
  ['totem', 'Sculptural Totem'],
  ['table', 'Table'],
];

export function getProductId(product) {
  return typeof product._id === 'object' ? product._id.$oid : product._id;
}

export function getProductType(product) {
  const lower = (product.title || '').toLowerCase();
  const match = PRODUCT_TYPES.find(([needle]) => lower.includes(needle));
  if (match) return match[1];
  if (product.group === 'monster_collectibles') return 'Collectible Sculpture';
  const cats = deriveCategory(product.title);
  if (cats.includes('Lighting')) return 'Sculptural Light';
  return 'Décor Piece';
}

// Material only reads naturally in front of hard-surface pieces ("Marble Dining Table", not "Marble Sofa")
const MATERIAL_TYPES = /table|console|bench|basin|bathtub|mirror|planter|vase|shelving|bookshelf|desk|bar|totem/i;

function pluralize(word) {
  if (/(x|ch|sh)$/.test(word)) return `${word}es`;
  return word.endsWith('s') ? word : `${word}s`;
}

export function toTitleCase(str = '') {
  // Only fully upper-case titles get lowered, so short codes like "3D" or "KD" survive
  const base = str === str.toUpperCase() ? str.toLowerCase() : str;
  return base
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/^Matila\b/, 'Matilda');
}

export function getProductCategories(product) {
  if (product.category) return product.category.split(',').map((c) => c.trim());
  return deriveCategory(product.title);
}

function getMaterialKeywords(material = '') {
  const lower = material.toLowerCase();
  return ['marble', 'onyx', 'brass', 'gold', 'wood', 'teak', 'walnut', 'metal', 'glass', 'stone', 'resin', 'leather', 'velvet', 'fabric', 'terrazzo', 'granite']
    .filter((m) => lower.includes(m));
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return str.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

export function getProductUrl(product) {
  return `${SITE_URL}/productdetails/${getProductId(product)}`;
}

// Prefixes the collection when the title doesn't already carry it ("Dining Table" -> "Jina Shilp Dining Table")
export function getProductName(product) {
  const name = toTitleCase(product.title);
  if (!product.group || product.group === 'friends') return name;
  const collectionShort = getCollectionName(product).split(' | ')[0];
  const firstWord = (s) => s.split(' ')[0].toLowerCase();
  return firstWord(name) === firstWord(collectionShort) ? name : `${collectionShort} ${name}`;
}

export function getProductSeo(product) {
  const type = getProductType(product);
  const collection = getCollectionName(product);
  const name = getProductName(product);
  const materials = getMaterialKeywords(product.material);
  const categories = getProductCategories(product);
  const materialPrefix = materials[0] && MATERIAL_TYPES.test(type) ? `${toTitleCase(materials[0])} ` : '';
  const typeInName = name.toLowerCase().includes(type.toLowerCase());

  const title = typeInName
    ? `${name} – Luxury ${materialPrefix}${type}`
    : `${name} – Luxury Designer ${type}`;

  const description = truncate(
    `Luxury designer ${type.toLowerCase()} from the ${collection} collection by ${BRAND}${
      product.material ? `, crafted in ${product.material}` : ''
    }. ${product.description || ''}`,
    160
  );

  const keywords = [
    name,
    type,
    `luxury ${type.toLowerCase()}`,
    `designer ${type.toLowerCase()}`,
    `${type.toLowerCase()} India`,
    `${type.toLowerCase()} Mumbai`,
    ...materials.map((m) => `${m} ${type.toLowerCase()}`),
    ...categories.map((c) => `${c.toLowerCase()} furniture`),
    collection,
    BRAND,
  ];

  return { type, name, collection, categories, title, description, keywords };
}

export function getProductJsonLd(product) {
  const { type, name, collection, categories, description } = getProductSeo(product);
  const url = getProductUrl(product);
  const images = (product.images || []).map((img) => `${SITE_URL}${img.filePath || img}`);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': url,
      name,
      url,
      description: product.description || description,
      image: images,
      sku: getProductId(product),
      category: `${categories.join(', ')} > ${type}`,
      material: product.material,
      brand: { '@type': 'Brand', name: BRAND },
      manufacturer: { '@type': 'Organization', name: BRAND, url: SITE_URL },
      isPartOf: collection ? { '@type': 'Collection', name: collection } : undefined,
      additionalProperty: product.dimensions
        ? [{ '@type': 'PropertyValue', name: 'Dimensions', value: product.dimensions }]
        : undefined,
    },
    getBreadcrumbJsonLd([
      { name: 'Home', url: SITE_URL },
      { name: 'Collections', url: `${SITE_URL}/collections` },
      ...(product.group ? [{ name: collection, url: `${SITE_URL}/collections/${product.group}` }] : []),
      { name, url },
    ]),
  ];
}

export function getBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getItemListJsonLd(name, products) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getProductUrl(p),
      name: getProductName(p),
    })),
  };
}

// Distinct product types in a list, e.g. "dining tables, chairs, consoles"
export function summarizeProductTypes(products, max = 6) {
  const types = [...new Set(products.map((p) => getProductType(p).toLowerCase()))];
  return types.slice(0, max).map(pluralize).join(', ');
}

export function categorySlug(name) {
  return name.toLowerCase().replace(/ /g, '-');
}

export function findCategoryBySlug(slug) {
  const name = decodeURIComponent(slug).replace(/-/g, ' ').toLowerCase();
  return categoryList.find((c) => c.name.toLowerCase() === name);
}

export const CATEGORY_SEO = {
  'Living Room': 'Luxury living room furniture – designer center tables, coffee tables, sofas, side tables, consoles, benches, ottomans and rugs',
  'Dining Room': 'Luxury dining room furniture – designer dining tables, round marble dining tables and dining chairs',
  Bedroom: 'Luxury bedroom furniture – designer bedside tables, chests of drawers, consoles and side tables',
  Bathroom: 'Luxury bathroom design – sculptural marble wash basins and freestanding bathtubs',
  'Office & Study': 'Luxury office and study furniture – designer desks, study tables, conference tables, bookshelves and shelving units',
  'Kitchen & Bar': 'Luxury bar furniture – designer bar units, bar stools and tea bars',
  Lighting: 'Designer lighting – sculptural floor lamps, table lamps, pendant lights and chandeliers',
  Decors: 'Luxury home décor – designer mirrors, planters, vases, sculptures and collectible art objects',
};

export function getCollectionTitle(group) {
  return collectionTitlesMap[group] || getCollectionName({ group });
}
