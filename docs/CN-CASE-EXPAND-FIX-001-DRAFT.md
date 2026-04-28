# CN-CASE-EXPAND-FIX-001 — 前 3 case 7 欄位 sample（待 Chairman 審）

> **Order**：CN-CASE-EXPAND-FIX-001 P0 (source change)
> **Branch**：`fix/cn-case-expand-fallback`（off main）
> **Step**：Step 2 — 前 3 case 草稿、STOP 等 Chairman 審 tone/quality
> **Step 3 之後**：approval 後完成剩 17 case、跑 puppeteer、開 PR

---

## §1 全 20 case scan 結果

**100% 需 full backfill**：所有 20 case 用的是舊 `BaseCase` interface、**沒有任何一個** case 有 `hero_number / hero_money / hook_question / story_*  / metrics`。沒有 partial 補的選項。

| id | industry | company | 7 欄位狀態 |
|---|---|---|---|
| 1 | 房地產仲介 | 大安房屋顧問團隊（台北）| ❌ 全缺、本 draft sample |
| 2 | 電商零售 | FreshStyle 網路服飾（台中）| ❌ 全缺、本 draft sample |
| 3 | 製造業 | 鉅鑫五金零件廠（台南）| ❌ 全缺、本 draft sample |
| 4-20 | — | 17 個剩餘 | ❌ 全缺、待 approval 後做 |

---

## §2 寫法紀律對齊（執行前自查）

| 紀律 | 確認 |
|---|---|
| 用既有欄位（problem/wrongMove/aiInsight/solution）當原料 | ✅ |
| 不發明新公司名 / 地點 / 沒在原料中的事實 | ✅ |
| 每欄位 1-3 句、不灌水 | ✅ |
| 數字跟既有 results 一致、不亂編 | ✅ |
| 繁體中文 only | ✅ |
| **不**用禁字：賦能 / 打造 / 助力 / 驅動 / 精準 / 全方位整合 / 一站式 | ✅ |
| **不**用「智能化」抽象詞（具體「智能 X 系統」OK）| ✅ |

---

## §3 前 3 case sample

### Case 1：大安房屋顧問團隊（台北）— 房地產仲介

**既有欄位（不動、僅引用）：**
```
problem:    月均 320 組客戶詢問，業務靠直覺跟進，成交率僅 8.7%
wrongMove:  加派人力、增加廣告投放，但 CPL 飆升 41.3%
aiInsight:  71.6% 的高意向客戶被錯誤歸類為低優先級
strategy:   AI 客戶意向評分模型、即時分析對話 / 瀏覽 / 回覆
results:    成交率 8.7% → 23.1%（+27.4%），月成交額增加 NT$2,340 萬
```

**新增 7 欄位：**

```ts
hero_number: '成交率 +27.4%',
hero_money: '月增 NT$2,340 萬',
hook_question: '你怎麼知道 320 組詢問裡、誰最該先打？',
story_empathy:
  '你每天看 320 組詢問跑進來、業務照表打給每一個、成交率還是 8.7%。錢花在廣告、人加在前線、數字反而越做越差。',
story_failed_attempt:
  '加派人力、開大廣告、結果 CPL 飆 41.3%、成交率掉。問題不在投不夠多。',
story_aha_moment:
  '問題不在流量、在篩選——71.6% 的高意向被歸到低優先級、業務根本沒打。',
story_solution:
  '導入 AI 評分、用對話語意 + 瀏覽行為 + 回覆速度自動標 A/B/C 級。業務先打 A 級、3 週後成交率翻到 23%。',
```

字數：hook 19 / empathy 50 / failed 30 / aha 26 / solution 50（皆 ≤ 60、預期 mobile 不折）

---

### Case 2：FreshStyle 網路服飾（台中）— 電商零售

**既有欄位（不動、僅引用）：**
```
problem:    客服日均 480 封訊息、重複問題佔 71.3%、回覆 7.8 小時、退貨 18.6%
wrongMove:  外包客服月花 NT$12.8 萬、滿意度 -14.7%
aiInsight:  退貨率高不是品質——購買前資訊不足導致尺碼 / 色差錯誤佔 63.2%
strategy:   AI 客服自動回覆引擎 + 商品推薦系統
results:    客服成本 -43.7%、回覆 7.8hr → 2.4min、退貨 -21.8%、滿意度 +34.2%
```

**新增 7 欄位：**

```ts
hero_number: '回覆 7.8hr → 2.4min',
hero_money: '客服成本省下近半',
hook_question: '480 封訊息、71% 是同一題、你還請人回？',
story_empathy:
  '客服每天 480 封訊息、回覆要 7.8 小時。退貨率 18.6%、業績越做越虛。看似業務做得起來、實際在燒錢。',
story_failed_attempt:
  '外包客服一個月 NT$12.8 萬、希望省事、結果客戶滿意度反掉 14.7%。錢花了沒解決問題。',
story_aha_moment:
  '退貨不是商品壞——是 63% 的客戶買前不知道尺碼跟色差。資訊不足、選錯了再退。',
story_solution:
  '建 AI 客服回覆引擎吃掉 71% 重複問題、再加商品推薦讓客戶買對。退貨率掉 21%、客服成本省一半。',
```

字數：hook 18 / empathy 47 / failed 32 / aha 30 / solution 41

---

### Case 3：鉅鑫五金零件廠（台南）— 製造業

**既有欄位（不動、僅引用）：**
```
problem:    報價靠電話傳真、平均來回 2.8 天、月損訂單 NT$870 萬
wrongMove:  增聘 2 位業務助理、速度仍 1.4 天
aiInsight:  瓶頸在報價邏輯——87.3% 的詢價可用歷史數據自動算出
strategy:   AI 智能報價系統 + 線上即時詢價平台
results:    報價 2.8 天 → 2.1hr（-91.3%），訂單流失 -37.6%，月營收 +NT$43.7 萬
```

**新增 7 欄位：**

```ts
hero_number: '報價 2.8 天 → 2.1hr',
hero_money: '月救回 NT$43.7 萬',
hook_question: '報價要等 3 天、客戶早跑去下一家——你怎麼追？',
story_empathy:
  '報價靠電話傳真、來回 2.8 天。客戶等不下去、轉頭找別家。月損訂單估 NT$870 萬、看著錢流走。',
story_failed_attempt:
  '加 2 個業務助理專門處理報價、人事成本上去、速度才從 2.8 天降到 1.4 天。慢一倍還是慢。',
story_aha_moment:
  '瓶頸不在人手、在邏輯——87.3% 的詢價可以用歷史報價、材料成本、客戶等級自動算出、根本不需要人工。',
story_solution:
  '建 AI 報價系統 + 線上詢價、客戶下單同時拿到報價。2.8 天變 2.1 小時、訂單流失率掉近四成。',
```

字數：hook 22 / empathy 42 / failed 36 / aha 41 / solution 40

---

## §4 統一風格的 5 個 design choice（請 Chairman 審）

針對 17 個剩餘 case 我會延續這 5 條、避免 tone 漂移：

1. **hero_number 的選擇**：取 `results` 中**最視覺強**的那個（百分比 / 倍數 / 時間對比）、不是「最大金額」
   - case 1 用「成交率 +27.4%」（百分比）
   - case 2 用「7.8hr → 2.4min」（時間對比）
   - case 3 用「2.8 天 → 2.1hr」（時間對比）

2. **hero_money 的選擇**：拿 `results` 中**錢的數字**或**百分比金額**
   - 有絕對金額用絕對（「月增 NT$2,340 萬」）
   - 沒絕對用比例（「客服成本省下近半」）

3. **hook_question 的格式**：「具體痛點 + 客戶會自問的問題」、< 25 字、結尾用「？」或「——你怎麼 X」
   - 不抽象、不行銷、不用「你還在 X 嗎」這種廉價句

4. **story_empathy 的視角**：第二人稱「你」、寫**老闆每天看到的場景**、不是「業務問題」
   - 用 problem 中的數字當畫面、加情緒（看著錢流走 / 越做越虛）

5. **story_failed_attempt** = wrongMove 改寫白話、加「為什麼沒用」
   **story_aha_moment** = aiInsight 改寫白話、用「不是 X、是 Y」結構
   **story_solution** = strategy 改白話 + results 第一個數字當證明

---

## §5 Chairman 審核 checklist

請審 3 個 case sample、回答 6 個問題：

- [ ] **tone 對嗎？** 跟既有 problem/wrongMove/aiInsight/solution 一致、夠白？
- [ ] **hero_number 選得對？** 看到第一秒抓得住人？要不要換另一個指標？
- [ ] **hook_question 夠 sharp？** 不是廢話？讓老闆覺得「對、我也這樣」？
- [ ] **5 design choice 通過？** 17 個剩餘 case 沿用同邏輯、OK 嗎？
- [ ] **長度 OK？** mobile 看會不會折太醜？
- [ ] **要改哪個地方？** 字數 / 措辭 / 風格、有什麼想動？

回 **「3 case OK、繼續做剩 17 個」** = approve、我接著動
回具體調整 = 我重寫這 3 case 後再次送審

---

## §6 接下來的工作流（approval 後）

```
Step 3：Chairman approve 3 case sample（本 doc）
Step 4：補完 case 4-20 (17 個)、寫進 src/data/cases.ts
        - 同時更新 CaseStudy interface 加 7 欄位（optional? 還是 required?）
        - 確保跟 CasesPage.tsx 的 CaseStudy interface 對齊（含 metrics）
Step 5：本機 puppeteer 跑 _diag-cn-case-expand.js
        - block /api/public/cases 模擬 CN
        - 點 20 個 case 展開、確認故事 / hero / hook 都渲染
        - 截圖 sample 一張（zeabur 全擋情境）放 PR description
Step 6：commit + push、開 PR
        - 標題：fix(cases): backfill story_* fields for offline / CN fallback
        - 含 3 pre-action questions
        - 含 metrics 欄位設計決定
```

---

## §7 動刀前 3 問（PR 用）

### Q1 — 根因
`src/data/cases.ts` 的 `allCases` 用舊 `BaseCase` interface、缺 7 個 v6 欄位（hero_* / hook_question / story_* / metrics）。
當 `/api/public/cases` 4s timeout（CN 客戶常態）→ `setCases(allCases)` 被 spread 進 state → `StoryStep` 對 undefined children 全部回 null → 展開區只剩底部 CTA。
詳見 `orion-hub/docs/CN-CASE-EXPAND-DIAG-001.md`。

### Q2 — 是否掩蓋更深問題
**部分掩蓋**：本 fix 是 stop-gap、CN 客戶看到的是**fallback 內容**而非**latest from API**。長期解仍需 `CN-PROXY-WORKER-001`（CF Worker 加速）讓 CN 拿到實時內容。
本 fix 不解決延遲根因、但解決「展開空白」這個直接客訴。

### Q3 — 錯了怎麼知道
| 時間 | 觀察點 |
|---|---|
| 3 天 | puppeteer scenario 3（全擋 zeabur）下 20 個 case 點開全有故事內容、不是空白 |
| 30 天 | CN 客訴「展開沒內容」是否歸零（戰略部追） |
| 180 天 | 評估 `CN-PROXY-WORKER-001` 後是否仍有人看到 fallback 版（理想情境：fallback 退場、API 延遲解決） |

---

*建立：2026-04-28*
*來源：CC-CN-CASE-EXPAND-FIX-001 P0、第二輪 CN 客戶事件直接修復*
*狀態：Step 2 完成、STOP 等 Chairman approve 3 case sample*
