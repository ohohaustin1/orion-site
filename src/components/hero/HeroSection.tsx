import React, { useState } from 'react';

/**
 * HeroSection v13 — 深度融合版（烘焙 composite 為單張背景）
 *
 * 結構：
 *   背景：/brand/hero-composite-final.png（由 scripts/bake-hero-bg.cjs
 *         在 build-time 烘出的 1920×1080 單張圖 — 星雲 + 500+ 星點 +
 *         機器人 + 金色光暈已全部融合）
 *   輸入列：絕對定位 bottom 20% 置中 膠囊
 *
 * Stats 3 卡獨立於 Hero 下方。
 */

const HERO_CSS = `
.hero-v13 {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 560px;
  background-color: #0a0a0a;
  background-image: url('/brand/hero-composite-final.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* Chairman 規格：輸入列 bottom 20% 水平置中 */
.hero-v13-pill {
  position: absolute;
  left: 50%;
  bottom: 20%;
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
  box-shadow:
    0 16px 52px rgba(0,0,0,0.55),
    0 0 0 1px rgba(0,0,0,0.25) inset;
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
  z-index: 2;
}
.hero-v13-pill:focus-within {
  border-color: rgba(212,175,55,0.65);
  box-shadow: 0 18px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.25);
}
.hero-v13-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(212,175,55,0.4);
}
.hero-v13-avatar img { width: 28px; height: 28px; object-fit: contain; display: block; }
.hero-v13-input {
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
.hero-v13-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-v13-submit {
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
.hero-v13-submit:hover  { background: #f1e8d3; box-shadow: 0 4px 18px rgba(212,175,55,0.4); }
.hero-v13-submit:active { transform: scale(0.97); }

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

@media (max-width: 1024px) {
  .hero-stat-num { font-size: 30px; }
}
@media (max-width: 768px) {
  .hero-v13 { height: 90vh; min-height: 480px; background-position: 55% center; }
  .hero-v13-pill {
    bottom: 15%;
    padding: 5px;
    gap: 8px;
    border-radius: 22px;
  }
  .hero-v13-avatar { width: 36px; height: 36px; }
  .hero-v13-avatar img { width: 24px; height: 24px; }
  .hero-v13-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v13-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.06em; }

  .hero-stats-section { padding: 32px 16px 48px; }
  .hero-stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .hero-stat { padding: 22px 20px; }
  .hero-stat-num { font-size: 26px; }
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

      <section className="hero-v13" aria-label="Orion AI 首頁主視覺">
        <form className="hero-v13-pill" onSubmit={submit}>
          <div className="hero-v13-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v13-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v13-submit">立即開始</button>
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
