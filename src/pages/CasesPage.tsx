import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Filter, Lightbulb, ShieldCheck, Wrench } from 'lucide-react';
import { allCases, type CaseStudy, type MetricItem } from '../data/cases';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { API_BASE, DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const API_URL = `${API_BASE}/api/public/cases`;
const ALL = '全部';
const GARBLED_RE = /[�]|銝|嚗|瘙|蝟|鞈|撠|摰|憭|隤|雿|蝯|蝺|蝑|閬|頝/;

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
  hero_number?: string | null;
  hero_money?: string | null;
  hook_question?: string | null;
  story_empathy?: string | null;
  story_failed_attempt?: string | null;
  story_aha_moment?: string | null;
  story_solution?: string | null;
  metrics?: MetricItem[];
}

function apiToCaseStudy(item: ApiCase): CaseStudy {
  return {
    id: item.id,
    industry: item.industry || '',
    company: item.company || '',
    problem: item.pain || '',
    wrongMove: item.wrong_move || '',
    aiInsight: item.ai_insight || '',
    strategy: item.solution || '',
    results: item.results || '',
    duration: item.duration || '',
    featured: !!item.featured,
    hero_number: item.hero_number || '',
    hero_money: item.hero_money || '',
    hook_question: item.hook_question || '',
    story_empathy: item.story_empathy || item.pain || '',
    story_failed_attempt: item.story_failed_attempt || item.wrong_move || '',
    story_aha_moment: item.story_aha_moment || item.ai_insight || '',
    story_solution: item.story_solution || item.solution || '',
    metrics: Array.isArray(item.metrics) ? item.metrics : [],
  };
}

function hasBrokenText(cases: CaseStudy[]) {
  const sample = cases
    .slice(0, 6)
    .map((item) => [item.industry, item.company, item.problem, item.results].join(' '))
    .join(' ');
  return GARBLED_RE.test(sample);
}

function startDiagnosis(entryPoint: string) {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: entryPoint });
  window.location.href = `${DIAG_URL}/`;
}

export default function CasesPage() {
  const [cases, setCases] = useState<CaseStudy[]>(allCases);
  const [source, setSource] = useState<'api' | 'fallback' | 'loading'>('loading');
  const [openId, setOpenId] = useState<number | null>(allCases[0]?.id ?? null);
  const [filter, setFilter] = useState(() => {
    if (typeof window === 'undefined') return ALL;
    return new URLSearchParams(window.location.search).get('industry') || ALL;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      setCases(allCases);
      setSource('fallback');
      return;
    }

    let cancelled = false;
    const ctrl = new AbortController();
    const timeoutId = window.setTimeout(() => ctrl.abort(), 4000);

    fetch(API_URL, { signal: ctrl.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((payload) => {
        if (cancelled) return;
        const mapped = Array.isArray(payload?.cases) ? payload.cases.map(apiToCaseStudy) : [];
        if (mapped.length > 0 && !hasBrokenText(mapped)) {
          setCases(mapped);
          setSource('api');
        } else {
          setCases(allCases);
          setSource('fallback');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCases(allCases);
          setSource('fallback');
        }
      })
      .finally(() => window.clearTimeout(timeoutId));

    return () => {
      cancelled = true;
      ctrl.abort();
      window.clearTimeout(timeoutId);
    };
  }, []);

  const industries = useMemo(() => [ALL, ...Array.from(new Set(cases.map((item) => item.industry))).filter(Boolean)], [cases]);
  const filtered = filter === ALL ? cases : cases.filter((item) => item.industry === filter);

  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 實戰案例｜AI 副營運執行長如何接住工作流"
        description="查看 ORION AI 如何把不動產、電商、製造、餐飲、客戶留存與企業現金流流程，拆成可派工、可追蹤、可驗證的 AI 營運工作流。"
        url="/cases"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">實戰案例</span>
          <h1>不是展示 AI 功能，是看哪一條工作流被接住、被追到有結果。</h1>
          <p>
            每個案例都從一個真實的營運斷點開始：客人沒追、排程靠人腦、現金流看太慢、回訪沒人盯。ORION 的價值，是把斷點變成入口、任務、提醒、回報與資料。
          </p>
          <div className="source-pill">
            <ShieldCheck size={16} />
            {source === 'api' ? '使用 production 案例資料' : source === 'loading' ? '正在讀取 production 案例' : 'API 未回應或資料異常，使用本地乾淨案例'}
          </div>
        </div>
        <CinematicVideo src="/videos/orion-systems-city-card-loop.mp4" label="企業系統案例城市動畫" />
      </section>

      <section className="case-filter-section">
        <div className="filter-label">
          <Filter size={16} />
          依產業篩選
        </div>
        <div className="case-filter-list">
          {industries.map((industry) => (
            <button
              key={industry}
              className={filter === industry ? 'active' : ''}
              onClick={() => {
                setFilter(industry);
                setOpenId(null);
              }}
            >
              {industry}
            </button>
          ))}
        </div>
      </section>

      <section className="case-study-list">
        {filtered.map((caseData) => (
          <article key={caseData.id} className={`case-study-row ${openId === caseData.id ? 'is-open' : ''}`}>
            <button className="case-study-summary" onClick={() => setOpenId(openId === caseData.id ? null : caseData.id)}>
              <span className="case-industry">{caseData.industry}</span>
              <h2>{caseData.company}</h2>
              <p>{caseData.hook_question || caseData.problem}</p>
              <div className="case-metric-pair">
                <strong>{caseData.hero_number || caseData.duration}</strong>
                <span>{caseData.hero_money || '工作流成果'}</span>
              </div>
            </button>

            {openId === caseData.id && (
              <div className="case-study-detail">
                <div className="case-detail-grid">
                  <CaseDetail icon={<BarChart3 size={18} />} label="原本斷點" body={caseData.problem} />
                  <CaseDetail icon={<Lightbulb size={18} />} label="AI 看見的本質" body={caseData.aiInsight} />
                  <CaseDetail icon={<Wrench size={18} />} label="ORION 工作流做法" body={caseData.strategy} />
                </div>
                <div className="case-result-panel">
                  <h3>可驗證成果</h3>
                  <p>{caseData.results}</p>
                  <div className="case-metrics">
                    {(caseData.metrics || []).map((metric) => (
                      <span key={`${caseData.id}-${metric.label}`}>
                        <small>{metric.label}</small>
                        <strong>{metric.value}</strong>
                      </span>
                    ))}
                  </div>
                  <button className="orion-primary-btn" onClick={() => startDiagnosis('cases_card_cta')}>
                    讓 ORION 拆你的案例
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="site-section site-final-command compact">
        <CinematicVideo src="/videos/orion-core-devices-card-loop.mp4" label="多裝置企業 AI 工作流影片" />
        <div className="final-command-content">
          <span className="site-eyebrow">下一步</span>
          <h2>把你的產業問題，拆成第一版 AI 營運工作流。</h2>
          <p>不需要先想清楚技術細節。你只要說出產業、哪裡正在產生隱形成本、誰在處理、想達到的結果，ORION 會先幫你拆出入口、任務、提醒、資料與工程交付順序。</p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('cases_bottom_cta')}>
            啟動工作流診斷
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function CaseDetail({ icon, label, body }: { icon: React.ReactNode; label: string; body: string }) {
  return (
    <div className="case-detail-card">
      <span>{icon}</span>
      <strong>{label}</strong>
      <p>{body}</p>
    </div>
  );
}
