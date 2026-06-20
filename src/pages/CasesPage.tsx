import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Filter, Lightbulb, ShieldCheck, Wrench, Zap } from 'lucide-react';
import { allCases, getCaseVisual, getCaseWorkflows, type CaseStudy, type MetricItem } from '../data/cases';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import CaseMedia from '../components/shared/CaseMedia';
import { API_BASE, DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const API_URL = `${API_BASE}/api/public/cases`;
const ALL = '全部';
const GARBLED_RE = /[�]|銝|嚗|瘙|蝟|鞈|撠|摰|憭|隤|雿|蝯|蝺|蝑|閬|頝/;

interface ApiCase {
  id: number;
  title?: string;
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

function cleanText(value?: string | null) {
  return String(value || '').trim();
}

function firstReadableClause(value?: string | null, fallback = '') {
  const text = cleanText(value);
  if (!text) return fallback;
  const clause = text.split(/[，。；;]/).map((item) => item.trim()).find(Boolean) || text;
  return clause.length > 34 ? `${clause.slice(0, 34)}…` : clause;
}

function deriveResultPair(item: Pick<CaseStudy, 'hero_number' | 'hero_money' | 'metrics' | 'results' | 'duration'>) {
  const heroNumber = cleanText(item.hero_number);
  const heroMoney = cleanText(item.hero_money);
  if (heroNumber) {
    return {
      primary: heroNumber,
      secondary: heroMoney || '可驗證成果',
    };
  }

  const metric = (item.metrics || []).find((entry) => cleanText(entry.label) && cleanText(entry.value));
  if (metric) {
    return {
      primary: `${metric.label} ${metric.value}`,
      secondary: '可量化成果',
    };
  }

  const result = cleanText(item.results);
  const quantified = result.match(/[^，。；;]*?(?:[+\-]?\d+(?:\.\d+)?\s*(?:%|小時|分鐘|天|週|月|萬|次|封|hr|min))[^，。；;]*/);
  if (quantified?.[0]?.trim()) {
    return {
      primary: quantified[0].trim(),
      secondary: '可驗證成果',
    };
  }

  const duration = cleanText(item.duration);
  if (duration) {
    return {
      primary: duration,
      secondary: '第一版導入期',
    };
  }

  return {
    primary: firstReadableClause(result, '流程變得可追蹤'),
    secondary: '老闆看得見的成果',
  };
}

function getCaseTitle(caseData: CaseStudy) {
  return (
    cleanText(caseData.company) ||
    firstReadableClause(caseData.hook_question) ||
    `${cleanText(caseData.industry) || '企業'}工作流案例`
  );
}

function getCaseSummary(caseData: CaseStudy) {
  return firstReadableClause(
    caseData.hook_question || caseData.problem,
    '把原本靠人記、靠人追的流程，變成有狀態、有提醒、有回報。'
  );
}

function apiToCaseStudy(item: ApiCase): CaseStudy {
  const company = cleanText(item.company) || cleanText(item.title) || `${cleanText(item.industry) || '企業'}工作流案例`;
  const problem = cleanText(item.pain) || '這段流程原本靠人工記錄、群組訊息或個人經驗處理，事情一多就容易漏。';
  const aiInsight = cleanText(item.ai_insight) || '真正的斷點不是人不努力，而是入口、責任人、提醒時間與回報沒有被串成同一條流程。';
  const strategy = cleanText(item.solution) || 'ORION 先把入口、狀態、負責人、提醒時間與主管回報整理成可追蹤工作流。';
  const results = cleanText(item.results) || '讓流程有狀態、有提醒、有回報，不再只靠人記得。';

  return {
    id: item.id,
    industry: cleanText(item.industry) || '企業工作流',
    company,
    problem,
    wrongMove: cleanText(item.wrong_move) || '過去靠人工追、群組問、表格補，沒有形成固定提醒與回報節奏。',
    aiInsight,
    strategy,
    results,
    duration: cleanText(item.duration),
    featured: !!item.featured,
    hero_number: cleanText(item.hero_number),
    hero_money: cleanText(item.hero_money),
    hook_question: cleanText(item.hook_question),
    story_empathy: cleanText(item.story_empathy) || problem,
    story_failed_attempt: cleanText(item.story_failed_attempt) || cleanText(item.wrong_move),
    story_aha_moment: cleanText(item.story_aha_moment) || aiInsight,
    story_solution: cleanText(item.story_solution) || strategy,
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
  const flagshipCases = useMemo(() => {
    const featured = filtered.filter((item) => item.featured);
    return (featured.length ? featured : filtered).slice(0, 3);
  }, [filtered]);

  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 實戰案例｜客人、訂單、回訪怎麼被 O 接住"
        description="看 ORION 如何把不動產、電商、製造、餐飲、診所等常見斷點，變成有人負責、會提醒、會回報的 AI 流程。"
        url="/cases"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">實戰案例</span>
          <h1>不是看 AI 多炫，是看客人、訂單、回訪有沒有被追到結果。</h1>
          <p>
            每個案例都從老闆每天會遇到的斷點開始：客人沒追、交期被插單、私訊漏回、回訪沒人做。ORION 的價值，是把這些事變成有人負責、會提醒、會回報。
          </p>
          <div className="site-page-hero-actions">
            <button className="orion-primary-btn" onClick={() => startDiagnosis('cases_hero_primary')}>
              用我的產業試拆一條流程
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="#case-list">
              看 12 個完整案例
            </a>
          </div>
          <div className="source-pill cases-source-pill">
            <ShieldCheck size={16} />
            {source === 'api' ? '使用最新案例資料' : source === 'loading' ? '正在讀取案例資料' : '案例資料已載入'}
          </div>
        </div>
        <CinematicVideo
          src="/videos/orion-systems-city-card-loop.mp4"
          label="企業系統案例城市動畫"
          mobileObjectPosition="50% center"
        />
      </section>

      <section className="site-section flagship-case-section" aria-label="三個旗艦案例摘要">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">老闆會看到的改變</span>
          <h2>不是「導入 AI」四個字，是每天少漏幾件事。</h2>
          <p>先看三個典型斷點：原本誰在忙、哪裡漏掉、O 接手後老闆早上會看到什麼。</p>
        </div>
        <div className="flagship-case-grid">
          {flagshipCases.map((caseData, index) => {
            const visual = getCaseVisual(caseData, index, 'casesFeatured');
            return (
              <article key={`flagship-${caseData.id}`} className="flagship-case-card">
                {visual && (
                  <CaseMedia
                    visual={visual}
                    className="flagship-case-image flagship-case-media"
                    loading="lazy"
                    preload="metadata"
                    mobileMode="poster"
                  />
                )}
                {visual?.videoMp4 && (
                  <span className="flagship-case-video-badge" aria-hidden="true">
                    動態案例
                  </span>
                )}
                <span>{caseData.industry}</span>
                <h3>{getCaseTitle(caseData)}</h3>
                <p><strong>原本卡點：</strong>{caseData.problem}</p>
                <p><strong>O 接手：</strong>{caseData.strategy}</p>
                <div>
                  <small>老闆看到</small>
                  <b>{deriveResultPair(caseData).primary}</b>
                </div>
              </article>
            );
          })}
        </div>
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

      <section className="case-study-list" id="case-list">
        {filtered.map((caseData, index) => {
          const visual = getCaseVisual(caseData, index, 'casesList');
          const resultPair = deriveResultPair(caseData);
          return (
            <article key={caseData.id} className={`case-study-row ${openId === caseData.id ? 'is-open' : ''}`}>
              <button className="case-study-summary" onClick={() => setOpenId(openId === caseData.id ? null : caseData.id)}>
                {visual && (
                  <CaseMedia
                    visual={visual}
                    className="case-study-thumb"
                    loading="lazy"
                    preload="none"
                    mobileMode="poster"
                  />
                )}
                <div className="case-study-summary-copy">
                  <span className="case-industry">{caseData.industry}</span>
                  <h2>{getCaseTitle(caseData)}</h2>
                  <p>{getCaseSummary(caseData)}</p>
                </div>
                <div className="case-metric-pair">
                  <strong>{resultPair.primary}</strong>
                  <span>{resultPair.secondary}</span>
                </div>
              </button>

              {openId === caseData.id && (
                <div className="case-study-detail">
                  <div className="case-detail-grid">
                    <CaseDetail icon={<BarChart3 size={18} />} label="原本斷點" body={caseData.problem} />
                    <CaseDetail icon={<Lightbulb size={18} />} label="AI 看見的本質" body={caseData.aiInsight} />
                    <CaseDetail icon={<Wrench size={18} />} label="ORION 工作流做法" body={caseData.strategy} />
                  </div>
                  <CaseDetail
                    icon={<Zap size={18} />}
                    label="還能順手交給 O 的工作流"
                    items={getCaseWorkflows(caseData)}
                  />
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
                      讓 O 拆我的案例
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="site-section site-final-command compact">
        <CinematicVideo
          src="/videos/orion-core-devices-card-loop.mp4"
          label="多裝置企業 AI 工作流影片"
          mobileMode="poster"
          mobileObjectPosition="50% center"
        />
        <div className="final-command-content">
          <span className="site-eyebrow">下一步</span>
          <h2>把你每天最常漏掉的事，拆成第一版 O 可以追的流程。</h2>
          <p>不需要先想技術。你只要說出產業、哪件事常漏、誰在處理、想看到什麼結果，O 會先幫你拆出下一步、負責人、提醒節奏和資料欄位。</p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('cases_bottom_cta')}>
            讓 O 幫我拆流程
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}

function CaseDetail({ icon, label, body, items }: { icon: React.ReactNode; label: string; body?: string; items?: string[] }) {
  return (
    <div className="case-detail-card">
      <span>{icon}</span>
      <strong>{label}</strong>
      {items
        ? items.map((item, i) => (
            <p key={i}><span style={{ color: '#C5A059', marginRight: 6 }}>›</span>{item}</p>
          ))
        : <p>{body}</p>}
    </div>
  );
}
