/**
 * extract-stars-bg.cjs
 *
 * 嘗試 1：從 HERO3 抽乾淨星空 — 失敗（機器人腿部在底部左側，AI 環在右側）
 * 採用：用 sharp + SVG 程式化生成乾淨星空 bg（匹配 HERO3 配色）
 *
 * 產出：public/brand/starfield-bg.png（1600×1000）
 *   - #0a0a0a 底
 *   - 冷調藍紫 / 金色 / 紫色 3 個 radial nebula 漸層
 *   - 420 顆星點（35% 金 + 65% 白，隨機大小亮度）
 *   - 12 顆帶 halo 的大亮星
 *   - 邊緣微暗 vignette
 */

const path = require('path');
const sharp = require(path.join('C:/Users/user/Desktop/ORION/orion-hub/node_modules/sharp'));

const OUT = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/starfield-bg.png';
const W = 1600;
const H = 1000;

// Seeded RNG for deterministic output
let rng = 20260420;
const rand = () => {
  rng = (rng * 1103515245 + 12345) & 0x7fffffff;
  return rng / 0x7fffffff;
};

function bgSVG() {
  const stars = [];
  // 420 small stars
  for (let i = 0; i < 420; i++) {
    const gold = rand() < 0.35;
    const x = rand() * W;
    const y = rand() * H;
    const r = gold ? rand() * 1.4 + 0.6 : rand() * 1.0 + 0.3;
    const a = (rand() * 0.65 + 0.25).toFixed(2);
    const color = gold ? 'rgb(245,166,35)' : 'rgb(255,255,255)';
    stars.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${a}"/>`);
  }
  // 12 bright stars with halo
  for (let i = 0; i < 12; i++) {
    const gold = rand() < 0.5;
    const x = rand() * W;
    const y = rand() * H;
    const color = gold ? 'rgb(245,211,105)' : 'rgb(220,230,255)';
    stars.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.2" fill="${color}" opacity="0.9"/>`,
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.5" fill="${color}" opacity="0.14"/>`
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="n1" cx="22%" cy="35%" r="42%">
        <stop offset="0%"   stop-color="rgb(58,76,140)"  stop-opacity="0.32"/>
        <stop offset="55%"  stop-color="rgb(42,54,104)"  stop-opacity="0.14"/>
        <stop offset="100%" stop-color="rgb(42,54,104)"  stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n2" cx="80%" cy="28%" r="38%">
        <stop offset="0%"   stop-color="rgb(170,130,50)" stop-opacity="0.24"/>
        <stop offset="60%"  stop-color="rgb(140,100,40)" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="rgb(140,100,40)" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n3" cx="50%" cy="85%" r="50%">
        <stop offset="0%"   stop-color="rgb(100,60,130)" stop-opacity="0.20"/>
        <stop offset="65%"  stop-color="rgb(70,40,90)"   stop-opacity="0.08"/>
        <stop offset="100%" stop-color="rgb(70,40,90)"   stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stop-color="rgb(0,0,0)" stop-opacity="0"/>
        <stop offset="80%"  stop-color="rgb(0,0,0)" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="rgb(0,0,0)" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#n1)"/>
    <rect width="${W}" height="${H}" fill="url(#n2)"/>
    <rect width="${W}" height="${H}" fill="url(#n3)"/>
    ${stars.join('')}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  </svg>`;
}

(async () => {
  const svg = Buffer.from(bgSVG());

  await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } }
  })
    .composite([{ input: svg, blend: 'over' }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`[bg] wrote: ${OUT}  ${meta.width}×${meta.height}  ${meta.size || '-'} bytes`);
})().catch((e) => { console.error(e); process.exit(1); });
