import type { DishKey, PizzaScore } from '@/types';

function wc(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function has(re: RegExp, s: string): boolean {
  return re.test(s);
}

export function scorePrompt(prompt: string): PizzaScore {
  const p = prompt.toLowerCase();
  const words = wc(p);

  // Persona: "you are a ...", "act as", "as a"
  let P = 0;
  if (/(you are|act as|as an?|imagine you|persona)/.test(p)) P += 2;
  if (/(chef|illustrator|artist|designer|photographer|baker|culinary|food stylist)/.test(p)) P += 2;
  P = Math.min(4, P);

  // Intent: clear verb + object
  let I = 0;
  if (/(describe|render|draw|illustrate|generate|create|depict|show|produce|paint)/.test(p)) I += 2;
  if (/(round|circular|disc|flat|baked|oven|italian|flatbread|topped|toppings)/.test(p)) I += 2;
  I = Math.min(4, I);

  // Zones: context / setting / details
  let Z1 = 0;
  if (/(wood[- ]fired|stone oven|oven|baked|charred|leoparded|crispy|golden|melted)/.test(p)) Z1 += 2;
  if (/(basil|oregano|tomato|herb|olive oil|garlic|mushroom|olive|pepper|onion|anchovy|prosciutto|salami|sausage|ham|chicken|seafood|pineapple|spinach|arugula|ricotta|gorgonzola|feta|goat|provolone|mozzarella reference avoided)/.test(p)) Z1 += 2;
  Z1 = Math.min(4, Z1);

  // Zen: constraints / style / tone
  let Z2 = 0;
  if (/(do not|don't|avoid|without|never|exclude|must not)/.test(p)) Z2 += 2;
  if (/(style|tone|photorealistic|cartoon|minimalist|vintage|cinematic|isometric|top[- ]down|overhead|close[- ]up)/.test(p)) Z2 += 2;
  Z2 = Math.min(4, Z2);

  // Actions: output format / structure
  let A = 0;
  if (/(output|format|return|respond|provide)/.test(p)) A += 1;
  if (/(steps|list|bullet|paragraph|sentences|words|image|illustration|svg|description)/.test(p)) A += 2;
  if (words >= 40) A += 1;
  A = Math.min(4, A);

  const total = P + I + Z1 + Z2 + A;
  return { P, I, Z1, Z2, A, total };
}

export function judgeDish(prompt: string, score: PizzaScore): DishKey {
  const p = prompt.toLowerCase();

  // Strong signal: round, flat, oven-baked, toppings -> pizza-ish
  const pizzaSignals = [
    /round|circular|disc/.test(p),
    /flat|flatbread|baked|oven/.test(p),
    /tomato|basil|herb|topping|topped/.test(p),
    /italian|neapolitan|sicilian/.test(p),
    /melted|stretchy|gooey|cheesy/.test(p),
  ].filter(Boolean).length;

  if (score.total >= 14 && pizzaSignals >= 3) return 'pizza';
  if (score.total >= 11 && pizzaSignals >= 2) return 'cheesy-rock';

  // Heuristic mis-dishes
  if (/soup|broth|stew|liquid/.test(p)) return 'soup';
  if (/salad|lettuce|greens|vegetable bowl/.test(p)) return 'salad';
  if (/taco|tortilla|wrap/.test(p)) return 'taco';
  if (/pancake|crepe|stack/.test(p)) return 'pancake';
  if (/donut|doughnut|ring/.test(p)) return 'donut';
  if (/meat|steak|beef|pork|chicken/.test(p) && pizzaSignals < 2) return 'mystery-meat';
  if (/tomato/.test(p) && pizzaSignals < 2) return 'tomato-puddle';
  if (/bread|loaf|bun/.test(p)) return 'sad-bread';
  if (/space|alien|ufo|saucer/.test(p)) return 'flying-saucer';

  if (score.total <= 5) return 'circle-of-shame';
  return 'sad-bread';
}
