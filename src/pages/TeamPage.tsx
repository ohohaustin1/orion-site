import React from 'react';
import PageSEO from '../components/PageSEO';

interface Member {
  name: string;
  title: string;
  specialties: string;
  intro: string;
  experience: string;
  photo: string; // filename inside public/team/
}

const team: Member[] = [
  {
    name: 'Austin 許燿宸',
    title: 'Chairman・創辦人',
    specialties: '商業策略、AI 系統決策、企業顧問',
    intro: '跨境生意出身，把商業直覺轉化成 AI 系統，相信每個老闆都值得一個永遠在線的顧問',
    experience: '10 年商業策略經驗，服務過 3 個國家市場',
    photo: 'AUSTIN.png',
  },
  {
    name: '魏宇霆 David',
    title: '首席技術長 CTO',
    specialties: '電商系統、ERP/CRM、AWS/GCP、區塊鏈、iOS/Android、資安',
    intro: '把複雜系統變成你看得懂的工具',
    experience: '8 年全棧架構經驗，主導過 50+ 企業系統建置',
    photo: '魏宇霆 David.png',
  },
  {
    name: '王艾倫 Aaron',
    title: '首席 AI 策略官',
    specialties: 'AI 落地、商業自動化、流程優化',
    intro: '專注把 AI 能力轉化為可落地的商業決策，不談理論只談結果',
    experience: '6 年企業顧問經驗，協助 30+ 中小企業導入 AI',
    photo: '王艾倫 Aaron.png',
  },
  {
    name: '陳建宏 Kevin',
    title: '首席 AI 架構師',
    specialties: '機器學習、決策自動化、n8n',
    intro: '讓機器學會思考商業邏輯，把你的決策流程自動化',
    experience: '5 年 AI 工程經驗，建置過 20+ 自動化系統',
    photo: '陳建宏 Kevin.png',
  },
  {
    name: '林佳穎 Iris',
    title: '客戶體驗總監',
    specialties: '用戶研究、對話設計、品牌體驗',
    intro: '相信好的系統應該讓客戶感覺被理解，而不是被處理',
    experience: '7 年 UX 設計經驗，服務過電商、金融、醫療產業',
    photo: '林佳穎 Iris.png',
  },
  {
    name: '張雅婷 Tina',
    title: '數據分析師',
    specialties: '數據建模、商業洞察、ROI 分析',
    intro: '從數字裡看出你看不到的錢，把直覺變成可驗證的策略',
    experience: '5 年數據分析經驗，幫助客戶平均提升 23% 轉化率',
    photo: '張雅婷 Tina.png',
  },
  {
    name: '吳明哲 Marcus',
    title: '系統整合工程師',
    specialties: 'API 整合、資料庫、全棧開發',
    intro: '讓所有工具說同一種語言，n8n、API、資料庫全部打通',
    experience: '6 年系統整合經驗，精通 10+ 主流平台串接',
    photo: '吳明哲 Marcus.png',
  },
];

const TEAM_CSS = `
.team-page {
  min-height: 100vh;
  padding: 96px 24px 80px;
  font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif;
  letter-spacing: 0.03em;
}
.team-header {
  max-width: 900px;
  margin: 0 auto 64px;
  text-align: center;
}
.team-header h1 {
  color: #C5A059;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.3;
  margin: 0 0 16px;
}
.team-header p {
  color: rgba(255,255,255,0.65);
  font-size: clamp(14px, 1.8vw, 17px);
  letter-spacing: 0.05em;
  line-height: 1.7;
  margin: 0;
}

.team-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
@media (max-width: 900px) {
  .team-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
}
@media (max-width: 600px) {
  .team-grid { grid-template-columns: 1fr; gap: 20px; }
  .team-page { padding: 56px 16px 64px; }
}

.team-card {
  position: relative;
  background: rgba(10,10,10,0.6);
  border: 1px solid rgba(197,160,89,0.25);
  border-radius: 0;                   /* 方角 */
  padding: 32px 24px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.35s ease, background 0.3s ease;
  overflow: hidden;
}
.team-card::before,
.team-card::after {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  border: 1px solid rgba(197,160,89,0.45);
  pointer-events: none;
  transition: border-color 0.3s ease;
}
.team-card::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.team-card::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

.team-card:hover {
  border-color: rgba(197,160,89,0.6);
  background: rgba(16,14,10,0.8);
  box-shadow:
    0 8px 32px rgba(197,160,89,0.22),
    0 0 0 1px rgba(197,160,89,0.18);
  transform: translateY(-2px);
}
.team-card:hover::before,
.team-card:hover::after { border-color: rgba(197,160,89,0.85); }

.team-avatar {
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  position: relative;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  background: linear-gradient(135deg, rgba(197,160,89,0.15) 0%, rgba(10,10,10,0.7) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 8px rgba(197,160,89,0.3));
  transition: filter 0.4s ease;
}
.team-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}
.team-card:hover .team-avatar {
  filter: drop-shadow(0 0 16px rgba(197,160,89,0.7)) drop-shadow(0 0 32px rgba(197,160,89,0.3));
}

.team-name {
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 6px;
}
.team-title {
  color: #C5A059;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.team-section {
  width: 100%;
  margin-top: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(197,160,89,0.12);
  text-align: left;
}
.team-section-label {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  color: rgba(197,160,89,0.55);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}
.team-specialties {
  color: rgba(255,255,255,0.78);
  font-size: 13px;
  line-height: 1.6;
  letter-spacing: 0.03em;
}
.team-intro {
  color: rgba(255,255,255,0.7);
  font-size: 13.5px;
  line-height: 1.7;
  letter-spacing: 0.03em;
  margin: 0;
}
.team-experience {
  color: rgba(255,255,255,0.55);
  font-size: 12.5px;
  line-height: 1.6;
  letter-spacing: 0.02em;
}
`;

export default function TeamPage() {
  return (
    <div className="team-page">
      <PageSEO
        title="核心團隊 | Orion 獵戶座智鑑"
        description="認識 Orion 的人 — 我們不是顧問公司，是你事業的長期戰友。AI 系統設計、技術架構、商業策略多領域戰士。"
        url="/team"
      />
      <style dangerouslySetInnerHTML={{ __html: TEAM_CSS }} />

      <header className="team-header">
        <h1>認識 Orion 的人</h1>
        <p>我們不是顧問公司，我們是你事業的長期戰友</p>
      </header>

      <div className="team-grid">
        {team.map((m) => (
          <article key={m.name} className="team-card">
            <div className="team-avatar">
              <img src={`/team/${encodeURIComponent(m.photo)}`} alt={m.name} loading="lazy" />
            </div>
            <h3 className="team-name">{m.name}</h3>
            <div className="team-title">{m.title}</div>

            <div className="team-section">
              <span className="team-section-label">專長</span>
              <div className="team-specialties">{m.specialties}</div>
            </div>

            <div className="team-section">
              <span className="team-section-label">介紹</span>
              <p className="team-intro">{m.intro}</p>
            </div>

            <div className="team-section">
              <span className="team-section-label">年資</span>
              <div className="team-experience">{m.experience}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
