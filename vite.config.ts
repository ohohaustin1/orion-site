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
  '/privacy',
  '/terms',
];

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: PRERENDER_ROUTES,
      renderer: new PuppeteerRenderer({
        renderAfterTime: 4500, // 給 React + Helmet + 字型 4.5 秒 settle
        maxConcurrentRoutes: 1, // 序列跑、避免 Helmet 全域 state race
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
    sourcemap: false, // TD-007: dist 進 git、不產 .map 省 ~18MB
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'wouter'],
        },
      },
    },
  },
});
