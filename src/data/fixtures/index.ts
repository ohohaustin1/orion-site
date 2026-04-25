/**
 * fixtures/index.ts — Phase B HOTFIX T7：報告 staging fixture 載入
 *
 * Chairman 用法：
 *   /report/preview/sample-restaurant?dev_token=XXX
 *   /report/preview/sample-ecommerce
 *   ...
 *
 * Token 保護：env VITE_REPORT_PREVIEW_TOKEN（前端可讀的 env、限存取者）
 *   prod 嚴格擋；dev / staging 不需要 token 也能開
 */

import sampleRestaurant from './sample-restaurant.json';
import sampleEcommerce from './sample-ecommerce.json';
import sampleManufacture from './sample-manufacture.json';
import sampleMedical from './sample-medical.json';
import edgeCaseEmpty from './edge-case-empty.json';
import edgeCaseFull from './edge-case-full.json';

export interface FixtureLead {
  id: number;
  sessionId: string;
  name: string;
  contact: string;
  industry: string;
  stage: string;
  scale: string;
  budget: string;
  timeline: string;
  painPoints: string[];
  goals: string;
  score: number;
  createdAt: string;
}

export interface FixtureReport {
  // legacy fields（current Report.tsx 使用）
  coreProblem: { title: string; description: string };
  painQuantification: {
    title: string;
    monthlyTimeLoss: string;
    monthlyMoneyCost: string;
    description: string;
  };
  aiSolution: { title: string; capabilities: string[]; description: string };
  firstAction: { title: string; action: string; description: string };
  overallScore: number;
  // T2 重設計後新增欄位
  coreInsight?: string;
  currentAnalysis?: string;
  currentKeyPoints?: Array<{ type: string; label: string; text: string }>;
  opportunities?: Array<{ title: string; description: string; impact: string; timeline?: string }>;
  risks?: string[];
  path?: Array<{ phase: string; title: string; description: string }>;
  chairmanNote?: string;
}

export interface ReportFixture {
  templateName: string;
  lead: FixtureLead;
  report: FixtureReport;
}

const FIXTURES: Record<string, ReportFixture> = {
  'sample-restaurant':  sampleRestaurant as ReportFixture,
  'sample-ecommerce':   sampleEcommerce as ReportFixture,
  'sample-manufacture': sampleManufacture as ReportFixture,
  'sample-medical':     sampleMedical as ReportFixture,
  'edge-case-empty':    edgeCaseEmpty as ReportFixture,
  'edge-case-full':     edgeCaseFull as ReportFixture,
};

export const FIXTURE_NAMES = Object.keys(FIXTURES);

export const FIXTURE_LIST: Array<{ id: string; label: string }> = [
  { id: 'sample-restaurant',  label: '餐飲連鎖' },
  { id: 'sample-ecommerce',   label: '電商零售' },
  { id: 'sample-manufacture', label: '製造業' },
  { id: 'sample-medical',     label: '醫美診所' },
  { id: 'edge-case-empty',    label: '邊界 — 極短' },
  { id: 'edge-case-full',     label: '邊界 — 完整' },
];

export function getFixture(name: string): ReportFixture | null {
  return FIXTURES[name] || null;
}

/**
 * Token 保護：prod 才查 token，dev/staging 直接放行
 * 取 import.meta.env.VITE_REPORT_PREVIEW_TOKEN（要在 Vercel env 設）
 * 若 env 沒設則 prod 也放行（給單純 staging 用）
 */
export function isPreviewAllowed(token: string | null): boolean {
  // @ts-ignore — Vite env
  const isProd = (import.meta as any).env?.PROD === true;
  if (!isProd) return true;
  // @ts-ignore — Vite env
  const expected = (import.meta as any).env?.VITE_REPORT_PREVIEW_TOKEN || '';
  if (!expected) return true; // 沒設 token、預設放行（staging fallback）
  return token === expected;
}
