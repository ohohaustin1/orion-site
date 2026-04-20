import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { featuredCases, industryColors } from '../data/cases';
import { setSEO } from '../lib/seo';
import { LoadingRitual } from '../components/LoadingRitual';
import HeroSection from '../components/hero/HeroSection';

/* Magnetic Link Effect */
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
  const casesRef = useRef<HTMLButtonElement>(null);
  useMagnetic(casesRef);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    setSEO({
      title: 'Orion 獵戶座智鑑 | 企業級 AI 成交引擎',
      description: '企業級 AI 成交引擎，快速找回流失的營收。3分鐘揭露您的業務卡點與 ROI 缺口。',
      url: 'https://orion01.com',
    });
  }, []);

  return (
    <div className="orion-home-page">
      <LoadingRitual active={showRitual} onComplete={() => { window.location.href = 'https://orion01.com'; }} />
      {/* Hero Section (Step 2/7) */}
      <HeroSection />

      {/* Featured Cases */}
      <section className="orion-section" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s 0.3s' }}>
        <div className="orion-section-header">
          <h2>精選成功案例</h2>
          <p>跨產業 AI 導入，量化成果說話</p>
        </div>
        <div className="orion-cases-grid featured">
          {featuredCases.slice(0, 3).map(c => (
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
            { num: '01', title: '說出你的問題', desc: 'O 幫你把模糊想法變成清晰需求' },
            { num: '02', title: '需求確認', desc: '工程師接手，評估可行性與時程' },
            { num: '03', title: '系統建置', desc: '從 0 到上線，全程 ORION 負責' },
            { num: '04', title: '永久陪跑', desc: '3 個月後有新需求，O 還在' },
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
        <h2 style={{ color: '#C5A059', letterSpacing: '0.05em' }}>你的下一個系統，從這裡開始</h2>
        <button
          className="cta-premium font-bold text-base md:text-lg"
          onClick={() => setShowRitual(true)}
          style={{ position: 'relative', overflow: 'hidden', letterSpacing: '0.08em' }}
        >
          <Zap size={20} />
          現在對話 →
        </button>
      </section>
    </div>
  );
}
