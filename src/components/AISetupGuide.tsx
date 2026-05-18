/**
 * AISetupGuide — shows in the sidebar/panel to explain how to connect AI.
 * Visible only in mock mode.
 */
import { useState } from 'react';
import { isAIConnected, getAIConfig } from '@/lib/aiConfig';
import styles from './AISetupGuide.module.css';

export default function AISetupGuide() {
  const [open, setOpen] = useState(false);
  const connected = isAIConnected();
  const cfg = getAIConfig();

  if (connected) {
    return (
      <div className={styles.badge} data-connected="true">
        <span className={styles.dot} />
        AI connected · {cfg.provider} / {cfg.model}
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <button className={styles.toggle} onClick={() => setOpen((o) => !o)}>
        <span className={styles.dot} />
        AI: mock mode{open ? ' ▲' : ' ▼'}
      </button>

      {open && (
        <div className={styles.panel}>
          <h4 className={styles.heading}>// How to connect a real AI</h4>

          <p className={styles.para}>
            Right now the game uses a built-in SVG renderer (mock mode).
            To get <em>actual AI-generated images</em>, pick a provider and
            add your key to <code>.env</code>.
          </p>

          <div className={styles.section}>
            <span className={styles.label}>OPTION A — Together AI (free tier)</span>
            <p className={styles.para}>
              Sign up at{' '}
              <a href="https://api.together.xyz" target="_blank" rel="noreferrer" className={styles.link}>
                api.together.xyz
              </a>
              , grab an API key, then add to <code>.env</code>:
            </p>
            <pre className={styles.code}>
{`VITE_AI_PROVIDER=together
VITE_AI_API_KEY=your_together_key
# Model is set automatically to FLUX.1-schnell-Free`}
            </pre>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>OPTION B — OpenAI DALL-E 3</span>
            <pre className={styles.code}>
{`VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=sk-...
VITE_AI_MODEL=dall-e-3`}
            </pre>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>OPTION C — Stability AI</span>
            <pre className={styles.code}>
{`VITE_AI_PROVIDER=stability
VITE_AI_API_KEY=sk-...
VITE_AI_MODEL=stable-diffusion-3-large`}
            </pre>
          </div>

          <div className={styles.section}>
            <span className={styles.label}>⚠ CORS note</span>
            <p className={styles.para}>
              Browser → AI APIs requires a CORS-friendly proxy for production.
              For local dev, add this to <code>vite.config.ts</code>:
            </p>
            <pre className={styles.code}>
{`server: {
  proxy: {
    '/ai-proxy/openai': {
      target: 'https://api.openai.com',
      changeOrigin: true,
      rewrite: (p) => p.replace('/ai-proxy/openai', ''),
    },
    '/ai-proxy/together': {
      target: 'https://api.together.xyz',
      changeOrigin: true,
      rewrite: (p) => p.replace('/ai-proxy/together', ''),
    },
  }
}`}
            </pre>
          </div>

          <p className={styles.para} style={{ marginTop: 8 }}>
            After editing <code>.env</code>, restart <code>vite</code> and
            refresh — the status badge above will turn green.
          </p>
        </div>
      )}
    </div>
  );
}
