#!/usr/bin/env node
/**
 * visual-verify.cjs — orion-site Cinematic v1 Puppeteer 驗收
 *
 * 8 個錨點 × 2 裝置 = 16 張截圖，證明 Chairman Phase 2-6 交付
 * 依賴：借用 orion-hub/node_modules/puppeteer（orion-site 無 puppeteer dep）
 */

const path = require('path');
const fs = require('fs');

const PUP_PATH = path.resolve(__dirname, '..', '..', 'orion-hub', 'node_modules', 'puppeteer');
const puppeteer = require(PUP_PATH);

// 走 /home 跳過 SplashScreen（App.tsx 的 skipSplash 白名單內）
const URL = process.env.VERIFY_URL || 'http://localhost:4173/home';
const OUT = path.resolve(__dirname, '..', 'verify-output');
fs.mkdirSync(OUT, { recursive: true });

const SECTIONS = [
  { id: 'hero',       selector: '.hero-v16',          waitMs: 1200 },
  { id: 'foursteps',  selector: '.co-steps-section',  waitMs: 1200 },
  { id: 'threelines', selector: '.tw-wrap',           waitMs: 2800 }, // 打字機
  { id: 'bento',      selector: '.co-bento',          waitMs: 1400 },
  { id: 'marquee',    selector: '.co-industries',     waitMs: 800  },
  { id: 'compare',    selector: '.co-compare',        waitMs: 1200 },
  { id: 'earth',      selector: '.co-earth-wrap',     waitMs: 2800 }, // Three.js canvas init
  { id: 'trust',      selector: '.co-trust',          waitMs: 2000 }, // 簽名動畫
  { id: 'cta',        selector: '.co-final-cta',      waitMs: 1000 },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900,  dpr: 1 },
  { name: 'mobile',  width: 375,  height: 812,  dpr: 2 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      // WebGL via SwiftShader 軟體渲染（headless 沙盒也能跑 Three.js）
      '--use-gl=swiftshader',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
    ],
  });

  const manifest = { url: URL, startedAt: new Date().toISOString(), shots: [], errors: [] };

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      page.setDefaultTimeout(20000);

      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
      page.on('requestfailed', (req) => pageErrors.push(`reqfail: ${req.url()} — ${req.failure()?.errorText}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text().slice(0, 300)}`);
      });

      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.dpr });
      console.log(`[${vp.name}] navigate ${URL}`);
      await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
      await sleep(1200); // let starfield + reactive mount

      for (const sec of SECTIONS) {
        try {
          await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }, sec.selector);
          await sleep(sec.waitMs);
          const file = path.join(OUT, `${sec.id}-${vp.name}.png`);
          await page.screenshot({ path: file, type: 'png', fullPage: false });
          const stat = fs.statSync(file);
          console.log(`  ✓ ${sec.id}-${vp.name}.png (${(stat.size / 1024).toFixed(1)} KB)`);
          manifest.shots.push({ id: sec.id, viewport: vp.name, file: path.relative(OUT, file), bytes: stat.size });
        } catch (err) {
          console.error(`  ✗ ${sec.id}-${vp.name} failed: ${err.message}`);
          manifest.errors.push({ section: sec.id, viewport: vp.name, error: String(err.message) });
        }
      }

      // Full page desktop only — full height 長圖
      if (vp.name === 'desktop') {
        try {
          await page.evaluate(() => window.scrollTo(0, 0));
          await sleep(600);
          const file = path.join(OUT, `fullpage-desktop.png`);
          await page.screenshot({ path: file, type: 'png', fullPage: true });
          const stat = fs.statSync(file);
          console.log(`  ✓ fullpage-desktop.png (${(stat.size / 1024).toFixed(1)} KB)`);
          manifest.shots.push({ id: 'fullpage', viewport: 'desktop', file: 'fullpage-desktop.png', bytes: stat.size });
        } catch (err) {
          console.error(`  ✗ fullpage failed: ${err.message}`);
          manifest.errors.push({ section: 'fullpage', viewport: 'desktop', error: String(err.message) });
        }
      }

      manifest[`${vp.name}_pageErrors`] = pageErrors;
      if (pageErrors.length > 0) {
        console.warn(`[${vp.name}] pageErrors (${pageErrors.length}):`);
        pageErrors.slice(0, 10).forEach((e) => console.warn('  ' + e));
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  manifest.endedAt = new Date().toISOString();
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nManifest: ${path.join(OUT, 'manifest.json')}`);
  console.log(`Shots: ${manifest.shots.length}, Errors: ${manifest.errors.length}`);
  if (manifest.shots.length === 0) process.exit(1);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
