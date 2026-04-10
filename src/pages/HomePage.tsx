import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { featuredCases, industryColors } from '../data/cases';
import { setSEO } from '../lib/seo';
import { LoadingRitual } from '../components/LoadingRitual';

const ORION_LOGO = '/ORIONLOGO.png';

/* ── Animated Counter Hook (realistic small numbers) ── */
function useAnimatedCounter(
  start: number,
  intervalMin: number,
  intervalMax: number,
  incrementMin = 1,
  incrementMax = 1,
  allowDecrease = false,
  minVal = 0,
  maxVal = Infinity,
) {
  const [value, setValue] = useState(start);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const tick = () => {
      const inc = Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin;
      const direction = allowDecrease && Math.random() < 0.35 ? -1 : 1;
      setValue(v => Math.min(maxVal, Math.max(minVal, v + inc * direction)));
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      schedule();
    };
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const ms = Math.floor(Math.random() * (intervalMax - intervalMin)) + intervalMin;
      timer = setTimeout(tick, ms);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);
  return { value, flash };
}

/* ── Count-up animation on mount ── */
function useCountUp(target: number, duration = 1500) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return display;
}

/* ── Magnetic Link Effect ── */
function useMagnetic(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mx', x + 'px');
      el.style.setProperty('--my', y + 'px');
      // subtle magnetic pull
      const dx = (x - rect.width / 2) * 0.08;
      const dy = (y - rect.height / 2) * 0.08;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => { el.style.transform = 'translate(0,0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref]);
}

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [loaded, setLoaded] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const casesRef = useRef<HTMLButtonElement>(null);
  useMagnetic(ctaRef);
  useMagnetic(casesRef);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    setSEO({
      title: 'Orion 獵戶座智鑑 | 企業級 AI 成交引擎',
      description: '企業級 AI 成交引擎，快速找回流失的營收。3分鐘揭露您的業務卡點與 ROI 缺口。',
      url: 'https://orion01.com',
    });
  }, []);

  // Trust dashboard counters — realistic small numbers
  // 已完成 AI 分析：126 起，每 5-10 分鐘 +1
  const analyses = useAnimatedCounter(126, 5 * 60000, 10 * 60000, 1, 1);
  const analysesDisplay = useCountUp(analyses.value, 1800);
  // 今日策略生成：7 筆，白天偶爾 +1
  const strategies = useAnimatedCounter(7, 8 * 60000, 15 * 60000, 1, 1);
  const strategiesDisplay = useCountUp(strategies.value, 1200);
  // 活躍使用者：38 位，每 30-90 秒 +1 或 -1
  const activeUsers = useAnimatedCounter(38, 30000, 90000, 1, 1, true, 12, 67);
  const activeUsersDisplay = useCountUp(activeUsers.value, 1000);

  return (
    <div className="orion-home-page">
      <LoadingRitual active={showRitual} onComplete={() => { window.location.href = 'https://orion-hub.zeabur.app'; }} />
      {/* Hero */}
      <section className="orion-hero" style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <img src={ORION_LOGO} alt="ORION" className="orion-hero-logo" />
        <h1 className="orion-hero-title">你正在漏掉的成交機會，AI 幫你 3 分鐘找出來</h1>
        <p className="orion-hero-subtitle" style={{ maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
          不講廢話，直接揭露您的業務卡點與 ROI 缺口。
        </p>

        <div className="orion-hero-actions" style={{ marginTop: 28 }}>
          <button
            ref={ctaRef}
            className="orion-btn-fill magnetic-link gold-sweep"
            onClick={() => setShowRitual(true)}
            style={{ fontSize: '1.05rem', padding: '16px 36px', position: 'relative', overflow: 'hidden' }}
          >
            <Zap size={18} />
            <span>立即看懂你為什麼成交不了</span>
          </button>
        </div>

        {/* ── Trust Dashboard (realistic small numbers) ── */}
        <div className="orion-trust-dashboard">
          <div className="trust-item">
            <div className={`trust-number ${analyses.flash ? 'trust-flash' : ''}`}>
              {analysesDisplay}
            </div>
            <div className="trust-label">已完成 AI 分析</div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className={`trust-number ${strategies.flash ? 'trust-flash' : ''}`}>
              {strategiesDisplay}
            </div>
            <div className="trust-label">今日策略生成</div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className={`trust-number ${activeUsers.flash ? 'trust-flash' : ''}`}>
              {activeUsersDisplay}
            </div>
            <div className="trust-label">活躍使用者</div>
          </div>
        </div>
      </section>

      {/* Featured Cases */}
      <section className="orion-section" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.3s' }}>
        <div className="orion-section-header">
          <h2>精選成功案例</h2>
          <p>跨產業 AI 導入，量化成果說話</p>
        </div>
        <div className="orion-cases-grid featured">
          {featuredCases.map(c => (
            <div key={c.id} className="orion-case-card">
              <div className="case-tag" style={{ background: industryColors[c.industry] || '#c9a84c' }}>{c.industry}</div>
              <h3 className="case-company">{c.company}</h3>
              <div className="case-row"><span className="case-label">原始問題</span><p>{c.problem}</p></div>
              <div className="case-row"><span className="case-label solution">執行策略</span><p>{c.strategy}</p></div>
              <div className="case-results"><TrendingUp size={14} /><p>{c.results}</p></div>
              <div className="case-duration">{c.duration}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button ref={casesRef} className="orion-btn-outline magnetic-link gold-sweep" onClick={() => setLocation('/cases')}>
            查看全部 20 個案例 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Quick About */}
      <section className="orion-section" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.5s' }}>
        <div className="orion-section-header">
          <h2>關於 Orion AI Group</h2>
          <p>先顧問、後開發 — 讓 AI 真正落地</p>
        </div>
        <div className="orion-quick-about">
          {[
            { num: '01', title: '免費 AI 診斷', desc: 'War Room 智能問診，3 分鐘找出痛點' },
            { num: '02', title: '問題拆解與策略', desc: '專家團隊設計落地方案' },
            { num: '03', title: '系統導入與測試', desc: '最快 2 週見效' },
            { num: '04', title: '優化與持續成長', desc: '30 天優化保證' },
          ].map((s, i) => (
            <div key={i} className="about-step">
              <div className="step-num">{s.num}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className="orion-btn-outline magnetic-link gold-sweep" onClick={() => setLocation('/about')}>
            查看完整服務與定價 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="orion-bottom-cta">
        <h2>你的成交漏洞，每天都在燒錢</h2>
        <p>3 分鐘免費診斷，揪出正在流失的營收缺口。</p>
        <button
          className="orion-btn-fill large magnetic-link gold-sweep"
          onClick={() => setShowRitual(true)}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <Zap size={20} />
          <span>立即看懂你為什麼成交不了</span>
        </button>
      </section>
    </div>
  );
}
