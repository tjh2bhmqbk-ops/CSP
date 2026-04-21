/**
 * CSP 每日上报系统 TypeScript 类型定义
 */

/** 柜台状态 */
export type CounterStatus = 'normal' | 'renovation' | 'closed'
/** 审核状态 */
export type ReportStatus = 'pending' | 'approved' | 'rejected' | 'submitted' | 'draft'
/** 竞品类型 */
export type CompetitorType = 'core' | 'normal'

/** 单个竞品数据 */
export interface CompetitorData {
  brand: string
  type: CompetitorType
  counterStatus: CounterStatus
  sales: number
  traffic: number
  bigOrders: number
}

/** 单日上报记录 */
export interface DailyReport {
  date: string
  status: ReportStatus
  submitTime: string
  remark: string
  competitors: CompetitorData[]
  rejectReason?: string
}

/** 每月上报记录 */
export interface MonthlyReport {
  month: string // 格式 "2026-04"
  status: ReportStatus
  submitTime: string
  remark: string
  competitors: CompetitorData[]
  rejectReason?: string
}

/** 表单状态 */
export interface FormState {
  date: string
  remark: string
  competitors: CompetitorData[]
}

/** 筛选条件 */
export interface FilterCondition {
  status?: ReportStatus | 'all'
  month?: string // 格式 "2026-04"
}

/** 竞品配置项（含柜台状态） */
export interface CompetitorConfigItem {
  brand: string
  type: CompetitorType
  counterStatus: CounterStatus
}
