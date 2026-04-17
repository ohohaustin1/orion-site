import React, { useState, useEffect, useRef, useCallback } from 'react';
import griffinLogo from '@/assets/images/griffin-logo.png';
import heroMain from '@/assets/images/hero-main.png';

/* ── Count-Up Animation Hook ── */
function useCountUp(target: number, duration = 600, delay = 1000) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return value;
}

/* ── Scroll Parallax Hook ── */
function useParallax(factor = 0.3) {
  const [offset, setOffset] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setOffset(window.scrollY * factor);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [factor]);

  return offset;
}

/* ── StatCard Component (改造 3) ── */
function StatCard({ icon, number, label }: { icon: React.ReactNode; number: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-css">{icon}</div>
      <div className="stat-number font-tabular">{number}</div>
      <div className="stat-divider"></div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── Orion Belt Divider (改造 5) ── */
function OrionDivider() {
  return (
    <div className="orion-divider">
      <div className="orion-divider-line"></div>
      <div className="orion-divider-stars">★ ★ ★</div>
      <div className="orion-divider-line"></div>
    </div>
  );
}


/* ── Shooting Stars Component ── */

/* ── Stagger Stage Type ── */
type Stage = 'bg' | 'image' | 'title' | 'subtitle' | 'cta' | 'stats';

export default function HeroSection() {
  const [stages, setStages] = useState<Set<Stage>>(new Set());
  const parallaxY = useParallax(0.3);

  // Count-up values (start after 1000ms stagger delay)
  const count1 = useCountUp(126, 600, 1000);
  const count2 = useCountUp(7, 600, 1000);
  const count3 = useCountUp(38, 600, 1000);

  // Staggered entrance animation
  useEffect(() => {
    const timings: [number, Stage][] = [
      [0, 'bg'],
      [200, 'image'],
      [400, 'title'],
      [600, 'subtitle'],
      [800, 'cta'],
      [1000, 'stats'],
    ];
    const timers = timings.map(([ms, stage]) =>
      setTimeout(() => setStages(prev => new Set([...prev, stage])), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const visible = (stage: Stage) => stages.has(stage);
  const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <section
      className="hero-container relative w-full overflow-hidden"
      style={{
        opacity: visible('bg') ? 1 : 0,
        transition: `opacity 0.5s ${easing}`,
      }}
    >
      {/* ─── A. Top Nav ─── */}
      <nav className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-8 py-4" style={{ position: 'relative', zIndex: 2 }}>
        {/* Left: Griffin Logo + ORION AI */}
        <div className="flex items-center gap-3">
          <img
            src={griffinLogo}
            alt="Orion Griffin"
            className="h-10 w-auto"
          />
          <span className="brand-text text-white text-lg">
            ORION AI
          </span>
        </div>
        {/* Right: Language Switcher */}
        <div className="flex items-center gap-1">
          {['繁', '簡', 'EN'].map((lang) => (
            <button
              key={lang}
              className="px-3 py-1.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            >
              {lang}
            </button>
          ))}
        </div>
      </nav>

      {/* ─── B. Hero Image (parallax + breathing) ─── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-0 mt-4 md:mt-8" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="w-full overflow-hidden"
          style={{
            opacity: visible('image') ? 1 : 0,
            transition: `opacity 0.5s ${easing}`,
          }}
        >
          <img
            src={heroMain}
            alt="Orion AI Hero"
            className="w-full h-auto object-contain hero-image"
            style={{
              maxWidth: '100%',
              animation: 'breathing 3s ease-in-out infinite',
              transform: `translateY(${parallaxY}px)`,
            }}
          />
        </div>
      </div>

      {/* ─── Orion Belt Divider 1 ─── */}
      <OrionDivider />

      {/* ─── C. Main Title (改造 1: 金色發光) ─── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-2 md:mt-4" style={{ position: 'relative', zIndex: 1 }}>
        <h1
          className="hero-title-glow text-center text-4xl md:text-6xl"
          style={{
            opacity: visible('title') ? 1 : 0,
            transform: visible('title') ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ${easing}`,
          }}
        >
          <span>有想法，就能做成 </span><span className="brand-text">AI</span>
        </h1>
      </div>

      {/* ─── D. Subtitle ─── */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-4" style={{ position: 'relative', zIndex: 1 }}>
        <p
          className="text-center text-base md:text-xl"
          style={{
            color: '#A0A0A0',
            opacity: visible('subtitle') ? 1 : 0,
            transition: `opacity 0.5s ${easing}`,
          }}
        >
          從個人到企業，Orion 幫你把「想做」變成「在跑」
        </p>
      </div>

      {/* ─── E. CTA Button (改造 2: 金磚脈動) ─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-8 flex justify-center"
        style={{
          opacity: visible('cta') ? 1 : 0,
          transition: `opacity 0.5s ${easing}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          className="cta-premium font-bold text-base md:text-lg"
          onClick={() => {
            window.location.href = 'https://orion-hub.zeabur.app';
          }}
        >
          立即開始診斷 →
        </button>
      </div>

      {/* ─── Orion Belt Divider 2 ─── */}
      <OrionDivider />

      {/* ─── F. Stats Cards (改造 3: 發光卡片組) ─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-4 mb-16 md:mb-24"
        style={{
          opacity: visible('stats') ? 1 : 0,
          transition: `opacity 0.5s ${easing}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
          <StatCard icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>} number={count1} label="AI 系統運行中" />
          <StatCard icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>} number={count2} label="今日想法落地" />
          <StatCard icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>} number={count3} label="正在賺錢 / 省時間" />
        </div>
      </div>
    </section>
  );
}
