import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, X, Shield, Zap } from 'lucide-react';

interface ContactFormModalProps {
  sessionId: number;
  demandSummary: string;
  onSuccess: () => void;
  onClose?: () => void;
}

export function ContactFormModal({ sessionId, demandSummary, onSuccess, onClose }: ContactFormModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message || '提交失敗，請重試');
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = '姓名為必填';
    if (!email.trim()) newErrors.email = 'Email 為必填';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) newErrors.email = 'Email 格式不正確';
    if (!whatsapp.trim()) newErrors.whatsapp = 'WhatsApp 號碼為必填';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitMutation.mutate({
      sessionId,
      name: name.trim(),
      company: company.trim() || undefined,
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      demandSummary,
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(201,168,76,0.04)',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: 6,
    color: 'var(--orion-text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'var(--orion-font-body)',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontFamily: 'var(--orion-font-mono)',
    color: 'var(--orion-text-secondary)',
    letterSpacing: '0.06em',
    marginBottom: 5,
  };

  const errorStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: '#ef4444',
    marginTop: 3,
    fontFamily: 'var(--orion-font-mono)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(10,13,20,0.6)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 460,
          background: 'var(--orion-bg-panel)',
          border: '1px solid rgba(201,168,76,0.5)',
          borderTop: '2px solid var(--orion-gold)',
          borderRadius: 12,
          padding: '28px 28px 24px',
          boxShadow: '0 0 60px rgba(201,168,76,0.12)',
          animation: 'orion-alert-fade 0.3s ease',
          position: 'relative',
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--orion-text-tertiary)',
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(201,168,76,0.1)',
              border: '1px solid rgba(201,168,76,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={14} style={{ color: 'var(--orion-gold)' }} />
            </div>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--orion-gold)',
              fontFamily: 'var(--orion-font-display)',
              letterSpacing: '0.06em',
            }}>
              解鎖完整診斷報告
            </h2>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--orion-text-secondary)', lineHeight: 1.6 }}>
            填寫聯絡資訊後，即可立即解鎖完整架構分析、矛盾偵測報告及工程 Prompt。
          </p>
        </div>

        {demandSummary && (
          <div style={{
            padding: '8px 12px',
            background: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.15)',
            borderRadius: 6,
            marginBottom: 18,
          }}>
            <div style={{ fontSize: '0.6875rem', fontFamily: 'var(--orion-font-mono)', color: 'var(--orion-text-tertiary)', letterSpacing: '0.06em', marginBottom: 4 }}>
              需求摘要（唯讀）
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--orion-text-secondary)', lineHeight: 1.5 }}>
              {demandSummary.length > 120 ? demandSummary.slice(0, 120) + '...' : demandSummary}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>姓名 <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="您的姓名"
                style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : undefined }}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            <div>
              <label style={labelStyle}>公司名稱</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="公司或組織名稱（選填）"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : undefined }}
              />
              {errors.email && <p style={errorStyle}>{errors.email}</p>}
            </div>

            <div>
              <label style={labelStyle}>WhatsApp <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="tel"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="+886 912 345 678"
                style={{ ...inputStyle, borderColor: errors.whatsapp ? '#ef4444' : undefined }}
              />
              {errors.whatsapp && <p style={errorStyle}>{errors.whatsapp}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            style={{
              width: '100%',
              marginTop: 20,
              padding: '12px 0',
              background: 'linear-gradient(135deg, var(--orion-gold), #a68a3f)',
              border: 'none',
              borderRadius: 6,
              color: '#0a0d14',
              fontWeight: 700,
              fontSize: '0.9375rem',
              fontFamily: 'var(--orion-font-display)',
              letterSpacing: '0.06em',
              cursor: submitMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: submitMutation.isPending ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'opacity 0.15s',
            }}
          >
            {submitMutation.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> 提交中...</>
            ) : (
              <><Zap size={16} /> 立即解鎖完整報告</>
            )}
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: 'var(--orion-text-tertiary)', marginTop: 10, fontFamily: 'var(--orion-font-mono)' }}>
            資料加密傳輸 · 不會分享給第三方
          </p>
        </form>
      </div>
    </div>
  );
}
