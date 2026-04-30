import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Trophy, BarChart3, Building2, BookOpen, Zap, Home, Menu, X, Shield, Users, Activity, LayoutDashboard, Briefcase } from 'lucide-react';
import { DIAG_URL } from '../lib/api-base';

/** ShieldScan — 自設計盾牌 + 中央掃描線 icon（Chairman 2026-04-24 企業 QA 深層掃描專用）*/
const ShieldScanIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* 盾牌外框 */}
    <path d="M16 3 L27 7 L27 15 C 27 22, 22 26, 16 29 C 10 26, 5 22, 5 15 L 5 7 Z" />
    {/* 中央掃描線 */}
    <line x1={9} y1={16} x2={23} y2={16} strokeWidth={2} />
    {/* 上下兩條輔助掃描線 */}
    <line x1={12} y1={11} x2={20} y2={11} strokeWidth={1} opacity={0.55} />
    <line x1={12} y1={21} x2={20} y2={21} strokeWidth={1} opacity={0.55} />
  </svg>
);

const ORION_LOGO = '/brand/griffin-128.png';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/home', label: '首頁', icon: Home },
  { path: '/cases', label: '歷史案件', icon: Trophy },
  { path: '/about', label: '服務介紹', icon: Building2 },
  { path: '/team', label: '核心團隊', icon: Users },
  // D 修：原 label「聯絡我們」誤導、頁面內容是資源中心 → 改「資源中心」
  { path: '/resources', label: '資源中心', icon: BookOpen },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // D 修：原 startsWith 會誤判（/about 會 highlight /aboutXyz）；
  // 全部用 exact match 加 / 開頭路徑、簡單可靠
  const isActive = (path: string) => location === path;

  // Task 3 / 2026-04-25: drawer 開啟時鎖 body scroll + ESC 鍵關閉
  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen]);

  const goTo = (path: string) => {
    setLocation(path);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="orion-sidebar-desktop">
        <div className="orion-sidebar-logo" onClick={() => setLocation('/home')}>
          <img src={ORION_LOGO} alt="ORION" style={{ width: 48, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.7))', animation: 'logoGlow 2.5s ease-in-out infinite' }} />
          <div>
            <div className="brand-text" style={{ fontSize: '0.75rem' }}>ORION AI</div>
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.08em', color: 'var(--orion-text-tertiary)' }}>獵戶座智囊</div>
          </div>
        </div>

        <nav className="orion-sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                className={`orion-sidebar-item ${active ? 'active' : ''}`}
                onClick={() => setLocation(item.path)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {active && <div className="orion-sidebar-active-bar" />}
              </button>
            );
          })}
          {/* CC-FIX-JOIN-US-PLACEMENT-001: 加入我們 跨域連 hub /join-us 招聘頁
              （orion-site 內無 /jobs 頁、目前 hub 是唯一招聘 landing） */}
          <a
            className="orion-sidebar-item"
            href={`${DIAG_URL}/join-us`}
            style={{ textDecoration: 'none' }}
          >
            <Briefcase size={18} />
            <span>招兵買馬</span>
          </a>
        </nav>

        {/* 產品入口 — Chairman 2026-04-24 */}
        <div className="orion-sidebar-cta">
          <a
            className="orion-sidebar-cta-link"
            href={DIAG_URL}
          >
            <span className="orion-sidebar-cta-icon"><Activity size={16} /></span>
            <span className="orion-sidebar-cta-text">系統監測</span>
          </a>
          <a
            className="orion-sidebar-cta-link is-warrior"
            href={`${DIAG_URL}/?mode=warrior`}
          >
            <span className="orion-sidebar-cta-icon"><ShieldScanIcon size={16} /></span>
            <div className="orion-sidebar-cta-body">
              <div className="orion-sidebar-cta-text">企業 QA 深層掃描</div>
              <div className="orion-sidebar-cta-sub">僅限高階客戶</div>
            </div>
          </a>
          <a
            className="orion-sidebar-cta-link"
            href={`${DIAG_URL}/admin`}
          >
            <span className="orion-sidebar-cta-icon"><LayoutDashboard size={16} /></span>
            <span className="orion-sidebar-cta-text">管理台</span>
          </a>
        </div>
      </aside>

      {/* Mobile Header + Hamburger (Task 3 / 2026-04-25) */}
      <header className="orion-mobile-header">
        <div className="orion-mobile-header-logo" onClick={() => goTo('/home')}>
          <img src={ORION_LOGO} alt="ORION" />
          <span>ORION AI</span>
        </div>
        <button
          className="orion-mobile-hamburger"
          onClick={() => setMobileOpen(true)}
          aria-label="開啟選單"
          aria-expanded={mobileOpen}
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="orion-mobile-drawer-backdrop"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="orion-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="主選單"
          >
            <div className="orion-mobile-drawer-header">
              <span>選單</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="關閉選單"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="orion-mobile-drawer-nav">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`orion-mobile-drawer-item ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => goTo(item.path)}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {/* CC-FIX-JOIN-US-PLACEMENT-001: 加入我們 mobile drawer 同步、不進 bottom tab（iPhone-SE 7 button 擠）*/}
              <a
                className="orion-mobile-drawer-item"
                href={`${DIAG_URL}/join-us`}
                onClick={() => setMobileOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <Briefcase size={20} />
                <span>招兵買馬</span>
              </a>
            </nav>
            <div className="orion-mobile-drawer-cta">
              <a
                href={DIAG_URL}
                onClick={() => setMobileOpen(false)}
              >
                <Activity size={16} />
                <span>系統監測</span>
              </a>
              <a
                href={`${DIAG_URL}/?mode=warrior`}
                onClick={() => setMobileOpen(false)}
                className="is-warrior"
              >
                <ShieldScanIcon size={16} />
                <span>企業 QA 深層掃描</span>
              </a>
              <a
                href={`${DIAG_URL}/admin`}
                onClick={() => setMobileOpen(false)}
              >
                <LayoutDashboard size={16} />
                <span>管理台</span>
              </a>
            </div>
          </aside>
        </>
      )}

      {/* Mobile Bottom Tab */}
      <nav className="orion-mobile-tab">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              className={`orion-mobile-tab-item ${active ? 'active' : ''}`}
              onClick={() => setLocation(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
        {/* 手機底部 tab 多一個「監測」快捷 */}
        <button
          className="orion-mobile-tab-item warroom"
          onClick={() => window.location.href = DIAG_URL}
        >
          <Activity size={20} />
          <span>監測</span>
        </button>
      </nav>
    </>
  );
}
