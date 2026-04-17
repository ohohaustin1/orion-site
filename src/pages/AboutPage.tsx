import React, { useState, useEffect } from 'react';
import { Cpu, Workflow, Cloud, Zap, ArrowRight, Users, MessageSquare, Video, FileText, ShoppingCart, UserCheck, Server, BarChart3, Lightbulb, Clock, Target, CheckCircle2, Shield } from 'lucide-react';
import { setSEO } from '../lib/seo';

const DIAG_URL = 'https://orion-hub.zeabur.app';

const capabilities = [
  {
    icon: Cpu,
    label: 'AI 需求診斷系統',
    price: 'NT$30,000 起',
    audience: '想導入 AI 但不知從何開始的企業主',
    timeline: '1–2 週',
    outcome: '精準定位 3 大核心痛點，產出可執行的 AI 導入路線圖',
    desc: '5 分鐘精準定位企業痛點，生成專屬分析報告',
  },
  {
    icon: MessageSquare,
    label: '智能客服自動化',
    price: 'NT$50,000 起',
    audience: '客服量大、重複問題多、回覆速度慢的企業',
    timeline: '2–3 週',
    outcome: '客服成本降低 40%+，回覆時間從小時級縮短至秒級',
    desc: '7×24 全天候 AI 客服，處理 80% 常見問題',
  },
  {
    icon: Video,
    label: '影片內容自動生成',
    price: 'NT$40,000 起',
    audience: '需要大量短影音行銷但人力有限的品牌',
    timeline: '2–3 週',
    outcome: '內容產能提升 10 倍，單支影片成本降低 70%',
    desc: 'AI 腳本撰寫 + 素材生成，產能提升 10 倍',
  },
  {
    icon: FileText,
    label: '帳務報表自動化',
    price: 'NT$35,000 起',
    audience: '每月花大量時間在對帳、報表的財務團隊',
    timeline: '1–2 週',
    outcome: '報表產出時間降低 80%，人工錯誤率趨近 0',
    desc: '自動生成財務報表、對帳、異常偵測',
  },
  {
    icon: ShoppingCart,
    label: '電商系統開發',
    price: 'NT$150,000 起',
    audience: '想建立自有電商平台、脫離平台抽成的品牌',
    timeline: '6–10 週',
    outcome: '轉換率提升 25%+，會員終生價值成長 2 倍',
    desc: '高轉換率電商平台，整合金流物流 CRM',
  },
  {
    icon: UserCheck,
    label: 'CRM 客戶管理系統',
    price: 'NT$80,000 起',
    audience: '客戶數據散落各處、跟進靠記憶的業務團隊',
    timeline: '3–5 週',
    outcome: '成交率提升 30%+，客戶流失率降低 40%',
    desc: '客戶分群、成交預測、自動化跟進流程',
  },
  {
    icon: Server,
    label: 'ERP 企業資源管理',
    price: 'NT$200,000 起',
    audience: '進銷存管理混亂、部門資訊斷層的中大型企業',
    timeline: '8–14 週',
    outcome: '庫存周轉率提升 35%，營運效率提升 50%+',
    desc: '進銷存、生產排程、供應鏈一站式管理',
  },
  {
    icon: Cloud,
    label: '雲端架構規劃（AWS/GCP）',
    price: 'NT$100,000 起',
    audience: '系統效能瓶頸、伺服器成本過高的技術團隊',
    timeline: '3–6 週',
    outcome: '基礎設施成本降低 40%，系統可用率達 99.9%',
    desc: '高可用、自動擴展、成本最佳化架構設計',
  },
  {
    icon: BarChart3,
    label: '數據分析儀表板',
    price: 'NT$60,000 起',
    audience: '決策靠直覺、數據散落在 Excel 的管理層',
    timeline: '2–4 週',
    outcome: '決策速度提升 5 倍，數據驅動取代經驗猜測',
    desc: '即時營運數據視覺化，AI 驅動決策建議',
  },
  {
    icon: Lightbulb,
    label: 'AI 導入全程顧問',
    price: 'NT$120,000 起',
    audience: '規模較大、需要全面 AI 轉型規劃的企業',
    timeline: '4–12 週',
    outcome: '從零到一完成 AI 轉型，ROI 平均 3–8 倍',
    desc: '從策略到落地，全程陪跑的 AI 轉型顧問',
  },
];

const team = [
  {
    name: 'Austin Hsu',
    title: '創辦人 / AI 架構師',
    specialties: 'AI 系統設計、商業模型、策略顧問',
    core: '把商業需求轉化為可執行的 AI 系統',
    initial: 'A',
    color: '#c9a84c',
  },
  {
    name: '魏宇霆 David',
    title: '首席技術長 / CTO',
    specialties: '電商系統、ERP/CRM、雲端架構（AWS/GCP）、區塊鏈應用、iOS/Android App',
    core: '處理邏輯複雜的系統與大型平台架構',
    initial: 'D',
    color: '#3498db',
  },
  {
    name: 'Kevin Lin',
    title: '資深後端工程師',
    specialties: '系統架構、API 設計、自動化流程',
    core: '8 年後端開發經驗，高併發系統專家',
    initial: 'K',
    color: '#2ecc71',
  },
  {
    name: 'Jason Wang',
    title: 'AI 工程師',
    specialties: 'LLM 應用、模型整合、智能客服',
    core: '6 年 AI/ML 經驗，專攻企業級 AI 落地',
    initial: 'J',
    color: '#e67e22',
  },
  {
    name: 'Eric Chen',
    title: '自動化專家',
    specialties: 'n8n、RPA、CRM 串接',
    core: '7 年流程優化經驗，企業自動化佈局師',
    initial: 'E',
    color: '#9b59b6',
  },
];

const steps = [
  {
    num: '01',
    icon: Target,
    title: '免費 AI 診斷（War Room）',
    desc: '智能問診系統，5 分鐘精準定位企業痛點，零成本零風險',
    detail: '透過 AI 深度對話，自動生成您的企業健檢報告',
  },
  {
    num: '02',
    icon: Workflow,
    title: '問題拆解與策略設計',
    desc: '專家團隊深入分析，設計落地可行的 AI 方案',
    detail: '明確 ROI、時程、資源需求，確認再動工',
  },
  {
    num: '03',
    icon: Cpu,
    title: '系統導入與測試',
    desc: '敏捷開發，最快 2 週見效',
    detail: '每週交付可測試版本，邊做邊優化',
  },
  {
    num: '04',
    icon: Shield,
    title: '優化與持續成長',
    desc: '30 天優化保證，數據驅動持續迭代',
    detail: '效果未達標？免費持續優化到滿意',
  },
];

export default function AboutPage() {
  const [visible, setVisible] = useState(false);
  const [expandedService, setExpandedService] = useState<number | null>(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setSEO({
      title: '服務介紹 | Orion 獵戶座智鑑',
      description: 'AI 導入顧問、系統開發、自動化流程，先顧問後開發的高端服務。',
    });
  }, []);

  return (
    <div className="orion-page">
      {/* 反向篩選文案 */}
      <div style={{
        textAlign: 'center',
        padding: '48px 20px 12px',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s',
      }}>
        <div style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          fontWeight: 800,
          color: 'var(--orion-text-primary)',
          lineHeight: 1.8,
          letterSpacing: '0.04em',
        }}>
          Orion 不服務想試試看的人，
        </div>
        <div style={{
          fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
          fontWeight: 800,
          color: 'var(--orion-gold)',
          lineHeight: 1.8,
          letterSpacing: '0.04em',
        }}>
          我們只服務要結果的人。
        </div>
        <div style={{
          fontSize: 'clamp(0.82rem, 2vw, 0.95rem)',
          fontWeight: 600,
          color: '#e74c3c',
          lineHeight: 1.8,
          marginTop: 8,
        }}>
          如果您沒有決策權，這套系統不適合您。
        </div>
        <div style={{
          width: 60,
          height: 2,
          background: 'linear-gradient(90deg, transparent, var(--orion-gold), transparent)',
          margin: '20px auto 0',
        }} />
      </div>

      <div className="orion-page-header" style={{ marginBottom: 32, paddingTop: 16 }}>
        <h1>Orion AI Group 獵戶座智囊</h1>
        <p>企業 AI 導入顧問 + 高端系統開發商</p>
        <span className="orion-page-tag">先顧問、後開發</span>
      </div>

      {/* 10 項服務（含定價、適合對象、導入時間、預期成效） */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.1s' }}>
        <h2 className="about-section-title">服務介紹</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {capabilities.map((c, i) => {
            const Icon = c.icon;
            const isExpanded = expandedService === i;
            return (
              <div
                key={i}
                onClick={() => setExpandedService(isExpanded ? null : i)}
                style={{
                  background: isExpanded ? 'rgba(201,168,76,0.06)' : 'var(--orion-bg-raised)',
                  border: `1px solid ${isExpanded ? 'var(--orion-gold)' : 'rgba(201,168,76,0.12)'}`,
                  borderRadius: 12,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon size={22} style={{ color: 'var(--orion-gold)', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.label}</span>
                  </div>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--orion-gold)',
                    background: 'rgba(201,168,76,0.12)',
                    padding: '4px 12px',
                    borderRadius: 6,
                    whiteSpace: 'nowrap',
                  }}>
                    {c.price}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--orion-text-secondary)', marginTop: 6 }}>
                  {c.desc}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: '1px solid rgba(201,168,76,0.15)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Users size={14} style={{ color: 'var(--orion-gold)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--orion-text-tertiary)', fontWeight: 600, marginBottom: 2 }}>適合對象</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--orion-text-secondary)', lineHeight: 1.5 }}>{c.audience}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <Clock size={14} style={{ color: 'var(--orion-gold)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--orion-text-tertiary)', fontWeight: 600, marginBottom: 2 }}>導入時間</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--orion-text-secondary)', lineHeight: 1.5 }}>{c.timeline}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <CheckCircle2 size={14} style={{ color: 'var(--orion-gold)', marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--orion-text-tertiary)', fontWeight: 600, marginBottom: 2 }}>預期成效</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--orion-gold-pale, #f0d98a)', lineHeight: 1.5, fontWeight: 500 }}>{c.outcome}</div>
                      </div>
                    </div>
                  </div>
                )}
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
            <div key={i} className="orion-team-card">
              <div className="team-avatar" style={{
                background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                fontSize: '1.4rem',
                fontWeight: 900,
              }}>{m.initial}</div>
              <h3>{m.name}</h3>
              <div className="team-title">{m.title}</div>
              <div className="team-detail"><strong>專長：</strong>{m.specialties}</div>
              <div className="team-detail"><strong>核心：</strong>{m.core}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 服務流程 4 步驟（強化視覺） */}
      <section className="orion-about-section" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s 0.5s' }}>
        <h2 className="about-section-title">服務流程</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <div key={i} style={{
                background: 'var(--orion-bg-raised)',
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: 14,
                padding: '28px 20px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}>
                {/* Top gold accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, transparent, var(--orion-gold), transparent)',
                }} />

                {/* Step number + icon */}
                <div style={{
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: 'var(--orion-gold)',
                  opacity: 0.2,
                  marginBottom: 4,
                }}>
                  {s.num}
                </div>
                <StepIcon size={28} style={{ color: 'var(--orion-gold)', marginBottom: 12 }} />

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--orion-text-primary)', marginBottom: 8 }}>
                  {s.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--orion-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  {s.desc}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--orion-gold-dim, #8a6f2e)', fontWeight: 500 }}>
                  {s.detail}
                </p>

                {/* Arrow connector (not on last) */}
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    right: -14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--orion-gold)',
                    fontSize: 18,
                    zIndex: 2,
                    display: 'none', // hidden on mobile
                  }} className="step-connector">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="orion-bottom-cta">
        <h2>準備好讓 AI 幫你工作了嗎？</h2>
        <p>3 分鐘說出你的想法，我們告訴你怎麼做</p>
        <a
          href={DIAG_URL}
          className="orion-btn-fill large magnetic-link gold-sweep"
          style={{ textDecoration: 'none' }}
        >
          <Zap size={18} />
          <span>立即開始診斷 →</span>
        </a>
      </section>
    </div>
  );
}
