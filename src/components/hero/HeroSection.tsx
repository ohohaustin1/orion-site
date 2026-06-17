import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import CinematicVideo from '../shared/CinematicVideo';
import { DIAG_URL } from '../../lib/api-base';
import { pushEvent } from '../../lib/analytics';

const trustSignals = [
  '策略判斷變成流程',
  '工具調用變成任務',
  '數據回收變成複利',
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
    <section className="orion-hero-cinematic" aria-label="ORION AI 企業級 AI 指揮中心">
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
            ORION AI COMMAND CENTER
          </div>

          <h1>
            <span>把模糊想法</span>
            <strong>變成會執行的企業系統</strong>
          </h1>

          <p className="orion-hero-subtitle">
            ORION 將策略判斷、流程設計、工具調用、資料回收與工程交付，整合成一套可複製、可放大、可持續演化的企業級 AI 決策基礎建設。
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
              placeholder="輸入你的產業、痛點或想做的 AI 系統"
              aria-label="輸入你的產業、痛點或想做的 AI 系統"
            />
            <button type="submit">
              啟動診斷
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="orion-hero-actions">
            <button type="button" className="orion-primary-btn" onClick={() => submit('hero_primary_cta', '')}>
              啟動你的 AI 系統
              <ArrowRight size={18} />
            </button>
            <a className="orion-secondary-btn" href="#tool-calling-workflow">
              查看工具調用流程
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
              label="主管在透明螢幕前操作 AI 系統的影片"
            />
            <div className="orion-command-hud">
              <span>
                <ShieldCheck size={15} />
                企業級決策中樞
              </span>
              <span>
                <Workflow size={15} />
                工具調用工作流
              </span>
            </div>
          </div>

          <div className="orion-floating-label label-one">策略拆解</div>
          <div className="orion-floating-label label-two">任務派工</div>
          <div className="orion-floating-label label-three">資料記憶</div>
        </motion.div>
      </div>
    </section>
  );
}
