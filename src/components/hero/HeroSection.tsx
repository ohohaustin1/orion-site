import React, { useState, useEffect, useRef } from 'react';
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

/* ── StatCard — 主數字 + 單位 + 描述 三層 ── */
function StatCard({
  number,
  unit,
  description,
}: {
  number: number | string;
  unit: string;
  description: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-number font-tabular" style={{ color: '#C5A059' }}>
        {number}
      </div>
      <div className="stat-divider"></div>
      <div
        className="stat-label"
        style={{ color: 'rgba(255,255,255,0.88)', fontSize: '15px', letterSpacing: '0.05em' }}
      >
        {unit}
      </div>
      <div
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '13px',
          lineHeight: 1.6,
          marginTop: '8px',
          letterSpacing: '0.03em',
        }}
      >
        {description}
      </div>
    </div>
  );
}

/* ── Orion Belt Divider ── */
function OrionDivider() {
  return (
    <div className="orion-divider">
      <div className="orion-divider-line"></div>
      <div className="orion-divider-stars">★ ★ ★</div>
      <div className="orion-divider-line"></div>
    </div>
  );
}

/* ── Stagger Stage Type ── */
type Stage = 'bg' | 'image' | 'title' | 'subtitle' | 'cta' | 'stats';

export default function HeroSection() {
  const [stages, setStages] = useState<Set<Stage>>(new Set());
  const parallaxY = useParallax(0.3);

  // Count-up values（0 不需動畫、保留兩個有數感的）
  const count14 = useCountUp(14, 600, 1000);
  const count10 = useCountUp(10, 600, 1000);

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
      setTimeout(() => setStages((prev) => new Set([...prev, stage])), ms)
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
      {/* ─── A. Top Nav（語言切換器已拿掉）─── */}
      <nav
        className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-8 py-4"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="flex items-center gap-3">
          <img src={griffinLogo} alt="Orion Griffin" className="h-10 w-auto" />
          <span
            className="brand-text text-white text-lg"
            style={{ color: '#C5A059', letterSpacing: '0.15em' }}
          >
            ORION AI
          </span>
        </div>
      </nav>

      {/* ─── B. Hero Image（parallax + breathing + 左側黑色漸層覆蓋）─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-0 mt-4 md:mt-8"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div
          className="w-full overflow-hidden"
          style={{
            position: 'relative',
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
          {/* 左側黑色漸層：左濃右淡、讓右側機器人透出 */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      <OrionDivider />

      {/* ─── C. 主標題 —「做一次系統　當你一輩子的 AI 顧問」─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-2 md:mt-4"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1
          className="hero-title-glow text-center"
          style={{
            color: '#C5A059',
            fontFamily: "'Space Grotesk', 'Noto Sans TC', sans-serif",
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '0.05em',
            opacity: visible('title') ? 1 : 0,
            transform: visible('title') ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ${easing}`,
          }}
        >
          做一次系統　當你一輩子的 AI 顧問
        </h1>
      </div>

      {/* ─── D. 副標 —「說出你的問題，O 幫你找出失去的錢」─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-6"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <p
          className="text-center"
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.6,
            letterSpacing: '0.05em',
            opacity: visible('subtitle') ? 1 : 0,
            transition: `opacity 0.5s ${easing}`,
          }}
        >
          說出你的問題，O 幫你找出失去的錢
        </p>
      </div>

      {/* ─── E. CTA —「立即開始對話 →」→ orion01.com ─── */}
      <div
        className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-10 flex justify-center"
        style={{
          opacity: visible('cta') ? 1 : 0,
          transition: `opacity 0.5s ${easing}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <button
          className="cta-premium font-bold text-base md:text-lg"
          style={{ letterSpacing: '0.08em' }}
          onClick={() => {
            window.location.href = 'https://orion01.com';
          }}
        >
          立即開始對話 →
        </button>
      </div>

      <OrionDivider />

      {/* ─── F. Stats 3 — 14 個產業 / 10 分鐘 / 0 成本 ─── */}
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
          <StatCard number={count14} unit="個產業" description="從餐飲到科技，全覆蓋" />
          <StatCard number={count10} unit="分鐘" description="O 幫你釐清需求" />
          <StatCard number={0} unit="成本" description="第一次診斷完全免費" />
        </div>
      </div>
    </section>
  );
}
