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
  { name: '不動產成交 AI', pain: '客人看屋後誰追、多久追、下一步做什麼都靠業務記憶。', result: '自動分級名單、提醒回訪、整理主管看得懂的成交機會。' },
  { name: '股票策略 AI', pain: '研究、進出場、停損與檢討散在不同筆記，容易被情緒帶走。', result: '把策略假設、風控條件與交易前檢查變成固定工作流。' },
  { name: '電商營運 AI', pain: '客服、棄單、回購與廣告資料分散，團隊每天都在補破口。', result: '自動整理問題、標記高機會客人、產出追單與回購任務。' },
  { name: '餐飲營運 AI', pain: '排班、備料、外送與尖離峰靠店長經驗，忙時才發現人不夠。', result: '把店長經驗變成需求預測、排班提醒與異常回報。' },
  { name: '製造排程 AI', pain: '急單、機台、物料與交期互相卡住，主管每天在救火。', result: '自動整理限制條件、提出排程建議、追蹤卡住的產線節點。' },
  { name: '客戶留存 AI', pain: '客人快流失時沒人知道，等到不續約才開始補救。', result: '自動偵測低互動訊號、派回訪任務、追到顧問完成處理。' },
  { name: '法律風險 AI', pain: '合約、話術與承諾分散在對話裡，法務常常事後才介入。', result: '把高風險字句、審核節點與責任紀錄放進工作流。' },
  { name: '健康長壽 AI', pain: '報告、檢測、習慣與顧問建議分散，客戶看完就斷線。', result: '自動整理週期任務、提醒追蹤、讓健康管理有長期節奏。' },
  { name: '品牌語感 AI', pain: '文案好不好看全靠人感覺，新人與外包很難複製。', result: '把語氣、禁區、範例與審核 checklist 做成內容工作流。' },
  { name: '企業現金流 AI', pain: '收入、成本、應收與人力支出月底才整理，風險太晚看見。', result: '自動產出預警、收款提醒與老闆每週該看的現金流摘要。' },
  { name: '教育傳承 AI', pain: '老師與主管的經驗留在人身上，交接一次就重來一次。', result: '把知識、作業、回饋與助教判斷變成可訓練的流程。' },
  { name: '命運機率 AI', pain: '轉型、投資、合作常常只剩直覺，沒有停止條件與追蹤節點。', result: '把重大決策拆成情境、機率、行動、驗證與回顧。' },
];

const workflowSteps = [
  { title: '接住入口', desc: '客人、名單、表單、訊息或內部需求進來，先被 O 統一整理，不再散在各處。' },
  { title: '判斷優先級', desc: 'AI 判斷這件事急不急、值不值得追、缺什麼資料、該由誰處理。' },
  { title: '補齊資料', desc: '自動整理對話、產業、預算、痛點、風險與目前進度，讓人不用重新問一次。' },
  { title: '建立任務', desc: '把下一步變成 CRM 任務、工程規格、通知、回訪提醒或主管待辦。' },
  { title: '追蹤進度', desc: '負責人沒處理、客人沒回、任務卡住時，系統會提醒並留下狀態。' },
  { title: '驗收回報', desc: '把完成結果、失敗原因、下一步與需要主管判斷的地方整理成回報。' },
  { title: '沉澱資料', desc: '每次成交、流失、回訪與交付都變成下一次可用的判斷資料。' },
];

const methodSteps = [
  '需求進來',
  'O 判斷優先級',
  '補齊資料缺口',
  '派工給負責人',
  '追蹤到有結果',
  '回報並沉澱資料',
];

const proofCards = [
  {
    icon: BrainCircuit,
    title: '不是聊天，是營運判斷',
    body: 'O 會先判斷這件事值不值得追、急不急、缺什麼資料，以及下一步該找誰。',
  },
  {
    icon: Workflow,
    title: '不是多一套工具，是一條流程',
    body: '從入口、分級、派工、提醒、驗收到回報，ORION 把零散動作串成一條線。',
  },
  {
    icon: Database,
    title: '不是做完就結束，是越跑越準',
    body: '每次回訪、成交、卡關與驗收都留下資料，下一次判斷會更快、更有根據。',
  },
];

const clarityItems = [
  {
    icon: BrainCircuit,
    title: 'ORION 是什麼',
    body: '一個會幫老闆追事情的 O：接訊息、整理需求、排下一步、提醒負責人、回報結果。',
  },
  {
    icon: Workflow,
    title: '你會得到什麼',
    body: '一張每天能跑的清單：誰要回客人、誰要追報價、哪張單卡住、今天老闆要看什麼。',
  },
  {
    icon: Database,
    title: '最後留下什麼',
    body: '不是一次性建議，而是讓客人、任務、回訪和成交紀錄都留在系統裡。',
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
        title="ORION AI｜別讓利潤卡在沒人追的流程裡"
        description="ORION AI 會幫老闆接住客人訊息、整理需求、安排下一步、提醒負責人、追蹤進度，最後回報成交與交付結果。"
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
          <span className="site-eyebrow">老闆少追一點</span>
          <h2>最累的不是沒有人，是每件事最後都回到老闆身上。</h2>
          <p>
            客人有沒有回、報價有沒有追、排程有沒有改、回訪有沒有漏、今天誰卡住，這些事不該每天都靠老闆追。ORION 先找出最常斷掉的一段，再把它做成 O 每天可以提醒、追蹤、回報的流程。
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
          <span className="site-eyebrow">AI Operating Workflow</span>
          <h2>O 不是陪聊，是把「下一步誰要做」追到有結果。</h2>
          <p>客人一進來，O 先整理他要什麼、急不急、缺什麼資料；再把下一步變成任務，提醒負責人，最後整理成老闆看得懂的回報。</p>
        </div>

        <div className="tool-calling-stage">
          <CinematicVideo src="/videos/orion-bg-02-toolflow-network.mp4" className="tool-calling-video" label="AI 營運工作流與資料流動畫" />
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
          <span className="site-eyebrow">12 種老闆最常追的事</span>
          <h2>先不用想 AI 系統。先想：你每天最常追哪一件事？</h2>
          <p>製造業追交期，電商追私訊和棄單，房仲追看屋後回訪，診所追預約與術後關懷。ORION 先把一段最痛的流程拆清楚，再做成每天可執行的 AI 任務。</p>
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
          <h2>先接住一段最痛的流程，再複製到下一段。</h2>
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
          <span className="site-eyebrow">下一步</span>
          <h2>先讓 O 看看：你每天最常追人的那件事，能不能交給系統追。</h2>
          <p>
            不用準備企劃書，也不用先懂技術。你只要用白話說「現在誰常常漏、誰常常卡、哪件事每天都要你問」，O 會整理成痛點、負責人、提醒規則、資料欄位與第一版導入順序。
          </p>
          <div className="final-command-actions">
            <button className="orion-primary-btn" onClick={() => startDiagnosis('home_final_cta')}>
              讓 O 幫我拆流程
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
          <strong>入口</strong>
          <span>客人與需求不再散落各處</span>
        </div>
        <div>
          <Network size={22} />
          <strong>派工</strong>
          <span>下一步有人收、有人做、有人回</span>
        </div>
        <div>
          <FileCheck2 size={22} />
          <strong>追蹤</strong>
          <span>卡住的任務會被提醒與回報</span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <strong>記憶</strong>
          <span>每次結果都變成下一次判斷資料</span>
        </div>
      </section>

      <section className="site-section site-griffin-flight" aria-label="ORION 獅鷲雲海品牌視覺">
        <picture className="griffin-flight-image">
          <source srcSet="/images/orion-griffin-command-sky.webp" type="image/webp" />
          <img src="/images/orion-griffin-command-sky.jpg" alt="ORION 獅鷲在雲海上方翱翔" loading="lazy" />
        </picture>
        <div className="griffin-flight-content">
          <span className="site-eyebrow">ORION SIGNAL</span>
          <h2>
            好系統，
            <br />
            不靠老闆每天追。
          </h2>
          <p>
            獅鷲不是裝飾，是 ORION 的工作方式：站在高處看全局，往下抓住每一個讓利潤卡住的斷點，直到流程有人負責、任務有回報、資料能沉澱。
          </p>
        </div>
      </section>
    </div>
  );
}
