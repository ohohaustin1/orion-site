/**
 * lib/industries.ts — TD-INDUSTRIES-sync 單一來源
 *
 * fetch /api/public/industries（hub 的 shared/industries.json）作為產業清單權威，
 * 失敗時 fallback 到硬碼 14 個（不白屏）。
 *
 * 顏色映射本地維護（API 沒提供顏色、硬碼可接受）；
 * 若 API 回傳新增產業而本地沒有顏色，用 fallback gold。
 */

// CN-PROXY-VERCEL-EDGE-001: API 經 Vercel Edge proxy（CN）或直連 zeabur（其他）
import { API_BASE } from './api-base';
const API_URL = `${API_BASE}/api/public/industries`;
const TIMEOUT_MS = 4000;

export interface Industry {
  id: string;
  name: string;
}

// fallback：與 hub/shared/industries.json 對齊的 14 個產業
export const FALLBACK_INDUSTRIES: Industry[] = [
  { id: '房地產仲介', name: '房地產仲介' },
  { id: '電商零售',   name: '電商零售' },
  { id: '製造業',     name: '製造業' },
  { id: '餐飲連鎖',   name: '餐飲連鎖' },
  { id: '顧問服務',   name: '顧問服務' },
  { id: '醫療診所',   name: '醫療診所' },
  { id: '法律事務所', name: '法律事務所' },
  { id: '教育補習班', name: '教育補習班' },
  { id: '物流倉儲',   name: '物流倉儲' },
  { id: '建築設計',   name: '建築設計' },
  { id: '美容美髮',   name: '美容美髮' },
  { id: '汽車保養',   name: '汽車保養' },
  { id: '保險業務',   name: '保險業務' },
  { id: '健身房',     name: '健身房' },
];

// 顏色映射本地維護（API 沒提供顏色）
export const INDUSTRY_COLORS: Record<string, string> = {
  '房地產仲介': '#e74c3c',
  '電商零售':   '#3498db',
  '製造業':     '#e67e22',
  '餐飲連鎖':   '#2ecc71',
  '顧問服務':   '#9b59b6',
  '醫療診所':   '#1abc9c',
  '法律事務所': '#34495e',
  '教育補習班': '#f39c12',
  '物流倉儲':   '#16a085',
  '建築設計':   '#8e44ad',
  '美容美髮':   '#e91e63',
  '汽車保養':   '#607d8b',
  '保險業務':   '#ff5722',
  '健身房':     '#4caf50',
};

// 模組級 cache（同 SPA 生命週期內共用、避免每個 page 各 fetch 一次）
let cached: Industry[] | null = null;
let inflight: Promise<Industry[]> | null = null;

export async function fetchIndustries(): Promise<Industry[]> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    try {
      const r = await fetch(API_URL, { signal: ctrl.signal });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const list = Array.isArray(j?.industries) ? j.industries : [];
      const cleaned = list
        .filter((i: any) => i && typeof i.id === 'string' && typeof i.name === 'string')
        .map((i: any) => ({ id: String(i.id), name: String(i.name) }));
      cached = cleaned.length ? cleaned : FALLBACK_INDUSTRIES;
    } catch {
      cached = FALLBACK_INDUSTRIES;
    } finally {
      clearTimeout(tid);
      inflight = null;
    }
    return cached!;
  })();
  return inflight;
}

export function getIndustryColor(name: string): string {
  return INDUSTRY_COLORS[name] || '#c9a84c'; // fallback gold
}
