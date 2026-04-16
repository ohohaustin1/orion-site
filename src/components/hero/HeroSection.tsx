import React, { useState, useEffect, useRef, useCallback } from 'react';
import griffinLogo from '@/assets/images/griffin-logo.png';
import heroMain from '@/assets/images/hero-main.png';

/* Count-Up Animation Hook */
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

/* Scroll Parallax Hook */
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

type Stage = 'bg' | 'image' | 'title' | 'subtitle' | 'cta' | 'stats';

export default function HeroSection() {
  const [stages, setStages] = useState<Set<Stage>>(new Set());
  const parallaxY = useParallax(0.3);

  const count1 = useCountUp(126, 600, 1000);
  const count2 = useCountUp(7, 600, 1000);
  const count3 = useCountUp(38, 600, 1000);

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
      className="relative w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 70%)',
        opacity: visible('bg') ? 1 : 0,
        transition: `opacity 0.5s ${easing}`,
      }}
    >
      <nav className="w-full max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <img src={griffinLogo} alt="Orion Griffin" className="h-10 w-auto" />
          <span className="font-inter font-bold text-white text-lg tracking-tight">ORION AI</span>
        </div>
        <div className="flex items-center gap-1">
          {['繁', '簡', 'EN'].map((lang) => (
            <button key={lang} className="px-3 py-1.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/10 rounded-md transition-colors duration-200">{lang}</button>
          ))}
        </div>
      </nav>

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-0 mt-4 md:mt-8">
        <div className="w-full overflow-hidden" style={{ opacity: visible('image') ? 1 : 0, transition: `opacity 0.5s ${easing}` }}>
          <img src={heroMain} alt="Orion AI Hero" className="w-full h-auto object-contain" style={{ maxWidth: '100%', animation: 'breathing 3s ease-in-out infinite', transform: `translateY(${parallaxY}px)` }} />
        </div>
      </div>
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-8 md:mt-12">
        <h1
          className="text-center text-4xl md:text-6xl font-black"
          style={{
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: visible('title') ? 1 : 0,
            transform: visible('title') ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.5s ${easing}`,
          }}
        >
          有想法，就能做成 AI
        </h1>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-4">
        <p className="text-center text-base md:text-xl" style={{ color: '#A0A0A0', opacity: visible('subtitle') ? 1 : 0, transition: `opacity 0.5s ${easing}` }}>
          從個人到企業，Orion 幫你把「想做」變成「在跑」
        </p>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-8 flex justify-center" style={{ opacity: visible('cta') ? 1 : 0, transition: `opacity 0.5s ${easing}` }}>
        <button
          className="hero-cta-btn font-bold text-base md:text-lg"
          style={{ background: '#D4AF37', color: '#000000', borderRadius: '10px', padding: '16px 32px', border: 'none', cursor: 'pointer', transition: 'all 200ms ease' }}
          onClick={() => { window.location.href = 'https://orion-hub.zeabur.app'; }}
          onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = '#E6C76B'; (e.target as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
          onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = '#D4AF37'; (e.target as HTMLButtonElement).style.transform = 'scale(1)'; }}
          onMouseDown={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { (e.target as HTMLButtonElement).style.transform = 'scale(1.02)'; }}
        >
          立即開始診斷 →
        </button>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-8 mt-12 mb-16 md:mb-24" style={{ opacity: visible('stats') ? 1 : 0, transition: `opacity 0.5s ${easing}` }}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter font-bold text-5xl font-tabular" style={{ color: '#D4AF37', fontVariantNumeric: 'tabular-nums' }}>{count1}</span>
            <span className="text-sm" style={{ color: '#A0A0A0' }}>AI 系統運行中</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter font-bold text-5xl font-tabular" style={{ color: '#D4AF37', fontVariantNumeric: 'tabular-nums' }}>{count2}</span>
            <span className="text-sm" style={{ color: '#A0A0A0' }}>今日想法落地</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="font-inter font-bold text-5xl font-tabular" style={{ color: '#D4AF37', fontVariantNumeric: 'tabular-nums' }}>{count3}</span>
            <span className="text-sm" style={{ color: '#A0A0A0' }}>正在賺錢 / 省時間</span>
          </div>
        </div>
      </div>
    </section>
  );
}
