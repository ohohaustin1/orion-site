import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  FileCheck2,
  Network,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import PageSEO from '../components/PageSEO';
import HeroSection from '../components/hero/HeroSection';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const aiSystems = [
  { name: '不動產決策 AI', pain: '案源、區域、客群與銷售節奏分散。', result: '把市場判斷變成可重複的成交流程。' },
  { name: '股票策略 AI', pain: '資訊太多，決策缺乏紀律與回測。', result: '把策略假設變成可監控的風險框架。' },
  { name: '電商成交 AI', pain: '流量、客服、回購與廣告資料斷裂。', result: '把每次互動轉成可追蹤的銷售任務。' },
  { name: '餐飲排班 AI', pain: '尖離峰、缺工與人力成本難預測。', result: '把營運經驗變成排班與備料規則。' },
  { name: '製造排程 AI', pain: '訂單、產線、庫存與交期互相拉扯。', result: '把產能限制變成可調度的排程系統。' },
  { name: '客戶留存 AI', pain: '老客流失前沒有被辨識與照顧。', result: '把客戶記憶變成自動分眾與回訪。' },
  { name: '法律風險 AI', pain: '合約、話術與文件風險靠人工記憶。', result: '把風險點變成提醒、審核與紀錄。' },
  { name: '健康長壽 AI', pain: '健康資料零散，無法長期決策。', result: '把數據、習慣與目標變成陪跑系統。' },
  { name: '品牌語感 AI', pain: '品牌聲音靠人感覺，難以複製。', result: '把語氣、標準與禁區變成內容引擎。' },
  { name: '企業現金流 AI', pain: '收入、成本與風險沒有即時儀表板。', result: '把現金流變成預警與決策節奏。' },
  { name: '教育傳承 AI', pain: '知識留在人身上，交接成本高。', result: '把經驗變成課程、SOP 與訓練資料。' },
  { name: '命運機率 AI', pain: '重大選擇只能靠直覺與片段資訊。', result: '把不確定性拆成情境、機率與行動。' },
];

const workflowSteps = [
  { title: '輸入目標', desc: '使用者輸入產業需求、產品構想、營運痛點或商業問題。' },
  { title: '理解分類', desc: 'AI 判斷產業、角色、資料來源、風險、變現模式與交付難度。' },
  { title: '制定計畫', desc: '系統決定要調用哪些工具：商業分析、ROI 試算、流程設計、CRM 任務、工程規格。' },
  { title: '調用工具', desc: '工具實際產出分析、藍圖、工作流、任務、通知與 Codex 派工稿。' },
  { title: '驗證結果', desc: 'AI 檢查邏輯、數字、風險、可複製性與可放大性。' },
  { title: '執行部署', desc: '交付 landing page、任務清單、工程 prompt、團隊通知與追蹤節點。' },
  { title: '數據回饋', desc: '回收成交率、留存率、使用率與回訪率，讓系統越用越準。' },
];

const methodSteps = [
  '模糊想法',
  'AI 深度拆解',
  '工程可行性評估',
  '系統建置',
  '數據回饋',
  '長期陪跑',
];

const proofCards = [
  {
    icon: BrainCircuit,
    title: '不是聊天，是決策中樞',
    body: 'ORION 不只回答問題，而是把問題拆成資料、任務、流程、驗證與後續追蹤。',
  },
  {
    icon: Workflow,
    title: '不是單點工具，是工作流',
    body: '每個工具都對應商業目的：分析痛點、計算 ROI、生成規格、建立任務、通知團隊。',
  },
  {
    icon: Database,
    title: '不是一次服務，是資料複利',
    body: '每次診斷、成交、回訪與驗收都會留下可重用資料，讓下一次更快、更準。',
  },
];

const clarityItems = [
  {
    icon: BrainCircuit,
    title: 'ORION 是什麼',
    body: '不是單一聊天工具，而是把老闆的想法、決策、流程與資料接成一套 AI 商業中樞。',
  },
  {
    icon: Workflow,
    title: '你會得到什麼',
    body: '一份可執行藍圖、一套工具調用流程、可交給工程與團隊落地的系統規格。',
  },
  {
    icon: Database,
    title: '為什麼會複利',
    body: '每次對話、任務、成交與回饋都會沉澱成資料，讓下一次判斷更快、更準、更可複製。',
  },
];

function startDiagnosis(entryPoint: string) {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: entryPoint });
  window.location.href = `${DIAG_URL}/`;
}

export default function HomePage() {
  return (
    <div className="orion-cinematic-site">
      <PageSEO
        title="ORION AI 獵戶座智鑑｜企業級 AI 決策基礎建設"
        description="ORION AI 幫企業把想法系統化、產品化、商業化，從策略拆解、工具調用、工程交付到數據回收，打造會自己長大的 AI 系統。"
        url="/home"
      />

      <HeroSection />

      <section className="site-section site-clarity-strip" aria-label="ORION AI 交付物摘要">
        {clarityItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="clarity-card">
              <Icon size={22} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="site-section site-section-intro">
        <div className="site-section-copy">
          <span className="site-eyebrow">企業 AI 指揮中心</span>
          <h2>老闆不缺想法，缺的是把想法變成系統的能力。</h2>
          <p>
            ORION 的工作不是多做一個聊天機器人，而是把企業決策拆成可執行的工具鏈。策略會變成流程，流程會變成任務，任務會回收資料，資料會讓下一次判斷更準。
          </p>
        </div>
        <div className="site-video-console">
          <CinematicVideo src="/videos/mixkit-collaborative-digital-display.mp4" label="團隊在數位螢幕前討論企業資料的影片" />
          <div className="site-console-caption">
            <span>即時判斷</span>
            <span>任務派工</span>
            <span>資料回收</span>
          </div>
        </div>
      </section>

      <section id="tool-calling-workflow" className="site-section site-workflow-section">
        <div className="site-section-header">
          <span className="site-eyebrow">AI Tool Calling Workflow</span>
          <h2>不是聊天機器人，是會調用工具的 AI 商業中樞。</h2>
          <p>ORION 會先理解你的商業目標，再選擇對應工具，完成分析、規劃、建置、追蹤與回饋。</p>
        </div>

        <div className="tool-calling-stage">
          <CinematicVideo src="/videos/orion-bg-02-toolflow-network.mp4" className="tool-calling-video" label="工具調用網路與資料流動畫" />
          <div className="workflow-node-grid">
            {workflowSteps.map((step, index) => (
              <article
                key={step.title}
                className="workflow-node"
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="site-section site-modules-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">12 個 AI 系統模組</span>
          <h2>同一套決策底層，可以長出不同產業的 AI 系統。</h2>
          <p>每個模組都不是單一功能，而是一個可以連接資料、流程、任務與回饋的商業系統。</p>
        </div>

        <div className="module-grid">
          {aiSystems.map((system, index) => (
            <article
              key={system.name}
              className="module-card"
            >
              <span className="module-number">{String(index + 1).padStart(2, '0')}</span>
              <h3>{system.name}</h3>
              <p>{system.pain}</p>
              <strong>{system.result}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section site-method-section">
        <div className="method-video-panel">
          <CinematicVideo src="/videos/orion-bg-03-systems-city.mp4" label="未來城市與系統中樞動畫" />
        </div>
        <div className="method-copy">
          <span className="site-eyebrow">ORION 方法論</span>
          <h2>一次建置，長期複利。</h2>
          <div className="method-chain">
            {methodSteps.map((step, index) => (
              <div key={step} className="method-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section site-proof-section">
        {proofCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.title} className="proof-card">
              <Icon size={24} />
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          );
        })}
      </section>

      <section className="site-section site-final-command">
        <CinematicVideo src="/videos/orion-bg-04-memory-nightcity.mp4" label="夜間資料城市與企業記憶動畫" />
        <div className="final-command-content">
          <span className="site-eyebrow">品牌宣言</span>
          <h2>未來的企業只有兩種：被 AI 取代的，與擁有 ORION 系統的。</h2>
          <p>
            如果你現在只有想法，ORION 會幫你拆成系統。如果你已經有流程，ORION 會幫你變成工具。如果你已經有工具，ORION 會幫你接上資料與複利。
          </p>
          <div className="final-command-actions">
            <button className="orion-primary-btn" onClick={() => startDiagnosis('home_final_cta')}>
              啟動你的 AI 系統
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="/cases">
              查看實戰案例
            </a>
          </div>
        </div>
      </section>

      <section className="site-section site-scoreboard" aria-label="ORION 系統能力摘要">
        <div>
          <BarChart3 size={22} />
          <strong>策略</strong>
          <span>從商業痛點拆出可執行假設</span>
        </div>
        <div>
          <Network size={22} />
          <strong>工具</strong>
          <span>把分析、任務、通知與工程串起來</span>
        </div>
        <div>
          <FileCheck2 size={22} />
          <strong>驗證</strong>
          <span>每次交付都留下可追蹤證據</span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <strong>信任</strong>
          <span>用紀律、審計與資料降低決策風險</span>
        </div>
      </section>
    </div>
  );
}
