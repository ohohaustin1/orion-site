import React, { useEffect, useMemo, useRef } from 'react';

/**
 * SplashScreen — Industrial Design Protocol v1
 * ────────────────────────────────────────────────────────────────────
 * Port 自 orion-hub/public/loading.html v2（[CHAIRMAN-APPROVED 2026-04-20]）
 *
 * 6 秒時間軸：
 *   T=0-0.3s    黑屏
 *   T=0.3s      Canvas 星流啟動（金色粒子 ↗）
 *   T=0.5-1.5s  獅鷲從 -30vh 飛近
 *   T=1.8-3.0s  2px matte gold scan line 由上至下掃過
 *   T=3.0s      獅鷲能量脈衝（X-Ray brightness 1.55）
 *   T=3.3-4.1s  4 corner L-brackets 收縮
 *   T=4.1s      「ORION AI」matte gold 淡入
 *   T=4.6s      tagline「做一次系統　當你一輩子的 AI 顧問」
 *   T=5.0-5.5s  4 行 checklist 逐行 inject
 *   T=5.5-6.0s  progress bar 0→100% + 全部淡出
 *   T=6.0s      onComplete()
 *
 * prefers-reduced-motion: 800ms 短路跳過動畫。
 * 點擊 / 鍵盤 / 觸控：立即跳過、onComplete 立即 fire。
 * ────────────────────────────────────────────────────────────────────
 */

const ORION_LOGO = '/brand/griffin-256.png';

const BOOT_LINES = [
  'Orion 核心初始化中...',
  '正在對齊 AI 自動化節點...',
  '系統自我迭代環境檢測中...',
  '系統就緒 ✓',
];

const DURATION_FULL_MS = 6000;
const DURATION_REDUCED_MS = 800;
const WATCHDOG_MS = 30000;

interface SplashScreenProps {
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  bright: boolean;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const completedRef = useRef(false);

  // Stable session ID across re-renders
  const sid = useMemo(() => {
    const hex = '0123456789ABCDEF';
    let id = '';
    for (let i = 0; i < 8; i += 1) id += hex[Math.floor(Math.random() * 16)];
    return id;
  }, []);

  // Main timer + interaction skip + watchdog
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fireComplete = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    };

    const mainTimer = window.setTimeout(
      fireComplete,
      reduced ? DURATION_REDUCED_MS : DURATION_FULL_MS
    );
    const watchdog = window.setTimeout(fireComplete, WATCHDOG_MS);

    const skip = () => fireComplete();
    window.addEventListener('click', skip, { once: true, passive: true });
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('touchstart', skip, { once: true, passive: true });

    return () => {
      clearTimeout(mainTimer);
      clearTimeout(watchdog);
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [onComplete]);

  // Gold star-stream canvas (directional ↗)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let particles: Particle[] = [];
    let rafId = 0;

    const spawn = (): Particle => ({
      x: Math.random() * window.innerWidth - 50,
      y: window.innerHeight + Math.random() * 50,
      vx: 0.15 + Math.random() * 0.55,
      vy: -(0.25 + Math.random() * 0.65),
      r: 0.4 + Math.random() * 1.4,
      a: 0.15 + Math.random() * 0.55,
      bright: Math.random() > 0.6,
    });

    const resize = () => {
      canvas.width = window.innerWidth * DPR;
      canvas.height = window.innerHeight * DPR;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const count = Math.min(
        160,
        Math.floor((canvas.width * canvas.height) / (DPR * DPR) / 7500)
      );
      particles = Array.from({ length: count }, spawn);
      for (let i = 0; i < particles.length / 2; i += 1) {
        particles[i].x = Math.random() * window.innerWidth;
        particles[i].y = Math.random() * window.innerHeight;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        const color = p.bright
          ? `rgba(245,211,105,${p.a})`
          : `rgba(197,160,89,${p.a * 0.75})`;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = p.r * 0.5;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 5, p.y - p.vy * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.x > window.innerWidth + 40 || p.y < -40) {
          Object.assign(p, spawn());
        }
      }
      rafId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="splash-v2" role="status" aria-live="polite" aria-label="Orion AI 系統初始化中">
      <canvas ref={canvasRef} className="splash-stars" aria-hidden="true" />

      <div className="splash-stage">
        <div className="target-brackets" aria-hidden="true">
          <div className="bracket tl" />
          <div className="bracket tr" />
          <div className="bracket bl" />
          <div className="bracket br" />
        </div>

        <div className="griffin-wrap">
          <img
            className="griffin-img"
            src={ORION_LOGO}
            alt="Orion"
            width={256}
            height={256}
          />
        </div>

        <div className="brand-name">ORION AI</div>
        <div className="brand-tagline">做一次系統　當你一輩子的 AI 顧問</div>

        <div className="checklist">
          {BOOT_LINES.map((line, i) => (
            <div
              key={line}
              className="line"
              style={{
                animationDelay: `${(5.0 + i * 0.12).toFixed(2)}s, 5.5s`,
              }}
            >
              <span className="prefix">&gt;</span>
              {line}
            </div>
          ))}
        </div>

        <div className="progress-wrap" aria-hidden="true">
          <div className="progress-fill" />
        </div>
      </div>

      <div className="scan-line" aria-hidden="true" />
      <div className="splash-scanlines" aria-hidden="true" />
      <div className="splash-vignette" aria-hidden="true" />

      <div className="session-id" aria-hidden="true">
        <span className="live" />
        SID-{sid}
      </div>
    </div>
  );
}
