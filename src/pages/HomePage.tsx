import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { featuredCases, industryColors } from '../data/cases';

const ORION_LOGO = '/ORIONLOGO.png';

/* ── Animated Counter Hook ── */
function useAnimatedCounter(start: number, intervalMin: number, intervalMax: number, incrementMin = 1, incrementMax = 2) {
  const [value, setValue] = useState(start);
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    const tick = () => {
      const inc = Math.floor(Math.random() * (incrementMax - incrementMin + 1)) + incrementMin;
      setValue(v => v + inc);
      setBounce(true);
      setTimeout(() => setBounce(false), 400);
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
  return { value, bounce };
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
  const ctaRef = useRef<HTMLButtonElement>(null);
  const casesRef = useRef<HTMLButtonElement>(null);
  useMagnetic(ctaRef);
  useMagnetic(casesRef);

  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  // Trust dashboard counters
  const companies = useAnimatedCounter(563, 5 * 60000, 10 * 60000, 1, 3);
  const reports = useAnimatedCounter(12500, 5 * 60000, 10 * 60000, 1, 2);
  const efficiency = { value: '30%–60%', bounce: false };

  return (
    <div className="orion-home-page">
      {/* Hero */}
      <section className="orion-hero" style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <img src={ORION_LOGO} alt="ORION" className="orion-hero-logo" />
        <h1 className="orion-hero-title">獵戶座智鑑：企業級 AI 成交引擎</h1>
        <p className="orion-hero-subtitle" style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
          3 分鐘揭露您的成交卡點，<br />自動生成 ROI 提升方案。
        </p>

        <div className="orion-hero-actions" style={{ marginTop: 28 }}>
          <button
            ref={ctaRef}
            className="orion-btn-fill magnetic-link gold-sweep"
            onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
            style={{ fontSize: '1.05rem', padding: '16px 36px', position: 'relative', overflow: 'hidden' }}
          >
            <Zap size={18} />
            <span>立即啟動 AI 商業診斷</span>
          </button>
        </div>

        <p style={{ color: '#f44336', fontSize: '0.78rem', fontWeight: 600, marginTop: 14, lineHeight: 1.6, textAlign: 'center' }}>
          已有 {companies.value.toLocaleString()}+ 企業完成優化，<br />平均效率提升 30%-60%
        </p>

        {/* ── Trust Dashboard ── */}
        <div className="orion-trust-dashboard">
          <div className="trust-item">
            <div className={`trust-number ${companies.bounce ? 'trust-bounce' : ''}`}>
              {companies.value.toLocaleString()}+
            </div>
            <div className="trust-label">企業合作診斷</div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className={`trust-number ${reports.bounce ? 'trust-bounce' : ''}`}>
              {reports.value.toLocaleString()}+
            </div>
            <div className="trust-label">深度分析報告</div>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <div className="trust-number">30%–60%</div>
            <div className="trust-label">平均效率提升</div>
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
              <div className="case-row"><span className="case-label">問題</span><p>{c.problem}</p></div>
              <div className="case-row"><span className="case-label solution">解法</span><p>{c.solution}</p></div>
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
            了解更多 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="orion-bottom-cta">
        <h2>準備好讓 AI 為你工作了嗎？</h2>
        <p>現在不導入 AI 的企業，3 年後面臨的不是競爭，而是淘汰。</p>
        <button
          className="orion-btn-fill large magnetic-link gold-sweep"
          onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <Zap size={20} />
          <span>立即啟動 AI 商業診斷</span>
        </button>
      </section>
    </div>
  );
}
