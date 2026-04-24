import React from 'react';

/**
 * ProductIcons — 12 個產品卡 icon
 *
 * 來源：Chairman 2026-04-24 規範（SVG path 逐字轉 JSX）
 * 策略：stroke/fill 全部用 currentColor，讓父 .co-product-icon
 *       的 `color` CSS 屬性統一驅動 idle/hover 色。03 保留 #FFD369
 *       accent path 作為 Chairman 設計的雙色對比。
 * 尺寸：viewBox 32x32，預設 fill="none"
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 32 32',
  fill: 'none',
};

export const ProductIcon01 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="不動產決策 AI">
    <path d="M16 4 L28 12 L28 28 L4 28 L4 12 Z" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={18} r={3} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <line x1={16} y1={15} x2={16} y2={8} stroke="currentColor" strokeWidth={1.5} />
  </svg>
);

export const ProductIcon02 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="股票策略 AI">
    <polyline points="4,24 10,18 16,20 22,12 28,14" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={10} cy={18} r={2} fill="currentColor" />
    <circle cx={16} cy={20} r={2} fill="currentColor" />
    <circle cx={22} cy={12} r={2} fill="currentColor" />
  </svg>
);

export const ProductIcon03 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="電商成交 AI">
    <circle cx={16} cy={16} r={10} stroke="currentColor" strokeWidth={1.5} fill="none" />
    {/* Accent bright 金色弧線 — Chairman 雙色設計 */}
    <path d="M16 6 A10 10 0 0 1 26 16" stroke="#FFD369" strokeWidth={2} fill="none" />
    <polygon points="16,10 20,16 16,22 12,16" stroke="currentColor" strokeWidth={1.5} fill="none" />
  </svg>
);

export const ProductIcon04 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="餐飲排班 AI">
    <circle cx={16} cy={16} r={12} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <line x1={16} y1={16} x2={16} y2={8} stroke="currentColor" strokeWidth={2} />
    <line x1={16} y1={16} x2={22} y2={20} stroke="currentColor" strokeWidth={1.5} />
  </svg>
);

export const ProductIcon05 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="製造業排程 AI">
    <circle cx={16} cy={16} r={8} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={16} r={3} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <line x1={16} y1={8} x2={16} y2={24} stroke="currentColor" strokeWidth={1} />
    <line x1={8} y1={16} x2={24} y2={16} stroke="currentColor" strokeWidth={1} />
    <line x1={11} y1={11} x2={21} y2={21} stroke="currentColor" strokeWidth={1} />
    <line x1={21} y1={11} x2={11} y2={21} stroke="currentColor" strokeWidth={1} />
  </svg>
);

export const ProductIcon06 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="客戶留存 AI">
    <path d="M16 8 A8 8 0 1 1 8 16" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <polygon points="10,14 8,16 10,18" fill="currentColor" />
    <circle cx={16} cy={16} r={3} fill="currentColor" />
  </svg>
);

export const ProductIcon07 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="法律風險 AI">
    <polygon points="16,4 28,12 28,20 16,28 4,20 4,12" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <path d="M12 16 L14 18 L20 12" stroke="currentColor" strokeWidth={2} fill="none" />
  </svg>
);

export const ProductIcon08 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="健康長壽 AI">
    <polyline points="4,16 8,16 10,12 14,20 18,10 22,16 28,16" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={16} r={10} stroke="currentColor" strokeWidth={1} fill="none" opacity={0.3} />
  </svg>
);

export const ProductIcon09 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="品牌語感 AI">
    <circle cx={16} cy={12} r={6} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <path d="M10 18 Q16 28 22 18" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={14} cy={11} r={1} fill="currentColor" />
    <circle cx={18} cy={11} r={1} fill="currentColor" />
  </svg>
);

export const ProductIcon10 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="企業現金流 AI">
    <path d="M4 16 Q10 8 16 16 T28 16" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={16} r={4} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <text x={16} y={18} textAnchor="middle" fontSize={6} fill="currentColor" fontWeight={700}>$</text>
  </svg>
);

export const ProductIcon11 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="教育傳承 AI">
    <circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={20} cy={12} r={4} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={20} r={4} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <line x1={12} y1={16} x2={16} y2={16} stroke="currentColor" strokeWidth={1} />
    <line x1={20} y1={16} x2={16} y2={16} stroke="currentColor" strokeWidth={1} />
  </svg>
);

export const ProductIcon12 = (p: IconProps) => (
  <svg {...base} {...p} aria-label="命運機率 AI">
    <circle cx={16} cy={16} r={10} stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx={16} cy={16} r={6} stroke="currentColor" strokeWidth={1} fill="none" />
    <circle cx={16} cy={16} r={2} fill="currentColor" />
    <line x1={16} y1={6} x2={16} y2={10} stroke="currentColor" strokeWidth={1} />
    <line x1={16} y1={22} x2={16} y2={26} stroke="currentColor" strokeWidth={1} />
    <line x1={6} y1={16} x2={10} y2={16} stroke="currentColor" strokeWidth={1} />
    <line x1={22} y1={16} x2={26} y2={16} stroke="currentColor" strokeWidth={1} />
  </svg>
);

export const PRODUCT_ICONS = [
  ProductIcon01, ProductIcon02, ProductIcon03, ProductIcon04,
  ProductIcon05, ProductIcon06, ProductIcon07, ProductIcon08,
  ProductIcon09, ProductIcon10, ProductIcon11, ProductIcon12,
] as const;
