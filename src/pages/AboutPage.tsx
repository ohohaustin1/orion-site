import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Cpu, Workflow, Database, Target, Code2, Cloud, Zap, ArrowRight, Users } from 'lucide-react';

const capabilities = [
  { icon: Cpu, label: 'AI 商業架構設計' },
  { icon: Workflow, label: '企業流程自動化' },
  { icon: Database, label: '數據決策系統' },
  { icon: Target, label: '成交轉化優化' },
  { icon: Code2, label: '高複雜度系統開發' },
  { icon: Cloud, label: '雲端架構規劃' },
];

const team = [
  {
    name: 'Austin Hsu',
    title: '創辦人 / AI 架構師',
    specialties: 'AI 系統設計、商業模型、策略顧問',
    core: '把商業需求轉化為可執行的 AI 系統',
    simulated: false,
  },
  {
    name: '魏宇霆 David',
    title: '首席技術長 / CTO',
    specialties: '電商系統、ERP/CRM、雲端架構（AWS/GCP）、區塊鏈應用、iOS/Android App',
    core: '處理邏輯複雜的系統與大型平台架構',
    experience: '政府標案、跨國電商、企業數位轉型',
    simulated: false,
  },
  {
    name: 'Kevin Lin',
    title: '資深後端工程師',
    specialties: '系統架構、API 設計、自動化流程',
    core: '8 年後端開發經驗',
    simulated: true,
  },
  {
    name: 'Jason Wang',
    title: 'AI 工程師',
    specialties: 'LLM 應用、模型整合、智能客服',
    core: '6 年 AI/ML 經驗',
    simulated: true,
  },
  {
    name: 'Eric Chen',
    title: '自動化專家',
    specialties: 'n8n、RPA、CRM 串接',
    core: '7 年流程優化經驗',
    simulated: true,
  },
];

const partners = [
  'ABC Realty Group',
  'NextGen E-commerce',
  'SmartOps Manufacturing',
  'Future Consulting Co.',
  '政府數位轉型專案',
];

const steps = [
  { num: '01', title: '免費 AI 診斷（War Room）', desc: '智能問診系統，5 分鐘精準定位企業痛點' },
  { num: '02', title: '問題拆解與策略設計', desc: '專家團隊深入分析，設計落地可行的 AI 方案' },
  { num: '03', title: '系統導入與測試', desc: '敏捷開發，最快 2 週見效' },
  { num: '04', title: '優化與持續成長', desc: '30 天優化保證，數據驅動持續迭代' },
];

export default function AboutPage() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div className="orion-page">
      <div className="orion-page-header">
        <h1>Orion AI Group 獵戶座智囊</h1>
        <p>企業 AI 導入顧問 + 高端系統開發商</p>
        <span className="orion-page-tag">先顧問、後開發</span>
      </div>

      {/* 核心能力 */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.1s' }}>
        <h2 className="about-section-title">核心能力</h2>
        <div className="orion-capabilities-grid">
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="orion-capability-card">
                <Icon size={28} style={{ color: 'var(--orion-gold)' }} />
                <span>{c.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 核心團隊 */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.3s' }}>
        <h2 className="about-section-title"><Users size={20} /> 核心團隊</h2>
        <div className="orion-team-grid">
          {team.map((m, i) => (
            <div key={i} className={`orion-team-card ${m.simulated ? 'simulated' : ''}`}>
              <div className="team-avatar">{m.name.charAt(0)}</div>
              <h3>{m.name}</h3>
              <div className="team-title">{m.title}</div>
              <div className="team-detail"><strong>專長：</strong>{m.specialties}</div>
              <div className="team-detail"><strong>核心：</strong>{m.core}</div>
              {m.experience && <div className="team-detail"><strong>經驗：</strong>{m.experience}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* 服務流程 */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.5s' }}>
        <h2 className="about-section-title">服務流程</h2>
        <div className="orion-steps">
          {steps.map((s, i) => (
            <div key={i} className="orion-step">
              <div className="step-number">{s.num}</div>
              <div className="step-content">
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight size={20} className="step-arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* 合作企業 */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.7s' }}>
        <h2 className="about-section-title">合作企業</h2>
        <div className="orion-partners">
          {partners.map((p, i) => (
            <div key={i} className="orion-partner-logo">
              <span>{p}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="orion-bottom-cta">
        <button className="orion-btn-fill large" onClick={() => setLocation('/war-room')}>
          <Zap size={18} />
          <span>開始免費 AI 診斷</span>
        </button>
      </section>
    </div>
  );
}
