import { useState } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, FileText, Network, ShieldCheck, Workflow, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';

const services = [
  {
    icon: BrainCircuit,
    title: 'AI 策略診斷',
    desc: '先判斷你的商業痛點是否值得做成系統，避免把低槓桿工作硬做成 AI。',
    output: '產業痛點地圖、ROI 假設、第一版系統藍圖',
  },
  {
    icon: Workflow,
    title: '工具調用工作流',
    desc: '把分析、試算、任務、通知、工程 prompt 與驗證節點串成一條可執行流程。',
    output: '工作流節點、工具清單、觸發條件',
  },
  {
    icon: Network,
    title: 'CRM 與任務系統',
    desc: '讓每個 lead、客戶、任務與回訪都有狀態，不再靠人腦記住下一步。',
    output: '客戶狀態、任務分派、跟進規則',
  },
  {
    icon: FileText,
    title: '報告與決策簡報',
    desc: '把診斷結果變成老闆看得懂、團隊能執行、工程能接手的交付文件。',
    output: 'AI 報告、工程規格、決策摘要',
  },
  {
    icon: Database,
    title: '資料回收與記憶',
    desc: '把每一次診斷、成交、回訪、驗收沉澱成資料，讓系統越用越準。',
    output: '資料欄位、回收節點、儀表板',
  },
  {
    icon: ShieldCheck,
    title: '驗證與風險控管',
    desc: '把 AI 輸出、工程交付、production 狀態與客戶流程分層驗證。',
    output: '測試清單、驗收證據、風險紀錄',
  },
];

const phases = [
  '釐清商業目標',
  '拆解流程與資料',
  '設計工具調用',
  '交付 MVP 系統',
  '接上追蹤與回饋',
  '長期優化與擴張',
];

const automationBlocks = [
  'AI 診斷入口',
  'Lead 分級',
  '報告生成',
  'CRM 任務',
  'Telegram 通知',
  '工程派工稿',
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
        title="ORION AI 服務介紹｜從想法到企業級 AI 系統"
        description="ORION AI 提供 AI 策略診斷、工具調用工作流、CRM 任務系統、報告生成、資料回收與工程交付，幫企業把模糊想法做成可複製系統。"
        url="/about"
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">服務介紹</span>
          <h1>ORION 不是賣一次專案，而是幫企業建立會長大的 AI 系統。</h1>
          <p>
            我們從商業問題開始，不急著堆功能。先找出真正有複利的流程，再決定要調用哪些工具、建立哪些任務、回收哪些資料、交付哪些工程模組。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_hero_cta')}>
            讓 ORION 拆你的系統
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
          <h2>從一個問題，到一套能被團隊使用的系統。</h2>
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
          <CinematicVideo src="/videos/orion-toolflow-card-loop.mp4" label="工具調用與流程連接動畫" />
        </div>
      </section>

      <section className="site-section automation-map">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">可擴張模組</span>
          <h2>ORION 會把零散工作變成可串接的企業作業層。</h2>
          <p>每個模組都可以獨立交付，也可以接在一起形成完整漏斗：從診斷、成交、任務、通知、工程到驗收。</p>
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
        <CinematicVideo src="/videos/orion-bg-01-core-devices.mp4" label="跨裝置企業 AI 系統影片" />
        <div className="final-command-content">
          <span className="site-eyebrow">適合誰</span>
          <h2>適合有商業痛點、願意系統化、想把 AI 變成長期資產的企業主。</h2>
          <p>
            如果你只是想做一個好看的 demo，ORION 不是最便宜的選擇。如果你想把核心流程變成可複製的 AI 系統，這正是 ORION 的位置。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_bottom_cta')}>
            啟動 AI 策略診斷
            <Zap size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
