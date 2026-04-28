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
 * 🚨 ROLLBACK 2026-04-28：Vercel Edge function 部署後一直 404（PR #2 #3 #4 #5
 * 都試過 vercel.json routes / rewrites / functions config、Vercel 都不 dispatch
 * 到 api/ folder）。為避免 CN 客戶 hit /api/proxy/* 拿到 404（比直連 zeabur
 * 慢更糟）、暫時 force 直連 zeabur。等 Chairman check Vercel dashboard 找出
 * 為何 api/ 沒被 detect、再恢復條件路由。
 *
 * 原邏輯（待恢復）：
 *   isCNClient ? VERCEL_PROXY : ZEABUR_DIRECT
 */
export const API_BASE: string =
  ((import.meta as any).env?.VITE_API_BASE_URL as string | undefined) ??
  ZEABUR_DIRECT;  // 暫時 force direct、見上方 ROLLBACK 註

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
