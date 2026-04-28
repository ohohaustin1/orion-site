/* TEMP — CN-CASE-EXPAND-FIX-001 verification
 * Block /api/public/cases → force fallback path (allCases hardcoded)
 * Click expand on each of 20 cases、confirm story sections render
 * Run against local vite preview on http://localhost:4173
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL_BASE = process.env.LOCAL_URL || 'http://localhost:4173';
const OUT = path.join(__dirname, '..', 'verify-screenshots', 'fallback');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.setRequestInterception(true);

  let blockedCount = 0;
  page.on('request', (req) => {
    const url = req.url();
    // 阻擋 zeabur API、模擬 CN client / 離線
    if (url.includes('orion-hub.zeabur.app/api/')) {
      blockedCount++;
      req.abort('failed');
    } else {
      req.continue();
    }
  });

  await page.goto(`${URL_BASE}/cases`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 5500)); // 等 4s timeout + 1.5s render

  const totalCards = await page.evaluate(() => document.querySelectorAll('.case-card-v2').length);
  console.log(`\n══ ${URL_BASE}/cases (zeabur API blocked) ══`);
  console.log(`cards rendered: ${totalCards} (expect 20)`);
  console.log(`zeabur API blocked: ${blockedCount} requests`);

  if (totalCards !== 20) {
    console.log('❌ expected 20 cards, abort');
    await browser.close();
    process.exit(2);
  }

  const results = [];
  for (let i = 0; i < 20; i++) {
    // 收合所有先（避免 cards 累積展開）
    await page.evaluate(() => {
      document.querySelectorAll('.case-card-v2').forEach(c => c.classList.remove('is-open'));
    });
    await new Promise(r => setTimeout(r, 100));

    // 點 i 個 card 的 summary
    const clicked = await page.evaluate((idx) => {
      const cards = document.querySelectorAll('.case-card-v2');
      const summary = cards[idx]?.querySelector('.case-card-summary');
      if (summary) { summary.click(); return true; }
      return false;
    }, i);

    if (!clicked) {
      console.log(`❌ card ${i + 1}: cannot click summary`);
      results.push({ idx: i, ok: false });
      continue;
    }
    await new Promise(r => setTimeout(r, 600));

    const dom = await page.evaluate((idx) => {
      const card = document.querySelectorAll('.case-card-v2')[idx];
      if (!card) return null;
      const isOpen = card.classList.contains('is-open');
      const company = card.querySelector('.company-name')?.textContent.trim() || '';
      const heroValues = Array.from(card.querySelectorAll('.metric-value')).map(el => el.textContent.trim());
      const hookText = card.querySelector('.hook-line')?.textContent.trim() || '';
      const stories = Array.from(card.querySelectorAll('.story-step')).map(s => ({
        label: s.querySelector('.story-step-label')?.textContent || '',
        contentLen: (s.querySelector('.story-step-content')?.textContent || '').length,
      }));
      const innerLen = card.querySelector('.case-expanded-inner')?.innerText?.length || 0;
      return { isOpen, company, heroValues, hookText, stories, innerLen };
    }, i);

    const hasHero = dom.heroValues.length >= 1 && dom.heroValues[0].length > 0;
    const hasHook = dom.hookText.length > 0;
    const has4Stories = dom.stories.length === 4 && dom.stories.every(s => s.contentLen > 5);
    const ok = dom.isOpen && hasHero && hasHook && has4Stories;

    console.log(`${ok ? '✅' : '❌'} ${(i + 1).toString().padStart(2)}. ${dom.company.slice(0, 30)} ` +
      `[hero:${hasHero ? '✓' : '✗'} hook:${hasHook ? '✓' : '✗'} stories:${dom.stories.length}/4 inner:${dom.innerLen}]`);
    if (!ok) {
      console.log(`   hero=${JSON.stringify(dom.heroValues)} hook="${dom.hookText.slice(0, 40)}" stories=${dom.stories.map(s => s.label + ':' + s.contentLen).join(', ')}`);
    }
    results.push({ idx: i, company: dom.company, ok });
  }

  // Screenshot the first card expanded for PR description
  await page.evaluate(() => {
    document.querySelectorAll('.case-card-v2').forEach(c => c.classList.remove('is-open'));
    document.querySelector('.case-card-v2 .case-card-summary')?.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUT, 'sample-fallback-expand.png'), fullPage: false });

  await browser.close();

  const passed = results.filter(r => r.ok).length;
  console.log(`\n══ PASS ${passed}/${results.length} ══`);
  if (passed !== results.length) {
    console.log('\nFailures:');
    results.filter(r => !r.ok).forEach(r => console.log(`  - card ${r.idx + 1}: ${r.company}`));
  }
  process.exit(passed === results.length ? 0 : 1);
})().catch((e) => { console.error('FATAL', e); process.exit(99); });
