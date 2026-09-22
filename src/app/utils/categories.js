export const categoryList = [
  { name: 'Console', img: '/group/5.png' }, // Placeholder images using existing group images
  { name: 'Dining Table', img: '/group/4.png' },
  { name: 'Coffee Table', img: '/group/2.png' },
  { name: 'Side Table', img: '/group/1.png' },
  { name: 'Chair', img: '/group/6.png' },
  { name: 'Bench', img: '/group/7.png' },
  { name: 'Bathtub', img: '/group/3.png' },
  { name: 'Basin', img: '/group/4.png' },
  { name: 'Planter', img: '/group/1.png' },
  { name: 'Vase', img: '/group/5.png' },
  { name: 'Mirror', img: '/group/6.png' },
  { name: 'Pendant Light', img: '/group/7.png' },
];

export const deriveCategory = (title) => {
  if (!title) return 'Other';
  const lower = title.toLowerCase();
  
  if (lower.includes('console')) return 'Console';
  if (lower.includes('dining table')) return 'Dining Table';
  if (lower.includes('coffee table') || lower.includes('center table') || lower.includes('u table')) return 'Coffee Table';
  if (lower.includes('side table')) return 'Side Table';
  if (lower.includes('chair')) return 'Chair';
  if (lower.includes('bench')) return 'Bench';
  if (lower.includes('bathtub')) return 'Bathtub';
  if (lower.includes('basin')) return 'Basin';
  if (lower.includes('planter')) return 'Planter';
  if (lower.includes('vase')) return 'Vase';
  if (lower.includes('mirror')) return 'Mirror';
  if (lower.includes('pendant light')) return 'Pendant Light';
  
  return 'Other';
};
