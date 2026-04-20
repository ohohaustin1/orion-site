/**
 * clean-hero-bg.cjs
 *
 * Problem: public/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png
 * was exported with the editor's transparency checkerboard BAKED INTO RGB
 * (alpha is 100% opaque everywhere, but grey squares painted on top).
 *
 * Solution: color-key. For pixels that look like neutral grey in the
 * checkerboard luminance range, replace RGB with #0a0a0a and lock alpha
 * to 255. Robot / rings / gold have coloured tints so they survive.
 *
 * Writes: public/brand/hero-clean.png (used by HeroSection instead of raw).
 */
const path = require('path');
const sharp = require(path.join('C:/Users/user/Desktop/ORION/orion-hub/node_modules/sharp'));

const IN      = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png';
const OUT_SOLID = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/hero-clean.png';
const OUT_ALPHA = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/hero-transparent.png';

const BG = { r: 10, g: 10, b: 10 };
const NEUTRAL_DELTA = 8;   // max |R-G|, |G-B|, |R-B| to count as "grey"
const LUM_MIN = 40;        // checkerboard squares darker than this are ignored
const LUM_MAX = 160;       // and lighter than this too (covers both square shades)

(async () => {
  const { data, info } = await sharp(IN).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`[clean] source: ${width}×${height} ch=${channels}`);

  // Two output buffers:
  //   solid:  checkerboard pixels RGB replaced with #0a0a0a, alpha stays 255
  //   alpha:  checkerboard pixels alpha set to 0 (real transparency for star overlays)
  const solid = Buffer.from(data);
  const alpha = Buffer.from(data);
  let replaced = 0;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dRG = Math.abs(r - g);
    const dGB = Math.abs(g - b);
    const dRB = Math.abs(r - b);
    if (dRG <= NEUTRAL_DELTA && dGB <= NEUTRAL_DELTA && dRB <= NEUTRAL_DELTA) {
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      if (Y >= LUM_MIN && Y <= LUM_MAX) {
        // solid variant
        solid[i]     = BG.r;
        solid[i + 1] = BG.g;
        solid[i + 2] = BG.b;
        // alpha variant — zero out alpha AND RGB so pre-multiplication doesn't tint
        alpha[i]     = 0;
        alpha[i + 1] = 0;
        alpha[i + 2] = 0;
        alpha[i + 3] = 0;
        replaced++;
      }
    }
  }

  const total = (data.length / channels) | 0;
  console.log(`[clean] pixels=${total} replaced=${replaced} (${(replaced / total * 100).toFixed(1)}%)`);

  await sharp(solid, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT_SOLID);
  console.log(`[clean] wrote (solid): ${OUT_SOLID}`);

  await sharp(alpha, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT_ALPHA);
  console.log(`[clean] wrote (alpha): ${OUT_ALPHA}`);
})().catch((e) => { console.error(e); process.exit(1); });
