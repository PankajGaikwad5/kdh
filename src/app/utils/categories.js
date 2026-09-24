export const categoryList = [
  { name: 'Living Room' },
  { name: 'Dining Room' },
  { name: 'Bedroom' },
  { name: 'Bathroom' },
  { name: 'Office & Study' },
  { name: 'Lighting' },
  { name: 'Decors & Accessories' }
];

export const deriveCategory = (title) => {
  if (!title) return ['Decors & Accessories'];
  const lower = title.toLowerCase();
  const cats = new Set();
  
  if (lower.includes('center table') || lower.includes('coffee table') || lower.includes('u table') || lower.includes('u-table') || lower.includes('ottoman') || lower.includes('sofa') || lower.includes('rug') || lower.includes('carpet')) {
    cats.add('Living Room');
  }
  if (lower.includes('console')) {
    cats.add('Living Room');
    cats.add('Bedroom');
  }
  if (lower.includes('side table')) {
    cats.add('Living Room');
    cats.add('Bedroom');
  }
  if (lower.includes('bench')) {
    cats.add('Living Room');
    cats.add('Bedroom');
    cats.add('Dining Room');
  }
  if (lower.includes('partition') || lower.includes('screen') || lower.includes('monsformer')) {
    cats.add('Living Room');
  }
  
  if (lower.includes('dining table') || lower.includes('dining chair') || lower.includes('bar ') || lower.includes('tea bar') || lower.includes('bar stool') || lower.includes('charwood chair') || lower.includes('gattoo chair')) {
    cats.add('Dining Room');
  }
  if (lower.includes('chair') && !lower.includes('dining chair') && !lower.includes('charwood chair') && !lower.includes('gattoo chair')) {
    cats.add('Living Room');
  }
  
  if (lower.includes('bed side table') || lower.includes('chest of drawer')) {
    cats.add('Bedroom');
  }
  
  if (lower.includes('basin') || lower.includes('bathtub')) {
    cats.add('Bathroom');
  }
  
  if (lower.includes('desk') || lower.includes('conference table') || lower.includes('library') || lower.includes('shelving')) {
    cats.add('Office & Study');
  }
  
  if (lower.includes('planter') || lower.includes('vase') || lower.includes('mirror') || lower.includes('mearr') || lower.includes('totem') || lower.includes('gum') || lower.includes('gattoofer') || lower.includes('squinty') || lower.includes('grumpy') || lower.includes('brainy') || lower.includes('binty') || lower.includes('buddha') || lower.includes('guard') || lower.includes('yodaa')) {
    cats.add('Decors & Accessories');
  }
  
  if (lower.includes('lamp') || lower.includes('pendant') || lower.includes('chandelier') || lower.includes('gum') || lower.includes('gattoofer') || lower.includes('squinty') || lower.includes('grumpy') || lower.includes('brainy') || lower.includes('binty') || lower.includes('buddha') || lower.includes('guard')) {
    cats.add('Lighting');
  }
  
  if (cats.size === 0) return ['Decors & Accessories'];
  
  return Array.from(cats);
};
