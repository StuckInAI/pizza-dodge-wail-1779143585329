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

export type PizzaScore = {
  P: number;
  I: number;
  Z1: number;
  Z2: number;
  A: number;
  total: number;
};

export type Attempt = {
  id: string;
  version: number;
  prompt: string;
  blocked: boolean;
  blockedWord?: string;
  passed: boolean;
  score?: PizzaScore;
  dish: DishKey;
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
  status: 'running' | 'ended';
};
