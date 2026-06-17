import { useState } from 'react';
import { ArrowRight, BookOpen, ChevronDown, FileText, HelpCircle, ShieldAlert, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const resources = [
  {
    type: '策略筆記',
    title: '不要先問能不能做 AI，先問這件事能不能複利。',
    desc: 'AI 導入前，先判斷流程是否可複製、資料是否可回收、任務是否可驗證。否則只是把人工作業換成更貴的工具。',
  },
  {
    type: '工程筆記',
    title: '一個 AI 系統至少要有入口、狀態、工具、紀錄與驗收。',
    desc: '只有聊天視窗不算系統。真正的企業 AI 需要知道使用者是誰、現在進度在哪、調用了什麼工具、留下哪些證據。',
  },
  {
    type: '漏斗筆記',
    title: '成交不是一個按鈕，是一連串被追蹤的微行動。',
    desc: '從第一次接觸、診斷、報告、登入、解鎖、回訪到任務派工，每一段都需要清楚的狀態與資料回收。',
  },
  {
    type: '風險筆記',
    title: 'AI 可以加速，但不能取代驗證紀律。',
    desc: '高風險流程需要分層驗證：本地、瀏覽器、production、真實用戶驗收。沒有證據，就不能宣稱完成。',
  },
];

const faqs = [
  {
    q: 'ORION 是聊天機器人嗎？',
    a: '不是。聊天只是入口。ORION 的核心是把商業目標拆成工具調用、任務派工、資料回收與工程交付。',
  },
  {
    q: '一定要先有完整資料庫才能開始嗎？',
    a: '不一定。第一步通常是把現有流程、表格、客服紀錄、成交紀錄整理成可用欄位，再決定哪些資料值得長期回收。',
  },
  {
    q: 'ORION 適合小公司嗎？',
    a: '適合有明確痛點、想把流程系統化的團隊。若只是一次性客製或純人工服務，通常不適合。',
  },
  {
    q: '導入後誰負責維護？',
    a: 'ORION 會把工程交付、資料欄位、任務規則與驗收方式整理清楚，讓後續可以由團隊、工程師或 AI agent 接手。',
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
        title="ORION AI 資源中心｜AI 系統化筆記與導入 FAQ"
        description="ORION AI 資源中心提供企業 AI 系統化、工具調用、漏斗設計、工程驗證與風險控管相關筆記。"
        url="/resources"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">資源中心</span>
          <h1>把 AI 導入想清楚，比急著做功能更重要。</h1>
          <p>
            這裡整理 ORION 對 AI 系統化、漏斗、工程驗證與風險控管的核心判斷。目標不是讓你看更多文章，而是降低決策成本。
          </p>
        </div>
        <CinematicVideo src="/videos/orion-executive-hero-dolly.mp4" label="科技型主管在透明螢幕前說明企業 AI 系統的影片" />
      </section>

      <section className="site-section resource-grid-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">精選筆記</span>
          <h2>用 ORION 的標準，重新判斷 AI 值不值得做。</h2>
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
          <h2>AI 系統藍圖不是功能清單，而是決策、資料與驗證的結構。</h2>
          <p>
            如果你要交給工程師、設計師或 AI agent 執行，藍圖至少要說清楚：使用者入口、狀態來源、工具調用、資料去向、副作用與驗收方式。
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
          <h2>先把邊界說清楚，AI 系統才不會越做越亂。</h2>
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
          <h2>把你的想法交給 ORION，先做一次系統化拆解。</h2>
          <p>不用準備完整文件。說出產業、痛點、目前流程與想達成的結果，ORION 會幫你整理第一版可執行藍圖。</p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('resources_bottom_cta')}>
            啟動 AI 診斷
            <Zap size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
