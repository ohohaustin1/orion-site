import { ORION_CONTACT } from '../lib/contact';

export type SeoLandingSlug =
  | 'enterprise-ai-automation'
  | 'ai-workflow-automation'
  | 'ai-customer-followup-system';

interface SeoFaq {
  q: string;
  a: string;
}

interface SeoSection {
  title: string;
  body: string;
  bullets: string[];
}

export interface SeoLandingPageData {
  slug: SeoLandingSlug;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  primaryKeyword: string;
  keywords: string;
  video: string;
  videoLabel: string;
  outcomes: string[];
  pains: string[];
  sections: SeoSection[];
  faqs: SeoFaq[];
}

export const SEO_LANDING_PAGES: Record<SeoLandingSlug, SeoLandingPageData> = {
  'enterprise-ai-automation': {
    slug: 'enterprise-ai-automation',
    eyebrow: '企業 AI 自動化公司',
    title: '企業 AI 自動化公司｜ORION AI 幫老闆追客、追單、追進度',
    description: 'ORION AI 是企業 AI 自動化公司，幫中小企業把客戶訊息、報價追蹤、任務派工、逾時提醒、主管回報與資料記憶做成每天會跑的系統。',
    h1: '企業 AI 自動化，不是買工具，是讓每天卡住的工作有人追到有結果。',
    summary: 'ORION AI 專門幫企業把「客人沒回、報價沒追、訂單卡住、團隊進度不透明」做成 AI 可以每天提醒、派工、追蹤、回報的流程。',
    primaryKeyword: '企業 AI 自動化公司',
    keywords: '企業 AI 自動化公司, AI 自動化公司 台灣, 中小企業 AI 導入, AI 營運自動化, ORION AI',
    video: '/videos/orion-bg-00-command.mp4',
    videoLabel: '企業 AI 指揮中心與自動化流程影片',
    outcomes: [
      '客戶訊息集中，不再散在 LINE、IG、表單與私人訊息。',
      '報價與訂單有下一步，不再寄出去就等客人自己回。',
      '任務有人負責、逾時會提醒、主管每天看得到狀態。',
      '每次成交、流失、回訪都留下資料，下次判斷更快。',
    ],
    pains: [
      '老闆每天都在問：這個客人誰回？這張單誰追？這件事做到哪？',
      '公司不是沒流量，而是客人進來後沒被好好接住。',
      '團隊不是不努力，而是沒有一套會提醒、追蹤、回報的流程。',
    ],
    sections: [
      {
        title: 'ORION AI 到底幫企業做什麼？',
        body: 'ORION 不是只做聊天機器人，也不是只幫你裝一套工具。我們先找出公司每天最容易漏掉的流程，再把它做成 AI 可以判斷、提醒、派工、追蹤與回報的工作流。',
        bullets: ['接住客戶入口', '整理需求與優先級', '建立任務與提醒', '回報主管與沉澱資料'],
      },
      {
        title: '適合哪些公司？',
        body: '只要你的公司每天有客人要回、報價要追、訂單要交、團隊進度要盯，就適合先拆一條流程給 O 跑。',
        bullets: ['服務業與顧問團隊', '電商與品牌商', '餐飲與連鎖門市', '製造與工程交付團隊'],
      },
      {
        title: '第一版通常先做什麼？',
        body: '第一版不追求大而全，而是挑一段最痛、最常重複、最能看到結果的流程，做成可以每天跑的 AI 作業層。',
        bullets: ['LINE 客服漏回追蹤', '報價後自動提醒', '訂單交期與缺資料追蹤', '主管每日卡點回報'],
      },
    ],
    faqs: [
      {
        q: 'ORION AI 是做什麼的公司？',
        a: 'ORION AI 是企業 AI 自動化公司，幫老闆把客戶訊息、報價追蹤、任務派工、逾時提醒、主管回報與資料沉澱做成系統。',
      },
      {
        q: 'ORION 跟一般 chatbot 差在哪？',
        a: '一般 chatbot 多半只回答問題。ORION 的 O 會把問題變成下一步、負責人、提醒時間、回報格式與可追蹤資料。',
      },
      {
        q: '要怎麼開始？',
        a: `先用 O 說出你每天最常卡住的一段流程，或直接聯絡 ${ORION_CONTACT.founderName}，LINE ID：${ORION_CONTACT.lineId}，Email：${ORION_CONTACT.email}。`,
      },
    ],
  },
  'ai-workflow-automation': {
    slug: 'ai-workflow-automation',
    eyebrow: 'AI 工作流自動化',
    title: 'AI 工作流自動化｜把客人、任務、提醒、回報串成一條線',
    description: 'ORION AI 幫企業設計 AI 工作流自動化，從輸入目標、理解需求、工具調用、任務派工、逾時提醒到數據回饋，讓流程每天自己跑。',
    h1: '把每天重複追人的工作，改成 AI 每天自動追。',
    summary: 'AI 工作流自動化的重點不是讓 AI 多說幾句話，而是讓它知道誰進來、誰處理、卡在哪、多久要提醒、最後怎麼回報。',
    primaryKeyword: 'AI 工作流自動化',
    keywords: 'AI 工作流自動化, AI tool calling workflow, AI 任務派工, AI 逾時提醒, AI 主管回報, ORION AI',
    video: '/videos/orion-bg-02-toolflow-network.mp4',
    videoLabel: 'AI 工具調用與工作流資料流動畫',
    outcomes: [
      '把 LINE、表單、CRM、內部任務變成同一條工作流。',
      'AI 先判斷急迫性、缺資料、風險與下一步。',
      '系統自動提醒負責人，不靠老闆每天問。',
      '主管每天看到完成、逾時、卡點與需要決策的清單。',
    ],
    pains: [
      '工具很多，但每個工具都只管自己，沒有人負責整段流程。',
      '主管要靠群組、表格、口頭追問才知道進度。',
      '客人、任務、報價、回訪沒有一個共同狀態。',
    ],
    sections: [
      {
        title: '什麼是 AI 工作流自動化？',
        body: 'AI 工作流自動化是把輸入、理解、判斷、工具調用、任務派工、提醒、驗收與回報串成一條可重複執行的流程。',
        bullets: ['Input 輸入目標', 'Understand 理解與分類', 'Plan 制定工具調用計畫', 'Execute 執行與回報'],
      },
      {
        title: 'ORION 會調用哪些工具？',
        body: '依照公司需求，ORION 可以把商業分析、流程設計、CRM 任務、工程規格、通知系統與主管回報串起來。',
        bullets: ['商業痛點分析', 'AI 系統藍圖', 'ROI 與成本試算', 'CRM 任務與 Codex 工程 prompt'],
      },
      {
        title: '為什麼不是直接買現成軟體？',
        body: '現成軟體通常只解決單點。ORION 先看你公司的真實流程，再決定哪個入口、哪個提醒、哪個回報最值得先做。',
        bullets: ['先找營運斷點', '先做最痛的一段', '保留可複製規則', '再擴張到下一段流程'],
      },
    ],
    faqs: [
      {
        q: 'AI 工作流自動化一定要接很多系統嗎？',
        a: '不一定。第一版可以只從 LINE、表單或一張任務表開始，先證明這條流程真的能幫老闆少追事。',
      },
      {
        q: 'ORION 可以幫我寫工程規格嗎？',
        a: '可以。O 會先整理痛點、流程、資料欄位、提醒規則與驗收方式，再產出工程師或 Codex 看得懂的規格。',
      },
      {
        q: 'AI 自動化會不會讓流程更亂？',
        a: '會，如果沒有狀態、責任人與驗收。ORION 的做法是先定義狀態與回報，再開始接工具。',
      },
    ],
  },
  'ai-customer-followup-system': {
    slug: 'ai-customer-followup-system',
    eyebrow: 'AI 客戶追蹤系統',
    title: 'AI 客戶追蹤系統｜幫你追客、追單、追報價、追回訪',
    description: 'ORION AI 客戶追蹤系統幫企業接住 LINE、IG、官網表單與 CRM 名單，整理需求、分級客戶、提醒負責人並回報成交進度。',
    h1: '不是客人不想買，是很多客人卡在最後一步沒人追。',
    summary: 'ORION 幫你把客戶從第一次詢問、報價、補資料、回訪到成交後關懷都變成可追蹤流程，讓名單不再沉在群組和私訊裡。',
    primaryKeyword: 'AI 客戶追蹤系統',
    keywords: 'AI 客戶追蹤系統, AI 追客, AI 追單, AI 報價追蹤, LINE AI 客服, 客戶回訪自動化, ORION AI',
    video: '/videos/cases/case-ecommerce-command-loop.mp4',
    videoLabel: 'AI 客戶追蹤與成交流程動畫',
    outcomes: [
      '客人進來先被記錄來源、需求、急迫性與下一步。',
      '報價後自動建立追蹤時間，不再靠業務記憶。',
      '逾時未回會提醒負責人，主管看得到誰卡住。',
      '成交與流失原因留下資料，下次行銷更準。',
    ],
    pains: [
      '名單很多，但客人問完就沉下去。',
      '報價有寄，但沒有人固定追下一步。',
      '業務說有跟進，主管卻看不到具體狀態。',
    ],
    sections: [
      {
        title: 'AI 客戶追蹤系統會追什麼？',
        body: '它不是幫你騷擾客人，而是把應該回、應該追、應該補資料、應該回訪的節點變清楚。',
        bullets: ['新客詢問', '報價後追蹤', '缺資料提醒', '成交後回訪與續約'],
      },
      {
        title: '老闆每天會看到什麼？',
        body: '老闆不用再問每個業務進度，而是看一張清單：今天誰要回、誰逾時、誰需要主管判斷、哪個名單最值得先追。',
        bullets: ['今日待回客戶', '逾時未處理', '高機會名單', '成交與流失原因'],
      },
      {
        title: '適合哪些情境？',
        body: '只要你的客戶從私訊、表單、廣告或轉介紹進來，而且後續需要報價、確認、回訪，就適合做第一版追蹤。',
        bullets: ['房仲看屋後回訪', '電商棄單與回購', '顧問報價跟進', '診所預約與術後關懷'],
      },
    ],
    faqs: [
      {
        q: 'AI 客戶追蹤會不會像罐頭訊息？',
        a: 'ORION 的重點不是亂發訊息，而是先判斷客戶狀態與下一步，提醒負責人用正確內容接續。',
      },
      {
        q: '可以接 LINE 嗎？',
        a: '可以評估 LINE 官方帳號、表單、CRM 或既有客服流程。第一步會先確認目前入口與資料來源。',
      },
      {
        q: '可以直接找誰談？',
        a: `可以聯絡 ${ORION_CONTACT.founderName}，LINE ID：${ORION_CONTACT.lineId}，Email：${ORION_CONTACT.email}。`,
      },
    ],
  },
};
