import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Trophy, BarChart3, Building2, BookOpen, Zap, Home, Menu, X, Shield, Users, Activity, LayoutDashboard } from 'lucide-react';

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
  { path: '/resources', label: '聯絡我們', icon: BookOpen },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/home') return location === '/home';
    return location.startsWith(path);
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
        </nav>

        {/* 產品入口 — Chairman 2026-04-24 */}
        <div className="orion-sidebar-cta">
          <a
            className="orion-sidebar-cta-link"
            href="https://orion-hub.zeabur.app"
          >
            <span className="orion-sidebar-cta-icon"><Activity size={16} /></span>
            <span className="orion-sidebar-cta-text">系統監測</span>
          </a>
          <a
            className="orion-sidebar-cta-link is-warrior"
            href="https://orion-hub.zeabur.app/?mode=warrior"
          >
            <span className="orion-sidebar-cta-icon"><ShieldScanIcon size={16} /></span>
            <div className="orion-sidebar-cta-body">
              <div className="orion-sidebar-cta-text">企業 QA 深層掃描</div>
              <div className="orion-sidebar-cta-sub">僅限高階客戶</div>
            </div>
          </a>
          <a
            className="orion-sidebar-cta-link"
            href="https://orion-hub.zeabur.app/admin"
          >
            <span className="orion-sidebar-cta-icon"><LayoutDashboard size={16} /></span>
            <span className="orion-sidebar-cta-text">管理台</span>
          </a>
        </div>
      </aside>

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
          onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
        >
          <Activity size={20} />
          <span>監測</span>
        </button>
      </nav>
    </>
  );
}
