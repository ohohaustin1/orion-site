export interface MetricItem {
  label: string;
  value: string;
}

export interface CaseVisual {
  src: string;
  alt: string;
  videoMp4?: string;
  videoWebm?: string;
  objectPosition?: string;
  mobileObjectPosition?: string;
}

export type CaseVisualPlacement = 'default' | 'homeFeatured' | 'homeMini' | 'casesFeatured' | 'casesList';

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
    videoMp4: '/videos/cases/case-real-estate-command-loop.mp4',
    videoWebm: '/videos/cases/case-real-estate-command-loop.webm',
    mobileObjectPosition: '58% center',
    alt: '不動產銷售團隊在 AI 指揮中心追蹤高意向客戶',
  },
  2: {
    src: '/images/cases/case-ecommerce-cart-recovery.jpg',
    videoMp4: '/videos/cases/case-ecommerce-command-loop.mp4',
    videoWebm: '/videos/cases/case-ecommerce-command-loop.webm',
    mobileObjectPosition: '52% center',
    alt: '電商品牌團隊用 AI 整理客服訊息與棄單回收任務',
  },
  3: {
    src: '/images/cases/case-manufacturing-schedule.jpg',
    videoMp4: '/videos/cases/case-manufacturing-command-loop.mp4',
    videoWebm: '/videos/cases/case-manufacturing-command-loop.webm',
    mobileObjectPosition: '62% center',
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
  21: {
    src: '/images/cases/case-real-estate-ai-followup.jpg',
    alt: '房地產仲介團隊用 AI 分級客戶並追蹤成交機會',
  },
  22: {
    src: '/images/cases/case-ecommerce-cart-recovery.jpg',
    alt: '電商零售團隊用 AI 接住客服、退貨與商品推薦流程',
  },
  23: {
    src: '/images/cases/case-manufacturing-schedule.jpg',
    alt: '製造業團隊用 AI 檢查報價、產能與交期風險',
  },
  24: {
    src: '/images/cases/case-restaurant-staffing.jpg',
    alt: '餐飲連鎖團隊用 AI 預測庫存、採購與跨店調度',
  },
  25: {
    src: '/images/cases/case-brand-voice-system.jpg',
    alt: '管理顧問團隊用 AI 整理研究、提案與交付流程',
  },
  26: {
    src: '/images/cases/case-wellness-followup.jpg',
    alt: '診所團隊用 AI 整理排程、紀錄與回訪提醒',
  },
  27: {
    src: '/images/cases/case-dental-appointment-recall.jpg',
    alt: '牙醫診所用 AI 追蹤預約、爽約風險與回診提醒',
  },
  28: {
    src: '/images/cases/case-legal-risk-workflow.jpg',
    alt: '法律事務所用 AI 搜尋法規、案件資料與客戶進度',
  },
  29: {
    src: '/images/cases/case-contract-review-training.jpg',
    alt: '法律團隊用 AI 協助合約審閱、風險標註與新人訓練',
  },
  30: {
    src: '/images/cases/case-education-transfer.jpg',
    alt: '補習班用 AI 追蹤學生進度、家長溝通與續班機會',
  },
  31: {
    src: '/images/cases/case-education-scheduling.jpg',
    alt: '語言學院用 AI 安排教師、教室與學生出席提醒',
  },
  32: {
    src: '/images/cases/case-warehouse-picking.jpg',
    alt: '倉儲團隊用 AI 最佳化揀貨路線、庫位與錯誤預警',
  },
  33: {
    src: '/images/cases/case-logistics-fleet-routing.jpg',
    alt: '物流車隊用 AI 規劃配送路線、油耗與即時貨態',
  },
  34: {
    src: '/images/cases/case-decision-strategy.jpg',
    alt: '建築設計團隊用 AI 對齊提案、視覺化與專案里程碑',
  },
  35: {
    src: '/images/cases/case-salon-appointment-return.jpg',
    alt: '高端沙龍用 AI 管理預約、客戶偏好與回流提醒',
  },
  36: {
    src: '/images/cases/case-beauty-social-crm.jpg',
    alt: '造型工作室用 AI 追蹤社群成效、會員分群與促銷回收',
  },
  37: {
    src: '/images/cases/case-automotive-maintenance.jpg',
    alt: '汽車保養中心用 AI 預測保養時機、零件庫存與回廠提醒',
  },
  38: {
    src: '/images/cases/case-cashflow-command.jpg',
    alt: '保險業務團隊用 AI 分級客戶、預測成交與續保提醒',
  },
  39: {
    src: '/images/cases/case-insurance-claims-workflow.jpg',
    alt: '保險理賠團隊用 AI 管理文件審核、異常偵測與客戶通知',
  },
  40: {
    src: '/images/cases/case-gym-retention-operations.jpg',
    alt: '健身房用 AI 追蹤會員流失、私教排課與設備維護',
  },
  41: {
    src: '/images/cases/case-restaurant-reservation-followup.jpg',
    alt: '餐飲團隊用 AI 接住訂位、外送訊息與熟客回訪',
  },
  42: {
    src: '/images/cases/case-ecommerce-repurchase-automation.jpg',
    alt: '電商品牌用 AI 串接訂單分群、回購提醒與客服追蹤',
  },
  43: {
    src: '/images/cases/case-manufacturing-quote-tracking.jpg',
    alt: '製造團隊用 AI 串接報價、產能看板與交期提醒',
  },
};

export const caseVisualList = [
  caseVisuals[1],
  caseVisuals[2],
  caseVisuals[3],
  caseVisuals[4],
  caseVisuals[5],
  caseVisuals[6],
  caseVisuals[7],
  caseVisuals[8],
  caseVisuals[9],
  caseVisuals[10],
  caseVisuals[11],
  caseVisuals[12],
];

const videoVisual = (
  src: string,
  videoMp4: string,
  alt: string,
  videoWebm?: string,
  mobileObjectPosition?: string,
  objectPosition?: string,
): CaseVisual => ({
  src,
  videoMp4,
  videoWebm,
  alt,
  mobileObjectPosition,
  objectPosition,
});

const caseVisualPlacementOverrides: Partial<Record<CaseVisualPlacement, Record<number, CaseVisual>>> = {
  homeMini: {
    4: videoVisual('/videos/posters/coverr-cafe-handoff-loop.jpg', '/videos/stock/coverr-cafe-handoff-loop.mp4', '餐飲門店把交付與回訪流程交給 ORION 追蹤', undefined, '50% center'),
    5: videoVisual('/videos/posters/orion-memory-city-card-loop.jpg', '/videos/orion-memory-city-card-loop.mp4', '會員留存與客戶記憶資料流動態畫面', undefined, '54% center'),
    7: videoVisual('/videos/posters/orion-trust-host-stage-loop.jpg', '/videos/orion-trust-host-stage-loop.mp4', '品牌語感與內容審核工作流動態畫面', undefined, '50% center'),
    8: videoVisual('/videos/posters/orion-executive-board-pan.jpg', '/videos/orion-executive-board-pan.mp4', '企業現金流與主管儀表板動態畫面', undefined, '55% center'),
    11: videoVisual('/videos/posters/orion-toolflow-card-loop.jpg', '/videos/orion-toolflow-card-loop.mp4', '投資策略與工具調用工作流動態畫面', undefined, '52% center'),
    12: videoVisual('/videos/posters/runway-orion-executive-03.jpg', '/videos/runway-orion-executive-03.mp4', '重大決策與企業主管判斷動態畫面', undefined, '48% center'),
  },
  casesFeatured: {
    1: videoVisual('/videos/posters/coverr-office-workflow-loop.jpg', '/videos/stock/coverr-office-workflow-loop.mp4', '企業團隊把客戶與任務流程整理進 ORION', undefined, '52% center'),
    2: videoVisual('/videos/posters/orion-bg-01-core-devices.jpg', '/videos/orion-bg-01-core-devices.mp4', '電商訂單與跨裝置工具調用工作流動態畫面', undefined, '50% center'),
    3: videoVisual(
      '/images/cases/case-manufacturing-schedule.jpg',
      '/videos/cases/case-manufacturing-command-loop.mp4',
      '製造業排程與產線任務看板動態畫面',
      '/videos/cases/case-manufacturing-command-loop.webm',
      '62% center',
    ),
  },
  casesList: {
    1: {
      src: '/images/cases/case-real-estate-ai-followup.jpg',
      alt: '不動產案源與高意向客戶追蹤案例圖',
    },
    2: {
      src: '/images/cases/case-ecommerce-cart-recovery.jpg',
      alt: '電商棄單與回購流程案例圖',
    },
    3: {
      src: '/images/cases/case-manufacturing-schedule.jpg',
      alt: '製造業排程與產線任務看板案例圖',
    },
    21: videoVisual(
      '/images/cases/case-real-estate-ai-followup.jpg',
      '/videos/cases/case-real-estate-command-loop.mp4',
      '不動產案源與追蹤流程動態畫面',
      '/videos/cases/case-real-estate-command-loop.webm',
      '58% center',
    ),
    22: videoVisual(
      '/images/cases/case-ecommerce-cart-recovery.jpg',
      '/videos/cases/case-ecommerce-command-loop.mp4',
      '電商棄單與回購流程動態畫面',
      '/videos/cases/case-ecommerce-command-loop.webm',
      '52% center',
    ),
    23: videoVisual(
      '/images/cases/case-manufacturing-schedule.jpg',
      '/videos/cases/case-manufacturing-command-loop.mp4',
      '製造排程與產線任務看板動態畫面',
      '/videos/cases/case-manufacturing-command-loop.webm',
      '62% center',
    ),
    24: videoVisual('/videos/posters/coverr-cafe-handoff-loop.jpg', '/videos/stock/coverr-cafe-handoff-loop.mp4', '餐飲訂位與現場交付流程動態畫面', undefined, '50% center'),
    25: videoVisual('/videos/posters/orion-bg-02-toolflow-network.jpg', '/videos/orion-bg-02-toolflow-network.mp4', '品牌語感與內容任務網路動態畫面', undefined, '50% center'),
    34: videoVisual('/videos/posters/orion-executive-hero-dolly.jpg', '/videos/orion-executive-hero-dolly.mp4', '重大決策與高階主管判斷動態畫面', undefined, '48% center'),
    38: videoVisual('/videos/posters/runway-orion-executive-03.jpg', '/videos/runway-orion-executive-03.mp4', '企業現金流與經營追蹤動態畫面', undefined, '48% center'),
  },
};

export function getCaseVisual(
  caseData: Pick<CaseStudy, 'id' | 'industry' | 'company'>,
  index = 0,
  placement: CaseVisualPlacement = 'default',
): CaseVisual {
  const placementDirect = caseVisualPlacementOverrides[placement]?.[caseData.id];
  if (placementDirect) return placementDirect;

  const direct = caseVisuals[caseData.id];
  if (direct) return direct;

  const text = `${caseData.industry} ${caseData.company}`;
  if (/房地產|不動產/.test(text)) return caseVisuals[1];
  if (/餐飲/.test(text)) return caseVisuals[4];
  if (/電商|零售/.test(text)) return caseVisuals[2];
  if (/製造|五金|汽車|物流|倉儲|車隊|貨運/.test(text)) return caseVisuals[3];
  if (/顧問|品牌|社群/.test(text)) return caseVisuals[7];
  if (/醫療|診所|牙醫|健康|美容|美髮|健身/.test(text)) return caseVisuals[10];
  if (/法律|法務|合約/.test(text)) return caseVisuals[6];
  if (/教育|補習|英語|學院/.test(text)) return caseVisuals[9];
  if (/現金|財務|保險|理賠/.test(text)) return caseVisuals[8];
  if (/股票|投資|研究/.test(text)) return caseVisuals[11];
  if (/決策|建築|設計/.test(text)) return caseVisuals[12];

  return caseVisualList[index % caseVisualList.length];
}

/* ────────────────────────────────────────────────────────────
   每個產業「還能順手交給 O 的工作流」——讓客戶看到「這個我也能做」。
   用關鍵字比對（與 getCaseVisual 同邏輯）：不論案例資料來自 API 或本地
   fallback、產業名稱怎麼寫，都能對到正確清單。順序由特定到通用，先命中先用。
   ──────────────────────────────────────────────────────────── */
const CASE_WORKFLOW_SETS: { re: RegExp; items: string[] }[] = [
  { re: /房地產|不動產|建設|仲介|建商/, items: [
    '看屋後 24 小時自動回訪，沒回的隔天再追一次',
    '依預算、區域、急迫度自動分級，主管先看高意向名單',
    '廣告、網路、介紹進來的名單自動分流給對的業務',
    '帶看行程與業務行事曆自動安排與提醒',
    '同區成交行情與物件比較自動整理給客戶',
    '斡旋、簽約、用印進度自動追蹤',
    '成交後貸款、過戶、交屋進度自動追蹤與提醒',
    '屋主與買方在週年、節日自動再行銷喚回',
  ] },
  { re: /電商|零售|購物|商城|網購|品牌電商/, items: [
    '棄單 1 小時內自動提醒，附常見問題與優惠',
    '依購買頻率分群，回購週期到自動推薦',
    '客服訊息自動分類、急單優先、逾時自動升級',
    '退換貨與物流異常自動通知客人和負責人',
    '高消費客戶自動標記 VIP、安排專人跟進',
    '評價與開箱自動邀請、負評自動攔截處理',
    '缺貨、補貨與熱賣品自動預警',
    '廣告名單自動分流到新客或回購流程',
  ] },
  { re: /物流|倉儲|車隊|貨運|配送|揀貨/, items: [
    '配送路線自動最佳化，貨態即時通知客戶',
    '揀貨路徑與庫位優化、缺貨提前預警',
    '車輛保養、里程、油耗到期自動提醒',
    '配送延遲或破損自動通報並開補救任務',
    '固定出貨客戶的叫貨週期自動排程',
    '司機任務派工與回報自動整理',
    '退貨與逆物流流程自動追蹤',
    '運費對帳與請款節點自動提醒',
  ] },
  { re: /汽車|保養|維修|車廠|機車/, items: [
    '保養與回廠週期到自動提醒客戶',
    '預約自動確認、爽約自動補位',
    '零件庫存與叫貨自動對齊',
    '維修進度自動通知車主',
    '估價單寄出後自動追蹤、逾期提醒',
    '保固、驗車、換季活動自動提醒',
    '老客戶定保與召回自動喚回',
    '滿意度回訪與負評自動處理',
  ] },
  { re: /製造|五金|工廠|產線|零件|機台|加工/, items: [
    '報價單寄出後自動追蹤，逾期提醒業務',
    '訂單交期、機台產能、庫存自動對齊，插單即時示警',
    '急單自動排優先並通知相關部門',
    '出貨與驗收節點自動回報給老闆',
    '客戶定期叫料週期到自動提醒回購',
    '原物料庫存與安全水位自動預警',
    '品質異常與客訴自動分流追蹤',
    '應收帳款與請款進度自動提醒',
  ] },
  { re: /餐飲|餐廳|門店|咖啡|飲料|火鍋|小吃/, items: [
    '訂位與外送訊息自動接住、確認與提醒',
    '熟客回訪與生日優惠自動發送',
    '每日營運清單（人力、備料、尖峰）自動整理',
    '負評與客訴自動分流給店長處理',
    '會員消費週期到自動喚回',
    '排班與人力缺口自動提醒調度',
    '食材庫存與叫貨自動預警',
    '各分店業績與異常自動彙整給老闆',
  ] },
  { re: /法律|法務|合約|律師|事務所/, items: [
    '合約風險點與缺漏自動標記提醒',
    '案件期限、開庭、回覆期自動倒數提醒',
    '客戶諮詢自動分類並指派律師',
    '文件版本與審核流程自動留痕',
    '收費與請款進度自動追蹤',
    '案件進度自動回報給客戶',
    '法遵與法規更新自動提醒',
    '既有客戶的續約與新需求自動跟進',
  ] },
  { re: /留存|會員|續約|訂閱|忠誠|回頭/, items: [
    '互動下降、快流失的會員自動預警',
    '續約或到期前自動提醒並附優惠',
    '依活躍度分群、分眾自動再行銷',
    '滿意度調查自動發送與彙整',
    '沉睡客戶自動喚醒活動',
    '新會員上手流程自動引導',
    '會員升等與專屬權益自動觸發',
    '推薦好友與口碑活動自動追蹤',
  ] },
  { re: /教育|補習|英語|學院|學校|課程|講師|訓練|家教/, items: [
    '學員出席與互動下降自動預警（快流失先知道）',
    '排課、教室、教師衝突自動排解',
    '續報與繳費到期自動提醒',
    '家長溝通與成績回報自動發送',
    '試聽名單自動跟進、轉正提醒',
    '作業與測驗未交自動提醒',
    '課程滿意度與口碑自動蒐集',
    '招生名單依來源自動分流跟進',
  ] },
  { re: /健康|醫療|診所|牙醫|長壽|養生|美容|美髮|沙龍|spa|健身|瘦身|醫美/i, items: [
    '預約自動提醒、爽約自動補位',
    '療程或回診週期到自動回訪',
    '術後與課後關懷自動發送',
    '療程包或會員到期自動續購提醒',
    '高價值客戶自動分級、安排專人跟進',
    '初診與諮詢名單自動跟進轉約',
    '衛教與保養內容自動定期推送',
    '滿意度與好評自動邀請、負評攔截',
  ] },
  { re: /保險|理賠|保單/, items: [
    '保單與續保到期自動提醒',
    '理賠文件審核與缺漏自動偵測',
    '理賠進度自動通知客戶',
    '客戶分級、加保時機自動提醒',
    '客訴與爭議案件自動升級處理',
    '保費繳納逾期自動提醒',
    '保單健檢與年度回訪自動排程',
    '轉介紹名單自動跟進',
  ] },
  { re: /現金|財務|會計|收款|請款|稅務|帳款/, items: [
    '應收與收款逾期自動提醒',
    '現金流預警、異常支出自動標記',
    '每月財務儀表板自動整理給老闆',
    '請款與對帳節點自動追蹤',
    '成本與毛利異常自動示警',
    '預算超支與費用異常自動通報',
    '客戶信用與付款行為自動分級',
    '稅務與申報期限自動提醒',
  ] },
  { re: /品牌|顧問|社群|內容|行銷|公關|語感/, items: [
    '內容語氣自動審核、對齊品牌調性',
    '社群留言與私訊自動分類並給回覆建議',
    '提案與交付里程碑自動追蹤回報',
    '客戶滿意與續約訊號自動偵測',
    '成效數據自動彙整成週報',
    '內容排程與多平台發佈自動管理',
    '客戶資料與專案知識自動沉澱',
    '潛在客戶名單自動分級跟進',
  ] },
  { re: /股票|投資|研究|基金|資產|證券|理財/, items: [
    '重要事件與訊息自動彙整成決策摘要',
    '投資紀律規則觸發自動提醒，不被情緒帶走',
    '持倉與風險指標異常自動示警',
    '研究資料自動整理、來源自動留痕',
    '投資組合定期回顧自動產出',
    '觀察清單與進出場條件自動監控',
    '財報與法說重點自動摘要',
    '交易紀錄與績效自動歸因分析',
  ] },
  { re: /決策|建築|設計|策略|陪跑|轉型/, items: [
    '提案、視覺與里程碑自動對齊與追蹤',
    '不確定性與風險點自動整理成決策清單',
    '關鍵決策的待辦與負責人自動派工',
    '跨部門進度自動彙整回報',
    '重大決策前自動產出正反方分析',
    '會議結論與待辦自動轉成任務',
    '利害關係人溝通與回覆自動追蹤',
    '過往決策與結果自動沉澱成知識庫',
  ] },
];

const CASE_WORKFLOW_DEFAULT: string[] = [
  '客人從各入口進來自動集中，不再漏接',
  '重要訊息逾時未回自動提醒負責人',
  '每件事自動指定負責人與回報期限',
  '老闆每天看一張清單：誰卡住、哪裡逾時',
  '報價、合約、訂單進度自動追蹤',
  '客戶分級與優先順序自動標記',
  '成交、流失、回訪自動沉澱成下次判斷資料',
  '例行回報與週報自動整理',
];

/** 依產業/公司關鍵字取得「還能順手交給 O 的工作流」清單（source-independent）。 */
export function getCaseWorkflows(caseData: Pick<CaseStudy, 'industry' | 'company'>): string[] {
  const text = `${caseData.industry || ''} ${caseData.company || ''}`;
  const hit = CASE_WORKFLOW_SETS.find((set) => set.re.test(text));
  return hit ? hit.items : CASE_WORKFLOW_DEFAULT;
}

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
    industry: '重大決策',
    company: '企業主重大決策陪跑',
    problem: '轉型、投資、合作與產品方向常常牽涉高度不確定，單靠直覺難以拆解。',
    wrongMove: '把重大決策壓成二選一，忽略情境、停止條件與風險邊界。',
    aiInsight: '真正的決策不是賭一個結果，而是把不確定拆成可觀察的訊號與可執行的下一步。',
    strategy: '建立情境樹、機率假設、風險清單、停止條件與階段驗證，讓決策更可控。',
    results: '決策討論更快收斂，風險邊界更清楚，團隊能對齊下一步。',
    duration: '2 週',
    hero_number: '+清楚',
    hero_money: '決策邊界',
    hook_question: '面對高度不確定時，先把風險變成可管理的系統。',
    metrics: [
      { label: '討論收斂', value: '+快' },
      { label: '風險邊界', value: '+清楚' },
      { label: '下一步', value: '+對齊' },
    ],
  },
];

export const featuredCases = caseStudies.filter((item) => item.featured);
export const allCases = caseStudies;
