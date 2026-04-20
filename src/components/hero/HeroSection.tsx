import React, { useState } from 'react';

/**
 * HeroSection v14 — 全站統一宇宙版
 *
 * 背景：交給全站 <Starfield/>（App.tsx 根節點 fixed canvas，z-index:-1）
 * Hero section 本身完全透明，只放：
 *   1. <img src="/brand/hero2-clean.png"> 居中主視覺（預處理過的 alpha 透明版）
 *   2. 底部 20%-bottom 的膠囊輸入列
 *   3. 底部淡出漸層，讓 Stats 自然接續（無分割線）
 *
 * Stats 3 卡獨立於 Hero 下方。4 步驟卡片（我們怎麼幫你）留在 HomePage。
 */

const HERO_CSS = `
.hero-v14 {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 560px;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* 機器人主視覺 */
.hero-v14-robot {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  max-width: 85%;
  max-height: 85%;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  animation: robotBreath 9s ease-in-out infinite;
  filter: drop-shadow(0 0 40px rgba(197,160,89,0.2));
}
@keyframes robotBreath {
  0%,100% { transform: translate(-50%, -50%) scale(1.000); }
  50%     { transform: translate(-50%, -50%) scale(1.018); }
}

/* 底部淡出漸層 — Hero→Stats 無縫 */
.hero-v14-fade {
  position: absolute;
  inset: auto 0 0 0;
  height: 30%;
  background: linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.6) 60%, #0a0a0a 100%);
  pointer-events: none;
  z-index: 2;
}

/* 輸入列 */
.hero-v14-pill {
  position: absolute;
  left: 50%;
  bottom: 15%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  width: 680px;
  max-width: calc(100% - 32px);
  background: rgba(0,0,0,0.6);
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: 24px;
  padding: 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 16px 52px rgba(0,0,0,0.55);
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
  z-index: 3;
}
.hero-v14-pill:focus-within {
  border-color: rgba(212,175,55,0.7);
  box-shadow: 0 18px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.25);
}
.hero-v14-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(212,175,55,0.4);
}
.hero-v14-avatar img { width: 28px; height: 28px; object-fit: contain; display: block; }
.hero-v14-input {
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
.hero-v14-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-v14-submit {
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
.hero-v14-submit:hover  { background: #f1e8d3; box-shadow: 0 4px 18px rgba(212,175,55,0.4); }
.hero-v14-submit:active { transform: scale(0.97); }

/* Stats 獨立段 */
.hero-stats-section {
  background: transparent;
  padding: 32px 8vw 72px;
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
  background: rgba(16,14,10,0.7);
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
  background: rgba(22,19,13,0.9);
  transform: translateY(-2px);
}
.hero-stat:hover::before, .hero-stat:hover::after { border-color: rgba(197,160,89,0.95); }
.hero-stat-num { font-size: 36px; font-weight: 700; color: #C5A059; letter-spacing: 0.04em; line-height: 1.2; }
.hero-stat-label { margin-top: 10px; font-size: 14px; color: rgba(255,255,255,0.65); letter-spacing: 0.06em; line-height: 1.6; }

@media (max-width: 1024px) {
  .hero-stat-num { font-size: 30px; }
}
@media (max-width: 768px) {
  .hero-v14 { height: 92vh; min-height: 480px; }
  .hero-v14-robot { max-width: 100%; max-height: 72%; }
  .hero-v14-pill {
    bottom: 13%;
    padding: 5px;
    gap: 8px;
    border-radius: 22px;
  }
  .hero-v14-avatar { width: 36px; height: 36px; }
  .hero-v14-avatar img { width: 24px; height: 24px; }
  .hero-v14-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v14-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.06em; }

  .hero-stats-section { padding: 24px 16px 48px; }
  .hero-stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .hero-stat { padding: 22px 20px; }
  .hero-stat-num { font-size: 26px; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-v14-robot { animation: none !important; transform: translate(-50%, -50%); }
}
`;

const STATS = [
  { num: '14 個產業', label: '從餐飲到科技，全覆蓋' },
  { num: '10 分鐘',  label: 'O 幫你釐清需求' },
  { num: '0 成本',   label: '第一次診斷完全免費' },
];

export default function HeroSection() {
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

      <section className="hero-v14" aria-label="Orion AI 首頁主視覺">
        <img
          className="hero-v14-robot"
          src="/brand/hero2-clean.png"
          alt=""
          aria-hidden="true"
          draggable={false}
        />

        <form className="hero-v14-pill" onSubmit={submit}>
          <div className="hero-v14-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v14-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v14-submit">立即開始</button>
        </form>

        <div className="hero-v14-fade" aria-hidden="true" />
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
