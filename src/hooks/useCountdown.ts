import { useEffect, useState } from 'react';

export function useCountdown(endTime: number): { remainingMs: number; expired: boolean } {
  const compute = () => Math.max(0, endTime - Date.now());
  const [remainingMs, setRemainingMs] = useState<number>(compute());

  useEffect(() => {
    const tick = () => setRemainingMs(Math.max(0, endTime - Date.now()));
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endTime]);

  return { remainingMs, expired: remainingMs <= 0 };
}

export function formatMs(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
