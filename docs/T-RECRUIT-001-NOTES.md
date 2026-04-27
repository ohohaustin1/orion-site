# T-RECRUIT-001 — orion-site 端施工備忘

> 下次 session 開做 /jobs 5 頁前端 + nav link 時、先讀這份。
> 目的：避免重蹈本次（2026-04-27）勘查時發現的坑。

---

## 1. 現況（2026-04-27）

| 項目 | 狀態 |
|---|---|
| orion-hub 後端 (Day 1) | ✅ 已上 — `/api/recruit/*` + `cms_recruit_applications` + Telegram envelope (commit `c531fa9`) |
| orion-site `/jobs` 5 頁前端 | ❌ **未做**（Day 3-5 留下次 session） |
| orion-site nav 入口「加入我們」 | ❌ **未加**（defer 到前端做完同 PR 上） |
| 文案最終版 | ⏳ 待 Chairman 過目、未拍板 |
| AI 預打分標準 | ⏳ 待 Chairman 提供 marketing/agent 各 3-5 正例 + 反例 |

---

## 2. nav 結構勘查結論（已驗、可直接用）

**唯一 nav 元件：`src/components/Sidebar.tsx`**

單一 `navItems` 陣列（line 36-43）驅動 3 個 surface：
1. Desktop sidebar（`<aside class="orion-sidebar-desktop">`）
2. Mobile drawer（`<aside class="orion-mobile-drawer">`）
3. Mobile bottom tab（`<nav class="orion-mobile-tab">`）

→ **加 1 筆 navItems = 3 個 surface 全自動同步**、不用分別改 3 處。

**現有順序**：
```
首頁 (/home) — 歷史案件 (/cases) — 服務介紹 (/about) —
核心團隊 (/team) — 資源中心 (/resources)
```

**規劃加入位置**：
```
[首頁] [歷史案件] [服務介紹] [核心團隊] [資源中心] [加入我們]
                                                       ↑ 最右、最低優先級
```

**`navItems` 新增 entry 範例**（lucide icon `Briefcase` 或 `UserPlus`）：
```ts
{ path: '/jobs', label: '加入我們', icon: Briefcase },
```

**不要**：
- ❌ 加紅點 / 「徵才中」badge（破壞「決策級長期主義」品牌、Chairman spec §4 禁）
- ❌ 放最前面（會讓訪客誤判公司性質）
- ❌ 動 `src/components/DashboardLayout.tsx`（那是認證 dashboard 用、跟招聘無關）

**沒有獨立 footer 列頁面 link** — Sidebar 是唯一 nav 表面。`/report` 內有 footer 但是 report-specific、非全站。

---

## 3. ⚠️ 已知 UX 風險（下次施工必驗）

### 3.1 Mobile bottom tab 在 iPhone-SE 寬度會擠

`Sidebar.tsx` 的 `orion-mobile-tab` 目前已有：
- 5 個 `navItems` 按鈕
- 1 個 hardcoded「監測」按鈕（line 228-235，連 https://orion-hub.zeabur.app）

= **6 buttons**

加完「加入我們」後 = **7 buttons**。

iPhone-SE 寬度 375px、扣 padding 後每個 tab 寬度只有 ~50px、放 icon + 中文 label 會：
- 字被截掉（「加入我們」4 字）
- 或 icon 太小（< 16px touch target、低於 Apple HIG 44px 線）

**對策（擇一）**：

A) **bottom tab 不顯示「加入我們」**、只顯示在 desktop sidebar + mobile drawer（漢堡）
   - 優：不破現有 6 button 佈局
   - 缺：手機底欄看不到入口、要從漢堡展開
   - 做法：在 navItems 加 `bottomTab: false` flag、render 時 filter 掉
   - 推薦 ✅（招聘是次要功能、底欄該保留主流程）

B) **bottom tab 把「監測」拿掉**、讓「加入我們」進去
   - 優：保持 6 button
   - 缺：監測是 CTA、不該被招聘擠掉
   - 不建議

C) **bottom tab 全 6 button + 加入我們 = 7、不管 UX**
   - 不建議、實機看會丟臉

→ **預設選 A**。記得驗 iPhone-SE 真機（puppeteer 也要跑 375×667）。

### 3.2 navItems 改 array → 可能影響 active highlight 邏輯

`isActive(path)` 用 `location === path` 比對（line 51）、簡單可靠。
但 `/jobs` 下會有子路由（`/jobs/marketing` `/jobs/agent` `/jobs/apply` `/jobs/success`）、
要確認 active highlight 仍會在「加入我們」上亮（不是只有 `/jobs` exact match）。

→ 改回 `startsWith` 對 `/jobs` 系列：`location === path || location.startsWith(path + '/')`。
→ 但要小心舊 bug（comment line 49-50 D 修：「`/about` 會 highlight `/aboutXyz`」）—
   `/jobs/marketing` 用 `/` 隔開、不會誤命中其他頁、安全。

---

## 4. /jobs 5 頁待做清單（Day 3-5）

| 路由 | 用途 | 阻塞 |
|---|---|---|
| `/jobs` | 招聘總覽（行銷長 + 代理） | 文案待 Chairman 過 |
| `/jobs/marketing` | 行銷長 JD | 同上 |
| `/jobs/agent` | 代理 JD | 同上 |
| `/jobs/apply` | 應徵表單 3 階段 + autosave + multer upload | 串 `POST /api/recruit/apply` |
| `/jobs/success` | 應徵完成確認頁 | 簡單 thank-you 頁 |

**串接 API**：`POST https://orion-hub.zeabur.app/api/recruit/apply`（multipart/form-data with resume file）。

**個資同意條款** + **重複 email 偵測** = Day 6 工作、不卡 Day 3-5 上線。

---

## 5. 驗收（下次做完前）

- [ ] iPhone-SE 375×667、Pixel-7 412×915、iPad 820×1180、desktop 1280×900 puppeteer 全綠
- [ ] mobile bottom tab 只 6 button（決策 A 後）
- [ ] desktop sidebar + mobile drawer 都看到「加入我們」、點下去到 `/jobs`
- [ ] `/jobs/*` 子路由 active highlight 在「加入我們」上
- [ ] `/jobs/apply` 串通 prod `/api/recruit/apply`、Telegram 收到通知
- [ ] 真機 iPhone Safari 試一輪（puppeteer 不算數）

---

## 6. 同 PR 上線、不分批

避免「nav link → 404」中間態。**所有改動進同一個 PR：**
- 新增 `src/pages/JobsPage.tsx` × 5
- 新增 routes 在 `src/App.tsx`
- `Sidebar.tsx` 加 navItems entry + bottomTab filter

---

## 7. 不在這份範圍

- 後端 AI 預打分（`POST /api/admin/recruits/:id/ai-score`）目前回 501、待 Chairman 給標準
- 履歷 R2 storage 升級（`resume_storage_key` 欄位已預留、Day 1 走 BLOB）
- `/admin/recruits` 後台 UI（Day 2、orion-hub 端）

---

*建立：2026-04-27*
*來源：orion-hub PR #19 收尾時 nav 勘查發現「premise 不成立」*
*下次開 session：直接讀這份、不重複勘查*
