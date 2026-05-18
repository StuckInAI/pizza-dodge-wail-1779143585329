import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false,
    // Proxy AI API calls to avoid CORS issues in local dev.
    // Uncomment and configure the block for your provider.
    //
    // proxy: {
    //   '/ai-proxy/openai': {
    //     target: 'https://api.openai.com',
    //     changeOrigin: true,
    //     rewrite: (p) => p.replace('/ai-proxy/openai', ''),
    //   },
    //   '/ai-proxy/together': {
    //     target: 'https://api.together.xyz',
    //     changeOrigin: true,
    //     rewrite: (p) => p.replace('/ai-proxy/together', ''),
    //   },
    //   '/ai-proxy/stability': {
    //     target: 'https://api.stability.ai',
    //     changeOrigin: true,
    //     rewrite: (p) => p.replace('/ai-proxy/stability', ''),
    //   },
    // },
  },
});
