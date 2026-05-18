import type { DishKey, RenderedDish } from '@/types';
import { normalize } from '@/lib/banned';

// Decide what the "AI" drew based on prompt keywords. If too vague or off-topic, mock the player.
export function pickDish(prompt: string): RenderedDish {
  const n = ' ' + normalize(prompt) + ' ';

  const has = (...keys: string[]): boolean => keys.some((k) => n.includes(' ' + normalize(k) + ' ') || n.includes(normalize(k)));

  // Strong pizza signals — multiple distinct cues required
  const pizzaSignals = [
    has('round', 'circular', 'disc', 'disk', 'wheel'),
    has('flat', 'thin', 'baked'),
    has('savory', 'savoury', 'topping', 'toppings', 'topped'),
    has('melted', 'bubbly', 'golden', 'charred', 'wood fired', 'wood-fired', 'oven'),
    has('italian', 'naples', 'neapolitan', 'street food', 'nonna'),
    has('basil', 'tomato', 'oregano', 'mushroom', 'olive', 'pepperoni-free', 'cured meat', 'salami'),
    has('wooden board', 'wooden peel', 'board', 'peel', 'paddle'),
  ];
  const pizzaScore = pizzaSignals.filter(Boolean).length;

  if (pizzaScore >= 4) {
    return {
      label: 'A PIZZA!',
      description: 'Wood-fired, charred edges, bubbly top, topped and centered on a rustic board.',
      svgKey: 'pizza',
      mood: 'win',
    };
  }

  // Close but not enough
  if (pizzaScore === 3) {
    return {
      label: 'A suspiciously round flatbread',
      description: 'The AI got close. It made a flat, round, baked thing. But it forgot the toppings.',
      svgKey: 'sad-bread',
      mood: 'close',
    };
  }

  // Off-topic interpretations
  if (has('soup', 'broth', 'liquid', 'stew')) {
    return { label: 'A bowl of regret soup', description: 'You asked for liquid food. The AI delivered.', svgKey: 'soup', mood: 'weird' };
  }
  if (has('taco', 'tortilla', 'folded')) {
    return { label: 'A confused taco', description: 'Folded flat thing? Sure, here is a taco.', svgKey: 'taco', mood: 'weird' };
  }
  if (has('pancake', 'syrup', 'breakfast', 'stack')) {
    return { label: 'A sad pancake', description: 'Round and flat is not enough. Have a pancake.', svgKey: 'pancake', mood: 'sad' };
  }
  if (has('donut', 'doughnut', 'ring', 'hole')) {
    return { label: 'A donut', description: "Round with a hole. Close, but no oven.", svgKey: 'donut', mood: 'weird' };
  }
  if (has('salad', 'lettuce', 'green', 'healthy', 'vegetable', 'veggie')) {
    return { label: 'A defiant salad', description: 'You said healthy. The AI heard salad.', svgKey: 'salad', mood: 'sad' };
  }
  if (has('tomato', 'red')) {
    return { label: 'A tomato puddle', description: 'Just a sad red splat on a plate. Bon appetit.', svgKey: 'tomato-puddle', mood: 'sad' };
  }
  if (has('round', 'circular', 'disc', 'circle')) {
    return { label: 'The Circle of Shame', description: 'You said "round food". This is a circle. Technically food.', svgKey: 'circle-of-shame', mood: 'sad' };
  }
  if (has('cheesy', 'cheesey', 'dairy', 'milk')) {
    return { label: 'A cheesy rock', description: 'It is dairy. It is solid. It is technically food.', svgKey: 'cheesy-rock', mood: 'bizarre' };
  }
  if (has('alien', 'ufo', 'space')) {
    return { label: 'A flying saucer', description: 'You said disc. The AI heard UFO.', svgKey: 'flying-saucer', mood: 'bizarre' };
  }
  if (has('meat', 'protein', 'sausage', 'beef')) {
    return { label: 'Mystery meat loaf', description: 'A vaguely brown lump. Enjoy.', svgKey: 'mystery-meat', mood: 'weird' };
  }

  // Default fallback
  const fallbacks: DishKey[] = ['circle-of-shame', 'sad-bread', 'mystery-meat', 'soup', 'salad'];
  const idx = Math.floor((prompt.length * 7) % fallbacks.length);
  return {
    label: 'An unidentified dish',
    description: 'The AI had no idea what you wanted. This is what came out.',
    svgKey: fallbacks[idx],
    mood: 'sad',
  };
}
