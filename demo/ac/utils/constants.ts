import Taro from '@tarojs/taro'
import { ApprovalTask, AbnormalCounter, ApprovalStats, ACUserInfo, CompetitorConfigItem, CounterStatus } from './types'

/** 审核状态配置 */
export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  pending: { label: '待审核', color: '#FAAD14', bgColor: '#FFF7E6' },
  approved: { label: '已通过', color: '#52C41A', bgColor: '#F6FFED' },
  rejected: { label: '已驳回', color: '#F5222D', bgColor: '#FFF2F0' },
  submitted: { label: '已提交', color: '#1E3A5F', bgColor: '#EBF5FF' },
  draft: { label: '草稿', color: '#999999', bgColor: '#F5F5F5' },
}

/** AC端Storage键前缀 */
export const AC_STORAGE_KEY_PREFIX = 'csp_ac_'

/** 审批任务存储键 */
export const APPROVAL_TASKS_KEY = 'csp_ac_approval_tasks'

/** 异常柜台存储键 */
export const ABNORMAL_COUNTERS_KEY = 'csp_ac_abnormal_counters'

/** 审批统计存储键 */
export const APPROVAL_STATS_KEY = 'csp_ac_approval_stats'

/** 格式化金额 */
export function formatMoney(amount: number): string {
  if (!amount || amount === 0) return '-'
  return amount.toLocaleString('zh-CN')
}

/** 格式化日期为中文显示 */
export function formatDateToCN(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

/** 格式化月份显示 */
export function formatMonthDisplay(monthStr: string): string {
  const [year, month] = monthStr.split('-')
  return `${year}年${parseInt(month)}月`
}

/** 获取当前月份字符串 YYYY-MM */
export function getCurrentMonthStr(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

/** 获取过去第N月的月份字符串 */
export function getPastMonthStr(monthsAgo: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - monthsAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// ==================== Demo数据生成 ====================

let _acDemoInitialized = false

/** 生成AC端Demo数据 */
export function generateACDemoData(): void {
  if (_acDemoInitialized) return
  _acDemoInitialized = true

  try {
    // 生成审批任务Demo数据
    generateDemoApprovalTasks()
    // 生成异常柜台Demo数据
    generateDemoAbnormalCounters()
    // 生成审批统计
    generateDemoApprovalStats()

    console.log('[AC Demo] All demo data generated')
  } catch (e) {
    console.error('[AC Demo] Failed to generate demo data:', e)
  }
}

/** 生成审批任务Demo数据 */
function generateDemoApprovalTasks(): void {
  const tasks: ApprovalTask[] = [
    {
      id: 'task-001',
      month: getPastMonthStr(1),
      counterName: '雅诗兰黛·杭州万象城FSS',
      submitterName: '米晓妮',
      submitterRole: 'BA',
      submitTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: 'pending',
      monthlyReport: {
        month: getPastMonthStr(1),
        status: 'submitted',
        submitTime: new Date(Date.now() - 86400000 * 2).toISOString(),
        remark: '本月整体业绩平稳，LV表现最佳',
        competitors: [
          { brand: 'Dior', type: 'core', counterStatus: 'normal', sales: 358000, traffic: 0, bigOrders: 0 },
          { brand: 'LV', type: 'core', counterStatus: 'normal', sales: 523000, traffic: 0, bigOrders: 0 },
          { brand: 'Gucci', type: 'normal', counterStatus: 'normal', sales: 286000, traffic: 0, bigOrders: 0 },
          { brand: 'Hermès', type: 'core', counterStatus: 'normal', sales: 412000, traffic: 0, bigOrders: 0 },
        ],
      },
    },
    {
      id: 'task-002',
      month: getPastMonthStr(1),
      counterName: '雅诗兰黛·杭州西湖银泰FSS',
      submitterName: '王小红',
      submitterRole: 'BA',
      submitTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      status: 'pending',
      monthlyReport: {
        month: getPastMonthStr(1),
        status: 'submitted',
        submitTime: new Date(Date.now() - 86400000 * 3).toISOString(),
        remark: '',
        competitors: [
          { brand: 'Dior', type: 'core', counterStatus: 'normal', sales: 298000, traffic: 0, bigOrders: 0 },
          { brand: 'LV', type: 'core', counterStatus: 'normal', sales: 456000, traffic: 0, bigOrders: 0 },
          { brand: 'Gucci', type: 'normal', counterStatus: 'renovation', sales: 0, traffic: 0, bigOrders: 0 },
        ],
      },
    },
    {
      id: 'task-003',
      month: getPastMonthStr(2),
      counterName: '雅诗兰黛·杭州万象城FSS',
      submitterName: '米晓妮',
      submitterRole: 'BA',
      submitTime: new Date(Date.now() - 86400000 * 35).toISOString(),
      status: 'approved',
      monthlyReport: {
        month: getPastMonthStr(2),
        status: 'approved',
        submitTime: new Date(Date.now() - 86400000 * 35).toISOString(),
        remark: 'Q1季度总结：各品牌均达标',
        competitors: [
          { brand: 'Dior', type: 'core', counterStatus: 'normal', sales: 412000, traffic: 0, bigOrders: 0 },
          { brand: 'LV', type: 'core', counterStatus: 'normal', sales: 680000, traffic: 0, bigOrders: 0 },
          { brand: 'Gucci', type: 'normal', counterStatus: 'normal', sales: 380000, traffic: 0, bigOrders: 0 },
          { brand: 'Hermès', type: 'core', counterStatus: 'normal', sales: 450000, traffic: 0, bigOrders: 0 },
        ],
      },
    },
    {
      id: 'task-004',
      month: getPastMonthStr(2),
      counterName: '雅诗兰黛·杭州西湖银泰FSS',
      submitterName: '王小红',
      submitterRole: 'BA',
      submitTime: new Date(Date.now() - 86400000 * 38).toISOString(),
      status: 'rejected',
      monthlyReport: {
        month: getPastMonthStr(2),
        status: 'rejected',
        submitTime: new Date(Date.now() - 86400000 * 38).toISOString(),
        remark: '',
        rejectReason: 'Gucci品牌数据缺失，请补充完整后重新提交',
        competitors: [
          { brand: 'Dior', type: 'core', counterStatus: 'normal', sales: 312000, traffic: 0, bigOrders: 0 },
          { brand: 'LV', type: 'core', counterStatus: 'normal', sales: 398000, traffic: 0, bigOrders: 0 },
        ],
      },
    },
  ]

  Taro.setStorageSync(APPROVAL_TASKS_KEY, tasks)
  console.log(`[AC Demo] Approval tasks: ${tasks.length} items generated`)
}

/** 生成异常柜台Demo数据 */
function generateDemoAbnormalCounters(): void {
  const counters: AbnormalCounter[] = [
    {
      id: 'abn-001',
      counterName: '雅诗兰黛·杭州大厦FSS',
      baName: '李小芳',
      baCode: 'BA-003',
      abnormalType: 'not_submitted',
      month: getPastMonthStr(1),
      alertTime: new Date(Date.now() - 86400000 * 5).toISOString(),
      detail: '超过上报截止日期5天仍未提交月报',
    },
    {
      id: 'abn-002',
      counterName: '雅诗兰黛·杭州湖滨银泰FSS',
      baName: '张小丽',
      baCode: 'BA-004',
      abnormalType: 'data_error',
      month: getPastMonthStr(1),
      alertTime: new Date(Date.now() - 86400000 * 2).toISOString(),
      detail: 'Dior品牌销售额环比波动超过50%，请核实',
    },
    {
      id: 'abn-003',
      counterName: '雅诗兰黛·杭州城西银泰FSS',
      baName: '陈小燕',
      baCode: 'BA-005',
      abnormalType: 'not_submitted',
      month: getPastMonthStr(1),
      alertTime: new Date(Date.now() - 86400000 * 3).toISOString(),
      detail: '超过上报截止日期3天仍未提交月报',
    },
  ]

  Taro.setStorageSync(ABNORMAL_COUNTERS_KEY, counters)
  console.log(`[AC Demo] Abnormal counters: ${counters.length} items generated`)
}

/** 生成审批统计 */
function generateDemoApprovalStats(): void {
  const stats: ApprovalStats = {
    pendingCount: 2,
    approvedCount: 8,
    rejectedCount: 1,
    abnormalCount: 3,
  }

  Taro.setStorageSync(APPROVAL_STATS_KEY, stats)
}

/** 获取Demo AC用户信息 */
export function getACUserInfo(): ACUserInfo {
  return {
    name: '张主管',
    role: 'Area Coordinator',
    region: '浙江省杭州市',
    employeeCode: 'AC-001',
    avatar: '/images/avatar.png',
  }
}

// ==================== BA端常量与工具 ====================

/** 监控竞品品牌列表配置 */
export const COMPETITOR_CONFIG: CompetitorConfigItem[] = [
  { brand: 'Dior', type: 'core', counterStatus: 'normal' },
  { brand: 'LV', type: 'core', counterStatus: 'normal' },
  { brand: 'Gucci', type: 'normal', counterStatus: 'normal' },
  { brand: 'Hermès', type: 'core', counterStatus: 'normal' },
]

/** 柜台状态选项 */
export const COUNTER_STATUS_OPTIONS: { label: string; value: CounterStatus }[] = [
  { label: '营业中', value: 'normal' },
  { label: '装修中', value: 'renovation' },
  { label: '撤柜', value: 'closed' },
]

/** Storage 键前缀 */
export const STORAGE_KEY_PREFIX = 'csp_daily_'

/** 竞品柜台维护存储键 */
export const COMPETITOR_MGMT_STORAGE_KEY = 'csp_competitor_config'

/** 竞品柜台 Demo 数据存储键 */
export const COMPETITOR_DEMO_STORAGE_KEY = 'csp_competitor_demo'

/** 草稿保存间隔 (ms) */
export const DRAFT_SAVE_INTERVAL = 3000

/** 月报上报时间配置 */
export const MONTHLY_REPORT_WINDOW = { startDay: 1, endDay: 5 }

/** 获取月报上报时间提示文案 */
export function getMonthlyReportHint(): string {
  return `每月${MONTHLY_REPORT_WINDOW.startDay}-${MONTHLY_REPORT_WINDOW.endDay}日可上报上月数据`
}

/** 默认竞品数据工厂 */
export function createDefaultCompetitor(brand: string, type: 'core' | 'normal') {
  return { brand, type, counterStatus: 'normal' as CounterStatus, sales: 0, traffic: 0, bigOrders: 0 }
}

/** 获取今天的日期字符串 YYYY-MM-DD */
export function getTodayStr(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 获取过去第N天的日期字符串 */
export function getPastDateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ==================== BA端 Demo 数据生成 ====================

let _dailyDemoInitialized = false
let _monthlyDemoInitialized = false
let _competitorDemoInitialized = false

/** 生成近14天模拟日报数据 */
export function generateDemoDailyReports(): void {
  if (_dailyDemoInitialized) return
  _dailyDemoInitialized = true
  const brands = ['Dior', 'LV', 'Gucci', 'Hermès']
  const types: ('core' | 'normal')[] = ['core', 'core', 'normal', 'core']
  const baseSales = [35800, 42300, 28600, 51200]
  let successCount = 0
  for (let i = 14; i > 0; i--) {
    const date = getPastDateStr(i)
    const competitors = brands.map((b, idx) => {
      const variance = 0.7 + Math.abs(Math.sin(i * idx + date.charCodeAt(0))) * 0.6
      return { brand: b, type: types[idx], counterStatus: 'normal' as const, sales: Math.floor(baseSales[idx] * variance), traffic: 0, bigOrders: 0 }
    })
    let status: 'submitted' | 'approved' | 'draft'
    if (i <= 3) status = 'submitted'
    else if (i <= 8) status = 'approved'
    else status = 'draft'
    try {
      Taro.setStorageSync(`csp_daily_${date}`, { date, status, submitTime: new Date(date + 'T10:' + String(30 + i).padStart(2, '0') + ':00').toISOString(), remark: '', competitors })
      successCount++
    } catch (e) { console.error(`[Demo] Failed to write daily ${date}:`, e) }
  }
  console.log(`[Demo] Daily reports: ${successCount}/14 written`)
}

/** 生成近6个月模拟月报数据 */
export function generateDemoMonthlyReports(): void {
  if (_monthlyDemoInitialized) return
  _monthlyDemoInitialized = true
  const now = new Date()
  const brands = ['Dior', 'LV', 'Gucci', 'Hermès']
  const types: ('core' | 'normal')[] = ['core', 'core', 'normal', 'core']
  const monthBaseSales = [520000, 680000, 380000, 450000]
  let successCount = 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const competitors = brands.map((b, idx) => {
      const variance = 0.75 + Math.sin(i * idx * 0.5) * 0.4
      return { brand: b, type: types[idx], counterStatus: 'normal' as const, sales: Math.floor(monthBaseSales[idx] * variance), traffic: 0, bigOrders: 0 }
    })
    let status: 'submitted' | 'approved' | 'draft'
    if (i === 0) status = 'draft'
    else if (i === 1) status = 'submitted'
    else status = 'approved'
    try {
      Taro.setStorageSync(`csp_monthly_${month}`, { month, status, submitTime: new Date(d.getFullYear(), d.getMonth(), 15, 11, 0, 0).toISOString(), remark: '', competitors })
      successCount++
    } catch (e) { console.error(`[Demo] Failed to write monthly ${month}:`, e) }
  }
  console.log(`[Demo] Monthly reports: ${successCount}/6 written`)
}

/** 生成竞品柜台 Demo 数据 */
export function generateDemoCompetitorData(): void {
  if (_competitorDemoInitialized) return
  _competitorDemoInitialized = true
  const demoCompetitors = [
    { brand: 'Dior', type: 'core' as const, status: 'active' as const, location: '杭州万象城 1F-A108', monthlySales: 358000 },
    { brand: 'LV', type: 'core' as const, status: 'active' as const, location: '杭州万象城 1F-A112', monthlySales: 423000 },
    { brand: 'Gucci', type: 'normal' as const, status: 'active' as const, location: '杭州万象城 1F-B205', monthlySales: 286000 },
    { brand: 'Hermès', type: 'core' as const, status: 'active' as const, location: '杭州万象城 1F-A120', monthlySales: 512000 },
    { brand: 'Chanel', type: 'core' as const, status: 'renovating' as const, location: '杭州万象城 1F-A115', monthlySales: 0 },
    { brand: 'Prada', type: 'normal' as const, status: 'closed' as const, location: '杭州万象城 2F-C301', monthlySales: 0 },
    { brand: 'Burberry', type: 'normal' as const, status: 'active' as const, location: '杭州万象城 1F-B208', monthlySales: 198000 },
    { brand: 'Cartier', type: 'normal' as const, status: 'active' as const, location: '杭州万象城 1F-A105', monthlySales: 267000 },
  ]
  try {
    Taro.setStorageSync(COMPETITOR_DEMO_STORAGE_KEY, { competitors: demoCompetitors, lastUpdated: new Date().toISOString() })
    console.log(`[Demo] Competitor data: ${demoCompetitors.length} items written`)
  } catch (e) { console.error('[Demo] Failed to write competitor demo data:', e) }
}
