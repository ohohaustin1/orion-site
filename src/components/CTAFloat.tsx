import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Zap, Calendar, FileText, X, Send } from 'lucide-react';

export default function CTAFloat() {
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', phone: '', email: '', need: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setShowModal(false); setSubmitted(false); setFormData({ name: '', company: '', phone: '', email: '', need: '' }); }, 2500);
  };

  return (
    <>
      <div className="orion-cta-float">
        <button className="orion-cta-btn primary" onClick={() => setLocation('/war-room')}>
          <Zap size={16} />
          <span>立即預約 AI 診斷</span>
        </button>
        <button className="orion-cta-btn secondary" onClick={() => window.open('https://calendly.com', '_blank')}>
          <Calendar size={16} />
          <span>預約顧問諮詢</span>
        </button>
        <button className="orion-cta-btn tertiary" onClick={() => setShowModal(true)}>
          <FileText size={16} />
          <span>取得專屬方案</span>
        </button>
      </div>

      {showModal && (
        <div className="orion-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="orion-modal" onClick={e => e.stopPropagation()}>
            <button className="orion-modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#10003;</div>
                <h3 style={{ color: 'var(--orion-gold)', marginBottom: '8px' }}>已收到您的需求</h3>
                <p style={{ color: 'var(--orion-text-secondary)' }}>我們將在 24 小時內回覆您</p>
              </div>
            ) : (
              <>
                <h3 style={{ color: 'var(--orion-gold)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '4px' }}>取得專屬落地方案</h3>
                <p style={{ color: 'var(--orion-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>填寫需求，我們為您量身規劃 AI 導入策略</p>
                <form onSubmit={handleSubmit} className="orion-contact-form">
                  <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="text" placeholder="公司名稱 *" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                  <input type="tel" placeholder="手機號碼" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <input type="email" placeholder="Email *" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <textarea placeholder="請描述您的需求..." rows={3} value={formData.need} onChange={e => setFormData({...formData, need: e.target.value})} />
                  <button type="submit" className="orion-form-submit">
                    <Send size={16} />
                    <span>送出需求</span>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
