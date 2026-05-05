import React, { useState, useEffect } from 'react';

const ritualLines = [
  '正在連結智囊系統...',
  '正在分析市場路徑...',
  '正在計算 ROI 缺口...',
  '正在生成策略方案...',
  '即將揭露你的成交卡點...',
];

interface LoadingRitualProps {
  active: boolean;
  onComplete?: () => void;
}

export function LoadingRitual({ active, onComplete }: LoadingRitualProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!active) return;
    setLineIndex(0);
    setCharIndex(0);
    setDisplayText('');
  }, [active]);

  useEffect(() => {
    if (!active) return;
    if (lineIndex >= ritualLines.length) {
      onComplete?.();
      return;
    }

    const currentLine = ritualLines[lineIndex];

    if (charIndex < currentLine.length) {
      // Typewriter effect: 40ms per char
      const timer = setTimeout(() => {
        setDisplayText(currentLine.slice(0, charIndex + 1));
        setCharIndex(c => c + 1);
      }, 40);
      return () => clearTimeout(timer);
    } else {
      // Hold full line for 800ms, then advance
      const timer = setTimeout(() => {
        setLineIndex(i => i + 1);
        setCharIndex(0);
        setDisplayText('');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active, lineIndex, charIndex]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(8,11,18,0.92)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      zIndex: 10000,
      backdropFilter: 'blur(8px)',
    }}>
      {/* Pulsing gold dot */}
      <div style={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: '#c9a84c',
        marginBottom: 24,
        animation: 'ritualPulse 1.2s ease-in-out infinite',
        boxShadow: '0 0 20px rgba(201,168,76,0.6)',
      }} />

      {/* Typewriter text */}
      <div style={{
        fontFamily: 'monospace',
        fontSize: '1rem',
        color: '#c9a84c',
        letterSpacing: '0.06em',
        minHeight: '1.6em',
        textAlign: 'center',
      }}>
        {displayText}
        <span style={{ animation: 'ritualBlink 0.6s step-end infinite', color: '#e8c96a' }}>|</span>
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex',
        gap: 6,
        marginTop: 20,
      }}>
        {ritualLines.map((_, i) => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i <= lineIndex ? '#c9a84c' : 'rgba(201,168,76,0.2)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <style>{`
        @keyframes ritualPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes ritualBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
