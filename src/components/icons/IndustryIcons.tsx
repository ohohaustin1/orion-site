import React from 'react';

/**
 * IndustryIcons — 14 個產業跑馬燈 icon
 *
 * Chairman 2026-04-24 只給主題描述，SVG 由我設計，統一規則：
 *   - viewBox 32x32
 *   - stroke="currentColor" + strokeWidth 1.5
 *   - fill="none"（點狀 fill 用 currentColor）
 *   - 幾何線條風格，對齊 HERO3 機器人紋路語言
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  width: 32,
  height: 32,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

/* 01 科技業 — 晶片：外框 + 四邊 pins + 核心方塊 */
export const IconTech = (p: IconProps) => (
  <svg {...base} {...p} aria-label="科技業">
    <rect x={8} y={8} width={16} height={16} />
    <rect x={12} y={12} width={8} height={8} />
    {/* pins */}
    <line x1={4} y1={12} x2={8} y2={12} />
    <line x1={4} y1={16} x2={8} y2={16} />
    <line x1={4} y1={20} x2={8} y2={20} />
    <line x1={24} y1={12} x2={28} y2={12} />
    <line x1={24} y1={16} x2={28} y2={16} />
    <line x1={24} y1={20} x2={28} y2={20} />
    <line x1={12} y1={4} x2={12} y2={8} />
    <line x1={16} y1={4} x2={16} y2={8} />
    <line x1={20} y1={4} x2={20} y2={8} />
    <line x1={12} y1={24} x2={12} y2={28} />
    <line x1={16} y1={24} x2={16} y2={28} />
    <line x1={20} y1={24} x2={20} y2={28} />
  </svg>
);

/* 02 金融 — 上升折線 + 終點箭頭 */
export const IconFinance = (p: IconProps) => (
  <svg {...base} {...p} aria-label="金融">
    <polyline points="4,24 10,20 14,22 20,12 26,8" />
    <polyline points="22,8 26,8 26,12" />
    <line x1={4} y1={28} x2={28} y2={28} opacity={0.35} />
  </svg>
);

/* 03 零售 — 購物袋 */
export const IconRetail = (p: IconProps) => (
  <svg {...base} {...p} aria-label="零售">
    <path d="M6 10 L8 26 L24 26 L26 10 Z" />
    <path d="M12 10 C 12 6, 20 6, 20 10" />
  </svg>
);

/* 04 餐飲 — 刀叉交叉 */
export const IconFood = (p: IconProps) => (
  <svg {...base} {...p} aria-label="餐飲">
    {/* 叉 */}
    <line x1={10} y1={4} x2={10} y2={28} />
    <line x1={7} y1={4} x2={7} y2={12} />
    <line x1={13} y1={4} x2={13} y2={12} />
    <path d="M7 12 L13 12" />
    {/* 刀 */}
    <path d="M22 4 Q26 6 26 14 L22 14 Z" />
    <line x1={22} y1={14} x2={22} y2={28} />
  </svg>
);

/* 05 製造 — 齒輪 */
export const IconManufacturing = (p: IconProps) => (
  <svg {...base} {...p} aria-label="製造">
    <circle cx={16} cy={16} r={5} />
    {/* 8 個齒 */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 16 + Math.cos(rad) * 8;
      const y1 = 16 + Math.sin(rad) * 8;
      const x2 = 16 + Math.cos(rad) * 12;
      const y2 = 16 + Math.sin(rad) * 12;
      return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
  </svg>
);

/* 06 不動產 — 房屋輪廓 */
export const IconRealestate = (p: IconProps) => (
  <svg {...base} {...p} aria-label="不動產">
    <path d="M4 16 L16 6 L28 16" />
    <path d="M7 14 L7 26 L25 26 L25 14" />
    <rect x={14} y={18} width={4} height={8} />
  </svg>
);

/* 07 醫療 — 心跳 ECG 波 */
export const IconHealth = (p: IconProps) => (
  <svg {...base} {...p} aria-label="醫療">
    <polyline points="4,16 10,16 12,12 14,20 16,8 18,24 20,16 28,16" />
  </svg>
);

/* 08 教育 — 書本打開 */
export const IconEducation = (p: IconProps) => (
  <svg {...base} {...p} aria-label="教育">
    <path d="M4 8 L16 10 L16 26 L4 24 Z" />
    <path d="M28 8 L16 10 L16 26 L28 24 Z" />
    <line x1={16} y1={10} x2={16} y2={26} />
  </svg>
);

/* 09 法律 — 天平 */
export const IconLegal = (p: IconProps) => (
  <svg {...base} {...p} aria-label="法律">
    <line x1={16} y1={6} x2={16} y2={24} />
    <line x1={8} y1={10} x2={24} y2={10} />
    {/* 左秤盤 */}
    <path d="M5 14 L11 14 L8 20 Z" />
    {/* 右秤盤 */}
    <path d="M21 14 L27 14 L24 20 Z" />
    {/* 底座 */}
    <line x1={11} y1={28} x2={21} y2={28} />
  </svg>
);

/* 10 顧問 — 對話泡泡 */
export const IconConsulting = (p: IconProps) => (
  <svg {...base} {...p} aria-label="顧問">
    <path d="M5 8 L24 8 Q27 8 27 11 L27 20 Q27 23 24 23 L15 23 L10 27 L10 23 L8 23 Q5 23 5 20 Z" />
    <circle cx={12} cy={15.5} r={0.8} fill="currentColor" />
    <circle cx={16} cy={15.5} r={0.8} fill="currentColor" />
    <circle cx={20} cy={15.5} r={0.8} fill="currentColor" />
  </svg>
);

/* 11 物流 — 箱子 + 飛行箭頭 */
export const IconLogistics = (p: IconProps) => (
  <svg {...base} {...p} aria-label="物流">
    <rect x={6} y={12} width={14} height={14} />
    <line x1={6} y1={16} x2={20} y2={16} />
    <line x1={13} y1={12} x2={13} y2={26} />
    {/* 飛出箭頭 */}
    <line x1={22} y1={8} x2={28} y2={8} />
    <polyline points="25,5 28,8 25,11" />
  </svg>
);

/* 12 娛樂 — 圓形播放鍵 */
export const IconEntertainment = (p: IconProps) => (
  <svg {...base} {...p} aria-label="娛樂">
    <circle cx={16} cy={16} r={12} />
    <polygon points="13,10 23,16 13,22" fill="currentColor" stroke="none" />
  </svg>
);

/* 13 農業 — 葉子 */
export const IconAgriculture = (p: IconProps) => (
  <svg {...base} {...p} aria-label="農業">
    <path d="M6 26 C 6 14, 14 6, 26 6 C 26 18, 18 26, 6 26 Z" />
    <line x1={6} y1={26} x2={20} y2={12} opacity={0.6} />
  </svg>
);

/* 14 能源 — 閃電 */
export const IconEnergy = (p: IconProps) => (
  <svg {...base} {...p} aria-label="能源">
    <polygon points="18,4 8,18 14,18 12,28 24,14 18,14" fill="currentColor" stroke="none" />
  </svg>
);

export const INDUSTRY_ICONS: Array<{ Icon: (p: IconProps) => JSX.Element; label: string }> = [
  { Icon: IconTech,          label: '科技業' },
  { Icon: IconFinance,       label: '金融' },
  { Icon: IconRetail,        label: '零售' },
  { Icon: IconFood,          label: '餐飲' },
  { Icon: IconManufacturing, label: '製造' },
  { Icon: IconRealestate,    label: '不動產' },
  { Icon: IconHealth,        label: '醫療' },
  { Icon: IconEducation,     label: '教育' },
  { Icon: IconLegal,         label: '法律' },
  { Icon: IconConsulting,    label: '顧問' },
  { Icon: IconLogistics,     label: '物流' },
  { Icon: IconEntertainment, label: '娛樂' },
  { Icon: IconAgriculture,   label: '農業' },
  { Icon: IconEnergy,        label: '能源' },
];
