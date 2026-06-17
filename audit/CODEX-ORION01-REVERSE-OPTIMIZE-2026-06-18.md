# CODEX 2026-06-18 02:15 Asia/Taipei

## 結論

已依 Chairman 指示，用「多模態 + 多層次反向工程」再優化 ORION01 本地官網。這輪沒有再堆動畫，而是把可讀性、導覽清楚度、影片穩定性與驗證方式補強。

本地預覽：`http://127.0.0.1:4180/home/`

## 反向工程判斷

### 1. 視覺層

問題：桌機已經有高級感，但部分影片在長截圖驗證時會因 lazy play 顯示空白漸層，會讓審稿者誤判成沒有內容。

優化：為 17 支影片全部抽出 poster 首幀，影片未播放前也顯示真實畫面。

### 2. 資訊層

問題：Hero 很震撼，但訪客第一輪仍可能只知道「很厲害」，不一定馬上知道 ORION 交付什麼。

優化：Hero 後新增三張交付物摘要：
- ORION 是什麼
- 你會得到什麼
- 為什麼會複利

### 3. 動線層

問題：手機版有多餘的目前頁面膠囊，和漢堡選單重複，會分散注意力。

優化：隱藏 `orion-page-context`，手機首屏只留下品牌、主標、CTA、選單。

### 4. 影片互動層

問題：全站影片很多，如果全部無條件播放，效能與使用者控制感不好。

優化：`CinematicVideo` 改成 IntersectionObserver 進入視窗才播放，並提供小型「暫停 / 播放」控制。

### 5. 驗證層

問題：手機 fullPage 長截圖遇到 autoplay video 會產生拼接重複，看起來像頁面重複。

優化：驗證腳本改成桌機全頁截圖、手機首屏截圖 + 首頁重點 section 分段截圖，避免錯誤證據。

## 本輪修改

修改檔案：
- `src/components/shared/CinematicVideo.tsx`
- `src/pages/HomePage.tsx`
- `src/index.css`
- `scripts/verify-orion-redesign.mjs`

新增素材：
- `public/videos/posters/*.jpg`

## 驗證

已執行：
- `npm run lint` PASS
- `npm run build` PASS
- `node scripts/verify-orion-redesign.mjs` PASS

瀏覽器驗證結果：
- desktop + mobile
- routes: `/home/`, `/cases/`, `/insights/`, `/about/`, `/team/`, `/resources/`
- consoleErrors: 0
- pageErrors: 0
- overflowX: false
- hasGarbled: false
- readyVideos: 全部可載入

影片配置掃描：
- totalPlacements: 17
- duplicateVideos: []
- missingPosters: []

截圖證據：
- `audit/screenshots/orion01-redesign-2026-06-18/desktop-home.png`
- `audit/screenshots/orion01-redesign-2026-06-18/mobile-home.png`
- `audit/screenshots/orion01-redesign-2026-06-18/mobile-home-intro.png`
- `audit/screenshots/orion01-redesign-2026-06-18/mobile-home-workflow.png`
- `audit/screenshots/orion01-redesign-2026-06-18/mobile-home-final-command.png`

## 尚未處理

1. 目前仍是本地驗證，尚未 production deploy。
2. 影片素材正式商用前仍建議換成無浮水印、授權明確、壓縮後的最終素材。
3. Mermaid / flowchart chunk size warning 仍存在，這是既有 bundle 問題，建議另開性能優化任務處理。

## 判斷

這輪優化後，網站比上一版更接近「震撼但能看懂」。首頁現在不是只有視覺，而是有更明確的商業解釋；影片也不會在驗證截圖中出現空框；手機版少了一個多餘干擾點。
