/**
 * AIImageDisplay — shows either a real AI-generated image (URL)
 * or falls back to the DishSVG component.
 */
import DishSVG from './DishSVG';
import type { DishKey } from '@/types';
import styles from './AIImageDisplay.module.css';

type Props = {
  imageUrl?: string | null;
  dishKey: DishKey;
  caption?: string;
  loading?: boolean;
  error?: string | null;
};

export default function AIImageDisplay({ imageUrl, dishKey, caption, loading, error }: Props) {
  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loading}>
          <span className={styles.spinner} />
          <span>Generating image…</span>
        </div>
        {caption && <div className={styles.label}>{caption}</div>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>⚠</span>
          <span>AI error — showing mock</span>
          <span className={styles.errorMsg}>{error}</span>
        </div>
        <DishSVG dishKey={dishKey} caption={caption} />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className={styles.wrap}>
        <div className={styles.imageWrap}>
          <img
            src={imageUrl}
            alt={caption ?? 'AI generated dish'}
            className={styles.image}
          />
          <div className={styles.badge}>AI Generated</div>
        </div>
        {caption && <div className={styles.label}>{caption}</div>}
      </div>
    );
  }

  return <DishSVG dishKey={dishKey} caption={caption} />;
}
