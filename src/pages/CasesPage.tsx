import React, { useState, useEffect } from 'react';
import { TrendingUp, Filter, Crosshair, Zap, ChevronRight, AlertTriangle, Brain, Target, DollarSign } from 'lucide-react';
import { allCases, industryColors } from '../data/cases';
import { setSEO } from '../lib/seo';

const DIAG_URL = 'https://orion-hub.zeabur.app';
const industries = ['全部', ...Array.from(new Set(allCases.map(c => c.industry)))];

export default function CasesPage() {
  const [filter, setFilter] = useState('全部');

  useEffect(() => {
    setSEO({
      title: '實戰戰報資料庫 | Orion 獵戶座智鑑',
      description: '20個真實企業 AI 導入案例，成交率提升、成本降低的量化成果。',
    });
  }, []);

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

            {/* 【原始問題】 */}
            <div className="case-row">
              <span className="case-label" style={{
                background: 'rgba(231,76,60,0.15)',
                color: '#e74c3c',
              }}>
                <Crosshair size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                原始問題
              </span>
              <p>{c.problem}</p>
            </div>

            {/* 【錯誤決策】 */}
            <div className="case-row">
              <span className="case-label" style={{
                background: 'rgba(255,152,0,0.15)',
                color: '#ff9800',
              }}>
                <AlertTriangle size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                錯誤決策
              </span>
              <p>{c.wrongMove}</p>
            </div>

            {/* 【AI 拆解】 */}
            <div className="case-row">
              <span className="case-label" style={{
                background: 'rgba(33,150,243,0.15)',
                color: '#2196f3',
              }}>
                <Brain size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                AI 拆解
              </span>
              <p>{c.aiInsight}</p>
            </div>

            {/* 【執行策略】 */}
            <div className="case-row">
              <span className="case-label solution" style={{
                background: 'rgba(201,168,76,0.15)',
                color: 'var(--orion-gold)',
              }}>
                <Target size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                執行策略
              </span>
              <p>{c.strategy}</p>
            </div>

            {/* 【結果（含金額）】 */}
            <div className="case-results">
              <DollarSign size={14} />
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
