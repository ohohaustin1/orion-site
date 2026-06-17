import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const base = process.env.ORION_VERIFY_BASE || 'http://127.0.0.1:4180';
const routes = ['/home/', '/cases/', '/insights/', '/about/', '/team/', '/resources/'];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1 },
  { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
];
const garbled = /[�]|銝|嚗|瘙|蝟|鞈|撠|摰|憭|隤|雿|蝯|蝺|蝑|閬|頝/;
const outDir = path.resolve('audit', 'screenshots', 'orion01-redesign-2026-06-18');
fs.mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = [];
for (const viewport of viewports) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => pageErrors.push(err.message));

  for (const route of routes) {
    const url = `${base}${route}`;
    consoleErrors.length = 0;
    pageErrors.length = 0;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise((resolve) => setTimeout(resolve, 1800));
    const metrics = await page.evaluate((garbledSource) => {
      const re = new RegExp(garbledSource);
      const text = document.body.innerText || '';
      const videos = Array.from(document.querySelectorAll('video')).map((video) => ({
        src: video.currentSrc || video.getAttribute('src') || '',
        readyState: video.readyState,
        paused: video.paused,
        muted: video.muted,
        width: video.clientWidth,
        height: video.clientHeight,
      }));
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        videoCount: videos.length,
        videos,
        hasGarbled: re.test(text),
        bodyChars: text.length,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        ctaCount: document.querySelectorAll('a[href*="orion-hub.zeabur.app"], button.orion-primary-btn').length,
      };
    }, garbled.source);
    const slug = route.replaceAll('/', '') || 'root';
    const screenshot = path.join(outDir, `${viewport.name}-${slug}.png`);
    await page.screenshot({ path: screenshot, fullPage: viewport.name === 'desktop' });
    const sectionScreenshots = [];
    if (viewport.name === 'mobile' && route === '/home/') {
      const homeSections = [
        ['intro', '.site-section-intro'],
        ['workflow', '#tool-calling-workflow'],
        ['modules', '#modules'],
        ['method', '.site-method-section'],
        ['final-command', '.site-final-command'],
      ];
      for (const [name, selector] of homeSections) {
        await page.evaluate((sectionSelector) => {
          document.querySelector(sectionSelector)?.scrollIntoView({ block: 'start' });
        }, selector);
        await new Promise((resolve) => setTimeout(resolve, 700));
        const sectionScreenshot = path.join(outDir, `${viewport.name}-${slug}-${name}.png`);
        await page.screenshot({ path: sectionScreenshot, fullPage: false });
        sectionScreenshots.push(sectionScreenshot);
      }
    }
    results.push({
      viewport: viewport.name,
      route,
      url,
      screenshot,
      sectionScreenshots,
      consoleErrors: [...consoleErrors],
      pageErrors: [...pageErrors],
      ...metrics,
    });
  }
  await page.close();
}
await browser.close();

const summaryPath = path.resolve('audit', 'orion01-redesign-browser-verify-2026-06-18.json');
fs.mkdirSync(path.dirname(summaryPath), { recursive: true });
fs.writeFileSync(summaryPath, JSON.stringify(results, null, 2), 'utf8');

console.log(JSON.stringify(results.map((r) => ({
  viewport: r.viewport,
  route: r.route,
  h1: r.h1,
  videoCount: r.videoCount,
  readyVideos: r.videos.filter((v) => v.readyState >= 2).length,
  hasGarbled: r.hasGarbled,
  overflowX: r.overflowX,
  consoleErrors: r.consoleErrors.length,
  pageErrors: r.pageErrors.length,
  screenshot: r.screenshot,
})), null, 2));
console.log('summary:', summaryPath);
