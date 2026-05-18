import type { PizzaScore } from '@/types';
import styles from './ScoreCard.module.css';

type ScoreCardProps = {
  score: PizzaScore;
};

const CELLS: Array<{ key: keyof Omit<PizzaScore, 'total'>; letter: string; label: string }> = [
  { key: 'P', letter: 'P', label: 'Persona' },
  { key: 'I', letter: 'I', label: 'Intent' },
  { key: 'Z1', letter: 'Z', label: 'Zones' },
  { key: 'Z2', letter: 'Z', label: 'Zen' },
  { key: 'A', letter: 'A', label: 'Actions' },
];

export default function ScoreCard({ score }: ScoreCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>PIZZA Framework Score</span>
        <div className={styles.totalBox}>
          <span className={styles.total}>{score.total}</span>
          <span className={styles.totalMax}>/ 20</span>
        </div>
      </div>
      <div className={styles.grid}>
        {CELLS.map((c) => {
          const v = score[c.key];
          return (
            <div key={c.key} className={styles.cell}>
              <span className={styles.letter}>{c.letter}</span>
              <span className={styles.label}>{c.label}</span>
              <div className={styles.bars}>
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`${styles.bar} ${i <= v ? styles.on : ''}`} />
                ))}
              </div>
              <span className={styles.value}>{v}/4</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
