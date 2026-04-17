import React from 'react';

const team = [
  {
    name: 'Austin Hsu',
    title: '創辦人 / AI 架構師',
    specialties: 'AI 系統設計、商業模型、策略顧問',
    core: '把商業需求轉化為可執行的 AI 系統',
    initial: 'A',
    isFounder: true,
  },
  {
    name: '魏宇霆 David',
    title: '首席技術長 / CTO',
    specialties: '電商系統、ERP/CRM、雲端架構（AWS/GCP）、區塊鏈應用、iOS/Android App',
    core: '處理邏輯複雜的系統與大型平台架構',
    initial: 'D',
    isFounder: false,
  },
  {
    name: 'Kevin Lin',
    title: '資深後端工程師',
    specialties: '系統架構、API 設計、自動化流程',
    core: '8 年後端開發經驗，高併發系統專家',
    initial: 'K',
    isFounder: false,
  },
  {
    name: 'Jason Wang',
    title: 'AI 工程師',
    specialties: 'LLM 應用、模型整合、智能客服',
    core: '6 年 AI/ML 經驗，專攻企業級 AI 落地',
    initial: 'J',
    isFounder: false,
  },
  {
    name: 'Eric Chen',
    title: '自動化專家',
    specialties: 'n8n、RPA、CRM 串接',
    core: '7 年流程優化經驗，企業自動化佈局師',
    initial: 'E',
    isFounder: false,
  },
];

export default function TeamPage() {
  return (
    <div className="orion-page" style={{ padding: '40px 24px', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{
        fontSize: 32,
        fontWeight: 900,
        textAlign: 'center',
        marginBottom: 8,
        background: 'linear-gradient(135deg, #FFFFFF 0%, #D4AF37 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        核心團隊
      </h1>
      <p style={{ textAlign: 'center', color: '#A0A0A0', marginBottom: 48, fontSize: 16 }}>
        每一位成員都是各領域的實戰專家
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
        {team.map((m) => (
          <div
            key={m.name}
            className={m.isFounder ? 'team-card team-card-founder' : 'team-card'}
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, rgba(0,0,0,0) 100%)',
              border: m.isFounder ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(212,175,55,0.15)',
              borderRadius: 16,
              padding: '32px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              transition: 'all 400ms cubic-bezier(0.4,0,0.2,1)',
              maxWidth: m.isFounder ? 600 : undefined,
              margin: m.isFounder ? '0 auto' : undefined,
            }}
          >
            <div style={{
              width: m.isFounder ? 96 : 72,
              height: m.isFounder ? 96 : 72,
              minWidth: m.isFounder ? 96 : 72,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: m.isFounder ? 36 : 28,
              fontWeight: 700,
              color: '#000',
              background: 'linear-gradient(135deg, #D4AF37 0%, #F4D970 50%, #D4AF37 100%)',
              boxShadow: m.isFounder
                ? '0 0 30px rgba(212,175,55,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'
                : '0 0 20px rgba(212,175,55,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '2px solid rgba(212,175,55,0.6)',
              fontFamily: "'Inter', sans-serif",
            }}>
              {m.initial}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: m.isFounder ? 20 : 16, marginBottom: 4 }}>
                {m.name}
              </div>
              <div style={{ color: '#D4AF37', fontSize: 14, marginBottom: 8 }}>
                {m.title}
              </div>
              <div style={{ color: '#A0A0A0', fontSize: 13, lineHeight: 1.5 }}>
                {m.specialties}
              </div>
              <div style={{ color: '#888', fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                {m.core}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
