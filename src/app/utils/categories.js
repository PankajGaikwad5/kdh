export const categoryList = [
  { name: 'Console', img: '/group/3.png' },
  { name: 'Dining Table', img: 'https://ilf6s48f28.ufs.sh/f/A71pwfasMjQ6gBXjHSCZerKAITJasY524vLb0iMwnFhmpSEq' },
  { name: 'Center Table', img: '/group/2.png' },
  { name: 'Coffee & Side Tables', img: '/group/1.png' },
  { name: 'Chair', img: '/group/6.png' },
  { name: 'Bench', img: '/group/7.png' },
  { name: 'Bathtub', img: '/group/3.png' },
  { name: 'Basin', img: '/group/4.png' },
  { name: 'Planter', img: '/group/1.png' },
  { name: 'Vase', img: '/group/5.png' },
  { name: 'Mirror', img: '/group/6.png' },
  { name: 'Lamp', img: '/group/7.png' },
  { name: 'Library & Storage', img: '/group/1.png' },
  { name: 'Screen & Partition', img: '/group/2.png' },
  { name: 'Rug', img: '/group/3.png' },
];

export const deriveCategory = (title) => {
  if (!title) return 'Other';
  const lower = title.toLowerCase();
  
  if (lower.includes('console') || lower.includes('totem')) return 'Console';
  if (lower.includes('dining table')) return 'Dining Table';
  if (lower.includes('center table') || lower.includes('u table') || lower.includes('u-table')) return 'Center Table';
  if (lower.includes('coffee table') || lower.includes('side table') || lower.includes('bed side table')) return 'Coffee & Side Tables';
  if (lower.includes('chair') || lower.includes('stool') || lower.includes('pouffe')) return 'Chair';
  if (lower.includes('bench')) return 'Bench';
  if (lower.includes('bathtub')) return 'Bathtub';
  if (lower.includes('basin')) return 'Basin';
  if (lower.includes('planter')) return 'Planter';
  if (lower.includes('vase')) return 'Vase';
  if (lower.includes('mirror') || lower.includes('mearr')) return 'Mirror';
  if (lower.includes('lamp') || lower.includes('pendant') || lower.includes('gum') || lower.includes('gattoo') || lower.includes('squinty') || lower.includes('grumpy') || lower.includes('brainy') || lower.includes('binty') || lower.includes('buddha') || lower.includes('guard')) return 'Lamp';
  if (lower.includes('library')) return 'Library & Storage';
  if (lower.includes('partition') || lower.includes('screen')) return 'Screen & Partition';
  if (lower.includes('rug') || lower.includes('carpet')) return 'Rug';
  
  return 'Other';
};
