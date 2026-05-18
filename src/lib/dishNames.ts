/**
 * Funny generated names for player creations based on dish type and score.
 */
import type { DishKey } from '@/types';

const BASE_NAMES: Record<DishKey, string[]> = {
  pizza: [
    'The Glorious Round One',
    'Disc of Destiny',
    'The Flat Italian',
    'Circular Excellence',
    'The Oven Enlightenment',
  ],
  'sad-bread': [
    'Lumpy McFlatface',
    'The Depressed Loaf',
    'Bread in Existential Crisis',
    'Sir Flops-a-Lot',
    'The Beige Regret',
    'Doughy Sadness Supreme',
  ],
  'flying-saucer': [
    'The Italian UFO',
    'Alien Comfort Food',
    'Disc From Dimension 4',
    'The Intergalactic Round Thing',
    'Space Snack 9000',
  ],
  'tomato-puddle': [
    'The Accidental Marinara',
    'Tomato Soup Cosplay',
    'Red Puddle No. 5',
    'Le Splat Rouge',
    'The Saucy Tragedy',
  ],
  'cheesy-rock': [
    'The Dairy Boulder',
    'Geological Melt Event',
    'Mount Gouda-mus',
    'The Crusty Asteroid',
    'Rock à la Fromage',
  ],
  'circle-of-shame': [
    'The Void Disc',
    'Eternal Uncertainty Platter',
    'NaN / undefined',
    'A Shape. Maybe.',
    '404: Food Not Found',
    'The Prompt That Shall Not Be Named',
  ],
  salad: [
    'Pizza\'s Veggie Cousin',
    'The Green Misunderstanding',
    'Lettuce Disappointment',
    'Operation Wrong Bowl',
    'Sadness with Dressing',
  ],
  'mystery-meat': [
    'Protein of Unknown Origin',
    'The Brown Event',
    'Meat-ish Object',
    'What Even Is This',
    'The Umami Mistake',
  ],
  soup: [
    'Liquid Ambition',
    'Pizza Soup (It Happens)',
    'The Broth That Tried',
    'Dissolved Intentions',
    'Watery Commitment Issues',
  ],
  taco: [
    'The Italian Taco Incident',
    'Folded Confusion',
    'Tortilla Misidentification',
    'The Wrap of Shame',
    'Mexico Called, It\'s Confused',
  ],
  pancake: [
    'The Flat Imposter',
    'Breakfast Trespasser',
    'Stack of Good Intentions',
    'Syrup-Adjacent Disc',
    'The Flipper\'s Mistake',
  ],
  donut: [
    'Ring of Regret',
    'The Holey Disaster',
    'Donut Disturb the Recipe',
    'Glazed Confusion',
    'Circular Hole in My Heart',
  ],
};

const ADJECTIVES = [
  'Artisanal', 'Deconstructed', 'Fusion', 'Hand-crafted', 'Elevated',
  'Post-modern', 'Neo-rustic', 'Avant-garde', 'Hyper-local', 'Molecular',
  'Vibe-coded', 'AI-hallucinated', 'Prompt-engineered', 'Token-optimized',
  'Low-latency', 'Zero-shot', 'Few-shot', 'Over-fitted', 'Underprompted',
];

export function generateDishName(key: DishKey, seed?: number): string {
  const pool = BASE_NAMES[key] ?? BASE_NAMES['circle-of-shame'];
  const s = seed ?? Date.now();
  const baseName = pool[s % pool.length];
  const adj = ADJECTIVES[(s * 7 + 3) % ADJECTIVES.length];
  // Only prepend adjective for non-pizza dishes for extra comedy
  if (key !== 'pizza') {
    return `${adj} ${baseName}`;
  }
  return baseName;
}
