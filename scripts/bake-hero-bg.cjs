/**
 * bake-hero-bg.cjs — Hero v13 深度融合 composite
 *
 * 產出：public/brand/hero-composite-final.png (1920×1080)
 *
 * 分層（由底到頂）：
 *   1. #0a0a0a 黑底
 *   2. 星雲 radial-gradient 漸層（冷調藍紫 + 金色點綴，營造深空感）
 *   3. 星點（約 520 粒，35% 金色 + 65% 白色，隨機大小亮度）
 *   4. 機器人 hero-transparent.png（由 clean-hero-bg.cjs 預處理的 alpha=0 版）
 *      放在畫布中央偏下，寬度 1400px（留左右宇宙感）
 *   5. 金色徑向光暈（以機器人中心為原點，半徑 520，screen blend）
 *
 * Chairman 原文：「如果沒有銀河背景圖，用 canvas 粒子動態生成」
 * → 此腳本用 sharp + 程式生成 SVG 代替 canvas，一次烘出靜態 PNG。
 */

const path = require('path');
const sharp = require(path.join('C:/Users/user/Desktop/ORION/orion-hub/node_modules/sharp'));

const W = 1920;
const H = 1080;
const OUT = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/hero-composite-final.png';
const ROBOT_IN = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/hero-transparent.png';

// Robot placement in canvas
const ROBOT_W = 1400;
const ROBOT_CENTER_X = W / 2;
const ROBOT_CENTER_Y = Math.round(H * 0.52);  // slightly below center for pill breathing room

// Seeded pseudo-random so rebuilds are deterministic
let rng = 20260420;
const rand = () => {
  rng = (rng * 1103515245 + 12345) & 0x7fffffff;
  return rng / 0x7fffffff;
};

function nebulaSVG() {
  // Cool-toned galactic wash with warm gold accents — keeps edges soft by
  // using low-opacity large radial gradients
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="n1" cx="22%" cy="40%" r="42%">
        <stop offset="0%"   stop-color="rgb(58,76,140)"  stop-opacity="0.36"/>
        <stop offset="55%"  stop-color="rgb(42,54,104)"  stop-opacity="0.18"/>
        <stop offset="100%" stop-color="rgb(42,54,104)"  stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n2" cx="78%" cy="30%" r="36%">
        <stop offset="0%"   stop-color="rgb(170,130,50)" stop-opacity="0.28"/>
        <stop offset="55%"  stop-color="rgb(140,100,40)" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="rgb(140,100,40)" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n3" cx="50%" cy="82%" r="48%">
        <stop offset="0%"   stop-color="rgb(100,60,130)" stop-opacity="0.22"/>
        <stop offset="60%"  stop-color="rgb(70,40,90)"   stop-opacity="0.10"/>
        <stop offset="100%" stop-color="rgb(70,40,90)"   stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n4" cx="50%" cy="50%" r="65%">
        <stop offset="0%"   stop-color="rgb(10,10,10)"   stop-opacity="0"/>
        <stop offset="80%"  stop-color="rgb(10,10,10)"   stop-opacity="0.35"/>
        <stop offset="100%" stop-color="rgb(0,0,0)"      stop-opacity="0.7"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#n1)"/>
    <rect width="${W}" height="${H}" fill="url(#n2)"/>
    <rect width="${W}" height="${H}" fill="url(#n3)"/>
    <rect width="${W}" height="${H}" fill="url(#n4)"/>
  </svg>`;
}

function starsSVG() {
  const COUNT = 520;
  const circles = [];
  for (let i = 0; i < COUNT; i++) {
    const gold = rand() < 0.35;
    const x = rand() * W;
    const y = rand() * H;
    const r = gold ? rand() * 1.6 + 0.7 : rand() * 1.2 + 0.3;
    const a = (rand() * 0.7 + 0.3).toFixed(2);
    const color = gold ? 'rgb(245,166,35)' : 'rgb(255,255,255)';
    circles.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(2)}" fill="${color}" opacity="${a}"/>`
    );
  }
  // Add a handful of larger "bright" stars with soft glow
  for (let i = 0; i < 18; i++) {
    const gold = rand() < 0.45;
    const x = rand() * W;
    const y = rand() * H;
    const color = gold ? 'rgb(245,211,105)' : 'rgb(220,230,255)';
    circles.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.4" fill="${color}" opacity="0.9"/>`,
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${color}" opacity="0.12"/>`
    );
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${circles.join('')}</svg>`;
}

function goldGlowSVG(cx, cy, r) {
  // Soft gold halo anchored on the robot
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g1" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stop-color="rgb(197,160,89)" stop-opacity="0.20"/>
        <stop offset="45%"  stop-color="rgb(197,160,89)" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="rgb(197,160,89)" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#g1)"/>
  </svg>`;
}

(async () => {
  // Prep robot — resize to ROBOT_W preserving aspect, output alpha-correct PNG buffer
  const robotMeta = await sharp(ROBOT_IN).metadata();
  const robotH = Math.round(robotMeta.height * (ROBOT_W / robotMeta.width));
  const robotLeft = Math.round(ROBOT_CENTER_X - ROBOT_W / 2);
  const robotTop = Math.round(ROBOT_CENTER_Y - robotH / 2);
  console.log(`[bake] robot src=${robotMeta.width}×${robotMeta.height} → placed ${ROBOT_W}×${robotH} at (${robotLeft}, ${robotTop})`);

  const robotBuf = await sharp(ROBOT_IN)
    .resize(ROBOT_W, robotH, { fit: 'fill' })
    .png()
    .toBuffer();

  // Base canvas + layers
  const composite = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 10, g: 10, b: 10, alpha: 1 } }
  })
    .composite([
      { input: Buffer.from(nebulaSVG()),  blend: 'over' },
      { input: Buffer.from(starsSVG()),   blend: 'over' },
      { input: robotBuf, top: robotTop, left: robotLeft, blend: 'over' },
      { input: Buffer.from(goldGlowSVG(ROBOT_CENTER_X, ROBOT_CENTER_Y, 520)), blend: 'screen' },
    ])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(OUT);

  console.log(`[bake] wrote: ${OUT}  ${composite.width}×${composite.height}  ${composite.size} bytes`);
})().catch((e) => { console.error(e); process.exit(1); });
