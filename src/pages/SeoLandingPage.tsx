import { ArrowRight, CheckCircle2, Mail, MessageCircle, ShieldCheck, Workflow } from 'lucide-react';
import PageSEO from '../components/PageSEO';
import CinematicVideo from '../components/shared/CinematicVideo';
import { SEO_LANDING_PAGES, type SeoLandingSlug } from '../data/seoLandingPages';
import { DIAG_URL } from '../lib/api-base';
import { pushEvent } from '../lib/analytics';
import { ORION_CONTACT } from '../lib/contact';

interface SeoLandingPageProps {
  slug: SeoLandingSlug;
}

function startDiagnosis(slug: SeoLandingSlug, entryPoint: string) {
  pushEvent('chat_initiated', { flow_name: 'o', entry_point: entryPoint, seo_page: slug });
  window.location.href = `${DIAG_URL}/`;
}

function buildJsonLd(page: ReturnType<typeof getPage>) {
  const pageUrl = `${ORION_CONTACT.siteUrl}/${page.slug}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: page.primaryKeyword,
        serviceType: page.primaryKeyword,
        provider: { '@id': `${ORION_CONTACT.siteUrl}/#org` },
        areaServed: ['Taiwan', '台灣'],
        audience: {
          '@type': 'BusinessAudience',
          audienceType: '中小企業老闆、服務業、電商、餐飲、製造、顧問團隊',
        },
        description: page.description,
        url: pageUrl,
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: page.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'ContactPoint',
        '@id': `${pageUrl}#contact`,
        contactType: 'sales',
        email: ORION_CONTACT.email,
        url: ORION_CONTACT.lineUrl,
        availableLanguage: ['zh-TW'],
      },
    ],
  };
}

function getPage(slug: SeoLandingSlug) {
  return SEO_LANDING_PAGES[slug];
}

export default function SeoLandingPage({ slug }: SeoLandingPageProps) {
  const page = getPage(slug);

  return (
    <div className="orion-cinematic-site site-page seo-answer-page">
      <PageSEO
        title={page.title}
        description={page.description}
        url={`/${page.slug}`}
        keywords={page.keywords}
        jsonLd={buildJsonLd(page)}
      />

      <section className="site-page-hero split seo-hero">
        <div>
          <span className="site-eyebrow">{page.eyebrow}</span>
          <h1>{page.h1}</h1>
          <p>{page.summary}</p>
          <div className="seo-hero-actions">
            <button className="orion-primary-btn" onClick={() => startDiagnosis(slug, 'seo_hero_cta')}>
              讓 O 幫我拆一條流程
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="/cases">
              看實戰案例
            </a>
          </div>
        </div>
        <CinematicVideo
          src={page.video}
          label={page.videoLabel}
          mobileMode="poster"
          mobileObjectPosition="50% center"
        />
      </section>

      <section className="site-section seo-answer-strip" aria-label={`${page.primaryKeyword} 核心答案`}>
        <article>
          <Workflow size={24} />
          <h2>一句話答案</h2>
          <p>{page.summary}</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <h2>ORION 的位置</h2>
          <p>不是賣單一工具，而是幫企業把卡住的流程做成可提醒、可派工、可追蹤、可回報的 AI 作業層。</p>
        </article>
      </section>

      <section className="site-section seo-two-column">
        <div>
          <span className="site-eyebrow">老闆會遇到的問題</span>
          <h2>客戶不是突然消失，通常是流程中間沒有人盯。</h2>
          <div className="seo-list">
            {page.pains.map((pain) => (
              <p key={pain}>{pain}</p>
            ))}
          </div>
        </div>
        <div>
          <span className="site-eyebrow">導入後要看到的結果</span>
          <h2>不是多一個聊天視窗，而是每天少掉一批需要老闆追的事。</h2>
          <div className="seo-check-list">
            {page.outcomes.map((outcome) => (
              <p key={outcome}>
                <CheckCircle2 size={18} />
                {outcome}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section seo-explainer-grid">
        {page.sections.map((section, index) => (
          <article key={section.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            <ul>
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="site-section seo-contact-panel">
        <div>
          <span className="site-eyebrow">直接聯絡</span>
          <h2>想知道你的公司第一條 AI 自動化流程該做哪一段，直接找 Austin。</h2>
          <p>
            你不用先寫企劃書。先說產業、目前最常漏掉的客人或任務、誰負責、多久要回報，ORION 會先幫你拆成第一版可執行流程。
          </p>
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

      <section className="site-section seo-faq-section">
        <div className="site-section-header narrow">
          <span className="site-eyebrow">FAQ</span>
          <h2>讓 AI 搜尋與客戶都看得懂的直接答案。</h2>
        </div>
        <div className="seo-faq-grid">
          {page.faqs.map((faq) => (
            <article key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
