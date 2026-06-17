import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Activity,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Home,
  LayoutDashboard,
  Menu,
  Shield,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { DIAG_URL } from '../lib/api-base';

const ORION_LOGO = '/brand/griffin-128.png';

interface NavItem {
  path: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/home', label: '首頁', desc: 'ORION 是什麼', icon: Home },
  { path: '/cases', label: '實戰案例', desc: '產業如何落地', icon: Trophy },
  { path: '/insights', label: '數據洞察', desc: 'AI 導入判斷', icon: BarChart3 },
  { path: '/about', label: '服務介紹', desc: '交付方法與模組', icon: Building2 },
  { path: '/team', label: '核心團隊', desc: '策略與工程作戰鏈', icon: Users },
  { path: '/resources', label: '資源中心', desc: '筆記與 FAQ', icon: BookOpen },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const activeItem = navItems.find((item) => item.path === location) || navItems[0];

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const goTo = (path: string) => {
    setLocation(path);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="orion-topnav">
        <Link href="/" className="orion-topnav-brand" aria-label="ORION AI 首頁">
          <img src={ORION_LOGO} alt="ORION" />
          <span>
            <strong>ORION AI</strong>
            <small>企業級 AI 決策基礎建設</small>
          </span>
        </Link>

        <nav className="orion-topnav-links" aria-label="主要導覽">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeItem.path === item.path;
            return (
              <button key={item.path} className={active ? 'active' : ''} onClick={() => goTo(item.path)} type="button">
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="orion-topnav-actions">
          <a href={`${DIAG_URL}/?mode=warrior`} className="topnav-ghost">
            <Shield size={16} />
            深度掃描
          </a>
          <a href={DIAG_URL} className="topnav-primary">
            <Activity size={16} />
            啟動診斷
          </a>
          <button className="orion-topnav-menu" type="button" onClick={() => setMenuOpen(true)} aria-label="開啟導覽">
            <Menu size={22} />
          </button>
        </div>
      </header>

      <div className="orion-page-context" aria-label="目前頁面">
        <span>{activeItem.label}</span>
        <ChevronDown size={14} />
        <small>{activeItem.desc}</small>
      </div>

      {menuOpen && (
        <>
          <div className="orion-menu-backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />
          <aside className="orion-menu-panel" role="dialog" aria-modal="true" aria-label="ORION 導覽選單">
            <div className="orion-menu-head">
              <div>
                <strong>ORION AI</strong>
                <span>選擇你要看的內容</span>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="關閉導覽">
                <X size={22} />
              </button>
            </div>

            <nav className="orion-menu-grid">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    className={activeItem.path === item.path ? 'active' : ''}
                    onClick={() => goTo(item.path)}
                    type="button"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    <small>{item.desc}</small>
                  </button>
                );
              })}
            </nav>

            <div className="orion-menu-cta">
              <a href={DIAG_URL} onClick={() => setMenuOpen(false)}>
                <Activity size={17} />
                啟動 AI 診斷
              </a>
              <a href={`${DIAG_URL}/?mode=warrior`} onClick={() => setMenuOpen(false)}>
                <Shield size={17} />
                深度掃描
              </a>
              <a href={`${DIAG_URL}/admin`} onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={17} />
                管理後台
              </a>
              <a href={`${DIAG_URL}/join-us`} onClick={() => setMenuOpen(false)}>
                <Briefcase size={17} />
                加入團隊
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
