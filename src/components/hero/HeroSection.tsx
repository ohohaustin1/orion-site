import React from 'react';

/**
 * HeroSection v7 — 官網首頁震撼感版
 * 排版參考 Gemini_Generated_Image_mcnn2xmcnn2xmcnn.png
 * Hero 背景用 background-image（機器人圖 stj9t3stj9t3stj9）
 *   Layer 底色 #0a0a0a + 右側 bg image + 左側漸層 linear-gradient
 *   左側：標題 + 副標 + 金色方角 CTA 按鈕
 *   下方：Stats 3 卡（14 個產業 / 10 分鐘 / 0 成本）
 *   底部：膠囊輸入列（送出 → https://orion01.com）
 */

const HERO_CSS = `
.hero-v7 {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #0a0a0a;
  background-image:
    linear-gradient(to right, #0a0a0a 35%, rgba(10,10,10,0) 70%),
    url('/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png');
  background-size: auto 100%, auto 100%;
  background-position: left center, right center;
  background-repeat: no-repeat, no-repeat;
  overflow: hidden;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
  padding: 96px 8vw 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: heroBreath 6s ease-in-out infinite;
}
@keyframes heroBreath {
  0%,100% { background-size: auto 100%, auto 100%; }
  50%     { background-size: auto 100%, auto 103%; }
}

/* Text block */
.hero-v7-text {
  max-width: 560px;
  position: relative;
  z-index: 2;
}
.hero-v7-title {
  font-size: 42px;
  font-weight: 700;
  color: #C5A059;
  letter-spacing: 0.05em;
  line-height: 1.3;
  margin: 0;
  text-shadow: 0 0 32px rgba(197,160,89,0.25);
  opacity: 0;
  transform: translateY(12px);
  animation: heroFadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.2s forwards;
}
.hero-v7-subtitle {
  font-size: 18px;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.04em;
  line-height: 1.65;
  margin: 24px 0 0;
  opacity: 0;
  transform: translateY(10px);
  animation: heroFadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.45s forwards;
}
.hero-v7-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  padding: 14px 28px;
  background: #C5A059;
  color: #0a0a0a;
  border: 0;
  border-radius: 0;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(197,160,89,0.35);
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  animation: heroFadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 0.65s forwards;
}
.hero-v7-cta:hover  { background: #d9b770; box-shadow: 0 6px 20px rgba(197,160,89,0.55); transform: translateY(-1px); }
.hero-v7-cta:active { transform: translateY(0); }
@keyframes heroFadeUp {
  to { opacity: 1; transform: translateY(0); }
}

/* Stats row */
.hero-v7-stats {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 900px;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(10px);
  animation: heroFadeUp 0.9s cubic-bezier(0.4,0,0.2,1) 0.85s forwards;
}
.hero-v7-stat {
  background: rgba(16,14,10,0.72);
  border: 1px solid rgba(197,160,89,0.28);
  border-radius: 0;
  padding: 22px 20px;
  position: relative;
  transition: border-color 0.3s ease, background 0.3s ease;
}
.hero-v7-stat::before,
.hero-v7-stat::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border: 1px solid rgba(197,160,89,0.55);
  pointer-events: none;
}
.hero-v7-stat::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.hero-v7-stat::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }
.hero-v7-stat:hover { border-color: rgba(197,160,89,0.55); background: rgba(22,19,13,0.85); }
.hero-v7-stat-num {
  font-size: 30px;
  font-weight: 700;
  color: #C5A059;
  letter-spacing: 0.04em;
  line-height: 1.2;
}
.hero-v7-stat-label {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  letter-spacing: 0.05em;
  line-height: 1.55;
}

/* Bottom input */
.hero-v7-input {
  position: absolute;
  left: 50%;
  bottom: 48px;
  transform: translateX(-50%);
  width: 680px;
  max-width: calc(100vw - 32px);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(30,30,30,0.9);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 6px 6px 6px 8px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  opacity: 0;
  animation: heroFadeUp 0.8s cubic-bezier(0.4,0,0.2,1) 1.05s forwards;
  transition: border-color 0.25s ease, box-shadow 0.3s ease;
}
.hero-v7-input:focus-within {
  border-color: rgba(197,160,89,0.35);
  box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(197,160,89,0.2);
}
.hero-v7-input input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  padding: 0 16px;
  height: 44px;
  font-size: 15px;
  font-family: inherit;
  letter-spacing: 0.03em;
}
.hero-v7-input input::placeholder {
  color: rgba(255,255,255,0.45);
  font-weight: 300;
}
.hero-v7-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 0;
  background: #C5A059;
  color: #0a0a0a;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 10px rgba(197,160,89,0.35);
}
.hero-v7-send:hover  { background: #d9b770; box-shadow: 0 4px 14px rgba(197,160,89,0.55); }
.hero-v7-send:active { transform: scale(0.94); }
.hero-v7-send svg { display: block; }

/* Tablet */
@media (max-width: 1024px) {
  .hero-v7 { padding: 80px 6vw 140px; }
  .hero-v7-title { font-size: 36px; }
  .hero-v7-stat-num { font-size: 26px; }
}

/* Mobile */
@media (max-width: 768px) {
  .hero-v7 {
    padding: 64px 20px 120px;
    background-image:
      linear-gradient(to top, #0a0a0a 25%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.2) 100%),
      url('/brand/Gemini_Generated_Image_stj9t3stj9t3stj9.png');
    background-size: cover, cover;
    background-position: center, center;
  }
  .hero-v7-text { max-width: 100%; }
  .hero-v7-title { font-size: 28px; line-height: 1.35; }
  .hero-v7-subtitle { font-size: 15px; margin-top: 16px; }
  .hero-v7-cta { margin-top: 24px; padding: 12px 22px; font-size: 14px; }
  .hero-v7-stats {
    margin-top: 40px;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .hero-v7-stat { padding: 18px 16px; }
  .hero-v7-stat-num { font-size: 22px; }
  .hero-v7-input {
    width: calc(100% - 40px);
    bottom: 88px;  /* account for mobile bottom nav */
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-v7,
  .hero-v7-title,
  .hero-v7-subtitle,
  .hero-v7-cta,
  .hero-v7-stats,
  .hero-v7-input {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
  .hero-v7-input { transform: translateX(-50%); }
}
`;

const STATS = [
  { num: '14 個產業', label: '從餐飲到科技，全覆蓋' },
  { num: '10 分鐘',  label: 'O 幫你釐清需求' },
  { num: '0 成本',   label: '第一次診斷完全免費' },
];

export default function HeroSection() {
  const goChat = () => { window.location.href = 'https://orion01.com'; };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); goChat(); };

  return (
    <section className="hero-v7" aria-label="Orion AI 首頁">
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />

      <div className="hero-v7-text">
        <h1 className="hero-v7-title">做一次系統<br />當你一輩子的 AI 顧問</h1>
        <p className="hero-v7-subtitle">說出你的問題，O 幫你找出失去的錢</p>
        <button type="button" className="hero-v7-cta" onClick={goChat}>
          立即開始對話 →
        </button>
      </div>

      <div className="hero-v7-stats">
        {STATS.map((s) => (
          <div key={s.num} className="hero-v7-stat">
            <div className="hero-v7-stat-num">{s.num}</div>
            <div className="hero-v7-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <form className="hero-v7-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Orion AI 幫你找回失去的錢..."
          aria-label="輸入你的商業問題"
        />
        <button type="submit" className="hero-v7-send" aria-label="送出">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </section>
  );
}
