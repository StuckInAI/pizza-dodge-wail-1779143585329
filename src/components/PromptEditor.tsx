import { useCallback, useRef, useState } from 'react';
import { findBannedMatches, type BanMatch } from '@/lib/banned';
import styles from './PromptEditor.module.css';

type PromptEditorProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
};

/**
 * A rich prompt editor that overlays strikethrough highlights over banned words in real-time.
 * Uses a layered approach: a hidden textarea on top captures input, a div behind renders
 * highlighted HTML.
 */
export default function PromptEditor({ value, onChange, disabled, placeholder, rows = 8 }: PromptEditorProps) {
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const matches = findBannedMatches(value);

  // Build highlighted HTML from value + matches
  const buildHighlighted = useCallback((text: string, bans: BanMatch[]): string => {
    if (!text) return '<br/>';
    if (!bans.length) return escapeHtml(text).replace(/\n/g, '<br/>');

    // Sort and merge overlapping spans
    const sorted = [...bans].sort((a, b) => a.start - b.start);
    const merged: BanMatch[] = [];
    for (const b of sorted) {
      if (merged.length && b.start < merged[merged.length - 1].end) {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, b.end);
      } else {
        merged.push({ ...b });
      }
    }

    let result = '';
    let cursor = 0;
    for (const ban of merged) {
      if (ban.start > cursor) {
        result += escapeHtml(text.slice(cursor, ban.start)).replace(/\n/g, '<br/>');
      }
      result += `<mark class="bannedMark">${escapeHtml(text.slice(ban.start, ban.end))}</mark>`;
      cursor = ban.end;
    }
    if (cursor < text.length) {
      result += escapeHtml(text.slice(cursor)).replace(/\n/g, '<br/>');
    }
    return result || '<br/>';
  }, []);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const highlighted = buildHighlighted(value, matches);
  const hasBanned = matches.length > 0;

  return (
    <div className={`${styles.wrapper} ${focused ? styles.focused : ''} ${hasBanned ? styles.hasBanned : ''} ${disabled ? styles.disabled : ''}`}>
      {/* Highlight layer */}
      <div
        ref={highlightRef}
        className={styles.highlights}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      {/* Actual textarea — transparent text over highlights */}
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {hasBanned && (
        <div className={styles.bannerStrip}>
          🚫 banned word detected — keep typing, we\'ll cross it out
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
