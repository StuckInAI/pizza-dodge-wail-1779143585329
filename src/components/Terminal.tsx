import type { ReactNode } from 'react';
import styles from './Terminal.module.css';

type TerminalProps = {
  title?: string;
  children: ReactNode;
};

export default function Terminal({ title = '~/prompt-the-pizza', children }: TerminalProps) {
  return (
    <div className={styles.terminal}>
      <div className={styles.bar}>
        <div className={`${styles.dot} ${styles.red}`} />
        <div className={`${styles.dot} ${styles.yellow}`} />
        <div className={`${styles.dot} ${styles.green}`} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
