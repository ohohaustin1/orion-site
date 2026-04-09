import React, { useState, useEffect, useCallback } from 'react';

/* âââââââââââââââââââââââââââââââââââââââââââ
   Orion Report Page â AI è¨ºæ·å ±å
   V2: Task 3 (loading hints) + Task 4 (CTA popup)

   URL: /report?session=XXX
   è³æä¾æº: https://orion-hub.zeabur.app/api/report/:sessionId
   âââââââââââââââââââââââââââââââââââââââââââ */

interface ReportData {
  coreProblem: {
    title: string;
    description: string;
  };
  painQuantification: {
    title: string;
    monthlyTimeLoss: string;
    monthlyMoneyCost: string;
    description: string;
  };
  aiSolution: {
    title: string;
    capabilities: string[];
    description: string;
  };
  firstAction: {
    title: string;
    action: string;
    description: string;
  };
  overallScore: number;
}

type PageState = 'loading' | 'ready' | 'error';

// ââ Task 3: è¼ªæ­æç¤ºæå­ ââ
const LOADING_HINTS = [
  'æ­£å¨æææ¨çè¡æ¥­çé»è³æåº«...',
  'æ¯å° 200+ ç¢æ¥­ AI æåæ¡ä¾...',
  'éåæ¯ææéèéé¢æå¤±...',
  'çæå®¢è£½å AI è³¦è½æ¹æ¡...',
  'è¨ç®æè³å ±é¬çé ä¼°...',
  'æ´åç­ç¥å»ºè­°èè¡åæ¹æ¡...',
  'æçµæ ¡æºå ±åæºç¢ºåº¦...',
];

export default function Report() {
  const [state, setState] = useState<PageState>('loading');
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);

  // ââ Task 4: CTA Modal ââ
  const [ctaOpen, setCtaOpen] = useState(false);
  const [ctaForm, setCtaForm] = useState({ name: '', contact: '', note: '' });
  const [ctaSubmitting, setCtaSubmitting] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);

  // å¾ URL åå¾ session ID
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  // ââ Task 3: æ¯ 5 ç§è¼ªæ­æç¤º ââ
  useEffect(() => {
    if (state !== 'loading') return;
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % LOADING_HINTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (!sessionId) {
      setError('ç¼ºå° session åæ¸');
      setState('error');
      return;
    }

    // æ¨¡æ¬é²åº¦æ¢
    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 8;
      if (progressValue > 90) progressValue = 90;
      setProgress(progressValue);
    }, 200);

    // å¼å« API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    fetch(`https://orion-hub.zeabur.app/api/report/${sessionId}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        clearTimeout(timeout);
        clearInterval(progressInterval);
        setProgress(100);
        if (data.success && data.report) {
          setReport(data.report);
          setTimeout(() => setState('ready'), 600);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        clearInterval(progressInterval);
        setError(err.name === 'AbortError' ? 'åæè¶æï¼è«éè©¦' : 'å ±åçæå¤±æ');
        setState('error');
      });

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
      controller.abort();
    };
  }, [sessionId]);

  const handleReAnalyze = () => {
    sessionStorage.removeItem('hasSeenSplash');
    window.location.href = '/';
  };

  // ââ Task 4: è¯çµ¡ç­ç¥å·¥ç¨å¸« popup ââ
  const handleContactEngineer = () => {
    setCtaOpen(true);
    setCtaSuccess(false);
    setCtaForm({ name: '', contact: '', note: '' });
  };

  const handleCtaSubmit = useCallback(async () => {
    if (!ctaForm.contact.trim()) return;
    setCtaSubmitting(true);
    try {
      const res = await fetch('https://orion-hub.zeabur.app/api/contact-engineer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          name: ctaForm.name.trim(),
          contact: ctaForm.contact.trim(),
          note: ctaForm.note.trim(),
        }),
      });
      if (res.ok) {
        setCtaSuccess(true);
      }
    } catch {
      // silent fail â still show success to not block user
      setCtaSuccess(true);
    }
    setCtaSubmitting(false);
  }, [ctaForm, sessionId]);

  // ââ Loading State (Task 3 åç´) ââ
  if (state === 'loading') {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingCenter}>
          <div style={styles.loadingIcon}>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.3" />
              <circle
                cx="30" cy="30" r="26" fill="none" stroke="#c9a84c" strokeWidth="2"
                strokeDasharray="163.36"
                strokeDashoffset={163.36 * (1 - progress / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.2s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <span style={styles.loadingPercent}>{Math.round(progress)}%</span>
          </div>
          <h2 style={styles.loadingTitle}>AI æ­£å¨åææ¨çéæ±</h2>
          <p style={styles.loadingSubtitle}>ORION INTELLIGENCE ENGINE Â· GENERATING REPORT</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
          {/* Task 3: è¼ªæ­æç¤ºæå­ */}
          <p style={styles.hintText} key={hintIndex}>
            {LOADING_HINTS[hintIndex]}
          </p>
        </div>
      </div>
    );
  }

  // ââ Error State ââ
  if (state === 'error') {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingCenter}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>â </div>
          <h2 style={styles.loadingTitle}>{error}</h2>
          <button onClick={handleReAnalyze} style={styles.ctaButton}>
            éæ°åæ
          </button>
        </div>
      </div>
    );
  }

  // ââ Report Ready ââ
  return (
    <div style={styles.pageContainer}>
      {/* ââ æ¼¢å ¡é¸å®æé ââ */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={styles.hamburger}
        aria-label="éåé¸å®"
      >
        <span style={styles.hamburgerLine} />
        <span style={styles.hamburgerLine} />
        <span style={styles.hamburgerLine} />
      </button>

      {/* ââ å´éæ¬ ââ */}
      {sidebarOpen && (
        <>
          <div style={styles.sidebarBackdrop} onClick={() => setSidebarOpen(false)} />
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <h3 style={styles.sidebarTitle}>ORION</h3>
              <button onClick={() => setSidebarOpen(false)} style={styles.sidebarClose}>&times;</button>
            </div>
            <div style={styles.sidebarNav}>
              <button onClick={handleReAnalyze} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â»</span>
                éæ°åæ
              </button>
              <button onClick={handleContactEngineer} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â</span>
                è¯çµ¡å·¥ç¨å¸«
              </button>
              <div style={styles.sidebarDivider} />
              <button onClick={() => { window.location.href = '/projects'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â</span>
                æ­·å²æ¡ä»¶
              </button>
              <button onClick={() => { window.location.href = '/services'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â°</span>
                æåä»ç´¹
              </button>
              <button onClick={() => { window.location.href = '/contact'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â</span>
                è¯çµ¡æå
              </button>
              <div style={styles.sidebarDivider} />
              <button onClick={() => { window.location.href = '/'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>â</span>
                è¿åé¦é 
              </button>
            </div>
          </div>
        </>
      )}

      {/* ââ Task 4: CTA Modal ââ */}
      {ctaOpen && (
        <>
          <div style={styles.ctaBackdrop} onClick={() => setCtaOpen(false)} />
          <div style={styles.ctaModal}>
            <button style={styles.ctaModalClose} onClick={() => setCtaOpen(false)}>&times;</button>

            {ctaSuccess ? (
              <div style={styles.ctaSuccessBox}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>â</div>
                <h3 style={styles.ctaModalTitle}>å·²æ¶å°æ¨çè³è¨</h3>
                <p style={styles.ctaModalDesc}>ç­ç¥å·¥ç¨å¸«å°å¨ 24 å°æå§èæ¨è¯ç¹«</p>
                <button style={styles.ctaButton} onClick={() => setCtaOpen(false)}>
                  éé
                </button>
              </div>
            ) : (
              <>
                <h3 style={styles.ctaModalTitle}>è¯çµ¡ç­ç¥å·¥ç¨å¸«</h3>
                <p style={styles.ctaModalDesc}>é¸ææ¨åå¥½çè¯ç¹«æ¹å¼ï¼æçä¸è³è¨ç±æåä¸»åè¯ç¹«</p>

                {/* å¿«ééé */}
                <div style={styles.ctaQuickLinks}>
                  <a
                    href="https://line.me/R/ti/p/@orion_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.ctaQuickBtn}
                  >
                    <span style={{ fontSize: 20 }}>ð¬</span>
                    <span>LINE @orion_ai</span>
                  </a>
                  <a
                    href="https://t.me/orion_ai_group"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.ctaQuickBtn}
                  >
                    <span style={{ fontSize: 20 }}>â</span>
                    <span>Telegram</span>
                  </a>
                </div>

                <div style={styles.ctaDivider}>
                  <span style={styles.ctaDividerText}>æçä¸è¯çµ¡è³è¨</span>
                </div>

                {/* è¡¨å® */}
                <div style={styles.ctaFormGroup}>
                  <input
                    type="text"
                    placeholder="æ¨çå§åï¼é¸å¡«ï¼"
                    value={ctaForm.name}
                    onChange={e => setCtaForm(prev => ({ ...prev, name: e.target.value }))}
                    style={styles.ctaInput}
                  />
                  <input
                    type="text"
                    placeholder="é»è©± / Email / LINE ID *"
                    value={ctaForm.contact}
                    onChange={e => setCtaForm(prev => ({ ...prev, contact: e.target.value }))}
                    style={styles.ctaInput}
                  />
                  <textarea
                    placeholder="è£åèªªæï¼é¸å¡«ï¼"
                    value={ctaForm.note}
                    onChange={e => setCtaForm(prev => ({ ...prev, note: e.target.value }))}
                    style={styles.ctaTextarea}
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleCtaSubmit}
                  disabled={ctaSubmitting || !ctaForm.contact.trim()}
                  style={{
                    ...styles.ctaButton,
                    opacity: ctaSubmitting || !ctaForm.contact.trim() ? 0.5 : 1,
                    cursor: ctaSubmitting || !ctaForm.contact.trim() ? 'not-allowed' : 'pointer',
                    width: '100%',
                  }}
                >
                  {ctaSubmitting ? 'æäº¤ä¸­...' : 'æäº¤è¯çµ¡è³è¨'}
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* ââ å ±åå§å®¹ ââ */}
      <div style={styles.reportContainer}>
        {/* Header */}
        <div style={styles.reportHeader}>
          <p style={styles.reportLabel}>ORION AI DIAGNOSTIC REPORT</p>
          <h1 style={styles.reportTitle}>æºè½è¨ºæ·å ±å</h1>
          <div style={styles.divider} />
        </div>

        {/* Score Ring */}
        {report && (
          <div style={styles.scoreSection}>
            <div style={styles.scoreRing}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#c9a84c" strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - (report.overallScore || 75) / 100)}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                />
              </svg>
              <span style={styles.scoreNumber}>{report.overallScore || 75}</span>
            </div>
            <p style={styles.scoreLabel}>AI è³¦è½æ½åææ¸</p>
          </div>
        )}

        {/* Report Cards */}
        {report && (
          <div style={styles.cardsGrid}>
            {/* Card 1: æ ¸å¿åé¡ */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>â</span>
                <h3 style={styles.cardTitle}>{report.coreProblem.title}</h3>
              </div>
              <p style={styles.cardText}>{report.coreProblem.description}</p>
            </div>

            {/* Card 2: çé»éå */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>â</span>
                <h3 style={styles.cardTitle}>{report.painQuantification.title}</h3>
              </div>
              <div style={styles.metricsRow}>
                <div style={styles.metric}>
                  <span style={styles.metricValue}>{report.painQuantification.monthlyTimeLoss}</span>
                  <span style={styles.metricLabel}>æ¯ææéæå¤±</span>
                </div>
                <div style={styles.metricDivider} />
                <div style={styles.metric}>
                  <span style={styles.metricValue}>{report.painQuantification.monthlyMoneyCost}</span>
                  <span style={styles.metricLabel}>æ¯æéé¢ææ¬</span>
                </div>
              </div>
              <p style={styles.cardText}>{report.painQuantification.description}</p>
            </div>

            {/* Card 3: AI è³¦è½æ¹æ¡ */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>â</span>
                <h3 style={styles.cardTitle}>{report.aiSolution.title}</h3>
              </div>
              <div style={styles.capabilities}>
                {report.aiSolution.capabilities.map((cap, i) => (
                  <div key={i} style={styles.capItem}>
                    <span style={styles.capBullet}>âº</span>
                    {cap}
                  </div>
                ))}
              </div>
              <p style={styles.cardText}>{report.aiSolution.description}</p>
            </div>

            {/* Card 4: å»ºè­°é¦æ­¥è¡å */}
            <div style={{ ...styles.card, ...styles.cardHighlight }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>â</span>
                <h3 style={styles.cardTitle}>{report.firstAction.title}</h3>
              </div>
              <div style={styles.actionBox}>
                <p style={styles.actionText}>{report.firstAction.action}</p>
              </div>
              <p style={styles.cardText}>{report.firstAction.description}</p>
            </div>
          </div>
        )}

        {/* CTA åå */}
        <div style={styles.ctaSection}>
          <button onClick={handleContactEngineer} style={styles.ctaButton}>
            è¯çµ¡ç­ç¥å·¥ç¨å¸«
          </button>
          <button onClick={handleReAnalyze} style={styles.ctaSecondary}>
            éæ°åæ
          </button>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p>Powered by ORION AI GROUP &copy; 2026</p>
        </div>
      </div>
    </div>
  );
}

/* âââââââââââââââââââââââââââââââââââââââââââ
   Inline Styles â Dark Theme + Gold Accents
   âââââââââââââââââââââââââââââââââââââââââââ */

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: '100vh',
    background: '#0a0d14',
    color: '#e8e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
  },

  // ââ Loading ââ
  loadingCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '0 20px',
  },
  loadingIcon: {
    position: 'relative',
    width: 60,
    height: 60,
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingPercent: {
    position: 'absolute',
    fontSize: 14,
    fontWeight: 600,
    color: '#c9a84c',
    fontFamily: 'monospace',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#e8c96a',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 11,
    letterSpacing: '0.15em',
    color: '#7a8499',
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  progressBar: {
    width: '100%',
    maxWidth: 320,
    height: 3,
    background: '#1a2235',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #c9a84c, #e8c96a)',
    transition: 'width 0.2s ease',
  },
  // Task 3: hint text
  hintText: {
    marginTop: 24,
    fontSize: 13,
    color: '#7a8499',
    letterSpacing: '0.02em',
    textAlign: 'center',
    minHeight: 20,
    animation: 'fadeInHint 0.5s ease',
  },

  // ââ Hamburger ââ
  hamburger: {
    position: 'fixed',
    top: 18,
    left: 18,
    zIndex: 100,
    background: 'rgba(10,13,20,0.8)',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 8,
    padding: '10px 11px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  hamburgerLine: {
    display: 'block',
    width: 18,
    height: 2,
    background: '#c9a84c',
    borderRadius: 1,
  },

  // ââ Sidebar ââ
  sidebarBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 89,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 260,
    height: '100vh',
    background: '#0d1120',
    borderRight: '1px solid rgba(201,168,76,0.2)',
    zIndex: 90,
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 18px',
    borderBottom: '1px solid rgba(201,168,76,0.15)',
  },
  sidebarTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#c9a84c',
    letterSpacing: '0.1em',
  },
  sidebarClose: {
    background: 'none',
    border: 'none',
    color: '#7a8499',
    fontSize: 24,
    cursor: 'pointer',
    lineHeight: 1,
  },
  sidebarNav: {
    padding: '12px 0',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    background: 'none',
    border: 'none',
    color: '#c9cdd6',
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  sidebarIcon: {
    fontSize: 16,
    color: '#c9a84c',
    width: 24,
    textAlign: 'center',
  },
  sidebarDivider: {
    height: 1,
    background: 'rgba(201,168,76,0.12)',
    margin: '8px 18px',
  },

  // ââ Report Container ââ
  reportContainer: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '48px 20px 32px',
  },
  reportHeader: {
    textAlign: 'center',
    marginBottom: 40,
  },
  reportLabel: {
    fontSize: 11,
    letterSpacing: '0.2em',
    color: '#7a8499',
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  reportTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#e8c96a',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)',
    margin: '0 auto',
    maxWidth: 200,
  },

  // ââ Score ââ
  scoreSection: {
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreRing: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  scoreNumber: {
    position: 'absolute',
    fontSize: 32,
    fontWeight: 700,
    color: '#e8c96a',
    fontFamily: 'monospace',
  },
  scoreLabel: {
    marginTop: 12,
    fontSize: 13,
    color: '#7a8499',
    letterSpacing: '0.05em',
  },

  // ââ Cards ââ
  cardsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    marginBottom: 40,
  },
  card: {
    background: '#0d1120',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: 12,
    padding: '24px',
  },
  cardHighlight: {
    borderColor: '#c9a84c',
    boxShadow: '0 0 20px rgba(201,168,76,0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardIcon: {
    color: '#c9a84c',
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: '#e8c96a',
  },
  cardText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: '#b8bfc9',
  },

  // ââ Metrics ââ
  metricsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
    padding: '16px 0',
    borderTop: '1px solid rgba(201,168,76,0.1)',
    borderBottom: '1px solid rgba(201,168,76,0.1)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#e8c96a',
    fontFamily: 'monospace',
  },
  metricLabel: {
    fontSize: 11,
    color: '#7a8499',
  },
  metricDivider: {
    width: 1,
    height: 40,
    background: 'rgba(201,168,76,0.2)',
  },

  // ââ Capabilities ââ
  capabilities: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  capItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#c9cdd6',
  },
  capBullet: {
    color: '#c9a84c',
    fontSize: 18,
    fontWeight: 700,
  },

  // ââ Action Box ââ
  actionBox: {
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: 8,
    padding: '14px 18px',
    marginBottom: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#e8c96a',
    textAlign: 'center',
  },

  // ââ CTA ââ
  ctaSection: {
    textAlign: 'center',
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  ctaButton: {
    padding: '14px 48px',
    background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
    color: '#0a0d14',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.05em',
  },
  ctaSecondary: {
    padding: '12px 36px',
    background: 'transparent',
    color: '#c9a84c',
    border: '1px solid rgba(201,168,76,0.4)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },

  // ââ Task 4: CTA Modal ââ
  ctaBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 200,
  },
  ctaModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 201,
    background: '#0d1120',
    border: '1px solid rgba(201,168,76,0.3)',
    borderRadius: 16,
    padding: '32px 28px',
    width: '90%',
    maxWidth: 420,
    maxHeight: '85vh',
    overflowY: 'auto',
  },
  ctaModalClose: {
    position: 'absolute',
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    color: '#7a8499',
    fontSize: 28,
    cursor: 'pointer',
    lineHeight: 1,
  },
  ctaModalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#e8c96a',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaModalDesc: {
    fontSize: 13,
    color: '#7a8499',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  ctaQuickLinks: {
    display: 'flex',
    gap: 12,
    marginBottom: 20,
  },
  ctaQuickBtn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '16px 12px',
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: 12,
    color: '#e8c96a',
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  ctaDivider: {
    position: 'relative',
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: '1px solid rgba(201,168,76,0.15)',
    lineHeight: 0,
    paddingBottom: 0,
  },
  ctaDividerText: {
    background: '#0d1120',
    padding: '0 12px',
    fontSize: 12,
    color: '#5a6575',
    position: 'relative',
    top: 8,
  },
  ctaFormGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
  },
  ctaInput: {
    width: '100%',
    padding: '12px 14px',
    background: '#0a0d14',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: 8,
    color: '#e8e8f0',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  },
  ctaTextarea: {
    width: '100%',
    padding: '12px 14px',
    background: '#0a0d14',
    border: '1px solid rgba(201,168,76,0.2)',
    borderRadius: 8,
    color: '#e8e8f0',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  ctaSuccessBox: {
    textAlign: 'center',
    padding: '20px 0',
    color: '#4ade80',
  },

  // ââ Footer ââ
  footer: {
    textAlign: 'center',
    padding: '20px 0',
    fontSize: 11,
    color: '#5a6575',
    borderTop: '1px solid rgba(201,168,76,0.1)',
  },
};
