import React from 'react';
import { Crown, Cpu, Lightbulb, BrainCircuit, Heart, BarChart3, Link2 } from 'lucide-react';
import PageSEO from '../components/PageSEO';

// Task F (2026-04-26)：團隊頁改角色卡
// Chairman 親令：拿掉 AI 生圖頭像、改 role icon + 真實職責描述
// 「沒明確內容、寫『招募中』更誠實」— 只 Austin 是真實創辦人、其他改 ROLE-only 卡
type RoleIcon = React.ComponentType<{ size?: number; strokeWidth?: number }>;
interface Member {
  name: string;        // 真實人名 OR 「招募中」
  title: string;       // 角色 / 職位
  specialties: string; // 擅長領域
  responsibility: string; // 核心責任（取代 intro 第一人稱長句）
  status?: 'active' | 'recruiting'; // recruiting → 顯示招募中 banner
  Icon: RoleIcon;
}

const team: Member[] = [
  {
    name: 'Austin 許燿宸',
    title: 'Chairman・創辦人',
    specialties: '商業策略、AI 系統決策、企業顧問',
    responsibility: '訂方向、把商業直覺轉化成 AI 系統決策、最終把關所有對外承諾',
    status: 'active',
    Icon: Crown,
  },
  {
    name: '招募中',
    title: '首席技術長 CTO',
    specialties: '電商 / ERP / CRM、AWS / GCP、全棧架構、資安',
    responsibility: '系統可用性、安全與效能、上線品質',
    status: 'recruiting',
    Icon: Cpu,
  },
  {
    name: '招募中',
    title: '首席 AI 策略官',
    specialties: 'AI 落地、商業自動化、流程拆解',
    responsibility: '把 AI 能力翻譯成客戶聽得懂的 ROI、不談理論只談結果',
    status: 'recruiting',
    Icon: Lightbulb,
  },
  {
    name: '招募中',
    title: '首席 AI 架構師',
    specialties: '機器學習、決策自動化、n8n / Workflow',
    responsibility: '讓機器學會跑商業邏輯、把決策流程自動化',
    status: 'recruiting',
    Icon: BrainCircuit,
  },
  {
    name: '招募中',
    title: '客戶體驗總監',
    specialties: '用戶研究、對話設計、品牌體驗',
    responsibility: '讓系統感覺被理解、不是被處理',
    status: 'recruiting',
    Icon: Heart,
  },
  {
    name: '招募中',
    title: '數據分析師',
    specialties: '數據建模、商業洞察、ROI 分析',
    responsibility: '從數字找錢、把直覺變成可驗證策略',
    status: 'recruiting',
    Icon: BarChart3,
  },
  {
    name: '招募中',
    title: '系統整合工程師',
    specialties: 'API 整合、資料庫、全棧開發',
    responsibility: '讓所有工具說同一種語言、n8n / API / DB 全打通',
    status: 'recruiting',
    Icon: Link2,
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
/* Task F：角色卡 — icon 取代 AI 生圖頭像 */
.team-avatar-icon {
  background: radial-gradient(circle at center, rgba(197,160,89,0.18) 0%, rgba(10,10,10,0.92) 70%);
  color: #C5A059;
}
.team-avatar-icon svg {
  filter: drop-shadow(0 0 8px rgba(197,160,89,0.55));
}
.team-card-recruiting .team-name {
  color: rgba(255,255,255,0.45);
  font-style: italic;
}
.team-recruiting-badge {
  display: inline-block;
  margin-bottom: 14px;
  padding: 3px 10px;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: #C5A059;
  background: rgba(197,160,89,0.10);
  border: 1px solid rgba(197,160,89,0.35);
  border-radius: 4px;
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
        {team.map((m, idx) => (
          <article key={`${m.title}-${idx}`} className={`team-card ${m.status === 'recruiting' ? 'team-card-recruiting' : ''}`}>
            <div className="team-avatar team-avatar-icon">
              <m.Icon size={48} strokeWidth={1.4} />
            </div>
            <h3 className="team-name">{m.name}</h3>
            <div className="team-title">{m.title}</div>
            {m.status === 'recruiting' && (
              <div className="team-recruiting-badge">RECRUITING</div>
            )}

            <div className="team-section">
              <span className="team-section-label">擅長領域</span>
              <div className="team-specialties">{m.specialties}</div>
            </div>

            <div className="team-section">
              <span className="team-section-label">核心責任</span>
              <p className="team-intro">{m.responsibility}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
