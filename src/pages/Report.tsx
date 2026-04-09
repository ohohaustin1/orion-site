import React, { useState, useEffect, useCallback } from 'react';

/* ══════════════════════════════════════════
   Orion Report Page — AI 診斷報告
   V2: Task 3 (loading hints) + Task 4 (CTA popup)

   URL: /report?session=XXX
   資料來源: https://orion-hub.zeabur.app/api/report/:sessionId
   ═══════════════════════════════════════════ */

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

// ── Task 3: 輪播提示文字 ──
const LOADING_HINTS = [
  '正在掃描您的行業痛點資料庫...',
  '比對 200+ 產業 AI 成功案例...',
  '量化每月時間與金錢損失...',
  '生成客製化 AI 賦能方案...',
  '計算投資報酬率預估...',
  '整合策略建議與行動方案...',
  '最終校準報告準確度...',
];

export default function Report() {
  const [state, setState] = useState<PageState>('loading');
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);

  // ── Task 4: CTA Modal ──
  const [ctaOpen, setCtaOpen] = useState(false);
  const [ctaForm, setCtaForm] = useState({ name: '', contact: '', note: '' });
  const [ctaSubmitting, setCtaSubmitting] = useState(false);
  const [ctaSuccess, setCtaSuccess] = useState(false);

  // 從 URL 取得 session ID
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session');

  // ── Task 3: 每 5 秒輪播提示 ──
  useEffect(() => {
    if (state !== 'loading') return;
    const interval = setInterval(() => {
      setHintIndex(prev => (prev + 1) % LOADING_HINTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [state]);

  useEffect(() => {
    if (!sessionId) {
      setError('缺少 session 參數');
      setState('error');
      return;
    }

    // 模擬進度條
    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 8;
      if (progressValue > 90) progressValue = 90;
      setProgress(progressValue);
    }, 200);

    // 呼叫 API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    fetch(`https://orion-hub.zeabur.app/api/report/${sessionId}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .catch(err => {
        clearTimeout(timeout);
        clearInterval(progressInterval);
        setError('进先參API'[);
        setState('error');
      })
      .finally(() => clearInterval(progressInterval));

    const data = await fetch(`https://orion-hub.zeabur.app/api/report/${sessionId}`).then(res => res.json());

    return 'Result: Check console';
  }, [sessionId]);
}
