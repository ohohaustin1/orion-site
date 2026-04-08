import React, { useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Loader2, Zap, Brain, BarChart3, Clock, ChevronRight, Plus } from 'lucide-react';

const ORION_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_3606b99d.png';

function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return '剛才';
  if (mins < 60) return `${mins} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  return `${days} 天前`;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { data: sessions, isLoading } = trpc.analysis.listSessions.useQuery();

  const stats = useMemo(() => {
    if (!sessions) return { total: 0, completed: 0, analyzing: 0, failed: 0 };
    return {
      total: sessions.length,
      completed: sessions.filter(s => s.status === 'completed').length,
      analyzing: sessions.filter(s => s.status === 'processing').length,
      failed: sessions.filter(s => s.status === 'failed').length,
    };
  }, [sessions]);

  const recentSessions = useMemo(() => sessions?.slice(0, 5) ?? [], [sessions]);

  const statusLabel: Record<string, { label: string; color: string }> = {
    completed: { label: '完成', color: 'var(--orion-status-ok)' },
    processing: { label: '分析中', color: 'var(--orion-gold)' },
    failed: { label: '失敗', color: 'var(--orion-status-alert)' },
    pending: { label: '等待中', color: 'var(--orion-text-tertiary)' },
  };

  return (
    <DashboardLayout>
      <div style={{ color: 'var(--orion-text-primary)' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)', marginBottom: '6px' }}>
              COMMAND OVERVIEW
            </div>
            <h1 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--orion-text-primary)', letterSpacing: '-0.01em' }}>
              {language === 'en' ? 'Intelligence Dashboard' : '情報指揮中心'}
            </h1>
          </div>
          <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus style={{ width: 14, height: 14 }} />
            {language === 'en' ? 'New Analysis' : '新增分析'}
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: language === 'en' ? 'Total Sessions' : '總分析次數', value: stats.total, icon: Brain, accent: 'var(--orion-gold)' },
            { label: language === 'en' ? 'Completed' : '已完成', value: stats.completed, icon: BarChart3, accent: 'var(--orion-status-ok)' },
            { label: language === 'en' ? 'Processing' : '分析中', value: stats.analyzing, icon: Zap, accent: 'var(--orion-gold)' },
            { label: language === 'en' ? 'Failed' : '失敗', value: stats.failed, icon: Clock, accent: 'var(--orion-status-alert)' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: `2px solid ${stat.accent}`, borderRadius: 'var(--orion-radius-md)', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)' }}>{stat.label}</span>
                  <Icon style={{ width: 14, height: 14, color: stat.accent }} />
                </div>
                <div style={{ fontFamily: 'var(--orion-font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--orion-text-primary)', lineHeight: 1 }}>
                  {isLoading ? '—' : stat.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2" style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)' }}>
            <div className="orion-panel-header">
              <Brain style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
              <span className="orion-panel-title">{language === 'en' ? 'RECENT ANALYSES' : '最近分析記錄'}</span>
            </div>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '10px', color: 'var(--orion-text-tertiary)' }}>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOADING...</span>
              </div>
            ) : recentSessions.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', color: 'var(--orion-text-tertiary)', letterSpacing: '0.1em', marginBottom: '16px' }}>NO ANALYSIS RECORDS</div>
                <button onClick={() => setLocation('/war-room')} className="orion-btn-ghost" style={{ fontSize: '0.8125rem' }}>
                  {language === 'en' ? 'Start First Analysis' : '開始第一次分析'}
                </button>
              </div>
            ) : (
              <div>
                {recentSessions.map((session, idx) => {
                  const status = statusLabel[session.status] ?? { label: session.status, color: 'var(--orion-text-tertiary)' };
                  return (
                    <div key={session.id} onClick={() => setLocation('/war-room')} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderBottom: idx < recentSessions.length - 1 ? '1px solid var(--orion-border-subtle)' : 'none', cursor: 'pointer', transition: 'background 0.12s ease' }} onMouseEnter={e => (e.currentTarget.style.background = 'var(--orion-gold-10)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <div style={{ width: 32, height: 32, borderRadius: '4px', background: 'var(--orion-bg-active)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Brain style={{ width: 14, height: 14, color: 'var(--orion-gold)' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--orion-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {session.inputText.length > 60 ? session.inputText.slice(0, 60) + '…' : session.inputText}
                        </div>
                        <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-text-tertiary)', marginTop: '2px' }}>
                          {formatRelativeTime(session.createdAt)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: status.color, textTransform: 'uppercase' }}>{status.label}</span>
                        <ChevronRight style={{ width: 12, height: 12, color: 'var(--orion-text-tertiary)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)' }}>
              <div className="orion-panel-header">
                <Zap style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
                <span className="orion-panel-title">QUICK ACCESS</span>
              </div>
              <div style={{ padding: '12px' }}>
                {[
                  { label: '戰情室', sub: 'AI 需求診斷', href: '/war-room', icon: Brain },
                  { label: '專案管理', sub: '追蹤專案進度', href: '/projects', icon: BarChart3 },
                  { label: '客戶管理', sub: '客戶資料管理', href: '/clients', icon: Clock },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} onClick={() => setLocation(item.href)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '4px', cursor: 'pointer', marginBottom: '4px', border: '1px solid transparent', transition: 'all 0.12s ease' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--orion-gold-10)'; e.currentTarget.style.borderColor = 'var(--orion-border-gold)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                      <div style={{ width: 28, height: 28, borderRadius: '4px', background: 'var(--orion-bg-active)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: 12, height: 12, color: 'var(--orion-gold)' }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--orion-text-primary)' }}>{item.label}</div>
                        <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)' }}>{item.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-md)' }}>
              <div className="orion-panel-header">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orion-status-ok)', display: 'inline-block', boxShadow: '0 0 6px var(--orion-status-ok)' }} />
                <span className="orion-panel-title">SYSTEM STATUS</span>
              </div>
              <div style={{ padding: '12px 16px' }}>
                {[
                  { label: 'LLM Engine', status: 'ONLINE' },
                  { label: 'Analysis API', status: 'ONLINE' },
                  { label: 'Database', status: 'ONLINE' },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: idx < 2 ? '8px' : 0 }}>
                    <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-text-secondary)' }}>{item.label}</span>
                    <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--orion-status-ok)' }}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px', opacity: 0.6 }}>
              <img src={ORION_LOGO} alt="ORION AI Group" style={{ width: '80px', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.3))' }} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
