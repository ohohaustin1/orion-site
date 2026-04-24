import React, { useId } from 'react';

/**
 * IndustryIcons v2 — 彩色漸層版（Chairman 2026-04-24）
 *
 * 每個 icon 一色一漸層（light→dark 垂直），stroke 用 dark color
 * 細邊（0.8-1.2）。useId() 確保同頁多次渲染不 id 衝突。
 * 金色黑金感透過父層 drop-shadow filter 添加（CSS 端處理）。
 */

type IconProps = React.SVGProps<SVGSVGElement>;

const base: IconProps = {
  viewBox: '0 0 32 32',
  fill: 'none',
};

interface ColorPair { light: string; dark: string; }

const makeIcon = (
  label: string,
  colors: ColorPair,
  render: (gradUrl: string, dark: string) => React.ReactNode
) => (props: IconProps) => {
  const rawId = useId();
  const gradId = `grad-${rawId.replace(/:/g, '')}`;
  const gradUrl = `url(#${gradId})`;
  return (
    <svg {...base} {...props} aria-label={label}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.light} />
          <stop offset="100%" stopColor={colors.dark} />
        </linearGradient>
      </defs>
      {render(gradUrl, colors.dark)}
    </svg>
  );
};

/* 01 科技 — 晶片 */
export const IconTech = makeIcon(
  '科技業',
  { light: '#66E7FF', dark: '#00D9FF' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={0.8} strokeLinecap="round">
      <rect x={8} y={8} width={16} height={16} fill={grad} />
      <rect x={12} y={12} width={8} height={8} fill="rgba(0,0,0,0.35)" />
      {/* pins */}
      {[12, 16, 20].map((v) => (
        <React.Fragment key={v}>
          <line x1={4} y1={v} x2={8} y2={v} />
          <line x1={24} y1={v} x2={28} y2={v} />
          <line x1={v} y1={4} x2={v} y2={8} />
          <line x1={v} y1={24} x2={v} y2={28} />
        </React.Fragment>
      ))}
    </g>
  ),
);

/* 02 金融 — 上升曲線 + dot */
export const IconFinance = makeIcon(
  '金融',
  { light: '#5FFFB5', dark: '#00FF88' },
  (_grad, dark) => (
    <g stroke={dark} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,24 10,20 14,22 20,12 26,8" />
      <polyline points="22,8 26,8 26,12" />
      <circle cx={20} cy={12} r={1.6} fill={dark} />
      <circle cx={14} cy={22} r={1.2} fill={dark} opacity={0.75} />
    </g>
  ),
);

/* 03 零售 — 購物袋 */
export const IconRetail = makeIcon(
  '零售',
  { light: '#FFB84D', dark: '#FF9500' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10 L8 26 L24 26 L26 10 Z" fill={grad} />
      <path d="M12 10 C 12 6, 20 6, 20 10" fill="none" strokeWidth={1.6} />
    </g>
  ),
);

/* 04 餐飲 — 刀叉 */
export const IconFood = makeIcon(
  '餐飲',
  { light: '#FF7A70', dark: '#FF3B30' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      {/* 叉 */}
      <path d="M7 4 L7 12 L10 12 L10 4 M 13 4 L 13 12 L 10 12 M 10 12 L 10 28" fill="none" />
      {/* 刀 */}
      <path d="M22 4 Q26 6 26 14 L22 14 Z" fill={grad} />
      <line x1={22} y1={14} x2={22} y2={28} />
    </g>
  ),
);

/* 05 製造 — 齒輪 */
export const IconManufacturing = makeIcon(
  '製造',
  { light: '#C5C5CC', dark: '#8E8E93' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1} fill={grad} strokeLinejoin="round">
      <path d="
        M 13 4 L 19 4 L 20.5 6.5
        L 24.5 7.5 L 25.5 11.5
        L 28 13 L 28 19 L 25.5 20.5
        L 24.5 24.5 L 20.5 25.5
        L 19 28 L 13 28 L 11.5 25.5
        L 7.5 24.5 L 6.5 20.5
        L 4 19 L 4 13 L 6.5 11.5
        L 7.5 7.5 L 11.5 6.5 Z" />
      <circle cx={16} cy={16} r={4} fill="rgba(0,0,0,0.4)" />
    </g>
  ),
);

/* 06 不動產 — 建築 */
export const IconRealestate = makeIcon(
  '不動產',
  { light: '#FFEAA4', dark: '#FFD369' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16 L16 6 L28 16 L25 16 L25 26 L7 26 L7 16 Z" fill={grad} />
      <rect x={14} y={18} width={4} height={8} fill="rgba(0,0,0,0.35)" />
    </g>
  ),
);

/* 07 醫療 — 心跳 + 圓 */
export const IconHealth = makeIcon(
  '醫療',
  { light: '#A2E3FF', dark: '#5AC8FA' },
  (_grad, dark) => (
    <g stroke={dark} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={16} cy={16} r={11} strokeWidth={1} opacity={0.4} />
      <polyline points="4,16 10,16 12,12 14,20 16,8 18,24 20,16 28,16" />
    </g>
  ),
);

/* 08 教育 — 書本 */
export const IconEducation = makeIcon(
  '教育',
  { light: '#D08EF0', dark: '#AF52DE' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8 L16 10 L16 26 L4 24 Z" fill={grad} />
      <path d="M28 8 L16 10 L16 26 L28 24 Z" fill={grad} opacity={0.85} />
      <line x1={16} y1={10} x2={16} y2={26} strokeWidth={1.4} />
    </g>
  ),
);

/* 09 法律 — 天平 */
export const IconLegal = makeIcon(
  '法律',
  { light: '#66AFFF', dark: '#007AFF' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
      <line x1={16} y1={6} x2={16} y2={26} />
      <line x1={8} y1={10} x2={24} y2={10} />
      <path d="M5 14 L11 14 L8 20 Z" fill={grad} />
      <path d="M21 14 L27 14 L24 20 Z" fill={grad} />
      <line x1={11} y1={28} x2={21} y2={28} strokeWidth={1.8} />
    </g>
  ),
);

/* 10 顧問 — 對話泡泡 */
export const IconConsulting = makeIcon(
  '顧問',
  { light: '#7EE694', dark: '#32D74B' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M5 8 L24 8 Q27 8 27 11 L27 20 Q27 23 24 23 L15 23 L10 27 L10 23 L8 23 Q5 23 5 20 Z"
        fill={grad}
      />
      <circle cx={12} cy={15.5} r={1} fill="rgba(0,0,0,0.45)" />
      <circle cx={16} cy={15.5} r={1} fill="rgba(0,0,0,0.45)" />
      <circle cx={20} cy={15.5} r={1} fill="rgba(0,0,0,0.45)" />
    </g>
  ),
);

/* 11 物流 — 箱子 + 箭頭 */
export const IconLogistics = makeIcon(
  '物流',
  { light: '#D4B890', dark: '#A2845E' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <rect x={6} y={12} width={14} height={14} fill={grad} />
      <line x1={6} y1={16} x2={20} y2={16} />
      <line x1={13} y1={12} x2={13} y2={26} />
      <line x1={22} y1={8} x2={28} y2={8} strokeWidth={1.6} />
      <polyline points="25,5 28,8 25,11" />
    </g>
  ),
);

/* 12 娛樂 — 圓形播放鍵 */
export const IconEntertainment = makeIcon(
  '娛樂',
  { light: '#FF758F', dark: '#FF2D55' },
  (grad, dark) => (
    <g>
      <circle cx={16} cy={16} r={12} fill={grad} stroke={dark} strokeWidth={1.2} />
      <polygon points="13,10 23,16 13,22" fill="#fff" />
    </g>
  ),
);

/* 13 農業 — 葉子 */
export const IconAgriculture = makeIcon(
  '農業',
  { light: '#7FE095', dark: '#34C759' },
  (grad, dark) => (
    <g stroke={dark} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 26 C 6 14, 14 6, 26 6 C 26 18, 18 26, 6 26 Z" fill={grad} />
      <line x1={6} y1={26} x2={20} y2={12} strokeWidth={1} opacity={0.65} />
    </g>
  ),
);

/* 14 能源 — 閃電 */
export const IconEnergy = makeIcon(
  '能源',
  { light: '#FFDD66', dark: '#FFCC00' },
  (grad, dark) => (
    <g>
      <polygon
        points="18,4 8,18 14,18 12,28 24,14 18,14"
        fill={grad}
        stroke={dark}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </g>
  ),
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
