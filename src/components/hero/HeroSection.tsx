import React, { useState } from 'react';

/**
 * HeroSection v15 — 單圖解法 + 4 欄 Stats
 *
 * Hero：background-image: /brand/HERO3.png cover center 100vh
 *   - 底部 fade gradient，與 Stats 無縫
 *   - 輸入列 bottom 15% 膠囊，金底黑字「立即開始」
 *
 * Stats：4 欄 01-04 流程卡（取代舊 3 卡 14/10/0）
 */

const HERO_CSS = `
.hero-v15 {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 560px;
  background-color: #0a0a0a;
  background-image: url('/brand/HERO3.png');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}

/* 底部淡出漸層 — Hero→Stats 無縫 */
.hero-v15-fade {
  position: absolute;
  inset: auto 0 0 0;
  height: 18%;
  background: linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.8) 70%, #0a0a0a 100%);
  pointer-events: none;
  z-index: 2;
}

/* 輸入列 */
.hero-v15-pill {
  position: absolute;
  left: 50%;
  bottom: 15%;
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
  z-index: 3;
}
.hero-v15-pill:focus-within {
  border-color: rgba(197,160,89,0.7);
  box-shadow: 0 18px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(197,160,89,0.3);
}
.hero-v15-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  background: radial-gradient(circle at 32% 32%, #2a241a 0%, #0f0d09 75%);
  display: inline-flex; align-items: center; justify-content: center;
  overflow: hidden;
  border: 0.5px solid rgba(197,160,89,0.4);
}
.hero-v15-avatar img { width: 28px; height: 28px; object-fit: contain; display: block; }
.hero-v15-input {
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
.hero-v15-input::placeholder { color: rgba(255,255,255,0.5); font-weight: 300; }
.hero-v15-submit {
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
.hero-v15-submit:hover  { background: #d9b770; box-shadow: 0 6px 22px rgba(197,160,89,0.6), 0 0 36px rgba(197,160,89,0.35); }
.hero-v15-submit:active { transform: scale(0.97); }

/* Stats section — 4 欄 01-04 流程卡 */
.hero-stats-section {
  background: transparent;
  padding: 48px 8vw 84px;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
}
.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.hero-stat {
  position: relative;
  background: rgba(10,10,10,0.85);
  border: 0.5px solid rgba(197,160,89,0.3);
  border-radius: 0;
  padding: 30px 24px 28px;
  text-align: left;
  overflow: hidden;
  transition: border-color 0.3s ease, background 0.3s ease,
              box-shadow 0.35s ease, transform 0.3s ease;
}
.hero-stat::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(197,160,89,0.14) 0%, rgba(197,160,89,0) 55%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}
.hero-stat:hover {
  border-color: rgba(197,160,89,0.7);
  background: rgba(16,14,10,0.95);
  transform: translateY(-3px);
  box-shadow:
    0 10px 36px rgba(197,160,89,0.18),
    0 0 0 1px rgba(197,160,89,0.22),
    0 0 32px rgba(197,160,89,0.14);
}
.hero-stat:hover::before { opacity: 1; }
.hero-stat-num {
  font-size: 32px;
  font-weight: 700;
  color: #C5A059;
  letter-spacing: 0.04em;
  line-height: 1;
  margin-bottom: 18px;
  text-shadow: 0 0 18px rgba(197,160,89,0.22);
}
.hero-stat-title {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}
.hero-stat-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  line-height: 1.65;
  letter-spacing: 0.04em;
  margin: 0;
}

/* Tablet */
@media (max-width: 1024px) {
  .hero-stats-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-v15 { height: 92vh; min-height: 480px; }
  .hero-v15-pill {
    bottom: 13%;
    padding: 5px;
    gap: 8px;
    border-radius: 22px;
  }
  .hero-v15-avatar { width: 36px; height: 36px; }
  .hero-v15-avatar img { width: 24px; height: 24px; }
  .hero-v15-input { height: 36px; font-size: 14px; padding: 0 10px; }
  .hero-v15-submit { padding: 10px 16px; font-size: 13px; letter-spacing: 0.08em; }

  .hero-stats-section { padding: 32px 16px 56px; }
  .hero-stats-grid { grid-template-columns: 1fr; gap: 14px; }
  .hero-stat { padding: 26px 22px 24px; }
  .hero-stat-num { font-size: 28px; margin-bottom: 14px; }
  .hero-stat-title { font-size: 15px; }
}
`;

const STEPS = [
  { num: '01', title: '說出你的問題', desc: 'O 幫你把模糊想法變為清晰需求' },
  { num: '02', title: '需求確認',     desc: '工程師接手，評估可行性與時程' },
  { num: '03', title: '系統建置',     desc: '從 0 到上線，全程 ORION 負責' },
  { num: '04', title: '永久陪跑',     desc: '3 個月後有新需求，O 還在' },
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

      <section className="hero-v15" aria-label="Orion AI 首頁主視覺">
        <form className="hero-v15-pill" onSubmit={submit}>
          <div className="hero-v15-avatar" aria-hidden="true">
            <img src="/brand/griffin-128.png" alt="" />
          </div>
          <input
            className="hero-v15-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Orion AI 幫你找回失去的錢..."
            aria-label="輸入你的商業問題"
          />
          <button type="submit" className="hero-v15-submit">立即開始</button>
        </form>
        <div className="hero-v15-fade" aria-hidden="true" />
      </section>

      <section className="hero-stats-section" aria-label="Orion 服務流程">
        <div className="hero-stats-grid">
          {STEPS.map((s) => (
            <div key={s.num} className="hero-stat">
              <div className="hero-stat-num">{s.num}</div>
              <h3 className="hero-stat-title">{s.title}</h3>
              <p className="hero-stat-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
