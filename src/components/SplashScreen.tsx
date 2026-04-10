import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const bootMessages = {
  'zh-CN': [
    '[ OK ] 核心模块载入完成',
    '[ OK ] 猎户座分析引擎初始化',
    '[ OK ] 安全验证通过',
    '[ OK ] 连接情报数据库',
    '[ OK ] AI 推论层就绪',
    '[ RDY ] 系统就绪 · 欢迎，指挥官',
  ],
  'en': [
    '[ OK ] Core modules loaded',
    '[ OK ] Orion analysis engine initialized',
    '[ OK ] Security verification passed',
    '[ OK ] Connected to intelligence database',
    '[ OK ] AI inference layer ready',
    '[ RDY ] System ready · Welcome, Commander',
  ],
  'zh-TW': [
    '[ OK ] 核心模組載入完成',
    '[ OK ] 獵戶座分析引擎初始化',
    '[ OK ] 安全驗證通過',
    '[ OK ] 連接情報資料庫',
    '[ OK ] AI 推論層就緒',
    '[ RDY ] 系統就緒 · 歡迎，指揮官',
  ],
};

const sidebarLabels = {
  'zh-TW': { diagnose: '立即診斷', warRoom: 'War Room', history: '歷史案件', services: '服務介紹', contact: '聯絡我們' },
  'zh-CN': { diagnose: '立即诊断', warRoom: 'War Room', history: '历史案件', services: '服务介绍', contact: '联系我们' },
  'en': { diagnose: 'Start Diagnosis', warRoom: 'War Room', history: 'Case History', services: 'Services', contact: 'Contact Us' },
};

const btnLabels = {
  'zh-TW': '立即診斷',
  'zh-CN': '立即诊断',
  'en': 'Start Diagnosis',
};

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { language } = useLanguage();
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messages = bootMessages[language as keyof typeof bootMessages] || bootMessages['zh-TW'];
  const labels = sidebarLabels[language as keyof typeof sidebarLabels] || sidebarLabels['zh-TW'];
  const btnLabel = btnLabels[language as keyof typeof btnLabels] || btnLabels['zh-TW'];

  useEffect(() => {
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        setDisplayedMessages(prev => [...prev, messages[messageIndex]]);
        messageIndex++;
      } else {
        clearInterval(messageInterval);
      }
    }, 380);

    let progressValue = 0;
    const progressInterval = setInterval(() => {
      progressValue += Math.random() * 30;
      if (progressValue > 100) {
        progressValue = 100;
        clearInterval(progressInterval);
        setTimeout(() => setShowButton(true), 500);
      }
      setProgress(progressValue);
    }, 100);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [messages]);

  const handleDiagnose = () => {
    window.location.href = 'https://orion-hub.zeabur.app';
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="fixed inset-0 bg-[#0a0d14] overflow-hidden flex items-center justify-center orion-grid-bg">
      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
          animation: 'scanDown 3s linear infinite',
        }}
      />

      {/* Top bar: hamburger left, language switcher right */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        {/* Hamburger menu */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex flex-col gap-[5px] p-3 rounded-lg border cursor-pointer"
          style={{
            background: 'rgba(10,13,20,0.8)',
            borderColor: 'rgba(201,168,76,0.3)',
            backdropFilter: 'blur(8px)',
          }}
          aria-label="選單"
        >
          <span className="block w-5 h-[2px] rounded" style={{ background: '#c9a84c' }} />
          <span className="block w-5 h-[2px] rounded" style={{ background: '#c9a84c' }} />
          <span className="block w-5 h-[2px] rounded" style={{ background: '#c9a84c' }} />
        </button>

        {/* Back button + Language switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-lg border cursor-pointer"
            style={{
              background: 'rgba(10,13,20,0.8)',
              borderColor: 'rgba(201,168,76,0.3)',
              color: '#c9a84c',
              fontSize: 18,
            }}
            aria-label="返回"
          >
            ←
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-[89]"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className="fixed top-0 left-0 h-full z-[90] flex flex-col"
            style={{
              width: 260,
              background: '#0d1120',
              borderRight: '1px solid rgba(201,168,76,0.2)',
            }}
          >
            <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#c9a84c', letterSpacing: '0.1em' }}>ORION</span>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', color: '#7a8499', fontSize: 24, cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>
            <nav className="flex flex-col py-3">
              {[
                { icon: '⚡', label: labels.diagnose, action: handleDiagnose },
                { icon: '⬡', label: labels.warRoom, action: onComplete },
                { icon: '◈', label: labels.history, action: () => { window.location.href = '/projects'; } },
                { icon: '⚙', label: labels.services, action: () => {} },
                { icon: '✉', label: labels.contact, action: () => {} },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => { setSidebarOpen(false); item.action(); }}
                  className="flex items-center gap-3 text-left"
                  style={{
                    padding: '14px 20px',
                    background: 'none',
                    border: 'none',
                    color: '#c9cdd6',
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: 16, color: '#c9a84c', width: 24, textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </>
      )}

      {/* Main content */}
      <div className="relative z-10 text-center w-full max-w-2xl px-4">
        {/* Enlarged constellation icon — fills top area */}
        <div className="relative mb-8 flex justify-center">
          <div
            className="absolute"
            style={{
              width: 280,
              height: 280,
              borderImage: 'linear-gradient(45deg, #c9a84c, #e8c96a) 1',
              border: '2px solid',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animation: 'hexSpin 20s linear infinite',
            }}
          />

          <svg
            viewBox="0 0 200 200"
            className="relative z-20"
            style={{
              width: 220,
              height: 220,
              filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.5))',
            }}
          >
            <g stroke="#c9a84c" strokeWidth="1" opacity="0.6">
              <line x1="100" y1="40" x2="70" y2="80" />
              <line x1="100" y1="40" x2="130" y2="80" />
              <line x1="70" y1="80" x2="100" y2="120" />
              <line x1="130" y1="80" x2="100" y2="120" />
              <line x1="70" y1="80" x2="60" y2="140" />
              <line x1="130" y1="80" x2="140" y2="140" />
            </g>

            <g fill="#c9a84c">
              <circle cx="85" cy="50" r="6" />
              <circle cx="115" cy="50" r="6" />
              <path d="M 100 30 L 120 45 L 115 65 L 100 70 L 85 65 L 80 45 Z" fill="none" stroke="#c9a84c" strokeWidth="1.5" />
            </g>

            <g fill="#e8c96a">
              <circle cx="100" cy="20" r="2" />
              <circle cx="75" cy="35" r="1.5" />
              <circle cx="125" cy="35" r="1.5" />
            </g>
          </svg>

          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
              animation: 'glowBreath 3s ease-in-out infinite',
            }}
          />
        </div>

        <h1 className="orion-title mb-2" style={{ letterSpacing: '0.06em' }}>獵戶智鑑</h1>
        <p className="orion-subtitle mb-6">ORION AI INTELLIGENCE SYSTEM · STRATEGY & DOMINANCE</p>

        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mb-6" />

        {/* SYSTEM BOOT LOG — enlarged text */}
        <div
          className="rounded p-6 mb-6 font-mono text-left min-h-[180px]"
          style={{
            background: '#0d1120',
            border: '1px solid rgba(201,168,76,0.28)',
          }}
        >
          {displayedMessages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                color: '#c9a84c',
                fontSize: '1rem',
                lineHeight: 1.8,
                fontWeight: 500,
                animation: `bootFade 0.3s ease-out ${idx * 0.1}s both`,
              }}
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1 rounded overflow-hidden" style={{ background: '#1a2235', border: '1px solid rgba(201,168,76,0.28)' }}>
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #c9a84c, #e8c96a)',
                transition: 'width 0.1s ease',
              }}
            />
          </div>
          <p className="text-xs mt-2 font-mono" style={{ color: '#7a8499' }}>{Math.round(progress)}%</p>
        </div>

        {/* CTA Button — 立即診斷 → orion-hub */}
        {showButton && (
          <button
            onClick={handleDiagnose}
            className="orion-btn-fill animate-fadeUp"
            style={{
              animation: 'fadeUp 0.5s ease-out',
              fontSize: 16,
              padding: '14px 48px',
            }}
          >
            {btnLabel}
          </button>
        )}
      </div>
    </div>
  );
}
