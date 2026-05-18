/**
 * AI Image Generation Bridge
 * ──────────────────────────
 * Calls the configured AI provider to generate an image from a prompt.
 * Falls back gracefully to mock mode when no API key is set.
 *
 * Returns a URL string:
 *  - Real mode  → data:image/... or https://... returned by the API
 *  - Mock mode  → null (caller uses DishSVG component instead)
 */

import { getAIConfig, isAIConnected } from './aiConfig';

export type AIImageResult =
  | { type: 'url'; url: string }     // real image from provider
  | { type: 'mock' }                  // use SVG fallback
  | { type: 'error'; message: string };

/**
 * Generate an image for the given player prompt.
 * The prompt is passed verbatim — banned-word checks happen upstream.
 */
export async function generateAIImage(userPrompt: string): Promise<AIImageResult> {
  if (!isAIConnected()) {
    return { type: 'mock' };
  }

  const cfg = getAIConfig();

  try {
    switch (cfg.provider) {
      case 'openai':   return await callOpenAI(userPrompt, cfg.apiKey, cfg.model);
      case 'stability': return await callStability(userPrompt, cfg.apiKey, cfg.model);
      case 'together': return await callTogether(userPrompt, cfg.apiKey, cfg.model);
      default:         return { type: 'mock' };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[aiGenerate] error:', msg);
    return { type: 'error', message: msg };
  }
}

// ─── OpenAI DALL-E ───────────────────────────────────────────────────────────
async function callOpenAI(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<AIImageResult> {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const url: string = json?.data?.[0]?.url ?? '';
  if (!url) throw new Error('OpenAI returned no image URL');
  return { type: 'url', url };
}

// ─── Stability AI ────────────────────────────────────────────────────────────
async function callStability(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<AIImageResult> {
  const res = await fetch(
    `https://api.stability.ai/v2beta/stable-image/generate/core`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: (() => {
        const fd = new FormData();
        fd.append('prompt', prompt);
        fd.append('model', model);
        fd.append('output_format', 'webp');
        return fd;
      })(),
    },
  );

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Stability ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const b64: string = json?.image ?? '';
  if (!b64) throw new Error('Stability returned no image data');
  return { type: 'url', url: `data:image/webp;base64,${b64}` };
}

// ─── Together AI (FLUX) ──────────────────────────────────────────────────────
async function callTogether(
  prompt: string,
  apiKey: string,
  model: string,
): Promise<AIImageResult> {
  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      width: 1024,
      height: 1024,
      steps: 4,
      response_format: 'b64_json',
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Together ${res.status}: ${txt}`);
  }

  const json = await res.json();
  const b64: string = json?.data?.[0]?.b64_json ?? '';
  if (!b64) throw new Error('Together returned no image data');
  return { type: 'url', url: `data:image/png;base64,${b64}` };
}
