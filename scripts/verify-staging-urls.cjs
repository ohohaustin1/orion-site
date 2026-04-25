/**
 * scripts/verify-staging-urls.js — T7 staging URL E2E 自驗
 *
 * 真瀏覽器跑、繞 Vercel Security Checkpoint、對 6 個 fixture URL 檢查：
 *   - 沒有 React NotFound 元件
 *   - 有 PREVIEW banner
 *   - 有 Hero / 報告內容（h1 / .r-hero-title 之類）
 *
 * Usage:
 *   node scripts/verify-staging-urls.js                    # 對 prod
 *   node scripts/verify-staging-urls.js http://localhost:5173 # 對 local vite preview
 */
const puppeteer = require('puppeteer');

const BASE = process.argv[2] || 'https://orion01.com';
const TEMPLATES = [
  'sample-restaurant',
  'sample-ecommerce',
  'sample-manufacture',
  'sample-medical',
  'edge-case-empty',
  'edge-case-full',
];

const TIMEOUT_NAV = 120000; // 2 min nav
const MAX_WAIT_MS = 60000;  // 給 Vercel security challenge 最多 60 秒解
const POLL_MS = 1500;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  // 隱藏 webdriver flag、降低 Vercel bot 偵測
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  });

  // poll 直到頁面離開 Vercel Security Checkpoint
  async function waitPastChallenge(p) {
    const start = Date.now();
    while (Date.now() - start < MAX_WAIT_MS) {
      const t = await p.title().catch(() => '');
      if (t && !/vercel|checkpoint|security/i.test(t)) return true;
      await new Promise(r => setTimeout(r, POLL_MS));
    }
    return false;
  }

  const results = [];

  for (const tpl of TEMPLATES) {
    const url = `${BASE}/report/preview/${tpl}`;
    let result = { url, status: 0, has404: null, hasBanner: null, hasHero: null, hasReport: null, title: '', error: null };
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: TIMEOUT_NAV });
      result.status = resp ? resp.status() : 0;
      // 等過 Vercel Security Checkpoint（自動 reload 多次）
      const cleared = await waitPastChallenge(page);
      result.passedChallenge = cleared;
      // React mount + Helmet 完成
      await new Promise(r => setTimeout(r, 3000));

      const dom = await page.evaluate(() => ({
        title: document.title || '',
        // NotFound：可能含 'Page Not Found' / '找不到' / 'Back to' 等
        bodyText: document.body ? document.body.innerText.slice(0, 1500) : '',
        previewBanner: !!document.querySelector('.preview-banner'),
        previewBannerText: document.querySelector('.preview-banner') ? document.querySelector('.preview-banner').innerText : '',
        heroTitle: document.querySelector('.r-hero-title') ? document.querySelector('.r-hero-title').innerText : '',
        sectionsCount: document.querySelectorAll('.r-section').length,
        oppCount: document.querySelectorAll('.r-opp-card').length,
        timelineCount: document.querySelectorAll('.r-timeline-row').length,
        chairmanBlock: !!document.querySelector('.r-chairman'),
        rootHasContent: !!document.querySelector('#root *'),
      }));

      result.title = dom.title;
      result.has404 = /Page Not Found|找不到|404|NotFound|back to/i.test(dom.bodyText) && !dom.previewBanner;
      result.hasBanner = dom.previewBanner;
      result.hasHero = !!dom.heroTitle;
      result.hasReport = dom.oppCount > 0 || dom.timelineCount > 0 || dom.chairmanBlock;
      result.dom = dom;
    } catch (e) {
      result.error = e.message;
    }
    results.push(result);

    const ok = !result.has404 && result.hasBanner && result.hasHero && result.hasReport;
    const flag = ok ? '✅' : '❌';
    console.log(`${flag} ${tpl}`);
    console.log(`     status=${result.status}  banner=${result.hasBanner ? '✅' : '❌'}  hero=${result.hasHero ? '✅' : '❌'}  report=${result.hasReport ? '✅' : '❌'}  has404=${result.has404 ? '❌404' : '✅'}`);
    if (result.dom) {
      console.log(`     title: ${result.dom.title}`);
      if (result.dom.heroTitle) console.log(`     hero:  ${result.dom.heroTitle}`);
      console.log(`     opps=${result.dom.oppCount}  timeline=${result.dom.timelineCount}  chairman=${result.dom.chairmanBlock}`);
      if (!ok) console.log(`     bodyText preview: ${result.dom.bodyText.slice(0, 200).replace(/\n+/g, ' ')}`);
    }
    if (result.error) console.log(`     ERROR: ${result.error}`);
  }

  await browser.close();

  const passed = results.filter(r => !r.has404 && r.hasBanner && r.hasHero && r.hasReport).length;
  console.log(`\n──────────────────────`);
  console.log(`PASS ${passed}/${results.length}`);
  process.exit(passed === results.length ? 0 : 1);
})().catch(e => { console.error('FATAL', e); process.exit(99); });
