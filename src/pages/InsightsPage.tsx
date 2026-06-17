import { ArrowRight, AlertTriangle, LineChart, TrendingUp } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const insightRows = [
  { title: '沒有 AI 系統', before: '靠人追進度、靠會議補資訊、靠經驗做判斷。', after: '成本會隨規模上升，決策品質不穩定。' },
  { title: '有單點 AI 工具', before: '可以加速局部任務，但資料、流程與團隊仍然斷裂。', after: '工具變多，整體系統不一定變強。' },
  { title: '有 ORION 系統', before: '策略、工具、任務、資料與驗證被串成同一條工作流。', after: '每次執行都留下資料，讓下一次更快、更準。' },
];

const signals = [
  { label: '決策延遲', value: '下降', body: '主管不需要等週報才知道哪裡卡住。' },
  { label: '任務漏接', value: '下降', body: '高意向 lead、客戶回訪、工程驗收都有明確狀態。' },
  { label: '資料複利', value: '上升', body: '每次診斷和交付都變成下一次可用的知識資產。' },
];

function startDiagnosis() {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: 'insights_cta' });
  window.location.href = `${DIAG_URL}/`;
}

export default function InsightsPage() {
  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 數據洞察｜企業為什麼需要 AI 決策基礎建設"
        description="ORION AI 數據洞察說明企業導入 AI 的真正價值：不是多一個聊天工具，而是讓決策、流程、任務與資料形成複利。"
        url="/insights"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">數據洞察</span>
          <h1>AI 的價值不在回答速度，而在企業能不能形成決策複利。</h1>
          <p>
            很多公司買了 AI 工具，卻沒有把資料、任務、回饋與驗證串起來。真正的差距不是模型，而是企業是否擁有自己的 AI 作業層。
          </p>
        </div>
        <CinematicVideo src="/videos/orion-memory-city-card-loop.mp4" label="企業資料記憶城市動畫" />
      </section>

      <section className="site-section insight-score-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">三種企業狀態</span>
          <h2>AI 導入的輸贏，取決於它有沒有進入你的工作流。</h2>
        </div>
        <div className="insight-comparison">
          {insightRows.map((row, index) => (
            <article key={row.title} className={index === 2 ? 'is-orion' : ''}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{row.title}</h3>
              <p>{row.before}</p>
              <strong>{row.after}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section signal-section">
        <CinematicVideo src="/videos/orion-executive-board-pan.mp4" label="企業主管會議與決策討論影片" />
        <div className="signal-content">
          <span className="site-eyebrow">ORION 觀察指標</span>
          <h2>一套 AI 系統是否有價值，看三個訊號。</h2>
          <div className="signal-grid">
            {signals.map((signal) => (
              <div key={signal.label}>
                <LineChart size={20} />
                <strong>{signal.label}</strong>
                <span>{signal.value}</span>
                <p>{signal.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section risk-callout">
        <AlertTriangle size={24} />
        <div>
          <h2>風險提醒：不要把 AI 導入做成新的人工負擔。</h2>
          <p>
            如果 AI 只是在旁邊聊天，員工還是要手動搬資料、整理結論、建立任務、通知團隊，那它沒有真正降低邊際成本。ORION 的判斷標準是：做完一次之後，下一次是不是更輕鬆。
          </p>
        </div>
      </section>

      <section className="site-section final-plain-cta">
        <div className="final-command-content">
          <span className="site-eyebrow">下一步</span>
          <h2>用你的真實流程，測一次 ORION 是否能降低決策成本。</h2>
          <p>最小可驗證行動不是做大平台，而是先把一個痛點拆成一條可以跑、可以驗、可以回收資料的工作流。</p>
          <button className="orion-primary-btn" onClick={startDiagnosis}>
            啟動 AI 診斷
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <section className="site-section site-scoreboard compact">
        <div>
          <TrendingUp size={22} />
          <strong>複利判斷</strong>
          <span>下次是否更快</span>
        </div>
        <div>
          <LineChart size={22} />
          <strong>資料判斷</strong>
          <span>是否留下可用資料</span>
        </div>
        <div>
          <AlertTriangle size={22} />
          <strong>風險判斷</strong>
          <span>是否能提前預警</span>
        </div>
      </section>
    </div>
  );
}
