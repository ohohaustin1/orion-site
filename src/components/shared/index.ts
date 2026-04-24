/**
 * shared — 跨頁面共用的 Cinematic 組件 barrel
 *
 * 指向 components/effects/ 實作，對外用 shared/ 命名空間（Chairman spec）
 * 新頁面統一從 `@/components/shared` import，避免 path 深度耦合。
 */
export { default as GlassCard } from '../effects/GlassCard';
export { default as ScrollReveal } from '../effects/ScrollReveal';
export { default as AuroraBackground } from '../effects/AuroraBackground';
export { default as BreathingButton } from '../effects/BreathingButton';
export { default as GoldParticleDivider } from '../effects/GoldParticleDivider';
export { default as TypewriterTitle } from '../effects/TypewriterTitle';
export { default as AustinSignature } from './AustinSignature';
