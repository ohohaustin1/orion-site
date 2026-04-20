import React, { useState } from 'react';

/**
 * HeroSection v10 — 極簡定版
 *
 * Hero（圖）：
 *   - 背景：/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png
 *     整張圖填滿區塊 cover + center
 *   - 無疊加文字 / 標題 / 副標 / CTA（全部拿掉）
 *
 * 圖下方：輸入欄位（獨立一段，不疊在圖上）
 *   - 680px 膠囊
 *   - 左圓形獅鷲頭像 + 中輸入框 + 右方角「立即開始」白底黑字
 *   - 送出 → https://orion01.com?q={input}
 *
 * 再下方：Stats 3 卡（維持現狀）
 * HomePage 其餘區塊（Featured Cases / 我們怎麼幫你 / Bottom CTA）維持現狀
 */

const HERO_CSS = `
.hero-v10 {
  position: relative;
  width: 100%;
  min-height: 82vh;
  background-color: #0a0a0a;
  background-image: url('/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* 輸入列獨立段 */
.hero-v10-inputbar {
  background: #0a0a0a;
  padding: 36px 20px 44px;
  display: flex;
  justify-content: center;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.04em;
}
.hero-v10-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 680px;
  max-width: 100%;
  background: rgba(20,18,14,0.95);
  border: 1px solid rgba(197,160,89,0.28);
  border-radius: 24px;
  padding: 6px 6px 6px 6px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 10px 40px rgba(0,0,0,0.45),
    0 0 0 1px rgba(0,0,0,0.3) inset;
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
}
.hero-v10-pill:focus-within {
  border-color: rgba(197,160,89,0.6);
  box-shadow:
    0 14px 48px rgba(0,0,0,0.5),
    0 0 0 1px rgba(197,160,89,0.22);
}
.hero-v10-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(197,160,89,0.35);
}
.hero-v10-avatar img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  display: block;
}
.hero-v10-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  height: 44px;
  padding: 0 12px;
  font-size: 15px;
  font-family: inherit;
  letter-spacing: 0.02em;
}
.hero-v10-input::placeholder {
  color: rgba(255,255,255,0.45);
  font-weight: 300;
}
.hero-v10-submit {
  border: 0;
  border-radius: 0;
  background: #ffffff;
  color: #0a0a0a;
  height: 44px;
  padding: 0 22px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(255,255,255,0.12);
}
.hero-v10-submit:hover  { background: #f1e8d3; box-shadow: 0 4px 18px rgba(197,160,89,0.35); }
.hero-v10-submit:active { transform: scale(0.97); }

/* Stats */
.hero-stats-section {
  background: #0a0a0a;
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
  .hero-v10 { min-height: 60vh; }
  .hero-stat-num { font-size: 30px; }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-v10 {
    min-height: 55vh;
    background-position: 55% center;
  }
  .hero-v10-inputbar { padding: 24px 16px 32px; }
  .hero-v10-pill { padding: 5px; }
  .hero-v10-avatar { width: 40px; height: 40px; }
  .hero-v10-avatar img { width: 26px; height: 26px; }
  .hero-v10-input { height: 40px; font-size: 14px; padding: 0 10px; }
  .hero-v10-submit { height: 40px; padding: 0 16px; font-size: 13px; letter-spacing: 0.08em; }

  .hero-stats-section { padding: 24px 16px 48px; }
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

      <section className="hero-v10" aria-label="Orion AI 首頁主視覺" />

      <section className="hero-v10-inputbar" aria-label="對話入口">
        <form className="hero-v10-pill" onSubmit={submit}>
          <div className="hero-v10-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v10-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v10-submit">立即開始</button>
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
