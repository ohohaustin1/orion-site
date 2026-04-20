import React, { useState } from 'react';

/**
 * HeroSection v11 — 定版（依 Chairman 參考稿 34e34n34e34n34e3）
 *
 * 圖片事實：stj9t3stj9t3stj9.png 是 2207×480 的超寬全景（4.6:1）+ 透明通道。
 * 所以 v10 `cover` 把它放超大裁掉側邊 → 改 `100% auto` 讓整張完整顯示。
 * 透明區域靠 `background-color: #0a0a0a` 補黑（不再露灰白格）。
 *
 * 結構：
 *   Hero section（背景圖 + 黑底 + 疊在下半部的輸入列 absolute）
 *   Stats 3 卡（獨立段，維持現狀）
 *   下方 HomePage: Featured Cases → 我們怎麼幫你 → Bottom CTA（不動）
 */

const HERO_CSS = `
.hero-v11 {
  position: relative;
  width: 100%;
  min-height: 520px;
  height: calc(100vw * 480 / 2207 + 200px);  /* image native aspect + 下方空間給輸入列 */
  max-height: 78vh;
  background-color: #0a0a0a;
  background-image: url('/brand/hero-clean.png');
  background-size: 100% auto;
  background-position: center 38%;
  background-repeat: no-repeat;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
  overflow: hidden;
}

/* 輸入列 — 疊在 Hero 下半部 */
.hero-v11-pill {
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
  z-index: 2;
}
.hero-v11-pill:focus-within {
  border-color: rgba(197,160,89,0.6);
  box-shadow:
    0 16px 52px rgba(0,0,0,0.6),
    0 0 0 1px rgba(197,160,89,0.2);
}
.hero-v11-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(197,160,89,0.4);
}
.hero-v11-avatar img {
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
}
.hero-v11-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  height: 40px;
  padding: 0 12px;
  font-size: 15px;
  font-family: inherit;
  letter-spacing: 0.02em;
}
.hero-v11-input::placeholder {
  color: rgba(255,255,255,0.5);
  font-weight: 300;
}
.hero-v11-submit {
  border: 0;
  border-radius: 0;
  background: #ffffff;
  color: #0a0a0a;
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
.hero-v11-submit:hover  { background: #f1e8d3; box-shadow: 0 4px 18px rgba(197,160,89,0.4); }
.hero-v11-submit:active { transform: scale(0.97); }

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
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
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
.hero-stat:hover::before,
.hero-stat:hover::after { border-color: rgba(197,160,89,0.95); }
.hero-stat-num {
  font-size: 36px;
  font-weight: 700;
  color: #C5A059;
  letter-spacing: 0.04em;
  line-height: 1.2;
}
.hero-stat-label {
  margin-top: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.06em;
  line-height: 1.6;
}

/* Tablet */
@media (max-width: 1024px) {
  .hero-v11 {
    height: calc(100vw * 480 / 2207 + 180px);
    max-height: 72vh;
  }
  .hero-stat-num { font-size: 30px; }
}

/* Mobile — 圖太寬會超小，改 auto 100% 高度填滿，置中裁左右 */
@media (max-width: 768px) {
  .hero-v11 {
    min-height: 420px;
    height: 60vh;
    max-height: 70vh;
    background-size: auto 100%;
    background-position: 50% center;
  }
  .hero-v11-pill {
    bottom: 28px;
    padding: 5px;
    gap: 8px;
    border-radius: 22px;
  }
  .hero-v11-avatar { width: 36px; height: 36px; }
  .hero-v11-avatar img { width: 24px; height: 24px; }
  .hero-v11-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v11-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.06em; }

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

      <section className="hero-v11" aria-label="Orion AI 首頁主視覺">
        <form className="hero-v11-pill" onSubmit={submit}>
          <div className="hero-v11-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v11-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v11-submit">立即開始</button>
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
