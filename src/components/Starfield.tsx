import { useEffect, useRef } from 'react';

/**
 * Starfield — 全站共用背景星空
 *
 * 280 粒子（35% 金 + 65% 白）+ twinkle + 4-6s 金色流星。
 * 掛在 App 根節點，position: fixed + z-index: -1 + pointer-events: none。
 * 頁面底色交給 html { background: #0a0a0a }，body 保持 transparent 讓 canvas 透出。
 *
 * 參考 orion-hub/public/index.html initOrionStars()。
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let stars: { x: number; y: number; r: number; a: number; speed: number; twinkle: number; gold: boolean; dx: number; dy: number }[] = [];
    let meteors: { x: number; y: number; vx: number; vy: number; life: number; decay: number }[] = [];
    let nextMeteorAt = performance.now() + 4000 + Math.random() * 2000;
    let lastFrame = performance.now();
    let raf = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(280, Math.max(120, Math.floor((W * H) / 6000)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.015 + 0.005,
        twinkle: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.35,
        dx: (Math.random() - 0.5) * 0.03,
        dy: (Math.random() - 0.5) * 0.03,
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
      grad.addColorStop(0, 'rgba(245,211,105,0)');
      grad.addColorStop(0.8, `rgba(245,211,105,${m.life * 0.7})`);
      grad.addColorStop(1, `rgba(255,220,130,${m.life * 0.95})`);
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
        s.x += s.dx;
        s.y += s.dy;
        if (s.x < -2) s.x = W + 2; else if (s.x > W + 2) s.x = -2;
        if (s.y < -2) s.y = H + 2; else if (s.y > H + 2) s.y = -2;
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}
