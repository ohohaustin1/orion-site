import { useState } from 'react';
import { ArrowRight, BookOpen, ChevronDown, FileText, HelpCircle, ShieldAlert, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const resources = [
  {
    type: '策略筆記',
    title: '不要先問能不能做 AI，先問哪一條流程最常卡住。',
    desc: 'AI 導入前，先找出客戶入口、派工、追蹤、回報哪裡最容易產生隱形成本。能被重複執行與回收資料，才值得做成系統。',
  },
  {
    type: '工程筆記',
    title: '一個 AI 副營運執行長至少要知道：誰進來、誰處理、卡在哪。',
    desc: '只有聊天視窗不算系統。真正的營運 AI 需要入口、狀態、負責人、提醒規則、紀錄與驗收證據。',
  },
  {
    type: '轉換流程筆記',
    title: '成交不是一個按鈕，是一連串沒有斷掉的下一步。',
    desc: '從第一次接觸、需求整理、名單分級、回訪提醒、負責人處理到主管回報，每一段都需要狀態與資料回收。',
  },
  {
    type: '風險筆記',
    title: 'AI 可以加速，但不能讓流程變得更亂。',
    desc: '高風險流程需要分層驗證：本地、瀏覽器、production、真實用戶驗收。沒有證據，就不能宣稱已經能交給客戶使用。',
  },
];

const faqs = [
  {
    q: 'ORION 是聊天機器人嗎？',
    a: '不是。聊天只是入口。ORION 的核心是 AI 副營運執行長：把需求整理、優先級判斷、任務派工、進度追蹤、主管回報與資料回收接成一條工作流。',
  },
  {
    q: '一定要先有完整資料庫才能開始嗎？',
    a: '不一定。第一步通常是把現有流程、表格、客服紀錄、成交紀錄整理成可用欄位，再決定哪些資料值得長期回收。',
  },
  {
    q: 'ORION 適合小公司嗎？',
    a: '適合。只要你每天有客人要追、訂單要接、團隊進度要盯，就可以先從一條最常卡住的流程開始。若只是一次性客製或純人工服務，通常不適合。',
  },
  {
    q: '導入後誰負責維護？',
    a: 'ORION 會把入口、資料欄位、任務規則、提醒條件與驗收方式整理清楚，讓後續可以由團隊、工程師或 AI agent 接手。',
  },
];

function startDiagnosis(entryPoint: string) {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: entryPoint });
  window.location.href = `${DIAG_URL}/`;
}

export default function ResourcesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 資源中心｜AI 副營運執行長導入 FAQ"
        description="ORION AI 資源中心說明如何把客戶入口、任務派工、進度追蹤、主管回報與資料沉澱做成 AI 營運工作流。"
        url="/resources"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">資源中心</span>
          <h1>把 AI 導入想清楚：它到底要幫你盯哪一條工作流？</h1>
          <p>
            這裡整理 ORION 對 AI 副營運執行長、營運工作流、工程驗證與風險控管的核心判斷。目標不是讓你看更多文章，而是讓你更快知道哪一段流程值得先做。
          </p>
        </div>
        <CinematicVideo src="/videos/orion-executive-hero-dolly.mp4" label="科技型主管在透明螢幕前說明 AI 營運工作流的影片" />
      </section>

      <section className="site-section resource-grid-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">精選筆記</span>
          <h2>用 ORION 的標準，判斷哪一條營運流程值得交給 AI。</h2>
        </div>
        <div className="resource-card-grid">
          {resources.map((item) => (
            <article key={item.title} className="resource-card">
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <button onClick={() => startDiagnosis('resources_article_cta')}>
                用我的公司情境檢查
                <ArrowRight size={16} />
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="site-section resource-feature">
        <CinematicVideo src="/videos/orion-trust-host-stage-loop.mp4" label="AI 數位主持人與企業簡報舞台影片" />
        <div>
          <span className="site-eyebrow">下載前先想清楚</span>
          <h2>AI 工作流藍圖不是功能清單，而是入口、狀態、負責人與回報節奏。</h2>
          <p>
            如果你要交給工程師、設計師或 AI agent 執行，藍圖至少要說清楚：使用者從哪裡進來、目前狀態在哪、誰要處理、什麼時候提醒、資料去哪裡、怎麼驗收。
          </p>
          <div className="resource-feature-list">
            <span><BookOpen size={16} /> 商業痛點</span>
            <span><FileText size={16} /> 工程規格</span>
            <span><ShieldAlert size={16} /> 驗證風險</span>
          </div>
        </div>
      </section>

      <section className="site-section faq-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">常見問題</span>
          <h2>先把營運邊界說清楚，AI 才不會越做越亂。</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <article key={faq.q} className={openFaq === index ? 'open' : ''}>
              <button onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                <span><HelpCircle size={18} /> {faq.q}</span>
                <ChevronDown size={18} />
              </button>
              {openFaq === index && <p>{faq.a}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="site-section final-plain-cta">
        <div className="final-command-content">
          <span className="site-eyebrow">下一步</span>
          <h2>把你每天最常盯人的流程交給 ORION，先拆一次工作流。</h2>
          <p>不用準備完整文件。說出產業、痛點、目前誰在處理、哪裡常卡住與想達成的結果，ORION 會幫你整理第一版可執行工作流。</p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('resources_bottom_cta')}>
            啟動工作流診斷
            <Zap size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
