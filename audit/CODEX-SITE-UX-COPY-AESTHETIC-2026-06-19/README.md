# CODEX 全站文字 / 流程 / 美學檢查

時間：2026-06-19 18:03 +08:00

## 結論

完成本輪「導覽美術修復 + 全站第一屏文案流程檢查 + 桌機/手機瀏覽器驗證」。

本輪沒有重做整站內容，也沒有動 O AI 後端。主要修掉截圖中最明顯的廉價感來源：導覽列輸出是 `<a>`，但 CSS 寫成 `.orion-topnav-links button`，導致主導覽沒有吃到正確樣式、active 狀態與橫排節奏。

## 本輪實作

1. 重做頂部導覽視覺
   - 改成更像企業級 SaaS command bar 的玻璃深藍 / 霧金層次。
   - 導覽 active 狀態改成淡金白 pill，保留高級感但不過度霓虹。
   - 品牌區塊加大 logo 與 ORION AI 層級，副標保留「幫你追客、追單、追進度」。

2. 修正導覽 CSS selector
   - 原本 `.orion-topnav-links button` 改為 `.orion-topnav-links a`。
   - Link 目前是橫排 flex，不再變成圖示壓在文字上方。

3. 精簡導覽文案
   - 「實戰案例」改成「案例」。
   - 「數據洞察」改成「洞察」。
   - 「服務介紹」改成「服務」。
   - 「核心團隊」改成「團隊」。
   - 「資源中心」改成「資源」。
   - Primary CTA 從「啟動診斷」改成「免費診斷」，降低第一眼壓力。

4. 補無障礙與語意
   - active nav 補 `aria-current="page"`。
   - focus-visible 補上可見焦點。

## 全站文字與流程檢查

檢查頁面：

- `/home`
- `/cases`
- `/about`
- `/insights`
- `/team`
- `/resources`

### 文案判斷

目前全站主軸已經比上一版清楚：不是「企業級 AI 決策基礎建設」這種內部語言，而是「幫老闆追客、追單、追進度」。

首頁第一眼可理解：

- O AI 是幫手。
- 會幫你把常卡的工作拆成流程。
- 可以先免費拆一條流程。
- 可以先看實戰案例。

案例頁第一眼可理解：

- 不炫技，直接看客人、訂單、回訪有沒有追到結果。
- 右側影片支撐商業場景，不是抽象圖案。

服務 / 洞察 / 團隊 / 資源頁目前主標都有人話：

- 服務：把每天要追人的事交給 O。
- 洞察：看老闆有沒有少追客人、少追單、少追進度。
- 團隊：把混亂流程做成每天會跑的系統。
- 資源：先問哪件事你每天都在追。

### 還可再提高的地方

1. 首頁 Hero 很清楚，但文字仍偏長。
   - 可再做一版更短的「三秒版」：一句痛點、一句結果、一個例子。

2. 案例頁第一屏很強，但下面案例如果 API 回資料過多，後段需要再檢查是否每張卡都有不同視覺。

3. 「免費診斷」和「免費拆第一條流程」兩個 CTA 都能用，但下一輪可以統一成同一種語氣，減少認知切換。

## 瀏覽器驗證

工具：Puppeteer + Chrome headless

本地 URL：`http://127.0.0.1:4187`

桌機 viewport：1440 x 900

手機 viewport：390 x 844

結果：

- 6 個前台頁面桌機 `overflowX = 0`
- 6 個前台頁面手機 `overflowX = 0`
- 桌機 nav link count = 6
- 桌機 active nav 正確：
  - `/home` = 首頁
  - `/cases` = 案例
  - `/about` = 服務
  - `/insights` = 洞察
  - `/team` = 團隊
  - `/resources` = 資源
- 桌機第一個 nav link computed display = `flex`
- 桌機 nav link flexDirection = `row`
- 手機 menu display = `grid`
- 可見重複圖片只有品牌 logo，不是案例素材重複
- 可見重複影片 = 0

## 驗證證據

- `browser-check.json`
- `desktop-home.png`
- `desktop-cases.png`
- `desktop-about.png`
- `desktop-insights.png`
- `desktop-team.png`
- `desktop-resources.png`
- `mobile-home.png`
- `mobile-cases.png`
- `mobile-about.png`
- `mobile-insights.png`
- `mobile-team.png`
- `mobile-resources.png`

## 驗證等級

L1：`npm run lint` 通過。

L2：`npm run build` 通過。

L3：本地 Chrome 瀏覽器驗證通過。

L4：尚未做 production 驗證，需 push/deploy 後再驗。

## 未驗項目

- 尚未用真機手動滑完整站。
- 尚未等 production deploy 後做線上複驗。
- 尚未做 Lighthouse / WCAG AA 全量評分。

## 下一步建議

1. 先上線本輪導覽修復，因為這是截圖中最明顯的美術斷點。
2. 上線後再做 production L4 驗證。
3. 下一輪再做首頁 Hero「三秒版文案」A/B：更短、更像廣告鉤子。
