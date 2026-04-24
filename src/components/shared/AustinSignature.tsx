import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * AustinSignature — SVG 手寫簽名 pathLength 動畫（v2 手機友善版）
 *
 * Chairman 2026-04-24 手機實機反饋：簽名 SVG 沒畫出來（容器看得到、裡面空）
 *
 * 修復：
 *   1. 原 whileInView={{ pathLength: 1 }} 改成 useInView hook + animate prop
 *      （iOS Safari IntersectionObserver 在 transform 父層內計算常失敗）
 *   2. amount: 0.4 → 0.1（手機螢幕小，10% 觸發更穩）
 *   3. margin: '0px 0px -100px 0px' 提早 100px 觸發
 *   4. forceShow 5s timer fallback：就算 IO 完全失敗，5 秒後強制顯示
 *   5. Wrapper div 加 className 讓外層可套 min-height 防 0 高度
 */
export interface AustinSignatureProps {
  className?: string;
  width?: number | string;
  delay?: number;
}

export default function AustinSignature({
  className,
  width = 220,
  delay = 0,
}: AustinSignatureProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    margin: '0px 0px -100px 0px',
  });

  // fallback：5 秒後強制顯示（防 IntersectionObserver 完全失敗）
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setForceShow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const shouldAnimate = reduce || isInView || forceShow;

  return (
    <div ref={ref} className={['austin-signature-wrapper', className].filter(Boolean).join(' ')}>
      <svg
        viewBox="0 0 260 100"
        width={width}
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        stroke="#C5A059"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: 'drop-shadow(0 0 12px rgba(197,160,89,0.35))',
          overflow: 'visible',
          height: 'auto',
          display: 'block',
        }}
        aria-label="Austin 簽名"
      >
        {/* "Austin" 手寫風格連筆 — 模擬一筆帶過的簽名筆跡 */}
        <motion.path
          d="M12 72 Q 28 28, 44 70 M 22 60 L 40 60
             M 56 46 Q 60 80, 76 72 Q 88 66, 82 44 Q 80 32, 86 58 Q 92 82, 108 72
             M 118 38 Q 108 68, 126 72 Q 140 74, 128 60 Q 118 52, 134 48 Q 148 44, 144 58
             M 158 44 L 154 74 M 152 40 L 162 40
             M 174 50 Q 176 80, 190 72 Q 202 64, 192 50 Q 182 42, 198 40
             M 210 50 L 210 76 Q 214 82, 220 78
             M 230 44 Q 226 68, 238 70 Q 250 72, 244 58 Q 236 48, 250 46"
          initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            pathLength: { duration: reduce ? 0 : 1.8, ease: [0.4, 0, 0.2, 1], delay },
            opacity:    { duration: 0.3, delay },
          }}
        />
        {/* 簽名底線裝飾 — pathLength 0.6s 後尾隨 */}
        <motion.path
          d="M 12 92 Q 130 82, 248 90"
          strokeWidth={1.2}
          opacity={0.6}
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: 'easeInOut', delay: delay + 0.6 }}
        />
      </svg>
    </div>
  );
}
