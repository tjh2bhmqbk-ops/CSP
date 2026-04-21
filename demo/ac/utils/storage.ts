import Taro from '@tarojs/taro'
import { DailyReport, MonthlyReport, CompetitorConfigItem } from './types'
import { STORAGE_KEY_PREFIX, COMPETITOR_CONFIG } from './constants'

const DAILY_PREFIX = STORAGE_KEY_PREFIX
const MONTHLY_PREFIX = 'csp_monthly_'
const COMPETITOR_MGMT_KEY = 'csp_competitor_config'

// ==================== 日报 ====================

/** 存储单日报表数据（异步） */
export async function saveReport(report: DailyReport): Promise<void> {
  try { await Taro.setStorage({ key: DAILY_PREFIX + report.date, data: report }) }
  catch (e) { console.error('[storage] saveReport error:', e) }
}

/** 读取单日报表数据（异步） */
export async function getReport(date: string): Promise<DailyReport | null> {
  try { const res = await Taro.getStorage({ key: DAILY_PREFIX + date }); return res.data as DailyReport }
  catch { return null }
}

/** 删除单日报表数据（异步） */
export async function deleteReport(date: string): Promise<void> {
  try { await Taro.removeStorage({ key: DAILY_PREFIX + date }) }
  catch (e) { console.error('[storage] deleteReport error:', e) }
}

/** 获取所有日报记录（异步，按日期倒序） */
export async function getAllReports(): Promise<DailyReport[]> {
  try {
    const res = await Taro.getStorageInfo()
    const keys = res.keys.filter(k => k.startsWith(DAILY_PREFIX))
    const reports: DailyReport[] = []
    for (const k of keys) {
      try { const d = await Taro.getStorage({ key: k }); reports.push(d.data as DailyReport) }
      catch { continue }
    }
    return reports.sort((a, b) => b.date.localeCompare(a.date))
  } catch (e) { console.error('[storage] getAllReports error:', e); return [] }
}

/** 同步存储日报 */
export function saveReportSync(report: DailyReport): void {
  Taro.setStorageSync(DAILY_PREFIX + report.date, report)
}

/** 同步读取日报 */
export function getReportSync(date: string): DailyReport | null {
  try { return Taro.getStorageSync(DAILY_PREFIX + date) as DailyReport | null }
  catch { return null }
}

/** 同步删除日报 */
export function deleteReportSync(date: string): void {
  try { Taro.removeStorageSync(DAILY_PREFIX + date) }
  catch (e) { console.error('[storage] deleteReportSync error:', e) }
}

/** 同步获取所有日报（按日期倒序） */
export function getAllReportsSync(): DailyReport[] {
  try {
    const info = Taro.getStorageInfoSync()
    const keys = info.keys.filter(k => k.startsWith(DAILY_PREFIX))
    const reports: DailyReport[] = []
    for (const k of keys) {
      try { reports.push(Taro.getStorageSync(k) as DailyReport) }
      catch { continue }
    }
    return reports.sort((a, b) => b.date.localeCompare(a.date))
  } catch { return [] }
}

/** 获取日报统计信息 */
export function getDailyStatsSync(): {
  total: number
  submitted: number
  approved: number
  rejected: number
  draft: number
  totalSales: number
} {
  const reports = getAllReportsSync()
  return {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
    draft: reports.filter(r => r.status === 'draft' || r.status === 'pending').length,
    totalSales: reports.reduce((s, r) => s + r.competitors.reduce((ss, c) => ss + c.sales, 0), 0),
  }
}

/** 清除所有日报数据 */
export function clearAllDailyData(): void {
  try {
    const info = Taro.getStorageInfoSync()
    const keys = info.keys.filter(k => k.startsWith(DAILY_PREFIX))
    keys.forEach(k => { try { Taro.removeStorageSync(k) } catch (_) {} })
  } catch (e) { console.error('[storage] clearAllDailyData error:', e) }
}

// ==================== 月报 ====================

/** 存储月报表（异步） */
export async function saveMonthlyReport(report: MonthlyReport): Promise<void> {
  try { await Taro.setStorage({ key: MONTHLY_PREFIX + report.month, data: report }) }
  catch (e) { console.error('[storage] saveMonthlyReport error:', e) }
}

/** 存储月报表（同步） */
export function saveMonthlyReportSync(report: MonthlyReport): void {
  Taro.setStorageSync(MONTHLY_PREFIX + report.month, report)
}

/** 读取月报表（同步） */
export function getMonthlyReportSync(month: string): MonthlyReport | null {
  try { return Taro.getStorageSync(MONTHLY_PREFIX + month) as MonthlyReport | null }
  catch { return null }
}

/** 同步删除月报 */
export function deleteMonthlyReportSync(month: string): void {
  try { Taro.removeStorageSync(MONTHLY_PREFIX + month) }
  catch (e) { console.error('[storage] deleteMonthlyReportSync error:', e) }
}

/** 获取所有月报记录（同步，按月份倒序） */
export function getMonthlyReportsSync(): MonthlyReport[] {
  try {
    const info = Taro.getStorageInfoSync()
    const keys = info.keys.filter(k => k.startsWith(MONTHLY_PREFIX))
    const reports: MonthlyReport[] = []
    for (const k of keys) {
      try { reports.push(Taro.getStorageSync(k) as MonthlyReport) }
      catch { continue }
    }
    return reports.sort((a, b) => b.month.localeCompare(a.month))
  } catch { return [] }
}

/** 获取月报统计信息 */
export function getMonthlyStatsSync(): {
  total: number
  submitted: number
  approved: number
  rejected: number
  draft: number
  totalSales: number
} {
  const reports = getMonthlyReportsSync()
  return {
    total: reports.length,
    submitted: reports.filter(r => r.status === 'submitted').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
    draft: reports.filter(r => r.status === 'draft' || r.status === 'pending').length,
    totalSales: reports.reduce((s, r) => s + r.competitors.reduce((ss, c) => ss + c.sales, 0), 0),
  }
}

/** 清除所有月报数据 */
export function clearAllMonthlyData(): void {
  try {
    const info = Taro.getStorageInfoSync()
    const keys = info.keys.filter(k => k.startsWith(MONTHLY_PREFIX))
    keys.forEach(k => { try { Taro.removeStorageSync(k) } catch (_) {} })
  } catch (e) { console.error('[storage] clearAllMonthlyData error:', e) }
}

// ==================== 竞品柜台维护 ====================

/** 获取竞品柜台配置（同步） */
export function getCompetitorConfigSync(): CompetitorConfigItem[] {
  try {
    const data = Taro.getStorageSync(COMPETITOR_MGMT_KEY)
    if (data && Array.isArray(data)) return data as CompetitorConfigItem[]
    // 首次使用，返回默认配置（全部营业中）
    return COMPETITOR_CONFIG.map(c => ({ ...c, counterStatus: 'normal' }))
  } catch {
    return COMPETITOR_CONFIG.map(c => ({ ...c, counterStatus: 'normal' }))
  }
}

/** 保存竞品柜台配置（同步） */
export function saveCompetitorConfigSync(config: CompetitorConfigItem[]): void {
  try {
    Taro.setStorageSync(COMPETITOR_MGMT_KEY, config)
  } catch (e) {
    console.error('[storage] saveCompetitorConfigSync error:', e)
  }
}

/** 获取单个品牌的柜台状态 */
export function getCompetitorCounterStatus(brand: string): 'normal' | 'renovation' | 'closed' {
  const config = getCompetitorConfigSync()
  const item = config.find(c => c.brand === brand)
  return item?.counterStatus || 'normal'
}

// ==================== 竞品柜台 Demo 数据 ====================

export interface CompetitorDemoItem {
  brand: string
  type: 'core' | 'normal'
  status: 'active' | 'renovating' | 'closed'
  location: string
  monthlySales: number
}

export interface CompetitorDemoData {
  competitors: CompetitorDemoItem[]
  lastUpdated: string
}

const COMPETITOR_DEMO_KEY = 'csp_competitor_demo'

/** 获取竞品柜台Demo数据（同步） */
export function getCompetitorDemoSync(): CompetitorDemoItem[] {
  try {
    const data = Taro.getStorageSync(COMPETITOR_DEMO_KEY) as CompetitorDemoData | undefined
    if (data && data.competitors) return data.competitors
    return []
  } catch {
    return []
  }
}

/** 保存竞品柜台Demo数据（同步） */
export function saveCompetitorDemoSync(data: CompetitorDemoItem[]): void {
  try {
    Taro.setStorageSync(COMPETITOR_DEMO_KEY, {
      competitors: data,
      lastUpdated: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[storage] saveCompetitorDemoSync error:', e)
  }
}
