import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { User, Brain, BarChart3, Shield, Star, ChevronRight, Plus } from 'lucide-react';

const ORION_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663363086045/AT6eHx6ujNfSNacHbhaScT/9FA5B95E-A268-4F60-9751-F2D7D9CCEFF5_3606b99d.png';

export default function Clients() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const { user } = useAuth();

  const capabilities = [
    { icon: Brain, label: language === 'en' ? 'Demand Diagnosis' : '需求診斷', desc: language === 'en' ? 'AI-powered requirement analysis' : 'AI 驅動需求解構', status: 'ACTIVE' },
    { icon: BarChart3, label: language === 'en' ? 'Architecture Generation' : '架構生成', desc: language === 'en' ? 'Structured blueprint output' : '結構化架構輸出', status: 'ACTIVE' },
    { icon: Shield, label: language === 'en' ? 'Risk Detection' : '風險偵測', desc: language === 'en' ? 'Contradiction & risk analysis' : '矛盾與風險分析', status: 'ACTIVE' },
    { icon: Star, label: language === 'en' ? 'ROI Projection' : 'ROI 預估', desc: language === 'en' ? 'Cost & value estimation' : '成本與價值評估', status: 'BETA' },
  ];

  return (
    <DashboardLayout>
      <div style={{ color: 'var(--orion-text-primary)' }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orion-text-tertiary)', marginBottom: '6px' }}>
              OPERATOR PROFILE
            </div>
            <h1 style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--orion-text-primary)', letterSpacing: '-0.01em' }}>
              {language === 'en' ? 'Account Center' : '帳號中心'}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)' }}>
            <div className="orion-panel-header">
              <User style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
              <span className="orion-panel-title">OPERATOR IDENTITY</span>
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--orion-gold)', margin: '0 auto 16px', display: 'block', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--orion-gold)', margin: '0 auto 16px', background: 'var(--orion-bg-active)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: 28, height: 28, color: 'var(--orion-gold)' }} />
                </div>
              )}
              <div style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--orion-text-primary)', marginBottom: '4px' }}>
                {user?.name ?? '—'}
              </div>
              <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--orion-gold)', marginBottom: '16px' }}>
                ORION OPERATOR
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ padding: '4px 10px', borderRadius: '3px', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--orion-status-ok)', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  AUTHENTICATED
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--orion-border-subtle)', paddingTop: '16px' }}>
                <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)', letterSpacing: '0.1em', marginBottom: '6px' }}>USER ID</div>
                <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.75rem', color: 'var(--orion-text-secondary)', wordBreak: 'break-all' }}>
                  {user?.id ?? '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderTop: '2px solid var(--orion-gold)', borderRadius: 'var(--orion-radius-md)' }}>
              <div className="orion-panel-header">
                <Shield style={{ width: 13, height: 13, color: 'var(--orion-gold)' }} />
                <span className="orion-panel-title">SYSTEM CAPABILITIES</span>
              </div>
              <div style={{ padding: '12px' }}>
                {capabilities.map((cap, idx) => {
                  const Icon = cap.icon;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '4px', marginBottom: idx < capabilities.length - 1 ? '4px' : 0, border: '1px solid var(--orion-border-subtle)', background: 'var(--orion-bg-raised)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '4px', background: 'var(--orion-bg-active)', border: '1px solid var(--orion-border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: 16, height: 16, color: 'var(--orion-gold)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--orion-font-body)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--orion-text-primary)', marginBottom: '2px' }}>{cap.label}</div>
                        <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.625rem', color: 'var(--orion-text-tertiary)' }}>{cap.desc}</div>
                      </div>
                      <span style={{ padding: '3px 8px', borderRadius: '3px', fontFamily: 'var(--orion-font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: cap.status === 'ACTIVE' ? 'var(--orion-status-ok)' : 'var(--orion-gold)', background: cap.status === 'ACTIVE' ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.08)', border: `1px solid ${cap.status === 'ACTIVE' ? 'rgba(74,222,128,0.3)' : 'rgba(201,168,76,0.3)'}` }}>
                        {cap.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: 'var(--orion-bg-panel)', border: '1px solid var(--orion-border-gold)', borderRadius: 'var(--orion-radius-md)', padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img src={ORION_LOGO} alt="ORION" style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(201,168,76,0.4))' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--orion-font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--orion-text-primary)', marginBottom: '4px' }}>
                  {language === 'en' ? 'Ready for Analysis' : '準備好開始分析'}
                </div>
                <div style={{ fontFamily: 'var(--orion-font-mono)', fontSize: '0.6875rem', color: 'var(--orion-text-tertiary)' }}>
                  {language === 'en' ? 'Enter War Room to start AI-powered requirement diagnosis' : '進入戰情室，啟動 AI 需求診斷'}
                </div>
              </div>
              <button onClick={() => setLocation('/war-room')} className="orion-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <Brain style={{ width: 14, height: 14 }} />
                {language === 'en' ? 'War Room' : '戰情室'}
                <ChevronRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
