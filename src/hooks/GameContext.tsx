import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { GameSession, Player, Attempt } from '@/types';
import { loadSession, saveSession, getPlayerId, setPlayerId } from '@/lib/storage';
import { generateCode, generatePlayerId } from '@/lib/code';

type GameContextValue = {
  myPlayerId: string;
  ensurePlayerId: () => string;
  createSession: (hostName: string) => GameSession;
  joinSession: (code: string, name: string) => GameSession | null;
  getSession: (code: string) => GameSession | null;
  submitAttempt: (code: string, playerId: string, attempt: Attempt) => void;
  endSession: (code: string) => void;
  refresh: () => void;
  refreshTick: number;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [refreshTick, setRefreshTick] = useState(0);
  const myIdRef = useRef<string>('');

  const ensurePlayerId = useCallback((): string => {
    if (myIdRef.current) return myIdRef.current;
    let id = getPlayerId();
    if (!id) {
      id = generatePlayerId();
      setPlayerId(id);
    }
    myIdRef.current = id;
    return id;
  }, []);

  useEffect(() => {
    ensurePlayerId();
  }, [ensurePlayerId]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handler = () => setRefreshTick((t) => t + 1);
    window.addEventListener('storage', handler);
    const interval = setInterval(handler, 1500); // light polling for same-tab fallback
    return () => {
      window.removeEventListener('storage', handler);
      clearInterval(interval);
    };
  }, []);

  const refresh = useCallback(() => setRefreshTick((t) => t + 1), []);

  const createSession = useCallback((hostName: string): GameSession => {
    const id = ensurePlayerId();
    const code = generateCode(5);
    const host: Player = {
      id,
      name: hostName || 'Host',
      isHost: true,
      attempts: [],
      passed: false,
      finished: false,
      joinedAt: Date.now(),
    };
    const session: GameSession = {
      code,
      hostId: id,
      startedAt: Date.now(),
      durationMs: 5 * 60 * 1000,
      players: { [id]: host },
      status: 'running',
    };
    saveSession(session);
    setRefreshTick((t) => t + 1);
    return session;
  }, [ensurePlayerId]);

  const joinSession = useCallback((code: string, name: string): GameSession | null => {
    const id = ensurePlayerId();
    const session = loadSession(code.toUpperCase());
    if (!session) return null;
    if (!session.players[id]) {
      session.players[id] = {
        id,
        name: name || 'Player',
        isHost: false,
        attempts: [],
        passed: false,
        finished: false,
        joinedAt: Date.now(),
      };
      saveSession(session);
    }
    setRefreshTick((t) => t + 1);
    return session;
  }, [ensurePlayerId]);

  const getSession = useCallback((code: string): GameSession | null => {
    return loadSession(code.toUpperCase());
  }, []);

  const submitAttempt = useCallback((code: string, playerId: string, attempt: Attempt): void => {
    const session = loadSession(code.toUpperCase());
    if (!session) return;
    const player = session.players[playerId];
    if (!player) return;
    player.attempts.push(attempt);
    if (attempt.passed) {
      player.passed = true;
      player.finished = true;
    } else if (player.attempts.length >= 3) {
      player.finished = true;
    }
    saveSession(session);
    setRefreshTick((t) => t + 1);
  }, []);

  const endSession = useCallback((code: string): void => {
    const session = loadSession(code.toUpperCase());
    if (!session) return;
    session.status = 'ended';
    saveSession(session);
    setRefreshTick((t) => t + 1);
  }, []);

  const value: GameContextValue = {
    myPlayerId: myIdRef.current,
    ensurePlayerId,
    createSession,
    joinSession,
    getSession,
    submitAttempt,
    endSession,
    refresh,
    refreshTick,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
