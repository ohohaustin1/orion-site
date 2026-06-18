import { useState } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, FileText, Network, ShieldCheck, Workflow, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const services = [
  {
    icon: BrainCircuit,
    title: '流程診斷',
    desc: '先找出公司最容易產生隱形成本、利潤流失與進度失控的營運段落，判斷哪一段最值得先交給 AI。',
    output: '營運斷點、ROI 假設、第一版工作流',
  },
  {
    icon: Workflow,
    title: '入口整合',
    desc: '把 LINE、IG、官網表單、CRM、內部任務或人工回報整理成同一個狀態入口。',
    output: '入口清單、資料欄位、狀態規則',
  },
  {
    icon: Network,
    title: '任務派工',
    desc: '讓每個客人、名單、訂單與內部任務都有負責人、下一步與提醒規則。',
    output: '任務分派、回訪節奏、逾時提醒',
  },
  {
    icon: FileText,
    title: '進度回報',
    desc: '把每天卡住的事、完成的事、需要老闆判斷的事整理成可以直接看的回報。',
    output: '主管摘要、異常清單、下一步建議',
  },
  {
    icon: Database,
    title: '資料記憶',
    desc: '把每一次接單、追蹤、成交、流失、驗收沉澱成資料，讓下一次不用重新開始。',
    output: '資料欄位、回收節點、營運儀表板',
  },
  {
    icon: ShieldCheck,
    title: '驗收與風險',
    desc: '把 AI 輸出、工程交付、production 狀態與客戶流程分層驗證，避免做出不能用的漂亮 demo。',
    output: '測試清單、驗收證據、風險紀錄',
  },
];

const phases = [
  '找出營運斷點',
  '定義入口與狀態',
  '設計派工與提醒',
  '交付第一版工作流',
  '接上回報與資料',
  '複製到下一段流程',
];

const automationBlocks = [
  '客戶入口',
  'Lead 分級',
  '任務派工',
  '進度提醒',
  'Telegram 通知',
  '主管回報',
  '驗收證據',
  '數據儀表板',
  '回訪節奏',
  '風險提醒',
  '內容產線',
  '長期記憶',
];

function startDiagnosis(entryPoint: string) {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: entryPoint });
  window.location.href = `${DIAG_URL}/`;
}

export default function AboutPage() {
  const [active, setActive] = useState(0);
  const ActiveIcon = services[active].icon;

  return (
    <div className="orion-cinematic-site site-page">
      <PageSEO
        title="ORION AI 服務介紹｜老闆的 AI 副營運執行長"
        description="ORION AI 把企業的客戶入口、需求分流、任務派工、進度追蹤、主管回報、資料記憶與成交交付做成可執行的 AI 營運工作流。"
        url="/about"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">服務介紹</span>
          <h1>不是做一個 AI 功能，是請一位會盯流程的 AI 副營運執行長。</h1>
          <p>
            我們從每天最混亂的營運流程開始，不急著堆功能。先找出客戶從哪裡來、誰負責處理、多久要回、哪裡常卡住、老闆需要看什麼，再決定要接哪些工具、建立哪些任務、回收哪些資料。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_hero_cta')}>
            讓 ORION 拆你的工作流
            <ArrowRight size={18} />
          </button>
        </div>
        <CinematicVideo src="/videos/orion-bg-00-command.mp4" label="企業 AI 指揮中心資料牆影片" />
      </section>

      <section className="site-section service-lab">
        <div className="service-tabs" role="tablist" aria-label="ORION 服務模組">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <button
                key={service.title}
                className={active === index ? 'active' : ''}
                onClick={() => setActive(index)}
                type="button"
              >
                <Icon size={18} />
                {service.title}
              </button>
            );
          })}
        </div>

        <div className="service-detail">
          <span className="service-detail-icon">
            <ActiveIcon size={28} />
          </span>
          <h2>{services[active].title}</h2>
          <p>{services[active].desc}</p>
          <div className="service-output">
            <CheckCircle2 size={18} />
            <span>{services[active].output}</span>
          </div>
        </div>
      </section>

      <section className="site-section site-method-section reversed">
        <div className="method-copy">
          <span className="site-eyebrow">交付方法</span>
          <h2>從一個卡住的流程，到一套能被團隊每天使用的工作流。</h2>
          <div className="method-chain">
            {phases.map((phase, index) => (
              <div key={phase} className="method-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{phase}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="method-video-panel">
          <CinematicVideo src="/videos/orion-toolflow-card-loop.mp4" label="AI 營運工作流連接動畫" />
        </div>
      </section>

      <section className="site-section automation-map">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">可擴張模組</span>
          <h2>先做一條最有價值的流程，再一段一段接成公司的 AI 作業層。</h2>
          <p>每個模組都可以獨立交付，也可以接在一起形成完整營運轉換流程：從客戶入口、需求分流、任務派工、主管回報到成交交付與工程驗收。</p>
        </div>
        <div className="automation-grid">
          {automationBlocks.map((block, index) => (
            <div key={block}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{block}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="site-section site-final-command compact">
        <CinematicVideo src="/videos/orion-bg-01-core-devices.mp4" label="跨裝置企業 AI 工作流影片" />
        <div className="final-command-content">
          <span className="site-eyebrow">適合誰</span>
          <h2>適合每天被訊息、名單、訂單、團隊進度追著跑的企業主。</h2>
          <p>
            如果你只是想做一個好看的 demo，ORION 不是最便宜的選擇。如果你想把核心營運流程變成可複製、可追蹤、可交接的 AI 工作流，這正是 ORION 的位置。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_bottom_cta')}>
            啟動工作流診斷
            <Zap size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
