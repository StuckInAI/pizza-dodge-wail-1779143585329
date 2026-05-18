export type PizzaLetter = 'P' | 'I' | 'Z1' | 'Z2' | 'A';

export type PizzaScore = {
  P: number; // Persona
  I: number; // Intent
  Z1: number; // Zones
  Z2: number; // Zen (constraints / tone)
  A: number; // Actions
  total: number;
};

export type Attempt = {
  id: string;
  version: number; // 1, 2, 3
  prompt: string;
  blocked: boolean;
  blockedWord?: string;
  score?: PizzaScore;
  passed: boolean;
  coaching?: string;
  rendered: RenderedDish | null;
  createdAt: number;
};

export type Player = {
  id: string;
  name: string;
  isHost: boolean;
  attempts: Attempt[];
  passed: boolean;
  finished: boolean;
  joinedAt: number;
};

export type GameSession = {
  code: string;
  hostId: string;
  startedAt: number;
  durationMs: number;
  players: Record<string, Player>;
  status: 'lobby' | 'running' | 'ended';
};

export type RenderedDish = {
  label: string;
  description: string;
  svgKey: DishKey;
  mood: 'sad' | 'weird' | 'bizarre' | 'close' | 'win';
};

export type DishKey =
  | 'pizza'
  | 'sad-bread'
  | 'flying-saucer'
  | 'tomato-puddle'
  | 'cheesy-rock'
  | 'circle-of-shame'
  | 'salad'
  | 'mystery-meat'
  | 'soup'
  | 'taco'
  | 'pancake'
  | 'donut';
