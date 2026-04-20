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

const IN  = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png';
const OUT = 'C:/Users/user/Desktop/ORION/orion-site/public/brand/hero-clean.png';

const BG = { r: 10, g: 10, b: 10 };
const NEUTRAL_DELTA = 8;   // max |R-G|, |G-B|, |R-B| to count as "grey"
const LUM_MIN = 40;        // checkerboard squares darker than this are ignored
const LUM_MAX = 160;       // and lighter than this too (covers both square shades)

(async () => {
  const { data, info } = await sharp(IN).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`[clean] source: ${width}×${height} ch=${channels}`);

  const out = Buffer.from(data);
  let replaced = 0;

  for (let i = 0; i < out.length; i += channels) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const dRG = Math.abs(r - g);
    const dGB = Math.abs(g - b);
    const dRB = Math.abs(r - b);
    if (dRG <= NEUTRAL_DELTA && dGB <= NEUTRAL_DELTA && dRB <= NEUTRAL_DELTA) {
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      if (Y >= LUM_MIN && Y <= LUM_MAX) {
        out[i]     = BG.r;
        out[i + 1] = BG.g;
        out[i + 2] = BG.b;
        // channels 4 → keep alpha as-is (already 255)
        replaced++;
      }
    }
  }

  const total = (out.length / channels) | 0;
  console.log(`[clean] pixels=${total} replaced=${replaced} (${(replaced / total * 100).toFixed(1)}%)`);

  await sharp(out, { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toFile(OUT);
  console.log(`[clean] wrote: ${OUT}`);
})().catch((e) => { console.error(e); process.exit(1); });
