import React from 'react';

/**
 * GoldParticleDivider — 金色粒子光束分隔線
 *
 * 中央橫線金色漸變 + 左右淡出 + 3 顆金粒點飄
 */

const DIVIDER_CSS = `
.gold-divider {
  position: relative;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
}
.gold-divider::before {
  content: '';
  position: absolute;
  left: 10%; right: 10%;
  top: 50%;
  height: 1px;
  background: linear-gradient(to right,
    rgba(197,160,89,0) 0%,
    rgba(197,160,89,0.5) 30%,
    rgba(245,211,105,0.9) 50%,
    rgba(197,160,89,0.5) 70%,
    rgba(197,160,89,0) 100%);
  transform: translateY(-50%);
  box-shadow: 0 0 12px rgba(245,211,105,0.4);
}
.gold-divider-dot {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,225,140,1) 0%, rgba(197,160,89,0) 70%);
  animation: goldDotFloat 4s ease-in-out infinite;
}
.gold-divider-dot:nth-child(1) { left: 30%;  animation-delay: 0s;   }
.gold-divider-dot:nth-child(2) { left: 50%;  animation-delay: 1.3s; width: 5px; height: 5px; }
.gold-divider-dot:nth-child(3) { left: 70%;  animation-delay: 2.6s; }
@keyframes goldDotFloat {
  0%,100% { opacity: 0.45; transform: translate(0, -50%) scale(1);   }
  50%     { opacity: 1;    transform: translate(0, -60%) scale(1.35); }
}
`;

export default function GoldParticleDivider() {
  return (
    <div className="gold-divider" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: DIVIDER_CSS }} />
      <div className="gold-divider-dot" />
      <div className="gold-divider-dot" />
      <div className="gold-divider-dot" />
    </div>
  );
}
