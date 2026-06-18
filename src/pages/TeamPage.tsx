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
  image?: string;
}

const GARBLED_RE = /[�]|銝|嚗|瘙|蝟|鞈|撠|摰|憭|隤|雿|蝯|蝺|蝑|閬|頝/;

const fallbackTeam: TeamUnit[] = [
  {
    id: 1,
    name: 'Austin 許燿宸',
    title: '創辦人與策略總指揮',
    bio: '負責 ORION 的長期方向、產品判斷、商業模式與資源配置，確保每一次建置都能沉澱成複利資產。',
    icon: ShieldCheck,
    image: '/team/AUSTIN.png',
  },
  {
    id: 2,
    name: '戰略部',
    title: '營運斷點與任務總控',
    bio: '把客戶入口、營運斷點、風險與 Chairman 決策整理成清楚派工，讓每個 AI 節點知道要接哪一段流程、驗證到哪一層。',
    icon: BrainCircuit,
  },
  {
    id: 3,
    name: 'Codex 工程節點',
    title: '工作流建置與自動化交付',
    bio: '負責程式碼、測試、部署、驗證報告與工程紀律，把入口、派工、提醒、回報落成可跑、可驗、可維護的系統。',
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
    title: '品牌、轉換流程與資料回收',
    bio: '把品牌敘事、廣告素材、CTA、UTM、名單分級與回訪任務接成轉換流程，讓每次曝光都能回收資料。',
    icon: Megaphone,
  },
  {
    id: 6,
    name: 'AI Agent 作業層',
    title: 'O 每天追蹤作業層',
    bio: '負責把診斷、工具調用、任務派工、進度提醒、主管回報與資料記憶串起來，讓 ORION 不是聊天，而是每天幫團隊追結果。',
    icon: Bot,
  },
];

function getInitial(name: string) {
  const match = name.match(/[A-Za-z]/);
  return match ? match[0].toUpperCase() : name.charAt(0);
}

const LOCAL_TEAM_IMAGES: Array<{ pattern: RegExp; src: string }> = [
  { pattern: /許[耀燿]宸|Chairman|創辦人/i, src: '/team/AUSTIN.png' },
  { pattern: /魏宇霆|David/i, src: '/team/魏宇霆 David.png' },
  { pattern: /王艾倫|Aaron/i, src: '/team/王艾倫 Aaron.png' },
  { pattern: /陳建宏|Kevin/i, src: '/team/陳建宏 Kevin.png' },
  { pattern: /林佳穎|Iris/i, src: '/team/林佳穎 Iris.png' },
  { pattern: /張雅婷|Tina/i, src: '/team/張雅婷 Tina.png' },
  { pattern: /吳明哲|Marcus/i, src: '/team/吳明哲 Marcus.png' },
];

function resolveMemberImage(member: Pick<Member, 'name' | 'title' | 'image_url'>) {
  const profile = `${member.name} ${member.title}`;
  return LOCAL_TEAM_IMAGES.find((item) => item.pattern.test(profile))?.src ?? member.image_url ?? null;
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
        title="ORION AI 核心團隊｜把老闆每天追的事做成系統"
        description="ORION AI 團隊由策略、工程、瀏覽器驗收、內容成長與 AI Agent 作業層組成，負責把客人、訂單、任務、回訪與主管回報做成可追蹤流程。"
        url="/team"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">核心團隊</span>
          <h1>你說出一段混亂流程，ORION 團隊把它做成每天會跑的系統。</h1>
          <p>
            戰略先判斷哪一段最值得做，工程做出第一版，瀏覽器驗收確認客戶真的能用，AI Agent 把提醒、派工、追蹤、回報與資料回收接起來。
          </p>
          <div className="source-pill">
            <Users size={16} />
            {source === 'api' ? '使用 production 團隊資料' : source === 'loading' ? '正在讀取 production 團隊資料' : 'API 未回應或資料異常，使用本地團隊架構'}
          </div>
        </div>
        <CinematicVideo src="/videos/orion-executive-team-pan.mp4" label="企業 AI 團隊在未來辦公室協作的影片" />
      </section>

      <section className="site-section team-system-section">
        {useApiMembers ? (
          <div className="team-card-grid">
            {members.map((member) => {
              const portrait = resolveMemberImage(member);
              return (
                <article className="team-unit-card" key={member.id}>
                  {portrait ? (
                    <img className="team-portrait-image" src={portrait} alt={`${member.name} 團隊照`} loading="lazy" />
                  ) : (
                    <div className="team-avatar-letter">{getInitial(member.name)}</div>
                  )}
                  <h2>{member.name}</h2>
                  <span>{member.title}</span>
                  <p>{member.bio || 'ORION AI 核心成員，負責把商業問題轉成可執行工作流。'}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="team-card-grid">
            {fallbackTeam.map((unit) => {
              const Icon = unit.icon;
              return (
                <article className="team-unit-card" key={unit.id}>
                  {unit.image ? (
                    <img className="team-portrait-image" src={unit.image} alt={`${unit.name} 團隊照`} loading="lazy" />
                  ) : (
                    <div className="team-icon-ring">
                      <Icon size={28} />
                    </div>
                  )}
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
        <CinematicVideo src="/videos/orion-memory-city-card-loop.mp4" label="企業資料記憶與團隊交接動畫" />
        <div className="final-command-content">
          <span className="site-eyebrow">合作方式</span>
          <h2>你不用自己寫規格，先把最常漏、最常卡、最常要你追的事講出來。</h2>
          <p>ORION 會幫你整理成：誰進來、誰處理、哪裡卡住、O 先接哪一段、工程要做哪些功能、驗收要看哪些畫面。</p>
          <button className="orion-primary-btn" onClick={startDiagnosis}>
            讓 O 幫我拆流程
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
