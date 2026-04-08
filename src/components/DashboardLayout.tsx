import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LogOut, Menu, X, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  const handleSettings = () => {
    setLocation('/settings');
  };

  const sidebarItems = [
    {
      label: t('nav.dashboard'),
      href: '/',
      icon: '🎯',
      section: t('nav.dashboard'),
    },
    {
      label: t('analysis.title'),
      href: '/analysis/new',
      icon: '✨',
      section: t('nav.dashboard'),
    },
    {
      label: t('projects.title'),
      href: '/projects',
      icon: '📁',
      section: t('nav.dashboard'),
    },
    {
      label: t('clients.title'),
      href: '/clients',
      icon: '👥',
      section: t('nav.dashboard'),
    },
    {
      label: 'Engineer Handoff',
      href: '/handoff',
      icon: '🔧',
      section: 'Management',
    },
  ];

  return (
    <div className="flex h-screen bg-[#0a0d14] orion-grid-bg">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#0d1120] border-r border-[rgba(201,168,76,0.28)] transition-all duration-300 flex flex-col relative`}
        style={{
          backgroundImage: `linear-gradient(90deg, transparent, rgba(201,168,76,0.012), transparent)`,
        }}
      >
        <div
          className="absolute right-0 top-[15%] bottom-[15%] w-px"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.28), transparent)',
          }}
        />

        <div className="p-6 border-b border-[rgba(201,168,76,0.28)] relative z-10">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 40 40"
              className="w-8 h-8"
              style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.3))' }}
            >
              <g fill="#c9a84c">
                <circle cx="20" cy="10" r="2" />
                <circle cx="12" cy="18" r="1.5" />
                <circle cx="28" cy="18" r="1.5" />
                <circle cx="20" cy="28" r="2" />
              </g>
              <g stroke="#c9a84c" strokeWidth="0.5" opacity="0.6">
                <line x1="20" y1="10" x2="12" y2="18" />
                <line x1="20" y1="10" x2="28" y2="18" />
                <line x1="12" y1="18" x2="20" y2="28" />
                <line x1="28" y1="18" x2="20" y2="28" />
              </g>
            </svg>
            {sidebarOpen && (
              <div>
                <p className="font-display font-bold text-[#c9a84c] text-sm tracking-widest">獵戶智鑒</p>
                <p className="font-mono text-[#7a8499] text-xs">ORION AI</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 relative z-10">
          {sidebarItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all duration-200 group"
              style={{
                color: '#7a8499',
                borderLeft: '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(201,168,76,0.08)';
                e.currentTarget.style.borderLeftColor = '#c9a84c';
                e.currentTarget.style.color = '#c9a84c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderLeftColor = 'transparent';
                e.currentTarget.style.color = '#7a8499';
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="font-display text-xs tracking-wide">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-[rgba(201,168,76,0.28)] space-y-3 relative z-10">
          {sidebarOpen && user && (
            <div className="px-3 py-3 bg-[rgba(201,168,76,0.08)] rounded border border-[rgba(201,168,76,0.28)]">
              <p className="font-mono text-xs text-[#7a8499] mb-1">LOGGED IN</p>
              <p className="font-display text-sm text-[#c9a84c] truncate">{user.name}</p>
              <p className="font-mono text-xs text-[#7a8499] truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={handleSettings}
            className="orion-btn-ghost w-full flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {sidebarOpen && <span>{t('nav.settings')}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="orion-btn-ghost w-full flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-16 bg-[#0d1120] border-b border-[rgba(201,168,76,0.28)] flex items-center px-6 justify-between relative"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(201,168,76,0.04), transparent)`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.28), transparent)',
            }}
          />

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-[#c9a84c] hover:bg-[rgba(201,168,76,0.12)] rounded transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex-1 flex items-center justify-center">
            <h1 className="font-display text-[#c9a84c] text-sm tracking-widest">
              ORION AI INTELLIGENCE SYSTEM
            </h1>
          </div>

          <LanguageSwitcher />
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
