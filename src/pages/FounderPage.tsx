import { ArrowRight, Mail, MessageCircle, ShieldCheck, Workflow, Zap } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';
import { ORION_CONTACT, ORION_KEYWORDS } from '../lib/contact';

const founderUrl = `${ORION_CONTACT.siteUrl}/founder-austin-xu-yaochen`;

const founderJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${founderUrl}#person`,
      name: 'Austin 許燿宸',
      alternateName: ['許燿宸', 'Austin Hsu', 'Austin Xu', 'Austin Chen'],
      url: founderUrl,
      image: `${ORION_CONTACT.siteUrl}/team/AUSTIN.png`,
      jobTitle: 'ORION AI 創辦人',
      founder: { '@id': `${ORION_CONTACT.siteUrl}/#org` },
      worksFor: { '@id': `${ORION_CONTACT.siteUrl}/#org` },
      email: ORION_CONTACT.email,
      sameAs: [ORION_CONTACT.siteUrl],
      description: 'Austin 許燿宸是 ORION AI 創辦人，專注於幫企業把客戶訊息、報價追蹤、任務派工、主管回報與資料記憶做成 AI 自動化系統。',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'business',
        email: ORION_CONTACT.email,
        url: ORION_CONTACT.lineUrl,
        availableLanguage: ['zh-TW'],
      },
    },
  ],
};

function startDiagnosis() {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: 'founder_page_cta' });
  window.location.href = `${DIAG_URL}/`;
}

export default function FounderPage() {
  return (
    <div className="orion-cinematic-site site-page founder-page">
      <PageSEO
        title="Austin 許燿宸｜ORION AI 創辦人"
        description="Austin 許燿宸是 ORION AI 創辦人，專注於企業 AI 自動化、AI 工作流、客戶追蹤、任務派工與主管回報系統。"
        url="/founder-austin-xu-yaochen"
        keywords={ORION_KEYWORDS}
        jsonLd={founderJsonLd}
      />

      <section className="site-page-hero split founder-hero">
        <div>
          <span className="site-eyebrow">ORION AI Founder</span>
          <h1>Austin 許燿宸，ORION AI 創辦人。</h1>
          <p>
            ORION AI 的核心任務，是幫企業把「每天需要人追的事」做成 AI 可以提醒、派工、追蹤、回報、沉澱資料的系統。
          </p>
          <div className="seo-hero-actions">
            <button className="orion-primary-btn" onClick={startDiagnosis}>
              讓 O 幫我拆流程
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="/enterprise-ai-automation">
              企業 AI 自動化說明
            </a>
          </div>
        </div>
        <div className="founder-portrait-panel">
          <img src="/team/AUSTIN.png" alt="Austin 許燿宸 ORION AI 創辦人" />
          <div>
            <strong>Austin 許燿宸</strong>
            <span>ORION AI 創辦人｜企業 AI 自動化</span>
          </div>
        </div>
      </section>

      <section className="site-section founder-positioning">
        <article>
          <ShieldCheck size={24} />
          <h2>我做的不是單一工具。</h2>
          <p>真正有價值的是把客戶、訂單、任務、回訪、主管回報串成一套每天會跑的流程。</p>
        </article>
        <article>
          <Workflow size={24} />
          <h2>我幫企業先找最痛的一段。</h2>
          <p>不是一開始就做大系統，而是先找最常漏、最常卡、最常需要老闆追的地方。</p>
        </article>
        <article>
          <Zap size={24} />
          <h2>目標是讓系統自己長大。</h2>
          <p>第一條流程跑起來後，把欄位、提醒、回報規則複製到下一段，讓資料持續累積。</p>
        </article>
      </section>

      <section className="site-section site-method-section reversed">
        <div className="method-copy">
          <span className="site-eyebrow">Austin 的 ORION 方法</span>
          <h2>從老闆每天最常追的一件事開始。</h2>
          <div className="method-chain">
            {['找出營運斷點', '定義入口與責任人', '建立提醒與回報', '交給 O 每天追', '把結果變成資料'].map((step, index) => (
              <div key={step} className="method-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="method-video-panel">
          <CinematicVideo
            src="/videos/orion-executive-board-pan.mp4"
            label="企業主管與 AI 指揮中心協作影片"
            mobileMode="poster"
            mobileObjectPosition="50% center"
          />
        </div>
      </section>

      <section className="site-section seo-contact-panel">
        <div>
          <span className="site-eyebrow">聯絡 Austin</span>
          <h2>如果你想讓 ORION 幫公司做第一條 AI 自動化流程，直接把情境講出來。</h2>
          <p>說明你的產業、客戶從哪裡來、哪件事最常漏、誰現在負責、老闆每天最常追什麼。</p>
        </div>
        <div className="seo-contact-actions">
          <a href={ORION_CONTACT.lineUrl}>
            <MessageCircle size={18} />
            LINE ID：{ORION_CONTACT.lineId}
          </a>
          <a href={`mailto:${ORION_CONTACT.email}`}>
            <Mail size={18} />
            {ORION_CONTACT.email}
          </a>
        </div>
      </section>
    </div>
  );
}
