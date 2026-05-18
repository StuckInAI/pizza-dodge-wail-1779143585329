import type { PizzaScore } from '@/types';
import { normalize } from '@/lib/banned';

// Heuristic PIZZA-framework scorer based on keyword presence and structure.
// P = Persona: chef, baker, artist, vendor, etc.
// I = Intent: what visual / outcome they want
// Z = Zones: composition / placement / framing
// Z = Zen: tone / mood / style / constraints
// A = Actions: verbs like draw, render, generate, show

const PERSONA_KEYS = [
  'chef', 'baker', 'cook', 'artist', 'vendor', 'photographer', 'illustrator',
  'painter', 'designer', 'street food', 'italian', 'nonna', 'grandma',
  'as a', 'act as', 'imagine you are', 'youre a', "you're a", 'you are a', 'pretend',
];

const INTENT_KEYS = [
  'photo', 'image', 'picture', 'render', 'painting', 'illustration', 'photograph',
  'top down', 'top-down', 'overhead', 'closeup', 'close up', 'macro', 'shot',
  'circular', 'round', 'flat', 'baked', 'wood fired', 'wood-fired', 'oven',
  'melted', 'golden', 'crispy', 'bubbly', 'savory', 'savoury',
];

const ZONE_KEYS = [
  'center', 'centered', 'centre', 'background', 'foreground', 'on a', 'placed on',
  'wooden', 'board', 'plate', 'table', 'paper', 'box', 'tray', 'peel',
  'composition', 'layout', 'arrangement', 'edge', 'rim', 'middle', 'topped with',
];

const ZEN_KEYS = [
  'mood', 'cozy', 'rustic', 'warm', 'moody', 'cinematic', 'high contrast',
  'shallow depth', 'bokeh', 'film grain', 'dramatic lighting', 'soft light',
  'natural light', 'golden hour', 'minimalist', 'no text', 'no people',
  'realistic', 'photorealistic', 'detailed', 'high resolution', '4k', '8k',
  'style of', 'in the style', 'aesthetic',
];

const ACTION_KEYS = [
  'draw', 'generate', 'create', 'render', 'paint', 'illustrate', 'produce',
  'make', 'show', 'design', 'sketch', 'depict', 'imagine', 'compose',
];

function countHits(text: string, keys: string[]): number {
  const norm = ' ' + normalize(text) + ' ';
  let hits = 0;
  for (const k of keys) {
    const nk = normalize(k);
    if (!nk) continue;
    if (norm.includes(' ' + nk + ' ') || norm.includes(nk)) hits++;
  }
  return hits;
}

function scoreCategory(hits: number, lenBoost: number): number {
  // Each category scored 0-4
  let s = Math.min(4, hits);
  if (s < 4 && lenBoost > 0) s = Math.min(4, s + lenBoost);
  return s;
}

export function scorePrompt(prompt: string): PizzaScore {
  const len = prompt.trim().split(/\s+/).length;
  const lenBoost = len >= 25 ? 1 : 0;

  const P = scoreCategory(countHits(prompt, PERSONA_KEYS), 0);
  const I = scoreCategory(countHits(prompt, INTENT_KEYS), lenBoost);
  const Z1 = scoreCategory(countHits(prompt, ZONE_KEYS), 0);
  const Z2 = scoreCategory(countHits(prompt, ZEN_KEYS), 0);
  const A = scoreCategory(countHits(prompt, ACTION_KEYS), 0);

  const total = P + I + Z1 + Z2 + A;
  return { P, I, Z1, Z2, A, total };
}

export function passesThreshold(score: PizzaScore, dishKey: string): boolean {
  // Player passes if AI drew an actual pizza AND score is reasonable
  return dishKey === 'pizza' && score.total >= 8;
}

export function weakestLetter(score: PizzaScore): 'P' | 'I' | 'Z1' | 'Z2' | 'A' {
  const entries: Array<['P' | 'I' | 'Z1' | 'Z2' | 'A', number]> = [
    ['P', score.P],
    ['I', score.I],
    ['Z1', score.Z1],
    ['Z2', score.Z2],
    ['A', score.A],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0][0];
}

export const COACHING: Record<'P' | 'I' | 'Z1' | 'Z2' | 'A', string> = {
  P: "PERSONA is weak. Tell the AI WHO it is. e.g. 'You are an Italian street food photographer in Naples'. Personas anchor style.",
  I: "INTENT is fuzzy. Describe what you SEE without naming it. e.g. 'a round, flat, baked savory disc with melted toppings, golden bubbly surface, charred edges'.",
  Z1: "ZONES is missing. Tell the AI WHERE things are. e.g. 'centered on a rustic wooden board, top-down view, charred edges around the rim, toppings scattered in the middle'.",
  Z2: "ZEN is missing. Set the MOOD and CONSTRAINTS. e.g. 'cinematic lighting, shallow depth of field, no text, no people, photorealistic, rustic and warm aesthetic'.",
  A: "ACTIONS are missing. Use clear VERBS. e.g. 'Generate a photorealistic image...', 'Render...', 'Create a top-down photo of...'.",
};
