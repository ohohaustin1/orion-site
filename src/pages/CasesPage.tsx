import React, { useState, useEffect } from 'react';
import { Filter, Crosshair, ChevronRight, AlertTriangle, Brain, Target, DollarSign, Check, ChevronDown } from 'lucide-react';
import { allCases, type CaseStudy } from '../data/cases';
import { fetchIndustries, getIndustryColor, FALLBACK_INDUSTRIES, type Industry } from '../lib/industries';
import PageSEO from '../components/PageSEO';

const DIAG_URL = 'https://orion-hub.zeabur.app';
const API_URL = 'https://orion-hub.zeabur.app/api/public/cases';
const IQA_URL = 'https://orion-hub.zeabur.app/api/public/industry-qa';

// 2026-04-27 產業問答 schema
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
}

// 把 API snake_case 映射成 TS interface camelCase
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
          : filtered.map((c, i) => (
              <div
                key={c.id}
                className="orion-case-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="case-tag" style={{ background: getIndustryColor(c.industry) }}>
                  {c.industry}
                </div>
                <h3 className="case-company">{c.company}</h3>

                <div className="case-row">
                  <span className="case-label" style={{
                    background: 'rgba(231,76,60,0.15)',
                    color: '#e74c3c',
                  }}>
                    <Crosshair size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    原始問題
                  </span>
                  <p>{c.problem}</p>
                </div>

                <div className="case-row">
                  <span className="case-label" style={{
                    background: 'rgba(255,152,0,0.15)',
                    color: '#ff9800',
                  }}>
                    <AlertTriangle size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    錯誤決策
                  </span>
                  <p>{c.wrongMove}</p>
                </div>

                <div className="case-row">
                  <span className="case-label" style={{
                    background: 'rgba(33,150,243,0.15)',
                    color: '#2196f3',
                  }}>
                    <Brain size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    AI 拆解
                  </span>
                  <p>{c.aiInsight}</p>
                </div>

                <div className="case-row">
                  <span className="case-label solution" style={{
                    background: 'rgba(201,168,76,0.15)',
                    color: 'var(--orion-gold)',
                  }}>
                    <Target size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    執行策略
                  </span>
                  <p>{c.strategy}</p>
                </div>

                <div className="case-results">
                  <DollarSign size={14} />
                  <p>{c.results}</p>
                </div>
                <div className="case-duration">{c.duration}</div>

                <a
                  href={DIAG_URL}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    marginTop: 14,
                    padding: '10px 16px',
                    background: 'rgba(201,168,76,0.08)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 8,
                    color: 'var(--orion-gold)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--orion-gold)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)';
                  }}
                >
                  想了解您的專屬策略？→ 立即啟動診斷
                  <ChevronRight size={14} />
                </a>
              </div>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--orion-text-secondary)' }}>
          目前此產業尚無案例
        </div>
      )}

      {/* Layer 3：三問三答 Accordion — 只在選了特定產業時 */}
      {currentIqa && (
        <section className="iqa-section">
          <h2 className="iqa-section-title">這個產業的老闆、通常問我們 3 個問題</h2>
          <div className="iqa-accordion">
            <IqaAccordionItem title={currentIqa.q1.title} answer={currentIqa.q1.answer} defaultOpen tag="Q1" />
            <IqaAccordionItem title={currentIqa.q2.title} answer={currentIqa.q2.answer}             tag="Q2" />
            <IqaAccordionItem title={currentIqa.q3.title} answer={currentIqa.q3.answer}             tag="Q3" />
          </div>
        </section>
      )}

      {/* Layer 4：CTA — 只在選了特定產業時 */}
      {currentIqa && (
        <section className="iqa-cta">
          <h2 className="iqa-cta-title">跟你的情況像嗎？</h2>
          <p className="iqa-cta-sub">3 分鐘免費診斷、我們幫你看看你的 {filter} 還能怎麼做</p>
          <a href={DIAG_URL} className="iqa-cta-btn">免費診斷 →</a>
        </section>
      )}
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
