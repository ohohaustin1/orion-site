import { ArrowRight, AlertTriangle, LineChart, TrendingUp } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const insightRows = [
  { title: '沒有 O 追流程', before: '靠人追訊息、靠會議補資訊、靠老闆每天問進度。', after: '公司越大，沒人追的客人、單子和進度越難看見。' },
  { title: '只有單點 AI 工具', before: '可以加速局部任務，但入口、派工、回報與資料仍然斷裂。', after: '工具變多，老闆要盯的事不一定變少。' },
  { title: '有 ORION 工作流', before: '客戶入口、任務派工、進度追蹤、主管回報被串成同一條線。', after: '每次執行都留下資料，下一次更快、更準、更可交接。' },
];

const signals = [
  { label: '老闆追問', value: '下降', body: '主管不需要每天問誰處理了、做到哪裡、哪裡卡住。' },
  { label: '追蹤斷點', value: '下降', body: '高意向 lead、客戶回訪、工程驗收都有負責人與狀態。' },
  { label: '資料複利', value: '上升', body: '每次接單、追蹤和交付都變成下一次可用的判斷資料。' },
];

function startDiagnosis() {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: 'insights_cta' });
  window.location.href = `${DIAG_URL}/`;
}

export default function InsightsPage() {
  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 數據洞察｜AI 值不值得做，看老闆有沒有少追事"
        description="ORION AI 數據洞察說明企業導入 AI 時，如何先找出客人、訂單、回訪、團隊進度中最值得交給 O 追的流程。"
        url="/insights"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">數據洞察</span>
          <h1>AI 有沒有價值，看老闆有沒有少追客人、少追單、少追進度。</h1>
          <p>
            很多公司買了 AI 工具，但客人還是等回覆、業務還是忘記追、專案還是靠老闆盯。真正的差距不是模型多厲害，而是 O 有沒有每天幫你把下一步追到結果。
          </p>
        </div>
        <CinematicVideo
          src="/videos/orion-bg-00-command.mp4"
          label="企業資料中樞與決策洞察動畫"
          mobileObjectPosition="50% center"
        />
      </section>

      <section className="site-section insight-score-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">三種企業狀態</span>
          <h2>AI 導入的輸贏，不是有沒有工具，而是老闆每天少追多少事。</h2>
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
        <CinematicVideo
          src="/videos/orion-executive-board-pan.mp4"
          label="高階主管檢視企業資料與決策儀表板影片"
          mobileMode="poster"
          mobileObjectPosition="55% center"
        />
        <div className="signal-content">
          <span className="site-eyebrow">ORION 觀察指標</span>
          <h2>一段流程值不值得交給 O，先看三個訊號。</h2>
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
          <h2>風險提醒：不要把 AI 做成另一個需要人盯的工具。</h2>
          <p>
            如果 AI 只是在旁邊聊天，員工還是要手動搬資料、整理結論、建立任務、通知團隊、回報老闆，那它沒有真正減少工作。ORION 的判斷標準是：做完一次之後，下一次是不是更不用人盯。
          </p>
        </div>
      </section>

      <section className="site-section final-plain-cta">
        <div className="final-command-content">
          <span className="site-eyebrow">下一步</span>
          <h2>用你的真實問題，測一次 O 能不能幫你少追一件事。</h2>
          <p>先不用做大平台。先把一個痛點拆成：誰進來、誰處理、多久要回、卡住怎麼提醒、老闆看什麼回報。</p>
          <button className="orion-primary-btn" onClick={startDiagnosis}>
            讓 O 幫我拆流程
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
