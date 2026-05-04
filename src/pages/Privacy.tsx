/**
 * Privacy.tsx — 隱私權政策 / Privacy Policy (T-OAUTH-APPREVIEW-PREP)
 *
 * 為 OAuth App Review (Google + Meta) 必要、客戶看 OAuth 同意畫面時需點此連結。
 * Bilingual:繁中(主、台灣讀者)+ English(OAuth reviewers)。
 * Last updated: 2026-05-02。
 */

import React from 'react';

const LAST_UPDATED = '2026-05-04';

export default function Privacy() {
  return (
    <div className="legal-page">
      <style>{LEGAL_CSS}</style>
      <div className="legal-container">
        <header className="legal-header">
          <a href="/home" className="legal-back">← 回首頁</a>
          <h1 className="legal-title">隱私權政策 / Privacy Policy</h1>
          <p className="legal-meta">最後更新 / Last updated: {LAST_UPDATED}</p>
        </header>

        <nav className="legal-toc">
          <a href="#tw">繁體中文</a>
          <span className="legal-toc-sep">·</span>
          <a href="#en">English</a>
        </nav>

        {/* ─── 繁體中文 ─── */}
        <section id="tw" className="legal-section">
          <h2 className="legal-section-title">隱私權政策(繁體中文)</h2>

          <p className="legal-paragraph">
            Orion AI Group(以下稱「我們」)感謝你使用我們的 AI 顧問服務。本政策說明
            我們如何收集、使用、保護你的個人資料,以及你享有的權利。
          </p>

          <h3 className="legal-h3">1. 服務提供者資訊</h3>
          <ul className="legal-list">
            <li>服務名稱:Orion AI(獵戶座智鑑)</li>
            <li>聯絡 Email:ohohaustin1@gmail.com</li>
            <li>網站:https://orion01.com</li>
          </ul>

          <h3 className="legal-h3">2. 我們收集哪些個人資料</h3>
          <ul className="legal-list">
            <li><strong>OAuth 帳號資料</strong>:當你用 Google 或 Facebook 登入時,
              我們從該服務取得 email、姓名(display name)、唯一識別碼。</li>
            <li><strong>對話紀錄</strong>:你和 O AI 對話的內容、回答的痛點 / 產業
              / 規模等診斷資料。</li>
            <li><strong>診斷報告</strong>:AI 根據對話生成的報告內容。</li>
            <li><strong>聯絡方式</strong>:當你在報告頁主動提供 LINE / 電話 / Email
              / 預約時段時。</li>
            <li><strong>Cookie</strong>:orion_session(身份驗證,30 天)。</li>
            <li><strong>網站使用統計</strong>:IP 位址、瀏覽器類型、瀏覽路徑(用於改善服務、
              不關聯特定客戶身份)。</li>
          </ul>

          <h3 className="legal-h3">3. 我們如何使用你的資料</h3>
          <ul className="legal-list">
            <li>提供 AI 診斷服務、產生個人化報告</li>
            <li>讓你登入後能看到完整報告(身份驗證)</li>
            <li>客戶選擇付費深度諮詢時、接洽工程師</li>
            <li>內部品質改善(去識別化後分析)</li>
            <li>必要時聯繫你回覆服務問題</li>
          </ul>

          <h3 className="legal-h3">4. 第三方服務(資料可能流經以下廠商)</h3>
          <ul className="legal-list">
            <li><strong>Anthropic Claude API</strong>:AI 模型推論。對話內容會送至
              Claude 處理但不會被 Anthropic 用於訓練。</li>
            <li><strong>Google OAuth</strong>:提供 Google 帳號登入。</li>
            <li><strong>Meta(Facebook)OAuth</strong>:提供 Facebook 帳號登入。</li>
            <li><strong>Calendly</strong>:預約 30 分鐘深聊。</li>
            <li><strong>Zeabur</strong>:後端服務代管。</li>
            <li><strong>Vercel</strong>:前端網站代管。</li>
            <li><strong>Telegram Bot API</strong>:工程師端通知(僅含必要 lead 摘要、
              不含對話原文)。</li>
          </ul>

          <h3 className="legal-h3">5. 資料保留期限</h3>
          <p className="legal-paragraph">
            我們保留你的對話紀錄與診斷報告 5 年(自最後互動日起算),以利後續
            諮詢追蹤與服務改進。OAuth 登入 session 30 天後自動失效。你可隨時申請刪除。
          </p>

          <h3 className="legal-h3">6. 你的權利</h3>
          <ul className="legal-list">
            <li>查詢、閱覽:寄信至 ohohaustin1@gmail.com 索取你的資料副本</li>
            <li>更正、補充:寄信告知</li>
            <li>停止處理:申請暫停資料處理</li>
            <li>刪除:寄信申請刪除你的所有資料</li>
            <li>OAuth 連結:你可隨時在 Google / Facebook 設定中撤銷 Orion AI 的存取權限</li>
          </ul>

          <h3 className="legal-h3">7. 資料安全</h3>
          <p className="legal-paragraph">
            我們使用 HTTPS 加密所有傳輸、cookie 設 httpOnly + Secure + SameSite=Lax、
            OAuth tokens 加密存儲。但無 100% 安全的網際網路傳輸,合理風險仍須由用戶
            知悉。
          </p>

          <h3 className="legal-h3">8. Cookie 政策</h3>
          <p className="legal-paragraph">
            我們使用必要 cookie:<code>orion_session</code>(身份驗證,30 天)。
            未設追蹤或行銷 cookie。瀏覽器封鎖此 cookie 將無法登入完整報告。
          </p>

          <h3 className="legal-h3">9. 兒童隱私</h3>
          <p className="legal-paragraph">
            本服務面向企業主與決策者、不主動收集 18 歲以下未成年人資料。如發現誤收、
            將立即刪除。
          </p>

          <h3 className="legal-h3">10. 政策變更</h3>
          <p className="legal-paragraph">
            重大變更會在本頁面標示新「最後更新」日期、並透過 email(若有)通知註冊用戶。
          </p>

          <h3 className="legal-h3">11. 準據法與管轄</h3>
          <p className="legal-paragraph">
            本政策受中華民國(台灣)法律規範。任何爭議以台灣台北地方法院為第一審管轄法院。
          </p>

          <h3 className="legal-h3">12. 聯絡我們</h3>
          <p className="legal-paragraph">
            如你對本政策有任何疑問或欲行使上述權利,請聯絡:
            <br /><a href="mailto:ohohaustin1@gmail.com" className="legal-link">ohohaustin1@gmail.com</a>
          </p>
        </section>

        {/* ─── English ─── */}
        <section id="en" className="legal-section">
          <h2 className="legal-section-title">Privacy Policy (English)</h2>

          <p className="legal-paragraph">
            Orion AI Group ("we", "our", "us") thanks you for using our AI consulting
            service. This Privacy Policy explains what data we collect, how we use it,
            and your rights.
          </p>

          <h3 className="legal-h3">1. Service Provider</h3>
          <ul className="legal-list">
            <li>Service name: Orion AI</li>
            <li>Contact email: ohohaustin1@gmail.com</li>
            <li>Website: https://orion01.com</li>
          </ul>

          <h3 className="legal-h3">2. Data We Collect</h3>
          <ul className="legal-list">
            <li><strong>OAuth account data</strong>: when you sign in with Google or
              Facebook, we receive your email, display name, and provider's unique user ID.</li>
            <li><strong>Conversation history</strong>: your messages with O (our AI
              assistant) and the diagnostic data you share (industry, scale, pain points).</li>
            <li><strong>Diagnostic report</strong>: AI-generated report based on the conversation.</li>
            <li><strong>Contact preferences</strong>: any LINE / phone / email / Calendly slot
              you voluntarily provide on the report page.</li>
            <li><strong>Cookies</strong>: <code>orion_session</code> (authentication, 30 days).</li>
            <li><strong>Usage analytics</strong>: IP, browser type, page paths
              (aggregated for service improvement, not tied to individual identity).</li>
          </ul>

          <h3 className="legal-h3">3. How We Use Your Data</h3>
          <ul className="legal-list">
            <li>Deliver AI diagnostic service and generate personalized reports</li>
            <li>Authenticate you to view full unlocked reports</li>
            <li>Connect you with our engineer when you opt for paid deep consultation</li>
            <li>Aggregate / anonymized analysis for product improvement</li>
            <li>Respond to your service inquiries when necessary</li>
          </ul>

          <h3 className="legal-h3">4. Third-Party Services</h3>
          <ul className="legal-list">
            <li><strong>Anthropic Claude API</strong> — AI model inference. Conversations
              are sent to Claude for processing but are NOT used to train Anthropic models.</li>
            <li><strong>Google OAuth</strong> — Google sign-in.</li>
            <li><strong>Meta (Facebook) OAuth</strong> — Facebook sign-in.</li>
            <li><strong>Calendly</strong> — booking 30-minute consulting sessions.</li>
            <li><strong>Zeabur</strong> — backend hosting.</li>
            <li><strong>Vercel</strong> — frontend hosting.</li>
            <li><strong>Telegram Bot API</strong> — internal engineer notifications
              (lead summary only, never raw conversation text).</li>
          </ul>

          <h3 className="legal-h3">5. Data Retention</h3>
          <p className="legal-paragraph">
            We retain your conversation history and diagnostic report for 5 years from
            your last interaction, to support follow-up consultations and service
            improvements. OAuth login sessions expire after 30 days. You can request
            deletion at any time.
          </p>

          <h3 className="legal-h3">6. Your Rights</h3>
          <ul className="legal-list">
            <li>Access / portability: email ohohaustin1@gmail.com to request a copy of your data</li>
            <li>Rectification: email us with corrections</li>
            <li>Restriction: request a temporary processing freeze</li>
            <li>Erasure: email us to delete all your data</li>
            <li>Withdraw OAuth consent: revoke access in your Google / Facebook account settings at any time</li>
          </ul>

          <h3 className="legal-h3">7. Data Security</h3>
          <p className="legal-paragraph">
            All transmission uses HTTPS. Cookies are set with httpOnly + Secure + SameSite=Lax.
            OAuth tokens are encrypted at rest. No internet transmission is 100% secure;
            users should be aware of inherent risk.
          </p>

          <h3 className="legal-h3">8. Cookies</h3>
          <p className="legal-paragraph">
            We use a single essential cookie: <code>orion_session</code> (authentication,
            30 days). We do not set tracking or marketing cookies. Blocking this cookie
            will prevent unlocking the full report.
          </p>

          <h3 className="legal-h3">9. Children's Privacy</h3>
          <p className="legal-paragraph">
            Our service targets business owners and decision-makers. We do not knowingly
            collect data from individuals under 18. If we discover such data, we will delete it.
          </p>

          <h3 className="legal-h3">10. Policy Changes</h3>
          <p className="legal-paragraph">
            Material changes will be reflected by updating the "Last updated" date above
            and, where we have an email on file, notifying registered users.
          </p>

          <h3 className="legal-h3">11. Governing Law</h3>
          <p className="legal-paragraph">
            This Privacy Policy is governed by the laws of the Republic of China (Taiwan).
            The Taipei District Court has exclusive jurisdiction over any dispute.
          </p>

          <h3 className="legal-h3">12. Contact</h3>
          <p className="legal-paragraph">
            For any question or to exercise the rights above, contact:
            <br /><a href="mailto:ohohaustin1@gmail.com" className="legal-link">ohohaustin1@gmail.com</a>
          </p>
        </section>

        <footer className="legal-footer">
          <p>© {new Date().getFullYear()} Orion AI Group. All rights reserved.</p>
          <p>
            <a href="/home" className="legal-link">回首頁 / Home</a>
            <span className="legal-toc-sep">·</span>
            <a href="/terms" className="legal-link">服務條款 / Terms of Service</a>
          </p>
        </footer>
      </div>
    </div>
  );
}

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
  .legal-container {
    max-width: 760px;
    margin: 0 auto;
  }
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
  .legal-meta {
    font-size: 13px;
    color: rgba(255,255,255,0.45);
  }
  .legal-toc {
    margin-bottom: 32px;
    font-size: 14px;
  }
  .legal-toc a {
    color: #C5A059;
    text-decoration: none;
    transition: color .15s;
  }
  .legal-toc a:hover { color: #FFD369; }
  .legal-toc-sep {
    color: rgba(255,255,255,0.3);
    margin: 0 10px;
  }
  .legal-section {
    margin-bottom: 48px;
  }
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
  .legal-list li {
    margin-bottom: 6px;
  }
  .legal-list strong {
    color: #FFD369;
    font-weight: 500;
  }
  .legal-paragraph code, .legal-list code {
    background: rgba(245,166,35,0.08);
    border: 1px solid rgba(245,166,35,0.18);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 13px;
    color: #FFD369;
    font-family: 'Courier New', monospace;
  }
  .legal-link {
    color: #FFD369;
    text-decoration: underline;
    text-decoration-color: rgba(245,166,35,0.32);
    text-underline-offset: 3px;
    transition: text-decoration-color .15s;
  }
  .legal-link:hover {
    text-decoration-color: #FFD369;
  }
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
