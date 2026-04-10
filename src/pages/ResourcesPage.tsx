import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Zap, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const faqs = [
  {
    q: '導入 AI 需要多少預算？',
    a: '視規模而定，最小方案從 NT$30,000 起。我們會在 AI 診斷後提供精確報價，確保每分錢都花在刀口上。',
  },
  {
    q: '導入需要多久時間？',
    a: '最快 2 週可見效，完整系統 4-8 週。我們採用敏捷開發，每週都有可見進度。',
  },
  {
    q: '我的行業適合嗎？',
    a: '只要有重複性工作或客戶互動，就適合。我們已成功導入房仲、電商、製造、餐飲、顧問、醫療、法律等 14+ 個產業。',
  },
  {
    q: '需要有技術背景嗎？',
    a: '不需要，我們提供全程顧問服務。從需求分析到系統上線，您只需要告訴我們問題，我們負責解決。',
  },
  {
    q: '效果沒達到怎麼辦？',
    a: '我們提供 30 天優化保證。如果在保證期內未達預期效果，我們免費持續優化直到達標。',
  },
];

const resources = [
  {
    title: 'AI 導入完整指南',
    desc: '從零開始，手把手教你如何為企業導入 AI',
    type: '文章',
    link: '#',
  },
  {
    title: '企業 AI 健檢工具',
    desc: '免費使用 War Room 智能診斷系統',
    type: '工具',
    link: '/war-room',
    internal: true,
  },
];

export default function ResourcesPage() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="orion-page">
      <div className="orion-page-header">
        <h1>資源中心</h1>
        <p>幫助您做出最佳 AI 導入決策</p>
      </div>

      {/* 資源連結 */}
      <section className="orion-resource-section">
        <h2 className="resource-section-title"><BookOpen size={20} /> 學習資源</h2>
        <div className="orion-resource-cards">
          {resources.map((r, i) => (
            <div
              key={i}
              className="orion-resource-card"
              onClick={() => r.internal ? setLocation(r.link) : null}
              style={{ cursor: 'pointer' }}
            >
              <div className="resource-type">{r.type}</div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
              <span className="resource-link">
                {r.internal ? '前往使用' : '閱讀全文'} <ExternalLink size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="orion-resource-section">
        <h2 className="resource-section-title">常見問題 FAQ</h2>
        <div className="orion-faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`orion-faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>Q：{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === i && (
                <div className="faq-answer">
                  <p>A：{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="orion-bottom-cta">
        <h2>還有其他問題？</h2>
        <p>直接進入 War Room，讓 AI 為你診斷</p>
        <button className="orion-btn-fill large" onClick={() => setLocation('/war-room')}>
          <Zap size={18} />
          <span>免費 AI 診斷</span>
        </button>
      </section>
    </div>
  );
}
