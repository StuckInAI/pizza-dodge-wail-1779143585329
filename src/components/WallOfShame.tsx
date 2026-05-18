import type { GameSession } from '@/types';
import { Skull } from 'lucide-react';
import styles from './WallOfShame.module.css';

type WallOfShameProps = {
  session: GameSession;
  highlightPlayerId?: string;
};

export default function WallOfShame({ session, highlightPlayerId }: WallOfShameProps) {
  const players = Object.values(session.players).sort((a, b) => a.joinedAt - b.joinedAt);

  return (
    <div className={styles.wall}>
      <div className={styles.title}>
        <Skull size={14} /> Wall of Shame
      </div>
      {players.length === 0 ? (
        <div className={styles.empty}>// no players yet</div>
      ) : (
        players.map((p) => {
          const statusClass = p.passed ? styles.passed : p.finished ? styles.failed : styles.playing;
          const statusText = p.passed ? 'PASSED' : p.finished ? 'FAILED' : 'PLAYING';
          return (
            <div key={p.id} className={styles.player}>
              <div className={styles.playerHead}>
                <div>
                  <span className={styles.playerName}>
                    {p.name}
                    {p.id === highlightPlayerId ? ' (you)' : ''}
                  </span>
                  {p.isHost ? <span className={styles.host}>HOST</span> : null}
                </div>
                <span className={`${styles.status} ${statusClass}`}>{statusText}</span>
              </div>
              {p.attempts.length === 0 ? (
                <div className={styles.empty}>// no attempts yet</div>
              ) : (
                <div className={styles.attempts}>
                  {p.attempts.map((a) => (
                    <div
                      key={a.id}
                      className={`${styles.attempt} ${a.blocked ? styles.blocked : ''} ${a.passed ? styles.passed : ''}`}
                    >
                      <span className={styles.version}>v{a.version}</span>
                      <span className={styles.prompt}>{a.prompt || '(empty)'}</span>
                      {a.blocked ? (
                        <span className={styles.blockedTag}>BLOCKED:{a.blockedWord}</span>
                      ) : a.score ? (
                        <span className={styles.scoreTag}>{a.score.total}/20</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
