import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

export default function AnalysisCounter() {
  const [count, setCount] = useState(() => 12847 + Math.floor(Math.random() * 200));
  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const tick = () => {
      const increment = Math.floor(Math.random() * 2) + 1;
      setAnimate(true);
      setCount(prev => prev + increment);
      setTimeout(() => setAnimate(false), 600);
      const nextInterval = Math.floor(Math.random() * (600000 - 300000 + 1)) + 300000;
      timerRef.current = setTimeout(tick, nextInterval);
    };
    // First tick in 30-90 seconds
    timerRef.current = setTimeout(tick, Math.floor(Math.random() * 60000) + 30000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className={`orion-analysis-counter ${animate ? 'pulse' : ''}`}>
      <Activity size={16} style={{ color: 'var(--orion-gold)' }} />
      <span className="counter-label">已完成 AI 分析</span>
      <span className="counter-number">{count.toLocaleString()}</span>
      <span className="counter-unit">筆</span>
      <span className="counter-dot" />
    </div>
  );
}
