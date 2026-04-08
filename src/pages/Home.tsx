import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLoginUrl } from '@/lib/const';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Brain, BarChart3, Shield, ChevronRight, Zap, Star } from 'lucide-react';

const ORION_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_3606b99d.png';

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const features = [
    {
      icon: Brain,
      title: language === 'en' ? 'Demand Diagnosis' : '需求診斷',
      desc: language === 'en' ? 'AI deconstructs fuzzy requirements into structured intelligence in under 5 minutes.' : 'AI 在 5 分鐘內將模糊需求解構為結構化情報。',
    },
    {
      icon: BarChart3,
      title: language === 'en' ? 'Architecture Blueprint' : '架構藍圖',
      desc: language === 'en' ? 'Generate technology stacks, component diagrams, and ROI projections automatically.' : '自動生成技術棧、元件圖與 ROI 預估。',
    },
    {
      icon: Shield,
      title: language === 'en' ? 'Risk Detection' : '風險偵測',
      desc: language === 'en' ? 'Identify contradictions, hidden costs, and implementation risks before they surface.' : '在問題浮現前識別矛盾、隱性成本與實施風險。',
    },
    {
      icon: Zap,
      title: language === 'en' ? 'AI Entry Points' : 'AI 切入點',
      desc: language === 'en' ? 'Pinpoint automation opportunities with near-zero marginal cost leverage.' : '精準定位近零邊際成本的自動化槓桿點。',
    },
  ];

  const principles = [
    language === 'en' ? 'First Principles' : '第一性原理',
    language === 'en' ? 'Near-Zero Marginal Cost' : '近零邊際成本',
    language === 'en' ? 'Leverage Structure' : '槓桿結構',
    language === 'en' ? 'Long-term Compounding' : '長期複利',
    language === 'en' ? 'AI-First Automation' : 'AI 優先自動化',
  ];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--orion-bg-base)', color: 'var(--orion-text-primary)', overflowX: 'hidden' }} className="orion-grid-bg">
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(10,13,20,0.96)', borderBottom: '1px solid var(--orion-border-subtle)', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1400px', width: '100%', padding: '0 clamp(16px, 4vw, 32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={ORION_LOGO} alt="ORION" style={{ width: 32, height: 32, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(201,168,76,0.4))' }} />
          <div>
            <div style={{ fontFamily: 'var(--orion-font-display)', fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.12em', color: 'var(--orion-gold)' }}>ORION AI GROUP</div>
            <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.5rem', letterSpacing: '0.1em', color: 'var(--orion-text-tertiary)' }}>STRATEGY & DOMINANCE</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap style={{ width: 13, height: 13 }} />
              {language === 'en' ? 'War Room' : '進入戰情室'}
            </button>
          ) : (
            <a href={getLoginUrl()} className="orion-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              {language === 'en' ? 'Sign In' : '登入'}
              <ChevronRight style={{ width: 13, height: 13 }} />
            </a>
          )}
        </div>
        </div>
      </nav>

      <section style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(80px, 12vw, 100px) clamp(16px, 5vw, 32px) clamp(40px, 8vw, 60px)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: 'min(600px, 90vw)', height: 'min(600px, 90vw)', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', width: '100%', textAlign: 'center', position: 'relative', opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: '-20px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)', animation: 'orion-breathe 3s ease-in-out infinite' }} />
              <img src={ORION_LOGO} alt="ORION AI Group" style={{ width: 'clamp(100px, 25vw, 160px)', height: 'clamp(100px, 25vw, 160px)', objectFit: 'contain', filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.5))', position: 'relative', zIndex: 1 }} />
            </div>
          </div>

          <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--orion-gold)', marginBottom: '16px' }}>
            ORION AI GROUP — STRATEGY & DOMINANCE
          </div>

          <h1 style={{ fontFamily: 'var(--orion-font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: 'var(--orion-text-primary)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            {language === 'en' ? 'Intelligence-Driven' : '情報驅動'}
          </h1>
          <h1 style={{ fontFamily: 'var(--orion-font-display)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, background: 'linear-gradient(135deg, var(--orion-gold-bright), var(--orion-gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '24px' }}>
            {language === 'en' ? 'Architecture Dominance' : '架構制霸'}
          </h1>

          <p style={{ fontFamily: 'var(--orion-font-body)', fontSize: '1.125rem', color: 'var(--orion-text-secondary)', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
            {language === 'en'
              ? '5-minute AI-powered requirement diagnosis. Structured architecture blueprints. Zero-fluff, first-principles analysis.'
              : '5 分鐘 AI 需求診斷。結構化架構藍圖。零廢話，第一性原理分析。'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            {isAuthenticated ? (
              <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap style={{ width: 16, height: 16 }} />
                {language === 'en' ? 'Enter War Room' : '進入戰情室'}
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            ) : (
              <>
                <a href={getLoginUrl()} className="orion-btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <Zap style={{ width: 16, height: 16 }} />
                  {language === 'en' ? 'Start Analysis' : '開始診斷'}
                  <ChevronRight style={{ width: 14, height: 14 }} />
                </a>
                <button onClick={() => setLocation('/war-room')} className="orion-btn-ghost" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                  {language === 'en' ? 'View Demo' : '查看範例'}
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {principles.map((p, i) => (
              <span key={i} style={{ padding: '4px 12px', borderRadius: '3px', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--orion-gold)', background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)' }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 8vw, 80px) clamp(16px, 4vw, 32px)', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)', marginBottom: '12px' }}>CORE CAPABILITIES</div>
          <h2 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '2.25rem', fontWeight: 800, color: 'var(--orion-text-primary)', letterSpacing: '-0.01em' }}>
            {language === 'en' ? 'Built for Dominance' : '為制霸而生'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)', padding: '28px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--orion-radius-sm)', background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon style={{ width: 20, height: 20, color: 'var(--orion-gold)' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.0625rem', fontWeight: 700, color: 'var(--orion-text-primary)', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.875rem', color: 'var(--orion-text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: 'clamp(60px, 8vw, 80px) clamp(16px, 4vw, 32px)', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-lg)', padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--orion-gold), transparent)' }} />
          <img src={ORION_LOGO} alt="ORION" style={{ width: 64, height: 64, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.4))', marginBottom: '20px' }} />
          <h2 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--orion-text-primary)', marginBottom: '12px' }}>
            {language === 'en' ? 'Ready to Dominate?' : '準備好制霸了嗎？'}
          </h2>
          <p style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.9375rem', color: 'var(--orion-text-secondary)', marginBottom: '28px', lineHeight: 1.65 }}>
            {language === 'en'
              ? 'Input your business requirement. ORION will diagnose, architect, and project ROI in minutes.'
              : '輸入業務需求，ORION 在幾分鐘內完成診斷、架構設計與 ROI 預估。'}
          </p>
          {isAuthenticated ? (
            <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ padding: '14px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Zap style={{ width: 16, height: 16 }} />
              {language === 'en' ? 'Enter War Room' : '進入戰情室'}
            </button>
          ) : (
            <a href={getLoginUrl()} className="orion-btn-primary" style={{ padding: '14px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Star style={{ width: 16, height: 16 }} />
              {language === 'en' ? 'Get Started Free' : '免費開始使用'}
            </a>
          )}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid var(--orion-border-subtle)', padding: '24px clamp(16px, 4vw, 32px)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--orion-text-tertiary)' }}>
          © 2026 ORION AI GROUP — STRATEGY & DOMINANCE
        </p>
      </footer>
    </div>
  );
}
