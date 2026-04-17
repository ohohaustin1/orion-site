import React, { useState, useEffect } from 'react';

const ORION_LOGO = '/ORIONLOGO.png';

const bootLines = [
  '正在連結智囊系統...',
  '獵戶座分析引擎啟動中',
  'AI 推論層就緒',
  '系統就緒 · 歡迎，指揮官',
];

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show lines sequentially: 0→400ms, 1→900ms, 2→1400ms, 3→1900ms
    const timers = bootLines.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), 400 + i * 500)
    );

    // Progress bar fills over ~2.5s
    let frame: number;
    const start = Date.now();
    const duration = 2500;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);

    // Auto-complete at 3 seconds — no button required
    const autoComplete = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      clearTimeout(autoComplete);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080b12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        zIndex: 9999,
      }}
    >
      {/* Gold LOGO entrance from center */}
      <img
        src={ORION_LOGO}
        alt="ORION"
        style={{
          width: window.innerWidth >= 768 ? 280 : 200,
          height: 'auto',
          objectFit: 'contain',
          animation: 'splashLogoEntrance 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
          marginBottom: 28,
        }}
      />

      {/* Title */}
      <div
        style={{
          color: '#c9a84c',
          fontSize: '1.6rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          marginBottom: 6,
          opacity: 0,
          animation: 'splashTextLine 0.5s ease-out 0.6s forwards',
        }}
      >
        獵戶智鑑
      </div>
      <div
        style={{
          color: '#7a8499',
          fontSize: '0.7rem',
          letterSpacing: '0.18em',
          fontFamily: "'Orbitron', 'Inter', sans-serif",
          marginBottom: 32,
          opacity: 0,
          animation: 'splashTextLine 0.5s ease-out 0.8s forwards',
        }}
      >
        ORION AI INTELLIGENCE SYSTEM
      </div>

      {/* Boot lines */}
      <div
        style={{
          fontFamily: "'Orbitron', 'Inter', sans-serif",
          fontSize: '0.82rem',
          color: '#c9a84c',
          lineHeight: 2,
          minHeight: 120,
          textAlign: 'left',
          width: 320,
          maxWidth: '90vw',
        }}
      >
        {bootLines.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            style={{
              opacity: 0,
              animation: `splashTextLine 0.4s ease-out forwards`,
              animationDelay: '0s',
            }}
          >
            {i < bootLines.length - 1 ? `[ OK ] ${line}` : `[ ✓ ] ${line}`}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 320,
          maxWidth: '90vw',
          height: 3,
          background: '#1a2235',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 16,
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #c9a84c, #e8c96a)',
            borderRadius: 2,
            transition: 'width 0.05s linear',
          }}
        />
      </div>
      <div
        style={{
          color: '#4a5268',
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          marginTop: 8,
        }}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
}
