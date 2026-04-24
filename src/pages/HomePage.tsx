import { useState, useEffect, Suspense, lazy } from 'react';
import { setSEO } from '../lib/seo';
import { LoadingRitual } from '../components/LoadingRitual';
import HeroSection from '../components/hero/HeroSection';
import ErrorBoundary from '../components/ErrorBoundary';

// Cinematic v1 共用組件（shared/ barrel → 指向 effects/ 實作）
import {
  GoldParticleDivider,
  GlassCard,
  ScrollReveal,
  AuroraBackground,
  BreathingButton,
  TypewriterTitle,
  AustinSignature,
} from '../components/shared';
import { PRODUCT_ICONS, INDUSTRY_ICONS } from '../components/icons';

import './HomePage.css';

// Three.js Earth — dynamic import 保持主 bundle lean
const Earth3D = lazy(() => import('../components/Earth3D'));

/* ==============================================================
   HomePage — Cinematic Orion Experience v1
   Chairman 2026-04-24 自主長任務包 Phase 2-6
   ============================================================== */

const STEPS = [
  { num: '01', title: '說出你的問題',  desc: 'Orion AI 幫你把模糊想法變為清晰需求' },
  { num: '02', title: '需求確認',      desc: '工程師接手，評估可行性與時程' },
  { num: '03', title: '系統建置',      desc: '從 0 到上線，全程 ORION 負責' },
  { num: '04', title: '永久陪跑',      desc: '3 個月後有新需求，Orion AI 還在' },
];

const PRODUCTS = [
  { num: '01', Icon: PRODUCT_ICONS[0],  title: '不動產決策 AI', sub: '每個月漏掉的機會成本，Orion AI 幫你抓回來',         key: '看懂市場，才不會錯過該進場的時機' },
  { num: '02', Icon: PRODUCT_ICONS[1],  title: '股票策略 AI',   sub: '看不清的市場，Orion AI 幫你拆成可執行訊號',         key: '每一筆交易，都有根據' },
  { num: '03', Icon: PRODUCT_ICONS[2],  title: '電商成交 AI',   sub: '流量不會轉換？Orion AI 幫你找到斷點',               key: '同樣流量，翻倍成交' },
  { num: '04', Icon: PRODUCT_ICONS[3],  title: '餐飲排班 AI',   sub: '人力成本失控，Orion AI 幫你算出最省組合',           key: '1 秒排完，還符合勞基法' },
  { num: '05', Icon: PRODUCT_ICONS[4],  title: '製造業排程 AI', sub: '訂單塞車、交期失控，Orion AI 幫你重新排序',         key: '產線不卡、客戶不跑' },
  { num: '06', Icon: PRODUCT_ICONS[5],  title: '客戶留存 AI',   sub: '客人來一次就不見？Orion AI 幫你把他留下',           key: '老客戶才是真正的現金流' },
  { num: '07', Icon: PRODUCT_ICONS[6],  title: '法律風險 AI',   sub: '合約陷阱逃不掉，Orion AI 幫你預演訴訟風險',         key: '簽字前先看到地雷' },
  { num: '08', Icon: PRODUCT_ICONS[7],  title: '健康長壽 AI',   sub: '數據比你更懂身體，Orion AI 幫你計算最佳排程',       key: '老闆的身體，也是公司的資產' },
  { num: '09', Icon: PRODUCT_ICONS[8],  title: '品牌語感 AI',   sub: '文案沒有靈魂？Orion AI 幫你植入 24 小時創意總監',   key: '品牌調性，一次對齊' },
  { num: '10', Icon: PRODUCT_ICONS[9],  title: '企業現金流 AI', sub: '錢不該躺著睡覺，Orion AI 幫你預測資金缺口',         key: '現金流透明，決策才踏實' },
  { num: '11', Icon: PRODUCT_ICONS[10], title: '教育傳承 AI',   sub: '經驗帶不走？Orion AI 幫你把大腦數位化',             key: '老員工的智慧，變成公司的資產' },
  { num: '12', Icon: PRODUCT_ICONS[11], title: '命運機率 AI',   sub: '運勢不再是玄學，Orion AI 將天時地利拆解為可控機率', key: '把直覺，變成可驗證的決策' },
];

const COMPARE = [
  { domain: '不動產', old: '靠業務員打電話、憑感覺出價',          neo: '24 小時自動監控，鎖定必賺缺口' },
  { domain: '排班',   old: '店長拿筆算半天，還會吵架',              neo: '1 秒產出最省組合，符合法規' },
  { domain: '決策',   old: '晚上失眠想破頭，還是怕選錯',            neo: '模擬 10,000 種結果，勝率最高' },
  { domain: '維護',   old: '出問題才找工程師修（貴又慢）',          neo: '系統自我監測修復，停機趨近零' },
  { domain: '客戶',   old: '客服被動回覆，問完就沒下文',            neo: '每次對話都在推進成交' },
];

export default function HomePage() {
  const [loaded, setLoaded] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    setSEO({
      title: 'Orion 獵戶座智鑑 | 做一次系統，當你一輩子的 AI 顧問',
      description: '說出你的問題，Orion AI 幫你找出失去的錢。企業級 AI 成交引擎，3 個月打造 10 個賺錢系統。',
      url: 'https://orion01.com',
    });

    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setScrollPct(total > 0 ? h.scrollTop / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      className="orion-home-page"
      style={{
        maxWidth: 'none',
        padding: 0,
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s',
      }}
    >
      <LoadingRitual active={showRitual} onComplete={() => { window.location.href = 'https://orion01.com'; }} />

      {/* 頂部滾動進度條 */}
      <div className="orion-scroll-progress" style={{ transform: `scaleX(${scrollPct})` }} />

      {/* 1. Hero（機器人 + 輸入欄 + 產業印記） */}
      <HeroSection />

      <GoldParticleDivider />

      {/* 2. 副標（Aurora 背景） */}
      <section className="co-tagline">
        <AuroraBackground style={{ position: 'absolute', inset: 0, zIndex: 0 } as React.CSSProperties} />
        <ScrollReveal y={32}>
          <p className="co-tagline-text">
            成為你一輩子的 <strong>商業 AI 顧問</strong>
          </p>
        </ScrollReveal>
      </section>

      <GoldParticleDivider />

      {/* 3. 4 步驟（GlassCard 4 欄） */}
      <section className="co-steps-section" aria-label="Orion 服務流程">
        <ScrollReveal className="co-steps-grid" stagger={0.1} y={24}>
          {STEPS.map((s) => (
            <GlassCard key={s.num} className="co-step">
              <div className="co-step-num">{s.num}</div>
              <h3 className="co-step-title">{s.title}</h3>
              <p className="co-step-desc">{s.desc}</p>
            </GlassCard>
          ))}
        </ScrollReveal>
      </section>

      <GoldParticleDivider />

      {/* 4. 三句標題 */}
      <section className="co-section">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <TypewriterTitle
            lines={[
              '所有想法，都能系統化',
              '所有系統，都能產品化',
              '所有產品，都能商業化',
            ]}
            lineGap={0.6}
          />
        </div>
      </section>

      <GoldParticleDivider />

      {/* 5. 12 產品 Bento（Aurora 背景） */}
      <AuroraBackground intensity={1}>
        <section className="co-section">
          <div className="co-section-header">
            <ScrollReveal>
              <>
                <h2>12 個 AI 系統，涵蓋你每一個決策</h2>
                <p>從不動產到命運機率，每一個都是真金白銀回報</p>
              </>
            </ScrollReveal>
          </div>
          <ScrollReveal className="co-bento" stagger={0.07} y={40}>
            {PRODUCTS.map((p) => (
              <GlassCard key={p.num} className="co-product">
                <div className="co-product-head">
                  <span className="co-product-num">{p.num}</span>
                  <span className="co-product-icon" aria-hidden="true">
                    <p.Icon />
                  </span>
                </div>
                <h3 className="co-product-title">{p.title}</h3>
                <p className="co-product-sub">{p.sub}</p>
                <div className="co-product-key">👉 {p.key}</div>
              </GlassCard>
            ))}
          </ScrollReveal>
        </section>
      </AuroraBackground>

      {/* 6. 「那，你的行業呢？」+ 跑馬燈 */}
      <section className="co-industries">
        <ScrollReveal>
          <h2 className="co-industries-title">那，你的行業呢？</h2>
        </ScrollReveal>
        <div className="co-marquee">
          <div className="co-marquee-track">
            {[...INDUSTRY_ICONS, ...INDUSTRY_ICONS].map((ind, i) => (
              <div key={i} className="co-marquee-item" title={ind.label} aria-label={ind.label}>
                <ind.Icon />
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldParticleDivider />

      {/* 7. 傳統 vs AI 對比 */}
      <section className="co-section">
        <div className="co-section-header co-compare-header">
          <ScrollReveal>
            <>
              <h2>原來，還可以這樣</h2>
              <p>很多老闆不是不想改變，是不知道現在可以這樣</p>
            </>
          </ScrollReveal>
        </div>

        <ScrollReveal className="co-compare" stagger={0.12} y={20}>
          {COMPARE.map((c, i) => (
            <div key={i} className="co-compare-row">
              <div className="co-compare-cell co-compare-old">❌ {c.domain}：{c.old}</div>
              <div className="co-compare-arrow">→</div>
              <div className="co-compare-cell co-compare-new">✓ {c.neo}</div>
            </div>
          ))}
        </ScrollReveal>
      </section>

      <GoldParticleDivider />

      {/* 8. 3D 地球連線 */}
      <section className="co-section">
        <div className="co-section-header">
          <ScrollReveal>
            <>
              <h2>全球想法，都在這裡實現</h2>
              <p>世界各地的老闆，用 Orion AI 把直覺變成系統</p>
            </>
          </ScrollReveal>
        </div>
        <div className="co-earth-wrap">
          <ErrorBoundary
            fallback={
              <div className="co-earth-fallback" role="img" aria-label="Orion 全球連線（靜態 fallback）">
                <div style={{
                  width: 280, height: 280, borderRadius: '50%',
                  border: '1px dashed rgba(197,160,89,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#C5A059', letterSpacing: '0.18em', fontSize: 13,
                  boxShadow: '0 0 48px rgba(197,160,89,0.18), inset 0 0 48px rgba(197,160,89,0.08)',
                }}>
                  ORBITAL LINK
                </div>
              </div>
            }
          >
            <Suspense fallback={<div className="co-earth-fallback">LOADING ORBITAL LINK...</div>}>
              <div className="co-earth-canvas-host">
                <Earth3D />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <GoldParticleDivider />

      {/* 9. 信任錨點（雙行 + Austin 簽名） */}
      <section className="co-trust">
        <ScrollReveal>
          <p className="co-trust-line1">未來的企業只有兩種：</p>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
          <p className="co-trust-line2">被 AI 取代的，與擁有 Orion 系統的。</p>
        </ScrollReveal>

        <ScrollReveal delay={0.9} className="co-trust-signature-wrap">
          <AustinSignature width={240} delay={0.2} />
        </ScrollReveal>

        <ScrollReveal delay={1.1}>
          <div className="co-trust-author">
            <span className="co-trust-avatar">
              <img src="/TEAM/AUSTIN.png" alt="Austin 許燿宸" />
            </span>
            <span>— Austin，ORION 創辦人</span>
          </div>
        </ScrollReveal>
      </section>

      {/* 10. 最後 CTA */}
      <section className="co-final-cta">
        <ScrollReveal>
          <h2>你的下一個系統，從這裡開始</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2} className="co-final-cta-btn-wrap">
          <BreathingButton onClick={() => setShowRitual(true)}>
            現在對話 →
          </BreathingButton>
        </ScrollReveal>
      </section>
    </div>
  );
}
