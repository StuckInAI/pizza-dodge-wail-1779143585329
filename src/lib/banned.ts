// Banned words and detection — must catch leetspeak, misspellings, repeats, punctuation tricks.
export const BANNED_WORDS: string[] = [
  'pizza',
  'pizzas',
  'pizzeria',
  'cheese',
  'cheesy',
  'mozzarella',
  'parmesan',
  'parmigiano',
  'crust',
  'crusty',
  'sauce',
  'saucy',
  'marinara',
  'tomato sauce',
  'dough',
  'doughy',
  'slice',
  'slices',
  'pepperoni',
  'margherita',
  'calzone',
  'focaccia',
  'flatbread',
  'neapolitan',
  'sicilian',
  'pie',
  'pies',
];

// Map common leetspeak / lookalikes to base letters
const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '!': 'i', '|': 'i',
  '3': 'e', '4': 'a', '@': 'a',
  '5': 's', '$': 's',
  '7': 't', '+': 't',
  '8': 'b', '9': 'g',
  '€': 'e', '£': 'l',
};

// Normalize: strip diacritics, lowercase, replace leetspeak, collapse repeated letters,
// remove non-letter chars.
export function normalize(input: string): string {
  if (!input) return '';
  let s = input.toLowerCase();
  // Strip diacritics
  s = s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  // Map leet chars
  s = s
    .split('')
    .map((ch) => LEET_MAP[ch] ?? ch)
    .join('');
  // Replace anything that isn't a-z with a space
  s = s.replace(/[^a-z]+/g, ' ');
  // Collapse 3+ repeated letters to 2 (piiiizza -> piizza)
  s = s.replace(/(.)\1{2,}/g, '$1$1');
  // And collapse any remaining double letters to single for fuzzy matching too
  return s;
}

function collapseDoubles(s: string): string {
  return s.replace(/(.)\1+/g, '$1');
}

// Simple Levenshtein for typos
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

export type BanCheck = { blocked: boolean; word?: string };

export function checkBanned(prompt: string): BanCheck {
  const normSpaced = normalize(prompt);
  const normCollapsed = collapseDoubles(normSpaced.replace(/\s+/g, ''));
  const normNoSpace = normSpaced.replace(/\s+/g, '');

  for (const raw of BANNED_WORDS) {
    const target = normalize(raw).replace(/\s+/g, '');
    if (!target) continue;
    const targetCollapsed = collapseDoubles(target);

    // Direct substring (with leet/punctuation already stripped)
    if (normNoSpace.includes(target)) return { blocked: true, word: raw };
    if (normCollapsed.includes(targetCollapsed)) return { blocked: true, word: raw };

    // Token-level fuzzy match for typos (only on longer words >= 5 chars)
    if (target.length >= 5) {
      const tokens = normSpaced.split(' ').filter(Boolean);
      const threshold = target.length <= 6 ? 1 : 2;
      for (const tok of tokens) {
        const tokCol = collapseDoubles(tok);
        if (Math.abs(tok.length - target.length) <= threshold) {
          if (levenshtein(tok, target) <= threshold) return { blocked: true, word: raw };
        }
        if (Math.abs(tokCol.length - targetCollapsed.length) <= threshold) {
          if (levenshtein(tokCol, targetCollapsed) <= threshold) return { blocked: true, word: raw };
        }
      }
    }
  }
  return { blocked: false };
}
