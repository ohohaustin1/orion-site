import React, { useState, useEffect } from 'react';
import { Filter, Check, ChevronDown, User, X, Lightbulb, Wrench, BarChart3 } from 'lucide-react';
import { allCases, type CaseStudy as BaseCase } from '../data/cases';
import { fetchIndustries, FALLBACK_INDUSTRIES, type Industry } from '../lib/industries';
import PageSEO from '../components/PageSEO';

const DIAG_URL = 'https://orion-hub.zeabur.app';
const API_URL = 'https://orion-hub.zeabur.app/api/public/cases';
const IQA_URL = 'https://orion-hub.zeabur.app/api/public/industry-qa';

// 2026-04-27 v6 案例故事化擴展（從 BaseCase 加 7 欄位 + metrics）
interface MetricItem { label: string; value: string }
interface CaseStudy extends BaseCase {
  hero_number?: string;
  hero_money?: string;
  hook_question?: string;
  story_empathy?: string;
  story_failed_attempt?: string;
  story_aha_moment?: string;
  story_solution?: string;
  metrics?: MetricItem[];
}

interface IndustryQA {
  id: number;
  industry: string;
  resonance: string[];
  q1: { title: string; answer: string };
  q2: { title: string; answer: string };
  q3: { title: string; answer: string };
}

// API response shape（orion-hub /api/public/cases 的 cms_cases 欄位）
interface ApiCase {
  id: number;
  industry?: string;
  company?: string;
  pain?: string;
  wrong_move?: string;
  ai_insight?: string;
  solution?: string;
  results?: string;
  duration?: string;
  featured?: 0 | 1 | boolean;
  // 2026-04-27 v6 故事化新欄位
  hero_number?: string | null;
  hero_money?: string | null;
  hook_question?: string | null;
  story_empathy?: string | null;
  story_failed_attempt?: string | null;
  story_aha_moment?: string | null;
  story_solution?: string | null;
  metrics?: MetricItem[];
}

function apiToCaseStudy(c: ApiCase): CaseStudy {
  return {
    id: c.id,
    industry: c.industry || '',
    company: c.company || '',
    problem: c.pain || '',
    wrongMove: c.wrong_move || '',
    aiInsight: c.ai_insight || '',
    strategy: c.solution || '',
    results: c.results || '',
    duration: c.duration || '',
    featured: !!c.featured,
    hero_number: c.hero_number || '',
    hero_money: c.hero_money || '',
    hook_question: c.hook_question || '',
    story_empathy: c.story_empathy || c.pain || '',
    story_failed_attempt: c.story_failed_attempt || c.wrong_move || '',
    story_aha_moment: c.story_aha_moment || c.ai_insight || '',
    story_solution: c.story_solution || c.solution || '',
    metrics: Array.isArray(c.metrics) ? c.metrics : [],
  };
}

export default function CasesPage() {
  // null = loading（尚未 fetch 回）；實陣列 = 已載入（API 或 fallback）
  const [cases, setCases] = useState<CaseStudy[] | null>(null);
  // 2026-04-27：讀 ?industry=XXX URL param、首頁精選卡跳過來自動選那個產業
  const initialFilter = (() => {
    if (typeof window === 'undefined') return '全部';
    try { return new URLSearchParams(window.location.search).get('industry') || '全部'; }
    catch { return '全部'; }
  })();
  const [filter, setFilter] = useState(initialFilter);
  // TD-INDUSTRIES-sync：從 /api/public/industries 取單一來源、失敗 fallback
  const [industriesSrc, setIndustriesSrc] = useState<Industry[]>(FALLBACK_INDUSTRIES);

  // Task 2: fetch /api/public/cases, 失敗靜默 fallback 硬碼
  useEffect(() => {
    let aborted = false;
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 4000); // 4s timeout

    fetch(API_URL, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
      .then(j => {
        if (aborted) return;
        const list: ApiCase[] = Array.isArray(j?.cases) ? j.cases : [];
        const mapped = list.map(apiToCaseStudy);
        setCases(mapped.length ? mapped : allCases); // 零筆也 fallback
      })
      .catch(() => {
        if (!aborted) setCases(allCases); // 靜默 fallback
      })
      .finally(() => clearTimeout(timeoutId));

    // TD-INDUSTRIES-sync：fetch 產業清單（cache 命中即返、失敗 fallback）
    fetchIndustries().then((list) => { if (!aborted) setIndustriesSrc(list); });

    // 2026-04-27：一次拉全部 14 產業問答（用 Map 之後切產業即時切換、無需 re-fetch）
    fetch(IQA_URL)
      .then((r) => r.json())
      .then((j) => { if (!aborted && j?.qa) setAllIqa(j.qa); })
      .catch(() => { /* fail silent */ });

    return () => {
      aborted = true;
      ctrl.abort();
    };
  }, []);

  // 產業問答 state
  const [allIqa, setAllIqa] = useState<IndustryQA[]>([]);
  const currentIqa = filter !== '全部' ? allIqa.find((q) => q.industry === filter) : null;
  // 2026-04-27 單開機制：同時只展開一張 case card
  const [openCardId, setOpenCardId] = useState<number | null>(null);
  // filter 切換時收合所有
  useEffect(() => { setOpenCardId(null); }, [filter]);
  const toggleCard = (id: number) => setOpenCardId((prev) => (prev === id ? null : id));

  const loading = cases === null;
  const effectiveCases = cases ?? allCases;
  // 從 case data 抽取已用到的產業 + 補上 industriesSrc（單一來源）
  const usedFromCases = new Set(effectiveCases.map(c => c.industry).filter(Boolean));
  const allIndustryNames = new Set([
    ...industriesSrc.map(i => i.name),
    ...usedFromCases, // 容錯：case 用了 industriesSrc 沒列的產業也照樣顯示
  ]);
  const industries = ['全部', ...Array.from(allIndustryNames)];
  const filtered = filter === '全部' ? effectiveCases : effectiveCases.filter(c => c.industry === filter);

  return (
    <div className="orion-page">
      <PageSEO
        title="實戰戰報資料庫 | Orion 獵戶座智鑑"
        description="20 個真實企業 AI 導入案例，成交率提升、成本降低的量化成果。"
        url="/cases"
      />
      <div className="orion-page-header">
        <h1>實戰戰報資料庫</h1>
        <p>
          跨 {new Set(effectiveCases.map(c => c.industry)).size} 個產業、{effectiveCases.length} 個 AI 導入實戰報告 — 每一筆數字都來自真實交付
        </p>
      </div>

      <div className="orion-filter-bar">
        <Filter size={16} style={{ color: 'var(--orion-gold)' }} />
        {industries.map(ind => (
          <button
            key={ind}
            className={`orion-filter-chip ${filter === ind ? 'active' : ''}`}
            onClick={() => setFilter(ind)}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Layer 1：共鳴 — 只在選了特定產業時 */}
      {currentIqa && (
        <section className="iqa-resonance">
          <h2 className="iqa-resonance-title">{filter}老闆、你是不是也遇到？</h2>
          <ul className="iqa-resonance-list">
            {currentIqa.resonance.map((r, i) => (
              <li key={i} className="iqa-resonance-item">
                <Check size={18} className="iqa-check" /> {r}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="orion-cases-grid full">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={`sk-${i}`} className="orion-case-card-skeleton" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="sk-bar short"></div>
                <div className="sk-bar med"></div>
                <div className="sk-bar long"></div>
                <div className="sk-bar long"></div>
                <div className="sk-bar med"></div>
                <div className="sk-bar long"></div>
                <div className="sk-bar short"></div>
              </div>
            ))
          : filtered.map((c) => {
              const iqa = allIqa.find((q) => q.industry === c.industry);
              return (
                <CaseCardV2
                  key={c.id}
                  caseData={c}
                  industryQa={iqa}
                  isOpen={openCardId === c.id}
                  onToggle={() => toggleCard(c.id)}
                />
              );
            })}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--orion-text-secondary)' }}>
          目前此產業尚無案例
        </div>
      )}
    </div>
  );
}

// ── 2026-04-27 v6 CaseCardV2：可展開故事卡 ──
interface CaseCardV2Props {
  caseData: CaseStudy;
  industryQa?: IndustryQA;
  isOpen: boolean;
  onToggle: () => void;
}

function CaseCardV2({ caseData: c, industryQa, isOpen, onToggle }: CaseCardV2Props) {
  const heroNumber = c.hero_number || '';
  const heroMoney = c.hero_money || '';
  const hook = c.hook_question || '';
  const metrics = (c.metrics && c.metrics.length > 0) ? c.metrics : [];

  return (
    <article className={`case-card-v2 ${isOpen ? 'is-open' : ''}`}>
      <button
        type="button"
        className="case-card-summary"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="industry-chip industry-chip--outline">{c.industry}</span>
        <h3 className="company-name">{c.company}</h3>

        <div className="hero-metrics">
          {heroNumber && (
            <div className="hero-metric">
              <span className="metric-value stat-number">{heroNumber}</span>
            </div>
          )}
          {heroMoney && heroMoney !== heroNumber && (
            <div className="hero-metric secondary">
              <span className="metric-value stat-number">{heroMoney}</span>
            </div>
          )}
        </div>

        {hook && <p className="hook-line">{hook}</p>}

        <span className="expand-btn">
          {isOpen ? '收合 ▲' : '展開案例 ▼'}
        </span>
      </button>

      <div className="case-expanded">
        <div className="case-expanded-inner">
          <StoryStep icon={<User size={18} />} label="他跟你一樣">{c.story_empathy}</StoryStep>
          <StoryStep icon={<X size={18} />} label="他試過這些、都沒用">{c.story_failed_attempt}</StoryStep>
          <StoryStep icon={<Lightbulb size={18} />} label="真正的問題在這裡">{c.story_aha_moment}</StoryStep>
          <StoryStep icon={<Wrench size={18} />} label="我們只做了一件事">{c.story_solution}</StoryStep>

          {metrics.length > 0 && (
            <div className="story-results">
              <div className="story-step-header">
                <BarChart3 size={18} className="story-step-icon" />
                <span className="story-step-label">然後發生了這些變化</span>
              </div>
              <div className="metrics-grid">
                {metrics.map((m, i) => (
                  <div key={i} className="metric-item">
                    {m.label && <span className="metric-item-label">{m.label}</span>}
                    <span className="metric-item-value stat-number">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {industryQa && (
            <section className="case-qa">
              <h4>這個產業的老闆、通常問我們 3 個問題</h4>
              <div className="iqa-accordion">
                <IqaAccordionItem title={industryQa.q1.title} answer={industryQa.q1.answer} defaultOpen tag="Q1" />
                <IqaAccordionItem title={industryQa.q2.title} answer={industryQa.q2.answer}             tag="Q2" />
                <IqaAccordionItem title={industryQa.q3.title} answer={industryQa.q3.answer}             tag="Q3" />
              </div>
            </section>
          )}

          <section className="case-cta">
            <h4>跟你的情況像嗎？</h4>
            <p>3 分鐘免費診斷、我們幫你看看還能怎麼做</p>
            <a href={DIAG_URL} className="iqa-cta-btn">免費診斷 →</a>
          </section>
        </div>
      </div>
    </article>
  );
}

function StoryStep({ icon, label, children }: { icon: React.ReactNode; label: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="story-step">
      <div className="story-step-header">
        <span className="story-step-icon">{icon}</span>
        <span className="story-step-label">{label}</span>
      </div>
      <p className="story-step-content">{children}</p>
    </div>
  );
}

// ── 2026-04-27 IqaAccordionItem 元件 ──
function IqaAccordionItem({ title, answer, defaultOpen, tag }: { title: string; answer: string; defaultOpen?: boolean; tag: string }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const onToggle = () => setOpen((v) => !v);
  return (
    <div className={`iqa-acc-item ${open ? 'iqa-acc-open' : ''}`}>
      <button type="button" className="iqa-acc-header" onClick={onToggle} aria-expanded={open}>
        <span className="iqa-acc-tag">{tag}</span>
        <span className="iqa-acc-title">{title}</span>
        <ChevronDown size={20} className="iqa-acc-chevron" />
      </button>
      {open && (
        <div className="iqa-acc-body">
          {answer.split(/\n\n+/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}
