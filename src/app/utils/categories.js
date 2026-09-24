export const categoryList = [
  { name: 'Living Room' },
  { name: 'Dining Room' },
  { name: 'Bedroom' },
  { name: 'Bathroom' },
  { name: 'Office & Study' },
  { name: 'Kitchen & Bar' },
  { name: 'Lighting' },
  { name: 'Decors' }
];

export const deriveCategory = (title) => {
  if (!title) return ['Decors'];
  const lower = title.toLowerCase();
  const cats = new Set();
  
  // Living Room
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
  }
  if (lower.includes('partition') || lower.includes('screen')) {
    cats.add('Living Room');
  }
  
  // Dining Room
  if (lower.includes('dining table') || lower.includes('dining chair')) {
    cats.add('Dining Room');
  }
  
  // Kitchen & Bar
  if (lower.includes('bar') || lower.includes('top brewer')) {
    cats.add('Kitchen & Bar');
  }
  
  // Chairs (General) - non-dining chairs go to Living Room
  if (lower.includes('chair') && !lower.includes('dining chair')) {
    cats.add('Living Room');
  }
  
  // Bedroom
  if (lower.includes('bed side table') || lower.includes('chest of drawer')) {
    cats.add('Bedroom');
  }
  
  // Bathroom
  if (lower.includes('basin') || lower.includes('bathtub')) {
    cats.add('Bathroom');
  }
  
  // Office & Study
  if (lower.includes('desk') || lower.includes('conference table') || lower.includes('library') || lower.includes('shelving') || lower.includes('top brewer') || lower.includes('matilda 2025 mirror')) {
    cats.add('Office & Study');
  }
  
  // Decors
  if (lower.includes('planter') || lower.includes('vase') || lower.includes('mirror') || lower.includes('mearr') || lower.includes('totem') || lower.includes('gum') || lower.includes('gattoofer') || lower.includes('squinty') || lower.includes('grumpy') || lower.includes('brainy') || lower.includes('binty') || lower.includes('buddha') || lower.includes('guard') || lower.includes('yodaa') || lower.includes('monsformer')) {
    cats.add('Decors');
  }
  
  // Lighting
  if (lower.includes('lamp') || lower.includes('pendant') || lower.includes('chandelier') || lower.includes('gum') || lower.includes('gattoofer') || lower.includes('squinty') || lower.includes('grumpy') || lower.includes('brainy') || lower.includes('binty') || lower.includes('buddha') || lower.includes('guard')) {
    cats.add('Lighting');
  }
  
  if (cats.size === 0) return ['Decors'];
  
  return Array.from(cats);
};
