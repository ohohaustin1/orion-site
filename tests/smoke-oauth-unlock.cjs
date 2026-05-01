/**
 * tests/smoke-oauth-unlock.cjs
 *
 * T-OAUTH-FOUNDATION-001 PR-1 frontend smoke.
 *
 * 驗證 Report.tsx 已:
 *   - 加入 OAuth 按鈕(Google + Facebook)
 *   - 加入 /api/auth/me page-load fetch
 *   - 移除 email-fill 解鎖邏輯
 *   - 移除 帳號登入 form
 *   - 移除 localStorage unlock-related calls(authToken 不算、那是 admin)
 *
 * 跑法:node tests/smoke-oauth-unlock.cjs
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const REPORT_TSX = path.join(__dirname, '..', 'src', 'pages', 'Report.tsx');
const tsx = fs.readFileSync(REPORT_TSX, 'utf8');

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

console.log('\n[smoke-oauth-unlock] OAuth UI presence');

check('handleOAuthLogin function defined', () => {
  assert.ok(/handleOAuthLogin\s*=\s*useCallback/.test(tsx),
    'handleOAuthLogin must be a useCallback');
});

check('Google button rendered with correct provider', () => {
  assert.ok(/handleOAuthLogin\(['"]google['"]\)/.test(tsx),
    'click handler must call handleOAuthLogin(\'google\')');
  assert.ok(/使用 Google 繼續/.test(tsx), 'button label "使用 Google 繼續" must be present');
});

check('Facebook button rendered with correct provider', () => {
  assert.ok(/handleOAuthLogin\(['"]facebook['"]\)/.test(tsx),
    'click handler must call handleOAuthLogin(\'facebook\')');
  assert.ok(/使用 Facebook 繼續/.test(tsx), 'button label "使用 Facebook 繼續" must be present');
});

check('OAuth click handler uses DIAG_URL (not API_BASE)', () => {
  // OAuth redirect 是 HTML page nav,不能走 Vercel proxy → DIAG_URL
  assert.ok(/window\.location\.href\s*=\s*`\$\{DIAG_URL\}\/auth\//.test(tsx),
    'must use DIAG_URL for OAuth redirect');
});

check('T-OAUTH-RETURN-URL-001:OAuth init uses ?state= (not ?return=)', () => {
  // state 是 OAuth 標準 cross-domain 機制(取代既有 ?return=)
  assert.ok(/\?state=\$\{returnUrl\}/.test(tsx),
    'OAuth init URL must use ?state= query param');
  assert.ok(!/\?return=\$\{returnUrl\}/.test(tsx),
    '?return= should be replaced with ?state=');
});

check('T-OAUTH-RETURN-URL-001:detects login_success/login_error on mount', () => {
  // useEffect must read URLSearchParams + detect login_success/error
  assert.ok(/login_success/.test(tsx) && /login_error/.test(tsx),
    'must detect both login_success + login_error query params');
  assert.ok(/oauth_failed|invalid_return_url/.test(tsx),
    'must handle specific error codes (oauth_failed / invalid_return_url)');
});

check('T-OAUTH-RETURN-URL-001:strips OAuth query params via replaceState', () => {
  // 防 refresh 重觸發、cleanup URL via window.history.replaceState
  assert.ok(/window\.history\.replaceState/.test(tsx),
    'must use window.history.replaceState to clean up OAuth callback params');
});

check('T-OAUTH-RETURN-URL-001:authError state + inline error UI', () => {
  assert.ok(/setAuthError/.test(tsx), 'authError state must exist');
  assert.ok(/authError\s*&&[\s\S]{0,200}unlock-error/.test(tsx),
    'authError inline error must render in unlock gate via .unlock-error class');
});

check('DIAG_URL imported from api-base', () => {
  assert.ok(/import\s*\{\s*[^}]*DIAG_URL[^}]*\}\s*from\s*['"]\.\.\/lib\/api-base['"]/.test(tsx),
    'DIAG_URL must be imported');
});

console.log('\n[smoke-oauth-unlock] /api/auth/me check');

check('mount-time auth check effect with credentials:include', () => {
  // 必須 fetch /api/auth/me 帶 credentials:include
  assert.ok(/fetch\([^)]*\/api\/auth\/me[^)]*\)/.test(tsx),
    'must fetch /api/auth/me');
  assert.ok(/credentials:\s*['"]include['"]/.test(tsx),
    'must include credentials for cross-origin cookie');
});

check('200 → setIsUnlocked(true) + setAuthUser', () => {
  // 鬆驗:有 setIsUnlocked(true) 在 fetch 回 ok 之後即可
  assert.ok(/res\.ok[\s\S]{0,300}setIsUnlocked\(true\)/.test(tsx),
    'on res.ok, must call setIsUnlocked(true)');
});

console.log('\n[smoke-oauth-unlock] removed legacy unlock UI');

check('handleEmailUnlock 函數 declaration 已移除', () => {
  // 只查 actual function 定義 + invocation,不算 comments / docstrings
  assert.ok(!/const\s+handleEmailUnlock\s*=/.test(tsx),
    'const handleEmailUnlock = ... must NOT exist');
  assert.ok(!/onSubmit=\{handleEmailUnlock\}/.test(tsx),
    'onSubmit={handleEmailUnlock} must NOT exist');
});

check('handleAccountLogin 函數 declaration 已移除', () => {
  assert.ok(!/const\s+handleAccountLogin\s*=/.test(tsx),
    'const handleAccountLogin = ... must NOT exist');
  assert.ok(!/onSubmit=\{handleAccountLogin\}/.test(tsx),
    'onSubmit={handleAccountLogin} must NOT exist');
});

check('email input + password input 已移除', () => {
  assert.ok(!/輸入您的電子郵件/.test(tsx),
    '"輸入您的電子郵件" placeholder must NOT exist');
  assert.ok(!/<input\s+type=['"]password['"]/.test(tsx),
    '<input type="password"> must NOT exist');
});

check('unlockEmail / unlockPassword state 已移除', () => {
  assert.ok(!/setUnlockEmail/.test(tsx),
    'setUnlockEmail must NOT be referenced');
  assert.ok(!/setUnlockPassword/.test(tsx),
    'setUnlockPassword must NOT be referenced');
});

check('unlock_<sid> localStorage 已移除', () => {
  // unlock-specific localStorage 必須拿掉
  assert.ok(!/localStorage\.setItem\(\s*[`'"]unlock_/.test(tsx),
    'localStorage.setItem(unlock_<sid>) must NOT exist (cookie replaces it)');
});

check('SSO disabled buttons 已移除(被真實 OAuth 取代)', () => {
  // 「即將推出」disabled SSO 按鈕應整段被移除
  assert.ok(!/即將推出/.test(tsx),
    '「即將推出」placeholder text must NOT exist');
  // .sso-button class 仍可在 CSS 內(死碼、CSS unused)、但 JSX 不該再用
  assert.ok(!/className=['"]sso-button['"]/.test(tsx),
    'sso-button JSX class must NOT be used');
});

console.log(`\n[smoke-oauth-unlock] ${pass} pass / ${fail} fail`);
process.exit(fail === 0 ? 0 : 1);
