import type { DishKey } from '@/types';

export type RenderedDish = {
  key: DishKey;
  caption: string;
};

type ScoreInput = {
  total: number;
  P: number;
  I: number;
  Z1: number;
  Z2: number;
  A: number;
};

/**
 * Given a PIZZA framework score, return which dish to render and a caption.
 * Higher totals get closer to an actual pizza; lower totals get absurd alternatives.
 */
export function dishForScore(score: ScoreInput): RenderedDish {
  const { total, P, I, Z1, Z2, A } = score;

  if (total >= 18) return { key: 'pizza', caption: 'A glorious pizza' };
  if (total >= 15) return { key: 'pizza', caption: 'Pretty good pizza' };

  if (total >= 12) {
    // mostly there, missing one dimension
    if (I <= 1) return { key: 'cheesy-rock', caption: 'Looks like pizza, tastes like rock' };
    if (P <= 1) return { key: 'flying-saucer', caption: 'A pizza from outer space' };
    return { key: 'pancake', caption: 'Pizza-adjacent pancake stack' };
  }

  if (total >= 9) {
    if (Z1 <= 1) return { key: 'tomato-puddle', caption: 'A puddle of sauce on a plate' };
    if (Z2 <= 1) return { key: 'mystery-meat', caption: 'Unidentified savory object' };
    if (A <= 1) return { key: 'sad-bread', caption: 'Just sad bread' };
    return { key: 'taco', caption: 'A taco, somehow' };
  }

  if (total >= 6) {
    if (A <= 1) return { key: 'soup', caption: 'Pizza soup. It is soup.' };
    if (P <= 1) return { key: 'donut', caption: 'A donut wearing a costume' };
    return { key: 'salad', caption: 'A salad. Where is the dough?' };
  }

  if (total >= 3) return { key: 'sad-bread', caption: 'Sad, lonely bread' };

  return { key: 'circle-of-shame', caption: 'The model refused to commit' };
}
