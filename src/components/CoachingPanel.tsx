import type { CoachingTip } from '@/lib/coaching';
import styles from './CoachingPanel.module.css';

type CoachingPanelProps = {
  tips: CoachingTip[];
  dishName?: string;
  attemptVersion?: number;
};

const LETTER_COLORS: Record<string, string> = {
  P: '#f97316',
  I: '#3b82f6',
  Z1: '#8b5cf6',
  Z2: '#ec4899',
  A: '#10b981',
};

const COMPLIMENTS = [
  '🔥 Spicy prompt, chef!',
  '💡 Your tokens are showing.',
  '🎯 Decent signal-to-noise ratio!',
  '⚡ Prompt energy: acceptable.',
  '🍕 The vibes are... circular.',
  '🤌 Chefs kiss for effort.',
  '🧠 Your embeddings are cooking.',
  '🚀 Vibe coding at its finest.',
  '📡 Signal received. Mostly.',
  '🎪 Bold. Chaotic. Instructive.',
];

const TEACH_TIPS = [
  '💬 Pro tip: More specific = more predictable outputs.',
  '🧱 Structure your prompt: WHO → WHAT → HOW → STYLE → OUTPUT.',
  '🎭 Personas unlock hidden model behaviors — try different roles.',
  '🔒 Constraints are your friend. Tell the model what NOT to do.',
  '📐 Format instructions reduce hallucination significantly.',
  '🌡️ Temperature of a prompt: vague = chaotic, specific = controlled.',
  '🧩 Chain of thought: break complex asks into clear steps.',
  '🔍 The model reads everything — every word matters.',
];

export default function CoachingPanel({ tips, dishName, attemptVersion }: CoachingPanelProps) {
  const seed = (attemptVersion ?? 0) + (dishName?.length ?? 0);
  const compliment = COMPLIMENTS[seed % COMPLIMENTS.length];
  const teachTip = TEACH_TIPS[(seed * 3 + 1) % TEACH_TIPS.length];

  return (
    <div className={styles.panel}>
      {dishName && (
        <div className={styles.nameBox}>
          <span className={styles.nameLabel}>// AI named your creation:</span>
          <span className={styles.dishName}>"{dishName}"</span>
        </div>
      )}

      <div className={styles.compliment}>{compliment}</div>

      {tips.length > 0 ? (
        <>
          <div className={styles.sectionTitle}>// PIZZA framework coaching</div>
          <div className={styles.tips}>
            {tips.map((t, i) => (
              <div key={i} className={styles.tip}>
                <div className={styles.tipHeader}>
                  <span
                    className={styles.letter}
                    style={{ color: LETTER_COLORS[t.letter] ?? 'var(--accent)' }}
                  >
                    [{t.letter}]
                  </span>
                  <span className={styles.label}>{t.label} — needs work</span>
                </div>
                <p className={styles.tipText}>{t.tip}</p>
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>e.g.</span>
                  <span className={styles.exampleText}>{t.example}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.allGood}>
          ✅ All PIZZA dimensions covered — refine the specifics!
        </div>
      )}

      <div className={styles.teachBlock}>
        <span className={styles.teachLabel}>// vibe coding lesson</span>
        <p className={styles.teachText}>{teachTip}</p>
      </div>
    </div>
  );
}
