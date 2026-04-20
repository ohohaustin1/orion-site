import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TypewriterTitle — GSAP 打字機標題（滾動觸發）
 *
 * 接 lines: string[]，逐行逐字淡入。左側垂直金光柱裝飾。
 */
export interface TypewriterTitleProps {
  lines: string[];
  className?: string;
  /** 每行每字 delay，預設 0.035s */
  charDelay?: number;
  /** 行間隔秒數，預設 0.8 */
  lineGap?: number;
}

const TW_CSS = `
.tw-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 56px 0 56px 28px;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.05em;
  line-height: 1.6;
}
.tw-wrap::before {
  content: '';
  position: absolute;
  left: 0; top: 20%; bottom: 20%;
  width: 2px;
  background: linear-gradient(to bottom,
    rgba(197,160,89,0) 0%,
    rgba(197,160,89,0.6) 50%,
    rgba(197,160,89,0) 100%);
  box-shadow: 0 0 14px rgba(245,211,105,0.5);
}
.tw-line {
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 300;
  color: #fff;
  margin: 0;
}
.tw-char { opacity: 0; display: inline-block; }
.tw-line:nth-child(2) { color: #C5A059; font-weight: 400; }
.tw-line:nth-child(3) { color: #fff; font-weight: 500; }
`;

export default function TypewriterTitle({
  lines,
  className,
  charDelay = 0.035,
  lineGap = 0.8,
}: TypewriterTitleProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wrap.querySelectorAll<HTMLSpanElement>('.tw-char').forEach((el) => (el.style.opacity = '1'));
      return;
    }
    const chars = Array.from(wrap.querySelectorAll<HTMLSpanElement>('.tw-char'));
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
    let offset = 0;
    lines.forEach((line) => {
      for (let i = 0; i < line.length; i++) {
        tl.to(chars[offset + i], { opacity: 1, duration: 0.22, ease: 'power1.out' }, offset === 0 && i === 0 ? 0 : `>${charDelay / 2}`);
      }
      offset += line.length;
      tl.to({}, { duration: lineGap });
    });
    return () => { tl.kill(); };
  }, [lines, charDelay, lineGap]);

  return (
    <div ref={wrapRef} className={['tw-wrap', className].filter(Boolean).join(' ')}>
      <style dangerouslySetInnerHTML={{ __html: TW_CSS }} />
      {lines.map((line, li) => (
        <h2 key={li} className="tw-line">
          {Array.from(line).map((ch, ci) => (
            <span key={ci} className="tw-char">{ch}</span>
          ))}
        </h2>
      ))}
    </div>
  );
}
