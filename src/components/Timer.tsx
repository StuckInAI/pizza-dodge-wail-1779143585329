import { Timer as TimerIcon } from 'lucide-react';
import { useCountdown, formatMs } from '@/hooks/useCountdown';
import styles from './Timer.module.css';

type TimerProps = {
  endTime: number;
  onExpire?: () => void;
};

import { useEffect, useRef } from 'react';

export default function Timer({ endTime, onExpire }: TimerProps) {
  const { remainingMs, expired } = useCountdown(endTime);
  const firedRef = useRef(false);

  useEffect(() => {
    if (expired && !firedRef.current) {
      firedRef.current = true;
      onExpire?.();
    }
  }, [expired, onExpire]);

  const crit = remainingMs < 30_000;
  const warn = remainingMs < 60_000 && !crit;

  return (
    <div className={`${styles.timer} ${warn ? styles.warn : ''} ${crit ? styles.crit : ''}`}>
      <TimerIcon size={14} className={styles.icon} />
      <span className={styles.label}>time</span>
      <span className={styles.value}>{formatMs(remainingMs)}</span>
    </div>
  );
}
