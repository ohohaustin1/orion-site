import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

/**
 * ScrollReveal — 封裝 Framer Motion 進場動畫
 *
 * 預設 fadeInUp，支援 stagger（容器 + children 一起用）
 */
export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;         // 位移起點（px）
  once?: boolean;
  amount?: number;    // 觸發閾值（0-1）
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'h1' | 'h2' | 'h3' | 'p';
  stagger?: number;   // 若設定，children 會依序延遲
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
  y = 24,
  once = true,
  amount = 0.25,
  as,
  stagger,
}: ScrollRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Plain = (as ?? 'div') as React.ElementType;
    return <Plain className={className}>{children}</Plain>;
  }

  if (stagger != null) {
    const container: Variants = {
      hidden: {},
      visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
    };
    const item: Variants = {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0, transition: { duration, ease: [0.2, 0.8, 0.2, 1] } },
    };
    return (
      <motion.div
        className={className}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
      >
        {React.Children.map(children, (child, i) => (
          <motion.div key={i} variants={item}>
            {child}
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
