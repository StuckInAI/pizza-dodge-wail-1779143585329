import type { GameSession } from '@/types';

const SESSION_PREFIX = 'ptp:session:';
const PLAYER_KEY = 'ptp:playerId';

export function saveSession(session: GameSession): void {
  try {
    localStorage.setItem(SESSION_PREFIX + session.code, JSON.stringify(session));
    // Broadcast change to other tabs
    localStorage.setItem('ptp:lastUpdate', String(Date.now()));
  } catch {
    // ignore
  }
}

export function loadSession(code: string): GameSession | null {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + code);
    if (!raw) return null;
    return JSON.parse(raw) as GameSession;
  } catch {
    return null;
  }
}

export function clearSession(code: string): void {
  try {
    localStorage.removeItem(SESSION_PREFIX + code);
  } catch {
    // ignore
  }
}

export function getPlayerId(): string | null {
  try {
    return localStorage.getItem(PLAYER_KEY);
  } catch {
    return null;
  }
}

export function setPlayerId(id: string): void {
  try {
    localStorage.setItem(PLAYER_KEY, id);
  } catch {
    // ignore
  }
}
