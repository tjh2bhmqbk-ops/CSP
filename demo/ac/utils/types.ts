/**
 * CSP AC端 TypeScript 类型定义
 * 复用BA端类型并扩展AC端专用类型
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

/** 每月上报记录 */
export interface MonthlyReport {
  month: string // 格式 "2026-04"
  status: ReportStatus
  submitTime: string
  remark: string
  competitors: CompetitorData[]
  rejectReason?: string
}

// ==================== AC端专用类型 ====================

/** 审批任务 */
export interface ApprovalTask {
  id: string
  month: string
  counterName: string
  submitterName: string
  submitterRole: string
  submitTime: string
  status: 'pending' | 'approved' | 'rejected'
  monthlyReport: MonthlyReport
  rejectReason?: string
}

/** 异常柜台 */
export interface AbnormalCounter {
  id: string
  counterName: string
  baName: string
  baCode: string
  abnormalType: 'not_submitted' | 'data_error'
  month?: string
  alertTime: string
  detail?: string
}

/** 审批统计 */
export interface ApprovalStats {
  pendingCount: number
  approvedCount: number
  rejectedCount: number
  abnormalCount: number
}

/** AC用户信息 */
export interface ACUserInfo {
  name: string
  role: string
  region: string
  avatar?: string
  employeeCode: string
}

/** 数据报表筛选条件 */
export interface ReportFilter {
  type: 'daily' | 'monthly'
  startDate?: string
  endDate?: string
  brands?: string[]
  status?: ReportStatus | 'all'
}
