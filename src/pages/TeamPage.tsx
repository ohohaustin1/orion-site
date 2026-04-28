import React, { useEffect, useState } from 'react';
import { Crown, Cpu, Lightbulb, BrainCircuit, Heart, BarChart3, Link2, Users } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import { API_BASE } from '../lib/api-base';

// 2026-04-26 Chairman 修正 F：拿回 DB-driven、條件渲染
// 有 image_url → 真人照片卡 / 無 image_url → role icon 招募中卡
// 後台 admin 改 image_url 即可切換、不需動 code

type RoleIcon = React.ComponentType<{ size?: number; strokeWidth?: number }>;

interface Member {
  id: number;
  name: string;
  title: string;
  bio?: string | null;
  image_url: string | null;
  linkedin?: string | null;
}

// title 關鍵字 → role icon（image_url 缺時顯示）
function pickIcon(title: string): RoleIcon {
  const t = (title || '').toLowerCase();
  if (/chairman|創辦|founder/i.test(title)) return Crown;
  if (/cto|技術長|架構/i.test(title)) return Cpu;
  if (/ai 策略|策略官|strategy/i.test(t)) return Lightbulb;
  if (/ai 架構|architect|機器學習/i.test(title)) return BrainCircuit;
  if (/體驗|ux|customer|客戶/i.test(title)) return Heart;
  if (/數據|分析|analyst|data/i.test(title)) return BarChart3;
  if (/整合|integration|系統/i.test(title)) return Link2;
  return Users;
}

// CN-PROXY-VERCEL-EDGE-001: API_BASE 統一從 src/lib/api-base.ts import
//                            原 env-aware logic 已合進 api-base.ts、保留 VITE_API_BASE_URL override

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
/* 2026-04-26 loading skeleton */
@keyframes teamSkPulse { 0%,100% { opacity: 0.45 } 50% { opacity: 0.85 } }
.team-card-skeleton { pointer-events: none; }
.team-avatar-skeleton {
  background: linear-gradient(135deg, rgba(197,160,89,0.10), rgba(10,10,10,0.7));
  animation: teamSkPulse 1.6s ease-in-out infinite;
}
.team-card-skeleton .sk-line {
  height: 12px;
  background: rgba(197,160,89,0.12);
  border-radius: 4px;
  margin: 8px 0;
  animation: teamSkPulse 1.6s ease-in-out infinite;
}
.team-card-skeleton .sk-line-1 { width: 70%; }
.team-card-skeleton .sk-line-2 { width: 45%; }
`;

export default function TeamPage() {
  const [team, setTeam] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/public/team`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j && Array.isArray(j.team)) setTeam(j.team);
        else setErr('team list empty');
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setErr(e.message || 'fetch failed');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

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

      {loading && (
        <div className="team-grid">
          {Array.from({ length: 7 }).map((_, i) => (
            <article key={`sk-${i}`} className="team-card team-card-skeleton" aria-hidden="true">
              <div className="team-avatar team-avatar-skeleton" />
              <div className="sk-line sk-line-1" />
              <div className="sk-line sk-line-2" />
            </article>
          ))}
        </div>
      )}

      {err && !loading && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', padding: '32px 16px' }}>
          團隊資料暫時無法載入、請稍後再試
        </div>
      )}

      {!loading && !err && (
      <div className="team-grid">
        {team.map((m) => {
          const Icon = pickIcon(m.title);
          const hasPhoto = !!(m.image_url && m.image_url.trim().length > 0);
          return (
            <article key={m.id} className={`team-card ${hasPhoto ? '' : 'team-card-recruiting'}`}>
              {hasPhoto ? (
                <div className="team-avatar">
                  <img src={m.image_url as string} alt={m.name} loading="lazy" />
                </div>
              ) : (
                <div className="team-avatar team-avatar-icon">
                  <Icon size={48} strokeWidth={1.4} />
                </div>
              )}
              <h3 className="team-name">{hasPhoto ? m.name : '招募中'}</h3>
              <div className="team-title">{m.title}</div>
              {!hasPhoto && (
                <div className="team-recruiting-badge">RECRUITING</div>
              )}

              <div className="team-section">
                <span className="team-section-label">擅長領域</span>
                <div className="team-specialties">{(m.bio || '').split('\n')[0] || '—'}</div>
              </div>

              <div className="team-section">
                <span className="team-section-label">核心責任</span>
                <p className="team-intro">{(m.bio || '').split('\n').slice(1).join(' ').trim() || (m.bio || '—')}</p>
              </div>
            </article>
          );
        })}
      </div>
      )}
    </div>
  );
}
