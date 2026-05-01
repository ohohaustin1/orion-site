/**
 * tests/smoke-report-v2-render.js
 *
 * T-REPORT-RENDER-FIX-001 smoke check.
 *
 * Without React test infra (orion-site has no jest/vitest), we verify:
 *   1. Both fixtures load and have expected shapes
 *   2. Report.tsx contains every v2 render block (grep for unique markers)
 *   3. Report.tsx contains CSS classes for all new sections
 *   4. v1 fallback render blocks still present (no regression)
 *
 * Run: node tests/smoke-report-v2-render.js
 * Exit 0 = pass, exit 1 = fail.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const REPORT_TSX = path.join(__dirname, '..', 'src', 'pages', 'Report.tsx');
const V2_FIXTURE = path.join(__dirname, 'fixtures', 'v2-report-fullshape.json');
const V1_FIXTURE = path.join(__dirname, 'fixtures', 'v1-report-legacy.json');

let pass = 0;
let fail = 0;
function check(name, fn) {
  try {
    fn();
    pass++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    fail++;
    console.error(`  ✗ ${name}\n    ${err.message}`);
  }
}

console.log('\n[smoke] T-REPORT-RENDER-FIX-001 — fixture shape');

const v2 = JSON.parse(fs.readFileSync(V2_FIXTURE, 'utf8'));
const v1 = JSON.parse(fs.readFileSync(V1_FIXTURE, 'utf8'));
const tsx = fs.readFileSync(REPORT_TSX, 'utf8');

check('v2 fixture: has all 10 expected v2 keys', () => {
  const required = [
    'opening_line', 'diagnosis_level', 'current_state', 'future_state',
    'core_logic', 'three_steps', 'cost_of_inaction', 'roi_estimate',
    'o_letter', 'cta',
  ];
  for (const k of required) {
    assert.ok(k in v2, `v2 fixture missing key: ${k}`);
  }
});

check('v2 fixture: current_state has 5+ bullets', () => {
  assert.ok(Array.isArray(v2.current_state.bullets));
  assert.ok(v2.current_state.bullets.length >= 5,
    `expected >= 5 bullets, got ${v2.current_state.bullets.length}`);
});

check('v2 fixture: three_steps has 3 entries', () => {
  assert.equal(v2.three_steps.length, 3);
});

check('v2 fixture: contains industry-specific content (服飾電商 / Shopify)', () => {
  const blob = JSON.stringify(v2);
  assert.ok(/服飾電商|Shopify/.test(blob),
    'v2 fixture should mention industry specifics');
});

check('v1 fixture: has coreProblem (legacy shape)', () => {
  assert.ok(v1.coreProblem, 'v1 fixture should have coreProblem');
  assert.ok(v1.coreProblem.title, 'v1 coreProblem.title required');
});

console.log('\n[smoke] T-REPORT-RENDER-FIX-001 — Report.tsx render blocks');

// Each v2 section MUST be rendered (truthy guard + section markup)
const v2RenderMarkers = [
  // diagnosis_level — guarded by dx?.label
  { label: 'diagnosis_level guard',  marker: 'dx?.label && (' },
  { label: 'diagnosis_level icon',   marker: 'r-diagnosis-icon' },
  { label: 'diagnosis_level next',   marker: 'r-diagnosis-next' },
  // current_state
  { label: 'current_state section',  marker: 'csBullets.length > 0 && (' },
  { label: 'current_state title h2', marker: "cs?.title || '現在的你'" },
  // future_state
  { label: 'future_state section',   marker: 'fsBullets.length > 0 && (' },
  { label: 'future_state title h2',  marker: "fs?.title || '6 個月後的你'" },
  // core_logic
  { label: 'core_logic section',     marker: 'report?.core_logic && (' },
  { label: 'core_logic class',       marker: 'r-core-logic' },
  // three_steps
  { label: 'three_steps section',    marker: 'threeSteps.length > 0 && (' },
  // cost_of_inaction
  { label: 'cost_of_inaction guard', marker: 'showCoi && (' },
  { label: 'cost_of_inaction class', marker: 'r-coi-callout' },
  // roi_estimate
  { label: 'roi_estimate section',   marker: 'hasRoi && (' },
  { label: 'roi basis line',         marker: 'r-roi-basis' },
  // o_letter (replaces chairmanNote when present)
  { label: 'o_letter priority',      marker: 'oLetter || report?.chairmanNote' },
  { label: 'chairmanLabel toggle',   marker: "oLetter ? 'O 的話' : 'Chairman 親筆'" },
];
for (const { label, marker } of v2RenderMarkers) {
  check(`Report.tsx renders v2 ${label}`, () => {
    assert.ok(tsx.includes(marker),
      `marker not found: "${marker.slice(0, 60)}"`);
  });
}

console.log('\n[smoke] T-REPORT-RENDER-FIX-001 — CSS classes for v2');

const v2CssClasses = [
  '.r-diagnosis-badge',
  '.r-diagnosis-icon',
  '.r-diagnosis-label',
  '.r-diagnosis-next',
  '.r-state-closing',
  '.r-future-state',
  '.r-core-logic',
  '.r-coi-callout',
  '.r-roi-basis',
];
for (const cls of v2CssClasses) {
  check(`CSS defines ${cls}`, () => {
    assert.ok(tsx.includes(cls + ' {') || tsx.includes(cls + '{'),
      `CSS class definition not found: ${cls}`);
  });
}

console.log('\n[smoke] T-REPORT-RENDER-FIX-001 — v1 fallbacks preserved (no regression)');

const v1Markers = [
  { label: 'opportunities grid',     marker: 'opportunities.length > 0 && (' },
  { label: 'risks list',             marker: 'risks.length > 0 && (' },
  { label: 'path timeline',          marker: 'path.length > 0 && (' },
  { label: 'aiSolution fallback',    marker: 'opportunities.length === 0 && report?.aiSolution' },
  { label: 'firstAction fallback',   marker: 'path.length === 0 && report?.firstAction' },
  { label: 'painQuantification',     marker: 'report?.painQuantification && (' },
  { label: 'chairmanNote fallback',  marker: 'report?.chairmanNote' },
  { label: 'coreProblem fallback',   marker: 'report?.coreProblem?.title' },
];
for (const { label, marker } of v1Markers) {
  check(`v1 ${label} still present`, () => {
    assert.ok(tsx.includes(marker),
      `v1 marker missing (regression!): "${marker}"`);
  });
}

console.log('\n[smoke] T-REPORT-RENDER-FIX-001 — type safety guards');

check('cost_of_inaction.show:不能直接 React-render 物件', () => {
  // showCoi 必須 destructure 出 .content、不能直接 render coi 物件
  assert.ok(tsx.includes('coi.content'), 'must use coi.content for render');
  assert.ok(!/\{coi\}/.test(tsx) || tsx.includes('{coi.'),
    'never render bare {coi} object');
});

check('current_state coreInsight fallback uses .title not bare object', () => {
  // Must use report?.current_state?.title NOT report?.current_state
  // (bare object would cause "[object Object]" or React error #31)
  const m = tsx.match(/\|\| report\?\.current_state[^?.]/);
  assert.ok(!m || m[0].includes('?.title'),
    'must access .title sub-field, not bare object');
});

console.log(`\n[smoke] ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
