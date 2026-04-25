import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import PageSEO from '../components/PageSEO';

const industryData = [
  { industry: '房仲業', before: '成交率 8-12%', after: '成交率 18-28%', improvement: '+120%', color: '#e74c3c' },
  { industry: '電商業', before: '客服回覆 6-12 小時', after: '客服回覆 3-5 分鐘', improvement: '-95%', color: '#3498db' },
  { industry: '製造業', before: '報價週期 2-5 天', after: '報價週期 1-3 小時', improvement: '-90%', color: '#e67e22' },
  { industry: '餐飲業', before: '毛利可視化 0%', after: '即時毛利監控 100%', improvement: '決策 +10倍', color: '#2ecc71' },
];

export default function InsightsPage() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="orion-page">
      <PageSEO
        title="數據洞察 | Orion 獵戶座智鑑"
        description="數據不說謊 — AI 導入前後的真實差距：成交率、客服回覆、報價週期、毛利可視化跨產業量化對比。"
        url="/insights"
      />
      <div className="orion-page-header">
        <h1>數據洞察</h1>
        <p>數據不說謊，AI 導入前後的真實差距</p>
        <span className="orion-page-tag">這不是廣告，這是市場數據</span>
      </div>

      {/* 市場趨勢 */}
      <section className="orion-insight-section" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.1s' }}>
        <h2 className="insight-section-title">市場趨勢</h2>
        <div className="orion-trend-cards">
          <div className="orion-trend-card up">
            <div className="trend-value">+23%</div>
            <div className="trend-bar" style={{ width: '85%' }} />
            <div className="trend-label">導入 AI 的企業<br />年均營收成長率</div>
          </div>
          <div className="orion-trend-card neutral">
            <div className="trend-value">+4%</div>
            <div className="trend-bar" style={{ width: '20%' }} />
            <div className="trend-label">未導入 AI 的企業<br />年均營收成長率</div>
          </div>
          <div className="orion-trend-card alert">
            <div className="trend-icon"><AlertTriangle size={24} /></div>
            <div className="trend-value">僅 12%</div>
            <div className="trend-label">台灣中小企業 AI 導入率</div>
            <div className="trend-sub">代表 88% 還在等</div>
          </div>
        </div>
      </section>

      {/* 產業效率對比 */}
      <section className="orion-insight-section" style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s 0.3s' }}>
        <h2 className="insight-section-title">產業效率對比表</h2>
        <div className="orion-compare-grid">
          {industryData.map(d => (
            <div key={d.industry} className="orion-compare-card">
              <div className="compare-industry" style={{ borderLeftColor: d.color }}>{d.industry}</div>
              <div className="compare-row before">
                <span className="compare-badge before">未導入</span>
                <span>{d.before}</span>
              </div>
              <div className="compare-row after">
                <span className="compare-badge after">導入後</span>
                <span>{d.after}</span>
              </div>
              <div className="compare-improvement" style={{ color: d.color }}>
                <TrendingUp size={16} />
                改善幅度：{d.improvement}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 結語 */}
      <section className="orion-insight-conclusion" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s 0.5s' }}>
        <blockquote>
          「現在不導入 AI 的企業，<br />3 年後將面臨的不是競爭，而是淘汰。」
        </blockquote>
        <button className="orion-btn-fill large" onClick={() => setLocation('/war-room')}>
          <Zap size={18} />
          <span>立即啟動 AI 診斷</span>
        </button>
      </section>
    </div>
  );
}
