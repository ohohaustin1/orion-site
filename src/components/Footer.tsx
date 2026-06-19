/**
 * Footer.tsx — 全站頁尾（B2B 信任 + 合規連結層）
 *
 * 為何存在：實機稽核發現整站沒有 footer——沒有品牌資訊、聯絡入口、著作權，
 * 且既有的 /privacy、/terms 頁面沒有任何連結指向（內容寫了卻到不了）。
 * 本元件補上這層。
 *
 * 設計：純展示元件（無 props），SSR/prerender-safe（年份固定、無瀏覽器專屬 API）。
 * 樣式：沿用全站 ORION CSS 變數（--orion-gold / --orion-bg-* / --orion-text-*），
 *       結構用 Tailwind（grid / 響應式 breakpoint）。
 *
 * 聯絡：刻意「不」接 ContactFormModal——該 modal 需要真實診斷 sessionId，
 *       頁尾沒有 session，用 sessionId=0 會在正式 CRM 留下無 session 的髒 lead。
 *       改為直接連到既有的 O 免費診斷漏斗（DIAG_URL），與全站 CTA 一致、零髒資料。
 *       TODO(chairman): 若要頁尾「直接留資料」的純聯絡表單，需後端提供一支
 *       不綁 session 的 contact endpoint，屆時再換成獨立表單元件。
 *
 * 掛載：由 App.tsx 的 SidebarLayout 尾端 <Footer /> 負責。
 */

import { Link } from 'wouter';
import { Mail } from 'lucide-react';
import { DIAG_URL } from '@/lib/api-base';

const ORION_LOGO = '/brand/griffin-128.png';

/** 導覽連結（比照 Sidebar 的 navItems 路由） */
const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/home', label: '首頁' },
  { href: '/cases', label: '實戰案例' },
  { href: '/about', label: '服務介紹' },
  { href: '/team', label: '核心團隊' },
  { href: '/insights', label: '數據洞察' },
  { href: '/resources', label: '資源中心' },
];

/** 法律 / 信任連結（既有頁面，需被指向） */
const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: '/privacy', label: '隱私權政策' },
  { href: '/terms', label: '服務條款' },
];

export default function Footer() {
  // 共用文字色票（CSS 變數，全站一致）
  const headingStyle: React.CSSProperties = {
    color: 'var(--orion-gold, #c9a84c)',
    fontFamily: 'var(--orion-font-display, "Space Grotesk", "Noto Sans TC", sans-serif)',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    marginBottom: 14,
  };

  const linkStyle: React.CSSProperties = {
    color: 'var(--orion-text-secondary, #8a93a8)',
    fontSize: '0.875rem',
    lineHeight: 2,
    textDecoration: 'none',
    transition: 'color 0.15s',
    display: 'inline-block',
  };

  const onLinkEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--orion-gold-bright, #e8c96a)';
  };
  const onLinkLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = 'var(--orion-text-secondary, #8a93a8)';
  };

  return (
    <footer
      role="contentinfo"
      aria-label="網站頁尾"
      style={{
        background: 'var(--orion-bg-void, #080b12)',
        borderTop: '1px solid rgba(201,168,76,0.22)',
        color: 'var(--orion-text-secondary, #8a93a8)',
        fontFamily: 'var(--orion-font-body, "Noto Sans TC", -apple-system, sans-serif)',
      }}
    >
      {/* 細金色頂線（漸層，呼應全站 accent 線條） */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)',
        }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-14">
        {/* 主要區塊：手機單欄、桌機多欄 grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. 品牌區 */}
          <div className="lg:col-span-1">
            <Link
              href="/home"
              aria-label="ORION AI 獵戶座智鑑 首頁"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
            >
              <img
                src={ORION_LOGO}
                alt="ORION AI 獅鷲標誌"
                width={36}
                height={36}
                style={{ display: 'block', borderRadius: 8 }}
              />
              <span
                style={{
                  color: 'var(--orion-text-primary, #e8eaf0)',
                  fontFamily: 'var(--orion-font-display, "Space Grotesk", "Noto Sans TC", sans-serif)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2,
                }}
              >
                ORION AI
                <span
                  style={{
                    display: 'block',
                    color: 'var(--orion-gold-matte, #C5A059)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    marginTop: 2,
                  }}
                >
                  獵戶座智鑑
                </span>
              </span>
            </Link>

            <p
              style={{
                marginTop: 16,
                color: 'var(--orion-text-secondary, #8a93a8)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                maxWidth: 260,
              }}
            >
              把每天追人的事，交給 O。<br />
              AI 幫你追客、追單、追進度。
            </p>

            {/* TODO(chairman): 如需顯示公司登記名稱／Email／地址／統編，於此補上 */}
          </div>

          {/* 2. 導覽連結區 */}
          <nav aria-label="網站導覽" className="lg:col-span-1">
            <h2 style={headingStyle}>探索</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={onLinkEnter}
                    onMouseLeave={onLinkLeave}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 3. 法律 / 信任區 */}
          <nav aria-label="法律與合規" className="lg:col-span-1">
            <h2 style={headingStyle}>信任與合規</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={linkStyle}
                    onMouseEnter={onLinkEnter}
                    onMouseLeave={onLinkLeave}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* 4. 聯絡區 — 連到既有 O 免費診斷漏斗（DIAG_URL），不綁 session、零髒 lead */}
          <div className="lg:col-span-1">
            <h2 style={headingStyle}>聯絡</h2>
            <p
              style={{
                color: 'var(--orion-text-secondary, #8a93a8)',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                marginBottom: 14,
                maxWidth: 240,
              }}
            >
              想了解 ORION 能為你的團隊做什麼？先讓 O 免費拆一條你最常卡住的流程。
            </p>
            <a
              href={DIAG_URL}
              aria-label="前往 O 免費診斷"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.45)',
                borderRadius: 8,
                color: 'var(--orion-gold, #c9a84c)',
                fontFamily: 'var(--orion-font-display, "Space Grotesk", "Noto Sans TC", sans-serif)',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.14)';
                e.currentTarget.style.borderColor = 'var(--orion-gold, #c9a84c)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201,168,76,0.06)';
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.45)';
              }}
            >
              <Mail size={16} aria-hidden="true" />
              聯絡我們 / 免費諮詢
            </a>
          </div>
        </div>

        {/* 著作權列 */}
        <div
          className="mt-10 flex flex-col gap-3 md:mt-12 md:flex-row md:items-center md:justify-between"
          style={{
            paddingTop: 20,
            borderTop: '1px solid rgba(201,168,76,0.12)',
          }}
        >
          <p
            style={{
              color: 'var(--orion-text-tertiary, #4a5268)',
              fontSize: '0.75rem',
              fontFamily: 'var(--orion-font-mono, "JetBrains Mono", monospace)',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            © 2026 ORION AI 獵戶座智鑑. All rights reserved.
          </p>
          {/* 桌機右側重複法律連結，方便底部直接取用 */}
          <div className="flex items-center gap-4">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={`copyright-${item.href}`}
                href={item.href}
                style={{
                  color: 'var(--orion-text-tertiary, #4a5268)',
                  fontSize: '0.75rem',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--orion-gold, #c9a84c)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--orion-text-tertiary, #4a5268)';
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
