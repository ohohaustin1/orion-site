import { useState } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, FileText, Network, ShieldCheck, Workflow, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';
import { ORION_CONTACT, ORION_KEYWORDS } from '../lib/contact';

const services = [
  {
    icon: BrainCircuit,
    title: '找出最常卡住的事',
    desc: '先找出客人、報價、訂單、回訪或團隊進度哪裡最常卡住，再決定第一版 O 要先追哪一段。',
    output: '常卡流程、負責人、第一版追蹤清單',
  },
  {
    icon: Workflow,
    title: '接住客人和任務',
    desc: '把 LINE、IG、官網表單、CRM、內部任務或人工回報整理到同一條線，先不要讓事情散掉。',
    output: '入口清單、基本欄位、處理狀態',
  },
  {
    icon: Network,
    title: '把下一步派出去',
    desc: '讓每個客人、名單、訂單與內部任務都有負責人、下一步和提醒時間，不再只靠人記。',
    output: '負責人、下一步、逾時提醒',
  },
  {
    icon: FileText,
    title: '每天回報給老闆',
    desc: '把今天完成什麼、卡住什麼、誰還沒處理、哪裡需要老闆判斷，整理成可以直接看的回報。',
    output: '每日摘要、卡點清單、下一步建議',
  },
  {
    icon: Database,
    title: '留下客戶記憶',
    desc: '把每一次訊息、追蹤、成交、流失和回訪留下紀錄，讓下一次不用重新問、重新整理。',
    output: '客戶紀錄、回訪節點、主管儀表板',
  },
  {
    icon: ShieldCheck,
    title: '確認真的能用',
    desc: '不是做漂亮畫面就結束，而是確認客人進得來、任務派得出去、提醒會送、老闆看得到回報。',
    output: '測試清單、畫面證據、風險紀錄',
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
        title="ORION AI 服務介紹｜企業 AI 自動化、AI 工作流、AI 客戶追蹤"
        description="ORION AI 幫企業把客人訊息、報價追蹤、任務派工、逾時提醒、主管回報與客戶紀錄做成每天可執行的 AI 自動化系統。"
        url="/about"
        keywords={ORION_KEYWORDS}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${ORION_CONTACT.siteUrl}/about#service`,
          name: 'ORION AI 企業 AI 自動化服務',
          serviceType: '企業 AI 自動化、AI 工作流自動化、AI 客戶追蹤系統',
          provider: { '@id': `${ORION_CONTACT.siteUrl}/#org` },
          url: `${ORION_CONTACT.siteUrl}/about`,
          description: 'ORION AI 幫企業把客人訊息、報價追蹤、任務派工、逾時提醒、主管回報與客戶紀錄做成每天可執行的 AI 自動化系統。',
        }}
      />

      <section className="site-page-hero split">
        <div>
          <span className="site-eyebrow">服務介紹</span>
          <h1>不是多買一個 AI 工具，是把每天要追人的事交給 O。</h1>
          <p>
            我們不急著堆功能。先找出客人從哪裡來、誰要處理、多久要回、哪裡常卡住、老闆每天要看什麼，再決定要接哪些工具、建立哪些提醒、留下哪些資料。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_hero_cta')}>
            讓 O 幫我拆流程
            <ArrowRight size={18} />
          </button>
        </div>
        <CinematicVideo
          src="/videos/runway-orion-executive-03.mp4"
          label="企業主管檢視 AI 任務追蹤系統影片"
          mobileObjectPosition="48% center"
        />
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
          <h2>從一件每天都要追的事，變成團隊每天會照著跑的系統。</h2>
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
          <CinematicVideo
            src="/videos/orion-toolflow-card-loop.mp4"
            label="AI 營運工作流連接動畫"
            mobileMode="poster"
            mobileObjectPosition="52% center"
          />
        </div>
      </section>

      <section className="site-section automation-map">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">可擴張模組</span>
          <h2>先做一段最痛的流程，再一段一段接成公司的 AI 作業層。</h2>
          <p>每個模組都可以獨立交付，也可以接在一起：從客人進來、誰要處理、多久提醒、怎麼回報，到成交後留下資料。</p>
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
        <CinematicVideo
          src="/videos/orion-bg-01-core-devices.mp4"
          label="跨裝置企業 AI 工作流影片"
          mobileMode="poster"
          mobileObjectPosition="50% center"
        />
        <div className="final-command-content">
          <span className="site-eyebrow">適合誰</span>
          <h2>適合每天被訊息、名單、訂單、團隊進度追著跑的老闆。</h2>
          <p>
            如果你想要的是「客人有人接、報價有人追、任務有人做、老闆每天看得到回報」，這才是 ORION 的位置。
          </p>
          <button className="orion-primary-btn" onClick={() => startDiagnosis('about_bottom_cta')}>
            讓 O 幫我看哪裡卡住
            <Zap size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
