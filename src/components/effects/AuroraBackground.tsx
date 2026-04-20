import React from 'react';

/**
 * AuroraBackground — 北極光感飄動金球（3-4 個大型 radial blur 圓球緩慢漂浮）
 *
 * 用 pure CSS keyframes，無 runtime 成本。包覆子元素作背景。
 */
export interface AuroraProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** 強度，1=預設，2=更濃 */
  intensity?: number;
}

const AURORA_CSS = `
.aurora-wrap {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}
.aurora-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(64px);
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}
.aurora-orb-1 {
  width: 520px; height: 520px;
  top: -12%; left: -6%;
  background: radial-gradient(circle, rgba(197,160,89,0.55) 0%, rgba(197,160,89,0) 70%);
  animation: auroraDrift1 16s ease-in-out infinite;
}
.aurora-orb-2 {
  width: 460px; height: 460px;
  bottom: -15%; right: -8%;
  background: radial-gradient(circle, rgba(245,211,105,0.45) 0%, rgba(245,211,105,0) 70%);
  animation: auroraDrift2 20s ease-in-out infinite;
}
.aurora-orb-3 {
  width: 360px; height: 360px;
  top: 40%; left: 55%;
  background: radial-gradient(circle, rgba(180,130,60,0.4) 0%, rgba(180,130,60,0) 70%);
  animation: auroraDrift3 24s ease-in-out infinite;
}
.aurora-orb-4 {
  width: 300px; height: 300px;
  top: 20%; right: 25%;
  background: radial-gradient(circle, rgba(255,220,130,0.3) 0%, rgba(255,220,130,0) 70%);
  animation: auroraDrift4 28s ease-in-out infinite;
}
@keyframes auroraDrift1 {
  0%,100% { transform: translate(0,0) scale(1);     }
  50%     { transform: translate(80px,60px) scale(1.12); }
}
@keyframes auroraDrift2 {
  0%,100% { transform: translate(0,0) scale(1);     }
  50%     { transform: translate(-70px,-50px) scale(1.1); }
}
@keyframes auroraDrift3 {
  0%,100% { transform: translate(0,0) scale(1);     }
  50%     { transform: translate(-40px,80px) scale(0.9); }
}
@keyframes auroraDrift4 {
  0%,100% { transform: translate(0,0) scale(1);     }
  50%     { transform: translate(60px,-40px) scale(1.15); }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-orb-1, .aurora-orb-2, .aurora-orb-3, .aurora-orb-4 { animation: none !important; }
}
.aurora-content { position: relative; z-index: 1; }
`;

export default function AuroraBackground({ children, className, style, intensity = 1 }: AuroraProps) {
  return (
    <div className={['aurora-wrap', className].filter(Boolean).join(' ')} style={{ ...style, '--aurora-intensity': intensity } as React.CSSProperties}>
      <style dangerouslySetInnerHTML={{ __html: AURORA_CSS }} />
      <div className="aurora-orb aurora-orb-1" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-2" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-3" aria-hidden="true" />
      <div className="aurora-orb aurora-orb-4" aria-hidden="true" />
      <div className="aurora-content">{children}</div>
    </div>
  );
}
