import React, { useState, useEffect } from 'react';

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

export default function Report() {
  const [state, setState] = useState<PageState>('loading');
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  useEffect(() => {
    if (!sessionId) {
      setError('缺少 session 參數');
      setState('error');
      return;
    }

    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 8;
      if (progressValue > 90) progressValue = 90;
      setProgress(progressValue);
    }, 200);

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
        setError(err.name === 'AbortError' ? '分析超時，請重試' : '報告生成失敗');
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

  const handleContactEngineer = () => {
    window.open('https://line.me/R/', '_blank');
  };

  if (state === 'loading') {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingCenter}>
          <div style={styles.loadingIcon}>
            <svg viewBox="0 0 60 60" width="60" height="60">
              <circle cx="30" cy="30" r="26" fill="none" stroke="#c9a84c" strokeWidth="2" opacity="0.3" />
              <circle cx="30" cy="30" r="26" fill="none" stroke="#c9a84c" strokeWidth="2" strokeDasharray="163.36" strokeDashoffset={163.36 * (1 - progress / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.2s ease', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
            </svg>
            <span style={styles.loadingPercent}>{Math.round(progress)}%</span>
          </div>
          <h2 style={styles.loadingTitle}>AI 正在分析您的需求</h2>
          <p style={styles.loadingSubtitle}>ORION INTELLIGENCE ENGINE · GENERATING REPORT</p>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loadingCenter}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠</div>
          <h2 style={styles.loadingTitle}>{error}</h2>
          <button onClick={handleReAnalyze} style={styles.ctaButton}>
            重新分析
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <button onClick={() => setSidebarOpen(true)} style={styles.hamburger} aria-label="開啟選單">
        <span style={styles.hamburgerLine} />
        <span style={styles.hamburgerLine} />
        <span style={styles.hamburgerLine} />
      </button>

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
                <span style={styles.sidebarIcon}>↻</span>
                重新分析
              </button>
              <button onClick={handleContactEngineer} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>✉</span>
                聯絡工程師
              </button>
              <div style={styles.sidebarDivider} />
              <button onClick={() => { window.location.href = '/projects'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>◈</span>
                歷史案件
              </button>
              <button onClick={() => { window.location.href = '/services'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>☰</span>
                服務介紹
              </button>
              <button onClick={() => { window.location.href = '/contact'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>✆</span>
                聯絡我們
              </button>
              <div style={styles.sidebarDivider} />
              <button onClick={() => { window.location.href = '/'; }} style={styles.sidebarItem}>
                <span style={styles.sidebarIcon}>⌂</span>
                返回首頁
              </button>
            </div>
          </div>
        </>
      )}

      <div style={styles.reportContainer}>
        <div style={styles.reportHeader}>
          <p style={styles.reportLabel}>ORION AI DIAGNOSTIC REPORT</p>
          <h1 style={styles.reportTitle}>智能診斷報告</h1>
          <div style={styles.divider} />
        </div>

        {report && (
          <div style={styles.scoreSection}>
            <div style={styles.scoreRing}>
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(201,168,76,0.15)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="#c9a84c" strokeWidth="8" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - (report.overallScore || 75) / 100)} strokeLinecap="round" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              </svg>
              <span style={styles.scoreNumber}>{report.overallScore || 75}</span>
            </div>
            <p style={styles.scoreLabel}>AI 賦能潛力指數</p>
          </div>
        )}

        {report && (
          <div style={styles.cardsGrid}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◆</span>
                <h3 style={styles.cardTitle}>{report.coreProblem.title}</h3>
              </div>
              <p style={styles.cardText}>{report.coreProblem.description}</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◆</span>
                <h3 style={styles.cardTitle}>{report.painQuantification.title}</h3>
              </div>
              <div style={styles.metricsRow}>
                <div style={styles.metric}>
                  <span style={styles.metricValue}>{report.painQuantification.monthlyTimeLoss}</span>
                  <span style={styles.metricLabel}>每月時間損失</span>
                </div>
                <div style={styles.metricDivider} />
                <div style={styles.metric}>
                  <span style={styles.metricValue}>{report.painQuantification.monthlyMoneyCost}</span>
                  <span style={styles.metricLabel}>每月金錢成本</span>
                </div>
              </div>
              <p style={styles.cardText}>{report.painQuantification.description}</p>
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>◆</span>
                <h3 style={styles.cardTitle}>{report.aiSolution.title}</h3>
              </div>
              <div style={styles.capabilities}>
                {report.aiSolution.capabilities.map((cap, i) => (
                  <div key={i} style={styles.capItem}>
                    <span style={styles.capBullet}>›</span>
                    {cap}
                  </div>
                ))}
              </div>
              <p style={styles.cardText}>{report.aiSolution.description}</p>
            </div>

            <div style={{ ...styles.card, ...styles.cardHighlight }}>
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon}>★</span>
                <h3 style={styles.cardTitle}>{report.firstAction.title}</h3>
              </div>
              <div style={styles.actionBox}>
                <p style={styles.actionText}>{report.firstAction.action}</p>
              </div>
              <p style={styles.cardText}>{report.firstAction.description}</p>
            </div>
          </div>
        )}

        <div style={styles.ctaSection}>
          <button onClick={handleContactEngineer} style={styles.ctaButton}>
            聯絡策略工程師
          </button>
          <button onClick={handleReAnalyze} style={styles.ctaSecondary}>
            重新分析
          </button>
        </div>

        <div style={styles.footer}>
          <p>Powered by ORION AI GROUP © 2026</p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    minHeight: '100vh',
    background: '#0a0d14',
    color: '#e8e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
  },
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
  footer: {
    textAlign: 'center',
    padding: '20px 0',
    fontSize: 11,
    color: '#5a6575',
    borderTop: '1px solid rgba(201,168,76,0.1)',
  },
};
