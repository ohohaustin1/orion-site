import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const bootMessages = {
  'zh-CN': [
    '[ OK ] 核心模組載入完成',
    '[ OK ] 獵戶座分析引擎初始化',
    '[ OK ] 安全驗證通過',
    '[ OK ] 連接情報資料庫',
    '[ OK ] AI 推論層就緒',
    '[ RDY ] 系統就緒 · 歡迎，指揮官',
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

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { language } = useLanguage();
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const messages = bootMessages[language as keyof typeof bootMessages];

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

  return (
    <div className="fixed inset-0 bg-[#0a0d14] overflow-hidden flex items-center justify-center orion-grid-bg">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.03) 50%, transparent 100%)',
          animation: 'scanDown 3s linear infinite',
        }}
      />

      <div className="relative z-10 text-center max-w-2xl">
        <div className="relative mb-12 flex justify-center">
          <div
            className="absolute w-64 h-64 border-2"
            style={{
              borderImage: 'linear-gradient(45deg, #c9a84c, #e8c96a) 1',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              animation: 'hexSpin 20s linear infinite',
            }}
          />

          <svg
            viewBox="0 0 200 200"
            className="relative z-20 w-48 h-48"
            style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))' }}
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

        <h1 className="orion-title mb-2">獵戶智鑒</h1>
        <p className="orion-subtitle mb-8">ORION AI INTELLIGENCE SYSTEM · STRATEGY & DOMINANCE</p>

        <div className="h-px bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent mb-8" />

        <div className="bg-[#0d1120] border border-[rgba(201,168,76,0.28)] rounded p-6 mb-8 font-mono text-sm text-left min-h-[180px]">
          {displayedMessages.map((msg, idx) => (
            <div
              key={idx}
              className="text-[#c9a84c] mb-1"
              style={{
                animation: `bootFade 0.3s ease-out ${idx * 0.1}s both`,
              }}
            >
              {msg}
            </div>
          ))}
        </div>

        <div className="mb-8">
          <div className="h-1 bg-[#1a2235] rounded overflow-hidden border border-[rgba(201,168,76,0.28)]">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c96a]"
              style={{ width: `${progress}%`, transition: 'width 0.1s ease' }}
            />
          </div>
          <p className="text-[#7a8499] text-xs mt-2 font-mono">{Math.round(progress)}%</p>
        </div>

        {showButton && (
          <button
            onClick={onComplete}
            className="orion-btn-fill animate-fadeUp"
            style={{
              animation: 'fadeUp 0.5s ease-out',
            }}
          >
            ENTER SYSTEM
          </button>
        )}
      </div>
    </div>
  );
}
