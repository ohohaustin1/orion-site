import React, { useState } from 'react';
import { TrendingUp, Filter, Crosshair, Zap, ChevronRight } from 'lucide-react';
import { allCases, industryColors } from '../data/cases';

const DIAG_URL = 'https://orion-hub.zeabur.app';
const industries = ['全部', ...Array.from(new Set(allCases.map(c => c.industry)))];

export default function CasesPage() {
  const [filter, setFilter] = useState('全部');

  const filtered = filter === '全部' ? allCases : allCases.filter(c => c.industry === filter);

  return (
    <div className="orion-page">
      <div className="orion-page-header">
        <h1>實戰戰報資料庫</h1>
        <p>跨 {new Set(allCases.map(c => c.industry)).size} 個產業、{allCases.length} 個 AI 導入實戰報告 — 每一筆數字都來自真實交付</p>
      </div>

      <div className="orion-filter-bar">
        <Filter size={16} style={{ color: 'var(--orion-gold)' }} />
        {industries.map(ind => (
          <button
            key={ind}
            className={`orion-filter-chip ${filter === ind ? 'active' : ''}`}
            onClick={() => setFilter(ind)}
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="orion-cases-grid full">
        {filtered.map((c, i) => (
          <div
            key={c.id}
            className="orion-case-card"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="case-tag" style={{ background: industryColors[c.industry] || '#c9a84c' }}>
              {c.industry}
            </div>
            <h3 className="case-company">{c.company}</h3>

            {/* 原始挑戰 */}
            <div className="case-row">
              <span className="case-label" style={{
                background: 'rgba(231,76,60,0.15)',
                color: '#e74c3c',
              }}>
                <Crosshair size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                原始挑戰
              </span>
              <p>{c.challenge}</p>
            </div>

            {/* 獵戶座策略 */}
            <div className="case-row">
              <span className="case-label solution" style={{
                background: 'rgba(201,168,76,0.15)',
                color: 'var(--orion-gold)',
              }}>
                <Zap size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                獵戶座策略
              </span>
              <p>{c.strategy}</p>
            </div>

            {/* 具體成果 */}
            <div className="case-results">
              <TrendingUp size={14} />
              <p>{c.results}</p>
            </div>
            <div className="case-duration">{c.duration}</div>

            {/* Per-case CTA */}
            <a
              href={DIAG_URL}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 14,
                padding: '10px 16px',
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 8,
                color: 'var(--orion-gold)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.15)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--orion-gold)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.2)';
              }}
            >
              想了解您的專屬策略？→ 立即啟動診斷
              <ChevronRight size={14} />
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--orion-text-secondary)' }}>
          目前此產業尚無案例
        </div>
      )}
    </div>
  );
}
