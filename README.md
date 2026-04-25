# ORION Site

> 品牌官網 [orion01.com](https://orion01.com)

ORION AI Group 對外品牌網站。React + Vite + 黑金宇宙設計。

**系統架構見 [orion-hub/ARCHITECTURE.md](https://github.com/ohohaustin1/orion-hub/blob/main/ARCHITECTURE.md)**

## 重要網址

| 路徑 | 用途 |
|---|---|
| / | 首頁 Hero |
| /home | 首頁（同 /） |
| /cases | 實戰案例 |
| /about | 服務介紹 |
| /team | 核心團隊 |
| /insights | 數據洞察 |
| /resources | 資源中心 |
| /report?session=XXX | 客戶診斷報告 |
| /report/preview/XXX | 內部測試樣板 |

## 技術棧

- Vite 6 + React 18 + TypeScript
- wouter 3.9（router）
- react-helmet-async（per-route SEO meta）
- Three.js / @react-three/fiber（Earth3D 立體地球）
- Cormorant Garamond + Noto Sans TC（黑金襯線）
- @prerenderer/rollup-plugin（build 時預渲染 6 個公開路由）
- Vercel（host、純 static、不跑 build）

## 本機開發

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
npm run preview  # 預覽 build（http://localhost:4173）
```

## Deploy（重要紀律）

```bash
# 改完 source 後、push 前必須先 build
npm run build
git add dist/
git commit -m "..."
git push
```

**Vercel 不跑 build**（vercel.json `buildCommand: ""` + `installCommand: ""`），
直接 host `dist/` 內容。忘記 build = deploy 舊版本。

## Staging 預覽 URL

開發報告頁時不用每次跑 O 對話：

```
https://orion01.com/report/preview/sample-restaurant
https://orion01.com/report/preview/sample-ecommerce
https://orion01.com/report/preview/sample-manufacture
https://orion01.com/report/preview/sample-medical
https://orion01.com/report/preview/edge-case-empty
https://orion01.com/report/preview/edge-case-full
```

頂部金色 PREVIEW banner 可一鍵切換 6 個樣板。

驗證指令：

```bash
node scripts/verify-staging-urls.cjs   # E2E puppeteer
```

## 設計規範

- 黑金宇宙嚴格遵守、無藍綠紫
- 主色：`#0a0a0a` / `#050505` / `#F5A623` / `#FFD369` / `#C5A059`
- 標題襯線（Cormorant Garamond）+ 內文無襯線（Noto Sans TC）
- 完整規範見 `orion-hub/docs/DESIGN.md`

## 禁用詞清單

賦能、優化、智能化、智能、智慧、打造、助力、驅動、精準、數據驅動

## 後端 API

來自 [orion-hub](https://github.com/ohohaustin1/orion-hub)。
完整 endpoint 列表見 orion-hub/ARCHITECTURE.md 第 8 節。

## License

見 [LICENSE](LICENSE)
