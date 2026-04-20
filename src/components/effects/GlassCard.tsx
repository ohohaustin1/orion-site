import React, { useRef } from 'react';

/**
 * GlassCard — 玻璃反射 + 3D tilt（mouse-follow rotateY/rotateX）+ hover 斜光掃過
 *
 * 用法：<GlassCard className="..."> 內容 </GlassCard>
 */
export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** 傾斜最大角度（deg），預設 3 */
  tilt?: number;
  as?: 'div' | 'article' | 'section' | 'li';
}

const GLASS_CSS = `
.glass-card {
  position: relative;
  background: rgba(16,14,10,0.72);
  border: 0.5px solid rgba(197,160,89,0.28);
  border-radius: 0;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: border-color 0.3s ease, background 0.3s ease,
              box-shadow 0.4s ease, transform 0.25s cubic-bezier(0.2,0.8,0.2,1);
  will-change: transform;
}
.glass-card::before {
  /* 斜光掃過條 */
  content: '';
  position: absolute;
  top: 0; left: -60%;
  width: 40%;
  height: 100%;
  background: linear-gradient(110deg,
    rgba(255,255,255,0) 0%,
    rgba(255,240,200,0.10) 45%,
    rgba(255,240,200,0.16) 50%,
    rgba(255,240,200,0.10) 55%,
    rgba(255,255,255,0) 100%);
  transform: skewX(-18deg);
  transition: left 0.9s cubic-bezier(0.4,0,0.2,1);
  pointer-events: none;
  z-index: 1;
}
.glass-card::after {
  /* 玻璃 top-light 反射 */
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at top left, rgba(255,240,200,0.06) 0%, rgba(255,240,200,0) 55%);
  pointer-events: none;
  z-index: 1;
}
.glass-card:hover {
  border-color: rgba(197,160,89,0.7);
  background: rgba(20,17,12,0.88);
  box-shadow:
    0 10px 36px rgba(197,160,89,0.18),
    0 0 0 1px rgba(197,160,89,0.25),
    0 0 40px rgba(197,160,89,0.15);
}
.glass-card:hover::before { left: 110%; }
.glass-card > * { position: relative; z-index: 2; }
`;

export default function GlassCard({
  children,
  className,
  style,
  tilt = 3,
  as: Tag = 'div',
}: GlassCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * tilt * 2;                  // -tilt..+tilt
    const rx = -(y - 0.5) * (tilt * 0.66) * 2;        // less on X axis
    el.style.transform = `perspective(900px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLASS_CSS }} />
      <Tag
        // @ts-expect-error ref polymorphism
        ref={ref}
        className={['glass-card', className].filter(Boolean).join(' ')}
        style={style}
        onMouseMove={handleMove}
        onMouseLeave={reset}
      >
        {children}
      </Tag>
    </>
  );
}
