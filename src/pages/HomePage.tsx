import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronRight, TrendingUp, Zap, ArrowRight, Star } from 'lucide-react';
import { featuredCases, industryColors } from '../data/cases';
import AnalysisCounter from '../components/AnalysisCounter';

const ORION_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_3606b99d.png';

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="orion-home-page">
      {/* Hero */}
      <section className="orion-hero" style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
        <div className="orion-hero-badge">
          <Star size={12} style={{ color: 'var(--orion-gold)' }} />
          <span>台灣企業 AI 導入首選</span>
        </div>
        <img src={ORION_LOGO} alt="ORION" className="orion-hero-logo" />
        <h1 className="orion-hero-title">ORION AI GROUP</h1>
        <p className="orion-hero-subtitle">獵戶座智囊 — 企業 AI 導入顧問</p>
        <p className="orion-hero-desc">
          先診斷、後開發。用 AI 將重複性工作自動化，<br />讓你的企業以近零邊際成本持續成長。
        </p>
        <div className="orion-hero-actions">
          <button className="orion-btn-fill" onClick={() => setLocation('/war-room')}>
            <Zap size={18} />
            <span>免費 AI 健檢</span>
          </button>
          <button className="orion-btn-outline" onClick={() => setLocation('/cases')}>
            <span>查看成功案例</span>
            <ChevronRight size={16} />
          </button>
        </div>
        <AnalysisCounter />
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
              <div className="case-results">
                <TrendingUp size={14} />
                <p>{c.results}</p>
              </div>
              <div className="case-duration">{c.duration}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button className="orion-btn-outline" onClick={() => setLocation('/cases')}>
            查看全部 20 個案例 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="orion-section orion-stats-section" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.5s' }}>
        <div className="orion-section-header">
          <h2>數據不說謊</h2>
          <p>AI 導入前後的真實差距</p>
        </div>
        <div className="orion-stats-row">
          <div className="orion-stat-card">
            <div className="stat-number">+23%</div>
            <div className="stat-desc">導入 AI 企業<br/>年均營收成長率</div>
          </div>
          <div className="orion-stat-card">
            <div className="stat-number">+4%</div>
            <div className="stat-desc">未導入 AI 企業<br/>年均營收成長率</div>
          </div>
          <div className="orion-stat-card highlight">
            <div className="stat-number">88%</div>
            <div className="stat-desc">台灣中小企業<br/>尚未導入 AI</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className="orion-btn-outline" onClick={() => setLocation('/insights')}>
            深入數據洞察 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Quick About */}
      <section className="orion-section" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.7s' }}>
        <div className="orion-section-header">
          <h2>關於 Orion AI Group</h2>
          <p>先顧問、後開發 — 讓 AI 真正落地</p>
        </div>
        <div className="orion-quick-about">
          <div className="about-step">
            <div className="step-num">01</div>
            <h4>免費 AI 診斷</h4>
            <p>War Room 智能問診，5 分鐘找出痛點</p>
          </div>
          <div className="about-step">
            <div className="step-num">02</div>
            <h4>問題拆解與策略</h4>
            <p>專家團隊設計落地方案</p>
          </div>
          <div className="about-step">
            <div className="step-num">03</div>
            <h4>系統導入與測試</h4>
            <p>最快 2 週見效</p>
          </div>
          <div className="about-step">
            <div className="step-num">04</div>
            <h4>優化與持續成長</h4>
            <p>30 天優化保證</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button className="orion-btn-outline" onClick={() => setLocation('/about')}>
            了解更多 <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="orion-bottom-cta">
        <h2>準備好讓 AI 為你工作了嗎？</h2>
        <p>現在不導入 AI 的企業，3 年後面臨的不是競爭，而是淘汰。</p>
        <button className="orion-btn-fill large" onClick={() => setLocation('/war-room')}>
          <Zap size={20} />
          <span>開始免費 AI 診斷</span>
        </button>
      </section>
    </div>
  );
}
