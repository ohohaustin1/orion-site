import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Trophy, BarChart3, Building2, BookOpen, Zap, Home, Menu, X } from 'lucide-react';

const ORION_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_3606b99d.png';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/home', label: '首頁', icon: Home },
  { path: '/cases', label: '歷史案件', icon: Trophy },
  { path: '/about', label: '服務介紹', icon: Building2 },
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
          <img src={ORION_LOGO} alt="ORION" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.5))' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--orion-gold)' }}>ORION AI</div>
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
          <button
            className="orion-sidebar-warroom-btn"
            style={{ marginTop: 8, background: 'rgba(201,168,76,0.12)', color: 'var(--orion-gold)' }}
            onClick={() => window.location.href = 'https://orion-hub.zeabur.app'}
          >
            <Zap size={16} />
            <span>War Room</span>
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
