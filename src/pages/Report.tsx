import React, { useState, useEffect, useCallback } from 'react';
import { getFixture, FIXTURE_LIST, isPreviewAllowed } from '../data/fixtures';
import { API_BASE, DIAG_URL } from '../lib/api-base';

/*
 ═══════════════════════════════════════════════════
  Orion Report Page — V3.1 解鎖版
  深色金色主題 / 40% 免費 + 解鎖閘門 + 60% 鎖定
  Session ID 驗證 / Email 解鎖 / 帳號登入
  T7: 支援 previewTemplate（fixture 預覽、不打 LLM）
 ═══════════════════════════════════════════════════
*/

interface ReportProps {
  previewTemplate?: string;
}

interface ReportData {
  coreProblem: { title: string; description: string };
  painQuantification: {
    title: string; monthlyTimeLoss: string;
    monthlyMoneyCost: string; description: string;
  };
  aiSolution: { title: string; capabilities: string[]; description: string };
  firstAction: { title: string; action: string; description: string };
  overallScore: number;
  // T2 新增（fixture 已含、API 報告無此欄位則 fallback 到 legacy）
  coreInsight?: string;
  currentAnalysis?: string;
  currentKeyPoints?: Array<{ type: string; label: string; text: string }>;
  opportunities?: Array<{ title: string; description: string; impact: string; timeline?: string }>;
  risks?: string[];
  path?: Array<{ phase: string; title: string; description: string }>;
  chairmanNote?: string;
  // T-REPORT-RENDER-FIX-001：v2 schema (snake_case、產自 capture/prompts/report-system-v2.md)。
  // 過去 2-3 週 backend 已升 v2、frontend 沒對應 render block,造成 96% 內容被吃掉。
  // 本次 PR 補齊 render path,v1 fallback 全保留。
  opening_line?: string;
  diagnosis_level?: {
    icon?: string;
    label?: string;
    one_sentence?: string;  // v2.1 後 deprecated、保留向後相容
    next_step?: string;
  };
  current_state?: {
    title?: string;
    bullets?: string[];
    closing_line?: string;
  };
  future_state?: {
    title?: string;
    bullets?: string[];
    closing_line?: string;
  };
  core_logic?: string;
  three_steps?: Array<{
    step?: number;
    when?: string;
    what?: string;
  }>;
  cost_of_inaction?: {
    show?: boolean | string;
    content?: string;
  };
  roi_estimate?: {
    time_saved_per_month?: string;
    money_saved_per_month?: string;
    money_saved_per_year?: string;
    basis?: string;
  };
  o_letter?: string;
  cta?: {
    main?: string;
    sub?: string;
  };
}

interface PreviewLeadInfo {
  name: string;
  industry: string;
  stage: string;
}

type PageState = 'loading' | 'ready' | 'error';
// T-OAUTH-FOUNDATION-001:OAuth 統一身份取代 email-fill / 帳號登入。
// UnlockMode type 廢除(不再有 'email' / 'account' 兩種模式、只有 OAuth)。
type AuthUser = { email: string; provider: string; displayName?: string | null } | null;

// 2026-04-27 David bug fix：6 hints × 5s = 30s 一輪、配合 poll-based loading
const LOADING_HINTS = [
  { text: '正在分析你的回答...',                 pct: 12 },
  { text: '對照 14 個產業的成功案例...',          pct: 28 },
  { text: '找出你業務的 3 個關鍵機會點...',       pct: 48 },
  { text: '整理你的風險評估...',                 pct: 65 },
  { text: '撰寫個人化建議路徑...',               pct: 82 },
  { text: '報告即將完成...',                    pct: 95 },
];

export default function Report({ previewTemplate }: ReportProps = {}) {
  const isPreview = !!previewTemplate;
  const [state, setState] = useState<PageState>(isPreview ? 'ready' : 'loading');
  const [report, setReport] = useState<ReportData | null>(() => {
    if (!isPreview || !previewTemplate) return null;
    const fx = getFixture(previewTemplate);
    return fx ? (fx.report as ReportData) : null;
  });
  const [previewLead] = useState<PreviewLeadInfo | null>(() => {
    if (!isPreview || !previewTemplate) return null;
    const fx = getFixture(previewTemplate);
    return fx ? { name: fx.lead.name, industry: fx.lead.industry, stage: fx.lead.stage } : null;
  });
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

  // ── 解鎖狀態 ──（T7：preview 模式自動解鎖、Chairman 看完整版）
  // T-OAUTH-FOUNDATION-001:OAuth 取代 email-fill。isUnlocked 由 /api/auth/me 回應決定。
  const [isUnlocked, setIsUnlocked] = useState(isPreview);
  const [authUser, setAuthUser] = useState<AuthUser>(null);
  const [authChecking, setAuthChecking] = useState(!isPreview);  // mount 時 fetch /api/auth/me
  // T-OAUTH-RETURN-URL-001:OAuth callback 帶 ?login_error= 回來時、顯示 inline 錯誤
  const [authError, setAuthError] = useState<string | null>(null);

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  // P0-01 / T3：聯絡按鈕狀態
  const [consultationState, setConsultationState] =
    useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  // T3：ContactModal 開合
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // ── 檢查 session_id ──（preview 模式跳過）
  useEffect(() => {
    if (isPreview) return;
    if (!sessionId) {
      setError('無效的分析連結，請重新進行診斷');
      setState('error');
      return;
    }
    // session_id 存在，繼續載入
  }, [sessionId, isPreview]);

  // ── T7：preview token 檢查 ──
  useEffect(() => {
    if (!isPreview) return;
    const token = params.get('dev_token');
    if (!isPreviewAllowed(token)) {
      setError('Preview 需要 dev_token（prod 環境保護）');
      setState('error');
      return;
    }
    if (!report) {
      setError(`找不到 fixture：${previewTemplate}`);
      setState('error');
    }
  }, [isPreview, previewTemplate, report]);

  // ── P0-01：開信追蹤 pixel（preview 模式跳過、避免污染後台 status） ──
  useEffect(() => {
    if (isPreview || !sessionId) return;
    fetch(`${API_BASE}/api/reports/${sessionId}/track-open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: 'web-view' }),
    }).catch(() => { /* 靜默 */ });
  }, [sessionId, isPreview]);

  // ── T3：CTA 按鈕 → 開 ContactModal（不再直接送出） ──
  const handleRequestConsultation = useCallback(() => {
    if (consultationState === 'success') return;
    if (isPreview) {
      // preview 模式：開 modal 但送出走 mock
      setContactModalOpen(true);
      return;
    }
    if (!sessionId) return;
    setContactModalOpen(true);
  }, [sessionId, consultationState, isPreview]);

  // T3：客戶在 modal 選擇聯絡方式 → 送出
  const handleSubmitContact = useCallback(async (method: string, clientInfo: string = '') => {
    if (consultationState === 'submitting') return;
    setConsultationState('submitting');
    try {
      if (isPreview) {
        // preview 模式：mock 成功、不打 API
        await new Promise(r => setTimeout(r, 600));
        setConsultationState('success');
        setContactModalOpen(false);
        return;
      }
      if (!sessionId) {
        setConsultationState('error');
        return;
      }
      const res = await fetch(
        `${API_BASE}/api/leads/${sessionId}/request-consultation`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ method, clientInfo }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.ok) {
        setConsultationState('success');
        setContactModalOpen(false);
      } else setConsultationState('error');
    } catch {
      setConsultationState('error');
    }
  }, [sessionId, consultationState, isPreview]);

  // 2026-04-27 David bug fix：6 hints × 5s = 30s 一輪、之後停在最後一句、
  // 配合 polling loop 真實偵測 ready
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

  // 2026-04-27 David bug 修復：poll-based loading（替代 single fetch 200s 阻塞）
  // - 每 3s GET /api/reports/:sessionId/status（輕量 cache check）
  // - status=ready → fetch 完整 /api/report/:sessionId（cache 命中、ms 級）
  // - 失敗 5s retry、240s 後 timeout
  useEffect(() => {
    if (isPreview || !sessionId) return;
    let aborted = false;
    let pollTimer: ReturnType<typeof setTimeout> | undefined;
    const startTime = Date.now();
    const MAX_WAIT_MS = 240000;

    async function poll() {
      if (aborted) return;
      const elapsed = Date.now() - startTime;
      if (elapsed > MAX_WAIT_MS) {
        setError('報告生成超過 4 分鐘、請重新載入頁面再試');
        setState('error');
        return;
      }
      try {
        const statusRes = await fetch(`${API_BASE}/api/reports/${sessionId}/status`);
        const statusData = await statusRes.json();
        if (statusData.status === 'ready') {
          // ready：拿完整 cache
          const fullRes = await fetch(`${API_BASE}/api/report/${sessionId}`);
          if (!fullRes.ok) throw new Error(`HTTP ${fullRes.status}`);
          const fullData = await fullRes.json();
          if (fullData.success && fullData.report) {
            if (aborted) return;
            setReport(fullData.report);
            setProgress(100);
            setTimeout(() => { if (!aborted) setState('ready'); }, 500);
            return;
          }
          throw new Error(fullData.error || '報告內容空');
        }
        // generating：3s 後再 poll、進度條微增（封頂 95%）
        setProgress((prev) => Math.min(prev + 1, 95));
        pollTimer = setTimeout(poll, 3000);
      } catch (e) {
        if (aborted) return;
        // 暫時錯誤、5s 後重試（不直接放棄、避免短暫網路中斷誤殺）
        pollTimer = setTimeout(poll, 5000);
      }
    }

    poll();
    return () => {
      aborted = true;
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [sessionId, isPreview]);

  // ── T-OAUTH-FOUNDATION-001:OAuth 統一身份解鎖 ──
  // 取代既有 handleEmailUnlock (POST /api/unlock) + handleAccountLogin (POST /api/auth/login)。
  // 客戶點 OAuth button → 跳到 orion-hub /auth/<provider>?return=<本頁> →
  // OAuth roundtrip 完成後 backend set cookie 並 302 redirect 回本頁 →
  // 本頁 mount useEffect 打 /api/auth/me、credentials:include 帶 cookie → setIsUnlocked(true)。
  //
  // 為什麼用 DIAG_URL 不用 API_BASE:DIAG_URL=ZEABUR_DIRECT 永遠直連 zeabur,
  // 因為 (1) /auth/* 是 HTML page nav、Vercel proxy 不處理 (2) cookie 跨域要 zeabur 直發、
  // 不能經 Vercel edge 中轉。
  const handleOAuthLogin = useCallback((provider: 'google' | 'facebook') => {
    // T-OAUTH-RETURN-URL-001:state 是 OAuth 標準 cross-domain context preservation 機制。
    // 取代既有 ?return=(backend 仍接 ~1 week back-compat、之後 drop)。
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `${DIAG_URL}/auth/${provider}?state=${returnUrl}`;
  }, []);

  // T-OAUTH-RETURN-URL-001:OAuth callback 帶 ?login_success=1 或 ?login_error=...
  // 回到本頁時偵測、顯示對應 UX,並 cleanup URL(防 refresh 重複觸發)。
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const success = sp.get('login_success');
    const errCode = sp.get('login_error');
    if (errCode === 'oauth_failed' || errCode === 'invalid_return_url') {
      setAuthError('登入失敗、請再試一次或換另一個帳號');
      if (errCode === 'invalid_return_url') {
        console.warn('[Report] OAuth invalid_return_url — return URL not whitelisted');
      }
    }
    // Strip login_success / login_error 不污染 URL(refresh 不重觸發)
    if (success || errCode) {
      sp.delete('login_success');
      sp.delete('login_error');
      const cleanQuery = sp.toString();
      const cleanUrl = window.location.pathname + (cleanQuery ? '?' + cleanQuery : '') + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  // 頁面載入時(且非 preview)、檢查是否已 OAuth 登入。
  // 200 → 自動解鎖、無須再點 OAuth button(localStorage bug 自然修通、cookie 持久化)
  // 401 → 維持 isUnlocked=false、顯示 OAuth gate
  useEffect(() => {
    if (isPreview) {
      setAuthChecking(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${DIAG_URL}/api/auth/me`, {
          credentials: 'include',  // 必要:跨域 cookie
        });
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          setAuthUser({ email: data.email, provider: data.provider, displayName: data.displayName });
          setIsUnlocked(true);
        }
        // 401 / 其他 → 不解鎖、顯示 OAuth gate(預設行為)
      } catch (err) {
        // network error → 也維持未解鎖、靜默(避免阻擋 UI)
        // (報告本身仍會 fetch 並 render 公開部分;遮罩仍蓋著直到 OAuth)
        console.warn('[Report] auth check failed:', err);
      } finally {
        if (mounted) setAuthChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [isPreview]);

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
      const timeout = setTimeout(() => controller.abort(), 120000); // T1: 45s → 120s
      const res = await fetch(`${API_BASE}/api/report/refine`, {
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

  // ── T-OAUTH-FOUNDATION-001:Render 解鎖閘門(OAuth 統一身份)──
  // 取代既有 email-fill / 帳號登入 / 已 disabled SSO 三段。
  // 點 Google / Facebook → 跳到 orion-hub /auth/<provider>?return=<本頁> →
  // OAuth roundtrip → cookie set → redirect 回本頁 → useEffect 已 fetch /api/auth/me → setIsUnlocked(true)。
  // authChecking=true 期間顯示 loading 而非 OAuth gate(避免閃爍)。
  const renderUnlockGate = () => (
    <div className="unlock-gate">
      <div className="unlock-header">
        <div className="unlock-title">🔒 解鎖完整 AI 分析報告</div>
        <div className="unlock-subtitle">選擇你的帳號繼續</div>
      </div>

      {authError && (
        <div className="unlock-error" role="alert">{authError}</div>
      )}

      {authChecking ? (
        <div className="unlock-checking">確認登入狀態...</div>
      ) : (
        <>
          <div className="unlock-oauth-buttons">
            <button
              type="button"
              className="oauth-btn oauth-google"
              onClick={() => handleOAuthLogin('google')}
              aria-label="使用 Google 帳號繼續"
            >
              <svg className="oauth-icon" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.265h2.908c1.702-1.567 2.684-3.874 2.684-6.622z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.265c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.704A5.41 5.41 0 0 1 3.682 9c0-.591.102-1.166.282-1.704V4.964H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.036l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.964L3.964 7.296C4.672 5.169 6.656 3.58 9 3.58z"/>
              </svg>
              <span>使用 Google 繼續</span>
            </button>

            <button
              type="button"
              className="oauth-btn oauth-facebook"
              onClick={() => handleOAuthLogin('facebook')}
              aria-label="使用 Facebook 帳號繼續"
            >
              <svg className="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.469H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"/>
              </svg>
              <span>使用 Facebook 繼續</span>
            </button>
          </div>

          <p className="unlock-oauth-note">登入後、O 會幫你解鎖完整報告、永久記住你</p>
        </>
      )}
    </div>
  );

  // 2026-04-27 David bug 修復：anti-empty guard
  // 報告必須有實質內容才算 ready、否則整體走 loading view
  // 同時相容 PR3 camelCase (coreInsight) 和 PR2 snake_case (opening_line / core_logic) cached schema
  const isReportReady = !!(
    report && (
      report.coreInsight ||
      report.coreProblem?.title ||
      report.opening_line ||
      report.core_logic ||
      report.current_state ||
      report.future_state
    )
  );

  // 寄至信箱 handler（既有 POST /api/report/email、現只是接 alert）
  const handleSendEmail = async () => {
    if (!isReportReady) return;
    const email = window.prompt('請輸入收件 Email：');
    if (!email) return;
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Email 格式不正確');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/report/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email, lang: 'zh-TW' }),
      });
      const data = await res.json();
      if (data.ok) alert(data.message || '已寄出！請查收信箱');
      else alert('寄送失敗：' + (data.error || '未知錯誤'));
    } catch (e: any) {
      alert('網路錯誤：' + (e.message || '請稍後重試'));
    }
  };

  // ── 40% 免費內容 ──
  // T2：黑金重設計 — 上半（公開部分）
  // Hero + 客戶卡 + 核心洞察 + 現況分析（含 3 個 KeyPoint）+ 痛點量化 + 模糊遮罩
  const renderFreeContent = () => {
    // anti-empty：不再用「待診斷」placeholder fallback
    // 兼容 PR2 (snake_case) 和 PR3 (camelCase) cache schema
    const coreInsight = report?.coreInsight
      || report?.coreProblem?.title
      || report?.opening_line
      || report?.current_state?.title
      || '';
    const currentAnalysis = report?.currentAnalysis || report?.coreProblem?.description || '';
    const keyPoints = report?.currentKeyPoints || [];
    return (
      <div className="free-content">
        {/* Hero */}
        <header className="r-hero">
          <img className="r-hero-mark" src="/brand/griffin-256.png" alt="ORION" />
          <h1 className="r-hero-title">ORION AI 診斷報告</h1>
          {previewLead?.name && (
            <p className="r-hero-sub">為 {previewLead.name} 量身分析</p>
          )}
          <div className="r-hero-meta">
            <span>診斷日期：{new Date().toLocaleDateString('zh-TW')}</span>
            <span className="r-hero-divider">·</span>
            <span>顧問：Orion AI</span>
            <span className="r-hero-divider">·</span>
            <span className="r-hero-score-inline">就緒度 {scoreAnimated}/100</span>
          </div>
        </header>

        {/* 客戶資料卡（preview 才顯示） */}
        {previewLead && (
          <div className="r-client-card">
            <div className="r-client-section">
              <div className="r-client-label">客戶</div>
              <div className="r-client-value">{previewLead.name}</div>
              <div className="r-client-detail">{previewLead.industry}</div>
            </div>
            <div className="r-client-divider" />
            <div className="r-client-section">
              <div className="r-client-label">現況</div>
              <div className="r-client-value-sm">{previewLead.stage || '—'}</div>
            </div>
          </div>
        )}

        {/* 核心洞察 — 大引號 */}
        <section className="r-section">
          <div className="r-section-label">核心洞察</div>
          <blockquote className="r-quote">
            <span className="r-quote-mark">「</span>
            {coreInsight}
            <span className="r-quote-mark">」</span>
          </blockquote>
          <div className="r-quote-attr">—— Orion AI 核心判斷</div>
        </section>

        {/* 現況分析 */}
        {currentAnalysis && (
          <section className="r-section">
            <h2 className="r-section-title">現況分析</h2>
            <p className="r-paragraph">{currentAnalysis}</p>
            {keyPoints.length > 0 && (
              <div className="r-keypoints">
                {keyPoints.map((kp, i) => (
                  <div key={i} className={`r-keypoint r-kp-${kp.type || 'info'}`}>
                    <div className="r-kp-label">{kp.label}</div>
                    <div className="r-kp-text">{kp.text}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 痛點量化（保留、改新樣式） */}
        {report?.painQuantification && (
          <section className="r-section">
            <h2 className="r-section-title">{report.painQuantification.title}</h2>
            <div className="r-metrics">
              <div className="r-metric">
                <div className="r-metric-value">{report.painQuantification.monthlyTimeLoss}</div>
                <div className="r-metric-label">月時間損失</div>
              </div>
              <div className="r-metric-divider" />
              <div className="r-metric">
                <div className="r-metric-value">{report.painQuantification.monthlyMoneyCost}</div>
                <div className="r-metric-label">月費用損失</div>
              </div>
            </div>
            <p className="r-paragraph">{report.painQuantification.description}</p>
          </section>
        )}

        {/* 模糊遮罩（preview 模式不遮、Chairman 看完整） */}
        {!isPreview && <div className="blur-overlay"></div>}
      </div>
    );
  };

  // T2：黑金重設計 — 下半（解鎖部分）
  // 機會點 cards + 風險清單 + 路徑時間軸 + Chairman 簽名 CTA + Footer
  const renderLockedContent = () => {
    const opportunities = report?.opportunities || [];
    const risks = report?.risks || [];
    const path = report?.path || [];
    // T-REPORT-RENDER-FIX-001:v2 fields。每個都 optional、empty 時整段不 render。
    const dx = report?.diagnosis_level;
    const cs = report?.current_state;
    const fs = report?.future_state;
    const csBullets = (cs?.bullets || []).filter(b => typeof b === 'string' && b.trim());
    const fsBullets = (fs?.bullets || []).filter(b => typeof b === 'string' && b.trim());
    const threeSteps = (report?.three_steps || []).filter(s => s && (s.what || s.when));
    const coi = report?.cost_of_inaction;
    const showCoi = coi && (coi.show === true || coi.show === 'true') && coi.content;
    const roi = report?.roi_estimate;
    const hasRoi = roi && (roi.time_saved_per_month || roi.money_saved_per_month || roi.money_saved_per_year);
    const oLetter = (report?.o_letter || '').trim();
    // chairmanNote:o_letter > 既有 chairmanNote > coreProblem-derived fallback > generic fallback
    const chairmanNote = oLetter || report?.chairmanNote || (
      report?.coreProblem?.title
        ? `根據你今天說的情況，我建議你優先處理「${report.coreProblem.title}」。這種問題我們看過很多次、通常 6-12 週可以見效。我想跟你聊 30 分鐘、把方向確認清楚。`
        : '我看到你的狀況、有幾個地方想跟你深入聊。我們約 30 分鐘、不打包賣方案、先確認方向。'
    );
    const chairmanLabel = oLetter ? 'O 的話' : 'Chairman 親筆';
    const topIssue = report?.coreProblem?.title || cs?.title || '你提到的核心問題';

    return (
      <div className="locked-content">
        {/* T-REPORT-RENDER-FIX-001 v2 sections START — 排在所有 v1 sections 前 */}

        {/* 診斷層級 (v2 diagnosis_level) */}
        {dx?.label && (
          <section className="r-section r-diagnosis">
            <div className="r-diagnosis-badge">
              {dx.icon && <span className="r-diagnosis-icon">{dx.icon}</span>}
              <span className="r-diagnosis-label">{dx.label}</span>
            </div>
            {dx.next_step && <div className="r-diagnosis-next">{dx.next_step}</div>}
            {dx.one_sentence && (
              <p className="r-paragraph r-diagnosis-desc">{dx.one_sentence}</p>
            )}
          </section>
        )}

        {/* 現況 (v2 current_state) */}
        {csBullets.length > 0 && (
          <section className="r-section">
            <h2 className="r-section-title">{cs?.title || '現在的你'}</h2>
            <ul className="r-bullet-list">
              {csBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {cs?.closing_line && (
              <p className="r-paragraph r-state-closing">{cs.closing_line}</p>
            )}
          </section>
        )}

        {/* 未來 (v2 future_state) */}
        {fsBullets.length > 0 && (
          <section className="r-section r-future-state">
            <h2 className="r-section-title">{fs?.title || '6 個月後的你'}</h2>
            <ul className="r-bullet-list">
              {fsBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            {fs?.closing_line && (
              <p className="r-paragraph r-state-closing">{fs.closing_line}</p>
            )}
          </section>
        )}

        {/* 核心邏輯 (v2 core_logic) */}
        {report?.core_logic && (
          <section className="r-section">
            <h2 className="r-section-title">核心邏輯</h2>
            <p className="r-paragraph r-core-logic">{report.core_logic}</p>
          </section>
        )}

        {/* 三步路徑 (v2 three_steps) */}
        {threeSteps.length > 0 && (
          <section className="r-section">
            <h2 className="r-section-title">三步路徑</h2>
            <div className="r-timeline">
              {threeSteps.map((s, i) => (
                <div key={i} className="r-timeline-row">
                  <div className="r-timeline-phase">{s.when || `第 ${s.step || i + 1} 步`}</div>
                  <div className="r-timeline-body">
                    <div className="r-timeline-desc">{s.what}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 不行動的代價 (v2 cost_of_inaction) — 只在 show=true 且 content 存在時顯示 */}
        {showCoi && (
          <section className="r-section">
            <h2 className="r-section-title">不行動的代價</h2>
            <div className="r-action-box r-coi-callout">{coi.content}</div>
          </section>
        )}

        {/* ROI 估算 (v2 roi_estimate) */}
        {hasRoi && (
          <section className="r-section">
            <h2 className="r-section-title">ROI 估算</h2>
            <div className="r-metrics">
              {roi.time_saved_per_month && (
                <>
                  <div className="r-metric">
                    <div className="r-metric-value">{roi.time_saved_per_month}</div>
                    <div className="r-metric-label">月時間節省</div>
                  </div>
                  {(roi.money_saved_per_month || roi.money_saved_per_year) && <div className="r-metric-divider" />}
                </>
              )}
              {roi.money_saved_per_month && (
                <>
                  <div className="r-metric">
                    <div className="r-metric-value">{roi.money_saved_per_month}</div>
                    <div className="r-metric-label">月金額節省</div>
                  </div>
                  {roi.money_saved_per_year && <div className="r-metric-divider" />}
                </>
              )}
              {roi.money_saved_per_year && (
                <div className="r-metric">
                  <div className="r-metric-value">{roi.money_saved_per_year}</div>
                  <div className="r-metric-label">年金額節省</div>
                </div>
              )}
            </div>
            {roi.basis && (
              <p className="r-paragraph r-roi-basis">算法：{roi.basis}</p>
            )}
          </section>
        )}

        {/* T-REPORT-RENDER-FIX-001 v2 sections END */}

        {/* 機會點 — 卡片 grid */}
        {opportunities.length > 0 && (
          <section className="r-section">
            <h2 className="r-section-title">{opportunities.length} 個機會點</h2>
            <div className="r-opp-grid">
              {opportunities.map((op, i) => (
                <div key={i} className="r-opp-card">
                  <div className="r-opp-num">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="r-opp-title">{op.title}</h3>
                  <p className="r-opp-desc">{op.description}</p>
                  <div className="r-opp-meta">
                    <div className="r-opp-impact"><span>預估影響：</span><strong>{op.impact}</strong></div>
                    {op.timeline && <div className="r-opp-timeline">{op.timeline}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* fallback：若沒 opportunities、用舊的 aiSolution */}
        {opportunities.length === 0 && report?.aiSolution && (
          <section className="r-section">
            <h2 className="r-section-title">{report.aiSolution.title}</h2>
            <ul className="r-bullet-list">
              {report.aiSolution.capabilities.map((cap, i) => (
                <li key={i}>{cap}</li>
              ))}
            </ul>
            <p className="r-paragraph">{report.aiSolution.description}</p>
          </section>
        )}

        {/* 風險清單 */}
        {risks.length > 0 && (
          <section className="r-section">
            <h2 className="r-section-title">風險與注意</h2>
            <ul className="r-bullet-list r-risks">
              {risks.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}

        {/* 建議路徑 — 時間軸 */}
        {path.length > 0 && (
          <section className="r-section">
            <h2 className="r-section-title">建議路徑</h2>
            <div className="r-timeline">
              {path.map((p, i) => (
                <div key={i} className="r-timeline-row">
                  <div className="r-timeline-phase">{p.phase}</div>
                  <div className="r-timeline-body">
                    <div className="r-timeline-title">{p.title}</div>
                    <div className="r-timeline-desc">{p.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* fallback：若沒 path、用舊的 firstAction */}
        {path.length === 0 && report?.firstAction && (
          <section className="r-section">
            <h2 className="r-section-title">{report.firstAction.title}</h2>
            <div className="r-action-box">{report.firstAction.action}</div>
            <p className="r-paragraph">{report.firstAction.description}</p>
          </section>
        )}

        {/* Chairman 簽名 + 大 CTA(o_letter 存在時 label 改成「O 的話」、內容用 o_letter) */}
        <section className="r-chairman">
          <div className="r-chairman-label">{chairmanLabel}</div>
          <blockquote className="r-chairman-quote">
            <span className="r-chairman-mark">「</span>
            {chairmanNote.split(/「[^」]*」/).reduce<React.ReactNode[]>((acc, part, i, arr) => {
              acc.push(part);
              const m = chairmanNote.match(/「([^」]*)」/g);
              if (m && m[i]) acc.push(<span key={i} className="r-chairman-highlight">{m[i].slice(1, -1)}</span>);
              return acc;
            }, [])}
            <span className="r-chairman-mark">」</span>
          </blockquote>
          <div className="r-chairman-sign">
            <div className="r-chairman-name">Austin</div>
            <div className="r-chairman-title">Chairman, Orion AI Group</div>
          </div>

          {consultationState === 'success' ? (
            <div className="r-chairman-success">已收到、顧問通常 1 小時內回覆</div>
          ) : (
            <button
              className="r-chairman-cta"
              onClick={handleRequestConsultation}
              disabled={consultationState === 'submitting'}
              data-issue={topIssue}
            >
              {consultationState === 'submitting' ? '送出中…' : '與 Orion AI 顧問聯繫'}
            </button>
          )}
          <div className="r-chairman-subtext">通常 1 小時內回覆</div>
          {consultationState === 'error' && (
            <div className="r-chairman-error">送出失敗、請稍後重試</div>
          )}
        </section>

        {/* Footer */}
        <footer className="r-footer">
          <div className="r-footer-actions">
            <button
              className="r-footer-btn"
              disabled={!isReportReady}
              onClick={() => isReportReady && window.print()}
            >
              {isReportReady ? '下載 PDF' : '報告生成中...'}
            </button>
            <button
              className="r-footer-btn"
              disabled={!isReportReady}
              onClick={handleSendEmail}
            >
              {isReportReady ? '寄至信箱' : '報告生成中...'}
            </button>
            <button className="r-footer-btn" onClick={() => {
              if (navigator.share) navigator.share({ title: 'ORION 診斷報告', url: window.location.href }).catch(() => {});
              else navigator.clipboard?.writeText(window.location.href).then(() => alert('連結已複製'));
            }}>分享報告</button>
          </div>
          <div className="r-footer-disclaimer">
            本報告由 Orion AI 根據你提供的資訊生成、僅供參考。
            {previewLead && <> · 預覽編號 #{(report?.overallScore || 0)} · {new Date().toLocaleString('zh-TW')}</>}
          </div>
        </footer>
      </div>
    );
  };

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

  // 2026-04-27 David bug 修復 anti-empty：state ready 但內容空也走 loading view
  // 例外：preview 模式直接信任 fixture
  if (state === 'loading' || (!isPreview && state === 'ready' && !isReportReady)) {
    return (
      <div className="report-container loading-state">
        <style>{CSS_STYLES}</style>
        <div className="loading-box">
          <img className="loading-griffin" src="/brand/griffin-256.png" alt="ORION" />
          <div className="loading-title">報告生成中</div>
          <div className="loading-hint">{LOADING_HINTS[hintIndex]?.text || '報告即將完成...'}</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="loading-eta">預估 60-90 秒、請稍候</div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-container">
      <style>{CSS_STYLES}</style>

      {/* T7：preview banner */}
      {isPreview && (
        <div className="preview-banner">
          <span className="pb-tag">PREVIEW</span>
          <span className="pb-name">樣板：{previewTemplate}</span>
          <select
            className="pb-switch"
            value={previewTemplate}
            onChange={(e) => {
              const t = e.target.value;
              const dt = params.get('dev_token');
              const url = `/report/preview/${t}${dt ? `?dev_token=${encodeURIComponent(dt)}` : ''}`;
              window.location.href = url;
            }}
          >
            {FIXTURE_LIST.map(f => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
      )}

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

      {/* T3：ContactModal — CTA 按鈕觸發、4 種聯絡方式 */}
      {contactModalOpen && (
        <ContactModal
          onClose={() => setContactModalOpen(false)}
          onSubmit={handleSubmitContact}
          submitting={consultationState === 'submitting'}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
 * T3：ContactModal — 4 種聯絡方式（暫時硬編碼、T4 改 fetch CMS）
 * ════════════════════════════════════════════════════════════ */
interface ContactModalProps {
  onClose: () => void;
  onSubmit: (method: string, info?: string) => void;
  submitting: boolean;
}
function ContactModal({ onClose, onSubmit, submitting }: ContactModalProps) {
  const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL
                    || 'https://calendly.com/ohohaustin1/30min';
  const [methods, setMethods] = useState<Array<{
    key: string; label: string; value: string; url?: string; badge?: string;
  }>>([
    { key: 'line',     label: 'LINE 官方帳號',          value: '@orion-ai',                          url: 'https://line.me/R/ti/p/@orion-ai',           badge: '最快' },
    { key: 'phone',    label: '電話',                    value: '+886 2 0000 0000',                   url: 'tel:+886200000000',                          badge: '9:00–21:00' },
    { key: 'mail',     label: 'Email',                   value: 'austin@orion01.com',                 url: 'mailto:austin@orion01.com' },
    { key: 'calendly', label: '預約 30 分鐘深聊',       value: '選你方便的時段',                      url: CALENDLY_URL,                                  badge: '建議' },
  ]);

  // T4：嘗試從 CMS 拉真實聯絡方式（失敗保留硬碼）
  useEffect(() => {
    fetch(`${API_BASE}/api/public/contact-methods`)
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (j && Array.isArray(j.methods) && j.methods.length > 0) {
          setMethods(j.methods);
        }
      })
      .catch(() => { /* fallback 已硬編碼 */ });
  }, []);

  const handleClick = (m: typeof methods[number]) => {
    onSubmit(m.key);
    if (m.url) {
      // 短延遲讓送出完成、再開連結
      setTimeout(() => { window.open(m.url, '_blank', 'noopener'); }, 300);
    }
  };

  return (
    <div className="r-modal-backdrop" onClick={onClose}>
      <div className="r-modal" onClick={(e) => e.stopPropagation()}>
        <button className="r-modal-close" onClick={onClose} aria-label="關閉">×</button>
        <div className="r-modal-title">選擇你方便的聯絡方式</div>
        <div className="r-modal-options">
          {methods.map((m) => (
            <button
              key={m.key}
              className="r-modal-option"
              onClick={() => handleClick(m)}
              disabled={submitting}
            >
              <div className="r-modal-option-main">
                <div className="r-modal-option-label">{m.label}</div>
                <div className="r-modal-option-value">{m.value}</div>
              </div>
              {m.badge && <div className="r-modal-option-badge">{m.badge}</div>}
            </button>
          ))}
        </div>
        <div className="r-modal-footer">送出選擇後、顧問會主動聯絡你</div>
      </div>
    </div>
  );
}

const CSS_STYLES = `
  /* T2：黑金重設計
     色彩規範（嚴格）：
       --orion-black:       #0a0a0a
       --orion-deep:        #050505
       --orion-gold:        #F5A623
       --orion-gold-bright: #FFD369
       --orion-gold-dim:    #8B6914
       --orion-text:        #F5F5F5
       --orion-text-muted:  rgba(255,255,255,0.6)
       --orion-text-faint:  rgba(255,255,255,0.4)
       --orion-border:      rgba(245,166,35,0.15)
     字體：襯線 Cormorant Garamond + Noto Sans TC
  */
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Noto+Serif+TC:wght@300;500;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #050505;
    color: #F5F5F5;
    font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .report-container {
    min-height: 100vh;
    padding: 0;
    background:
      radial-gradient(ellipse at top, #0f0c08 0%, rgba(0,0,0,0) 60%),
      linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
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
    background: rgba(212, 168, 83, 0.04);
    border: 1px solid rgba(245, 166, 35, 0.18);
    border-radius: 12px;
    padding: 56px 40px;
    max-width: 460px;
    width: 90%;
  }

  /* 2026-04-27 David bug fix：獅鷲呼吸動畫取代 ring spinner */
  .loading-griffin {
    width: 96px;
    height: 96px;
    margin: 0 auto 28px;
    display: block;
    object-fit: contain;
    filter: drop-shadow(0 0 24px rgba(245,166,35,0.45));
    animation: griffinBreathe 3s ease-in-out infinite;
  }
  @keyframes griffinBreathe {
    0%, 100% { transform: scale(1); opacity: 0.85; filter: drop-shadow(0 0 16px rgba(245,166,35,0.35)); }
    50%      { transform: scale(1.04); opacity: 1; filter: drop-shadow(0 0 32px rgba(245,166,35,0.65)); }
  }

  .loading-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 26px;
    font-weight: 600;
    color: #FFD369;
    letter-spacing: 0.04em;
    margin-bottom: 10px;
  }

  .loading-hint {
    font-size: 15px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 20px;
    min-height: 22px;
    transition: opacity 0.4s;
  }

  .loading-eta {
    margin-top: 16px;
    font-size: 12.5px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.06em;
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

  /* T-OAUTH-FOUNDATION-001:OAuth 統一身份按鈕(取代 email-fill / 帳號登入)*/
  .unlock-checking {
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    padding: 32px 0;
    letter-spacing: 0.04em;
  }
  .unlock-oauth-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
  .oauth-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid;
    letter-spacing: 0.02em;
  }
  .oauth-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  .oauth-btn:active {
    transform: translateY(0);
  }
  .oauth-google {
    background: #fff;
    color: #3c4043;
    border-color: rgba(255, 255, 255, 0.9);
  }
  .oauth-google:hover {
    background: #f8f9fa;
  }
  .oauth-facebook {
    background: #1877F2;
    color: #fff;
    border-color: #1877F2;
  }
  .oauth-facebook:hover {
    background: #166FE5;
  }
  .oauth-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .unlock-oauth-note {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 12.5px;
    margin-top: 18px;
    letter-spacing: 0.02em;
  }
  @media (max-width: 480px) {
    .oauth-btn {
      padding: 13px 16px;
      font-size: 14px;
    }
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

  /* T7：PREVIEW banner */
  .preview-banner {
    position: fixed;
    top: 0; left: 0; right: 0;
    background: linear-gradient(90deg, #FFD369 0%, #C5A059 100%);
    color: #0a0a0a;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    font-family: 'JetBrains Mono', 'Noto Sans TC', monospace;
    letter-spacing: 0.06em;
    box-shadow: 0 2px 12px rgba(0,0,0,0.35);
  }
  .preview-banner .pb-tag {
    background: #0a0a0a;
    color: #FFD369;
    padding: 2px 10px;
    border-radius: 3px;
    font-size: 11px;
    letter-spacing: 0.18em;
  }
  .preview-banner .pb-name { font-weight: 500; opacity: 0.85; }
  .preview-banner .pb-switch {
    background: rgba(0,0,0,0.18);
    color: #0a0a0a;
    border: 1px solid rgba(0,0,0,0.4);
    padding: 4px 10px;
    border-radius: 3px;
    font-family: inherit;
    font-size: 12px;
    cursor: pointer;
  }
  .preview-banner + .version-badge,
  .preview-banner ~ .report-container { padding-top: 50px; }
  body:has(.preview-banner) { padding-top: 36px; }

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

  /* ════════════════════════════════════════════════════════════
     T2：黑金重設計 — Hero / 客戶卡 / Section / Quote / KeyPoint /
                       Metrics / Opportunities / Timeline / Risks /
                       Chairman / Footer
     ════════════════════════════════════════════════════════════ */

  /* === Hero === */
  .r-hero {
    text-align: center;
    padding: 80px 24px 56px;
    border-bottom: 1px solid rgba(245, 166, 35, 0.15);
    background: radial-gradient(ellipse at center top, rgba(245,166,35,0.06) 0%, rgba(0,0,0,0) 70%);
  }
  .r-hero-mark {
    width: 80px;
    height: 80px;
    opacity: 0.92;
    filter: drop-shadow(0 0 20px rgba(245,166,35,0.4));
  }
  .r-hero-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 56px;
    font-weight: 300;
    letter-spacing: -0.01em;
    color: #F5A623;
    margin: 32px 0 12px;
    line-height: 1.1;
  }
  .r-hero-sub {
    font-size: 17px;
    font-weight: 300;
    color: rgba(255,255,255,0.62);
    letter-spacing: 0.04em;
    margin-bottom: 28px;
  }
  .r-hero-meta {
    font-size: 12px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }
  .r-hero-divider { opacity: 0.4; }
  .r-hero-score-inline { color: #F5A623; }
  @media (max-width: 768px) {
    .r-hero { padding: 56px 18px 40px; }
    .r-hero-title { font-size: 36px; }
  }

  /* === 客戶資料卡 === */
  .r-client-card {
    max-width: 880px;
    margin: 32px auto 0;
    padding: 24px 32px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(245,166,35,0.12);
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 28px;
  }
  .r-client-section { flex: 1; }
  .r-client-label {
    font-size: 11px;
    color: rgba(255,255,255,0.4);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: 'JetBrains Mono', monospace;
  }
  .r-client-value {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 24px;
    color: #F5F5F5;
    font-weight: 400;
    line-height: 1.2;
  }
  .r-client-value-sm {
    font-size: 15px;
    color: rgba(255,255,255,0.78);
    font-weight: 400;
  }
  .r-client-detail {
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    margin-top: 4px;
  }
  .r-client-divider {
    width: 1px;
    height: 48px;
    background: rgba(245,166,35,0.2);
  }
  @media (max-width: 768px) {
    .r-client-card { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px; margin: 24px 14px 0; }
    .r-client-divider { display: none; }
  }

  /* === Section 通用 === */
  .r-section {
    max-width: 880px;
    margin: 56px auto 0;
    padding: 0 32px;
  }
  .r-section-label {
    font-size: 11px;
    color: rgba(245,166,35,0.7);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 16px;
    font-family: 'JetBrains Mono', monospace;
  }
  .r-section-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 32px;
    font-weight: 400;
    color: #F5F5F5;
    margin-bottom: 24px;
    letter-spacing: -0.005em;
  }
  .r-paragraph {
    font-size: 17px;
    line-height: 1.75;
    color: rgba(255,255,255,0.82);
    margin-bottom: 18px;
  }
  @media (max-width: 768px) {
    .r-section { margin: 40px auto 0; padding: 0 18px; }
    .r-section-title { font-size: 24px; }
    .r-paragraph { font-size: 15.5px; line-height: 1.7; }
  }

  /* === Core Insight 大引號 === */
  .r-quote {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 30px;
    line-height: 1.5;
    color: #F5F5F5;
    font-style: italic;
    text-align: center;
    padding: 36px 24px;
    border-top: 1px solid rgba(245,166,35,0.15);
    border-bottom: 1px solid rgba(245,166,35,0.15);
    position: relative;
  }
  .r-quote-mark {
    color: #F5A623;
    font-size: 56px;
    line-height: 0;
    vertical-align: -0.2em;
    opacity: 0.7;
    font-style: normal;
  }
  .r-quote-attr {
    text-align: right;
    color: rgba(255,255,255,0.5);
    font-size: 13px;
    margin-top: 14px;
    letter-spacing: 0.08em;
  }
  @media (max-width: 768px) {
    .r-quote { font-size: 22px; padding: 28px 16px; }
    .r-quote-mark { font-size: 40px; }
  }

  /* === KeyPoints === */
  .r-keypoints {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin-top: 24px;
  }
  .r-keypoint {
    padding: 16px 18px;
    background: rgba(255,255,255,0.02);
    border-left: 2px solid rgba(245,166,35,0.4);
    border-radius: 2px;
  }
  .r-kp-strength { border-left-color: #F5A623; }
  .r-kp-gap { border-left-color: rgba(245,166,35,0.4); }
  .r-kp-urgency { border-left-color: #FFD369; }
  .r-kp-label {
    font-size: 11px;
    color: rgba(245,166,35,0.85);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-family: 'JetBrains Mono', monospace;
  }
  .r-kp-text {
    font-size: 14.5px;
    color: rgba(255,255,255,0.82);
    line-height: 1.65;
  }

  /* === Metrics（痛點量化） === */
  .r-metrics {
    display: flex;
    align-items: center;
    gap: 32px;
    margin: 24px 0;
    padding: 28px 32px;
    background: rgba(245,166,35,0.04);
    border: 1px solid rgba(245,166,35,0.18);
    border-radius: 4px;
  }
  .r-metric { flex: 1; text-align: center; }
  .r-metric-value {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 36px;
    color: #FFD369;
    font-weight: 400;
    line-height: 1.1;
  }
  .r-metric-label {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    letter-spacing: 0.12em;
    margin-top: 6px;
    font-family: 'JetBrains Mono', monospace;
  }
  .r-metric-divider { width: 1px; height: 40px; background: rgba(245,166,35,0.2); }
  @media (max-width: 768px) {
    .r-metrics { flex-direction: column; gap: 16px; padding: 20px; }
    .r-metric-divider { width: 100%; height: 1px; }
    .r-metric-value { font-size: 28px; }
  }

  /* === Opportunities Cards === */
  .r-opp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
  }
  .r-opp-card {
    padding: 28px 26px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(245,166,35,0.18);
    border-radius: 4px;
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .r-opp-card:hover {
    border-color: rgba(245,166,35,0.4);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(245,166,35,0.08);
  }
  .r-opp-num {
    font-family: 'JetBrains Mono', monospace;
    color: rgba(245,166,35,0.5);
    font-size: 13px;
    letter-spacing: 0.18em;
    margin-bottom: 10px;
  }
  .r-opp-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 22px;
    font-weight: 500;
    color: #F5F5F5;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .r-opp-desc {
    color: rgba(255,255,255,0.7);
    font-size: 14.5px;
    line-height: 1.7;
    margin-bottom: 16px;
  }
  .r-opp-meta {
    padding-top: 14px;
    border-top: 1px solid rgba(245,166,35,0.12);
  }
  .r-opp-impact {
    color: rgba(255,255,255,0.55);
    font-size: 13px;
    margin-bottom: 4px;
  }
  .r-opp-impact strong { color: #FFD369; font-weight: 500; }
  .r-opp-timeline {
    color: rgba(245,166,35,0.7);
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.06em;
  }

  /* === Bullet List + Risks === */
  .r-bullet-list {
    list-style: none;
    padding: 0;
    margin: 16px 0;
  }
  .r-bullet-list li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 12px;
    color: rgba(255,255,255,0.78);
    font-size: 15.5px;
    line-height: 1.75;
  }
  .r-bullet-list li::before {
    content: '·';
    color: #F5A623;
    font-weight: 700;
    font-size: 22px;
    position: absolute;
    left: 6px;
    top: -4px;
  }
  .r-risks li::before { color: #FFD369; }

  /* === Path Timeline === */
  .r-timeline {
    border-left: 1px solid rgba(245,166,35,0.25);
    padding-left: 0;
  }
  .r-timeline-row {
    display: grid;
    grid-template-columns: 130px 1fr;
    gap: 24px;
    padding: 14px 0 14px 24px;
    margin-left: 14px;
    position: relative;
  }
  .r-timeline-row::before {
    content: '';
    position: absolute;
    left: -7px;
    top: 22px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #050505;
    border: 2px solid #F5A623;
  }
  .r-timeline-phase {
    font-family: 'JetBrains Mono', monospace;
    color: rgba(245,166,35,0.85);
    font-size: 12px;
    letter-spacing: 0.1em;
    padding-top: 4px;
  }
  .r-timeline-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 19px;
    color: #F5F5F5;
    margin-bottom: 6px;
  }
  .r-timeline-desc {
    color: rgba(255,255,255,0.65);
    font-size: 14.5px;
    line-height: 1.65;
  }
  @media (max-width: 768px) {
    .r-timeline-row { grid-template-columns: 1fr; gap: 6px; }
  }

  /* === Action box (fallback) === */
  .r-action-box {
    background: rgba(245,166,35,0.06);
    border: 1px solid rgba(245,166,35,0.25);
    color: #FFD369;
    padding: 18px 22px;
    border-radius: 3px;
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  /* === Chairman 簽名 + CTA === */
  .r-chairman {
    max-width: 880px;
    margin: 80px auto 0;
    padding: 56px 32px;
    background:
      radial-gradient(ellipse at top, rgba(245,166,35,0.08) 0%, rgba(0,0,0,0) 70%),
      rgba(245,166,35,0.025);
    border: 1px solid rgba(245,166,35,0.2);
    border-radius: 4px;
    text-align: center;
    position: relative;
  }
  .r-chairman-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #F5A623;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .r-chairman-quote {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 24px;
    line-height: 1.7;
    color: #F5F5F5;
    font-style: italic;
    margin-bottom: 28px;
    text-align: left;
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
  }
  .r-chairman-mark {
    color: #F5A623;
    font-size: 44px;
    vertical-align: -0.18em;
    line-height: 0;
    font-style: normal;
    opacity: 0.7;
  }
  .r-chairman-highlight {
    color: #FFD369;
    font-style: normal;
    font-weight: 500;
    background: rgba(255,211,105,0.08);
    padding: 1px 8px;
    border-radius: 2px;
  }
  .r-chairman-sign {
    margin-bottom: 36px;
    padding-top: 20px;
    border-top: 1px solid rgba(245,166,35,0.18);
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
  }
  .r-chairman-name {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 28px;
    color: #F5A623;
    font-weight: 400;
    margin-bottom: 4px;
  }
  .r-chairman-title {
    color: rgba(255,255,255,0.5);
    font-size: 12px;
    letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .r-chairman-cta {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
    padding: 18px 32px;
    background: linear-gradient(135deg, #FFD369 0%, #F5A623 100%);
    color: #0a0a0a;
    border: 0;
    border-radius: 3px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .r-chairman-cta:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(245,166,35,0.4);
  }
  .r-chairman-cta:disabled { opacity: 0.5; cursor: not-allowed; }
  .r-chairman-subtext {
    color: rgba(255,255,255,0.45);
    font-size: 13px;
    margin-top: 12px;
    letter-spacing: 0.04em;
  }
  .r-chairman-success {
    margin-top: 16px;
    padding: 16px 20px;
    background: rgba(245,166,35,0.08);
    border: 1px solid rgba(245,166,35,0.3);
    border-radius: 3px;
    color: #FFD369;
    font-size: 15px;
    font-weight: 500;
  }
  .r-chairman-error {
    margin-top: 12px;
    color: #f43f5e;
    font-size: 13px;
  }
  @media (max-width: 768px) {
    .r-chairman { padding: 40px 22px; margin-top: 56px; }
    .r-chairman-quote { font-size: 19px; }
    .r-chairman-name { font-size: 22px; }
  }

  /* === Footer === */
  .r-footer {
    max-width: 880px;
    margin: 80px auto 60px;
    padding: 40px 32px 0;
    border-top: 1px solid rgba(245,166,35,0.15);
  }
  .r-footer-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .r-footer-btn {
    background: transparent;
    color: rgba(245,166,35,0.85);
    border: 1px solid rgba(245,166,35,0.3);
    padding: 12px 22px;
    border-radius: 3px;
    font-size: 13px;
    cursor: pointer;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing: 0.06em;
    transition: all 0.15s;
  }
  .r-footer-btn:hover:not(:disabled) {
    color: #FFD369;
    border-color: #F5A623;
    background: rgba(245,166,35,0.04);
  }
  .r-footer-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    color: rgba(245,166,35,0.5);
  }
  .r-footer-disclaimer {
    text-align: center;
    color: rgba(255,255,255,0.35);
    font-size: 11.5px;
    letter-spacing: 0.04em;
    line-height: 1.7;
  }

  /* 2026-04-27 David bug fix：@media print 隱藏非報告主體 */
  @media print {
    /* hide footer buttons / unlock gate / consultation modal / sidebar / nav */
    .r-footer-actions,
    .r-modal-backdrop, .r-modal,
    .r-chairman-cta, .unlock-gate,
    .preview-banner,
    nav, aside,
    .orion-mobile-drawer-trigger,
    .orion-sidebar-desktop {
      display: none !important;
    }
    /* 報告主體：白底黑字、易讀、省墨 */
    body, .report-container {
      background: #ffffff !important;
      color: #1a1a1a !important;
    }
    .r-hero-title, .r-section-label, .r-section-title,
    .r-quote-mark, .r-chairman-label, .r-chairman-name {
      color: #8B6914 !important;
    }
    .r-paragraph, .r-quote, .r-chairman-quote, .r-keypoint {
      color: #1a1a1a !important;
    }
    .r-section, .r-opp-card, .r-timeline-row {
      page-break-inside: avoid;
    }
    .r-chairman {
      page-break-before: auto;
    }
    /* 拿掉動畫 */
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
    @page { margin: 1.5cm; }
  }

  /* ════════════════════════════════════════════════════════════
     T3：ContactModal — 聯絡方式選擇
     ════════════════════════════════════════════════════════════ */
  .r-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
    animation: rmFade 0.2s ease;
  }
  @keyframes rmFade { from { opacity: 0 } to { opacity: 1 } }
  .r-modal {
    position: relative;
    background:
      radial-gradient(ellipse at top, rgba(245,166,35,0.08), rgba(0,0,0,0) 60%),
      #0a0a0a;
    border: 1px solid rgba(245,166,35,0.3);
    border-radius: 6px;
    padding: 36px 32px 28px;
    max-width: 460px;
    width: 100%;
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    animation: rmSlide 0.25s cubic-bezier(.2,.8,.2,1);
  }
  @keyframes rmSlide {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .r-modal-close {
    position: absolute;
    top: 12px;
    right: 14px;
    background: transparent;
    border: 0;
    color: rgba(255,255,255,0.5);
    font-size: 26px;
    line-height: 1;
    cursor: pointer;
    padding: 4px 10px;
    font-family: inherit;
  }
  .r-modal-close:hover { color: #FFD369; }
  .r-modal-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 22px;
    color: #F5F5F5;
    margin-bottom: 22px;
    text-align: center;
    letter-spacing: 0.02em;
  }
  .r-modal-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 18px;
  }
  .r-modal-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(245,166,35,0.2);
    border-radius: 4px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    font-family: 'Noto Sans TC', sans-serif;
    color: #F5F5F5;
  }
  .r-modal-option:hover:not(:disabled) {
    border-color: #F5A623;
    background: rgba(245,166,35,0.06);
    transform: translateY(-1px);
  }
  .r-modal-option:disabled { opacity: 0.5; cursor: not-allowed; }
  .r-modal-option-main { flex: 1; min-width: 0; }
  .r-modal-option-label {
    font-size: 14.5px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #F5F5F5;
  }
  .r-modal-option-value {
    font-size: 12.5px;
    color: rgba(255,255,255,0.55);
    font-family: 'JetBrains Mono', monospace;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .r-modal-option-badge {
    flex-shrink: 0;
    padding: 3px 10px;
    background: rgba(245,166,35,0.15);
    color: #FFD369;
    border: 1px solid rgba(245,166,35,0.4);
    border-radius: 12px;
    font-size: 11px;
    letter-spacing: 0.06em;
  }
  .r-modal-footer {
    text-align: center;
    color: rgba(255,255,255,0.4);
    font-size: 12px;
    padding-top: 6px;
    border-top: 1px solid rgba(245,166,35,0.1);
    margin-top: 6px;
    padding-top: 14px;
  }
  @media (max-width: 480px) {
    .r-modal { padding: 28px 22px 20px; }
    .r-modal-option { padding: 14px 14px; }
  }

  /* ────────────────────────────────────────────────
     T-REPORT-RENDER-FIX-001:v2 schema render styles
     沿用既有 .r-section / .r-bullet-list / .r-timeline /
     .r-metrics / .r-action-box / .r-paragraph 黑金樣式,
     只加 v2 specific 修飾 class。
     ──────────────────────────────────────────────── */

  /* 診斷層級 — 大 chip badge + 行動指令 */
  .r-diagnosis {
    text-align: center;
    padding: 24px 24px 28px;
  }
  .r-diagnosis-badge {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    background: rgba(245,166,35,0.06);
    border: 1px solid rgba(245,166,35,0.32);
    border-radius: 999px;
    margin-bottom: 14px;
  }
  .r-diagnosis-icon {
    font-size: 26px;
    line-height: 1;
  }
  .r-diagnosis-label {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 22px;
    font-weight: 600;
    color: #FFD369;
    letter-spacing: 0.04em;
  }
  .r-diagnosis-next {
    font-size: 16px;
    color: #F5F5F5;
    font-weight: 500;
    margin-top: 8px;
    letter-spacing: 0.02em;
  }
  .r-diagnosis-desc {
    font-size: 14px;
    color: rgba(255,255,255,0.6);
    margin-top: 10px;
    text-align: center;
  }

  /* current_state / future_state — 共用 .r-section + .r-bullet-list、加 closing line */
  .r-state-closing {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px dashed rgba(245,166,35,0.18);
    font-style: italic;
    color: rgba(255,255,255,0.7);
    font-size: 15px;
  }
  .r-future-state {
    background: rgba(245,166,35,0.03);
    border-left: 2px solid rgba(245,166,35,0.32);
    padding-left: 22px;
  }

  /* core_logic — 中間那句話、引號感 */
  .r-core-logic {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 18px;
    line-height: 1.7;
    color: rgba(255,255,255,0.85);
    padding: 18px 22px;
    background: rgba(245,166,35,0.04);
    border-left: 3px solid rgba(245,166,35,0.4);
    border-radius: 4px;
  }

  /* cost_of_inaction — 警告色 callout(沿用 .r-action-box 但加紅金提醒) */
  .r-coi-callout {
    border-color: rgba(244, 63, 94, 0.32);
    background: rgba(244, 63, 94, 0.05);
    color: #F5F5F5;
  }

  /* roi basis 字 — 算法說明小字 */
  .r-roi-basis {
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin-top: 14px;
    font-style: italic;
  }

`;
