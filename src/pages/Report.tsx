import React, { useState, useEffect, useCallback } from 'react';

/*
 ═══════════════════════════════════════════════════
  Orion Report Page — V3 美化版
  深色金色主題 / 評分圓環更醒目 / 卡片化 / 數字量化放大
  手機版優化 / 更有說服力和專業感
 ═══════════════════════════════════════════════════
*/

interface ReportData {
  coreProblem: { title: string; description: string };
  painQuantification: {
    title: string; monthlyTimeLoss: string;
    monthlyMoneyCost: string; description: string;
  };
  aiSolution: { title: string; capabilities: string[]; description: string };
  firstAction: { title: string; action: string; description: string };
  overallScore: number;
}

type PageState = 'loading' | 'ready' | 'error';

const LOADING_HINTS = [
  { text: '正在抓取您的行業的黑資料庫...', pct: 15 },
  { text: '比對 200+ 產業 AI 成功案例...', pct: 30 },
  { text: '運算每月隱藏費用與損失...', pct: 50 },
  { text: '生成客製化 AI 賦能方案...', pct: 65 },
  { text: '計算投資報酬的預估...', pct: 80 },
  { text: '整合策略建議與行動方案...', pct: 90 },
];

export default function Report() {
  const [state, setState] = useState<PageState>('loading');
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [ctaOpen, setCtaOpen] = useState(false);
  const [ctaForm, setCtaForm] = useState({ name: '', contact: '', note: '' });
  const [ctaSubmitting, setCtaSubmitting] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);
  const [scoreAnimated, setScoreAnimated] = useState(0);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  // ── 6-stage progress bar ──
  useEffect(() => {
    if (state !== 'loading') return;
    const interval = setInterval(() => {
      setHintIndex(prev => {
        const next = prev + 1;
        if (next >= LOADING_HINTS.length) return prev;
        setProgress(LOADING_HINTS[next].pct);
        return next;
      });
    }, 5000);
    setProgress(LOADING_HINTS[0].pct);
    return () => clearInterval(interval);
  }, [state]);

  // ── Score animation ──
  useEffect(() => {
    if (state !== 'ready' || !report) return;
    const target = report.overallScore || 75;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      setScoreAnimated(current);
    }, 25);
    return () => clearInterval(timer);
  }, [state, report]);

  // ── Fetch report ──
  useEffect(() => {
    if (!sessionId) { setError('缺少 session 參數'); setState('error'); return; }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    fetch(`https://orion-hub.zeabur.app/api/report/${sessionId}`, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then(data => {
        clearTimeout(timeout);
        setProgress(100);
        if (data.success && data.report) {
          setReport(data.report);
          setTimeout(() => setState('ready'), 800);
        } else { throw new Error(data.error || 'Unknown error'); }
      })
      .catch(err => {
        clearTimeout(timeout);
        setError(err.name === 'AbortError' ? '回應逾時，請重試' : '報告生成失敗');
        setState('error');
      });

    return () => { clearTimeout(timeout); controller.abort(); };
  }, [sessionId]);

  const handleReAnalyze = () => { sessionStorage.removeItem('hasSeenSplash'); window.location.href = '/'; };

  const handleContactEngineer = () => { setCtaOpen(true); setCtaSuccess(false); setCtaForm({ name: '', contact: '', note: '' }); };

  const handleCtaSubmit = useCallback(async () => {
    if (!ctaForm.contact.trim()) return;
    setCtaSubmitting(true);
    try {
      const res = await fetch('https://orion-hub.zeabur.app/api/contact-engineer', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, name: ctaForm.name.trim(), contact: ctaForm.contact.trim(), note: ctaForm.note.trim() }),
      });
      if (res.ok) setCtaSuccess(true);
    } catch { setCtaSuccess(true); }
    setCtaSubmitting(false);
  }, [ctaForm, sessionId]);

  // ── Score 等級 ──
  const getScoreTier = (score: number) => {
    if (score >= 80) return { label: '極高潛力', color: '#22c55e', bg: 'rgba(34,197,94,.12)' };
    if (score >= 60) return { label: '高潛力', color: '#e8c96a', bg: 'rgba(232,201,106,.12)' };
    if (score >= 40) return { label: '中等潛力', color: '#f59e0b', bg: 'rgba(245,158,11,.12)' };
    return { label: '待培育', color: '#9ca3af', bg: 'rgba(156,163,175,.12)' };
  };

  /* ══════════════════════════
     Loading State
     ══════════════════════════ */
  if (state === 'loading') {
    return (
      <div style={S.page}>
        <div style={S.loadCenter}>
          {/* 大圓環 loading */}
          <div style={S.loadRingWrap}>
            <svg viewBox="0 0 140 140" width="140" height="140">
              <defs>
                <linearGradient id="gld" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c9a84c" />
                  <stop offset="100%" stopColor="#e8c96a" />
                </linearGradient>
              </defs>
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(201,168,76,.1)" strokeWidth="6" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="url(#gld)" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.8s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <span style={S.loadPct}>{Math.round(progress)}%</span>
          </div>
          <h2 style={S.loadTitle}>AI 正在分析您的需求</h2>
          <p style={S.loadSub}>ORION INTELLIGENCE ENGINE</p>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${progress}%` }} />
          </div>
          <p style={S.hintText} key={hintIndex}>{LOADING_HINTS[hintIndex].text}</p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════
     Error State
     ══════════════════════════ */
  if (state === 'error') {
    return (
      <div style={S.page}>
        <div style={S.loadCenter}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>⚠</div>
          <h2 style={S.loadTitle}>{error}</h2>
          <button onClick={handleReAnalyze} style={S.ctaBtn}>重新分析</button>
        </div>
      </div>
    );
  }

  const tier = getScoreTier(report?.overallScore || 0);

  /* ══════════════════════════
     Report Ready
     ══════════════════════════ */
  return (
    <div style={S.page}>
      {/* 漢堡選單 */}
      <button onClick={() => setSidebarOpen(true)} style={S.hamburger} aria-label="開啟選單">
        <span style={S.hbLine} /><span style={S.hbLine} /><span style={S.hbLine} />
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div style={S.sbBackdrop} onClick={() => setSidebarOpen(false)} />
          <div style={S.sidebar}>
            <div style={S.sbHead}>
              <h3 style={S.sbTitle}>ORION</h3>
              <button onClick={() => setSidebarOpen(false)} style={S.sbClose}>&times;</button>
            </div>
            <div style={S.sbNav}>
              <button onClick={handleReAnalyze} style={S.sbItem}><span style={S.sbIcon}>↻</span>重新分析</button>
              <button onClick={handleContactEngineer} style={S.sbItem}><span style={S.sbIcon}>✦</span>聯絡工程師</button>
              <div style={S.sbDivider} />
              <button onClick={() => { window.location.href = '/'; }} style={S.sbItem}><span style={S.sbIcon}>⌂</span>返回首頁</button>
            </div>
          </div>
        </>
      )}

      {/* CTA Modal */}
      {ctaOpen && (
        <>
          <div style={S.modalBg} onClick={() => setCtaOpen(false)} />
          <div style={S.modal}>
            <button style={S.modalClose} onClick={() => setCtaOpen(false)}>&times;</button>
            {ctaSuccess ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 56, marginBottom: 16, color: '#22c55e' }}>✓</div>
                <h3 style={S.modalTitle}>已收到您的資訊</h3>
                <p style={S.modalDesc}>策略工程師將在 24 小時內與您聯繫</p>
                <button style={S.ctaBtn} onClick={() => setCtaOpen(false)}>關閉</button>
              </div>
            ) : (
              <>
                <h3 style={S.modalTitle}>聯絡策略工程師</h3>
                <p style={S.modalDesc}>留下聯絡方式，我們主動聯繫</p>
                <div style={S.quickLinks}>
                  <a href="https://line.me/R/ti/p/@orion_ai" target="_blank" rel="noopener noreferrer" style={S.quickBtn}>
                    <span style={{ fontSize: 22 }}>💬</span><span>LINE</span>
                  </a>
                  <a href="https://t.me/orion_ai_group" target="_blank" rel="noopener noreferrer" style={S.quickBtn}>
                    <span style={{ fontSize: 22 }}>✈</span><span>Telegram</span>
                  </a>
                </div>
                <div style={S.orDivider}><span style={S.orText}>或留下聯絡資訊</span></div>
                <div style={S.formGroup}>
                  <input type="text" placeholder="您的姓名（選填）" value={ctaForm.name}
                    onChange={e => setCtaForm(p => ({ ...p, name: e.target.value }))} style={S.formInput} />
                  <input type="text" placeholder="電話 / Email / LINE ID *" value={ctaForm.contact}
                    onChange={e => setCtaForm(p => ({ ...p, contact: e.target.value }))} style={S.formInput} />
                  <textarea placeholder="補充說明（選填）" value={ctaForm.note} rows={3}
                    onChange={e => setCtaForm(p => ({ ...p, note: e.target.value }))} style={S.formTextarea} />
                </div>
                <button onClick={handleCtaSubmit}
                  disabled={ctaSubmitting || !ctaForm.contact.trim()}
                  style={{ ...S.ctaBtn, width: '100%', opacity: ctaSubmitting || !ctaForm.contact.trim() ? .5 : 1 }}>
                  {ctaSubmitting ? '提交中...' : '提交聯絡資訊'}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ══════ 報告內容 ══════ */}
      <div style={S.container}>

        {/* Header */}
        <div style={S.header}>
          <p style={S.headerLabel}>ORION AI DIAGNOSTIC REPORT</p>
          <h1 style={S.headerTitle}>智能診斷報告</h1>
          <div style={S.headerLine} />
        </div>

        {/* ── 評分圓環（放大 + 動畫）── */}
        {report && (
          <div style={S.scoreWrap}>
            <div style={S.scoreRingOuter}>
              {/* 外光暈 */}
              <div style={{
                position: 'absolute', inset: -16,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${tier.bg} 0%, transparent 70%)`,
              }} />
              <svg viewBox="0 0 180 180" width="180" height="180" style={{ position: 'relative', zIndex: 1 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={tier.color} />
                    <stop offset="100%" stopColor="#e8c96a" />
                  </linearGradient>
                </defs>
                <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(201,168,76,.08)" strokeWidth="10" />
                <circle cx="90" cy="90" r="76" fill="none" stroke="url(#scoreGrad)" strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 76}
                  strokeDashoffset={2 * Math.PI * 76 * (1 - scoreAnimated / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.05s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <div style={S.scoreInner}>
                <span style={{ ...S.scoreNum, color: tier.color }}>{scoreAnimated}</span>
                <span style={S.scoreOf}>/100</span>
              </div>
            </div>
            <div style={{ ...S.scoreBadge, background: tier.bg, color: tier.color }}>{tier.label}</div>
            <p style={S.scoreSubLabel}>AI 賦能潛力指數</p>
          </div>
        )}

        {/* ── 四大卡片 ── */}
        {report && (
          <div style={S.cards}>

            {/* Card 1: 核心問題 */}
            <div style={S.card}>
              <div style={S.cardNum}>01</div>
              <div style={S.cardHead}>
                <span style={S.cardEmoji}>🔍</span>
                <h3 style={S.cardTitle}>{report.coreProblem.title}</h3>
              </div>
              <p style={S.cardBody}>{report.coreProblem.description}</p>
            </div>

            {/* Card 2: 痛點量化 */}
            <div style={{ ...S.card, ...S.cardAccent }}>
              <div style={S.cardNum}>02</div>
              <div style={S.cardHead}>
                <span style={S.cardEmoji}>📊</span>
                <h3 style={S.cardTitle}>{report.painQuantification.title}</h3>
              </div>
              {/* 大數字 metrics */}
              <div style={S.metricsGrid}>
                <div style={S.metricBox}>
                  <div style={S.metricBig}>{report.painQuantification.monthlyTimeLoss}</div>
                  <div style={S.metricSub}>每月時間損失</div>
                </div>
                <div style={S.metricDivider} />
                <div style={S.metricBox}>
                  <div style={S.metricBig}>{report.painQuantification.monthlyMoneyCost}</div>
                  <div style={S.metricSub}>每月金額成本</div>
                </div>
              </div>
              <p style={S.cardBody}>{report.painQuantification.description}</p>
            </div>

            {/* Card 3: AI 賦能方案 */}
            <div style={S.card}>
              <div style={S.cardNum}>03</div>
              <div style={S.cardHead}>
                <span style={S.cardEmoji}>⚡</span>
                <h3 style={S.cardTitle}>{report.aiSolution.title}</h3>
              </div>
              <div style={S.capList}>
                {report.aiSolution.capabilities.map((cap, i) => (
                  <div key={i} style={S.capRow}>
                    <span style={S.capCheck}>✦</span>
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
              <p style={S.cardBody}>{report.aiSolution.description}</p>
            </div>

            {/* Card 4: 建議首步行動 — Highlight */}
            <div style={{ ...S.card, ...S.cardGold }}>
              <div style={{ ...S.cardNum, color: '#0a0d14' }}>04</div>
              <div style={S.cardHead}>
                <span style={S.cardEmoji}>🚀</span>
                <h3 style={{ ...S.cardTitle, color: '#0a0d14' }}>{report.firstAction.title}</h3>
              </div>
              <div style={S.actionHighlight}>
                <p style={S.actionBig}>{report.firstAction.action}</p>
              </div>
              <p style={{ ...S.cardBody, color: 'rgba(10,13,20,.7)' }}>{report.firstAction.description}</p>
            </div>
          </div>
        )}

        {/* CTA 區 */}
        <div style={S.ctaSection}>
          <button onClick={handleContactEngineer} style={S.ctaBtn}>聯絡策略工程師</button>
          <button onClick={handleReAnalyze} style={S.ctaSecondary}>重新分析</button>
        </div>

        <div style={S.footer}>
          <p>Powered by ORION AI GROUP &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Styles — Dark Theme + Gold Accents + Mobile
   ═══════════════════════════════════════════════════ */
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh', background: '#0a0d14', color: '#e8e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
  },

  // Loading
  loadCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '0 24px' },
  loadRingWrap: { position: 'relative', width: 140, height: 140, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadPct: { position: 'absolute', fontSize: 28, fontWeight: 700, color: '#e8c96a', fontFamily: 'monospace' },
  loadTitle: { fontSize: 22, fontWeight: 700, color: '#e8c96a', marginBottom: 8 },
  loadSub: { fontSize: 11, letterSpacing: '.18em', color: '#5a6575', marginBottom: 36, fontFamily: 'monospace' },
  progressBar: { width: '100%', maxWidth: 340, height: 3, background: '#1a2235', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#c9a84c,#e8c96a)', transition: 'width .8s ease' },
  hintText: { marginTop: 28, fontSize: 13, color: '#7a8499', textAlign: 'center' as const, minHeight: 20 },

  // Hamburger
  hamburger: { position: 'fixed', top: 18, left: 18, zIndex: 100, background: 'rgba(10,13,20,.85)', border: '1px solid rgba(201,168,76,.3)', borderRadius: 8, padding: '10px 11px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4 },
  hbLine: { display: 'block', width: 18, height: 2, background: '#c9a84c', borderRadius: 1 },

  // Sidebar
  sbBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 89 },
  sidebar: { position: 'fixed', top: 0, left: 0, width: 260, height: '100vh', background: '#0d1120', borderRight: '1px solid rgba(201,168,76,.2)', zIndex: 90, display: 'flex', flexDirection: 'column' },
  sbHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 18px', borderBottom: '1px solid rgba(201,168,76,.15)' },
  sbTitle: { fontSize: 16, fontWeight: 700, color: '#c9a84c', letterSpacing: '.1em' },
  sbClose: { background: 'none', border: 'none', color: '#7a8499', fontSize: 24, cursor: 'pointer', lineHeight: 1 },
  sbNav: { padding: '12px 0', display: 'flex', flexDirection: 'column' },
  sbItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: 'none', border: 'none', color: '#c9cdd6', fontSize: 14, cursor: 'pointer', textAlign: 'left' as const },
  sbIcon: { fontSize: 16, color: '#c9a84c', width: 24, textAlign: 'center' as const },
  sbDivider: { height: 1, background: 'rgba(201,168,76,.12)', margin: '8px 18px' },

  // Container
  container: { maxWidth: 720, margin: '0 auto', padding: '52px 20px 32px' },

  // Header
  header: { textAlign: 'center' as const, marginBottom: 48 },
  headerLabel: { fontSize: 10, letterSpacing: '.25em', color: '#5a6575', marginBottom: 10, fontFamily: 'monospace' },
  headerTitle: { fontSize: 32, fontWeight: 800, color: '#e8c96a', marginBottom: 20, letterSpacing: '.02em' },
  headerLine: { height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', margin: '0 auto', maxWidth: 240 },

  // Score
  scoreWrap: { textAlign: 'center' as const, marginBottom: 52, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  scoreRingOuter: { position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180, marginBottom: 16 },
  scoreInner: { position: 'absolute', display: 'flex', alignItems: 'baseline', justifyContent: 'center', zIndex: 2 },
  scoreNum: { fontSize: 52, fontWeight: 800, fontFamily: 'monospace', lineHeight: 1 },
  scoreOf: { fontSize: 16, color: '#5a6575', marginLeft: 2, fontFamily: 'monospace' },
  scoreBadge: { padding: '6px 20px', borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: '.05em', marginBottom: 8 },
  scoreSubLabel: { fontSize: 12, color: '#5a6575', letterSpacing: '.08em' },

  // Cards
  cards: { display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 },
  card: {
    background: '#0d1120', border: '1px solid rgba(201,168,76,.15)', borderRadius: 16,
    padding: '28px 24px', position: 'relative', overflow: 'hidden',
  },
  cardAccent: { borderColor: 'rgba(201,168,76,.35)', background: 'linear-gradient(135deg, #0d1120 0%, #111a2e 100%)' },
  cardGold: {
    background: 'linear-gradient(135deg, #e8c96a 0%, #c9a84c 100%)',
    border: 'none', color: '#0a0d14',
  },
  cardNum: { position: 'absolute', top: 16, right: 20, fontSize: 48, fontWeight: 800, color: 'rgba(201,168,76,.06)', fontFamily: 'monospace', lineHeight: 1 },
  cardHead: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardEmoji: { fontSize: 20 },
  cardTitle: { fontSize: 18, fontWeight: 700, color: '#e8c96a' },
  cardBody: { fontSize: 14, lineHeight: 1.75, color: '#b0b8c4' },

  // Metrics (Card 2)
  metricsGrid: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 20, padding: '20px 0', borderTop: '1px solid rgba(201,168,76,.12)', borderBottom: '1px solid rgba(201,168,76,.12)' },
  metricBox: { flex: 1, textAlign: 'center' as const },
  metricBig: { fontSize: 28, fontWeight: 800, color: '#e8c96a', fontFamily: 'monospace', lineHeight: 1.2, marginBottom: 6 },
  metricSub: { fontSize: 11, color: '#7a8499', letterSpacing: '.03em' },
  metricDivider: { width: 1, height: 48, background: 'rgba(201,168,76,.2)', flexShrink: 0 },

  // Capabilities (Card 3)
  capList: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 },
  capRow: { display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#c9cdd6', lineHeight: 1.6 },
  capCheck: { color: '#c9a84c', fontSize: 16, fontWeight: 700, flexShrink: 0, marginTop: 2 },

  // Action (Card 4)
  actionHighlight: { background: 'rgba(10,13,20,.15)', borderRadius: 10, padding: '16px 20px', marginBottom: 16 },
  actionBig: { fontSize: 18, fontWeight: 700, color: '#0a0d14', textAlign: 'center' as const, lineHeight: 1.5 },

  // CTA
  ctaSection: { textAlign: 'center' as const, marginBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 },
  ctaBtn: { padding: '16px 56px', background: 'linear-gradient(135deg,#c9a84c,#e8c96a)', color: '#0a0d14', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '.04em', boxShadow: '0 4px 24px rgba(201,168,76,.25)' },
  ctaSecondary: { padding: '12px 40px', background: 'transparent', color: '#c9a84c', border: '1px solid rgba(201,168,76,.35)', borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' },

  // Modal
  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 200 },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 201, background: '#0d1120', border: '1px solid rgba(201,168,76,.25)', borderRadius: 20, padding: '36px 28px', width: '90%', maxWidth: 420, maxHeight: '85vh', overflowY: 'auto' as const },
  modalClose: { position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#7a8499', fontSize: 28, cursor: 'pointer', lineHeight: 1 },
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#e8c96a', marginBottom: 8, textAlign: 'center' as const },
  modalDesc: { fontSize: 13, color: '#7a8499', textAlign: 'center' as const, marginBottom: 24, lineHeight: 1.5 },
  quickLinks: { display: 'flex', gap: 12, marginBottom: 20 },
  quickBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 12px', background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.25)', borderRadius: 12, color: '#e8c96a', fontSize: 13, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' },
  orDivider: { position: 'relative', textAlign: 'center' as const, marginBottom: 20, borderBottom: '1px solid rgba(201,168,76,.15)', lineHeight: '0', paddingBottom: 0 },
  orText: { background: '#0d1120', padding: '0 14px', fontSize: 12, color: '#5a6575', position: 'relative', top: 8 },
  formGroup: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  formInput: { width: '100%', padding: '13px 16px', background: '#0a0d14', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, color: '#e8e8f0', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  formTextarea: { width: '100%', padding: '13px 16px', background: '#0a0d14', border: '1px solid rgba(201,168,76,.2)', borderRadius: 10, color: '#e8e8f0', fontSize: 14, outline: 'none', resize: 'vertical' as const, boxSizing: 'border-box' as const, fontFamily: 'inherit' },

  // Footer
  footer: { textAlign: 'center' as const, padding: '24px 0', fontSize: 11, color: '#3a4555', borderTop: '1px solid rgba(201,168,76,.08)' },
};
