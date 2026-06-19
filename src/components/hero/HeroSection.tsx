import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import CinematicVideo from '../shared/CinematicVideo';
import { DIAG_URL } from '../../lib/api-base';
import { pushEvent } from '../../lib/analytics';
// 首頁 hero 無障礙對比強化樣式（WCAG AA），只作用於 .orion-hero-cinematic
import './hero-contrast.css';

const trustSignals = [
  '3 分鐘先拆一條流程',
  '不換系統也能先做',
  '輸出入口、派工、提醒、回報',
];

export default function HeroSection() {
  const [q, setQ] = useState('');
  const reduceMotion = useReducedMotion();

  const createHandoffToken = async (value: string) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(`${DIAG_URL}/api/handoff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, feedback: true }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.ok && typeof data.token === 'string') {
        return data.token;
      }
    } catch {
      // If handoff creation fails, keep the customer text out of the URL and open O normally.
    } finally {
      window.clearTimeout(timeout);
    }
    return '';
  };

  const submit = async (entryPoint: string, query = q) => {
    const trimmed = query.trim();
    pushEvent('chat_initiated', {
      flow_name: 'o',
      entry_point: entryPoint,
      has_query: trimmed.length > 0,
      query_length: trimmed.length,
    });
    if (trimmed) {
      try {
        window.sessionStorage.setItem('orionInitialQ', trimmed);
        window.sessionStorage.setItem('orionDiagnoseFeedback', '1');
      } catch {
        // Private browsing can block sessionStorage. In that case we still avoid putting the question in the URL.
      }
      try {
        window.name = `ORION_HANDOFF:${JSON.stringify({
          type: 'orionInitialQ',
          value: trimmed,
          feedback: true,
          ts: Date.now(),
        })}`;
      } catch {
        // window.name handoff is best-effort; the destination still opens without leaking the question in the URL.
      }
      const token = await createHandoffToken(trimmed);
      if (token) {
        window.location.href = `${DIAG_URL}/?handoff=${encodeURIComponent(token)}`;
        return;
      }
    }
    window.location.href = `${DIAG_URL}/`;
  };

  return (
    <section className="orion-hero-cinematic" aria-label="ORION AI 幫老闆追流程">
      <CinematicVideo
        src="/videos/runway-orion-executive-01.mp4"
        mobileSrc="/videos/mobile/orion-hero-command-mobile-9x16.mp4"
        mobilePosterSrc="/videos/posters/mobile/orion-hero-command-mobile-9x16.jpg"
        className="orion-hero-video"
        objectPosition="center center"
        mobileObjectPosition="center center"
        label="高級企業辦公室內的 AI 指揮中心背景影片"
      />
      <div className="orion-hero-aurora" aria-hidden="true" />
      <div className="orion-hero-grid" aria-hidden="true" />

      <div className="orion-hero-inner">
        <motion.div
          className="orion-hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="orion-kicker">
            <Sparkles size={14} />
            ORION AI OPERATING OFFICER
          </div>

          <h1>
            <span>做一套專屬你的智慧中樞營運系統</span>
            <strong>
              O AI 就是你的好幫手
            </strong>
          </h1>

          <p className="orion-hero-promise">
            只有你有想法，我就有辦法。重複性、覺得煩的工作，我全部幫你做成自動化流程。
          </p>

          <p className="orion-hero-subtitle">
            你只要說哪段工作最常卡：私訊沒回、報價後沒追、訂單交期卡住、回訪續約忘記，或團隊進度都要你問。ORION 會把它拆成一條每天會跑的流程：誰負責、多久要回、逾時怎麼提醒、老闆早上看什麼。
          </p>

          <form
            className="orion-hero-command"
            onSubmit={(event) => {
              event.preventDefault();
              submit('hero_command_input');
            }}
          >
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="例如：LINE 客人漏回、報價沒追"
              aria-label="輸入你想交給 O 幫忙追的工作"
            />
            <button type="submit">
              免費拆第一條流程
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="orion-hero-actions">
            <button type="button" className="orion-primary-btn" onClick={() => submit('hero_primary_cta', '')}>
              免費讓 O 拆一次
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="/cases">
              先看實戰案例
            </a>
          </div>

          <div className="orion-trust-strip" aria-label="ORION 核心能力">
            {trustSignals.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="orion-hero-visual"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="orion-command-frame">
            <CinematicVideo
              src="/videos/runway-orion-executive-02.mp4"
              mobileSrc="/videos/mobile/orion-command-frame-mobile-4x5.mp4"
              mobilePosterSrc="/videos/posters/mobile/orion-command-frame-mobile-4x5.jpg"
              className="orion-command-frame-video"
              objectPosition="center center"
              mobileObjectPosition="45% center"
              label="主管在透明螢幕前操作 AI 營運工作流的影片"
            />
            <div className="orion-command-hud">
              <span>
                <ShieldCheck size={15} />
                每天追蹤
              </span>
              <span>
                <Workflow size={15} />
                追蹤回報
              </span>
            </div>
          </div>

          <div className="orion-floating-label label-one">客戶入口</div>
          <div className="orion-floating-label label-two">派工</div>
          <div className="orion-floating-label label-three">回報</div>
        </motion.div>
      </div>
    </section>
  );
}
