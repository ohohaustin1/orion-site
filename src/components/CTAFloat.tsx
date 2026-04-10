import React from 'react';
import { Zap } from 'lucide-react';

const DIAG_URL = 'https://orion-hub.zeabur.app';

export default function CTAFloat() {
  return (
    <a
      href={DIAG_URL}
      className="orion-fixed-cta magnetic-link gold-sweep"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #c9a84c, #e8c96a)',
        color: '#0a0d14',
        borderRadius: 50,
        fontSize: '0.88rem',
        fontWeight: 700,
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(201,168,76,0.4), 0 0 40px rgba(201,168,76,0.15)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        letterSpacing: '0.03em',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(201,168,76,0.5), 0 0 60px rgba(201,168,76,0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(201,168,76,0.4), 0 0 40px rgba(201,168,76,0.15)';
      }}
    >
      <Zap size={16} />
      立即啟動 AI 診斷
    </a>
  );
}
