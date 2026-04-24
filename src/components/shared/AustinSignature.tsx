import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * AustinSignature — SVG 手寫簽名 pathLength 動畫
 *
 * 入視口後一次性從 0 畫到 1，1.8s easeInOut。
 * 手寫風格 A + 底線，金色筆觸，尾端保留輕微飛揚。
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

  return (
    <svg
      className={className}
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
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduce ? 0 : 1.8, ease: [0.4, 0, 0.2, 1], delay }}
      />
      {/* 簽名底線裝飾 — pathLength 0.4s 後尾隨 */}
      <motion.path
        d="M 12 92 Q 130 82, 248 90"
        strokeWidth={1.2}
        opacity={0.6}
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: 'easeInOut', delay: delay + 0.6 }}
      />
    </svg>
  );
}
