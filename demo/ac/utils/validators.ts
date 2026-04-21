import { CompetitorData } from './types'

/** 校验结果 */
export interface ValidateResult {
  valid: boolean
  message?: string
}

/**
 * 校验销售额输入值
 */
export function validateSales(value: string | number): ValidateResult {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return { valid: false, message: '请输入有效数字' }
  if (num < 0) return { valid: false, message: '金额不能为负数' }
  if (num > 999999999) return { valid: false, message: '金额超出范围' }
  return { valid: true }
}

/**
 * 校验客流量输入值
 */
export function validateTraffic(value: string | number): ValidateResult {
  const num = typeof value === 'string' ? parseInt(value) : value
  if (isNaN(num)) return { valid: false, message: '请输入有效数字' }
  if (num < 0) return { valid: false, message: '数量不能为负数' }
  return { valid: true }
}

/**
 * 校验大单数输入值
 */
export function validateBigOrders(value: string | number): ValidateResult {
  return validateTraffic(value)
}

/**
 * 校验整张表单
 * 规则：
 * - 至少有一个营业中的竞品填写了销售额
 * - 所有营业中竞品的销售额必须 > 0（或用户明确填了值）
 */
export function validateForm(competitors: CompetitorData[]): ValidateResult {
  const normalCount = competitors.filter((c) => c.counterStatus === 'normal').length

  if (normalCount === 0) {
    return { valid: false, message: '至少需要有一个营业中的竞品柜台' }
  }

  const filledCount = competitors.filter(
    (c) => c.counterStatus === 'normal' && c.sales > 0
  ).length

  if (filledCount === 0) {
    return { valid: false, message: '请至少填写一个营业中竞品的销售额' }
  }

  return { valid: true }
}
