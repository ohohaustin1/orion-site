import { useEffect, useState } from 'react';
import { ArrowRight, Bot, BrainCircuit, Code2, Eye, Megaphone, ShieldCheck, Users } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { API_BASE, DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

interface Member {
  id: number;
  name: string;
  title: string;
  bio?: string | null;
  image_url?: string | null;
  linkedin?: string | null;
}

interface TeamUnit {
  id: number;
  name: string;
  title: string;
  bio: string;
  icon: typeof Users;
}

const GARBLED_RE = /[�]|銝|嚗|瘙|蝟|鞈|撠|摰|憭|隤|雿|蝯|蝺|蝑|閬|頝/;

const fallbackTeam: TeamUnit[] = [
  {
    id: 1,
    name: 'Austin 許耀宸',
    title: '創辦人與策略總指揮',
    bio: '負責 ORION 的長期方向、產品判斷、商業模式與資源配置，確保每一次建置都能沉澱成複利資產。',
    icon: ShieldCheck,
  },
  {
    id: 2,
    name: '戰略部',
    title: '商業模型與任務總控',
    bio: '把市場、漏斗、風險與 Chairman 決策整理成清楚派工，讓每個 AI 節點知道要完成什麼、驗證到哪一層。',
    icon: BrainCircuit,
  },
  {
    id: 3,
    name: 'Codex 工程節點',
    title: '系統建置與自動化交付',
    bio: '負責程式碼、測試、部署、驗證報告與工程紀律，把想法落成可跑、可驗、可維護的系統。',
    icon: Code2,
  },
  {
    id: 4,
    name: 'Cowork 瀏覽器驗收',
    title: '真實使用者視角 QA',
    bio: '用真實瀏覽器、截圖、DOM 與 production flow 驗收，不讓 server-side 檢查假裝等於客戶體驗。',
    icon: Eye,
  },
  {
    id: 5,
    name: '內容與成長節點',
    title: '品牌、漏斗與資料回收',
    bio: '把品牌敘事、廣告素材、CTA、UTM 與回訪任務接成漏斗，讓每次曝光都能回收資料。',
    icon: Megaphone,
  },
  {
    id: 6,
    name: 'AI Agent 作業層',
    title: '工具調用、報告生成與任務派發',
    bio: '負責把診斷、工具調用、報告、通知、任務與資料記憶串起來，讓 ORION 不是聊天，而是中樞。',
    icon: Bot,
  },
];

function getInitial(name: string) {
  const match = name.match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : name.charAt(0);
}

function startDiagnosis() {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: 'team_cta' });
  window.location.href = `${DIAG_URL}/`;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [source, setSource] = useState<'api' | 'fallback' | 'loading'>('loading');

  useEffect(() => {
    if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
      setMembers(null);
      setSource('fallback');
      return;
    }

    let cancelled = false;
    fetch(`${API_BASE}/api/public/team`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
      .then((payload) => {
        if (cancelled) return;
        const list = Array.isArray(payload?.team) ? payload.team as Member[] : [];
        const text = list.map((item) => `${item.name} ${item.title} ${item.bio || ''}`).join(' ');
        if (list.length && !GARBLED_RE.test(text)) {
          setMembers(list);
          setSource('api');
        } else {
          setMembers(null);
          setSource('fallback');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMembers(null);
          setSource('fallback');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const useApiMembers = source === 'api' && members;

  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 核心團隊｜策略、工程、驗證與 AI 作業層"
        description="ORION AI 團隊由策略總控、工程節點、瀏覽器驗收、內容成長與 AI Agent 作業層組成，負責把企業想法做成可驗證系統。"
        url="/team"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">核心團隊</span>
          <h1>ORION 的團隊不是職稱集合，而是一條可驗證的作戰鏈。</h1>
          <p>
            策略負責取捨，工程負責落地，瀏覽器驗收負責真實體驗，內容與成長負責把流量變成資料，AI Agent 負責把流程持續運轉。
          </p>
          <div className="source-pill">
            <Users size={16} />
            {source === 'api' ? '使用 production 團隊資料' : source === 'loading' ? '正在讀取 production 團隊資料' : 'API 未回應或資料異常，使用本地團隊架構'}
          </div>
        </div>
        <CinematicVideo src="/videos/runway-orion-executive-03.mp4" label="企業 AI 團隊在未來辦公室協作的影片" />
      </section>

      <section className="site-section team-system-section">
        {useApiMembers ? (
          <div className="team-card-grid">
            {members.map((member) => (
              <article className="team-unit-card" key={member.id}>
                <div className="team-avatar-letter">{getInitial(member.name)}</div>
                <h2>{member.name}</h2>
                <span>{member.title}</span>
                <p>{member.bio || 'ORION AI 核心成員，負責把商業問題轉成可執行系統。'}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="team-card-grid">
            {fallbackTeam.map((unit) => {
              const Icon = unit.icon;
              return (
                <article className="team-unit-card" key={unit.id}>
                  <div className="team-icon-ring">
                    <Icon size={28} />
                  </div>
                  <h2>{unit.name}</h2>
                  <span>{unit.title}</span>
                  <p>{unit.bio}</p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="site-section site-final-command compact">
        <CinematicVideo src="/videos/orion-executive-team-pan.mp4" label="ORION 團隊協作與企業辦公室影片" />
        <div className="final-command-content">
          <span className="site-eyebrow">合作方式</span>
          <h2>你不需要先懂 AI 技術，你需要先把企業問題講清楚。</h2>
          <p>ORION 會把你的問題轉成策略假設、工具調用、工程規格、驗收證據與後續回收節點。</p>
          <button className="orion-primary-btn" onClick={startDiagnosis}>
            和 ORION 開始診斷
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
