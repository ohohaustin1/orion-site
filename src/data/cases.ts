export interface MetricItem {
  label: string;
  value: string;
}

export interface CaseVisual {
  src: string;
  alt: string;
}

export interface CaseStudy {
  id: number;
  industry: string;
  company: string;
  problem: string;
  wrongMove: string;
  aiInsight: string;
  strategy: string;
  results: string;
  duration: string;
  featured?: boolean;
  hero_number?: string;
  hero_money?: string;
  hook_question?: string;
  story_empathy?: string;
  story_failed_attempt?: string;
  story_aha_moment?: string;
  story_solution?: string;
  metrics?: MetricItem[];
}

export const caseVisuals: Record<number, CaseVisual> = {
  1: {
    src: '/images/cases/case-real-estate-ai-followup.jpg',
    alt: '不動產銷售團隊在 AI 指揮中心追蹤高意向客戶',
  },
  2: {
    src: '/images/cases/case-ecommerce-cart-recovery.jpg',
    alt: '電商品牌團隊用 AI 整理客服訊息與棄單回收任務',
  },
  3: {
    src: '/images/cases/case-manufacturing-schedule.jpg',
    alt: '製造業主管在工廠指揮中心檢查產能排程與交期風險',
  },
  4: {
    src: '/images/cases/case-restaurant-staffing.jpg',
    alt: '連鎖餐飲營運團隊用 AI 安排門店人力與尖峰需求',
  },
  5: {
    src: '/images/cases/case-retention-education.jpg',
    alt: '會員制教育品牌用 AI 追蹤學員互動與續約風險',
  },
  6: {
    src: '/images/cases/case-legal-risk-workflow.jpg',
    alt: '跨境服務公司用 AI 檢查合約風險與銷售承諾流程',
  },
  7: {
    src: '/images/cases/case-brand-voice-system.jpg',
    alt: '高端顧問品牌用 AI 統一內容語氣與審核流程',
  },
  8: {
    src: '/images/cases/case-cashflow-command.jpg',
    alt: '成長型服務公司用 AI 追蹤現金流、收款與成本預警',
  },
  9: {
    src: '/images/cases/case-education-transfer.jpg',
    alt: '專業訓練機構用 AI 沉澱講師經驗與助教訓練流程',
  },
  10: {
    src: '/images/cases/case-wellness-followup.jpg',
    alt: '高端健康管理團隊用 AI 整理回訪、習慣追蹤與長期陪跑任務',
  },
  11: {
    src: '/images/cases/case-investment-research.jpg',
    alt: '私人投資研究室用 AI 整理策略假設、風險條件與決策回顧',
  },
  12: {
    src: '/images/cases/case-decision-strategy.jpg',
    alt: '企業主重大決策團隊用 AI 拆解情境、風險邊界與下一步',
  },
};

export const caseStudies: CaseStudy[] = [
  {
    id: 1,
    industry: '不動產',
    company: '都會建設銷售團隊',
    problem: '案源、廣告、客服與業務回報分散，主管每天只能靠零碎訊息判斷成交機率。',
    wrongMove: '過去只加廣告預算，卻沒有釐清哪一種客戶真正接近成交，導致成本上升但成交率沒有同步改善。',
    aiInsight: '真正的瓶頸不是流量，而是線索分級、追蹤節奏與業務回報沒有被接成工作流。',
    strategy: '建立 AI 線索分級、銷售話術建議、回訪任務與主管儀表板，讓每個案源都有下一步。',
    results: '高意向線索回訪速度提升 68%，預約賞屋率提升 31%，廣告浪費降低 24%。',
    duration: '4 週',
    featured: true,
    hero_number: '+31%',
    hero_money: '預約賞屋率',
    hook_question: '不是案源不夠，而是高意向客戶被淹沒了。',
    metrics: [
      { label: '回訪速度', value: '+68%' },
      { label: '預約率', value: '+31%' },
      { label: '浪費降低', value: '-24%' },
    ],
  },
  {
    id: 2,
    industry: '電商',
    company: '生活風格選品品牌',
    problem: '客服訊息、棄單原因、廣告素材與回購資料沒有串起來，團隊不知道哪裡最該優先修。',
    wrongMove: '過去反覆改素材與折扣，但沒有把客服問題和商品頁阻力接回轉換流程。',
    aiInsight: '最大損失發生在「有興趣但未下單」的客群，他們需要不同的說明、保證與提醒。',
    strategy: '建立客服摘要、棄單分群、回購任務與素材測試規則，讓 AI 每天產出優先處理名單。',
    results: '客服處理時間下降 57%，棄單回收率提升 22%，回購率提升 18%。',
    duration: '3 週',
    featured: true,
    hero_number: '+22%',
    hero_money: '棄單回收率',
    hook_question: '客人不是不想買，是缺少最後一步信任。',
    metrics: [
      { label: '客服時間', value: '-57%' },
      { label: '棄單回收', value: '+22%' },
      { label: '回購率', value: '+18%' },
    ],
  },
  {
    id: 3,
    industry: '製造業',
    company: '精密零件工廠',
    problem: '訂單變動、機台限制、庫存與交期靠主管人工調度，任何急單都會擾動整條產線。',
    wrongMove: '只靠 Excel 補表與加班解決，導致主管越來越忙，卻沒有留下可複製規則。',
    aiInsight: '排程痛點來自限制條件沒有被結構化，AI 需要先讀懂機台、物料、交期與風險權重。',
    strategy: '建立產能限制表、急單評分、排程建議與異常預警，把經驗變成決策規則。',
    results: '排程時間縮短 72%，急單插單衝突下降 41%，交期可視性提升。',
    duration: '6 週',
    featured: true,
    hero_number: '-72%',
    hero_money: '排程時間',
    hook_question: '真正值錢的是老主管腦中的排程判斷。',
    metrics: [
      { label: '排程時間', value: '-72%' },
      { label: '插單衝突', value: '-41%' },
      { label: '交期透明', value: '+高' },
    ],
  },
  {
    id: 4,
    industry: '餐飲',
    company: '連鎖餐飲營運部',
    problem: '門店人力、尖離峰、外送平台與活動檔期交錯，排班常常過多或不足。',
    wrongMove: '只用上月營收估排班，沒有把天氣、活動、外送與店型差異納入判斷。',
    aiInsight: '排班不是人事問題，而是需求預測、備料、服務品質與成本之間的決策問題。',
    strategy: '建立門店需求預測、班表建議、備料提醒與異常回報，讓店長有可用的行動清單。',
    results: '人力浪費降低 19%，缺工尖峰下降 35%，店長排班時間減半。',
    duration: '5 週',
    hero_number: '-35%',
    hero_money: '尖峰缺工',
    hook_question: '排班不是填表，是每天的營運決策。',
    metrics: [
      { label: '人力浪費', value: '-19%' },
      { label: '尖峰缺工', value: '-35%' },
      { label: '排班時間', value: '-50%' },
    ],
  },
  {
    id: 5,
    industry: '客戶留存',
    company: '會員制教育品牌',
    problem: '學員互動資料散落在課程、LINE、客服與銷售紀錄中，流失前沒有明確訊號。',
    wrongMove: '只在退費或不續約時補救，錯過真正可以挽回的前 30 天。',
    aiInsight: '留存不是最後一通電話，而是每一次低互動、低完成、低回訪訊號的累積。',
    strategy: '建立客戶健康分數、回訪任務、顧問提醒與續約話術，讓團隊在流失前介入。',
    results: '續約率提升 26%，沉睡會員喚回率提升 33%，顧問追蹤斷點下降。',
    duration: '4 週',
    hero_number: '+26%',
    hero_money: '續約率',
    hook_question: '真正的流失，通常在客人說出口前就開始了。',
    metrics: [
      { label: '續約率', value: '+26%' },
      { label: '喚回率', value: '+33%' },
      { label: '斷點下降', value: '+明顯' },
    ],
  },
  {
    id: 6,
    industry: '法律風險',
    company: '跨境服務公司',
    problem: '合約條款、客服承諾與銷售話術沒有統一控管，法務只在問題發生後才介入。',
    wrongMove: '把風險管理當成文件歸檔，沒有在流程中設下提醒與審核點。',
    aiInsight: '風險不是單一條款，而是話術、流程、紀錄與責任邊界沒有同步。',
    strategy: '建立風險詞庫、合約摘要、話術審核與高風險任務提醒，讓法務從事後補救變成事前防呆。',
    results: '高風險話術攔截率提升，審核時間縮短 46%，內部責任邊界更清楚。',
    duration: '5 週',
    hero_number: '-46%',
    hero_money: '審核時間',
    hook_question: '法律風險常常不是文件錯，而是流程沒有記憶。',
    metrics: [
      { label: '審核時間', value: '-46%' },
      { label: '風險攔截', value: '+高' },
      { label: '責任邊界', value: '+清楚' },
    ],
  },
  {
    id: 7,
    industry: '品牌語感',
    company: '高端顧問品牌',
    problem: '品牌文案依賴少數核心成員，外包與新人產出的語氣不穩，內容審核成本很高。',
    wrongMove: '只做品牌手冊，卻沒有把語氣、禁區、範例與審核流程變成可用工具。',
    aiInsight: '品牌語感需要被拆成判斷規則，而不是只靠抽象形容詞。',
    strategy: '建立品牌語氣資料庫、內容生成規則、審核 checklist 與範例庫，讓輸出可複製。',
    results: '內容審核時間下降 52%，外部寫手返工率下降，品牌一致性提升。',
    duration: '3 週',
    hero_number: '-52%',
    hero_money: '審核時間',
    hook_question: '高級感不能只靠感覺，必須變成可審核的工作流。',
    metrics: [
      { label: '審核時間', value: '-52%' },
      { label: '返工率', value: '-明顯' },
      { label: '一致性', value: '+高' },
    ],
  },
  {
    id: 8,
    industry: '企業現金流',
    company: '成長型服務公司',
    problem: '收入、成本、應收帳款與人力支出分散在不同表格，老闆只能月底才知道壓力。',
    wrongMove: '每月人工整理報表，速度慢，而且無法提前預警。',
    aiInsight: '現金流管理最重要的是提前看見風險，而不是事後知道結果。',
    strategy: '建立現金流儀表板、風險預警、收款任務與情境試算，讓主管每週看見下一步。',
    results: '報表整理時間下降 80%，逾期收款提醒更即時，資金壓力預警提前。',
    duration: '4 週',
    hero_number: '-80%',
    hero_money: '報表整理時間',
    hook_question: '現金流不是財務表，是企業的呼吸頻率。',
    metrics: [
      { label: '整理時間', value: '-80%' },
      { label: '預警速度', value: '+提前' },
      { label: '收款追蹤', value: '+即時' },
    ],
  },
  {
    id: 9,
    industry: '教育傳承',
    company: '專業講師與訓練機構',
    problem: '老師的經驗高度依賴個人，課程交付、學員追蹤與助教訓練難以放大。',
    wrongMove: '只錄影片上架，卻沒有把提問、作業、回饋與助教判斷變成系統。',
    aiInsight: '教育產品的核心不是內容，而是陪跑、回饋與標準化判斷。',
    strategy: '建立知識庫、作業批改規則、學員分級與助教提示，讓教學品質可複製。',
    results: '助教訓練時間縮短 44%，學員回饋速度提升，課程交付更穩定。',
    duration: '5 週',
    hero_number: '-44%',
    hero_money: '助教訓練時間',
    hook_question: '真正能放大的不是課程影片，而是教學判斷。',
    metrics: [
      { label: '訓練時間', value: '-44%' },
      { label: '回饋速度', value: '+提升' },
      { label: '交付穩定', value: '+高' },
    ],
  },
  {
    id: 10,
    industry: '健康長壽',
    company: '高端健康管理團隊',
    problem: '客戶健康資料、習慣紀錄、檢測報告與顧問建議分散，長期追蹤難以維持一致。',
    wrongMove: '只提供一次性報告，客戶看完後缺少每週可執行的行動。',
    aiInsight: '健康長壽需要長期記憶與節奏，不是單次解讀。',
    strategy: '建立資料摘要、週期追蹤、顧問提醒與行動建議，讓健康管理像企業儀表板一樣運作。',
    results: '顧問整理時間下降 60%，回訪品質提升，客戶行動完成率更穩定。',
    duration: '6 週',
    hero_number: '-60%',
    hero_money: '顧問整理時間',
    hook_question: '長壽管理不是報告，是長期陪跑系統。',
    metrics: [
      { label: '整理時間', value: '-60%' },
      { label: '回訪品質', value: '+提升' },
      { label: '完成率', value: '+穩定' },
    ],
  },
  {
    id: 11,
    industry: '股票策略',
    company: '私人投資研究室',
    problem: '市場資訊、交易紀律與研究假設分散，投資決策容易被情緒與短期新聞帶走。',
    wrongMove: '只增加資料源，卻沒有建立策略假設、風險條件與回顧紀錄。',
    aiInsight: '投資系統的價值在於紀律，不是資訊數量。',
    strategy: '建立策略筆記、情境推演、風險條件與決策回顧流程，讓每次判斷都可追蹤。',
    results: '研究整理時間下降，交易前檢查更完整，策略回顧品質提升。',
    duration: '4 週',
    hero_number: '+紀律',
    hero_money: '策略回顧',
    hook_question: '資訊越多，越需要一套不被情緒拖走的系統。',
    metrics: [
      { label: '整理時間', value: '-下降' },
      { label: '檢查完整', value: '+提升' },
      { label: '回顧品質', value: '+提升' },
    ],
  },
  {
    id: 12,
    industry: '命運機率',
    company: '企業主重大決策陪跑',
    problem: '轉型、投資、合作與產品方向常常牽涉高度不確定，單靠直覺難以拆解。',
    wrongMove: '把重大決策壓成二選一，忽略情境、停止條件與風險邊界。',
    aiInsight: '真正的決策不是預測未來，而是把不確定拆成可觀察的訊號與可執行的下一步。',
    strategy: '建立情境樹、機率假設、風險清單、停止條件與階段驗證，讓決策更可控。',
    results: '決策討論更快收斂，風險邊界更清楚，團隊能對齊下一步。',
    duration: '2 週',
    hero_number: '+清楚',
    hero_money: '決策邊界',
    hook_question: '看不見未來時，先把不確定性變成系統。',
    metrics: [
      { label: '討論收斂', value: '+快' },
      { label: '風險邊界', value: '+清楚' },
      { label: '下一步', value: '+對齊' },
    ],
  },
];

export const featuredCases = caseStudies.filter((item) => item.featured);
export const allCases = caseStudies;
