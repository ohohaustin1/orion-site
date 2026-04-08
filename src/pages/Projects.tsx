import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Loader2, Brain, Search, ChevronRight, Plus, BarChart3, Clock } from 'lucide-react';

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

export default function Projects() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: sessions, isLoading } = trpc.analysis.listSessions.useQuery();

  const filtered = useMemo(() => {
    if (!sessions) return [];
    return sessions.filter(s => {
      const matchSearch = !search || s.inputText.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [sessions, search, statusFilter]);

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    completed: { label: '已完成', color: 'var(--orion-status-ok)', bg: 'rgba(74,222,128,0.08)' },
    processing: { label: '分析中', color: 'var(--orion-gold)', bg: 'rgba(201,168,76,0.08)' },
    failed: { label: '失敗', color: 'var(--orion-status-alert)', bg: 'rgba(248,113,113,0.08)' },
    pending: { label: '等待中', color: 'var(--orion-text-tertiary)', bg: 'rgba(255,255,255,0.04)' },
  };

  return (
    <DashboardLayout>
      <div style={{ color: 'var(--orion-text-primary)' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)', marginBottom: '6px' }}>
              PROJECT REGISTRY
            </div>
            <h1 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--orion-text-primary)', letterSpacing: '-0.01em' }}>
              {language === 'en' ? 'Analysis Projects' : '分析專案庫'}
            </h1>
          </div>
          <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus style={{ width: 14, height: 14 }} />
            {language === 'en' ? 'New Analysis' : '新增分析'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'var(--orion-text-tertiary)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={language === 'en' ? 'Search analyses...' : '搜尋分析記錄...'}
              className="orion-input"
              style={{ paddingLeft: '32px', width: '100%' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'completed', 'processing', 'failed'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--orion-radius-sm)',
                  fontFamily: 'var(--orion-font-mono)',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: statusFilter === s ? 'var(--orion-gold)' : 'var(--orion-border-gold)',
                  background: statusFilter === s ? 'var(--orion-gold-10)' : 'transparent',
                  color: statusFilter === s ? 'var(--orion-gold)' : 'var(--orion-text-tertiary)',
                  transition: 'all 0.12s ease',
                }}
              >
                {s === 'all' ? 'ALL' : (statusConfig[s]?.label ?? s)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)', overflow: 'hidden' }}>
          <div className="orion-panel-header">
            <BarChart3 style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
            <span className="orion-panel-title">ANALYSIS REGISTRY</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)' }}>
              {isLoading ? '...' : `${filtered.length} RECORDS`}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 120px 140px 40px', padding: '8px 16px', borderBottom: '1px solid var(--orion-border-gold)', background: 'var(--orion-bg-raised)' }}>
            {['需求摘要', '狀態', '時間', ''].map((h, i) => (
              <div key={i} style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)' }}>{h}</div>
            ))}
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '10px', color: 'var(--orion-text-tertiary)' }}>
              <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOADING...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', color: 'var(--orion-text-tertiary)', letterSpacing: '0.1em', marginBottom: '16px' }}>
                {search ? 'NO MATCHING RECORDS' : 'NO ANALYSIS RECORDS'}
              </div>
            </div>
          ) : (
            <div>
              {filtered.map((session, idx) => {
                const sc = statusConfig[session.status] ?? { label: session.status, color: 'var(--orion-text-tertiary)', bg: 'transparent' };
                return (
                  <div key={session.id}
                    onClick={() => setLocation('/war-room')}
                    style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 120px 140px 40px', padding: '12px 16px', borderBottom: idx < filtered.length - 1 ? '1px solid var(--orion-border-subtle)' : 'none', cursor: 'pointer', alignItems: 'center', transition: 'background 0.12s ease' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '4px', background: 'var(--orion-bg-active)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Brain style={{ width: 12, height: 12, color: 'var(--orion-gold)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.875rem', color: 'var(--orion-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {session.inputText.length > 80 ? session.inputText.slice(0, 80) + '…' : session.inputText}
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: '3px', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: sc.color, background: sc.bg, border: `1px solid ${sc.color}40` }}>
                        {sc.label}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-text-tertiary)' }}>
                      Rendering...
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <ChevronRight style={{ width: 12, height: 12, color: 'var(--orion-text-tertiary)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
