/**
 * AI Configuration for connecting to an external image generation API.
 *
 * HOW TO CONNECT AN AI:
 * ─────────────────────
 * 1. Get an API key from one of the supported providers below.
 * 2. Set the values in your .env file (copy .env.example).
 * 3. Set VITE_AI_PROVIDER to 'openai', 'stability', or 'together'.
 * 4. The game will call the real API instead of generating SVGs locally.
 *
 * SUPPORTED PROVIDERS:
 * • OpenAI (DALL-E 3)     → https://platform.openai.com/api-keys
 * • Stability AI          → https://platform.stability.ai/account/keys
 * • Together AI           → https://api.together.xyz/settings/api-keys
 *   (use model: black-forest-labs/FLUX.1-schnell-Free — it's free)
 *
 * ENVIRONMENT VARIABLES (add to .env):
 * VITE_AI_PROVIDER=openai            # openai | stability | together | mock
 * VITE_AI_API_KEY=sk-...             # your API key
 * VITE_AI_MODEL=dall-e-3             # optional: override default model
 *
 * CORS NOTE:
 * Most AI image APIs do not allow direct browser → API calls (CORS).
 * For a real deployment you should proxy through a small backend or
 * Cloudflare Worker.  For local dev, Vite's proxy config below works.
 * See vite.config.ts for the /api-proxy route.
 *
 * MOCK MODE (default, no key needed):
 * When VITE_AI_PROVIDER is unset or 'mock', the game uses the built-in
 * SVG renderer — perfect for demos and local play.
 */

export type AIProvider = 'openai' | 'stability' | 'together' | 'mock';

export type AIConfig = {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl: string;
};

export function getAIConfig(): AIConfig {
  const provider = (import.meta.env.VITE_AI_PROVIDER ?? 'mock') as AIProvider;
  const apiKey = import.meta.env.VITE_AI_API_KEY ?? '';

  const defaults: Record<AIProvider, { model: string; baseUrl: string }> = {
    openai: {
      model: 'dall-e-3',
      baseUrl: '/ai-proxy/openai', // proxied through vite dev server
    },
    stability: {
      model: 'stable-diffusion-3-large',
      baseUrl: '/ai-proxy/stability',
    },
    together: {
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      baseUrl: '/ai-proxy/together',
    },
    mock: {
      model: 'mock',
      baseUrl: '',
    },
  };

  return {
    provider,
    apiKey,
    model: import.meta.env.VITE_AI_MODEL ?? defaults[provider]?.model ?? 'mock',
    baseUrl: defaults[provider]?.baseUrl ?? '',
  };
}

export function isAIConnected(): boolean {
  const cfg = getAIConfig();
  return cfg.provider !== 'mock' && cfg.apiKey.length > 0;
}
