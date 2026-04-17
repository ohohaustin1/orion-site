import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Trophy, BarChart3, Building2, BookOpen, Zap, Home, Menu, X, Shield , Users} from 'lucide-react';

const ORION_LOGO = '/ORIONLOGO.png';

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

        <div className="orion-sidebar-cta">
          <button
            className="orion-sidebar-warroom-btn"
            onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
          >
            <Zap size={16} />
            <span>立即診斷</span>
          </button>
          <a
            className="deep-space-entry"
            href="https://orion-hub.zeabur.app"
            style={{ textDecoration: 'none' }}
          >
            <span className="entry-icon">🔭</span>
            <div className="entry-text">
              <div className="entry-main">獵戶座深空掃描</div>
              <div className="entry-sub">僅限高階用戶進入</div>
            </div>
          </a>
          <button
            className="orion-sidebar-warroom-btn"
            style={{ marginTop: 8, background: 'rgba(201,168,76,0.08)', color: 'var(--orion-text-secondary)', fontSize: '0.75rem' }}
            onClick={() => window.location.href = 'https://orion-hub.zeabur.app/admin'}
          >
            <Shield size={14} />
            <span>後台管理</span>
          </button>
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
        <button
          className="orion-mobile-tab-item warroom"
          onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
        >
          <Zap size={20} />
          <span>診斷</span>
        </button>
      </nav>
    </>
  );
}
