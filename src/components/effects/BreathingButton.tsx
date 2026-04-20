import React, { useState } from 'react';

/**
 * BreathingButton — 呼吸 CTA + 點擊 ripple
 *
 * 金底黑字 方角 + 呼吸光暈 + hover 四角向內收縮光 + click 漣漪。
 */
export interface BreathingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const BB_CSS = `
.breath-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 18px 44px;
  background: #C5A059;
  color: #0a0a0a;
  border: 0;
  border-radius: 0;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.14em;
  cursor: pointer;
  overflow: hidden;
  transition: background 0.25s ease, transform 0.15s ease;
  animation: breathPulse 3s ease-in-out infinite;
  box-shadow: 0 4px 18px rgba(197,160,89,0.4), 0 0 32px rgba(197,160,89,0.2);
}
@keyframes breathPulse {
  0%,100% { box-shadow: 0 4px 18px rgba(197,160,89,0.4), 0 0 32px rgba(197,160,89,0.2);  }
  50%     { box-shadow: 0 8px 30px rgba(197,160,89,0.6), 0 0 52px rgba(197,160,89,0.45); }
}
.breath-btn:hover { background: #d9b770; transform: translateY(-1px); }
.breath-btn:active { transform: translateY(0) scale(0.97); }

/* 四角金色 chevron（hover 時向中心收縮） */
.breath-btn::before,
.breath-btn::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(10,10,10,0.8);
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.2,0.8,0.2,1);
  opacity: 0;
}
.breath-btn::before { top: -10px;    left: -10px;    border-right: 0; border-bottom: 0; }
.breath-btn::after  { bottom: -10px; right: -10px;   border-left: 0;  border-top: 0;    }
.breath-btn:hover::before { top: 6px;    left: 6px;    opacity: 1; }
.breath-btn:hover::after  { bottom: 6px; right: 6px;   opacity: 1; }

/* ripple */
.breath-btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(10,10,10,0.35);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s ease-out forwards;
  pointer-events: none;
}
@keyframes ripple {
  to { transform: translate(-50%, -50%) scale(3.5); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .breath-btn { animation: none !important; }
}
`;

export default function BreathingButton({ children, onClick, ...rest }: BreathingButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = Date.now() + Math.random();
    setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top, size }]);
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 700);
    onClick?.(e);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BB_CSS }} />
      <button {...rest} onClick={handleClick} className={['breath-btn', rest.className].filter(Boolean).join(' ')}>
        {children}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="breath-btn-ripple"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
      </button>
    </>
  );
}
