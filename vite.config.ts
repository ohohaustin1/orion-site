import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// @ts-ignore — no types shipped
import prerender from '@prerenderer/rollup-plugin';
// @ts-ignore — no types shipped
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';

const PRERENDER_ROUTES = [
  '/home',
  '/cases',
  '/insights',
  '/about',
  '/team',
  '/resources',
];

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: PRERENDER_ROUTES,
      renderer: new PuppeteerRenderer({
        renderAfterDocumentEvent: 'render-event',
        renderAfterTime: 4000, // 兜底：4 秒一定快照（Three.js / 字型不穩時用）
        maxConcurrentRoutes: 2,
        headless: true,
      }),
      postProcess(renderedRoute: any) {
        // 防止 prerender 後 script 阻塞 first paint
        renderedRoute.html = renderedRoute.html.replace(
          /<script (?!defer|async)([^>]*)>/g,
          '<script defer $1>'
        );
        return renderedRoute;
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'wouter'],
        },
      },
    },
  },
});
