/**
 * CN-PROXY-VERCEL-EDGE-001 — Centralized API base URL with CN-aware routing
 *
 * 為何需要：
 *   CN 客戶直連 orion-hub.zeabur.app 不可達 / 慢（itdog 4.8s avg）
 *   走 Vercel Edge proxy（同網域 /api/proxy/*）讓 Vercel asia 節點做 server-to-server hop
 *
 * 兩種 export：
 *   API_BASE   — fetch 用、CN 走 /api/proxy、其他走直連 zeabur
 *   DIAG_URL   — 頁面跳轉用、永遠直連 zeabur（HTML page nav、proxy 不適用）
 *
 * Force-CN override（給 dev / Chairman 真機驗）：
 *   在 console 跑 `window.__force_cn = true; location.reload();`
 *   即可模擬 CN 客戶（強制走 proxy）
 */

const ZEABUR_DIRECT = 'https://orion-hub.zeabur.app';
const VERCEL_PROXY = '/api/proxy';

/**
 * 偵測使用者是否在中國大陸
 * 啟發式（free、zero-latency、imperfect）：
 *   - timezone：Asia/Shanghai / Urumqi / Chongqing / Harbin
 *   - browser language：zh-CN
 *   - manual override：window.__force_cn = true
 *
 * SSR-safe（typeof window check）
 */
export function detectIsCNClient(): boolean {
  if (typeof window === 'undefined') return false;

  // Manual override（dev / 真機驗用）
  // @ts-expect-error — runtime-only flag
  if (window.__force_cn === true) return true;

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const lang = (navigator.language || '').toLowerCase();
    if (/^Asia\/(Shanghai|Urumqi|Chongqing|Harbin)/.test(tz)) return true;
    if (lang === 'zh-cn') return true;
  } catch {
    /* ignore */
  }
  return false;
}

// 模組載入時 evaluate 一次（同 session 內保持一致）
const isCNClient = detectIsCNClient();

/**
 * API_BASE — fetch 呼叫用
 *
 * 🟢 RE-ENABLED 2026-04-28（後）：vercel.json 修對 + api/proxy.ts rename +
 *   rewrite path→query 後、Edge proxy live。
 *   CN 客戶 → /api/proxy（同網域、Vercel Edge → server-to-server → zeabur）
 *   其他 → https://orion-hub.zeabur.app（直連、無 regression）
 *
 * Force-CN override（dev / 真機驗）：
 *   window.__force_cn = true; location.reload();
 *
 * 也可用環境變數 VITE_API_BASE_URL 強制指定（CI / 測試）
 */
export const API_BASE: string =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ??
  (isCNClient ? VERCEL_PROXY : ZEABUR_DIRECT);

/**
 * DIAG_URL — 頁面跳轉到 capture chat（O 對話）
 * 即使 CN 客戶也直連 zeabur — proxy 不處理 HTML page navigation
 * （Day 2 解：完整 HTML page proxy 或 mirror、out of scope）
 */
export const DIAG_URL: string = ZEABUR_DIRECT;

/**
 * isCN — 給其他模組查、避免重複 detect
 */
export const isCN: boolean = isCNClient;

/**
 * apiUrl(path) — helper、自動接 path
 *   apiUrl('/api/public/cases') → 'https://orion-hub.zeabur.app/api/public/cases' (non-CN)
 *                                  '/api/proxy/api/public/cases'                 (CN)
 */
export function apiUrl(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return API_BASE + path;
}
