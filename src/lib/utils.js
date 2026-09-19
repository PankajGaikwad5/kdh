import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const collectionTitlesMap = {
  jina_shilp: 'Jina Shilp | Serafini',
  'monster_4.0': 'Monster 4.0 | Square Knots',
  'monster_3.1': 'Monster 3.1 | Dimensions',
  'monster_3.0': 'Monster 3.0 | Dimensions',
  'monster_2.0': 'Monster 2.0 | TopBrewer | Bharat Flooring',
  'monster_1.0': 'Monster 1.0 | The Quarry',
  matilda_2022: 'Matilda 2022',
  matilda_2023: 'Matilda 2023',
  matilda_2024: 'Matilda 2024',
  matilda_2025: 'Matilda 2025',
  monster_collectibles: 'Monster Collectibles | Arjun Rathi',
  serafini: 'Samaveta | Serafini',
  monsformer: 'Monsformer | Blum',
  friends: 'For Friends',
};

export function getCollectionName(productOrItem) {
  if (!productOrItem) return '';
  if (productOrItem.collectionName) return productOrItem.collectionName;
  if (productOrItem.collection) return productOrItem.collection;

  const group = productOrItem.group;
  if (group) {
    if (collectionTitlesMap[group]) {
      return collectionTitlesMap[group];
    }
    return group
      .replace(/_/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return '';
}

