/**
 * Terms.tsx — 服務條款 / Terms of Service (T-OAUTH-APPREVIEW-PREP)
 *
 * 為 OAuth App Review (Google + Meta) 必要、客戶看 OAuth 同意畫面時需點此連結。
 * Bilingual:繁中(主)+ English(OAuth reviewers)。
 * Last updated: 2026-05-02。
 *
 * 共用 Privacy.tsx 的 LEGAL_CSS — 為避免兩 file 各自帶一份 styled、
 * 但 Vite 會自動 dedupe 重複的 <style> 字串、故 cost 0。
 */

import React from 'react';

const LAST_UPDATED = '2026-05-04';

export default function Terms() {
  return (
    <div className="legal-page">
      <style>{LEGAL_CSS}</style>
      <div className="legal-container">
        <header className="legal-header">
          <a href="/home" className="legal-back">← 回首頁</a>
          <h1 className="legal-title">服務條款 / Terms of Service</h1>
          <p className="legal-meta">最後更新 / Last updated: {LAST_UPDATED}</p>
        </header>

        <nav className="legal-toc">
          <a href="#tw">繁體中文</a>
          <span className="legal-toc-sep">·</span>
          <a href="#en">English</a>
        </nav>

        {/* ─── 繁體中文 ─── */}
        <section id="tw" className="legal-section">
          <h2 className="legal-section-title">服務條款(繁體中文)</h2>

          <p className="legal-paragraph">
            歡迎使用 Orion AI Group(以下稱「我們」)提供的服務。註冊、登入或使用本服務,
            即表示你同意以下條款。請仔細閱讀。
          </p>

          <h3 className="legal-h3">1. 服務內容</h3>
          <p className="legal-paragraph">
            Orion AI 提供 AI 輔助的企業需求診斷服務,包含:
          </p>
          <ul className="legal-list">
            <li>O AI 對話式診斷(免費)</li>
            <li>個人化診斷報告生成</li>
            <li>付費深度諮詢與工程師對接(線下金流、Chairman 手動標記)</li>
            <li>VIP 深度掃描(/scan,Chairman 拍板開放給已付費客戶)</li>
          </ul>

          <h3 className="legal-h3">2. 使用者義務</h3>
          <ul className="legal-list">
            <li>提供正確、真實的資料(產業、規模、聯絡方式等)</li>
            <li>不得提供虛偽不實或他人之個資</li>
            <li>不得用於違法、騷擾、攻擊、繞過認證等行為</li>
            <li>不得試圖逆向工程、破解、入侵本服務之系統</li>
            <li>須對自己 OAuth 帳號(Google / Facebook)的安全負責</li>
          </ul>

          <h3 className="legal-h3">3. 服務限制與免責</h3>
          <p className="legal-paragraph">
            本服務的 AI 輸出與診斷建議,屬於<strong>顧問參考性質</strong>、
            <strong>非專業律師、會計、醫療等專業意見</strong>。重大商業決策前,
            請務必諮詢相關專業人士。我們對 AI 輸出的準確性盡商業合理之注意,
            但不擔保特定結果。
          </p>
          <p className="legal-paragraph">
            因第三方服務(Anthropic、Google、Meta、Calendly 等)中斷或異常造成
            服務無法使用時,我們不負責賠償該期間之損失。
          </p>

          <h3 className="legal-h3">4. 智慧財產權</h3>
          <ul className="legal-list">
            <li>本網站介面、程式碼、商標(獅鷲圖騰)、文案等智財權屬 Orion AI Group</li>
            <li>你提供的對話內容、診斷資料,授權我們在隱私權政策範圍內處理</li>
            <li>AI 為你生成的報告,你享有使用、轉發、儲存之權利</li>
            <li>未經書面授權、不得商業利用本服務之 AI 輸出</li>
          </ul>

          <h3 className="legal-h3">5. 付費服務</h3>
          <p className="legal-paragraph">
            目前付費深度諮詢採線下匯款方式。Chairman 手動確認付款後、會在系統內標記
            並通知工程師對接。退費比照中華民國消費者保護法相關規定。
          </p>

          <h3 className="legal-h3">6. 責任限制</h3>
          <p className="legal-paragraph">
            在法律允許範圍內,我們對任何<strong>間接、附隨、衍生損害</strong>
            (含資料遺失、營業損失、商譽損失等)不負責賠償。我們對你的最大賠償
            責任,以你支付過的服務費用總額為上限(若免費客戶則為新台幣 1,000 元)。
          </p>

          <h3 className="legal-h3">7. 終止</h3>
          <p className="legal-paragraph">
            你可隨時透過撤銷 OAuth 授權、寄信申請刪除帳號,終止本服務之使用。
            若你違反本條款,我們得逕行終止服務並保留法律追訴權。
          </p>

          <h3 className="legal-h3">8. 條款變更</h3>
          <p className="legal-paragraph">
            重大條款變更會在本頁面標示新「最後更新」日期、並透過 email(若有)通知
            註冊用戶。繼續使用服務即視為同意新條款。
          </p>

          <h3 className="legal-h3">9. 準據法與管轄</h3>
          <p className="legal-paragraph">
            本條款受中華民國(台灣)法律規範。如雙方爭議無法協商解決,
            合意以台灣台北地方法院為第一審管轄法院。
          </p>

          <h3 className="legal-h3">10. 聯絡資訊</h3>
          <p className="legal-paragraph">
            服務相關問題、付費問題、條款疑義、請聯絡:
            <br /><a href="mailto:ohohaustin1@gmail.com" className="legal-link">ohohaustin1@gmail.com</a>
          </p>
        </section>

        {/* ─── English ─── */}
        <section id="en" className="legal-section">
          <h2 className="legal-section-title">Terms of Service (English)</h2>

          <p className="legal-paragraph">
            Welcome to Orion AI Group ("we", "our", "us"). By registering, signing in,
            or using our service, you agree to the following terms. Please read carefully.
          </p>

          <h3 className="legal-h3">1. Service Description</h3>
          <p className="legal-paragraph">
            Orion AI provides AI-assisted business diagnostic services, including:
          </p>
          <ul className="legal-list">
            <li>O AI conversational diagnostic (free)</li>
            <li>Personalized AI-generated diagnostic reports</li>
            <li>Paid deep consultation with engineer hand-off (offline payment, manually flagged)</li>
            <li>VIP deep-scan workspace (/scan, opened to paid customers at Chairman's discretion)</li>
          </ul>

          <h3 className="legal-h3">2. User Obligations</h3>
          <ul className="legal-list">
            <li>Provide accurate and truthful information (industry, scale, contact details)</li>
            <li>Do not submit fictitious data or third parties' personal data</li>
            <li>Do not use the service for unlawful, harassing, attacking, or authentication-bypassing purposes</li>
            <li>Do not reverse-engineer, crack, or intrude on our systems</li>
            <li>You are responsible for the security of your OAuth (Google / Facebook) account</li>
          </ul>

          <h3 className="legal-h3">3. Service Limitations & Disclaimer</h3>
          <p className="legal-paragraph">
            AI outputs and diagnostic recommendations are <strong>advisory in nature</strong>
            and <strong>do not constitute legal, accounting, medical, or other professional advice</strong>.
            Consult appropriate professionals before making material business decisions. We exercise
            commercially reasonable care over output accuracy but make no warranty of specific outcomes.
          </p>
          <p className="legal-paragraph">
            We are not liable for losses incurred during service unavailability caused by third-party
            providers (Anthropic, Google, Meta, Calendly, etc.) outage.
          </p>

          <h3 className="legal-h3">4. Intellectual Property</h3>
          <ul className="legal-list">
            <li>Site UI, code, trademark (griffin logo), and copy are owned by Orion AI Group</li>
            <li>Your conversation content and diagnostic data are licensed to us within Privacy Policy scope</li>
            <li>AI-generated reports for you may be used, forwarded, and stored by you</li>
            <li>Commercial reuse of AI outputs requires prior written authorization</li>
          </ul>

          <h3 className="legal-h3">5. Paid Services</h3>
          <p className="legal-paragraph">
            Paid deep consultation currently uses offline payment. Chairman manually confirms payment
            and flags within the system, then notifies the engineer. Refunds follow the Republic of
            China (Taiwan) Consumer Protection Act.
          </p>

          <h3 className="legal-h3">6. Limitation of Liability</h3>
          <p className="legal-paragraph">
            To the extent permitted by law, we are not liable for any <strong>indirect, incidental,
            or consequential damages</strong> (including data loss, business loss, goodwill loss).
            Our total liability to you is capped at the total fees you have paid us (or NT$1,000
            if you are a free user).
          </p>

          <h3 className="legal-h3">7. Termination</h3>
          <p className="legal-paragraph">
            You may terminate use at any time by revoking OAuth authorization or emailing us to delete
            your account. If you breach these Terms, we may immediately terminate service and reserve
            all legal rights of action.
          </p>

          <h3 className="legal-h3">8. Changes</h3>
          <p className="legal-paragraph">
            Material changes will be reflected by updating the "Last updated" date above and, where
            we have an email on file, notifying registered users. Continued use after changes
            constitutes acceptance.
          </p>

          <h3 className="legal-h3">9. Governing Law & Jurisdiction</h3>
          <p className="legal-paragraph">
            These Terms are governed by the laws of the Republic of China (Taiwan). Any dispute that
            cannot be resolved by negotiation shall be submitted to the Taipei District Court of
            Taiwan as the court of first instance.
          </p>

          <h3 className="legal-h3">10. Contact</h3>
          <p className="legal-paragraph">
            For service questions, payment issues, or any clarification, contact:
            <br /><a href="mailto:ohohaustin1@gmail.com" className="legal-link">ohohaustin1@gmail.com</a>
          </p>
        </section>

        <footer className="legal-footer">
          <p>© {new Date().getFullYear()} Orion AI Group. All rights reserved.</p>
          <p>
            <a href="/home" className="legal-link">回首頁 / Home</a>
            <span className="legal-toc-sep">·</span>
            <a href="/privacy" className="legal-link">隱私權政策 / Privacy Policy</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

// Same CSS as Privacy.tsx — Vite dedupes identical <style> blocks. If we move to a
// shared module later, copy LEGAL_CSS to src/styles/legal.css. For 2 pages, inline
// duplication is fine (no shared chunk required).
const LEGAL_CSS = `
  .legal-page {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at top, #0f0c08 0%, rgba(0,0,0,0) 60%),
      linear-gradient(180deg, #0a0a0a 0%, #050505 100%);
    color: #F5F5F5;
    font-family: 'Noto Sans TC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    padding: 40px 20px 80px;
  }
  .legal-container { max-width: 760px; margin: 0 auto; }
  .legal-header {
    margin-bottom: 32px;
    border-bottom: 1px solid rgba(245,166,35,0.15);
    padding-bottom: 20px;
  }
  .legal-back {
    display: inline-block;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    font-size: 14px;
    margin-bottom: 12px;
    transition: color .15s;
  }
  .legal-back:hover { color: #FFD369; }
  .legal-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 30px;
    font-weight: 600;
    color: #FFD369;
    letter-spacing: 0.04em;
    margin-bottom: 8px;
  }
  .legal-meta { font-size: 13px; color: rgba(255,255,255,0.45); }
  .legal-toc { margin-bottom: 32px; font-size: 14px; }
  .legal-toc a { color: #C5A059; text-decoration: none; transition: color .15s; }
  .legal-toc a:hover { color: #FFD369; }
  .legal-toc-sep { color: rgba(255,255,255,0.3); margin: 0 10px; }
  .legal-section { margin-bottom: 48px; }
  .legal-section-title {
    font-family: 'Cormorant Garamond', 'Noto Serif TC', serif;
    font-size: 24px;
    font-weight: 600;
    color: #FFD369;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px dashed rgba(245,166,35,0.18);
  }
  .legal-h3 {
    font-size: 17px;
    font-weight: 600;
    color: #C5A059;
    margin-top: 24px;
    margin-bottom: 10px;
    letter-spacing: 0.02em;
  }
  .legal-paragraph {
    font-size: 15px;
    line-height: 1.8;
    color: rgba(255,255,255,0.82);
    margin-bottom: 12px;
  }
  .legal-list {
    list-style: disc inside;
    margin: 8px 0 16px 8px;
    font-size: 15px;
    line-height: 1.8;
    color: rgba(255,255,255,0.82);
  }
  .legal-list li { margin-bottom: 6px; }
  .legal-list strong { color: #FFD369; font-weight: 500; }
  .legal-paragraph code, .legal-list code {
    background: rgba(245,166,35,0.08);
    border: 1px solid rgba(245,166,35,0.18);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #FFD369;
    font-family: 'Courier New', monospace;
  }
  .legal-paragraph strong { color: #FFD369; font-weight: 500; }
  .legal-link {
    color: #FFD369;
    text-decoration: underline;
    text-decoration-color: rgba(245,166,35,0.32);
    text-underline-offset: 3px;
    transition: text-decoration-color .15s;
  }
  .legal-link:hover { text-decoration-color: #FFD369; }
  .legal-footer {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid rgba(245,166,35,0.15);
    text-align: center;
    color: rgba(255,255,255,0.45);
    font-size: 13px;
  }
  .legal-footer p { margin-bottom: 8px; }

  @media (max-width: 600px) {
    .legal-page { padding: 24px 16px 60px; }
    .legal-title { font-size: 24px; }
    .legal-section-title { font-size: 20px; }
  }
`;
