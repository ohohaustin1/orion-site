import React, { useState } from 'react';
import { BookOpen, Zap, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, ArrowRight } from 'lucide-react';

const DIAG_URL = 'https://orion-hub.zeabur.app';

const articles = [
  {
    title: '為什麼你的成交漏斗正在失血？',
    desc: '90% 企業的成交漏斗存在 3 個以上致命漏洞，而他們完全不知道自己每天在燒多少錢。本文揭露最常見的漏斗病灶，以及 AI 如何在 2 週內止血。',
    type: '深度分析',
  },
  {
    title: 'AI 導入失敗的 3 個真實病灶',
    desc: '你以為買了 AI 工具就等於數位轉型？錯。我們拆解了 47 個失敗案例，歸納出導入失敗的 3 個致命原因——而這些錯誤，你現在可能正在犯。',
    type: '案例拆解',
  },
  {
    title: '你越努力營銷越虧的真正原因',
    desc: '廣告費越投越多、轉換率越來越低？問題不在行銷，在你的客戶篩選系統根本不存在。AI 成交引擎如何讓你「少做」卻「多賺」。',
    type: '策略洞察',
  },
  {
    title: '90% 的策略從一開始就錯了',
    desc: '你的商業策略是基於數據還是直覺？我們分析了 200+ 家企業的決策流程，發現 9 成的策略起點就已經偏離。AI 診斷如何幫你從根源修正。',
    type: '數據報告',
  },
];

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

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="orion-page">
      <div className="orion-page-header">
        <h1>資源中心</h1>
        <p>你不知道的真相，正在讓你的企業慢性失血</p>
      </div>

      {/* 文章列表 — 焦慮標題 + CTA */}
      <section className="orion-resource-section">
        <h2 className="resource-section-title">
          <AlertTriangle size={20} style={{ color: '#e74c3c' }} /> 策略洞察
        </h2>
        <div className="orion-resource-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {articles.map((a, i) => (
            <div
              key={i}
              className="orion-resource-card"
              style={{
                background: 'var(--orion-bg-raised)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 12,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
            >
              <div style={{
                display: 'inline-block',
                padding: '3px 10px',
                background: 'rgba(231,76,60,0.12)',
                color: '#e74c3c',
                borderRadius: 4,
                fontSize: '0.68rem',
                fontWeight: 700,
                marginBottom: 12,
                alignSelf: 'flex-start',
              }}>
                {a.type}
              </div>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--orion-text-primary)',
                marginBottom: 10,
                lineHeight: 1.5,
              }}>
                {a.title}
              </h3>
              <p style={{
                fontSize: '0.82rem',
                color: 'var(--orion-text-secondary)',
                lineHeight: 1.7,
                flex: 1,
                marginBottom: 16,
              }}>
                {a.desc}
              </p>

              {/* 每篇文章底部 CTA */}
              <a
                href={DIAG_URL}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 14px',
                  background: 'rgba(201,168,76,0.08)',
                  border: '1px solid rgba(201,168,76,0.2)',
                  borderRadius: 8,
                  color: 'var(--orion-gold)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
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
                立即啟動 AI 診斷，檢測你的策略漏洞
                <ArrowRight size={14} />
              </a>
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
        <h2>你的企業正在流失多少潛在收入？</h2>
        <p>3 分鐘 AI 診斷，揪出隱藏的策略漏洞</p>
        <a
          href={DIAG_URL}
          className="orion-btn-fill large magnetic-link gold-sweep"
          style={{ textDecoration: 'none' }}
        >
          <Zap size={18} />
          <span>立即啟動 AI 商業診斷</span>
        </a>
      </section>
    </div>
  );
}
