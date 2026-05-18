import type { PizzaScore } from '@/types';

export type CoachingTip = {
  letter: string;
  label: string;
  tip: string;
  example: string;
};

const TIPS: Record<string, { tip: string; example: string }[]> = {
  P: [
    {
      tip: 'Give the AI a specific persona. "You are a Michelin-starred food photographer" is way stronger than nothing.',
      example: '"You are an expert culinary illustrator with 20 years specializing in Italian cuisine."',
    },
    {
      tip: 'The persona should match the output you want. Want a photo? Use a photographer. Want an illustration? Use an artist.',
      example: '"Act as a top-down food stylist shooting for a luxury restaurant menu."',
    },
  ],
  I: [
    {
      tip: 'State your intent with a strong action verb. "Render", "Illustrate", "Depict" beat "make" or "show".',
      example: '"Render a single round Italian oven-baked disc, photographed from directly above."',
    },
    {
      tip: 'Be specific about shape, structure, and category without using banned words.',
      example: '"Illustrate a circular, hand-stretched baked disc approximately 30cm wide with a puffy charred border."',
    },
  ],
  Z1: [
    {
      tip: 'Describe the toppings and textures without the banned words. Think ingredients, colors, temperatures.',
      example: '"Topped with bright red San Marzano tomato spread, white milky dairy blobs, and scattered emerald-green herb leaves."',
    },
    {
      tip: 'Add cooking method and physical context — what surface is it on? What does the base look like?',
      example: '"Baked in a wood-fired stone oven at 900°F, golden-brown undercarriage with leopard-spotted char marks."',
    },
  ],
  Z2: [
    {
      tip: 'Add style constraints. Tell the AI what NOT to do and what visual style you want.',
      example: '"Style: photorealistic, food-magazine quality. Do NOT include people, text, logos, or utensils."',
    },
    {
      tip: 'Be explicit about the visual tone and what to avoid to keep the AI on track.',
      example: '"Avoid cartoon styles. Tone: warm, rustic, appetizing. Shallow depth of field."',
    },
  ],
  A: [
    {
      tip: 'Tell the AI exactly what to output. One image? A description? How many words?',
      example: '"Return a single detailed visual description in 2 short paragraphs, under 120 words total."',
    },
    {
      tip: 'Longer, more structured prompts score better. Aim for 40+ words and specify the output format.',
      example: '"Output: one overhead photograph description, 2 paragraphs, ending with a one-line menu caption."',
    },
  ],
};

export function getCoachingTips(score: PizzaScore): CoachingTip[] {
  const results: CoachingTip[] = [];

  const checks: Array<{ key: keyof Omit<PizzaScore, 'total'>; letter: string; label: string }> = [
    { key: 'P', letter: 'P', label: 'Persona' },
    { key: 'I', letter: 'I', label: 'Intent' },
    { key: 'Z1', letter: 'Z1', label: 'Zones (Context)' },
    { key: 'Z2', letter: 'Z2', label: 'Zen (Constraints)' },
    { key: 'A', letter: 'A', label: 'Actions' },
  ];

  for (const c of checks) {
    if (score[c.key] <= 2) {
      const pool = TIPS[c.letter] ?? TIPS[c.key] ?? [];
      if (pool.length) {
        const tip = pool[Math.floor(Math.random() * pool.length)];
        results.push({
          letter: c.letter,
          label: c.label,
          tip: tip.tip,
          example: tip.example,
        });
      }
    }
  }

  return results;
}
