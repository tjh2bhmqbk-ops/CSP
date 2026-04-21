import Taro from '@tarojs/taro'
import { CompetitorConfigItem, CounterStatus } from './types'

/**
 * 监控竞品品牌列表配置
 * 后续可从接口动态获取
 */
export const COMPETITOR_CONFIG: CompetitorConfigItem[] = [
  { brand: 'Dior', type: 'core' },
  { brand: 'LV', type: 'core' },
  { brand: 'Gucci', type: 'normal' },
  { brand: 'Hermès', type: 'core' },
]

/** 柜台状态选项 */
export const COUNTER_STATUS_OPTIONS: { label: string; value: CounterStatus }[] = [
  { label: '营业中', value: 'normal' },
  { label: '装修中', value: 'renovation' },
  { label: '撤柜', value: 'closed' },
]

/** 审核状态配置 */
export const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string }> = {
  submitted: { label: '已提交', color: '#1E3A5F', bgColor: '#EBF5FF' },
  draft: { label: '草稿', color: '#999999', bgColor: '#F5F5F5' },
  approved: { label: '已通过', color: '#52C41A', bgColor: '#F6FFED' },
  rejected: { label: '已驳回', color: '#F5222D', bgColor: '#FFF2F0' },
}

// ==================== 防重复初始化标志位 ====================
// 模块级单例：确保 Demo 数据在全局范围内只生成一次
let _dailyDemoInitialized = false
let _monthlyDemoInitialized = false
// ==================== 防重复初始化标志位 ====================

/** Storage 键前缀 */
export const STORAGE_KEY_PREFIX = 'csp_daily_'

/** 竞品柜台维护存储键 */
export const COMPETITOR_MGMT_STORAGE_KEY = 'csp_competitor_config'

/** 竞品柜台 Demo 数据存储键 */
export const COMPETITOR_DEMO_STORAGE_KEY = 'csp_competitor_demo'

/** 草稿保存间隔 (ms) */
export const DRAFT_SAVE_INTERVAL = 3000

/** 月报上报时间配置：每月1-5日可上报上月数据 */
export const MONTHLY_REPORT_WINDOW = {
  startDay: 1,   // 每月1日开始
  endDay: 5,     // 每月5日截止
}

/** 获取月报上报时间提示文案 */
export function getMonthlyReportHint(): string {
  return `每月${MONTHLY_REPORT_WINDOW.startDay}-${MONTHLY_REPORT_WINDOW.endDay}日可上报上月数据`
}

/** 默认竞品数据工厂 */
export function createDefaultCompetitor(brand: string, type: 'core' | 'normal') {
  return {
    brand,
    type,
    counterStatus: 'normal' as CounterStatus,
    sales: 0,
    traffic: 0,
    bigOrders: 0,
  }
}

/** 格式化日期为中文显示 */
export function formatDateToCN(dateStr: string): string {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  return `${year}年${month}月${day}日`
}

/** 获取今天的日期字符串 YYYY-MM-DD */
export function getTodayStr(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 格式化金额 */
export function formatMoney(amount: number): string {
  if (!amount || amount === 0) return '-'
  return amount.toLocaleString('zh-CN')
}

/** 获取过去第N天的日期字符串 */
export function getPastDateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * 生成 Demo 数据 — 近14天模拟日报数据（含完整销售额）
 * 【防重复机制】通过模块级标志位 _dailyDemoInitialized 确保全局只执行一次
 */
export function generateDemoDailyReports(): void {
  // 防重复：已初始化则直接返回
  if (_dailyDemoInitialized) {
    return
  }
  _dailyDemoInitialized = true

  try {
    const brands = ['Dior', 'LV', 'Gucci', 'Hermès']
    const types: ('core' | 'normal')[] = ['core', 'core', 'normal', 'core']
    const baseSales = [35800, 42300, 28600, 51200]
    let successCount = 0

    for (let i = 14; i > 0; i--) {
      const date = getPastDateStr(i)

      const competitors = brands.map((b, idx) => {
        const variance = 0.7 + Math.abs(Math.sin(i * idx + date.charCodeAt(0))) * 0.6
        const sales = Math.floor(baseSales[idx] * variance)
        return { brand: b, type: types[idx], counterStatus: 'normal' as const, sales, traffic: 0, bigOrders: 0 }
      })

      // 状态分布：最近3天=submitted, 中间几天=approved, 更早=draft, 今天=draft
      let status: 'submitted' | 'approved' | 'draft'
      if (i === 0) {
        status = 'draft'
      } else if (i <= 3) {
        status = 'submitted'
      } else if (i <= 8) {
        status = 'approved'
      } else {
        status = 'draft'
      }

      const remarks: Record<number, string> = {
        3: '周末客流量较大，Dior销售表现突出',
        6: 'Gucci有促销活动，客流明显增加',
        10: 'Hermès柜台装修完毕，恢复正常营业',
        13: '月初第一天，整体表现稳定',
      }

      try {
        Taro.setStorageSync(`csp_daily_${date}`, {
          date, status,
          submitTime: new Date(date + 'T10:' + String(30 + i).padStart(2, '0') + ':00').toISOString(),
          remark: remarks[i] || '',
          competitors,
        })
        successCount++
      } catch (e) {
        console.error(`[Demo] Failed to write daily ${date}:`, e)
      }
    }

    console.log(`[Demo] Daily reports: ${successCount}/14 written`)
  } catch (e) {
    console.error('[Demo] generateDemoDailyReports fatal error:', e)
  }
}

/**
 * 生成 Demo 月报数据 — 近6个月
 * 【防重复机制】通过模块级标志位 _monthlyDemoInitialized 确保全局只执行一次
 */
export function generateDemoMonthlyReports(): void {
  // 防重复：已初始化则直接返回
  if (_monthlyDemoInitialized) {
    return
  }
  _monthlyDemoInitialized = true

  try {
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
        const sales = Math.floor(monthBaseSales[idx] * variance)
        return { brand: b, type: types[idx], counterStatus: 'normal' as const, sales, traffic: 0, bigOrders: 0 }
      })

      // 状态分布：本月=draft, 上月=submitted, 更早=approved
      let status: 'submitted' | 'approved' | 'draft'
      if (i === 0) {
        status = 'draft'
      } else if (i === 1) {
        status = 'submitted'
      } else {
        status = 'approved'
      }

      const monthRemarks: Record<number, string> = {
        1: '本月整体业绩平稳，LV表现最佳',
        3: 'Q1季度总结：各品牌均达标',
        4: '年底促销季影响，整体业绩较好',
      }

      try {
        Taro.setStorageSync(`csp_monthly_${month}`, {
          month, status,
          submitTime: new Date(d.getFullYear(), d.getMonth(), 15, 11, 0, 0).toISOString(),
          remark: monthRemarks[i] || '',
          competitors,
        })
        successCount++
      } catch (e) {
        console.error(`[Demo] Failed to write monthly ${month}:`, e)
      }
    }

    console.log(`[Demo] Monthly reports: ${successCount}/6 written`)
  } catch (e) {
    console.error('[Demo] generateDemoMonthlyReports fatal error:', e)
  }
}

/**
 * 生成竞品柜台 Demo 数据
 * 【防重复机制】通过模块级标志位确保只执行一次
 */
let _competitorDemoInitialized = false

export function generateDemoCompetitorData(): void {
  if (_competitorDemoInitialized) {
    return
  }
  _competitorDemoInitialized = true

  try {
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
      Taro.setStorageSync(COMPETITOR_DEMO_STORAGE_KEY, {
        competitors: demoCompetitors,
        lastUpdated: new Date().toISOString(),
      })
      console.log(`[Demo] Competitor data: ${demoCompetitors.length} items written`)
    } catch (e) {
      console.error('[Demo] Failed to write competitor demo data:', e)
    }
  } catch (e) {
    console.error('[Demo] generateDemoCompetitorData fatal error:', e)
  }
}
