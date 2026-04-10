import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ParticleBackground } from '@/components/ParticleBackground';
import MermaidChart from '@/components/MermaidChart';
import { exportAnalysisPDF } from '@/lib/exportPDF';
import { generateEngineeringPrompt } from '@/lib/exportPrompt';
import { trpc } from '@/lib/trpc';
import { ContactFormModal } from '@/components/ContactFormModal';
import {
  Send, Mic, MicOff, Download, Share2, ArrowLeft,
  Loader2, AlertTriangle, CheckCircle2, ChevronRight,
  Brain, Target, Zap, ShieldAlert, BarChart3, Users, GitBranch,
  MessageSquare, ChevronDown, ChevronUp, Terminal,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
}

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

// G2: Updated AnalysisResult type with new fields
interface AnalysisResult {
  status: 'ok';
  demand_summary: {
    core_need: string;
    business_context: string;
    stakeholders: string[];
    success_criteria: string[];
  };
  pain_quantification: {
    pains: Array<{
      description: string;
      severity: number;
      financial_impact: string;
    }>;
  };
  contradiction_detection: {
    level: 'Low' | 'Mid' | 'High';
    desc: string;
    contradictions: Array<{
      statement_a: string;
      statement_b: string;
      root_cause: string;
      resolution_path: string;
    }>;
  };
  ai_entry_points: {
    opportunities: Array<{
      title: string;
      description: string;
      roi_estimate: string;
      implementation_difficulty: 'low' | 'medium' | 'high';
    }>;
  };
  agent_blueprint: {
    agents: Array<{ name: string; role: string; capabilities: string[] }>;
    workflow: string;
    tech_stack: string[];
    human_in_the_loop_points: string[];
  };
  human_in_the_loop_points: string[];
  delivery_requirements: string;
  open_questions_for_engineering: string[];
  mermaid_diagram?: string;
}

// G1: Probing state
interface ProbingState {
  questions: string[];
  missing_dimensions: string[];
  partial_analysis: {
    demand_summary: string;
    pain_points: string[];
    org_structure: string;
    current_workflow: string;
  };
}

type TabId = 'summary' | 'pain' | 'contradiction' | 'ai' | 'blueprint';

// ─── Shared style objects ─────────────────────────────────────────────────────

const panelBlock: React.CSSProperties = {
  background: 'var(--orion-bg-void)',
  border: '1px solid var(--orion-border-gold)',
  borderRadius: 'var(--orion-radius-md)',
  padding: '14px',
  marginBottom: '10px',
};
const monoLabel: React.CSSProperties = {
  fontFamily: 'var(--orion-font-mono)',
  fontSize: '0.625rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'var(--orion-gold)',
  marginBottom: '8px',
  display: 'block',
};
const bodyText: React.CSSProperties = {
  color: 'var(--orion-text-primary)',
  fontSize: '0.9375rem',
  lineHeight: 1.6,
  fontWeight: 500,
};
const descText: React.CSSProperties = {
  color: 'var(--orion-text-secondary)',
  fontSize: '0.875rem',
  lineHeight: 1.6,
};

// ─── G3: DeliveryPathMap Component ───────────────────────────────────────────

const DeliveryPathMap = memo(({ humanInTheLoopPoints, automationNodes }: {
  humanInTheLoopPoints: string[] | null;
  automationNodes?: string[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasIntervention = humanInTheLoopPoints !== null && humanInTheLoopPoints.length > 0;
  const isAnalyzed = humanInTheLoopPoints !== null;
  const hasAutomation = automationNodes && automationNodes.length > 0;

  // If we have real automation_nodes data, build dynamic nodes; otherwise use static 5-node fallback
  const buildNodes = () => {
    if (!hasAutomation || !automationNodes) {
      // Static fallback
      return [
        { id: 'input',    label: '輸入',     icon: MessageSquare, type: 'normal' as const },
        { id: 'analysis', label: '需求分析', icon: Brain,         type: 'normal' as const },
        { id: 'agent',    label: 'Agent 執行', icon: Zap,           type: 'normal' as const },
        { id: 'human',    label: '人工介入點', icon: Users,         type: 'human' as const },
        { id: 'output',   label: '交付輸出', icon: GitBranch,    type: 'normal' as const },
      ];
    }
    // Dynamic nodes: merge automation + human nodes, up to 7
    const allNodes: Array<{ id: string; label: string; icon: React.ElementType; type: 'auto' | 'human' | 'normal' }> = [];
    // Start node
    allNodes.push({ id: 'input', label: '輸入', icon: MessageSquare, type: 'normal' });
    // Automation nodes (up to 3)
    const autoSlice = automationNodes.slice(0, 3);
    autoSlice.forEach((n, i) => allNodes.push({ id: `auto_${i}`, label: n, icon: Zap, type: 'auto' }));
    // Human nodes (up to 2)
    const humanSlice = (humanInTheLoopPoints ?? []).slice(0, 2);
    humanSlice.forEach((n, i) => allNodes.push({ id: `human_${i}`, label: n, icon: Users, type: 'human' }));
    // Output node
    allNodes.push({ id: 'output', label: '交付輸出', icon: GitBranch, type: 'normal' });
    // Cap at 7
    return allNodes.slice(0, 7);
  };

  const nodes = buildNodes();

  return (
    <div style={{
      border: '1px solid var(--orion-border-gold)',
      borderRadius: 'var(--orion-radius-md)',
      background: 'var(--orion-bg-panel)',
      marginTop: 12,
      overflow: 'hidden',
    }}>
      <div className="orion-panel-header">
        <GitBranch style={{ width: 12, height: 12, color: 'var(--orion-gold)' }} />
        <span className="orion-panel-title">DELIVERY PATH MAP</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: 'var(--orion-text-tertiary)' }}>
          {!isAnalyzed ? '等待分析' : hasIntervention ? `${humanInTheLoopPoints.length} 個人工介入點` : '全自動流程'}
        </span>
      </div>
      <div style={{ padding: '12px 14px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 'max-content' }}>
          {nodes.map((node, idx) => {
            const Icon = node.icon;
            const nodeType = (node as any).type as 'auto' | 'human' | 'normal';
            const isHumanNode = nodeType === 'human';
            const isAutoNode = nodeType === 'auto';
            const active = isAnalyzed && isHumanNode && hasIntervention;
            const inactive = !isAnalyzed;

            let nodeStyle: React.CSSProperties = {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 5,
              padding: '8px 12px',
              borderRadius: 'var(--orion-radius-md)',
              border: '1px solid var(--orion-border-gold)',
              background: 'var(--orion-bg-raised)',
              cursor: isHumanNode && isAnalyzed ? 'pointer' : 'default',
              position: 'relative',
              transition: 'all 0.15s ease',
              minWidth: 72,
            };

            if (inactive) {
              nodeStyle = { ...nodeStyle, opacity: 0.4 };
            } else if (isAutoNode) {
              nodeStyle = {
                ...nodeStyle,
                background: 'rgba(96,165,250,0.12)',
                border: '1px solid rgba(96,165,250,0.5)',
              };
            } else if (isHumanNode) {
              if (hasIntervention || active) {
                nodeStyle = {
                  ...nodeStyle,
                  background: 'rgba(201,168,76,0.18)',
                  border: '1px solid #c9a84c',
                  boxShadow: '0 0 10px rgba(201,168,76,0.2)',
                };
              } else {
                // empty: grey dashed
                nodeStyle = {
                  ...nodeStyle,
                  border: '1px dashed rgba(255,255,255,0.2)',
                  background: 'transparent',
                  opacity: 0.5,
                };
              }
            }

            return (
              <React.Fragment key={node.id}>
                <div
                  style={nodeStyle}
                  onClick={() => isHumanNode && isAnalyzed && hasIntervention && setExpanded(p => !p)}
                >
                  {/* Auto badge */}
                  {isAutoNode && isAnalyzed && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -4,
                      background: 'rgba(96,165,250,0.9)',
                      color: '#0a0d14',
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: 'var(--orion-font-mono)',
                      padding: '1px 4px',
                      borderRadius: 2,
                      letterSpacing: '0.04em',
                    }}>⚡ AUTO</span>
                  )}
                  {/* Human badge */}
                  {isHumanNode && isAnalyzed && hasIntervention && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -4,
                      background: 'rgba(201,168,76,0.9)',
                      color: '#0a0d14',
                      fontSize: '9px',
                      fontWeight: 700,
                      fontFamily: 'var(--orion-font-mono)',
                      padding: '1px 4px',
                      borderRadius: 2,
                      letterSpacing: '0.04em',
                    }}>👤 HUMAN</span>
                  )}
                  {/* Red dot for human intervention */}
                  {active && (
                    <span style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--orion-status-alert)',
                      boxShadow: '0 0 6px rgba(248,113,113,0.6)',
                    }} />
                  )}
                  <Icon style={{
                    width: 14,
                    height: 14,
                    color: isAutoNode && isAnalyzed ? '#60a5fa'
                      : (active || (isHumanNode && hasIntervention)) ? 'var(--orion-gold)'
                      : isAnalyzed ? 'var(--orion-text-secondary)' : 'var(--orion-text-tertiary)',
                  }} />
                  <span style={{
                    fontFamily: 'var(--orion-font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.06em',
                    color: isAutoNode && isAnalyzed ? '#60a5fa'
                      : (active || (isHumanNode && hasIntervention)) ? 'var(--orion-gold)'
                      : isAnalyzed ? 'var(--orion-text-secondary)' : 'var(--orion-text-tertiary)',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}>
                    {node.label}
                  </span>
                  {active && (
                    <span style={{ color: 'var(--orion-gold)', display: 'flex' }}>
                      {expanded ? <ChevronUp style={{ width: 10, height: 10 }} /> : <ChevronDown style={{ width: 10, height: 10 }} />}
                    </span>
                  )}
                </div>
                {/* Arrow between nodes */}
                {idx < nodes.length - 1 && (
                  <div style={{
                    width: 20,
                    height: 1,
                    background: isAnalyzed ? 'var(--orion-border-gold-hi)' : 'var(--orion-border-gold)',
                    flexShrink: 0,
                    position: 'relative',
                  }}>
                    <span style={{
                      position: 'absolute',
                      right: -1,
                      top: -3,
                      width: 0,
                      height: 0,
                      borderTop: '3px solid transparent',
                      borderBottom: '3px solid transparent',
                      borderLeft: `5px solid ${isAnalyzed ? 'var(--orion-border-gold-hi)' : 'var(--orion-border-gold)'}`,
                    }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Expanded intervention list */}
        {expanded && hasIntervention && humanInTheLoopPoints && (
          <div style={{
            marginTop: 10,
            padding: '10px 12px',
            background: 'var(--orion-bg-void)',
            border: '1px solid var(--orion-border-gold)',
            borderRadius: 'var(--orion-radius-sm)',
          }}>
            <span style={{ ...monoLabel, marginBottom: 8 }}>人工介入點清單</span>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {humanInTheLoopPoints.map((point, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                  <Users style={{ width: 11, height: 11, color: 'var(--orion-gold)', flexShrink: 0, marginTop: 3 }} />
                  <span style={descText}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Legend */}
        {isAnalyzed && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 14,
            marginTop: 10,
            paddingTop: 8,
            borderTop: '1px solid rgba(201,168,76,0.1)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: '#60a5fa' }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: 'rgba(96,165,250,0.4)', border: '1px solid rgba(96,165,250,0.6)', display: 'inline-block' }} />
              ⚡ Near-zero Marginal Cost
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: 'var(--orion-gold)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: 'rgba(201,168,76,0.3)', border: '1px solid #c9a84c', display: 'inline-block' }} />
              👤 High-Value Human Decision
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

// ─── G1: Probing Panel ────────────────────────────────────────────────────────

const ProbingPanel = memo(({
  probing,
  onSubmit,
  isAnalyzing,
}: {
  probing: ProbingState;
  onSubmit: (answers: Record<number, string>) => void;
  isAnalyzing: boolean;
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSubmit = () => {
    const filled = probing.questions.every((_, i) => (answers[i] ?? '').trim().length > 0);
    if (!filled) { toast.error('請回答所有追問後再提交'); return; }
    onSubmit(answers);
    setAnswers({});
  };

  return (
    <div style={{
      border: '1px solid var(--orion-border-gold)',
      borderTop: '2px solid var(--orion-status-warn)',
      borderRadius: 'var(--orion-radius-md)',
      background: 'var(--orion-bg-panel)',
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <AlertTriangle style={{ width: 13, height: 13, color: 'var(--orion-status-warn)' }} />
        <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--orion-status-warn)', letterSpacing: '0.1em' }}>
          INFORMATION GAP DETECTED
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {probing.missing_dimensions.map((d, i) => (
          <span key={i} style={{
            padding: '2px 8px', borderRadius: 3,
            fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem',
            color: 'var(--orion-status-warn)',
            background: 'rgba(251,191,36,0.08)',
            border: '1px solid rgba(251,191,36,0.3)',
          }}>{d}</span>
        ))}
      </div>
      {probing.questions.map((q, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', color: 'var(--orion-text-primary)', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--orion-gold)', marginRight: 6 }}>Q{i + 1}.</span>{q}
          </p>
          <textarea
            value={answers[i] ?? ''}
            onChange={e => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
            disabled={isAnalyzing}
            rows={2}
            className="orion-input"
            style={{ resize: 'none', fontSize: '0.875rem' }}
            placeholder="請輸入您的回答..."
          />
        </div>
      ))}
      <button
        onClick={handleSubmit}
        disabled={isAnalyzing}
        style={{
          padding: '9px 16px',
          background: isAnalyzing ? 'var(--orion-bg-active)' : 'var(--orion-gold)',
          border: 'none',
          borderRadius: 'var(--orion-radius-md)',
          color: isAnalyzing ? 'var(--orion-text-tertiary)' : 'var(--orion-bg-base)',
          fontFamily: 'var(--orion-font-mono)',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 0.12s ease',
        }}
      >
        {isAnalyzing
          ? <><Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} />分析中...</>
          : <><Send style={{ width: 12, height: 12 }} />提交回答</>}
      </button>
    </div>
  );
});

// ─── Left Panel ───────────────────────────────────────────────────────────────

const LeftPanel = memo(({
  messages, isAnalyzing, inputValue, isRecording, recordingTime,
  probing, onInputChange, onKeyDown, onSend, onToggleRecording,
  onProbingSubmit, onNewAnalysis,
  messagesEndRef, textareaRef, quickOptions, quickOptionsHint, streamingTokens, loadingMsgIndex,
}: {
  messages: Message[];
  isAnalyzing: boolean;
  inputValue: string;
  isRecording: boolean;
  recordingTime: number;
  probing: ProbingState | null;
  onInputChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: (text?: string) => void;
  onToggleRecording: () => void;
  onProbingSubmit: (answers: Record<number, string>) => void;
  onNewAnalysis: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  quickOptions: string[];
  quickOptionsHint?: string;
  streamingTokens?: string;
  loadingMsgIndex: number;
}) => {
  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)', background: 'var(--orion-bg-panel)' }}>
      <div className="orion-panel-header">
        <Brain style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
        <span className="orion-panel-title">LOGIC SANDBOX</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)' }}>需求輸入 · 深度解構</span>
        {messages.length > 0 && (
          <button
            onClick={onNewAnalysis}
            style={{ marginLeft: 8, padding: '2px 8px', border: '1px solid var(--orion-border-gold)', borderRadius: 3, background: 'transparent', color: 'var(--orion-text-secondary)', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', cursor: 'pointer', letterSpacing: '0.08em' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--orion-gold)'; el.style.borderColor = 'var(--orion-border-gold-hi)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = 'var(--orion-text-secondary)'; el.style.borderColor = 'var(--orion-border-gold)'; }}
          >
            新分析
          </button>
        )}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Brain style={{ width: 20, height: 20, color: 'var(--orion-gold)', opacity: 0.7 }} />
            </div>
            <p style={{ color: 'var(--orion-text-primary)', fontWeight: 600, marginBottom: 6, fontSize: '0.9375rem' }}>輸入業務需求</p>
            <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.8125rem', marginBottom: 16, lineHeight: 1.6 }}>
              ORION 將為您進行深度解構分析<br />識別痛點、矛盾與 AI 切入機會
            </p>
            {quickOptionsHint && (
              <p style={{ color: 'var(--orion-text-tertiary)', fontSize: '0.75rem', marginBottom: 4, fontFamily: 'var(--orion-font-mono)', letterSpacing: '0.04em' }}>{quickOptionsHint}</p>
            )}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {quickOptions.map((opt, i) => (
                <button key={i} onClick={() => onSend(opt)} disabled={isAnalyzing}
                  style={{ width: '100%', textAlign: 'left', padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 8, border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-md)', background: 'transparent', color: 'var(--orion-text-secondary)', fontSize: '0.8125rem', cursor: 'pointer', transition: 'all 0.12s ease' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--orion-gold-10)'; el.style.color = 'var(--orion-text-primary)'; el.style.borderColor = 'var(--orion-border-gold-hi)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--orion-text-secondary)'; el.style.borderColor = 'var(--orion-border-gold)'; }}
                >
                  <ChevronRight style={{ width: 12, height: 12, color: 'var(--orion-gold)', flexShrink: 0 }} />
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.type !== 'user' && (
                <div style={{ width: 24, height: 24, borderRadius: 3, background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 7, flexShrink: 0, marginTop: 2 }}>
                  {msg.type === 'system'
                    ? <AlertTriangle style={{ width: 10, height: 10, color: 'var(--orion-status-warn)' }} />
                    : <Brain style={{ width: 10, height: 10, color: 'var(--orion-gold)' }} />}
                </div>
              )}
              <div style={{
                maxWidth: '80%', padding: '8px 12px', borderRadius: 3, fontSize: '0.875rem', lineHeight: 1.6,
                ...(msg.type === 'user'
                  ? { background: 'var(--orion-gold-15)', border: '1px solid var(--orion-border-gold-hi)', color: 'var(--orion-text-primary)' }
                  : msg.type === 'system'
                    ? { background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)', color: 'var(--orion-status-alert)' }
                    : { background: 'var(--orion-bg-raised)', border: '1px solid var(--orion-border-gold)', color: 'var(--orion-text-primary)' })
              }}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {isAnalyzing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ width: 24, height: 24, borderRadius: 3, background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 7, flexShrink: 0 }}>
              <Loader2 style={{ width: 10, height: 10, color: 'var(--orion-gold)', animation: 'spin 1s linear infinite' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {streamingTokens ? (
                <div style={{
                  background: 'var(--orion-bg-raised)',
                  borderLeft: '2px solid var(--orion-gold)',
                  borderRadius: '0 3px 3px 0',
                  padding: '8px 12px',
                  maxHeight: 200,
                  overflowY: 'auto',
                  fontFamily: 'var(--orion-font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--orion-text-secondary)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  {streamingTokens}
                </div>
              ) : (
                <div style={{ background: 'var(--orion-bg-raised)', border: '1px solid var(--orion-border-gold)', borderRadius: 3, padding: '8px 12px', fontSize: '0.875rem', color: 'var(--orion-text-secondary)', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Loader2 style={{ width: 10, height: 10, animation: 'spin 1s linear infinite' }} />
                  {LOADING_MESSAGES[loadingMsgIndex]}
                </div>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* G1: Probing panel replaces input when probing */}
      {probing ? (
        <div style={{ borderTop: '1px solid var(--orion-border-gold)', padding: '10px 12px', background: 'var(--orion-bg-raised)' }}>
          <ProbingPanel probing={probing} onSubmit={onProbingSubmit} isAnalyzing={isAnalyzing} />
        </div>
      ) : (
        <div style={{ borderTop: '1px solid var(--orion-border-gold)', padding: '10px 12px', background: 'var(--orion-bg-raised)' }}>
          <div style={{ display: 'flex', gap: 7 }}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={e => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="描述您的業務需求（Enter 發送，Shift+Enter 換行）"
              disabled={isAnalyzing}
              rows={3}
              className="orion-input"
              style={{ resize: 'none', flex: 1 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                onClick={onToggleRecording}
                disabled={isAnalyzing}
                title={isRecording ? `停止錄音 ${fmt(recordingTime)}` : '語音輸入'}
                style={{ width: 40, height: 40, borderRadius: 'var(--orion-radius-md)', border: isRecording ? '1px solid var(--orion-status-alert)' : '1px solid var(--orion-border-gold)', background: isRecording ? 'rgba(248,113,113,0.1)' : 'transparent', color: isRecording ? 'var(--orion-status-alert)' : 'var(--orion-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s ease' }}
              >
                {isRecording ? <MicOff style={{ width: 15, height: 15 }} /> : <Mic style={{ width: 15, height: 15 }} />}
              </button>
              <button
                onClick={() => onSend()}
                disabled={!inputValue.trim() || isAnalyzing}
                style={{ width: 40, height: 40, borderRadius: 'var(--orion-radius-md)', background: (inputValue.trim() && !isAnalyzing) ? 'var(--orion-gold)' : 'var(--orion-bg-active)', border: '1px solid var(--orion-border-gold)', color: (inputValue.trim() && !isAnalyzing) ? 'var(--orion-bg-base)' : 'var(--orion-text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: (inputValue.trim() && !isAnalyzing) ? 'pointer' : 'not-allowed', transition: 'all 0.12s ease' }}
              >
                {isAnalyzing
                  ? <Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} />
                  : <Send style={{ width: 15, height: 15 }} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Right Panel ──────────────────────────────────────────────────────────────

const RightPanel = memo(({
  analysisResult, activeTab, onTabChange, probingPartial, humanInTheLoopPoints, automationNodes,
}: {
  analysisResult: AnalysisResult | null;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  probingPartial: ProbingState['partial_analysis'] | null;
  humanInTheLoopPoints: string[] | null;
  automationNodes?: string[];
}) => {
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'summary',       label: '需求摘要', icon: Brain },
    { id: 'pain',          label: '痛點量化', icon: Target },
    { id: 'contradiction', label: '矛盾檢測', icon: ShieldAlert },
    { id: 'ai',            label: 'AI 切入點', icon: Zap },
    { id: 'blueprint',     label: '架構藍圖', icon: BarChart3 },
  ];

  const levelColor = (level: 'Low' | 'Mid' | 'High') =>
    level === 'High' ? 'var(--orion-status-alert)' : level === 'Mid' ? 'var(--orion-status-warn)' : 'var(--orion-status-ok)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)', background: 'var(--orion-bg-panel)' }}>
      <div className="orion-panel-header">
        <BarChart3 style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
        <span className="orion-panel-title">STRATEGY CANVAS</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)' }}>結構化分析輸出</span>
      </div>
      {analysisResult ? (
        <>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--orion-border-gold)', overflowX: 'auto', background: 'var(--orion-bg-raised)' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => onTabChange(tab.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer', border: 'none', borderBottom: active ? '2px solid var(--orion-gold)' : '2px solid transparent', background: active ? 'var(--orion-gold-10)' : 'transparent', color: active ? 'var(--orion-gold)' : 'var(--orion-text-secondary)', transition: 'all 0.1s ease' }}>
                  <Icon style={{ width: 11, height: 11 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {activeTab === 'summary' && (
              <div>
                <div style={panelBlock}><span style={monoLabel}>核心需求</span><p style={bodyText}>{analysisResult.demand_summary.core_need}</p></div>
                <div style={panelBlock}><span style={monoLabel}>業務背景</span><p style={descText}>{analysisResult.demand_summary.business_context}</p></div>
                <div style={panelBlock}>
                  <span style={monoLabel}>利益相關方</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {analysisResult.demand_summary.stakeholders.map((s, i) => (
                      <span key={i} className="orion-badge orion-badge-gold">{s}</span>
                    ))}
                  </div>
                </div>
                <div style={panelBlock}>
                  <span style={monoLabel}>成功標準</span>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {analysisResult.demand_summary.success_criteria.map((c, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <CheckCircle2 style={{ width: 12, height: 12, color: 'var(--orion-status-ok)', flexShrink: 0, marginTop: 3 }} />
                        <span style={descText}>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {analysisResult.delivery_requirements && (
                  <div style={panelBlock}><span style={monoLabel}>交付需求</span><p style={descText}>{analysisResult.delivery_requirements}</p></div>
                )}
                {analysisResult.open_questions_for_engineering?.length > 0 && (
                  <div style={panelBlock}>
                    <span style={monoLabel}>工程開放問題</span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {analysisResult.open_questions_for_engineering.map((q, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <span style={{ color: 'var(--orion-gold)', fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', flexShrink: 0 }}>Q{i + 1}</span>
                          <span style={descText}>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'pain' && (
              <div>
                {analysisResult.pain_quantification.pains.map((p, i) => {
                  const sc = p.severity >= 8 ? 'var(--orion-status-alert)' : p.severity >= 5 ? 'var(--orion-status-warn)' : 'var(--orion-status-ok)';
                  return (
                    <div key={i} style={{ ...panelBlock, borderLeft: `3px solid ${sc}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                        <span style={{ color: 'var(--orion-text-primary)', fontWeight: 600, fontSize: '0.9375rem', flex: 1, marginRight: 8 }}>{p.description}</span>
                        <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.875rem', fontWeight: 700, color: sc, flexShrink: 0 }}>{p.severity}/10</span>
                      </div>
                      <div className="orion-progress-track" style={{ marginBottom: 9 }}>
                        <div className="orion-progress-fill" style={{ width: `${p.severity * 10}%`, background: sc, boxShadow: `0 0 5px ${sc}60` }} />
                      </div>
                      <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <AlertTriangle style={{ width: 10, height: 10, color: 'var(--orion-status-warn)' }} />
                        <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-status-warn)' }}>財務影響：{p.financial_impact}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === 'contradiction' && (
              <div>
                {/* High level: gold alert banner */}
                {analysisResult.contradiction_detection.level === 'High' && (
                  <div style={{
                    background: 'rgba(201,168,76,0.15)',
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 14,
                    marginBottom: 12,
                    borderRadius: 'var(--orion-radius-sm)',
                    animation: 'orion-alert-fade 0.3s ease, orion-alert-shake 0.4s ease',
                  }}>
                    <span style={{
                      fontFamily: 'var(--orion-font-mono)',
                      color: '#c9a84c',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                    }}>⚠ 高度邏輯衝突 — 此矛盾將導致專案失敗</span>
                  </div>
                )}
                {/* Mid level: yellow warning */}
                {analysisResult.contradiction_detection.level === 'Mid' && (
                  <div style={{
                    background: 'rgba(250,204,21,0.06)',
                    border: '1px solid rgba(250,204,21,0.3)',
                    padding: '8px 14px',
                    marginBottom: 12,
                    borderRadius: 'var(--orion-radius-sm)',
                    animation: 'orion-alert-fade 0.3s ease',
                  }}>
                    <span style={{
                      fontFamily: 'var(--orion-font-mono)',
                      color: '#facc15',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}>⚠ 矛盾偵測 — 中度風險</span>
                  </div>
                )}
                {/* Main contradiction card */}
                <div style={{
                  ...panelBlock,
                  marginBottom: 12,
                  borderLeft: analysisResult.contradiction_detection.level === 'High'
                    ? '3px solid #c9a84c'
                    : analysisResult.contradiction_detection.level === 'Mid'
                    ? '3px solid rgba(250,204,21,0.7)'
                    : `3px solid ${levelColor(analysisResult.contradiction_detection.level)}`,
                  background: analysisResult.contradiction_detection.level === 'High'
                    ? 'rgba(201,168,76,0.08)'
                    : analysisResult.contradiction_detection.level === 'Mid'
                    ? 'rgba(250,204,21,0.04)'
                    : undefined,
                  border: analysisResult.contradiction_detection.level === 'High'
                    ? '2px solid #c9a84c'
                    : analysisResult.contradiction_detection.level === 'Mid'
                    ? '2px solid rgba(250,204,21,0.6)'
                    : undefined,
                  animation: analysisResult.contradiction_detection.level !== 'Low' ? 'orion-alert-fade 0.3s ease' : undefined,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    {analysisResult.contradiction_detection.level === 'Low' && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orion-status-ok)', display: 'inline-block', flexShrink: 0 }} />
                    )}
                    <span style={monoLabel}>矛盾等級</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 3,
                      fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', fontWeight: 700,
                      color: levelColor(analysisResult.contradiction_detection.level),
                      background: `${levelColor(analysisResult.contradiction_detection.level)}18`,
                      border: `1px solid ${levelColor(analysisResult.contradiction_detection.level)}40`,
                    }}>{analysisResult.contradiction_detection.level}</span>
                  </div>
                  <p style={{
                    ...descText,
                    color: analysisResult.contradiction_detection.level === 'High'
                      ? '#c9a84c'
                      : analysisResult.contradiction_detection.level === 'Mid'
                      ? '#facc15'
                      : undefined,
                    fontWeight: analysisResult.contradiction_detection.level === 'High' ? 600
                      : analysisResult.contradiction_detection.level === 'Mid' ? 500 : undefined,
                    fontSize: analysisResult.contradiction_detection.level === 'High' ? '0.95rem' : undefined,
                  }}>{analysisResult.contradiction_detection.desc}</p>
                </div>
                {(analysisResult.contradiction_detection.contradictions?.length ?? 0) === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0' }}>
                    <CheckCircle2 style={{ width: 32, height: 32, color: 'var(--orion-status-ok)', margin: '0 auto 10px' }} />
                    <p style={{ color: 'var(--orion-text-secondary)', fontFamily: 'var(--orion-font-mono)', fontSize: '0.875rem' }}>未檢測到明顯矛盾</p>
                  </div>
                ) : analysisResult.contradiction_detection.contradictions.map((c, i) => (
                  <div key={i} style={{
                    ...panelBlock,
                    border: analysisResult.contradiction_detection.level === 'High'
                      ? '1px solid rgba(201,168,76,0.3)'
                      : analysisResult.contradiction_detection.level === 'Mid'
                      ? '1px solid rgba(250,204,21,0.25)'
                      : undefined,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 9 }}>
                      <div style={{ padding: '6px 10px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 3 }}>
                        <span style={{ ...monoLabel, color: 'var(--orion-status-alert)', marginBottom: 3 }}>衝突點 A</span>
                        <p style={descText}>{c.statement_a}</p>
                      </div>
                      <div style={{ padding: '6px 10px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 3 }}>
                        <span style={{ ...monoLabel, color: 'var(--orion-status-warn)', marginBottom: 3 }}>衝突點 B</span>
                        <p style={descText}>{c.statement_b}</p>
                      </div>
                    </div>
                    <div style={{ marginBottom: 7 }}>
                      <span style={{ ...monoLabel, color: 'var(--orion-status-alert)' }}>根本原因</span>
                      <p style={{ ...descText, color: 'rgba(248,113,113,0.85)', fontSize: '0.8125rem' }}>{c.root_cause}</p>
                    </div>
                    <div style={{ padding: '8px 11px', background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-sm)' }}>
                      <span style={{ ...monoLabel, marginBottom: 4, color: 'var(--orion-gold)' }}>解決路徑</span>
                      <p style={{ ...descText, fontSize: '0.8125rem', color: 'var(--orion-gold)' }}>{c.resolution_path}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'ai' && (
              <div>
                {analysisResult.ai_entry_points.opportunities.map((a, i) => {
                  const cc = a.implementation_difficulty === 'low' ? 'var(--orion-status-ok)' : a.implementation_difficulty === 'medium' ? 'var(--orion-status-warn)' : 'var(--orion-status-alert)';
                  const cl = a.implementation_difficulty === 'low' ? '低複雜度' : a.implementation_difficulty === 'medium' ? '中複雜度' : '高複雜度';
                  return (
                    <div key={i} style={panelBlock}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 7 }}>
                        <span style={{ color: 'var(--orion-text-primary)', fontWeight: 600, fontSize: '0.9375rem', flex: 1 }}>{a.title}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 7px', borderRadius: 2, flexShrink: 0, fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', fontWeight: 700, background: `${cc}18`, color: cc, border: `1px solid ${cc}40` }}>{cl}</span>
                      </div>
                      <p style={{ ...descText, marginBottom: 9 }}>{a.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Zap style={{ width: 10, height: 10, color: 'var(--orion-gold)' }} />
                        <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-gold)', letterSpacing: '0.08em' }}>ROI 估算：{a.roi_estimate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {activeTab === 'blueprint' && (
              <div>
                <div style={panelBlock}>
                  <span style={monoLabel}>工作流程</span>
                  <p style={descText}>{analysisResult.agent_blueprint.workflow}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div style={panelBlock}>
                    <span style={monoLabel}>Agent 列表</span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {analysisResult.agent_blueprint.agents.map((agent, i) => (
                        <li key={i}>
                          <p style={{ color: 'var(--orion-text-primary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 2 }}>{agent.name}</p>
                          <p style={{ ...descText, fontSize: '0.75rem', marginBottom: 4 }}>{agent.role}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                            {agent.capabilities.map((cap, j) => (
                              <span key={j} style={{ padding: '1px 6px', borderRadius: 2, fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: 'var(--orion-text-secondary)', background: 'var(--orion-bg-void)', border: '1px solid var(--orion-border-gold)' }}>{cap}</span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={panelBlock}>
                    <span style={monoLabel}>技術棧</span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {analysisResult.agent_blueprint.tech_stack.map((t, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orion-status-info)', flexShrink: 0 }} />
                          <span style={{ ...descText, fontSize: '0.8125rem' }}>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {(analysisResult.agent_blueprint.human_in_the_loop_points?.length ?? 0) > 0 && (
                  <div style={panelBlock}>
                    <span style={monoLabel}>人工介入點</span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {analysisResult.agent_blueprint.human_in_the_loop_points.map((point, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                          <Users style={{ width: 11, height: 11, color: 'var(--orion-gold)', flexShrink: 0, marginTop: 3 }} />
                          <span style={descText}>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Mermaid Architecture Diagram */}
                {analysisResult.mermaid_diagram && (
                  <div style={{ marginTop: 10 }}>
                    <span style={monoLabel}>架構流程圖</span>
                    <MermaidChart
                      diagram={analysisResult.mermaid_diagram}
                      fallbackText={analysisResult.agent_blueprint.workflow}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          {/* G3: DeliveryPathMap */}
          <div style={{ padding: '0 12px 12px' }}>
            <DeliveryPathMap humanInTheLoopPoints={humanInTheLoopPoints} automationNodes={automationNodes} />
          </div>
        </>
      ) : probingPartial ? (
        // G1: Show partial_analysis during probing
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: 'var(--orion-radius-md)' }}>
            <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: 'var(--orion-status-warn)', letterSpacing: '0.1em' }}>PARTIAL ANALYSIS · 補充資訊後完整輸出</span>
          </div>
          {probingPartial.demand_summary && (
            <div style={panelBlock}><span style={monoLabel}>初步需求摘要</span><p style={bodyText}>{probingPartial.demand_summary}</p></div>
          )}
          {probingPartial.org_structure && (
            <div style={panelBlock}><span style={monoLabel}>組織結構</span><p style={descText}>{probingPartial.org_structure}</p></div>
          )}
          {probingPartial.current_workflow && (
            <div style={panelBlock}><span style={monoLabel}>現有流程</span><p style={descText}>{probingPartial.current_workflow}</p></div>
          )}
          {(probingPartial.pain_points?.length ?? 0) > 0 && (
            <div style={panelBlock}>
              <span style={monoLabel}>已識別痛點</span>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {probingPartial.pain_points.map((p, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                    <AlertTriangle style={{ width: 11, height: 11, color: 'var(--orion-status-warn)', flexShrink: 0, marginTop: 3 }} />
                    <span style={descText}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* G3: DeliveryPathMap in probing state (all grey) */}
          <DeliveryPathMap humanInTheLoopPoints={null} />
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 28px' }}>
          <div>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--orion-gold-10)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <BarChart3 style={{ width: 22, height: 22, color: 'var(--orion-gold)', opacity: 0.5 }} />
            </div>
            <p style={{ color: 'var(--orion-text-primary)', fontWeight: 600, marginBottom: 7, fontSize: '0.9375rem' }}>策略畫布</p>
            <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>在左側輸入業務需求後<br />ORION 將在此展示結構化分析結果</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 16 }}>
              {[
                { icon: Brain,      label: '需求摘要', desc: '核心需求解構' },
                { icon: Target,     label: '痛點量化', desc: '數字化評估損失' },
                { icon: ShieldAlert, label: '矛盾檢測', desc: '識別潛在風險' },
                { icon: Zap,        label: 'AI 切入點', desc: '自動化機會識別' },
              ].map(({ icon: Icon, label, desc }, i) => (
                <div key={i} style={{ background: 'var(--orion-bg-void)', border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-md)', padding: '9px 11px', textAlign: 'left' }}>
                  <Icon style={{ width: 13, height: 13, color: 'var(--orion-gold)', opacity: 0.5, marginBottom: 4 }} />
                  <p style={{ color: 'var(--orion-text-primary)', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 2 }}>{label}</p>
                  <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.75rem' }}>{desc}</p>
                </div>
              ))}
            </div>
            {/* G3: DeliveryPathMap in empty state */}
            <div style={{ marginTop: 16 }}>
              <DeliveryPathMap humanInTheLoopPoints={null} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// ─── CopyPromptButton ───────────────────────────────────────────────────────────────────────────────

const CopyPromptButton = ({ analysisResult }: { analysisResult: AnalysisResult | null }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!analysisResult) return toast.error('沒有分析結果可複製');
    try {
      const prompt = generateEngineeringPrompt(analysisResult as any);
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success('工程 Prompt 已複製，可直接貼入 n8n / AI Agent');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('複製失敗，請重試');
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!analysisResult}
      className="orion-btn-ghost"
      style={{
        padding: '5px 11px',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        border: '1px solid var(--orion-border-gold)',
        color: copied ? 'var(--orion-status-ok)' : 'var(--orion-gold)',
        transition: 'all 0.15s ease',
      }}
    >
      <Terminal style={{ width: 12, height: 12 }} />
      {copied ? '✓ 已複製' : '複製工程 Prompt'}
    </button>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────────────

// PART 4-4: Loading messages (module-level to avoid scope issues)
const LOADING_MESSAGES = [
  '正在深層共感您的業務壓力...',
  '決策單點故障檢測中...',
  '熵增模型建構中...',
  '識別槓桿結構...',
  '邊際成本分析運算中...',
  '24小時自動化路徑規劃...',
];

export default function WarRoom() {
  const [, navigate] = useLocation(); const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSuccessReceipt, setShowSuccessReceipt] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  // G1: Conversation state
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [confirmedDimensions, setConfirmedDimensions] = useState<Record<string, unknown>>({});
  const [probing, setProbing] = useState<ProbingState | null>(null);
  const [currentInputText, setCurrentInputText] = useState('');

  // G2: Token usage tracking
  const [tokenUsage, setTokenUsage] = useState<{ prompt: number; completion: number } | null>(null);
  // Step 2: SSE streaming state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamingTokens, setStreamingTokens] = useState('');
  // FIX-3: Fatal error state for crash recovery
  const [fatalError, setFatalError] = useState<string | null>(null);

  // PART 4-4: Loading message rotation
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  useEffect(() => {
    if (!isAnalyzing) { setLoadingMsgIndex(0); return; }
    const timer = setInterval(() => setLoadingMsgIndex(i => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(timer);
  }, [isAnalyzing]);
  const abortControllerRef = useRef<AbortController | null>(null);
  // FIX-2: Prevent duplicate Phase D triggers
  const isAnalyzingRef = useRef<boolean>(false);
  // Refs to capture latest state values inside SSE event handler closures
  const currentInputTextRef = useRef<string>('');
  const conversationHistoryRef = useRef<ConversationMessage[]>([]);
  const confirmedDimensionsRef = useRef<Record<string, unknown>>({});
  // Sync state to refs so SSE event handlers always see latest values
  useEffect(() => { currentInputTextRef.current = currentInputText; }, [currentInputText]);
  useEffect(() => { conversationHistoryRef.current = conversationHistory; }, [conversationHistory]);
  useEffect(() => { confirmedDimensionsRef.current = confirmedDimensions; }, [confirmedDimensions]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ── API 絕對路徑（規範第3條：嚴禁相對路徑） ──
  const API_BASE = 'https://orion-hub.zeabur.app';
  const chatSessionId = useRef<string>('session-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8));
  const [isAustinMode, setIsAustinMode] = useState(false);

  // Step 2: SSE chat function — 對接 /api/chat 端點
  const runSSEAnalysis = useCallback(async (params: {
    inputText: string;
    conversationHistory: ConversationMessage[];
    confirmedDimensions: Record<string, unknown>;
    skipProbing?: boolean;
  }) => {
    // FIX-2: Prevent duplicate triggers
    if (isAnalyzingRef.current) {
      console.warn('[ORION] runSSEAnalysis blocked: already analyzing');
      return;
    }
    isAnalyzingRef.current = true;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsAnalyzing(true);
    setStreamingTokens('');

    // ── /AUSTIN 偵測 ──
    const trimmedInput = params.inputText.trim();
    const austinTriggered = trimmedInput === '/AUSTIN' || trimmedInput === '/austin';
    const currentAustin = austinTriggered || isAustinMode;
    if (austinTriggered && !isAustinMode) {
      setIsAustinMode(true);
    }

    try {
      // ── 規範第3條：絕對路徑 + 45 秒逾時 ──
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: params.inputText,
          session_id: chatSessionId.current,
          is_austin_mode: currentAustin,
          conversation_history: params.conversationHistory.slice(-8),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const errText = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${errText.substring(0, 200)}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          try {
            const dataStr = trimmed.slice(6);
            const data = JSON.parse(dataStr);

            if (data.chunk) {
              // 流式文字累積
              fullResponse += data.chunk;
              setStreamingTokens(prev => prev + data.chunk);
              // 即時更新最後一條 AI 訊息
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.type === 'ai' && (last.content.startsWith('🔍') || last.id.startsWith('stream-'))) {
                  return [...prev.slice(0, -1), { ...last, id: 'stream-' + Date.now(), content: fullResponse }];
                }
                return prev;
              });
            } else if (data.done) {
              // 流式結束
              setStreamingTokens('');
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.type === 'ai') {
                  return [...prev.slice(0, -1), { ...last, id: Date.now().toString(), content: fullResponse }];
                }
                return [...prev, { id: Date.now().toString(), type: 'ai' as const, content: fullResponse, timestamp: new Date() }];
              });

              // 更新對話歷史
              setConversationHistory(prev => [
                ...prev,
                { role: 'user' as const, content: params.inputText },
                { role: 'assistant' as const, content: fullResponse },
              ]);

              // 5 輪對話後觸發報告（[COMPLETE] 標記）
              if (fullResponse.includes('[COMPLETE]')) {
                setCurrentSessionId(chatSessionId.current as any);
                setMessages(prev => [...prev, {
                  id: Date.now().toString(), type: 'system' as const,
                  content: '資料收集完成！正在生成 AI 診斷報告...',
                  timestamp: new Date(),
                }]);
              }
            } else if (data.error) {
              setMessages(prev => [...prev, {
                id: Date.now().toString(), type: 'system' as const,
                content: `錯誤：${data.error}`,
                timestamp: new Date(),
              }]);
            }
          } catch {
            // skip malformed SSE data
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : String(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), type: 'system' as const, content: `回應失敗：${msg}`, timestamp: new Date() }]);
      toast.error(`回應失敗：${msg}`);
      if (msg.includes('HTTP 5') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setFatalError(msg);
      }
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
      setStreamingTokens('');
      abortControllerRef.current = null;
    }
  }, [isAustinMode]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) { interval = setInterval(() => setRecordingTime(p => p + 1), 1000); }
    else { setRecordingTime(0); }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSendMessage = useCallback(async (text: string = inputValue) => {
    const trimmed = text.trim();
    if (!trimmed || isAnalyzing) return;

    setCurrentInputText(trimmed);
    setMessages(prev => [...prev,
      { id: Date.now().toString(), type: 'user', content: trimmed, timestamp: new Date() },
      { id: (Date.now() + 1).toString(), type: 'ai', content: '🔍 ORION 正在解構需求，請稍候...', timestamp: new Date() },
    ]);
    setInputValue('');

    runSSEAnalysis({
      inputText: trimmed,
      conversationHistory: [],
      confirmedDimensions: {},
    });
  }, [inputValue, isAnalyzing, runSSEAnalysis]);

  // G1: Handle probing answer submission
  const handleProbingSubmit = useCallback((answers: Record<number, string>) => {
    if (!probing) return;
    // 防止重複觸發
    if (isAnalyzingRef.current) {
      console.warn('[ORION] handleProbingSubmit blocked: already analyzing');
      return;
    }

    // Build new conversation history entries
    const newHistory: ConversationMessage[] = [...conversationHistory];
    probing.questions.forEach((q, i) => {
      newHistory.push({ role: 'assistant', content: q });
      newHistory.push({ role: 'user', content: answers[i] ?? '' });
    });

    // Mark confirmed dimensions from this round
    const newConfirmed = { ...confirmedDimensions };
    probing.missing_dimensions.forEach((dim, i) => {
      newConfirmed[dim] = answers[i] ?? '';
    });

    setConversationHistory(newHistory);
    setConfirmedDimensions(newConfirmed);

    // Add user answers to messages
    const answerText = probing.questions.map((q, i) => `${q}\n→ ${answers[i]}`).join('\n\n');
    setMessages(prev => [...prev,
      { id: Date.now().toString(), type: 'user', content: answerText, timestamp: new Date() },
      { id: (Date.now() + 1).toString(), type: 'ai', content: '🔍 ORION 正在整合補充資訊，繼續分析...', timestamp: new Date() },
    ]);

    // If all 6 required dimensions are now confirmed, skip Phase B entirely
    const ALL_DIMENSIONS = ['部門與角色', '流程步驟', '工具鏈/系統', '資料來源', '權限與審核節點', '成功標準'];
    const allConfirmed = ALL_DIMENSIONS.every(dim => dim in newConfirmed);

    runSSEAnalysis({
      inputText: currentInputText,
      conversationHistory: newHistory,
      confirmedDimensions: newConfirmed,
      skipProbing: allConfirmed,
    });
  }, [probing, conversationHistory, confirmedDimensions, currentInputText, runSSEAnalysis]);

  // G1: New analysis — clear all state
  const handleNewAnalysis = useCallback(() => {
    // Abort any in-flight SSE request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setMessages([]);
    setInputValue('');
    setAnalysisResult(null);
    setProbing(null);
    setConversationHistory([]);
    setConfirmedDimensions({});
    setCurrentInputText('');
    setTokenUsage(null);
    setActiveTab('summary');
    setStreamingTokens('');
    setIsAnalyzing(false);
    setIsUnlocked(false);
    setShowContactModal(false);
    setShowSuccessReceipt(false);
    setCurrentSessionId(null);
    setFatalError(null);
    isAnalyzingRef.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  }, [handleSendMessage]);

  // Step 3: Voice transcription mutation
  const transcribeMutation = trpc.voice.transcribe.useMutation({
    onSuccess: (data) => {
      if (data.text) {
        setInputValue(prev => prev ? `${prev} ${data.text}` : data.text);
        toast.success(`語音轉文字完成（${data.language?.toUpperCase() ?? 'ZH'}）`);
      } else {
        toast.error('未識別到語音內容');
      }
    },
    onError: (err) => {
      toast.error(`語音轉文字失敗: ${err.message}`);
    },
  });

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop recording and process audio
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';
        const mr = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mr;
        audioChunksRef.current = [];
        mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
        mr.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          if (blob.size === 0) { toast.error('沒有錄到音訊'); return; }
          if (blob.size > 16 * 1024 * 1024) { toast.error('錄音檔案超過 16MB'); return; }
          // Convert to base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result as string;
            toast.info('正在轉文字...');
            transcribeMutation.mutate({ audioDataUrl: base64 });
          };
          reader.readAsDataURL(blob);
        };
        mr.start();
        setIsRecording(true);
        toast.info('錄音中，再次點擊停止');
      } catch {
        toast.error('無法存取麥克風，請檢查瀏覽器權限');
      }
    }
  }, [isRecording, transcribeMutation]);

  const handleDownloadReport = useCallback(async () => {
    if (!analysisResult) return toast.error('沒有分析結果可下載');
    try {
      toast.info('正在生成 PDF 報告...');
      await exportAnalysisPDF(analysisResult as any, currentInputText);
      toast.success('PDF 報告已下載');
    } catch (err) {
      console.error('PDF export error:', err);
      toast.error('PDF 生成失敗，請重試');
    }
  }, [analysisResult, currentInputText]);

  const quickOptions = [
    '我想了解我的公司是否適合導入 AI',
    '我想優化我們的客服流程',
    '我想自動化我們的內部審核作業',
    '我想評估 AI 對我們業務的 ROI',
  ];
  const quickOptionsHint = '不知從何開始？試試以下問題：';

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--orion-bg-base)', position: 'relative', overflow: 'hidden' }}>
      {/* Particle background */}
      <ParticleBackground />
      {/* Static grid */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(201,168,76,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.018) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* FIX-3: Fatal error recovery overlay */}
      {fatalError && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,13,20,0.92)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <div style={{ color: '#ff6b6b', fontSize: 15, fontWeight: 600, textAlign: 'center', maxWidth: 360 }}>
            ⚠ 系統發生錯誤
          </div>
          <div style={{ color: 'var(--orion-text-secondary)', fontSize: 12, textAlign: 'center', maxWidth: 360, fontFamily: 'monospace' }}>
            {fatalError}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 28px', background: 'var(--orion-gold)', color: 'var(--orion-bg-base)', border: 'none', borderRadius: 'var(--orion-radius-md)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            重新開始分析
          </button>
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid var(--orion-border-gold)', background: 'var(--orion-bg-base)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 22px', height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <button
              onClick={() => { handleNewAnalysis(); navigate('/'); }}
              style={{ width: 28, height: 28, border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-md)', background: 'transparent', color: 'var(--orion-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.12s ease' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--orion-gold)'; el.style.color = 'var(--orion-gold)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--orion-border-gold)'; el.style.color = 'var(--orion-text-secondary)'; }}>
              <ArrowLeft style={{ width: 13, height: 13 }} />
            </button>
            <button
              onClick={() => { handleNewAnalysis(); navigate('/'); }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, opacity: 1, transition: 'opacity 0.15s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              title="返回首頁"
            >
              <div style={{ width: 28, height: 28, borderRadius: 3, background: 'linear-gradient(135deg, var(--orion-gold-dark) 0%, var(--orion-gold) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain style={{ width: 15, height: 15, color: 'var(--orion-bg-base)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--orion-font-display)', fontWeight: 700, color: 'var(--orion-gold)', fontSize: '0.9375rem', letterSpacing: '0.06em' }}>獵戶座智鑑</div>
                <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', color: 'var(--orion-text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>WAR ROOM · DEMAND ANALYSIS ENGINE</div>
              </div>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {/* 下載報告 — 鎖定直到解鎖 */}
            <button
              onClick={() => {
                if (!isUnlocked) { toast.info('請先填寫職絡資訊以解鎖報告'); setShowContactModal(true); return; }
                handleDownloadReport();
              }}
              disabled={!analysisResult}
              className="orion-btn-ghost"
              style={{ padding: '5px 11px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, opacity: !isUnlocked && analysisResult ? 0.5 : 1 }}
            >
              {!isUnlocked && analysisResult ? '🔒' : <Download style={{ width: 12, height: 12 }} />}
              下載報告
            </button>
            {/* 複製工程 Prompt — 鎖定直到解鎖 */}
            {isUnlocked ? (
              <CopyPromptButton analysisResult={analysisResult} />
            ) : (
              <button
                onClick={() => { if (analysisResult) { toast.info('請先填寫職絡資訊以解鎖'); setShowContactModal(true); } }}
                disabled={!analysisResult}
                className="orion-btn-ghost"
                style={{ padding: '5px 11px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5, opacity: analysisResult ? 0.5 : 1 }}
              >
                🔒 工程 Prompt
              </button>
            )}
            <button
              onClick={() => {
                if (!analysisResult) return toast.error('沒有分析結果可分享');
                navigator.clipboard.writeText(`獵戶座智鑑 ORION 分析報告\n核心需求：${analysisResult.demand_summary.core_need}`)
                  .then(() => toast.success('已複製到剪貼簿'))
                  .catch(() => toast.error('複製失敗'));
              }}
              disabled={!analysisResult}
              className="orion-btn-ghost"
              style={{ padding: '5px 11px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Share2 style={{ width: 12, height: 12 }} />分享
            </button>
          </div>
        </div>
      </header>

      {/* Main — two-column layout */}
      <main style={{ flex: 1, position: 'relative', zIndex: 10, maxWidth: 1400, margin: '0 auto', width: '100%', padding: '16px clamp(12px, 3vw, 22px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 16, flex: 1, minHeight: 0 }}>
          <LeftPanel
            messages={messages}
            isAnalyzing={isAnalyzing}
            inputValue={inputValue}
            isRecording={isRecording}
            recordingTime={recordingTime}
            probing={probing}
            onInputChange={setInputValue}
            onKeyDown={handleKeyDown}
            onSend={handleSendMessage}
            onToggleRecording={handleToggleRecording}
            onProbingSubmit={handleProbingSubmit}
            onNewAnalysis={handleNewAnalysis}
            messagesEndRef={messagesEndRef}
            textareaRef={textareaRef}
            quickOptions={quickOptions}
            quickOptionsHint={quickOptionsHint}
            streamingTokens={streamingTokens}
            loadingMsgIndex={loadingMsgIndex}
          />
          <RightPanel
            analysisResult={analysisResult}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            probingPartial={probing?.partial_analysis ?? null}
            humanInTheLoopPoints={analysisResult?.human_in_the_loop_points ?? null}
            automationNodes={(analysisResult as any)?.automation_nodes ?? undefined}
          />
        </div>
      </main>

      {/* G1: Token debug bar — bottom right, small, semi-transparent */}
      {tokenUsage && (
        <div style={{
          position: 'fixed',
          bottom: 10,
          right: 14,
          zIndex: 50,
          fontFamily: 'var(--orion-font-mono)',
          fontSize: '0.5rem',
          color: 'var(--orion-text-tertiary)',
          background: 'rgba(10,13,20,0.75)',
          border: '1px solid var(--orion-border-gold)',
          borderRadius: 3,
          padding: '3px 8px',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
        }}>
          TOKENS · IN: {tokenUsage.prompt.toLocaleString()} · OUT: {tokenUsage.completion.toLocaleString()}
        </div>
      )}

      {/* 毛玻璃阻斷層 — 分析完成後、未解鎖時顯示 */}
      {analysisResult && !isUnlocked && !showContactModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backdropFilter: 'blur(12px)',
            background: 'rgba(10,13,20,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{
            border: '1px solid rgba(201,168,76,0.6)',
            borderTop: '2px solid var(--orion-gold)',
            borderRadius: 12,
            padding: '32px 36px',
            textAlign: 'center',
            background: 'rgba(15,20,25,0.9)',
            boxShadow: '0 0 80px rgba(201,168,76,0.15)',
            animation: 'orion-alert-fade 0.4s ease',
            maxWidth: 380,
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔒</div>
            <h3 style={{ color: 'var(--orion-gold)', fontFamily: 'var(--orion-font-display)', fontWeight: 700, fontSize: '1.125rem', letterSpacing: '0.06em', marginBottom: 8 }}>
              分析完成
            </h3>
            <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 20 }}>
              完整診斷報告已生成。填寫職絡資訊即可立即解鎖全部內容。
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              style={{
                padding: '12px 28px',
                background: 'linear-gradient(135deg, var(--orion-gold), #a68a3f)',
                border: 'none',
                borderRadius: 6,
                color: '#0a0d14',
                fontWeight: 700,
                fontSize: '0.9375rem',
                fontFamily: 'var(--orion-font-display)',
                letterSpacing: '0.06em',
                cursor: 'pointer',
              }}
            >
              解鎖完整診斷報告
            </button>
          </div>
        </div>
      )}

      {/* 職絡表單 Modal */}
      {showContactModal && currentSessionId && (
        <ContactFormModal
          sessionId={currentSessionId}
          demandSummary={analysisResult?.demand_summary?.core_need ?? ''}
          onSuccess={() => {
            setIsUnlocked(true);
            setShowContactModal(false);
            setShowSuccessReceipt(true);
            setTimeout(() => setShowSuccessReceipt(false), 5000);
          }}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* 成功回執卡片 */}
      {showSuccessReceipt && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 300,
            border: '1px solid rgba(201,168,76,0.6)',
            borderLeft: '3px solid var(--orion-gold)',
            borderRadius: 8,
            padding: '14px 18px',
            background: 'rgba(15,20,25,0.95)',
            boxShadow: '0 0 40px rgba(201,168,76,0.2)',
            animation: 'orion-alert-fade 0.3s ease',
            maxWidth: 320,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <CheckCircle2 size={16} style={{ color: 'var(--orion-gold)', flexShrink: 0 }} />
            <span style={{ color: 'var(--orion-gold)', fontFamily: 'var(--orion-font-display)', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.04em' }}>
              報告已解鎖
            </span>
          </div>
          <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5, fontFamily: 'var(--orion-font-mono)' }}>
            數據已加密傳輸至獵戶座分析中樞…
          </p>
        </div>
      )}
    </div>
  );
}
