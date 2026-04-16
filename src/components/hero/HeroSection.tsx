import React, { useState, useEffect, useRef, useCallback } from 'react';
import griffinLogo from '@/assets/images/griffin-logo.png';
import heroMain from '@/assets/images/hero-main.png';

/* ââ Count-Up Animation Hook ââ */
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

/* ââ Scroll Parallax Hook ââ */
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

/* ââ StatCard Component (æ¹é  3) ââ */
function StatCard({ icon, number, label }: { icon: string; number: number; label: string }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number font-tabular">{number}</div>
      <div className="stat-divider"></div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ââ Orion Belt Divider (æ¹é  5) ââ */
function OrionDivider() {
  return (
    <div className="orion-divider">
      <div className="orion-divider-line"></div>
      <div className="orion-divider-stars">â â â</div>
      <div className="orion-divider-line"></div>
    </div>
  );
}

/* ââ Stagger Stage Type ââ */
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
      {/* âââ A. Top Nav âââ */}
      <nav className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-8 py-4" style={{ position: 'relative', zIndex: 2 }}>
        {/* Left: Griffin Logo + ORION AI */}
        <div className="flex items-center gap-3">
          <img
            src={griffinLogo}
            alt="Orion Griffin"
            className="h-10 w-auto"
          />
          <span className="font-inter font-bold text-white text-lg tracking-tight">
            ORION AI
          </span>
        </div>
        {/* Right: Language Switcher */}
        <div className="flex items-center gap-1">
          {['ç¹', 'ç°¡', 'EN'].map((lang) => (
            <button
              key={lang}
              className="px-3 py-1.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200"
            >
              {lang}
            </button>
          ))}
        </div>
      </nav>

      {/* âââ B. Hero Image (parallax + breathing) âââ */}
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
            className="w-full h-auto object-contain"
            style={{
              maxWidth: '100%',
              animation: 'breathing 3s ease-in-out infinite',
              transform: `translateY(${parallaxY}px)`,
            }}
          />
        </div>
      </div>

      {/* âââ Orion Belt Divider 1 âââ */}
      <OrionDivider />

      {/* âââ C. Main Title (æ¹é  1: éè²ç¼å) âââ */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-2 md:mt-4" style={{ position: 'relative', zIndex: 1 }}>
        <h1
          className="hero-title-glow text-center text-4xl md:text-6xl"
          style={{
            opacity: visible('title') ? 1 : 0,
            transform: visible('title') ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ${easing}`,
          }}
        >
          ææ³æ³ï¼å°±è½åæ AI
        </h1>
      </div>

      {/* âââ D. Subtitle âââ */}
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-4" style={{ position: 'relative', zIndex: 1 }}>
        <p
          className="text-center text-base md:text-xl"
          style={{
            color: '#A0A0A0',
            opacity: visible('subtitle') ? 1 : 0,
            transition: `opacity 0.5s ${easing}`,
          }}
        >
          å¾åäººå°ä¼æ¥­ï¼Orion å¹«ä½ æãæ³åãè®æãå¨è·ã
        </p>
      </div>

      {/* âââ E. CTA Button (æ¹é  2: éç£èå) âââ */}
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
          ç«å³éå§è¨ºæ· â
        </button>
      </div>

      {/* âââ Orion Belt Divider 2 âââ */}
      <OrionDivider />

      {/* âââ F. Stats Cards (æ¹é  3: ç¼åå¡ççµ) âââ */}
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
          <StatCard icon="â¡" number={count1} label="AI ç³»çµ±éè¡ä¸­" />
          <StatCard icon="ð¡" number={count2} label="ä»æ¥æ³æ³è½å°" />
          <StatCard icon="ð" number={count3} label="æ­£å¨è³ºé¢ / çæé" />
        </div>
      </div>
    </section>
  );
}
