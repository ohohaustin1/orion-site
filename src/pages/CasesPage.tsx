import React, { useState } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { allCases, industryColors } from '../data/cases';

const industries = ['全部', ...Array.from(new Set(allCases.map(c => c.industry)))];

export default function CasesPage() {
  const [filter, setFilter] = useState('全部');

  const filtered = filter === '全部' ? allCases : allCases.filter(c => c.industry === filter);

  return (
    <div className="orion-page">
      <div className="orion-page-header">
        <h1>成功案例資料庫</h1>
        <p>跨 {new Set(allCases.map(c => c.industry)).size} 個產業、{allCases.length} 個 AI 導入實戰案例</p>
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
            <div className="case-row">
              <span className="case-label">問題</span>
              <p>{c.problem}</p>
            </div>
            <div className="case-row">
              <span className="case-label solution">解法</span>
              <p>{c.solution}</p>
            </div>
            <div className="case-results">
              <TrendingUp size={14} />
              <p>{c.results}</p>
            </div>
            <div className="case-duration">{c.duration}</div>
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
