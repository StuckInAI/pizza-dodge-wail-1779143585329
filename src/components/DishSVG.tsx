import type { DishKey } from '@/types';
import styles from './DishSVG.module.css';

type DishSVGProps = {
  dishKey: DishKey;
  caption?: string;
};

export default function DishSVG({ dishKey, caption }: DishSVGProps) {
  return (
    <div className={styles.wrap}>
      {renderSvg(dishKey)}
      {caption ? <div className={styles.label}>{caption}</div> : null}
    </div>
  );
}

function renderSvg(key: DishKey) {
  switch (key) {
    case 'pizza':
      return (
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="#d4a574" />
          <circle cx="100" cy="100" r="78" fill="#e85d3a" />
          <circle cx="100" cy="100" r="78" fill="url(#charPat)" opacity="0.4" />
          {/* Cheese blobs */}
          <ellipse cx="70" cy="80" rx="14" ry="10" fill="#fff4d6" />
          <ellipse cx="120" cy="75" rx="12" ry="9" fill="#fff4d6" />
          <ellipse cx="95" cy="115" rx="16" ry="11" fill="#fff4d6" />
          <ellipse cx="135" cy="125" rx="11" ry="8" fill="#fff4d6" />
          <ellipse cx="60" cy="125" rx="10" ry="7" fill="#fff4d6" />
          {/* Basil */}
          <ellipse cx="85" cy="95" rx="5" ry="8" fill="#3a7c2e" transform="rotate(-30 85 95)" />
          <ellipse cx="125" cy="100" rx="5" ry="8" fill="#3a7c2e" transform="rotate(45 125 100)" />
          <ellipse cx="100" cy="140" rx="5" ry="8" fill="#3a7c2e" />
          {/* Char spots */}
          <circle cx="50" cy="60" r="5" fill="#3a2418" opacity="0.6" />
          <circle cx="155" cy="110" r="4" fill="#3a2418" opacity="0.6" />
          <circle cx="75" cy="160" r="5" fill="#3a2418" opacity="0.6" />
          <defs>
            <pattern id="charPat" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="3" cy="4" r="1" fill="#3a2418" />
              <circle cx="14" cy="12" r="1.5" fill="#3a2418" />
            </pattern>
          </defs>
        </svg>
      );
    case 'sad-bread':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="110" rx="80" ry="55" fill="#caa470" />
          <ellipse cx="100" cy="105" rx="70" ry="48" fill="#d8b885" />
          <circle cx="80" cy="100" r="3" fill="#3a2418" />
          <circle cx="120" cy="100" r="3" fill="#3a2418" />
          <path d="M 85 120 Q 100 110 115 120" stroke="#3a2418" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'flying-saucer':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="110" rx="75" ry="22" fill="#888" />
          <ellipse cx="100" cy="95" rx="45" ry="25" fill="#aaa" />
          <circle cx="100" cy="90" r="15" fill="#5ec27a" opacity="0.7" />
          <circle cx="75" cy="115" r="3" fill="#ffd23f" />
          <circle cx="100" cy="118" r="3" fill="#ffd23f" />
          <circle cx="125" cy="115" r="3" fill="#ffd23f" />
          <path d="M 60 130 L 50 160 M 100 135 L 100 165 M 140 130 L 150 160" stroke="#5ec27a" strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case 'tomato-puddle':
      return (
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="85" fill="#f0e8d8" />
          <path d="M 60 100 Q 70 70 100 75 Q 140 80 145 110 Q 140 140 100 138 Q 65 135 60 100 Z" fill="#c0392b" />
          <ellipse cx="95" cy="105" rx="30" ry="15" fill="#e74c3c" opacity="0.6" />
          <circle cx="120" cy="95" r="3" fill="#fff" opacity="0.5" />
        </svg>
      );
    case 'cheesy-rock':
      return (
        <svg viewBox="0 0 200 200">
          <polygon points="60,140 50,90 80,60 130,55 160,90 150,140 110,160" fill="#888" />
          <polygon points="60,140 50,90 80,60 130,55 160,90 150,140 110,160" fill="#ffd23f" opacity="0.4" />
          <ellipse cx="90" cy="95" rx="8" ry="4" fill="#fff4d6" />
          <ellipse cx="130" cy="110" rx="6" ry="3" fill="#fff4d6" />
          <ellipse cx="110" cy="125" rx="10" ry="4" fill="#fff4d6" />
        </svg>
      );
    case 'circle-of-shame':
      return (
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="70" fill="none" stroke="#666" strokeWidth="3" strokeDasharray="6 4" />
          <text x="100" y="105" textAnchor="middle" fill="#666" fontSize="14" fontFamily="monospace">?</text>
          <text x="100" y="125" textAnchor="middle" fill="#444" fontSize="8" fontFamily="monospace">food.exe</text>
        </svg>
      );
    case 'salad':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="120" rx="75" ry="40" fill="#eee" />
          <ellipse cx="80" cy="110" rx="20" ry="15" fill="#5ec27a" />
          <ellipse cx="115" cy="105" rx="22" ry="17" fill="#4aa363" />
          <ellipse cx="100" cy="125" rx="18" ry="13" fill="#6dd48a" />
          <circle cx="90" cy="100" r="4" fill="#e74c3c" />
          <circle cx="130" cy="115" r="4" fill="#e74c3c" />
          <circle cx="75" cy="125" r="3" fill="#f39c12" />
        </svg>
      );
    case 'mystery-meat':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="115" rx="70" ry="35" fill="#5a3a28" />
          <ellipse cx="95" cy="105" rx="55" ry="22" fill="#7a4e36" />
          <ellipse cx="85" cy="100" rx="10" ry="5" fill="#8d5a40" />
          <ellipse cx="120" cy="110" rx="8" ry="4" fill="#8d5a40" />
        </svg>
      );
    case 'soup':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="160" rx="80" ry="15" fill="#444" />
          <path d="M 25 100 Q 30 160 100 165 Q 170 160 175 100 Z" fill="#ddd" />
          <ellipse cx="100" cy="100" rx="70" ry="12" fill="#c97c4a" />
          <circle cx="85" cy="95" r="3" fill="#5ec27a" />
          <circle cx="115" cy="97" r="3" fill="#e74c3c" />
          <circle cx="100" cy="102" r="2" fill="#fff" opacity="0.7" />
        </svg>
      );
    case 'taco':
      return (
        <svg viewBox="0 0 200 200">
          <path d="M 30 70 Q 100 30 170 70 L 170 140 Q 100 100 30 140 Z" fill="#e8b86c" />
          <path d="M 30 70 Q 100 100 170 70" fill="none" stroke="#caa055" strokeWidth="2" />
          <ellipse cx="100" cy="95" rx="35" ry="8" fill="#5a3a28" />
          <ellipse cx="90" cy="100" rx="15" ry="5" fill="#5ec27a" />
          <ellipse cx="115" cy="102" rx="10" ry="4" fill="#e74c3c" />
        </svg>
      );
    case 'pancake':
      return (
        <svg viewBox="0 0 200 200">
          <ellipse cx="100" cy="140" rx="70" ry="15" fill="#caa470" />
          <ellipse cx="100" cy="125" rx="72" ry="15" fill="#d8b885" />
          <ellipse cx="100" cy="110" rx="70" ry="15" fill="#caa470" />
          <ellipse cx="100" cy="95" rx="68" ry="15" fill="#d8b885" />
          <path d="M 50 95 Q 70 75 100 80 Q 130 85 150 95" fill="#ffd23f" opacity="0.8" />
          <ellipse cx="100" cy="80" rx="10" ry="4" fill="#f0c020" />
        </svg>
      );
    case 'donut':
      return (
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="75" fill="#d8a070" />
          <circle cx="100" cy="100" r="75" fill="#e85d3a" opacity="0.7" />
          <circle cx="100" cy="100" r="25" fill="#1a1a1a" />
          <circle cx="75" cy="75" r="3" fill="#ffd23f" />
          <circle cx="130" cy="85" r="3" fill="#5ec27a" />
          <circle cx="125" cy="130" r="3" fill="#fff" />
          <circle cx="75" cy="125" r="3" fill="#3b82f6" />
        </svg>
      );
    default:
      return null;
  }
}
