import React, { useEffect, useRef, useState } from 'react';

/**
 * HeroSection v12 — 星空 + 透明機器人 + 輸入列
 *
 * Layer 1: #0a0a0a 底
 * Layer 2: canvas 星空（280 粒子 / 35% 金 + 65% 白 / 慢漂 / 4-6s 流星）
 *          參考 orion-hub/public/index.html #bg-stars 實作
 * Layer 3: hero-transparent.png（由 scripts/clean-hero-bg.cjs 烘焙，
 *          把 baked checkerboard 改成 alpha=0 真透明，讓星空透出來）
 * Layer 4: 輸入列（絕對定位，疊在 Hero 下半部）
 *
 * Stats 3 卡獨立於 Hero 下方（不動）。
 *
 * 註：不得不預處理 PNG — 原檔 alpha 100% opaque，作者把編輯器的灰白
 * 透明格子 baked 進 RGB，所以原生 PNG 無法讓星空透出。
 */

const HERO_CSS = `
.hero-v12 {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 520px;
  background-color: #0a0a0a;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* Layer 2 — starfield canvas */
.hero-v12-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* Layer 3 — transparent robot */
.hero-v12-robot {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 92%;
  max-width: 1800px;
  height: auto;
  max-height: 82%;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
  user-select: none;
  animation: robotBreath 9s ease-in-out infinite;
  filter: drop-shadow(0 0 40px rgba(197,160,89,0.18));
}
@keyframes robotBreath {
  0%,100% { transform: translate(-50%, -50%) scale(1.000); }
  50%     { transform: translate(-50%, -50%) scale(1.018); }
}

/* Layer 4 — input pill */
.hero-v12-pill {
  position: absolute;
  left: 50%;
  bottom: 56px;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  width: 680px;
  max-width: calc(100% - 32px);
  background: rgba(10,10,10,0.85);
  border: 0.5px solid rgba(197,160,89,0.3);
  border-radius: 24px;
  padding: 6px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow:
    0 14px 48px rgba(0,0,0,0.55),
    0 0 0 1px rgba(0,0,0,0.25) inset;
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
  z-index: 3;
}
.hero-v12-pill:focus-within {
  border-color: rgba(197,160,89,0.6);
  box-shadow: 0 16px 52px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.2);
}
.hero-v12-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(197,160,89,0.4);
}
.hero-v12-avatar img { width: 28px; height: 28px; object-fit: contain; display: block; }
.hero-v12-input {
  flex: 1;
  min-width: 0;
  border: 0; outline: 0;
  background: transparent;
  color: #fff;
  height: 40px;
  padding: 0 12px;
  font-size: 15px;
  font-family: inherit;
  letter-spacing: 0.02em;
}
.hero-v12-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-v12-submit {
  border: 0; border-radius: 0;
  background: #ffffff; color: #0a0a0a;
  padding: 12px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(255,255,255,0.12);
}
.hero-v12-submit:hover  { background: #f1e8d3; box-shadow: 0 4px 18px rgba(197,160,89,0.4); }
.hero-v12-submit:active { transform: scale(0.97); }

/* Stats 獨立段 */
.hero-stats-section {
  background: #0a0a0a;
  padding: 40px 8vw 72px;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}
.hero-stat {
  position: relative;
  background: rgba(16,14,10,0.85);
  border: 1px solid rgba(197,160,89,0.3);
  border-radius: 0;
  padding: 28px 24px;
  text-align: center;
  transition: border-color 0.3s ease, background 0.3s ease, transform 0.25s ease;
}
.hero-stat::before,
.hero-stat::after {
  content: ''; position: absolute;
  width: 18px; height: 18px;
  border: 1px solid rgba(197,160,89,0.6);
  pointer-events: none;
  transition: border-color 0.3s ease;
}
.hero-stat::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.hero-stat::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }
.hero-stat:hover {
  border-color: rgba(197,160,89,0.7);
  background: rgba(22,19,13,0.95);
  transform: translateY(-2px);
}
.hero-stat:hover::before, .hero-stat:hover::after { border-color: rgba(197,160,89,0.95); }
.hero-stat-num { font-size: 36px; font-weight: 700; color: #C5A059; letter-spacing: 0.04em; line-height: 1.2; }
.hero-stat-label { margin-top: 10px; font-size: 14px; color: rgba(255,255,255,0.65); letter-spacing: 0.06em; line-height: 1.6; }

/* Mobile */
@media (max-width: 1024px) {
  .hero-stat-num { font-size: 30px; }
}
@media (max-width: 768px) {
  .hero-v12 { height: 90vh; min-height: 480px; }
  .hero-v12-robot { width: 150%; max-width: none; max-height: none; height: 80%; object-fit: cover; }
  .hero-v12-pill { bottom: 28px; padding: 5px; gap: 8px; border-radius: 22px; }
  .hero-v12-avatar { width: 36px; height: 36px; }
  .hero-v12-avatar img { width: 24px; height: 24px; }
  .hero-v12-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v12-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.06em; }

  .hero-stats-section { padding: 32px 16px 48px; }
  .hero-stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .hero-stat { padding: 22px 20px; }
  .hero-stat-num { font-size: 26px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-v12-robot { animation: none !important; transform: translate(-50%, -50%); }
}
`;

const STATS = [
  { num: '14 個產業', label: '從餐飲到科技，全覆蓋' },
  { num: '10 分鐘',  label: 'O 幫你釐清需求' },
  { num: '0 成本',   label: '第一次診斷完全免費' },
];

/**
 * Canvas starfield — 280 particles (35% gold / 65% white), slow drift,
 * twinkling alpha, occasional gold meteor every 4-6s. Ported from
 * orion-hub/public/index.html initOrionStars() with React lifecycle.
 */
function useStarfield(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let stars: { x: number; y: number; r: number; a: number; speed: number; twinkle: number; gold: boolean }[] = [];
    let meteors: { x: number; y: number; vx: number; vy: number; life: number; decay: number }[] = [];
    let nextMeteorAt = performance.now() + 4000 + Math.random() * 2000;
    let lastFrame = performance.now();
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(280, Math.floor((W * H) / 6000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.015 + 0.005,
        twinkle: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.35,
      }));
    };

    const maybeSpawnMeteor = (now: number) => {
      if (now < nextMeteorAt) return;
      meteors.push({
        x: Math.random() * W * 0.7 + W * 0.3,
        y: -20,
        vx: -(3 + Math.random() * 2),
        vy: 5 + Math.random() * 3,
        life: 1,
        decay: 1 / (0.55 + Math.random() * 0.35),
      });
      nextMeteorAt = now + 4000 + Math.random() * 2000;
    };

    const drawMeteor = (m: typeof meteors[0]) => {
      const tailX = m.x - m.vx * 10, tailY = m.y - m.vy * 10;
      const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0,    'rgba(245,211,105,0)');
      grad.addColorStop(0.8, `rgba(245,211,105,${m.life * 0.7})`);
      grad.addColorStop(1,   `rgba(255,220,130,${m.life * 0.95})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,225,140,${m.life})`;
      ctx.arc(m.x, m.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (t: number) => {
      const now = t || performance.now();
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;

      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.twinkle += s.speed;
        const alpha = s.a * (0.55 + Math.sin(s.twinkle) * 0.45);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(245,166,35,${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      }

      maybeSpawnMeteor(now);
      for (const m of meteors) {
        m.x += m.vx; m.y += m.vy;
        m.life -= m.decay * dt;
        if (m.life > 0) drawMeteor(m);
      }
      meteors = meteors.filter((m) => m.life > 0 && m.y < H + 50 && m.x > -50);

      raf = requestAnimationFrame(tick);
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
      } else {
        lastFrame = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [canvasRef]);
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useStarfield(canvasRef);
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    const base = 'https://orion01.com';
    window.location.href = trimmed ? `${base}?q=${encodeURIComponent(trimmed)}` : base;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <section className="hero-v12" aria-label="Orion AI 首頁主視覺">
        <canvas ref={canvasRef} className="hero-v12-stars" aria-hidden="true" />
        <img
          className="hero-v12-robot"
          src="/brand/hero-transparent.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <form className="hero-v12-pill" onSubmit={submit}>
          <div className="hero-v12-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v12-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v12-submit">立即開始</button>
        </form>
      </section>

      <section className="hero-stats-section" aria-label="Orion 服務統計">
        <div className="hero-stats-grid">
          {STATS.map((s) => (
            <div key={s.num} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
