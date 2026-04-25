import React, { useState, useEffect, useCallback } from 'react';

/*
 ═══════════════════════════════════════════════════
  Orion Report Page — V3.1 解鎖版
  深色金色主題 / 40% 免費 + 解鎖閘門 + 60% 鎖定
  Session ID 驗證 / Email 解鎖 / 帳號登入
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
type UnlockMode = 'email' | 'account' | null;

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

  // ── 補充需求分析升級 ──
  const [refineInput, setRefineInput] = useState('');
  const [refineLoading, setRefineLoading] = useState(false);
  const [refineError, setRefineError] = useState('');
  const [reportVersion, setReportVersion] = useState(1);
  const [showLengthWarning, setShowLengthWarning] = useState(false);

  // ── 解鎖狀態 ──
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockMode, setUnlockMode] = useState<UnlockMode>(null);
  const [unlockEmail, setUnlockEmail] = useState('');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlockSubmitting, setUnlockSubmitting] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  // P0-01：Chairman 深聊請求按鈕狀態
  const [consultationState, setConsultationState] =
    useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // ── 檢查 session_id ──
  useEffect(() => {
    if (!sessionId) {
      setError('無效的分析連結，請重新進行診斷');
      setState('error');
      return;
    }
    // session_id 存在，繼續載入
  }, [sessionId]);

  // ── P0-01：開信追蹤 pixel（fire-and-forget、失敗不影響使用者） ──
  useEffect(() => {
    if (!sessionId) return;
    fetch(`https://orion-hub.zeabur.app/api/reports/${sessionId}/track-open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: 'web-view' }),
    }).catch(() => { /* 靜默 */ });
  }, [sessionId]);

  // ── P0-01：請求 Chairman 深聊 ──
  const handleRequestConsultation = useCallback(async () => {
    if (!sessionId || consultationState === 'submitting' || consultationState === 'success') return;
    setConsultationState('submitting');
    try {
      const res = await fetch(
        `https://orion-hub.zeabur.app/api/leads/${sessionId}/request-consultation`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) setConsultationState('success');
      else setConsultationState('error');
    } catch {
      setConsultationState('error');
    }
  }, [sessionId, consultationState]);

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
    if (!sessionId) return;

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
  }, [sessionId]);

  // ── Email 解鎖 ──
  const handleEmailUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setUnlockError('請輸入有效的電子郵件');
      return;
    }
    setUnlockSubmitting(true);
    setUnlockError('');
    try {
      const res = await fetch('https://orion-hub.zeabur.app/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          email: unlockEmail,
          unlock_method: 'email'
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) {
        setIsUnlocked(true);
        setUnlockMode('email');
        localStorage.setItem(`unlock_${sessionId}`, 'true');
      } else {
        setUnlockError(data.error || '解鎖失敗，請重試');
      }
    } catch (err: any) {
      setUnlockError(err.message || '網路錯誤');
    } finally {
      setUnlockSubmitting(false);
    }
  };

  // ── 帳號登入 ──
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setUnlockError('請輸入有效的電子郵件');
      return;
    }
    if (unlockPassword.length < 6) {
      setUnlockError('密碼至少 6 個字元');
      return;
    }
    setUnlockSubmitting(true);
    setUnlockError('');
    try {
      const res = await fetch('https://orion-hub.zeabur.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: unlockEmail,
          password: unlockPassword,
          session_id: sessionId
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        setIsUnlocked(true);
        setUnlockMode('account');
        localStorage.setItem(`unlock_${sessionId}`, 'true');
      } else {
        setUnlockError(data.error || '登入失敗，請檢查帳號密碼');
      }
    } catch (err: any) {
      setUnlockError(err.message || '網路錯誤');
    } finally {
      setUnlockSubmitting(false);
    }
  };

  // ── 補充需求重新生成 ──
  const handleRefine = async () => {
    const trimmed = refineInput.trim();
    if (trimmed.length < 15) {
      // 顯示閃爍提醒但不阻擋
      setShowLengthWarning(true);
      setTimeout(() => setShowLengthWarning(false), 1600);
    }
    if (trimmed.length < 15) {
      // 太短仍然送出但後端會擋 — 這裡前端也擋
      setRefineError('補充描述至少需要 15 個字');
      return;
    }
    if (trimmed.length > 800) {
      setRefineError('補充描述不可超過 800 字');
      return;
    }

    setRefineLoading(true);
    setRefineError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      const res = await fetch('https://orion-hub.zeabur.app/api/report/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, extra_input: trimmed }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || `HTTP ${res.status}`);
      }
      if (data.success && data.report) {
        setReport(data.report);
        setReportVersion(data.version || reportVersion + 1);
        setRefineInput('');
        // 重新觸發分數動畫
        setScoreAnimated(0);
      } else {
        throw new Error(data.error || '生成失敗');
      }
    } catch (err: any) {
      setRefineError(
        err.name === 'AbortError'
          ? 'AI 回應逾時，請重試'
          : err.message || '生成失敗，請重試'
      );
    } finally {
      setRefineLoading(false);
    }
  };

  // ── Render 補充需求區塊 ──
  const renderRefineSection = () => {
    const charCount = refineInput.trim().length;
    const charColor = charCount >= 15 ? '#4ade80' : '#f59e0b';
    return (
      <div className="refine-section">
        <div className="refine-title">補充您的需求，獲得更精準的策略</div>
        <div className="refine-textarea-wrapper">
          <textarea
            className="refine-textarea"
            placeholder="例如：預算有限、需要3個月內見效、團隊只有2人..."
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            disabled={refineLoading}
            maxLength={800}
          />
          <div className="refine-char-count" style={{ color: charColor }}>
            已輸入 {charCount} 字 / 建議 15 字以上
          </div>
        </div>
        <p className="refine-hint-red">
          🔴 重要提醒：描述越具體（預算 / 人力 / 時間 / 客群），策略會更精準
        </p>
        <button
          className="refine-button"
          onClick={handleRefine}
          disabled={refineLoading}
        >
          {refineLoading ? '正在根據補充條件優化策略...' : '重新生成分析'}
        </button>
        {showLengthWarning && (
          <div className="refine-length-warning">
            描述建議更具體一些，以獲得最佳策略建議
          </div>
        )}
        {refineError && <div className="refine-error">{refineError}</div>}
      </div>
    );
  };

  // ── Render 解鎖閘門 ──
  const renderUnlockGate = () => (
    <div className="unlock-gate">
      <div className="unlock-header">
        <div className="unlock-title">🔒 解鎖完整 AI 分析報告</div>
        <div className="unlock-subtitle">選擇一種方式繼續，即可查看完整策略、建議與落地方案</div>
      </div>

      {unlockError && <div className="unlock-error">{unlockError}</div>}

      {/* Email 快速解鎖 */}
      <div className="unlock-section">
        <div className="unlock-section-title">─── 快速解鎖（推薦）───</div>
        <form onSubmit={handleEmailUnlock} className="unlock-form">
          <input
            type="email"
            placeholder="輸入您的電子郵件"
            value={unlockEmail}
            onChange={(e) => setUnlockEmail(e.target.value)}
            disabled={unlockSubmitting}
            className="unlock-input"
          />
          <button
            type="submit"
            disabled={unlockSubmitting}
            className="unlock-button"
          >
            {unlockSubmitting ? '解鎖中...' : '👉 立即解鎖'}
          </button>
        </form>
      </div>

      {/* 帳號登入 */}
      <div className="unlock-section">
        <div className="unlock-section-title">─── 或使用帳號登入 ───</div>
        <form onSubmit={handleAccountLogin} className="unlock-form">
          <input
            type="email"
            placeholder="電子郵件"
            value={unlockEmail}
            onChange={(e) => setUnlockEmail(e.target.value)}
            disabled={unlockSubmitting}
            className="unlock-input"
          />
          <input
            type="password"
            placeholder="密碼"
            value={unlockPassword}
            onChange={(e) => setUnlockPassword(e.target.value)}
            disabled={unlockSubmitting}
            className="unlock-input"
          />
          <button
            type="submit"
            disabled={unlockSubmitting}
            className="unlock-button"
          >
            {unlockSubmitting ? '登入中...' : '👉 登入並解鎖'}
          </button>
          <div className="unlock-forgot">
            忘記密碼？→ <span className="text-gold">請聯絡客服</span>
          </div>
        </form>
      </div>

      {/* SSO（disabled） */}
      <div className="unlock-section">
        <div className="unlock-section-title">─── 或一鍵登入（即將推出）───</div>
        <div className="unlock-sso">
          <button className="sso-button" disabled title="即將推出">
            使用 Google 繼續
          </button>
          <button className="sso-button" disabled title="即將推出">
            使用 Apple 繼續
          </button>
          <button className="sso-button" disabled title="即將推出">
            使用 Facebook 繼續
          </button>
        </div>
      </div>
    </div>
  );

  // ── 40% 免費內容 ──
  const renderFreeContent = () => (
    <div className="free-content">
      <div className="score-ring-container">
        <svg className="score-ring" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#e8c96a', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#d4a853', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          {/* 背景圓環 */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(212, 168, 83, 0.1)" strokeWidth="8" />
          {/* 進度圓環 */}
          <circle
            cx="100" cy="100" r="85" fill="none" stroke="url(#gold-grad)" strokeWidth="8"
            strokeDasharray={`${(scoreAnimated / 100) * 2 * Math.PI * 85} ${2 * Math.PI * 85}`}
            strokeLinecap="round"
            className="score-progress"
          />
          {/* 分數文字 */}
          <text x="100" y="85" textAnchor="middle" className="score-number">{scoreAnimated}</text>
          <text x="100" y="110" textAnchor="middle" className="score-label">AI 就緒度</text>
        </svg>
      </div>

      {/* 核心問題 */}
      {report?.coreProblem && (
        <div className="card card-1">
          <div className="card-number">01</div>
          <div className="card-title">{report.coreProblem.title}</div>
          <div className="card-text">{report.coreProblem.description}</div>
        </div>
      )}

      {/* 痛點量化 */}
      {report?.painQuantification && (
        <div className="card card-2">
          <div className="card-number">02</div>
          <div className="card-title">{report.painQuantification.title}</div>
          <div className="metrics-row">
            <div className="metric">
              <div className="metric-value">{report.painQuantification.monthlyTimeLoss}</div>
              <div className="metric-label">月時間損失</div>
            </div>
            <div className="metric">
              <div className="metric-value">{report.painQuantification.monthlyMoneyCost}</div>
              <div className="metric-label">月費用損失</div>
            </div>
          </div>
          <div className="card-text">{report.painQuantification.description}</div>
        </div>
      )}

      {/* 模糊遮罩 */}
      <div className="blur-overlay"></div>
    </div>
  );

  // ── 60% 鎖定內容 ──
  const renderLockedContent = () => (
    <div className="locked-content">
      {/* AI 解決方案 */}
      {report?.aiSolution && (
        <div className="card card-3">
          <div className="card-number">03</div>
          <div className="card-title">{report.aiSolution.title}</div>
          <div className="capabilities-list">
            {report.aiSolution.capabilities.map((cap, i) => (
              <div key={i} className="capability-item">✓ {cap}</div>
            ))}
          </div>
          <div className="card-text">{report.aiSolution.description}</div>
        </div>
      )}

      {/* 第一步行動 */}
      {report?.firstAction && (
        <div className="card card-4">
          <div className="card-number">04</div>
          <div className="card-title">{report.firstAction.title}</div>
          <div className="action-box">{report.firstAction.action}</div>
          <div className="card-text">{report.firstAction.description}</div>
        </div>
      )}

      {/* P0-01：Chairman 親筆 CTA */}
      <div className="chairman-cta">
        <div className="chairman-cta-label">Chairman 親筆</div>
        <div className="chairman-cta-quote">
          根據你今天說的情況，我建議你優先處理「<span className="chairman-cta-highlight">{report?.coreProblem?.title || '你提到的核心問題'}</span>」。<br />
          這種問題我們看過很多次、通常 6-12 週可以見效。<br />
          我想跟你聊 30 分鐘、把方向確認清楚。
        </div>
        <div className="chairman-cta-sign">— Austin（Chairman）</div>

        {consultationState === 'success' ? (
          <div className="chairman-cta-success">
            ✅ 已收到！Chairman 通常 1 小時內聯絡。
          </div>
        ) : (
          <button
            className="chairman-cta-btn"
            onClick={handleRequestConsultation}
            disabled={consultationState === 'submitting'}
          >
            {consultationState === 'submitting' ? '送出中…' : '我想跟 Chairman 深聊 30 分鐘'}
          </button>
        )}
        {consultationState === 'error' && (
          <div className="chairman-cta-error">送出失敗、請稍後重試</div>
        )}
      </div>
    </div>
  );

  // ── 主渲染 ──
  if (state === 'error') {
    return (
      <div className="report-container error-state">
        <div className="error-box">
          <div className="error-icon">⚠️</div>
          <div className="error-title">{error}</div>
          <button onClick={() => window.location.href = '/'} className="error-button">
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (state === 'loading') {
    return (
      <div className="report-container loading-state">
        <div className="loading-box">
          <div className="loading-ring"></div>
          <div className="loading-hint">{LOADING_HINTS[hintIndex]?.text}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <style>{CSS_STYLES}</style>

      {/* 版本標籤 */}
      {reportVersion > 1 && (
        <div className="version-badge">V{reportVersion} 策略已更新</div>
      )}

      {renderFreeContent()}

      {!isUnlocked ? (
        renderUnlockGate()
      ) : (
        <>
          {renderLockedContent()}
          {renderRefineSection()}
        </>
      )}
    </div>
  );
}

const CSS_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0d14;
    color: #e8eaf0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans TC', sans-serif;
  }

  .report-container {
    min-height: 100vh;
    padding: 20px;
    background: linear-gradient(135deg, #0a0d14 0%, #0c1024 100%);
    position: relative;
    overflow-y: auto;
  }

  .report-container.error-state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-box {
    text-align: center;
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid #f43f5e;
    border-radius: 8px;
    padding: 40px;
    max-width: 400px;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .error-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #f43f5e;
  }

  .error-button {
    background: #d4a853;
    color: #0a0d14;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .error-button:hover {
    background: #e8c96a;
  }

  .report-container.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-box {
    text-align: center;
    background: rgba(212, 168, 83, 0.05);
    border: 1px solid rgba(212, 168, 83, 0.2);
    border-radius: 8px;
    padding: 40px;
    max-width: 400px;
  }

  .loading-ring {
    width: 60px;
    height: 60px;
    border: 3px solid rgba(212, 168, 83, 0.2);
    border-top-color: #d4a853;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 24px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-hint {
    font-size: 14px;
    color: #8a93a8;
    margin-bottom: 16px;
  }

  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(212, 168, 83, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 16px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #d4a853, #e8c96a);
    transition: width 0.3s ease;
  }

  .free-content {
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }

  .score-ring-container {
    display: flex;
    justify-content: center;
    margin-bottom: 40px;
  }

  .score-ring {
    width: 200px;
    height: 200px;
    filter: drop-shadow(0 0 30px rgba(212, 168, 83, 0.3));
  }

  .score-number {
    font-size: 48px;
    font-weight: 700;
    fill: #e8c96a;
  }

  .score-label {
    font-size: 12px;
    fill: #8a93a8;
  }

  .card {
    background: rgba(17, 24, 39, 0.8);
    border: 1px solid rgba(212, 168, 83, 0.2);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, rgba(212, 168, 83, 0.5), transparent);
  }

  .card-number {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 48px;
    font-weight: 900;
    color: rgba(212, 168, 83, 0.1);
    line-height: 1;
  }

  .card-title {
    font-size: 18px;
    font-weight: 700;
    color: #e8c96a;
    margin-bottom: 12px;
  }

  .card-text {
    font-size: 14px;
    color: #8a93a8;
    line-height: 1.8;
  }

  .card-2 .metrics-row {
    display: flex;
    gap: 24px;
    margin: 16px 0;
  }

  .metric {
    flex: 1;
    background: rgba(212, 168, 83, 0.05);
    border: 1px solid rgba(212, 168, 83, 0.15);
    border-radius: 6px;
    padding: 16px;
    text-align: center;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #d4a853;
  }

  .metric-label {
    font-size: 12px;
    color: #8a93a8;
    margin-top: 8px;
  }

  .blur-overlay {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, transparent 0%, rgba(10, 13, 20, 0.9) 80%, #0a0d14 100%);
    pointer-events: none;
  }

  .unlock-gate {
    background: rgba(17, 24, 39, 0.9);
    border: 2px solid rgba(212, 168, 83, 0.3);
    border-radius: 12px;
    padding: 40px;
    margin-bottom: 40px;
    box-shadow: 0 0 40px rgba(212, 168, 83, 0.15);
  }

  .unlock-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .unlock-title {
    font-size: 24px;
    font-weight: 700;
    color: #d4a853;
    margin-bottom: 8px;
  }

  .unlock-subtitle {
    font-size: 14px;
    color: #8a93a8;
  }

  .unlock-error {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid #f43f5e;
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 24px;
    color: #f43f5e;
    font-size: 13px;
  }

  .unlock-section {
    margin-bottom: 24px;
  }

  .unlock-section-title {
    font-size: 12px;
    color: #d4a853;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 12px;
    text-align: center;
  }

  .unlock-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .unlock-input {
    padding: 12px 16px;
    background: rgba(212, 168, 83, 0.05);
    border: 1px solid rgba(212, 168, 83, 0.2);
    border-radius: 6px;
    color: #e8eaf0;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }

  .unlock-input:focus {
    border-color: #d4a853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.1);
  }

  .unlock-input::placeholder {
    color: #4a5268;
  }

  .unlock-button {
    padding: 12px;
    background: linear-gradient(135deg, #d4a853, #e8c96a);
    color: #0a0d14;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .unlock-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(212, 168, 83, 0.3);
  }

  .unlock-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .unlock-forgot {
    font-size: 12px;
    color: #8a93a8;
    text-align: center;
    margin-top: 8px;
  }

  .text-gold {
    color: #d4a853;
  }

  .unlock-sso {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .sso-button {
    padding: 12px;
    background: rgba(212, 168, 83, 0.08);
    border: 1px solid rgba(212, 168, 83, 0.2);
    color: #8a93a8;
    border-radius: 6px;
    font-size: 14px;
    cursor: not-allowed;
    opacity: 0.5;
  }

  .locked-content {
    max-width: 900px;
    margin: 0 auto;
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .capabilities-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 16px 0;
  }

  .capability-item {
    font-size: 14px;
    color: #4ade80;
  }

  .action-box {
    background: rgba(212, 168, 83, 0.05);
    border-left: 3px solid #d4a853;
    border-radius: 4px;
    padding: 16px;
    margin: 16px 0;
    color: #e8c96a;
    font-weight: 600;
  }

  /* P0-01：Chairman 親筆 CTA — 黑金深色 / HUD 角線裝飾 */
  .chairman-cta {
    position: relative;
    margin-top: 56px;
    padding: 40px 36px 36px;
    background:
      radial-gradient(ellipse at top, rgba(212, 168, 83, 0.10) 0%, rgba(0, 0, 0, 0) 70%),
      linear-gradient(180deg, #0d0d10 0%, #050507 100%);
    border: 1px solid rgba(212, 168, 83, 0.28);
    border-radius: 6px;
    box-shadow:
      0 0 0 1px rgba(212, 168, 83, 0.04),
      0 24px 60px rgba(0, 0, 0, 0.5),
      0 0 60px rgba(212, 168, 83, 0.06);
  }
  /* 4 角 HUD 裝飾線 */
  .chairman-cta::before,
  .chairman-cta::after {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border: 1px solid #C5A059;
  }
  .chairman-cta::before {
    top: -1px; left: -1px;
    border-right: 0; border-bottom: 0;
  }
  .chairman-cta::after {
    bottom: -1px; right: -1px;
    border-left: 0; border-top: 0;
  }
  .chairman-cta-label {
    font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: #C5A059;
    margin-bottom: 18px;
  }
  .chairman-cta-quote {
    font-size: 17px;
    line-height: 1.85;
    color: #e8e6df;
    margin-bottom: 18px;
    font-style: italic;
  }
  .chairman-cta-highlight {
    color: #FFD369;
    font-weight: 600;
    font-style: normal;
    background: rgba(255, 211, 105, 0.08);
    padding: 1px 8px;
    border-radius: 3px;
  }
  .chairman-cta-sign {
    font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
    color: #C5A059;
    font-size: 14px;
    text-align: right;
    margin-bottom: 28px;
    letter-spacing: 0.06em;
  }
  .chairman-cta-btn {
    display: block;
    width: 100%;
    background: linear-gradient(135deg, #FFD369 0%, #C5A059 100%);
    color: #0a0a0a;
    border: 0;
    padding: 18px 24px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.08em;
    font-family: inherit;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.18);
  }
  .chairman-cta-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(212, 168, 83, 0.35);
  }
  .chairman-cta-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .chairman-cta-success {
    margin-top: 4px;
    padding: 16px;
    text-align: center;
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid rgba(74, 222, 128, 0.3);
    color: #4ade80;
    border-radius: 4px;
    font-weight: 600;
    font-size: 15px;
  }
  .chairman-cta-error {
    margin-top: 12px;
    text-align: center;
    color: #ef4444;
    font-size: 13px;
  }

  @media (max-width: 768px) {
    .report-container {
      padding: 12px;
    }

    .card {
      padding: 16px;
    }

    .unlock-gate {
      padding: 24px;
    }

    .score-ring {
      width: 160px;
      height: 160px;
    }

    .card-2 .metrics-row {
      flex-direction: column;
    }
    .chairman-cta {
      padding: 28px 20px 24px;
      margin-top: 36px;
    }
    .chairman-cta-quote { font-size: 15px; line-height: 1.75; }
    .chairman-cta-btn { padding: 16px 18px; font-size: 15px; }
  }

  /* ── Version Badge ── */
  .version-badge {
    position: fixed;
    top: 16px;
    right: 16px;
    background: linear-gradient(135deg, #d4a853, #e8c96a);
    color: #0a0d14;
    font-weight: 700;
    font-size: 13px;
    padding: 6px 16px;
    border-radius: 20px;
    z-index: 100;
    box-shadow: 0 0 20px rgba(212, 168, 83, 0.4);
    animation: badgePulse 2s ease-in-out;
  }

  @keyframes badgePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }

  /* ── Refine Section ── */
  .refine-section {
    max-width: 900px;
    margin: 40px auto 0;
    background: rgba(17, 24, 39, 0.8);
    border: 1px solid rgba(212, 168, 83, 0.25);
    border-radius: 8px;
    padding: 28px;
  }

  .refine-title {
    font-size: 18px;
    font-weight: 700;
    color: #e8c96a;
    margin-bottom: 16px;
  }

  .refine-textarea-wrapper {
    position: relative;
    margin-bottom: 8px;
  }

  .refine-textarea {
    width: 100%;
    max-height: 120px;
    min-height: 80px;
    padding: 12px 16px;
    background: rgba(212, 168, 83, 0.05);
    border: 1px solid rgba(212, 168, 83, 0.2);
    border-radius: 6px;
    color: #e8eaf0;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  .refine-textarea:focus {
    border-color: #d4a853;
    box-shadow: 0 0 0 3px rgba(212, 168, 83, 0.1);
  }

  .refine-textarea::placeholder {
    color: #4a5268;
  }

  .refine-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .refine-char-count {
    text-align: right;
    font-size: 12px;
    margin-top: 4px;
    transition: color 0.2s;
  }

  .refine-hint-red {
    color: #ef4444;
    font-weight: 700;
    margin-top: 8px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .refine-button {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #d4a853, #e8c96a);
    color: #0a0d14;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .refine-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(212, 168, 83, 0.3);
  }

  .refine-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    animation: refineLoadPulse 1.5s ease-in-out infinite;
  }

  @keyframes refineLoadPulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  .refine-length-warning {
    color: #f59e0b;
    font-size: 13px;
    font-weight: 600;
    margin-top: 8px;
    text-align: center;
    animation: warningBlink 0.4s ease-in-out 2;
  }

  @keyframes warningBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  .refine-error {
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid #f43f5e;
    border-radius: 6px;
    padding: 10px 14px;
    margin-top: 12px;
    color: #f43f5e;
    font-size: 13px;
  }
`;
