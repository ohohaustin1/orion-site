import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

export default function AnalysisCounter() {
  const [count, setCount] = useState<number>(() => {
    // Load from localStorage on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('orion_analysis_count');
      if (stored) {
        try {
          const { count: savedCount, timestamp: savedTimestamp } = JSON.parse(stored);
          const now = Date.now();
          const elapsedMs = now - savedTimestamp;

          // Calculate how many increments should have happened since last save
          const currentHour = new Date().getHours();
          const isPeakHours = currentHour >= 9 && currentHour < 21;

          // Peak hours: every 4-6 min, Night hours: every 8-10 min
          const minInterval = isPeakHours ? 4 * 60 * 1000 : 8 * 60 * 1000;
          const maxInterval = isPeakHours ? 6 * 60 * 1000 : 10 * 60 * 1000;
          const avgInterval = (minInterval + maxInterval) / 2;

          // Calculate approximate increments (use average interval)
          const approxIncrements = Math.floor(elapsedMs / avgInterval);

          // Return saved count plus calculated increments
          return savedCount + approxIncrements;
        } catch (e) {
          // If localStorage is corrupted, start fresh
          return 118;
        }
      }
    }
    return 118;
  });

  const [animate, setAnimate] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSaveRef = useRef<number>(count);

  // Save to localStorage whenever count changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orion_analysis_count', JSON.stringify({
        count,
        timestamp: Date.now()
      }));
      lastSaveRef.current = count;
    }
  }, [count]);

  useEffect(() => {
    const scheduleNextIncrement = () => {
      const currentHour = new Date().getHours();
      const isPeakHours = currentHour >= 9 && currentHour < 21;

      // Peak hours: every 4-6 min, Night hours: every 8-10 min
      const minInterval = isPeakHours ? 4 * 60 * 1000 : 8 * 60 * 1000;
      const maxInterval = isPeakHours ? 6 * 60 * 1000 : 10 * 60 * 1000;
      const nextInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

      timerRef.current = setTimeout(() => {
        const currentHour = new Date().getHours();
        const isPeakHours = currentHour >= 9 && currentHour < 21;

        // +1-2 increment
        const increment = Math.floor(Math.random() * 2) + 1;

        setAnimate(true);
        setCount(prev => prev + increment);
        setTimeout(() => setAnimate(false), 400);

        scheduleNextIncrement();
      }, nextInterval);
    };

    // First increment in 4-10 minutes
    const firstInterval = Math.floor(Math.random() * (10 * 60 * 1000 - 4 * 60 * 1000 + 1)) + 4 * 60 * 1000;
    timerRef.current = setTimeout(() => {
      const increment = Math.floor(Math.random() * 2) + 1;
      setAnimate(true);
      setCount(prev => prev + increment);
      setTimeout(() => setAnimate(false), 400);
      scheduleNextIncrement();
    }, firstInterval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const styles = `
    @keyframes counterBounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }

    .orion-analysis-counter-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #999;
    }

    .counter-number-container {
      display: inline-block;
    }

    .counter-number-animated {
      color: #d4a853;
      font-weight: 600;
      display: inline-block;
      animation: ${animate ? 'counterBounce 0.4s ease-in-out' : 'none'};
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <span className="orion-analysis-counter-wrapper" data-analysis-counter>
        <Activity size={16} style={{ color: '#d4a853' }} />
        <span>已有</span>
        <span className="counter-number-container">
          <span className="counter-number-animated">{count.toLocaleString()}</span>
        </span>
        <span>筆企業完成 AI 診斷</span>
      </span>
    </>
  );
}
