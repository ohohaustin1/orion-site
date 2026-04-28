import React, { useState } from 'react';
import { DIAG_URL } from '../../lib/api-base';

/**
 * HeroSection v16 — Cinematic v1
 *
 * 升級項（Chairman 2026-04-24 指示）：
 *   • HERO3.png 背景呼吸（scale 1→1.02 8s）
 *   • 機器人雙眼脈衝金光（絕對定位 2 點）
 *   • 輸入欄 placeholder「做一次系統，賺一輩子輕鬆」
 *   • 底部產業印記列「+14 個產業已在運行」+ 產業符號
 *   • 4 Steps 區塊移出 HeroSection，交由 HomePage 用 GlassCard 獨立渲染
 */

const HERO_CSS = `
.hero-v16 {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 560px;
  /* P1-Hero：純黑 → 微漸層、視覺更柔（Aman 風） */
  background:
    radial-gradient(ellipse at center, #0f0c08 0%, #0a0a0a 50%, #050505 100%);
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* SEO：visually-hidden h1（讓 Google 抓得到頁面主題、視覺不影響）*/
.hero-v16-h1-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* HERO3 背景層 — 獨立 div 以便做 scale 呼吸動畫 */
.hero-v16-bg {
  position: absolute;
  inset: 0;
  background-image: url('/brand/HERO3.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  /* P1-Hero：8s → 12s（更慢的呼吸、Aman 寧靜感） */
  animation: heroBreathe 12s ease-in-out infinite;
  /* 整體透明度微降、減少視覺壓迫 */
  opacity: 0.94;
  will-change: transform;
  z-index: 1;
}
@keyframes heroBreathe {
  0%,100% { transform: scale(1.00); }
  50%     { transform: scale(1.025); }
}

/* 機器人眼睛發光（2 點絕對位置，視覺錨定 HERO3 臉部約略位置） */
.hero-v16-eye {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,225,140,0.95) 0%, rgba(245,211,105,0.6) 40%, rgba(197,160,89,0) 70%);
  box-shadow:
    0 0 8px rgba(255,220,130,0.8),
    0 0 20px rgba(245,211,105,0.55),
    0 0 40px rgba(197,160,89,0.35);
  /* P1-Hero：2.4s → 3.6s（眼睛 pulse 也放慢、寧靜感） */
  animation: heroEyePulse 3.6s ease-in-out infinite;
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: screen;
}
.hero-v16-eye-l { top: 34%; left: 47.2%; }
.hero-v16-eye-r { top: 34%; left: 52.8%; animation-delay: 0.2s; }
@keyframes heroEyePulse {
  0%,100% {
    opacity: 0.75;
    transform: scale(1);
    box-shadow: 0 0 8px rgba(255,220,130,0.8), 0 0 20px rgba(245,211,105,0.55), 0 0 40px rgba(197,160,89,0.35);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
    box-shadow: 0 0 14px rgba(255,225,140,1), 0 0 30px rgba(245,211,105,0.8), 0 0 60px rgba(197,160,89,0.5);
  }
}

/* 底部淡出漸層 — Hero → 下一 section 無縫 */
.hero-v16-fade {
  position: absolute;
  inset: auto 0 0 0;
  height: 18%;
  background: linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.8) 70%, #0a0a0a 100%);
  pointer-events: none;
  z-index: 3;
}

/* 輸入列膠囊 */
.hero-v16-pill {
  position: absolute;
  left: 50%;
  bottom: 20%;
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
  box-shadow: 0 16px 52px rgba(0,0,0,0.55);
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
  z-index: 4;
}
.hero-v16-pill:focus-within {
  border-color: rgba(197,160,89,0.7);
  box-shadow: 0 18px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.3);
}
.hero-v16-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(197,160,89,0.4);
}
.hero-v16-avatar img { width: 28px; height: 28px; object-fit: contain; display: block; }
.hero-v16-input {
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
.hero-v16-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-v16-submit {
  border: 0; border-radius: 0;
  background: #C5A059; color: #0a0a0a;
  padding: 12px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 14px rgba(197,160,89,0.4), 0 0 24px rgba(197,160,89,0.2);
}
.hero-v16-submit:hover  { background: #d9b770; box-shadow: 0 6px 22px rgba(197,160,89,0.6), 0 0 36px rgba(197,160,89,0.35); }
.hero-v16-submit:active { transform: scale(0.97); }

/* 底部 tagline — Chairman 2026-04-24：「做一次系統，當你一輩子的顧問」 */
.hero-v16-tagline {
  position: absolute;
  left: 50%;
  bottom: 8%;                        /* Chairman 2026-04-24: 12% → 8% 避免被輸入欄遮住 */
  transform: translateX(-50%);
  z-index: 5;
  padding: 8px 20px;
  pointer-events: none;
  white-space: nowrap;
}
.hero-v16-tagline-text {
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  font-size: 18px;
  font-weight: 300;
  color: rgba(197,160,89,0.9);
  letter-spacing: 0.15em;
  text-shadow: 0 0 20px rgba(197,160,89,0.4), 0 0 40px rgba(197,160,89,0.2);
}

/* Mobile */
@media (max-width: 768px) {
  .hero-v16 { height: 92vh; min-height: 520px; }
  .hero-v16-bg {
    opacity: 0.55; /* 手機減少干擾，讓輸入列更突出 */
  }
  .hero-v16-eye { width: 10px; height: 10px; top: 30%; }
  .hero-v16-pill {
    bottom: 22%;
    padding: 5px;
    gap: 8px;
    border-radius: 22px;
  }
  .hero-v16-avatar { width: 36px; height: 36px; }
  .hero-v16-avatar img { width: 24px; height: 24px; }
  .hero-v16-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v16-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.08em; }

  .hero-v16-tagline { bottom: 10%; }
  .hero-v16-tagline-text {
    font-size: 14px;
    letter-spacing: 0.12em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-v16-bg, .hero-v16-eye {
    animation: none !important;
  }
}
`;

export default function HeroSection() {
  const [q, setQ] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    // Chairman 2026-04-24：Hero CTA 直達捕獲室（Zeabur），不再停在 orion01.com 自家首頁
    // CN-PROXY-VERCEL-EDGE-001: page nav 用 DIAG_URL（永遠直連、不走 proxy、HTML 不透傳）
    const base = DIAG_URL;
    window.location.href = trimmed ? `${base}/?q=${encodeURIComponent(trimmed)}` : `${base}/`;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <section className="hero-v16" aria-label="Orion AI 首頁主視覺">
        <h1 className="hero-v16-h1-sr">Orion 獵戶座智鑑 — 企業級 AI 成交引擎</h1>
        <div className="hero-v16-bg" aria-hidden="true" />

        {/* 眼睛發光 */}
        <div className="hero-v16-eye hero-v16-eye-l" aria-hidden="true" />
        <div className="hero-v16-eye hero-v16-eye-r" aria-hidden="true" />

        <form className="hero-v16-pill" onSubmit={submit}>
          <div className="hero-v16-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v16-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="做一次系統，賺一輩子輕鬆"
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v16-submit">立即開始</button>
        </form>

        {/* 底部 tagline */}
        <div className="hero-v16-tagline">
          <span className="hero-v16-tagline-text">做一次系統，當你一輩子的顧問</span>
        </div>

        <div className="hero-v16-fade" aria-hidden="true" />
      </section>
    </>
  );
}
