import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import CinematicVideo from '../shared/CinematicVideo';
import { DIAG_URL } from '../../lib/api-base';
import { pushEvent } from '../../lib/analytics';

const trustSignals = [
  '客戶進來，先整理需求',
  '任務建立，派給負責人',
  '卡住逾時，提醒並回報',
];

export default function HeroSection() {
  const [q, setQ] = useState('');
  const reduceMotion = useReducedMotion();

  const submit = (entryPoint: string, query = q) => {
    const trimmed = query.trim();
    pushEvent('chat_initiated', {
      flow_name: 'o',
      entry_point: entryPoint,
      has_query: trimmed.length > 0,
      query_length: trimmed.length,
    });
    window.location.href = trimmed ? `${DIAG_URL}/?q=${encodeURIComponent(trimmed)}` : `${DIAG_URL}/`;
  };

  return (
    <section className="orion-hero-cinematic" aria-label="ORION AI 副營運執行長">
      <CinematicVideo
        src="/videos/runway-orion-executive-01.mp4"
        className="orion-hero-video"
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
            <span>不用多請一位營運主管</span>
            <strong>
              AI 副營運執行長
              <br />
              揪出隱形成本
            </strong>
          </h1>

          <p className="orion-hero-subtitle">
            客戶從 LINE、IG、表單或官網進來後，O 會先診斷哪裡正在造成利潤流失，整理需求與缺口，判斷急不急、該交給誰，接著建立任務、提醒負責人、追蹤卡點，最後盯到成交與交付，整理成老闆看得懂的進度回報與可沉澱的資料。
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
              placeholder="例如：客人私訊進來後，報價、追單、交付常常斷掉"
              aria-label="輸入你想交給 AI 副營運執行長接手的工作流"
            />
            <button type="submit">
              拆工作流
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="orion-hero-actions">
            <button type="button" className="orion-primary-btn" onClick={() => submit('hero_primary_cta', '')}>
              讓 O 拆一條營運工作流
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="#tool-calling-workflow">
              看 O 怎麼盯到成交與交付
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
              className="orion-command-frame-video"
              label="主管在透明螢幕前操作 AI 營運工作流的影片"
            />
            <div className="orion-command-hud">
              <span>
                <ShieldCheck size={15} />
                營運工作流
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
