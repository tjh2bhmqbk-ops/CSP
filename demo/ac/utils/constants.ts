import Taro from '@tarojs/taro'
import { ApprovalTask, AbnormalCounter, ApprovalStats, ACUserInfo } from './types'

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
